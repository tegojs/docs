#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// ==================== 配置 ====================
const TASK_ID = process.argv[2];
if (!TASK_ID) {
  console.error('❌ 错误: 缺少任务ID参数');
  console.error('用法: node process-links.js <taskId>');
  process.exit(1);
}

const ROOT_DIR = path.join(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT_DIR, 'dist/pdf', TASK_ID);
const INPUT_FILE = path.join(OUTPUT_DIR, '1-merged.md');
const OUTPUT_FILE = path.join(OUTPUT_DIR, '2-links-processed.md');
const LINKS_LOG = path.join(OUTPUT_DIR, '2-links.json');
const LINKS_SKIPPED_LOG = path.join(OUTPUT_DIR, '2-links-skipped.json');

// ==================== 主函数 ====================
function main() {
  console.log('  📁 扫描内部链接...');

  // 读取输入
  const content = fs.readFileSync(INPUT_FILE, 'utf-8');

  // TODO: 实现链接处理逻辑
  // 1. 读取 link-mapping.json（如果存在）
  // 2. 扫描所有内部链接
  // 3. 按优先级应用规则：
  //    - 规则1: 手动映射
  //    - 规则2: 保留锚点
  //    - 规则3: 读取源文件一级标题
  //    - 规则4: 使用链接文本
  // 4. 转换链接并记录日志

  // 占位符：直接复制输入
  const processedContent = content;

  // 保存输出
  fs.writeFileSync(OUTPUT_FILE, processedContent, 'utf-8');

  // 保存日志（占位符）
  fs.writeFileSync(LINKS_LOG, JSON.stringify([], null, 2), 'utf-8');
  fs.writeFileSync(LINKS_SKIPPED_LOG, JSON.stringify([], null, 2), 'utf-8');

  console.log('  ✓ 转换 0 个链接（待实现）');
  console.log(`  ✓ 输出: ${path.relative(ROOT_DIR, OUTPUT_FILE)}`);
}

// ==================== 执行 ====================
main();

