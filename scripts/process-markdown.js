#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { c } = require('./colors');

// ==================== 配置 ====================
const ROOT_DIR = path.join(__dirname, '..');
const TASK_ID = Math.floor(Date.now() / 1000).toString(); // 10位时间戳
const OUTPUT_DIR = path.join(ROOT_DIR, 'dist/pdf', TASK_ID);

// ==================== 主函数 ====================
async function main() {
  console.log(c.cyan('╔════════════════════════════════════════╗'));
  console.log(c.cyan('║') + c.bold('   灵矶 Markdown 处理器                 ') + c.cyan('║'));
  console.log(c.cyan('║') + c.dim('   合并并处理 docs/zh/guides            ') + c.cyan('║'));
  console.log(c.cyan('╚════════════════════════════════════════╝'));
  console.log('');
  console.log(`${c.gray('任务 ID:')} ${c.highlight(TASK_ID)}`);
  console.log(`${c.gray('输出目录:')} ${c.path(OUTPUT_DIR + '/')}`);
  console.log('');

  // 创建输出目录
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  try {
    // ==================== 步骤 1: 合并 Markdown ====================
    console.log(c.step('[步骤 1/3] 合并 markdown...'));
    execSync(`node ${path.join(__dirname, 'merge-guides.js')} ${TASK_ID}`, { stdio: 'inherit' });
    console.log('');

    // ==================== 步骤 2: 处理内部链接 ====================
    console.log(c.step('[步骤 2/3] 处理内部链接...'));
    execSync(`node ${path.join(__dirname, 'process-links.js')} ${TASK_ID}`, { stdio: 'inherit' });
    console.log('');

    // ==================== 步骤 3: 处理图片路径 ====================
    console.log(c.step('[步骤 3/3] 处理图片路径...'));
    execSync(`node ${path.join(__dirname, 'process-images.js')} ${TASK_ID}`, { stdio: 'inherit' });
    console.log('');

    // ==================== 创建 latest 快捷访问 ====================
    const latestDir = path.join(ROOT_DIR, 'dist/pdf/latest');
    fs.mkdirSync(latestDir, { recursive: true });
    
    // 复制所有文件到 latest
    const files = fs.readdirSync(OUTPUT_DIR);
    for (const file of files) {
      const src = path.join(OUTPUT_DIR, file);
      const dest = path.join(latestDir, file);
      fs.copyFileSync(src, dest);
    }

    // ==================== 完成 ====================
    console.log(c.green('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(c.bold(c.green('✅ 全部完成！')));
    console.log(c.green('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log('');
    console.log(`📁 ${c.gray('输出目录:')} ${c.path(path.relative(ROOT_DIR, OUTPUT_DIR) + '/')}`);
    console.log(`📄 ${c.gray('处理后的文件:')} ${c.highlight(path.relative(ROOT_DIR, OUTPUT_DIR + '/3-3-images-processed.md'))}`);
    console.log(`🔗 ${c.gray('快捷访问:')} ${c.info('dist/pdf/latest/3-3-images-processed.md')}`);
    console.log('');
    console.log(c.yellow('💡 提示: 可以使用 Typora 或其他工具将处理后的 markdown 转换为 PDF 以发布'));
    console.log('');

  } catch (error) {
    console.error('');
    console.error(c.error('❌ 错误:'), error.message);
    process.exit(1);
  }
}


// ==================== 执行 ====================
main().catch(console.error);

