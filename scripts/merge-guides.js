#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { c } = require('./colors');

// ==================== 配置 ====================
const TASK_ID = process.argv[2];
if (!TASK_ID) {
  console.error(c.error('❌ 错误:'), '缺少任务ID参数');
  console.error(c.gray('用法:'), 'node merge-guides.js <taskId>');
  process.exit(1);
}

const ROOT_DIR = path.join(__dirname, '..');
const GUIDES_DIR = path.join(ROOT_DIR, 'docs/zh/guides');
const OUTPUT_DIR = path.join(ROOT_DIR, 'dist/pdf', TASK_ID);
const SKIPPED_FILES_LOG = path.join(OUTPUT_DIR, '1-1-skipped-files.json');
const MDX_PROCESSED_LOG = path.join(OUTPUT_DIR, '1-2-mdx-processed.json');
const RELATIVE_LINKS_LOG = path.join(OUTPUT_DIR, '1-3-relative-links.json');
const RELATIVE_IMAGES_LOG = path.join(OUTPUT_DIR, '1-4-relative-images.json');
const MISSING_META_LOG = path.join(OUTPUT_DIR, '1-5-missing-meta.json');
const OUTPUT_FILE = path.join(OUTPUT_DIR, '1-6-merged.md');

// ==================== 日志记录 ====================
const skippedFiles = [];
const mdxProcessed = [];
const relativeLinksProcessed = [];
const relativeImagesProcessed = [];
const missingMetaFiles = []; // 记录缺失的 _meta.json 文件
const processedInMeta = new Set(); // 记录在 meta 中处理过的文件
const stats = {
  totalFiles: 0,
  mdxFiles: 0,
  skippedCount: 0,
  relativeLinks: 0,
  relativeImages: 0,
};

// ==================== 主函数 ====================
function main() {
  // 确保输出目录存在
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // 读取 header.md 作为文档开头
  const headerPath = path.join(__dirname, 'header.md');
  let output = '';
  if (fs.existsSync(headerPath)) {
    output = fs.readFileSync(headerPath, 'utf-8');
    
    // 替换日期占位符
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateString = `${year}.${month}.${day}`;
    output = output.replace(/\{\{GENERATION_DATE\}\}/g, dateString);
    
    output += '\n\n';
  } else {
    // 如果 header.md 不存在，使用默认HTML标题
    console.warn(`  ${c.warning('⚠️  警告:')} 未找到 ${c.path('scripts/header.md')}，使用默认标题`);
    const now = new Date();
    const dateString = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
    output = `<br>\n<br>\n<br>\n\n<div align="center">\n  <h1 style="font-size: 3em;">灵矶使用指南</h1>\n  <p style="font-size: 1.2em; color: #999;">${dateString}</p>\n</div>\n\n<br>\n<br>\n<br>\n\n---\n\n`;
  }

  // 处理 guides 目录（从 depth = 0 开始，标题层级整体向上）
  output += processDirectory(GUIDES_DIR, 0);

  // 扫描所有未在 meta 中的文件
  scanUnprocessedFiles(GUIDES_DIR);

  // 先保存日志
  fs.writeFileSync(SKIPPED_FILES_LOG, JSON.stringify(skippedFiles, null, 2), 'utf-8');
  fs.writeFileSync(MDX_PROCESSED_LOG, JSON.stringify(mdxProcessed, null, 2), 'utf-8');
  fs.writeFileSync(RELATIVE_LINKS_LOG, JSON.stringify(relativeLinksProcessed, null, 2), 'utf-8');
  fs.writeFileSync(RELATIVE_IMAGES_LOG, JSON.stringify(relativeImagesProcessed, null, 2), 'utf-8');
  fs.writeFileSync(MISSING_META_LOG, JSON.stringify(missingMetaFiles, null, 2), 'utf-8');
  
  // 最后保存处理后的文档
  fs.writeFileSync(OUTPUT_FILE, output, 'utf-8');

  // 输出统计
  console.log(`  ${c.success('✓')} 处理 ${c.number(stats.totalFiles)} 个文件`);
  
  if (stats.mdxFiles > 0) {
    console.log(`  ${c.success('✓')} 处理 ${c.number(stats.mdxFiles)} 个 MDX 文件 ${c.dim('→ 详见')} ${c.path(path.relative(ROOT_DIR, MDX_PROCESSED_LOG))}`);
  }
  
  if (stats.skippedCount > 0) {
    console.log(`  ${c.warning('⚠️')}  跳过 ${c.number(stats.skippedCount)} 个文件 ${c.dim('→ 详见')} ${c.path(path.relative(ROOT_DIR, SKIPPED_FILES_LOG))}`);
  }
  
  if (stats.relativeLinks > 0) {
    console.log(`  ${c.success('✓')} 转换 ${c.number(stats.relativeLinks)} 个相对路径链接 ${c.dim('→ 详见')} ${c.path(path.relative(ROOT_DIR, RELATIVE_LINKS_LOG))}`);
  }
  
  if (stats.relativeImages > 0) {
    console.log(`  ${c.success('✓')} 转换 ${c.number(stats.relativeImages)} 个相对路径图片 ${c.dim('→ 详见')} ${c.path(path.relative(ROOT_DIR, RELATIVE_IMAGES_LOG))}`);
  }
  
  // 显示缺失的 _meta.json 警告
  if (missingMetaFiles.length > 0) {
    console.log(`  ${c.warning('⚠️')}  缺失 _meta.json: ${c.number(missingMetaFiles.length)} 个 ${c.dim('→ 详见')} ${c.path(path.relative(ROOT_DIR, MISSING_META_LOG))}`);
    const displayCount = Math.min(5, missingMetaFiles.length);
    for (let i = 0; i < displayCount; i++) {
      console.log(`     ${c.dim('- ' + missingMetaFiles[i])}`);
    }
    if (missingMetaFiles.length > displayCount) {
      console.log(`     ${c.dim('... 以及 ' + (missingMetaFiles.length - displayCount) + ' 个其他文件')}`);
    }
  }
  
  const fileSizeMB = (fs.statSync(OUTPUT_FILE).size / 1024 / 1024).toFixed(1);
  console.log(`  ${c.success('✓')} 输出: ${c.path(path.relative(ROOT_DIR, OUTPUT_FILE))} ${c.dim('(' + fileSizeMB + ' MB)')}`);
}

// ==================== 处理目录 ====================
function processDirectory(dirPath, depth) {
  let result = '';

  // 读取 _meta.json
  const metaPath = path.join(dirPath, '_meta.json');
  if (!fs.existsSync(metaPath)) {
    // 记录缺失的 _meta.json 文件
    missingMetaFiles.push(path.relative(ROOT_DIR, metaPath));
    return result;
  }

  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));

  // 按 meta 中的顺序处理每一项
  for (const item of meta) {
    if (typeof item === 'object' && item.type === 'dir') {
      // ========== 对象 → 目录 ==========
      // 添加目录标题：depth从0开始，第一级目录是H1（提一级）
      const dirTitle = '#'.repeat(depth + 1) + ' ' + item.label;
      result += dirTitle + '\n\n';

      // 递归处理子目录
      const subDirPath = path.join(dirPath, item.name);
      result += processDirectory(subDirPath, depth + 1);

    } else if (typeof item === 'string') {
      // ========== 字符串 → 文件 ==========
      const filePath = findFile(dirPath, item);
      
      if (!filePath) {
        skippedFiles.push({
          reason: 'file_not_found',
          name: item,
          directory: path.relative(ROOT_DIR, dirPath),
        });
        stats.skippedCount++;
        continue;
      }

      // 记录已处理的文件
      processedInMeta.add(path.relative(GUIDES_DIR, filePath));

      // 检查是否是备份文件
      if (filePath.endsWith('.bak')) {
        skippedFiles.push({
          reason: 'backup_file',
          path: path.relative(ROOT_DIR, filePath),
        });
        stats.skippedCount++;
        continue;
      }

      stats.totalFiles++;

      // 读取文件内容
      let content = fs.readFileSync(filePath, 'utf-8');

      // 处理 MDX 文件
      if (filePath.endsWith('.mdx')) {
        stats.mdxFiles++;
        content = processMDX(content, filePath);
      }

      // 调整标题层级
      content = adjustHeadings(content, depth);

      // 处理相对路径（链接和图片）
      content = processRelativePaths(content, dirPath, filePath);

      result += content + '\n\n';
    }
  }

  return result;
}

// ==================== 查找文件 ====================
function findFile(dirPath, fileName) {
  // 尝试 .md
  const mdPath = path.join(dirPath, fileName + '.md');
  if (fs.existsSync(mdPath)) {
    return mdPath;
  }

  // 尝试 .mdx
  const mdxPath = path.join(dirPath, fileName + '.mdx');
  if (fs.existsSync(mdxPath)) {
    return mdxPath;
  }

  return null;
}

// ==================== 处理 MDX ====================
function processMDX(content, filePath) {
  const original = content;

  // 删除 import 语句
  content = content.replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, '');

  // 删除 JSX 组件（简单处理：<Component ...> 或 <Component />）
  content = content.replace(/<[A-Z][a-zA-Z0-9]*[^>]*\/>/g, '');
  content = content.replace(/<[A-Z][a-zA-Z0-9]*[^>]*>[\s\S]*?<\/[A-Z][a-zA-Z0-9]*>/g, '');

  // 提取标题
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : '';
  
  // 检查除了标题和空白外是否还有实质内容
  const contentWithoutTitle = content.replace(/^#\s+.+$/m, '').trim();
  const hasSubstantialContent = contentWithoutTitle.length > 50; // 如果剩余内容少于50字符，认为是纯组件页面
  
  if (!hasSubstantialContent && title) {
    // 纯组件页面，替换为友好的提示信息
    content = `# ${title}\n\n> **📌 交互式内容**\n>\n> 本页面包含交互式组件（${title}），仅在在线文档中可用。\n>\n> 💡 **提示**：请访问在线文档查看完整的交互式内容和功能演示。\n`;
  } else {
    // 有一定内容，添加标准提示
    const notice = '\n> **注意**: 此部分包含交互式内容，在 PDF 版本中部分功能不可用。请访问在线文档查看完整内容。\n\n';
    content = notice + content;
  }

  // 记录处理详情
  mdxProcessed.push({
    file: path.relative(ROOT_DIR, filePath),
    originalLength: original.length,
    processedLength: content.length,
    removedCharacters: original.length - content.length,
    hasSubstantialContent: hasSubstantialContent,
    title: title || '(无标题)',
  });

  return content;
}

// ==================== 调整标题层级 ====================
function adjustHeadings(content, depth) {
  // 提取代码块位置（避免处理代码块内的内容）
  const codeBlocks = extractCodeBlocks(content);

  return content.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, text, offset) => {
    // 检查是否在代码块内
    if (isInCodeBlock(offset, codeBlocks)) {
      return match;
    }

    const currentLevel = hashes.length;
    // 调整层级：header用HTML，markdown从H1开始，depth从0开始
    // - depth=0 的文件：H1→H2, H2→H3 (在一级目录H1下)
    // - depth=1 的文件：H1→H3, H2→H4 (在二级目录H2下)
    const newLevel = Math.min(currentLevel + depth + 1, 6); // 最多 H6
    return '#'.repeat(newLevel) + ' ' + text;
  });
}

// ==================== 处理相对路径 ====================
function processRelativePaths(content, currentDir, sourceFile) {
  // 提取代码块位置
  const codeBlocks = extractCodeBlocks(content);

  // 处理链接
  content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url, offset) => {
    if (isInCodeBlock(offset, codeBlocks)) {
      return match;
    }

    if (url.startsWith('./') || url.startsWith('../')) {
      stats.relativeLinks++;
      const absolutePath = resolveRelativePath(currentDir, url);
      
      // 记录转换详情
      relativeLinksProcessed.push({
        sourceFile: path.relative(ROOT_DIR, sourceFile),
        linkText: text,
        originalPath: url,
        convertedPath: absolutePath,
      });
      
      return `[${text}](${absolutePath})`;
    }
    return match;
  });

  // 处理图片
  content = content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, url, offset) => {
    if (isInCodeBlock(offset, codeBlocks)) {
      return match;
    }

    if (url.startsWith('./') || url.startsWith('../')) {
      stats.relativeImages++;
      const absolutePath = resolveRelativePath(currentDir, url);
      
      // 记录转换详情
      relativeImagesProcessed.push({
        sourceFile: path.relative(ROOT_DIR, sourceFile),
        imageAlt: alt,
        originalPath: url,
        convertedPath: absolutePath,
      });
      
      return `![${alt}](${absolutePath})`;
    }
    return match;
  });

  return content;
}

// ==================== 解析相对路径 ====================
function resolveRelativePath(currentDir, relativePath) {
  // 去除可能的 .html 后缀或锚点
  const cleanPath = relativePath.replace(/\.html(#.*)?$/, '$1');
  
  // 解析路径
  const absolutePath = path.join(currentDir, cleanPath);
  
  // 转换为相对于 docs/zh 的 URL 路径
  const relative = path.relative(path.join(ROOT_DIR, 'docs/zh'), absolutePath);
  
  // 转换为 URL 格式（使用正斜杠）
  const urlPath = '/' + relative.replace(/\\/g, '/');
  
  // 恢复 .html 后缀（如果有）
  if (relativePath.includes('.html')) {
    return urlPath + '.html';
  }
  
  return urlPath;
}

// ==================== 提取代码块位置 ====================
function extractCodeBlocks(content) {
  const blocks = [];
  const regex = /```[\s\S]*?```/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    blocks.push({
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  return blocks;
}

// ==================== 检查是否在代码块内 ====================
function isInCodeBlock(offset, codeBlocks) {
  return codeBlocks.some(block => offset >= block.start && offset <= block.end);
}

// ==================== 扫描未处理的文件 ====================
function scanUnprocessedFiles(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relativePath = path.relative(GUIDES_DIR, fullPath);
    
    if (entry.isDirectory()) {
      // 跳过隐藏目录
      if (entry.name.startsWith('.')) {
        continue;
      }
      // 递归扫描子目录
      scanUnprocessedFiles(fullPath);
    } else if (entry.isFile()) {
      // 跳过非 markdown 文件
      if (!entry.name.endsWith('.md') && !entry.name.endsWith('.mdx')) {
        continue;
      }
      
      // 跳过 _meta.json
      if (entry.name === '_meta.json') {
        continue;
      }
      
      // 检查是否已处理
      if (!processedInMeta.has(relativePath)) {
        // 未在 meta 中的文件
        skippedFiles.push({
          reason: 'not_in_meta',
          path: path.relative(ROOT_DIR, fullPath),
          directory: path.relative(ROOT_DIR, dirPath),
        });
        stats.skippedCount++;
      }
    }
  }
}

// ==================== 执行 ====================
main();

