#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { fileSystemPathToUrl, urlPathToFileSystem } = require('../tools/path-utils');
const { extractCodeBlocks, isInCodeBlock, replaceOutsideCodeBlocks } = require('../tools/code-block-utils');

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
  admonitions: 0, // 提示框转换数量
};

// ==================== 主函数 ====================
function main() {
  // 确保输出目录存在
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // 验证源目录是否存在
  if (!fs.existsSync(GUIDES_DIR)) {
    console.error(`  ${chalk.red('❌ 错误:')} 源目录不存在: ${chalk.magenta(path.relative(ROOT_DIR, GUIDES_DIR))}`);
    console.error(`  ${chalk.gray('提示:')} 请确保 docs/zh/guides 目录存在`);
    process.exit(1);
  }

  // 修复：添加进度提示
  console.log(`  ${chalk.cyan('📝')} 读取文档头部模板...`);

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

  console.log(`  ${chalk.cyan('📂')} 扫描并合并 Markdown 文件...`);
  
  // 处理 guides 目录（从 depth = 0 开始，标题层级整体向上）
  output += processDirectory(GUIDES_DIR, 0);
  console.log(``);

  console.log(`  ${chalk.cyan('🔍')} 扫描未处理的文件...`);
  
  // 扫描所有未在 meta 中的文件
  scanUnprocessedFiles(GUIDES_DIR);

  console.log(`  ${chalk.cyan('💾')} 保存输出文件...`);
  
  // 先保存主文件（最重要）
  fs.writeFileSync(OUTPUT_FILE, output, 'utf-8');
  
  // 清除进度提示行
  if (stats.totalFiles >= 10) {
    process.stdout.write('\r' + ' '.repeat(50) + '\r');
  }
  
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
  
  if (stats.admonitions > 0) {
    console.log(`  ${chalk.green('✓')} 转换 ${chalk.cyan(stats.admonitions)} 个提示框为引用块`);
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

  // 修复：添加 JSON 解析错误处理
  let meta;
  try {
    meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
  } catch (error) {
    const errorMsg = `无法解析 _meta.json: ${path.relative(ROOT_DIR, metaPath)} - ${error.message}`;
    console.error(`  ${chalk.red('❌ 错误:')} ${errorMsg}`);
    if (STRICT_MODE) {
      throw new Error(errorMsg);
    }
    skippedFiles.push({
      reason: 'invalid_meta_json',
      path: path.relative(ROOT_DIR, metaPath).replace(/\\/g, '/'),
      error: error.message,
    });
    stats.skippedCount++;
    return result;
  }

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
      
      // 修复：每处理10个文件显示一次进度
      if (stats.totalFiles % 10 === 0) {
        process.stdout.write(`\r     ${chalk.dim(`处理中... ${stats.totalFiles} 个文件`)}`);
      }

      // 检查文件大小
      const fileStat = fs.statSync(filePath);
      if (fileStat.size > MAX_FILE_SIZE) {
        const sizeMB = (fileStat.size / 1024 / 1024).toFixed(2);
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

      // 检查文件是否为空
      if (content.trim().length === 0) {
        const warningMsg = `文件为空: ${path.relative(ROOT_DIR, filePath)}`;
        console.warn(`  ${chalk.yellow('⚠️  警告:')} ${warningMsg}`);
        if (STRICT_MODE) {
          throw new Error(warningMsg);
        }
        skippedFiles.push({
          reason: 'empty_file',
          path: path.relative(ROOT_DIR, filePath).replace(/\\/g, '/'),
        });
        stats.skippedCount++;
        continue;
      }

      // 处理 MDX 文件
      if (filePath.endsWith('.mdx')) {
        stats.mdxFiles++;
        content = processMDX(content, filePath);
      }

      // 处理特殊语法（提示框等），传入文件路径用于生成在线文档链接
      content = processSpecialSyntax(content, filePath);

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
  // NOTE：深度嵌套的 JSX 组件（>20层）可能无法完全删除
  
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
    const errorMsg = `MDX 文件可能有未完全处理的 JSX 组件: ${path.relative(ROOT_DIR, filePath)} (达到最大迭代次数 ${maxIterations})`;
    console.warn(`  ${chalk.yellow('⚠️  警告:')} ${errorMsg}`);
    
    // 严格模式下，未完全处理的 JSX 组件应该报错
    if (STRICT_MODE) {
      throw new Error(errorMsg);
    }
  }

  // 5. 删除 JSX 表达式（只删除简单的变量引用，保留代码示例）
  content = replaceOutsideCodeBlocks(content, codeBlocks, /\{[a-zA-Z_$][a-zA-Z0-9_$]*\}/g, '');

  // 提取标题
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : '';
  
  // 检查除了标题和空白外是否还有实质内容
  const contentWithoutTitle = content.replace(/^#\s+.+$/m, '').trim();
  const hasSubstantialContent = contentWithoutTitle.length > 50; // 如果剩余内容少于50字符，认为是纯组件页面
  
  // 生成在线文档链接
  const onlineDocUrl = generateOnlineDocUrl(filePath);
  const interactiveNoticeWithLink = `\n> **📌 交互式内容**\n>\n> 此处包含交互式内容，仅在在线文档中可用。\n>\n> 💡 **查看完整内容**：[${onlineDocUrl}](${onlineDocUrl})\n\n`;
  
  if (!hasSubstantialContent && title) {
    // 纯组件页面，使用统一提示
    content = `# ${title}\n${interactiveNoticeWithLink}`;
  } else {
    // 有一定内容，添加统一提示
    content = interactiveNoticeWithLink + content;
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

// ==================== 处理特殊语法 ====================
function processSpecialSyntax(content, filePath) {
  // 提取代码块位置（避免处理代码块内的内容）
  const codeBlocks = extractCodeBlocks(content);
  
  // 生成在线文档链接
  const onlineDocUrl = generateOnlineDocUrl(filePath);
  const interactiveNoticeWithLink = `\n> **📌 交互式内容**\n>\n> 此处包含交互式内容，仅在在线文档中可用。\n>\n> 💡 **查看完整内容**：[${onlineDocUrl}](${onlineDocUrl})\n\n`;
  
  // 1. 删除普通 MD 文件中的 JSX 组件并添加提示
  // 自闭合组件：<PluginInfo name="xxx" />
  content = replaceOutsideCodeBlocks(content, codeBlocks, /<[A-Z][a-zA-Z0-9.]*[^>]*\/>/g, interactiveNoticeWithLink);
  
  // 成对组件：<PluginInfo name="xxx"></PluginInfo>
  content = replaceOutsideCodeBlocks(content, codeBlocks, /<([A-Z][a-zA-Z0-9.]*)[^>]*><\/\1>/g, interactiveNoticeWithLink);
  
  // 2. 删除 HTML 特殊标签并添加提示（如 <embed>）
  content = replaceOutsideCodeBlocks(content, codeBlocks, /<embed[^>]*>[\s\S]*?<\/embed>/g, interactiveNoticeWithLink);
  
  // 处理单标签 embed（自闭合）
  content = replaceOutsideCodeBlocks(content, codeBlocks, /<embed[^>]*>/g, interactiveNoticeWithLink);
  
  // 3. 处理 ::: 提示框语法（如 :::info, :::warning, :::tip 等）
  // 支持格式：
  // - :::type{title=标题}
  // - ::: type 标题文本（冒号和类型之间可以有空格）
  // - :::type 或 ::: type
  content = content.replace(/:::\s*(\w+)(?:\{title=([^}]+)\}|\s+([^\n]+))?\s*\n([\s\S]*?):::/g, (match, type, titleInBraces, titleInline, innerContent) => {
    stats.admonitions++;
    
    // 类型映射到中文标签和emoji
    const typeMap = {
      'info': { label: '提示', emoji: 'ℹ️' },
      'tip': { label: '技巧', emoji: '💡' },
      'warning': { label: '警告', emoji: '⚠️' },
      'danger': { label: '危险', emoji: '🚫' },
      'note': { label: '注意', emoji: '📝' },
      'caution': { label: '小心', emoji: '⚡' },
      'important': { label: '重要', emoji: '❗' },
      'success': { label: '成功', emoji: '✅' },
    };
    
    const typeInfo = typeMap[type.toLowerCase()] || { label: type, emoji: '📌' };
    // 优先使用 {title=xxx} 格式，其次使用行内标题，最后使用类型默认标签
    const displayTitle = titleInBraces || (titleInline ? titleInline.trim() : typeInfo.label);
    
    // 转换为引用块格式
    const lines = innerContent.trim().split('\n');
    const quotedLines = lines.map(line => `> ${line}`).join('\n');
    
    return `> **${typeInfo.emoji} ${displayTitle}**\n>\n${quotedLines}\n`;
  });
  
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
      
      return formattedText;
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

// ==================== 生成在线文档 URL ====================
/**
 * 将文件路径转换为在线文档 URL
 * @param {string} filePath - 文件系统路径
 * @returns {string} 在线文档 URL
 * 
 * 示例：
 * - 输入：docs/zh/guides/advanced/core/users/departments/manual.md
 * - 输出：https://tachybase.org/guides/advanced/core/users/departments/manual.html
 */
function generateOnlineDocUrl(filePath) {
  // 获取相对于 docs/zh 的路径
  const relativePath = path.relative(path.join(ROOT_DIR, 'docs/zh'), filePath);
  
  // 转换为 URL 路径格式（统一使用 /）
  const urlPath = fileSystemPathToUrl(relativePath);
  
  // 移除扩展名并添加 .html
  const cleanPath = urlPath.replace(/\.(md|mdx)$/, '.html');
  
  // 拼接完整 URL
  return `https://tachybase.org/${cleanPath}`;
}

// ==================== 解析相对路径 ====================
function resolveRelativePath(currentDir, relativePath) {
  // 修复：处理边界情况（URL编码、空格、特殊字符等）
  
  // 0. 预处理：解码 URL 编码（如 %20 -> 空格）
  let decodedPath = relativePath;
  try {
    decodedPath = decodeURIComponent(relativePath);
  } catch (e) {
    // 如果解码失败，使用原始路径
    decodedPath = relativePath;
  }
  
  // 1. 分离锚点
  let anchor = '';
  let pathWithoutAnchor = decodedPath;
  const hashIndex = decodedPath.indexOf('#');
  if (hashIndex !== -1) {
    anchor = decodedPath.substring(hashIndex); // 保留 #xxx
    pathWithoutAnchor = decodedPath.substring(0, hashIndex);
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
  
  // 3. 解析路径（使用 path.normalize 处理 .. 和 . 等）
  const absolutePath = path.normalize(path.join(currentDir, pathWithoutAnchor));
  
  // 4. 转换为相对于 docs/zh 的 URL 路径
  const relative = path.relative(path.join(ROOT_DIR, 'docs/zh'), absolutePath);
  
  // 5. 转换为 URL 格式（使用工具函数统一处理）
  const urlPath = '/' + fileSystemPathToUrl(relative);
  
  // 6. 重新组合：路径 + 扩展名 + 锚点
  return urlPath + extension + anchor;
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

