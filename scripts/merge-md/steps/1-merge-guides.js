#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// ==================== 配置 ====================
const TASK_ID = process.argv[2];
if (!TASK_ID) {
  console.error(chalk.red('❌ 错误:'), '缺少任务ID参数');
  console.error(chalk.gray('用法:'), 'node 1-merge-guides.js <taskId> [--strict]');
  process.exit(1);
}

// 检查是否启用严格模式
const STRICT_MODE = process.argv.includes('--strict');

const ROOT_DIR = path.join(__dirname, '../../..');
const GUIDES_DIR = path.join(ROOT_DIR, 'docs/zh/guides');
const OUTPUT_DIR = path.join(ROOT_DIR, 'dist/pdf', TASK_ID);
const SKIPPED_FILES_LOG = path.join(OUTPUT_DIR, '1-1-skipped-files.json');
const MDX_PROCESSED_LOG = path.join(OUTPUT_DIR, '1-2-mdx-processed.json');
const RELATIVE_LINKS_LOG = path.join(OUTPUT_DIR, '1-3-relative-links.json');
const RELATIVE_IMAGES_LOG = path.join(OUTPUT_DIR, '1-4-relative-images.json');
const MISSING_META_LOG = path.join(OUTPUT_DIR, '1-5-missing-meta.json');
const HEADING_OVERFLOW_LOG = path.join(OUTPUT_DIR, '1-6-heading-overflow.json');
const OUTPUT_FILE = path.join(OUTPUT_DIR, '1-7-merged.md');

// 文件大小限制（10MB）
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// ==================== 日志记录 ====================
const skippedFiles = [];
const mdxProcessed = [];
const relativeLinksProcessed = [];
const relativeImagesProcessed = [];
const missingMetaFiles = []; // 记录缺失的 _meta.json 文件
const headingOverflows = []; // 记录标题层级溢出的详情
const processedInMeta = new Set(); // 记录在 meta 中处理过的文件
const stats = {
  totalFiles: 0,
  mdxFiles: 0,
  skippedCount: 0,
  relativeLinks: 0,
  relativeImages: 0,
  headingOverflow: 0,
};

// ==================== 主函数 ====================
function main() {
  // 确保输出目录存在
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // 读取 header.md 作为文档开头
  const headerPath = path.join(__dirname, '../assets/header.md');
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
    console.warn(`  ${chalk.yellow('⚠️  警告:')} 未找到 ${chalk.magenta('scripts/merge-md/assets/header.md')}，使用默认标题`);
    const now = new Date();
    const dateString = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
    output = `<br>\n<br>\n<br>\n\n<div align="center">\n  <h1 style="font-size: 3em;">灵矶使用指南</h1>\n  <p style="font-size: 1.2em; color: #999;">${dateString}</p>\n</div>\n\n<br>\n<br>\n<br>\n\n---\n\n`;
  }

  // 处理 guides 目录（从 depth = 0 开始，标题层级整体向上）
  output += processDirectory(GUIDES_DIR, 0);

  // 扫描所有未在 meta 中的文件
  scanUnprocessedFiles(GUIDES_DIR);

  // 先保存主文件（最重要）
  fs.writeFileSync(OUTPUT_FILE, output, 'utf-8');
  
  // 然后保存日志文件
  fs.writeFileSync(SKIPPED_FILES_LOG, JSON.stringify(skippedFiles, null, 2), 'utf-8');
  fs.writeFileSync(MDX_PROCESSED_LOG, JSON.stringify(mdxProcessed, null, 2), 'utf-8');
  fs.writeFileSync(RELATIVE_LINKS_LOG, JSON.stringify(relativeLinksProcessed, null, 2), 'utf-8');
  fs.writeFileSync(RELATIVE_IMAGES_LOG, JSON.stringify(relativeImagesProcessed, null, 2), 'utf-8');
  fs.writeFileSync(MISSING_META_LOG, JSON.stringify(missingMetaFiles, null, 2), 'utf-8');
  fs.writeFileSync(HEADING_OVERFLOW_LOG, JSON.stringify(headingOverflows, null, 2), 'utf-8');

  // 输出统计
  console.log(`  ${chalk.green('✓')} 处理 ${chalk.cyan(stats.totalFiles)} 个文件`);
  
  if (stats.mdxFiles > 0) {
    console.log(`  ${chalk.green('✓')} 处理 ${chalk.cyan(stats.mdxFiles)} 个 MDX 文件 ${chalk.dim('→ 详见')} ${chalk.magenta(path.relative(ROOT_DIR, MDX_PROCESSED_LOG))}`);
  }
  
  if (stats.skippedCount > 0) {
    console.log(`  ${chalk.yellow('⚠️')}  跳过 ${chalk.cyan(stats.skippedCount)} 个文件 ${chalk.dim('→ 详见')} ${chalk.magenta(path.relative(ROOT_DIR, SKIPPED_FILES_LOG))}`);
  }
  
  if (stats.relativeLinks > 0) {
    console.log(`  ${chalk.green('✓')} 转换 ${chalk.cyan(stats.relativeLinks)} 个相对路径链接 ${chalk.dim('→ 详见')} ${chalk.magenta(path.relative(ROOT_DIR, RELATIVE_LINKS_LOG))}`);
  }
  
  if (stats.relativeImages > 0) {
    console.log(`  ${chalk.green('✓')} 转换 ${chalk.cyan(stats.relativeImages)} 个相对路径图片 ${chalk.dim('→ 详见')} ${chalk.magenta(path.relative(ROOT_DIR, RELATIVE_IMAGES_LOG))}`);
  }
  
  // 显示缺失的 _meta.json 警告
  if (missingMetaFiles.length > 0) {
    console.log(`  ${chalk.yellow('⚠️')}  缺失 _meta.json: ${chalk.cyan(missingMetaFiles.length)} 个 ${chalk.dim('→ 详见')} ${chalk.magenta(path.relative(ROOT_DIR, MISSING_META_LOG))}`);
    const displayCount = Math.min(5, missingMetaFiles.length);
    for (let i = 0; i < displayCount; i++) {
      console.log(`     ${chalk.dim('- ' + missingMetaFiles[i])}`);
    }
    if (missingMetaFiles.length > displayCount) {
      console.log(`     ${chalk.dim('... 以及 ' + (missingMetaFiles.length - displayCount) + ' 个其他文件')}`);
    }
  }
  
  // 显示标题层级溢出警告（H9+）
  if (headingOverflows.length > 0) {
    console.log(`  ${chalk.yellow('⚠️')}  深层标题 (H9+): ${chalk.cyan(headingOverflows.length)} 个 ${chalk.dim('→ 详见')} ${chalk.magenta(path.relative(ROOT_DIR, HEADING_OVERFLOW_LOG))}`);
    console.log(`     ${chalk.dim('已转换为加粗斜体文本，建议简化文档结构')}`);
    
    const displayCount = Math.min(3, headingOverflows.length);
    console.log(`     ${chalk.dim('示例:')}`);
    for (let i = 0; i < displayCount; i++) {
      const item = headingOverflows[i];
      console.log(`     ${chalk.dim(`  · H${item.targetLevel} "${item.title.substring(0, 40)}${item.title.length > 40 ? '...' : ''}"`)}`);
    }
    if (headingOverflows.length > displayCount) {
      console.log(`     ${chalk.dim('  ... 以及 ' + (headingOverflows.length - displayCount) + ' 个其他标题')}`);
    }
  }
  
  const fileSizeMB = (fs.statSync(OUTPUT_FILE).size / 1024 / 1024).toFixed(1);
  console.log(`  ${chalk.green('✓')} 输出: ${chalk.magenta(path.relative(ROOT_DIR, OUTPUT_FILE))} ${chalk.dim('(' + fileSizeMB + ' MB)')}`);
}

// ==================== 处理目录 ====================
function processDirectory(dirPath, depth) {
  let result = '';

  // 读取 _meta.json
  const metaPath = path.join(dirPath, '_meta.json');
  if (!fs.existsSync(metaPath)) {
    // 记录缺失的 _meta.json 文件
    missingMetaFiles.push(path.relative(ROOT_DIR, metaPath).replace(/\\/g, '/'));
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
          directory: path.relative(ROOT_DIR, dirPath).replace(/\\/g, '/'),
        });
        stats.skippedCount++;
        continue;
      }

      // 记录已处理的文件（统一使用 Unix 风格路径）
      processedInMeta.add(path.relative(GUIDES_DIR, filePath).replace(/\\/g, '/'));

      // 检查是否是备份文件
      if (filePath.endsWith('.bak')) {
        skippedFiles.push({
          reason: 'backup_file',
          path: path.relative(ROOT_DIR, filePath).replace(/\\/g, '/'),
        });
        stats.skippedCount++;
        continue;
      }

      stats.totalFiles++;

      // 检查文件大小
      const fileStats = fs.statSync(filePath);
      if (fileStats.size > MAX_FILE_SIZE) {
        const sizeMB = (fileStats.size / 1024 / 1024).toFixed(2);
        console.warn(`  ${chalk.yellow('⚠️  警告:')} 文件过大 ${chalk.magenta(path.relative(ROOT_DIR, filePath))} (${sizeMB} MB)`);
        if (STRICT_MODE) {
          throw new Error(`文件超过大小限制 (${sizeMB} MB > 10 MB)`);
        }
        skippedFiles.push({
          reason: 'file_too_large',
          path: path.relative(ROOT_DIR, filePath).replace(/\\/g, '/'),
          size: `${sizeMB} MB`,
        });
        stats.skippedCount++;
        continue;
      }

      // 读取文件内容
      let content;
      try {
        content = fs.readFileSync(filePath, 'utf-8');
      } catch (error) {
        if (STRICT_MODE) {
          throw error;
        }
        console.warn(`  ${chalk.yellow('⚠️  警告:')} 无法读取文件 ${chalk.magenta(path.relative(ROOT_DIR, filePath))}: ${error.message}`);
        skippedFiles.push({
          reason: 'read_error',
          path: path.relative(ROOT_DIR, filePath).replace(/\\/g, '/'),
          error: error.message,
        });
        stats.skippedCount++;
        continue;
      }

      // 处理 MDX 文件
      if (filePath.endsWith('.mdx')) {
        stats.mdxFiles++;
        content = processMDX(content, filePath);
      }

      // 调整标题层级（传入文件路径用于日志记录）
      content = adjustHeadings(content, depth, filePath);

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

  // 1. 提取代码块位置，避免处理代码块内的内容
  const codeBlocks = extractCodeBlocks(content);
  
  // 2. 删除 import/export 语句（整行删除）
  content = content.replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, '');
  content = content.replace(/^export\s+(default\s+)?.*?$/gm, '');

  // 3. 删除 JSX 注释（只在非代码块区域）
  content = replaceOutsideCodeBlocks(content, codeBlocks, /\{\/\*[\s\S]*?\*\/\}/g, '');
  
  // 4. 删除 JSX 组件（多次迭代处理嵌套）
  let prevContent;
  let iterations = 0;
  const maxIterations = 20; // 增加迭代次数
  
  do {
    prevContent = content;
    // 自闭合组件
    content = replaceOutsideCodeBlocks(content, codeBlocks, /<[A-Z][a-zA-Z0-9.]*[^>]*\/>/gs, '');
    // 成对组件（非贪婪，捕获组件名）
    content = replaceOutsideCodeBlocks(content, codeBlocks, /<([A-Z][a-zA-Z0-9.]*)[^>]*>([\s\S]*?)<\/\1>/g, '$2');
    // Fragment
    content = replaceOutsideCodeBlocks(content, codeBlocks, /<>([\s\S]*?)<\/>/g, '$1');
    iterations++;
  } while (prevContent !== content && iterations < maxIterations);
  
  // 检查是否还有未处理的组件
  const remainingJSX = content.match(/<[A-Z][a-zA-Z0-9.]+/);
  if (remainingJSX && iterations >= maxIterations) {
    console.warn(`  ${chalk.yellow('⚠️  警告:')} MDX 文件可能有未完全处理的 JSX 组件: ${chalk.magenta(path.relative(ROOT_DIR, filePath))}`);
  }

  // 5. 删除 JSX 表达式（只删除简单的变量引用，保留代码示例）
  content = replaceOutsideCodeBlocks(content, codeBlocks, /\{[a-zA-Z_$][a-zA-Z0-9_$]*\}/g, '');

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
    file: path.relative(ROOT_DIR, filePath).replace(/\\/g, '/'),
    originalLength: original.length,
    processedLength: content.length,
    removedCharacters: original.length - content.length,
    hasSubstantialContent: hasSubstantialContent,
    title: title || '(无标题)',
    jsxIterations: iterations,
  });

  return content;
}

// ==================== 在代码块外替换内容 ====================
function replaceOutsideCodeBlocks(content, codeBlocks, pattern, replacement) {
  // 如果没有代码块，直接替换
  if (codeBlocks.length === 0) {
    return content.replace(pattern, replacement);
  }
  
  // 收集所有匹配项
  const matches = [];
  let match;
  const regex = new RegExp(pattern.source, pattern.flags);
  
  while ((match = regex.exec(content)) !== null) {
    // 检查是否在代码块内
    if (!isInCodeBlock(match.index, codeBlocks)) {
      matches.push({
        index: match.index,
        length: match[0].length,
        replacement: typeof replacement === 'string' 
          ? replacement 
          : match[0].replace(pattern, replacement),
      });
    }
  }
  
  // 从后向前替换（避免索引变化）
  matches.reverse();
  for (const m of matches) {
    content = content.substring(0, m.index) + m.replacement + content.substring(m.index + m.length);
  }
  
  return content;
}

// ==================== 调整标题层级 ====================
function adjustHeadings(content, depth, sourceFile) {
  // 提取代码块位置（避免处理代码块内的内容）
  const codeBlocks = extractCodeBlocks(content);

  const result = content.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, text, offset) => {
    // 检查是否在代码块内
    if (isInCodeBlock(offset, codeBlocks)) {
      return match;
    }

    const currentLevel = hashes.length;
    // 调整层级：header用HTML，markdown从H1开始，depth从0开始
    // - depth=0 的文件：H1→H2, H2→H3 (在一级目录H1下)
    // - depth=1 的文件：H1→H3, H2→H4 (在二级目录H2下)
    const targetLevel = currentLevel + depth + 1;
    
    // 处理超出 H6 的情况
    if (targetLevel > 6) {
      // 根据超出程度选择不同的格式
      let formattedText;
      
      if (targetLevel === 7) {
        // H7 → 加粗文本（不记录）
        formattedText = `**${text.trim()}**`;
      } else if (targetLevel === 8) {
        // H8 → 加粗斜体文本（不记录）
        formattedText = `**_${text.trim()}_**`;
      } else {
        // H9+ → 加粗斜体文本（记录到日志）
        formattedText = `**_${text.trim()}_**`;
        
        stats.headingOverflow++;
        headingOverflows.push({
          file: path.relative(ROOT_DIR, sourceFile).replace(/\\/g, '/'),
          depth: depth,
          originalLevel: currentLevel,
          targetLevel: targetLevel,
          convertedTo: 'bold-italic',
          title: text.trim(),
        });
      }
      
      return '\n' + formattedText + '\n';
    }
    
    // 正常范围内的标题
    return '#'.repeat(targetLevel) + ' ' + text;
  });
  
  return result;
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
        sourceFile: path.relative(ROOT_DIR, sourceFile).replace(/\\/g, '/'),
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
        sourceFile: path.relative(ROOT_DIR, sourceFile).replace(/\\/g, '/'),
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
  // 1. 分离锚点
  let anchor = '';
  let pathWithoutAnchor = relativePath;
  const hashIndex = relativePath.indexOf('#');
  if (hashIndex !== -1) {
    anchor = relativePath.substring(hashIndex); // 保留 #xxx
    pathWithoutAnchor = relativePath.substring(0, hashIndex);
  }
  
  // 2. 分离扩展名
  let extension = '';
  if (pathWithoutAnchor.endsWith('.html')) {
    extension = '.html';
    pathWithoutAnchor = pathWithoutAnchor.substring(0, pathWithoutAnchor.length - 5);
  } else if (pathWithoutAnchor.endsWith('.md')) {
    extension = '.html'; // .md 转换为 .html
    pathWithoutAnchor = pathWithoutAnchor.substring(0, pathWithoutAnchor.length - 3);
  } else if (pathWithoutAnchor.endsWith('.mdx')) {
    extension = '.html'; // .mdx 转换为 .html
    pathWithoutAnchor = pathWithoutAnchor.substring(0, pathWithoutAnchor.length - 4);
  }
  
  // 3. 解析路径
  const absolutePath = path.join(currentDir, pathWithoutAnchor);
  
  // 4. 转换为相对于 docs/zh 的 URL 路径
  const relative = path.relative(path.join(ROOT_DIR, 'docs/zh'), absolutePath);
  
  // 5. 转换为 URL 格式（使用正斜杠）
  const urlPath = '/' + relative.replace(/\\/g, '/');
  
  // 6. 重新组合：路径 + 扩展名 + 锚点
  return urlPath + extension + anchor;
}

// ==================== 提取代码块位置 ====================
function extractCodeBlocks(content) {
  const blocks = [];
  
  // 1. 围栏代码块 (```)
  let regex = /```[\s\S]*?```/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    blocks.push({
      start: match.index,
      end: match.index + match[0].length,
    });
  }
  
  // 2. 缩进代码块（每行至少4个空格或1个tab）
  // 按行分析，连续的缩进行视为一个代码块
  const lines = content.split('\n');
  let inIndentedBlock = false;
  let blockStart = 0;
  let currentPos = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isIndented = /^( {4,}|\t)/.test(line);
    const isEmpty = /^\s*$/.test(line);
    
    if (isIndented && !inIndentedBlock) {
      // 开始新的缩进代码块
      inIndentedBlock = true;
      blockStart = currentPos;
    } else if (!isIndented && !isEmpty && inIndentedBlock) {
      // 结束缩进代码块（非空且非缩进行）
      blocks.push({
        start: blockStart,
        end: currentPos,
      });
      inIndentedBlock = false;
    }
    
    currentPos += line.length + 1; // +1 for newline
  }
  
  // 处理文件末尾的缩进代码块
  if (inIndentedBlock) {
    blocks.push({
      start: blockStart,
      end: content.length,
    });
  }
  
  // 3. 行内代码 (`)
  regex = /`[^`\n]+`/g;
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
      if (!processedInMeta.has(relativePath) && !processedInMeta.has(relativePath.replace(/\\/g, '/'))) {
        // 未在 meta 中的文件
        skippedFiles.push({
          reason: 'not_in_meta',
          path: path.relative(ROOT_DIR, fullPath).replace(/\\/g, '/'),
          directory: path.relative(ROOT_DIR, dirPath).replace(/\\/g, '/'),
        });
        stats.skippedCount++;
      }
    }
  }
}

// ==================== 执行 ====================
main();

