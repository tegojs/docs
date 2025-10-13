#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { c } = require('./colors');

// ==================== 配置 ====================
const TASK_ID = process.argv[2];
if (!TASK_ID) {
  console.error(c.error('❌ 错误:'), '缺少任务ID参数');
  console.error(c.gray('用法:'), 'node process-links.js <taskId>');
  process.exit(1);
}

const ROOT_DIR = path.join(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT_DIR, 'dist/pdf', TASK_ID);
const INPUT_FILE = path.join(OUTPUT_DIR, '1-1-merged.md');
const OUTPUT_FILE = path.join(OUTPUT_DIR, '2-1-links-processed.md');
const LINKS_LOG = path.join(OUTPUT_DIR, '2-2-links.json');
const LINKS_SKIPPED_LOG = path.join(OUTPUT_DIR, '2-3-links-skipped.json');

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
  console.log(`  ${c.info('📁')} 扫描内部链接...`);

  // 1. 读取 link-mapping.json（如果存在）
  const manualMappings = loadManualMappings();
  console.log(`  ${c.info('📚')} 手动映射: ${c.number(Object.keys(manualMappings).length)} 个`);

  // 2. 读取输入
  let content = fs.readFileSync(INPUT_FILE, 'utf-8');

  // 3. 扫描并处理所有内部链接
  content = processInternalLinks(content, manualMappings);

  // 4. 保存输出
  fs.writeFileSync(OUTPUT_FILE, content, 'utf-8');
  fs.writeFileSync(LINKS_LOG, JSON.stringify(linksProcessed, null, 2), 'utf-8');
  fs.writeFileSync(LINKS_SKIPPED_LOG, JSON.stringify(linksSkipped, null, 2), 'utf-8');

  // 5. 输出统计
  const totalLinks = linksProcessed.length;
  console.log(`  ${c.success('✓')} 转换 ${c.number(totalLinks)} 个链接`);
  console.log(`    ${c.dim('- [规则1] 手动映射:')} ${c.number(ruleStats.rule1_manual)}`);
  console.log(`    ${c.dim('- [规则2] 锚点:')} ${c.number(ruleStats.rule2_anchor)}`);
  console.log(`    ${c.dim('- [规则3] 源文件:')} ${c.number(ruleStats.rule3_sourceFile)}`);
  console.log(`    ${c.dim('- [规则4] 文本:')} ${c.number(ruleStats.rule4_linkText)}`);
  
  if (linksSkipped.length > 0) {
    console.log(`  ${c.warning('⚠️')}  找不到源文件: ${c.number(linksSkipped.length)} 个`);
  }
  
  console.log(`  ${c.success('✓')} 输出: ${c.path(path.relative(ROOT_DIR, OUTPUT_FILE))}`);
  console.log(`  ${c.success('✓')} 日志: ${c.dim('2-2-links.json, 2-3-links-skipped.json')}`);
}

// ==================== 读取手动映射 ====================
function loadManualMappings() {
  const mappingFile = path.join(ROOT_DIR, 'link-mapping.json');
  
  if (!fs.existsSync(mappingFile)) {
    return {};
  }
  
  try {
    const data = JSON.parse(fs.readFileSync(mappingFile, 'utf-8'));
    const mappings = data.mappings || {};
    
    // 过滤掉以 _ 开头的注释项
    const filteredMappings = {};
    for (const [key, value] of Object.entries(mappings)) {
      if (!key.startsWith('_')) {
        filteredMappings[key] = value;
      }
    }
    
    return filteredMappings;
  } catch (error) {
    console.warn(`  ${c.warning('⚠️  警告:')} 无法读取 link-mapping.json: ${error.message}`);
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
  
  // 尝试 .md
  let mdPath = path.join(ROOT_DIR, 'docs/zh/guides', relativePath + '.md');
  if (fs.existsSync(mdPath)) {
    return mdPath;
  }
  
  // 尝试 .mdx
  let mdxPath = path.join(ROOT_DIR, 'docs/zh/guides', relativePath + '.mdx');
  if (fs.existsSync(mdxPath)) {
    return mdxPath;
  }
  
  // 尝试 index.md
  let indexPath = path.join(ROOT_DIR, 'docs/zh/guides', relativePath, 'index.md');
  if (fs.existsSync(indexPath)) {
    return indexPath;
  }
  
  // 尝试 /index.md
  indexPath = path.join(ROOT_DIR, 'docs/zh/guides', relativePath + '/index.md');
  if (fs.existsSync(indexPath)) {
    return indexPath;
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
function toPandocId(text) {
  return text
    .toLowerCase()                                    // 小写
    .replace(/\s+/g, '-')                             // 空格转 -
    .replace(/[^\u4e00-\u9fa5a-z0-9_\-]/g, '')       // 只保留中文、字母、数字、下划线、短横线
    .replace(/-+/g, '-')                              // 多个 - 合并为一个
    .replace(/^-+|-+$/g, '');                         // 移除首尾的 -
}

// ==================== 执行 ====================
main();

