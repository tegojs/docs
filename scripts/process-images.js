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

// ==================== 主函数 ====================
function main() {
  console.log(`  ${c.info('🖼️')}  扫描图片链接...`);

  // 读取输入
  const content = fs.readFileSync(INPUT_FILE, 'utf-8');

  // TODO: 实现图片路径处理逻辑
  // 1. 提取所有图片引用
  // 2. 对于 URL 路径（以 / 开头）：
  //    - 拼接 PUBLIC_DIR + path
  //    - 检查文件是否存在
  //    - 存在：转换为绝对路径
  //    - 不存在：记录到 missing 日志
  // 3. 外部链接和相对路径保持不变
  // 4. 记录处理日志

  // 占位符：直接复制输入
  const processedContent = content;

  // 保存输出
  fs.writeFileSync(OUTPUT_FILE, processedContent, 'utf-8');

  // 保存日志（占位符）
  fs.writeFileSync(IMAGES_LOG, JSON.stringify([], null, 2), 'utf-8');
  fs.writeFileSync(IMAGES_MISSING_LOG, JSON.stringify([], null, 2), 'utf-8');

  console.log(`  ${c.success('✓')} 转换 ${c.number(0)} 个图片路径 ${c.dim('（待实现）')}`);
  console.log(`  ${c.success('✓')} 输出: ${c.path(path.relative(ROOT_DIR, OUTPUT_FILE))}`);
}

// ==================== 执行 ====================
main();

