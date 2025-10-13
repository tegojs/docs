#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { c } = require('./colors');

// ==================== 配置 ====================
const TASK_ID = process.argv[2];
if (!TASK_ID) {
  console.error(c.error('❌ 错误:'), '缺少任务ID参数');
  console.error(c.gray('用法:'), 'node process-images.js <taskId>');
  process.exit(1);
}

const ROOT_DIR = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'docs/public');
const OUTPUT_DIR = path.join(ROOT_DIR, 'dist/pdf', TASK_ID);
const INPUT_FILE = path.join(OUTPUT_DIR, '2-1-links-processed.md');
const OUTPUT_FILE = path.join(OUTPUT_DIR, '3-1-images-processed.md');
const IMAGES_LOG = path.join(OUTPUT_DIR, '3-2-images.json');
const IMAGES_MISSING_LOG = path.join(OUTPUT_DIR, '3-3-images-missing.json');

// ==================== 日志记录 ====================
const imagesProcessed = [];
const imagesMissing = [];

// ==================== 主函数 ====================
function main() {
  console.log(`  ${c.info('🖼️')}  扫描图片链接...`);

  // 1. 读取输入
  let content = fs.readFileSync(INPUT_FILE, 'utf-8');

  // 2. 处理所有图片路径
  content = processImages(content);

  // 3. 保存输出
  fs.writeFileSync(OUTPUT_FILE, content, 'utf-8');
  fs.writeFileSync(IMAGES_LOG, JSON.stringify(imagesProcessed, null, 2), 'utf-8');
  fs.writeFileSync(IMAGES_MISSING_LOG, JSON.stringify(imagesMissing, null, 2), 'utf-8');

  // 4. 输出统计
  const totalImages = imagesProcessed.length;
  const successCount = imagesProcessed.filter(img => img.exists).length;
  const missingCount = imagesMissing.length;

  console.log(`  ${c.success('✓')} 找到 ${c.number(totalImages)} 个图片引用`);
  console.log(`  ${c.success('✓')} 转换为绝对路径: ${c.number(successCount)} 个`);
  
  if (missingCount > 0) {
    console.log(`  ${c.warning('⚠️')}  找不到文件: ${c.number(missingCount)} 个`);
  }
  
  console.log(`  ${c.success('✓')} 输出: ${c.path(path.relative(ROOT_DIR, OUTPUT_FILE))}`);
  console.log(`  ${c.success('✓')} 日志: ${c.dim('3-2-images.json, 3-3-images-missing.json')}`);
}

// ==================== 处理图片 ====================
function processImages(content) {
  // 匹配所有 Markdown 图片：![alt](url)
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  
  return content.replace(imageRegex, (match, alt, url) => {
    // 场景1: 外部链接（http/https）- 保持不变
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return match;
    }
    
    // 场景2: 相对路径 - 应该已在步骤1处理，但以防万一
    if (url.startsWith('./') || url.startsWith('../')) {
      // 相对路径应该在步骤1已经转换为绝对路径了
      // 如果这里还有，说明有遗漏，保持不变并记录
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
  const imagePath = path.join(PUBLIC_DIR, url);
  
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

