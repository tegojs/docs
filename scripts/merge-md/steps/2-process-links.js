#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const {
  fileSystemPathToUrl,
  urlPathToFileSystem,
} = require('../tools/path-utils');

// ==================== 配置 ====================
const TASK_ID = process.argv[2];
if (!TASK_ID) {
  console.error(chalk.red('❌ 错误:'), '缺少任务ID参数');
  console.error(
    chalk.gray('用法:'),
    'node 2-process-links.js <taskId> [--strict]',
  );
  process.exit(1);
}

// 检查是否启用严格模式
const STRICT_MODE = process.argv.includes('--strict');

const ROOT_DIR = path.join(__dirname, '../../..');
const OUTPUT_DIR = path.join(ROOT_DIR, 'dist/pdf', TASK_ID);
const INPUT_FILE = path.join(OUTPUT_DIR, '1-7-merged.md');
const LINKS_LOG = path.join(OUTPUT_DIR, '2-1-links.json');
const LINKS_SKIPPED_LOG = path.join(OUTPUT_DIR, '2-2-links-skipped.json');
const OUTPUT_FILE = path.join(OUTPUT_DIR, '2-3-links-processed.md');

// ==================== 日志记录 ====================
const linksProcessed = [];
const linksSkipped = [];
const ruleStats = {
  rule1_manual: 0,
  rule2_anchor: 0,
  rule3_sourceFile: 0,
  rule4_linkText: 0,
};

// ==================== 主函数 ====================
function main() {
  console.log(`  ${chalk.cyan('📁')} 扫描内部链接...`);

  // 修复：验证输入文件是否存在
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(
      `  ${chalk.red('❌ 错误:')} 输入文件不存在: ${chalk.magenta(path.relative(ROOT_DIR, INPUT_FILE))}`,
    );
    console.error(`  ${chalk.gray('提示:')} 请先运行步骤1（合并 Markdown）`);
    process.exit(1);
  }

  // 1. 读取 link-mapping.json（如果存在）
  const manualMappings = loadManualMappings();
  console.log(
    `  ${chalk.cyan('📚')} 手动映射: ${chalk.cyan(Object.keys(manualMappings).length)} 个`,
  );

  // 2. 读取输入
  let content;
  try {
    content = fs.readFileSync(INPUT_FILE, 'utf-8');
  } catch (error) {
    console.error(
      `  ${chalk.red('❌ 错误:')} 无法读取输入文件: ${error.message}`,
    );
    process.exit(1);
  }

  // 3. 验证输入内容
  if (content.trim().length === 0) {
    const errorMsg = '输入文件为空';
    console.error(
      `  ${chalk.red('❌ 错误:')} ${errorMsg}: ${chalk.magenta(path.relative(ROOT_DIR, INPUT_FILE))}`,
    );
    if (STRICT_MODE) {
      process.exit(1);
    } else {
      console.warn(`  ${chalk.yellow('⚠️  警告:')} 跳过空文件处理`);
      // 仍然创建输出文件（即使是空的）
      fs.writeFileSync(OUTPUT_FILE, content, 'utf-8');
      fs.writeFileSync(LINKS_LOG, '[]', 'utf-8');
      fs.writeFileSync(LINKS_SKIPPED_LOG, '[]', 'utf-8');
      return;
    }
  }

  // 4. 扫描并处理所有内部链接
  content = processInternalLinks(content, manualMappings);

  // 5. 先保存主文件（最重要）
  fs.writeFileSync(OUTPUT_FILE, content, 'utf-8');

  // 6. 然后保存日志文件
  fs.writeFileSync(LINKS_LOG, JSON.stringify(linksProcessed, null, 2), 'utf-8');
  fs.writeFileSync(
    LINKS_SKIPPED_LOG,
    JSON.stringify(linksSkipped, null, 2),
    'utf-8',
  );

  // 7. 输出统计
  const totalLinks = linksProcessed.length;
  console.log(
    `  ${chalk.green('✓')} 转换 ${chalk.cyan(totalLinks)} 个链接 ${chalk.dim('→ 详见')} ${chalk.magenta(path.relative(ROOT_DIR, LINKS_LOG))}`,
  );
  console.log(
    `    ${chalk.dim('- [规则1] 手动映射:')} ${chalk.cyan(ruleStats.rule1_manual)}`,
  );
  console.log(
    `    ${chalk.dim('- [规则2] 锚点:')} ${chalk.cyan(ruleStats.rule2_anchor)}`,
  );
  console.log(
    `    ${chalk.dim('- [规则3] 源文件:')} ${chalk.cyan(ruleStats.rule3_sourceFile)}`,
  );
  console.log(
    `    ${chalk.dim('- [规则4] 文本:')} ${chalk.cyan(ruleStats.rule4_linkText)}`,
  );

  if (linksSkipped.length > 0) {
    console.log(
      `  ${chalk.yellow('⚠️')}  找不到源文件: ${chalk.cyan(linksSkipped.length)} 个 ${chalk.dim('→ 详见')} ${chalk.magenta(path.relative(ROOT_DIR, LINKS_SKIPPED_LOG))}`,
    );
    // 显示前几个找不到的链接
    const displayCount = Math.min(5, linksSkipped.length);
    for (let i = 0; i < displayCount; i++) {
      console.log(
        `     ${chalk.dim('- ' + linksSkipped[i].url + ' (' + linksSkipped[i].linkText + ')')}`,
      );
    }
    if (linksSkipped.length > displayCount) {
      console.log(
        `     ${chalk.dim('... 以及 ' + (linksSkipped.length - displayCount) + ' 个其他链接')}`,
      );
    }
  }

  console.log(
    `  ${chalk.green('✓')} 输出: ${chalk.magenta(path.relative(ROOT_DIR, OUTPUT_FILE))}`,
  );
}

// ==================== 读取手动映射 ====================
function loadManualMappings() {
  const mappingFile = path.join(ROOT_DIR, 'link-mapping.json');

  if (!fs.existsSync(mappingFile)) {
    return {};
  }

  try {
    const content = fs.readFileSync(mappingFile, 'utf-8');

    // 验证文件不为空
    if (content.trim().length === 0) {
      const errorMsg = 'link-mapping.json 文件为空';
      console.warn(`  ${chalk.yellow('⚠️  警告:')} ${errorMsg}`);
      if (STRICT_MODE) {
        throw new Error(errorMsg);
      }
      return {};
    }

    // 解析 JSON
    let data;
    try {
      data = JSON.parse(content);
    } catch (parseError) {
      const errorMsg = `无法解析 link-mapping.json: ${parseError.message}`;
      console.error(`  ${chalk.red('❌ 错误:')} ${errorMsg}`);
      if (STRICT_MODE) {
        throw new Error(errorMsg);
      }
      return {};
    }

    // 验证数据结构
    if (typeof data !== 'object' || data === null) {
      const errorMsg = 'link-mapping.json 根对象必须是一个对象';
      console.warn(`  ${chalk.yellow('⚠️  警告:')} ${errorMsg}`);
      if (STRICT_MODE) {
        throw new Error(errorMsg);
      }
      return {};
    }

    const mappings = data.mappings || {};

    // 验证 mappings 是对象
    if (typeof mappings !== 'object' || mappings === null) {
      const errorMsg = 'link-mapping.json 中的 "mappings" 必须是一个对象';
      console.warn(`  ${chalk.yellow('⚠️  警告:')} ${errorMsg}`);
      if (STRICT_MODE) {
        throw new Error(errorMsg);
      }
      return {};
    }

    // 过滤掉以 _ 开头的注释项，并验证值类型
    const filteredMappings = {};
    for (const [key, value] of Object.entries(mappings)) {
      if (!key.startsWith('_')) {
        // 验证值是字符串
        if (typeof value !== 'string') {
          console.warn(
            `  ${chalk.yellow('⚠️  警告:')} link-mapping.json 中的映射值必须是字符串，跳过: ${key}`,
          );
          continue;
        }
        filteredMappings[key] = value;
      }
    }

    return filteredMappings;
  } catch (error) {
    // 这里捕获的是 STRICT_MODE 抛出的错误或其他未预期的错误
    if (STRICT_MODE) {
      throw error;
    }
    console.warn(
      `  ${chalk.yellow('⚠️  警告:')} 读取 link-mapping.json 时发生错误: ${error.message}`,
    );
    return {};
  }
}

// ==================== 处理内部链接 ====================
function processInternalLinks(content, manualMappings) {
  // 匹配所有 Markdown 链接：[文本](URL)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

  return content.replace(linkRegex, (match, linkText, url) => {
    // 只处理内部链接（以 /guides/ 开头的）
    if (!url.startsWith('/guides/')) {
      return match;
    }

    // 跳过图片链接（在步骤3处理）
    if (url.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)) {
      return match;
    }

    // 转换链接
    const result = convertLink(linkText, url, manualMappings);

    // 记录日志
    linksProcessed.push({
      linkText,
      originalUrl: url,
      convertedAnchor: result.anchor,
      rule: result.rule,
      ruleDescription: result.description,
    });

    return `[${linkText}](${result.anchor})`;
  });
}

// ==================== 转换链接（应用4个规则）====================
function convertLink(linkText, url, manualMappings) {
  // 规则1: 手动映射（最高优先级）
  if (manualMappings[url]) {
    ruleStats.rule1_manual++;
    const targetText = manualMappings[url];
    return {
      anchor: `#${toPandocId(targetText)}`,
      rule: 'rule1_manual',
      description: `手动映射到: ${targetText}`,
    };
  }

  // 规则2: 保留锚点
  const hashIndex = url.indexOf('#');
  if (hashIndex !== -1) {
    ruleStats.rule2_anchor++;
    const anchor = url.substring(hashIndex); // 保留 #xxx
    return {
      anchor: anchor,
      rule: 'rule2_anchor',
      description: '保留原有锚点',
    };
  }

  // 规则3: 读取源文件一级标题
  const sourceFilePath = urlToSourcePath(url);
  if (sourceFilePath) {
    const firstHeading = getFirstHeading(sourceFilePath);
    if (firstHeading) {
      ruleStats.rule3_sourceFile++;
      return {
        anchor: `#${toPandocId(firstHeading)}`,
        rule: 'rule3_sourceFile',
        description: `源文件标题: ${firstHeading}`,
      };
    } else {
      // 找到文件但没有标题，使用链接文本
      ruleStats.rule4_linkText++;
      return {
        anchor: `#${toPandocId(linkText)}`,
        rule: 'rule4_linkText',
        description: '使用链接文本（源文件无标题）',
      };
    }
  } else {
    // 找不到源文件，记录并使用链接文本
    linksSkipped.push({
      url,
      linkText,
      reason: 'source_file_not_found',
      description: '找不到对应的源文件',
    });
  }

  // 规则4: 使用链接文本（兜底）
  ruleStats.rule4_linkText++;
  return {
    anchor: `#${toPandocId(linkText)}`,
    rule: 'rule4_linkText',
    description: '使用链接文本（找不到源文件）',
  };
}

// ==================== URL 转源文件路径 ====================
function urlToSourcePath(url) {
  // 移除锚点
  let cleanUrl = url.split('#')[0];

  // 移除 .html 后缀
  cleanUrl = cleanUrl.replace(/\.html$/, '');

  // 移除 .md/.mdx 后缀（如果有，这是不规范的链接）
  cleanUrl = cleanUrl.replace(/\.(md|mdx)$/, '');

  // /guides/advanced/env -> advanced/env
  const relativePath = cleanUrl.replace(/^\/guides\//, '');

  // 使用工具函数处理 URL 路径到文件系统路径的转换
  const basePath = urlPathToFileSystem(
    relativePath,
    path.join(ROOT_DIR, 'docs', 'zh', 'guides'),
  );

  // 尝试的文件路径（按优先级）
  const candidates = [
    basePath + '.md', // xxx.md
    basePath + '.mdx', // xxx.mdx
    path.join(basePath, 'index.md'), // xxx/index.md
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

// ==================== 读取文件第一个标题 ====================
function getFirstHeading(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // 匹配第一个 # 标题（任何级别）
    const match = content.match(/^#+\s+(.+)$/m);
    if (match) {
      return match[1].trim();
    }

    return null;
  } catch (error) {
    return null;
  }
}

// ==================== 转换为 Pandoc ID ====================
// Pandoc 规则：小写、空格转-、移除特殊符号、保留中文/字母/数字/下划线/短横线
// NOTE: 不进行ID去重处理，因为：
// 1. 文档中的重复标题会由 Typora/Pandoc 自动处理（添加 -1, -2 后缀）
// 2. 我们无法在链接处理阶段准确预测最终的ID（需要完整扫描所有标题）
// 3. 如果需要精确控制链接目标，应使用 link-mapping.json 手动映射
function toPandocId(text) {
  return text
    .toLowerCase() // 小写
    .replace(/\s+/g, '-') // 空格转 -
    .replace(/[^\u4e00-\u9fa5a-z0-9_\-]/g, '') // 只保留中文、字母、数字、下划线、短横线
    .replace(/-+/g, '-') // 多个 - 合并为一个
    .replace(/^-+|-+$/g, ''); // 移除首尾的 -
}

// ==================== 执行 ====================
main();
