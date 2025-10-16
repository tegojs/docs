#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { fileSystemPathToUrl, urlPathToFileSystem } = require('../tools/path-utils');
const { extractCodeBlocks, isInCodeBlock } = require('../tools/code-block-utils');

// ==================== 配置 ====================
const TASK_ID = process.argv[2];
if (!TASK_ID) {
  console.error(chalk.red('❌ 错误:'), '缺少任务ID参数');
  console.error(chalk.gray('用法:'), 'node 3-process-images.js <taskId> [--strict]');
  process.exit(1);
}

// 检查是否启用严格模式
const STRICT_MODE = process.argv.includes('--strict');

const ROOT_DIR = path.join(__dirname, '../../..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'docs/public');
const OUTPUT_DIR = path.join(ROOT_DIR, 'dist/pdf', TASK_ID);
const INPUT_FILE = path.join(OUTPUT_DIR, '2-3-links-processed.md');
const IMAGES_LOG = path.join(OUTPUT_DIR, '3-1-images.json');
const IMAGES_MISSING_LOG = path.join(OUTPUT_DIR, '3-2-images-missing.json');
const OUTPUT_FILE = path.join(OUTPUT_DIR, '3-3-images-processed.md');

// ==================== 日志记录 ====================
const imagesProcessed = [];
const imagesMissing = [];

// ==================== 主函数 ====================
function main() {
  console.log(`  ${chalk.cyan('🖼️')}  扫描图片链接...`);

  // 修复：验证输入文件是否存在
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`  ${chalk.red('❌ 错误:')} 输入文件不存在: ${chalk.magenta(path.relative(ROOT_DIR, INPUT_FILE))}`);
    console.error(`  ${chalk.gray('提示:')} 请先运行步骤2（处理内部链接）`);
    process.exit(1);
  }

  // 验证 public 目录是否存在
  if (!fs.existsSync(PUBLIC_DIR)) {
    console.warn(`  ${chalk.yellow('⚠️  警告:')} public 目录不存在: ${chalk.magenta(path.relative(ROOT_DIR, PUBLIC_DIR))}`);
    console.warn(`  ${chalk.gray('提示:')} 所有图片路径转换可能会失败`);
    if (STRICT_MODE) {
      console.error(`  ${chalk.red('❌ 错误:')} 严格模式下，public 目录必须存在`);
      process.exit(1);
    }
  }

  // 1. 读取输入
  let content;
  try {
    content = fs.readFileSync(INPUT_FILE, 'utf-8');
  } catch (error) {
    console.error(`  ${chalk.red('❌ 错误:')} 无法读取输入文件: ${error.message}`);
    process.exit(1);
  }

  // 2. 验证输入内容
  if (content.trim().length === 0) {
    const errorMsg = '输入文件为空';
    console.error(`  ${chalk.red('❌ 错误:')} ${errorMsg}: ${chalk.magenta(path.relative(ROOT_DIR, INPUT_FILE))}`);
    if (STRICT_MODE) {
      process.exit(1);
    } else {
      console.warn(`  ${chalk.yellow('⚠️  警告:')} 跳过空文件处理`);
      // 仍然创建输出文件（即使是空的）
      fs.writeFileSync(OUTPUT_FILE, content, 'utf-8');
      fs.writeFileSync(IMAGES_LOG, '[]', 'utf-8');
      fs.writeFileSync(IMAGES_MISSING_LOG, '[]', 'utf-8');
      return;
    }
  }

  // 3. 处理所有图片路径
  content = processImages(content);

  // 4. 先保存主文件（最重要）
  fs.writeFileSync(OUTPUT_FILE, content, 'utf-8');
  
  // 5. 然后保存日志文件
  fs.writeFileSync(IMAGES_LOG, JSON.stringify(imagesProcessed, null, 2), 'utf-8');
  fs.writeFileSync(IMAGES_MISSING_LOG, JSON.stringify(imagesMissing, null, 2), 'utf-8');

  // 6. 输出统计
  const totalImages = imagesProcessed.length;
  const successCount = imagesProcessed.filter(img => img.exists).length;
  const missingCount = imagesMissing.length;

  console.log(`  ${chalk.green('✓')} 找到 ${chalk.cyan(totalImages)} 个图片引用`);
  console.log(`  ${chalk.green('✓')} 转换为绝对路径: ${chalk.cyan(successCount)} 个 ${chalk.dim('→ 详见')} ${chalk.magenta(path.relative(ROOT_DIR, IMAGES_LOG))}`);
  
  if (missingCount > 0) {
    console.log(`  ${chalk.yellow('⚠️')}  找不到文件: ${chalk.cyan(missingCount)} 个 ${chalk.dim('→ 详见')} ${chalk.magenta(path.relative(ROOT_DIR, IMAGES_MISSING_LOG))}`);
    // 显示前几个找不到的图片
    const displayCount = Math.min(5, imagesMissing.length);
    for (let i = 0; i < displayCount; i++) {
      console.log(`     ${chalk.dim('- ' + imagesMissing[i].originalPath)}`);
    }
    if (imagesMissing.length > displayCount) {
      console.log(`     ${chalk.dim('... 以及 ' + (imagesMissing.length - displayCount) + ' 个其他图片')}`);
    }
  }
  
  console.log(`  ${chalk.green('✓')} 输出: ${chalk.magenta(path.relative(ROOT_DIR, OUTPUT_FILE))}`);
}

// ==================== 处理图片 ====================
function processImages(content) {
  // 提取代码块位置（避免处理代码块内的图片引用）
  const codeBlocks = extractCodeBlocks(content);
  
  // 匹配所有 Markdown 图片：![alt](url)
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  
  return content.replace(imageRegex, (match, alt, url, offset) => {
    // 检查是否在代码块内
    if (isInCodeBlock(offset, codeBlocks)) {
      return match;
    }
    
    // 场景1: 外部链接（http/https）- 保持不变
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return match;
    }
    
    // 场景2: 相对路径 - 应该已在步骤1处理，但以防万一
    if (url.startsWith('./') || url.startsWith('../')) {
      // 相对路径应该在步骤1已经转换为绝对路径了
      // 如果这里还有（且不在代码块内），说明有遗漏，记录到日志
      imagesMissing.push({
        alt,
        originalPath: url,
        expectedPath: '(相对路径)',
        reason: 'relative_path_not_converted',
        description: '相对路径应该在步骤1转换，但此处仍为相对路径，可能是处理遗漏',
      });
      
      // 保持不变（避免破坏文档）
      return match;
    }
    
    // 场景3: URL 路径（以 / 开头）- 需要转换
    if (url.startsWith('/')) {
      return processUrlPath(alt, url, match);
    }
    
    // 其他情况：保持不变
    return match;
  });
}

// ==================== 处理 URL 路径图片 ====================
function processUrlPath(alt, url, originalMatch) {
  // 拼接路径：PUBLIC_DIR + url
  // /guides/start/xxx.png → docs/public/guides/start/xxx.png
  // 使用工具函数处理 URL 路径到文件系统路径的转换
  const imagePath = urlPathToFileSystem(url, PUBLIC_DIR);
  
  // 检查文件是否存在
  const exists = fs.existsSync(imagePath);
  
  if (exists) {
    // 转换为绝对路径
    const absolutePath = path.resolve(imagePath);
    
    // 获取文件大小
    const stats = fs.statSync(imagePath);
    const fileSizeKB = (stats.size / 1024).toFixed(2);
    
    // 记录成功处理的图片
    imagesProcessed.push({
      alt,
      originalPath: url,
      absolutePath,
      exists: true,
      fileSize: `${fileSizeKB} KB`,
    });
    
    // 返回转换后的图片语法（使用绝对路径）
    return `![${alt}](${absolutePath})`;
  } else {
    // 文件不存在，记录到 missing 日志
    imagesMissing.push({
      alt,
      originalPath: url,
      expectedPath: imagePath,
      reason: 'file_not_found',
    });
    
    // 也记录到处理日志中（标记为不存在）
    imagesProcessed.push({
      alt,
      originalPath: url,
      expectedPath: imagePath,
      exists: false,
    });
    
    // 保留原样（避免 PDF 生成错误）
    return originalMatch;
  }
}

// ==================== 执行 ====================
main();

