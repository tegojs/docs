#!/usr/bin/env node

/**
 * 终端颜色工具
 * 使用 ANSI 转义码，无需额外依赖
 */

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  
  // 前景色
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  
  // 背景色
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
};

// 便捷方法
const c = {
  // 状态标记
  success: (text) => `${colors.green}${text}${colors.reset}`,
  error: (text) => `${colors.red}${text}${colors.reset}`,
  warning: (text) => `${colors.yellow}${text}${colors.reset}`,
  info: (text) => `${colors.cyan}${text}${colors.reset}`,
  
  // 强调
  bold: (text) => `${colors.bright}${text}${colors.reset}`,
  dim: (text) => `${colors.dim}${text}${colors.reset}`,
  
  // 颜色
  red: (text) => `${colors.red}${text}${colors.reset}`,
  green: (text) => `${colors.green}${text}${colors.reset}`,
  yellow: (text) => `${colors.yellow}${text}${colors.reset}`,
  blue: (text) => `${colors.blue}${text}${colors.reset}`,
  magenta: (text) => `${colors.magenta}${text}${colors.reset}`,
  cyan: (text) => `${colors.cyan}${text}${colors.reset}`,
  gray: (text) => `${colors.gray}${text}${colors.reset}`,
  
  // 组合样式
  step: (text) => `${colors.bright}${colors.cyan}${text}${colors.reset}`,
  title: (text) => `${colors.bright}${colors.blue}${text}${colors.reset}`,
  highlight: (text) => `${colors.bright}${colors.yellow}${text}${colors.reset}`,
  path: (text) => `${colors.magenta}${text}${colors.reset}`,
  number: (text) => `${colors.cyan}${text}${colors.reset}`,
};

module.exports = { colors, c };

