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
  console.log(c.cyan('║') + c.bold('   灵矶 PDF 生成器                      ') + c.cyan('║'));
  console.log(c.cyan('║') + c.dim('   docs/zh/guides → guides-zh.pdf       ') + c.cyan('║'));
  console.log(c.cyan('╚════════════════════════════════════════╝'));
  console.log('');
  console.log(`${c.gray('任务 ID:')} ${c.highlight(TASK_ID)}`);
  console.log(`${c.gray('输出目录:')} ${c.path(OUTPUT_DIR + '/')}`);
  console.log('');

  // 创建输出目录
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  try {
    // ==================== 步骤 1: 合并 Markdown ====================
    console.log(c.step('[步骤 1/6] 合并 markdown...'));
    execSync(`node ${path.join(__dirname, 'merge-guides.js')} ${TASK_ID}`, { stdio: 'inherit' });
    console.log('');

    // ==================== 步骤 2: 处理内部链接 ====================
    console.log(c.step('[步骤 2/6] 处理内部链接...'));
    execSync(`node ${path.join(__dirname, 'process-links.js')} ${TASK_ID}`, { stdio: 'inherit' });
    console.log('');

    // ==================== 步骤 3: 处理图片路径 ====================
    console.log(c.step('[步骤 3/6] 处理图片路径...'));
    execSync(`node ${path.join(__dirname, 'process-images.js')} ${TASK_ID}`, { stdio: 'inherit' });
    console.log('');

    // ==================== 步骤 4: 清理特殊字符 ====================
    console.log(c.step('[步骤 4/6] 清理特殊字符...'));
    const inputFile4 = path.join(OUTPUT_DIR, '3-1-images-processed.md');
    const outputFile4 = path.join(OUTPUT_DIR, '4-1-cleaned.md');
    
    let content = fs.readFileSync(inputFile4, 'utf-8');
    
    // 移除 emoji 和特殊字符
    const originalLength = content.length;
    content = content
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
      .replace(/[\u{2600}-\u{27BF}]/gu, '')
      .replace(/[\u{1F000}-\u{1F6FF}]/gu, '')
      .replace(/[\u{1F900}-\u{1F9FF}]/gu, '')
      .replace(/[\u{2640}\u{2642}\u{2695}-\u{2699}\u{26A0}-\u{26FF}]/gu, '')
      .replace(/[\u{2700}-\u{27BF}]/gu, '')
      .replace(/  +/g, ' ');
    
    const removedChars = originalLength - content.length;
    
    fs.writeFileSync(outputFile4, content, 'utf-8');
    console.log(`  ${c.success('✓')} 移除了 ${c.number(removedChars)} 个特殊字符`);
    console.log(`  ${c.success('✓')} 清理了多余空格`);
    console.log(`  ${c.success('✓')} 输出: ${c.path(path.relative(ROOT_DIR, outputFile4))}`);
    console.log('');

    // ==================== 步骤 5: 检查工具 ====================
    console.log(c.step('[步骤 5/6] 检查工具...'));
    checkTool('pandoc', 'https://pandoc.org/installing.html');
    checkTool('xelatex', 'https://miktex.org/download');
    console.log('');

    // ==================== 步骤 6: 生成 PDF ====================
    console.log(c.step('[步骤 6/6] 生成 PDF...'));
    const inputMd = path.join(OUTPUT_DIR, '4-1-cleaned.md');
    const outputPdf = path.join(OUTPUT_DIR, '6-1-guides-zh.pdf');

    const pandocCmd = `pandoc "${inputMd}" -o "${outputPdf}" --pdf-engine=xelatex --toc --toc-depth=3 --number-sections -V CJKmainfont="Microsoft YaHei" -V geometry:margin=2cm -V papersize=a4`;
    
    console.log(`  ${c.info('⏳')} 编译中（约 3-5 分钟）...`);
    execSync(pandocCmd, { stdio: 'inherit' });
    
    const stats = fs.statSync(outputPdf);
    const fileSizeMB = (stats.size / 1024 / 1024).toFixed(1);
    console.log(`  ${c.success('✓')} 成功！${c.bold('guides-zh.pdf')} ${c.dim('(' + fileSizeMB + ' MB)')}`);
    console.log('');

    // ==================== 步骤 7: 创建 latest 快捷访问 ====================
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
    console.log(`📄 ${c.gray('最终 PDF:')} ${c.highlight(path.relative(ROOT_DIR, outputPdf))}`);
    console.log(`🔗 ${c.gray('快捷访问:')} ${c.info('dist/pdf/latest/6-1-guides-zh.pdf')}`);
    console.log('');

  } catch (error) {
    console.error('');
    console.error(c.error('❌ 错误:'), error.message);
    process.exit(1);
  }
}

// ==================== 工具函数 ====================
function checkTool(toolName, downloadUrl) {
  try {
    const version = execSync(`${toolName} --version`, { stdio: 'pipe', encoding: 'utf-8' });
    const versionLine = version.split('\n')[0];
    console.log(`  ${c.success('✓')} ${c.bold(toolName)}: ${c.dim(versionLine)}`);
  } catch {
    console.error(`  ${c.error('❌')} ${c.bold(toolName)} 未安装`);
    console.error(`     ${c.gray('下载:')} ${c.cyan(downloadUrl)}`);
    process.exit(1);
  }
}

// ==================== 执行 ====================
main().catch(console.error);

