const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ANSI 颜色代码
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// 配置路径
let PACKAGES_DIR = path.resolve(__dirname, '../../tego-standard/packages');
const EN_PLUGIN_LIST_PATH = path.resolve(__dirname, '../docs/en/plugins/plugin-list.md');
const ZH_PLUGIN_LIST_PATH = path.resolve(__dirname, '../docs/zh/plugins/plugin-list.md');

// 需要排除的插件列表(不在文档中显示的插件)
const EXCLUDE_PLUGINS = [
  '@tachybase/plugin-devkit',
  '@tachybase/plugin-evaluator-mathjs',
];

// 日志函数
function log(message, level = 'info') {
  const configs = {
    info: { prefix: '[INFO]', color: colors.cyan },
    warn: { prefix: '[WARN]', color: colors.yellow },
    error: { prefix: '[ERRO]', color: colors.red },
    success: { prefix: '[SUCC]', color: colors.green }
  };
  
  const config = configs[level] || configs.info;
  console.log(`${config.color}${config.prefix}${colors.reset} ${message}`);
}

// 提示用户输入目录
function promptForDirectory() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    console.log(`\n${colors.yellow}Failed to auto discovery tego-standard directory, please enter it manually:${colors.reset}`);
    
    rl.question('> ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// 验证并获取 packages 目录
async function getPackagesDirectory() {
  // 首先尝试默认路径
  if (fs.existsSync(PACKAGES_DIR)) {
    log(`Using packages directory: ${PACKAGES_DIR}`, 'info');
    return PACKAGES_DIR;
  }
  
  log(`Default packages directory not found: ${PACKAGES_DIR}`, 'warn');
  log('Please provide the tego-standard directory path', 'warn');
  
  while (true) {
    const userInput = await promptForDirectory();
    
    if (!userInput) {
      log('No path provided, exiting...', 'error');
      process.exit(1);
    }
    
    // 检查用户输入的路径
    let tegoStandardPath = userInput;
    let packagesPath = path.join(tegoStandardPath, 'packages');
    
    // 如果用户输入的已经是 packages 目录
    if (tegoStandardPath.endsWith('packages')) {
      packagesPath = tegoStandardPath;
    }
    
    if (fs.existsSync(packagesPath)) {
      log(`Found packages directory: ${packagesPath}`, 'success');
      PACKAGES_DIR = packagesPath;
      return packagesPath;
    } else {
      log(`Directory not found: ${packagesPath}`, 'error');
      log('Please check the path and try again', 'warn');
    }
  }
}

// 读取所有插件文件夹
async function getAllPluginFolders() {
  log('Reading plugin folders...');
  
  // 确保目录存在
  await getPackagesDirectory();
  
  const folders = fs.readdirSync(PACKAGES_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  log(`Found ${folders.length} total folders`, 'info');
  return folders;
}

// 预处理插件列表
function preprocessPluginList(folders) {
  log('Preprocessing plugin list...');
  
  const skippedModules = [];
  const nonPluginFolders = [];
  
  const filtered = folders.filter(folder => {
    // 排除 module- 开头的
    if (folder.startsWith('module-')) {
      skippedModules.push(folder);
      return false;
    }
    
    // 只保留 plugin- 开头的
    if (!folder.startsWith('plugin-')) {
      // client 文件夹是预期内的，不警告
      if (folder !== 'client') {
        nonPluginFolders.push(folder);
      }
      return false;
    }
    
    return true;
  });
  
  // 统一输出跳过的模块
  if (skippedModules.length > 0) {
    log(`Skipped ${skippedModules.length} modules: ${skippedModules.join(', ')}`, 'info');
  }
  
  // 警告非预期的文件夹
  if (nonPluginFolders.length > 0) {
    log(`Warning: Non-plugin folders found: ${nonPluginFolders.join(', ')}`, 'warn');
  }
  
  log(`After preprocessing: ${filtered.length} plugins remain`);
  return filtered;
}

// 处理插件包名
function processPluginName(folderName) {
  let processedName = folderName;
  
  // 特殊处理: plugin-prototype-game-runesweeper -> plugin-demos-game-runesweeper
  if (folderName === 'plugin-prototype-game-runesweeper') {
    processedName = 'plugin-demos-game-runesweeper';
    log(`Special rename: ${folderName} -> ${processedName}`, 'warn');
  }
  // 将 plugin-auth-prototype- 开头的改为 plugin-auth-
  else if (folderName.startsWith('plugin-auth-prototype-')) {
    processedName = folderName.replace('plugin-auth-prototype-', 'plugin-auth-');
    log(`Auth prototype rename: ${folderName} -> ${processedName}`, 'warn');
  }
  // 将 plugin-prototype- 开头的改为 plugin-
  else if (folderName.startsWith('plugin-prototype-')) {
    processedName = folderName.replace('plugin-prototype-', 'plugin-');
    log(`Prototype rename: ${folderName} -> ${processedName}`, 'warn');
  }
  
  return processedName;
}

// 读取插件信息
function readPluginInfo(folderName) {
  const packageJsonPath = path.join(PACKAGES_DIR, folderName, 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    log(`package.json not found for ${folderName}`, 'error');
    return null;
  }
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const processedName = processPluginName(folderName);
    const fullName = `@tachybase/${processedName}`;
    
    // 检查是否在排除列表中
    if (EXCLUDE_PLUGINS.includes(fullName)) {
      log(`Excluding plugin: ${fullName}`, 'info');
      return null;
    }
    
    const info = {
      name: fullName,
      displayName: packageJson.displayName || packageJson.name || fullName,
      description: packageJson.description || '',
      displayNameZh: packageJson['displayName.zh-CN'] || null,
      descriptionZh: packageJson['description.zh-CN'] || null
    };
    
    // 警告缺失字段
    if (!info.displayName || info.displayName === fullName) {
      log(`Missing displayName for ${fullName}, using package name`, 'warn');
    }
    
    if (!info.description) {
      log(`Missing description for ${fullName}`, 'warn');
    }
    
    if (!info.displayNameZh) {
      info.displayNameZh = info.displayName;
      log(`Missing zh-CN displayName for ${fullName}, using English name`, 'warn');
    }
    
    if (!info.descriptionZh) {
      info.descriptionZh = info.description;
      log(`Missing zh-CN description for ${fullName}, using English description`, 'warn');
    }
    
    return info;
  } catch (error) {
    log(`Error reading package.json for ${folderName}: ${error.message}`, 'error');
    return null;
  }
}

// 构建插件数据数组
function buildPluginData(pluginFolders) {
  log('Building plugin data...');
  
  const pluginData = [];
  
  for (const folder of pluginFolders) {
    const info = readPluginInfo(folder);
    if (info) {
      pluginData.push(info);
    }
  }
  
  // 按插件名称排序
  pluginData.sort((a, b) => a.name.localeCompare(b.name));
  
  log(`Built data for ${pluginData.length} plugins`, 'success');
  return pluginData;
}

// 生成英文 Markdown 表格
function generateEnglishMarkdown(pluginData) {
  log('Generating English markdown...');
  
  // 按包名排序
  const sortedData = [...pluginData].sort((a, b) => a.name.localeCompare(b.name));
  
  let markdown = '# Plugin List\n\n';
  markdown += ' | No. | Package Name | Plugin Name | Description |\n';
  markdown += '| --- | --- | --- | --- |\n';
  
  sortedData.forEach((plugin, index) => {
    const no = index + 1;
    const name = plugin.name;
    const displayName = plugin.displayName;
    const description = plugin.description;
    
    markdown += `| ${no} | ${name} | ${displayName} | ${description} |\n`;
  });
  
  return markdown;
}

// 生成中文 Markdown 表格
function generateChineseMarkdown(pluginData) {
  log('Generating Chinese markdown...');
  
  // 按包名排序
  const sortedData = [...pluginData].sort((a, b) => a.name.localeCompare(b.name));
  
  let markdown = '# 插件列表\n\n';
  markdown += '| 序号 | 包名 | 插件名 | 描述 |\n';
  markdown += '| --- | --- | --- | --- |\n';
  
  sortedData.forEach((plugin, index) => {
    const no = index + 1;
    const name = `\`${plugin.name}\``;
    const displayName = plugin.displayNameZh;
    const description = plugin.descriptionZh;
    
    markdown += `| ${no} | ${name} | ${displayName} | ${description} |\n`;
  });
  
  return markdown;
}

// 写入文件
function writeMarkdownFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf-8');
    log(`Successfully wrote to ${filePath}`, 'success');
  } catch (error) {
    log(`Error writing to ${filePath}: ${error.message}`, 'error');
  }
}

// 主函数
async function main() {
  log('=== Starting plugin list update ===', 'info');
  
  // 1. 读取所有文件夹
  const allFolders = await getAllPluginFolders();
  
  // 2. 预处理插件列表
  const pluginFolders = preprocessPluginList(allFolders);
  
  // 3. 构建插件数据
  const pluginData = buildPluginData(pluginFolders);
  
  if (pluginData.length === 0) {
    log('No plugin data found!', 'error');
    return;
  }
  
  // 4. 生成并写入英文版
  const enMarkdown = generateEnglishMarkdown(pluginData);
  writeMarkdownFile(EN_PLUGIN_LIST_PATH, enMarkdown);
  
  // 5. 生成并写入中文版
  const zhMarkdown = generateChineseMarkdown(pluginData);
  writeMarkdownFile(ZH_PLUGIN_LIST_PATH, zhMarkdown);
  
  log('=== Plugin list update completed ===', 'success');
  log(`Total plugins processed: ${pluginData.length}`, 'info');
}

// 运行主函数
main().catch(error => {
  log(`Unexpected error: ${error.message}`, 'error');
  process.exit(1);
});
