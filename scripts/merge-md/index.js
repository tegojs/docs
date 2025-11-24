#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

// ==================== 配置 ====================
const ROOT_DIR = path.join(__dirname, '../..');
const TASK_ID = Math.floor(Date.now() / 1000).toString(); // 10位时间戳
const OUTPUT_DIR = path.join(ROOT_DIR, 'dist/pdf', TASK_ID);

// 检查是否启用严格模式
const STRICT_MODE = process.argv.includes('--strict');
const strictFlag = STRICT_MODE ? '--strict' : '';

// ==================== 主函数 ====================
async function main() {
  console.log(chalk.cyan('╔════════════════════════════════════════╗'));
  console.log(
    chalk.cyan('║') +
      chalk.bold('   灵矶 Markdown 处理器                 ') +
      chalk.cyan('║'),
  );
  console.log(
    chalk.cyan('║') +
      chalk.dim('   合并并处理 docs/zh/guides            ') +
      chalk.cyan('║'),
  );
  console.log(chalk.cyan('╚════════════════════════════════════════╝'));
  console.log('');
  console.log(`${chalk.gray('任务 ID:')} ${chalk.bold(chalk.yellow(TASK_ID))}`);
  console.log(
    `${chalk.gray('输出目录:')} ${chalk.magenta(path.relative(ROOT_DIR, OUTPUT_DIR) + path.sep)}`,
  );
  console.log(
    `${chalk.gray('运行模式:')} ${STRICT_MODE ? chalk.red('严格模式 (--strict)') : chalk.green('容错模式')}`,
  );
  console.log('');

  // ==================== 输入验证 ====================
  // 验证必要的目录是否存在
  const GUIDES_DIR = path.join(ROOT_DIR, 'docs/zh/guides');
  if (!fs.existsSync(GUIDES_DIR)) {
    console.error('');
    console.error(
      chalk.red('❌ 错误:'),
      `源目录不存在: ${chalk.magenta('docs/zh/guides')}`,
    );
    console.error(chalk.gray('提示:'), '请确保在正确的项目根目录下运行此脚本');
    process.exit(1);
  }

  const PUBLIC_DIR = path.join(ROOT_DIR, 'docs/public');
  if (!fs.existsSync(PUBLIC_DIR)) {
    console.warn('');
    console.warn(
      chalk.yellow('⚠️  警告:'),
      `public 目录不存在: ${chalk.magenta('docs/public')}`,
    );
    console.warn(
      chalk.gray('提示:'),
      '图片处理可能会失败，如果文档中没有图片可以忽略',
    );
    console.log('');
  }

  // 创建输出目录
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  try {
    // ==================== 步骤 1: 合并 Markdown ====================
    console.log(chalk.bold(chalk.cyan('[步骤 1/3] 合并 markdown...')));
    try {
      execSync(
        `node ${path.join(__dirname, 'steps/1-merge-guides.js')} ${TASK_ID} ${strictFlag}`,
        { stdio: 'inherit' },
      );
    } catch (error) {
      throw new Error(`步骤 1 失败: ${error.message}`);
    }
    console.log('');

    // ==================== 步骤 2: 处理内部链接 ====================
    console.log(chalk.bold(chalk.cyan('[步骤 2/3] 处理内部链接...')));
    try {
      execSync(
        `node ${path.join(__dirname, 'steps/2-process-links.js')} ${TASK_ID} ${strictFlag}`,
        { stdio: 'inherit' },
      );
    } catch (error) {
      throw new Error(`步骤 2 失败: ${error.message}`);
    }
    console.log('');

    // ==================== 步骤 3: 处理图片路径 ====================
    console.log(chalk.bold(chalk.cyan('[步骤 3/3] 处理图片路径...')));
    try {
      execSync(
        `node ${path.join(__dirname, 'steps/3-process-images.js')} ${TASK_ID} ${strictFlag}`,
        { stdio: 'inherit' },
      );
    } catch (error) {
      throw new Error(`步骤 3 失败: ${error.message}`);
    }
    console.log('');

    // ==================== 创建带日期的副本 ====================
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateString = `${year}.${month}.${day}`;

    const finalMdFile = path.join(OUTPUT_DIR, '3-3-images-processed.md');
    const datedMdFile = path.join(
      OUTPUT_DIR,
      `Tego-Guides-zh-${dateString}.md`,
    );
    fs.copyFileSync(finalMdFile, datedMdFile);

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
    console.log(chalk.green('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.bold(chalk.green('✅ 全部完成！')));
    console.log(chalk.green('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log('');
    console.log(
      `📁 ${chalk.gray('输出目录:')} ${chalk.magenta(path.relative(ROOT_DIR, OUTPUT_DIR) + path.sep)}`,
    );
    console.log(
      `📄 ${chalk.gray('处理后的文件:')} ${chalk.bold(chalk.yellow(path.relative(ROOT_DIR, datedMdFile)))}`,
    );
    console.log(
      `🔗 ${chalk.gray('快捷访问:')} ${chalk.cyan(path.join('dist', 'pdf', 'latest', path.basename(datedMdFile)))}`,
    );
    console.log('');
    console.log(
      chalk.yellow(
        '💡 提示: 可以使用 Typora 将处理后的 markdown 转换为 PDF 以发布',
      ),
    );
    console.log('');
    if (!STRICT_MODE) {
      console.log(
        chalk.dim(
          'ℹ️  当前为容错模式，遇到错误会记录但继续处理。使用 --strict 参数启用严格模式。',
        ),
      );
      console.log('');
    }
  } catch (error) {
    console.error('');
    console.error(chalk.red('❌ 错误:'), error.message);
    process.exit(1);
  }
}

// ==================== 执行 ====================
main().catch(console.error);
