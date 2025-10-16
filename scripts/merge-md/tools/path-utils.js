const path = require('path');

/**
 * 将文件系统路径转换为 URL 路径
 * @param {string} fsPath - 文件系统路径（可能包含 \ 或 /）
 * @returns {string} URL 路径（统一使用 /）
 */
function fileSystemPathToUrl(fsPath) {
  return fsPath.split(path.sep).join('/');
}

/**
 * 将 URL 路径转换为文件系统路径
 * @param {string} urlPath - URL 路径（使用 /）
 * @param {string} basePath - 基础路径
 * @returns {string} 文件系统路径
 */
function urlPathToFileSystem(urlPath, basePath) {
  const parts = urlPath.split('/').filter(Boolean);
  return path.join(basePath, ...parts);
}

module.exports = {
  fileSystemPathToUrl,
  urlPathToFileSystem,
};
