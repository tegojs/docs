/**
 * Algolia DocSearch 配置
 *
 * 配置说明：
 * - appId: Algolia 应用 ID（公开的，可以提交到代码仓库）
 * - indexName: 搜索索引名称（公开的）
 * - apiKey: 搜索 API Key（公开的，仅用于搜索，可以提交到代码仓库）
 * - assistantId: AI Assistant ID（可选）
 *
 * 安全说明：
 * - appId、indexName、apiKey 都是公开的搜索配置，可以安全地提交到代码仓库
 * - assistantId 虽然不像 API Key 那样敏感，但建议：
 *   1. 如果 Assistant 关联到付费服务或特定配置，使用环境变量
 *   2. 如果只是公开的文档搜索，可以放在配置文件中
 *   3. 如果不需要 AI 功能，可以留空或删除
 *
 * 注意：此文件会在浏览器端运行，不能使用 process.env
 * 如需使用环境变量，请在构建时通过 Rspress 配置注入
 *
 * 如果遇到 "Authentication Fails, Your api key is invalid" 错误：
 *
 * 1. 检查 API Key 权限（最重要）：
 *    - 登录 Algolia Dashboard: https://www.algolia.com/dashboards
 *    - 进入你的应用，点击 "API Keys"
 *    - 点击你的 "Search API Key" (7fa5...4097d)
 *    - 检查 "ACL" (Access Control List) 权限，确保包含 "search" 权限
 *    - 检查 "Restrictions" 设置：
 *      * 如果有 "IP Addresses" 限制，需要添加你的服务器 IP 或移除限制
 *      * 如果有 "Referers" 限制，需要添加你的域名（如 https://tachybase.org/*）或移除限制
 *
 * 2. 确认配置匹配：
 *    - 确认使用的是 "Search-Only API Key"（不是 Admin API Key）
 *    - 确认 appId、indexName 和 apiKey 都匹配你的 DocSearch 应用
 *    - 确认 indexName 与 Dashboard 中的索引名称完全一致（包括空格）
 *
 * 3. 如果仍然失败：
 *    - 尝试在 Dashboard 中重新生成 Search API Key
 *    - 检查浏览器控制台的详细错误信息
 *    - 联系 Algolia 支持获取帮助
 */

export interface AlgoliaConfig {
  appId: string;
  indexName: string;
  apiKey: string;
  assistantId?: string;
}

// 直接使用配置值（浏览器端安全）
// 这些配置都是公开的，可以直接放在代码中
// 如需修改，直接编辑此文件即可
export const algoliaConfig: AlgoliaConfig = {
  appId: 'JDWAWLH8ZK',
  indexName: 'TachybaseDocsCrawler',
  apiKey: '7fa58420028fabdb3137142d61b4097d',
  // assistantId: 启用 AI 功能
  // 如果遇到 401 UNAUTHORIZED 错误，系统会自动降级到基础搜索功能
  // 要解决 401 错误，请：
  // 1. 检查 assistantId 是否正确
  // 2. 确认域名已在 Algolia Dashboard 中添加到白名单
  // 3. 确认 LLM API Key 已正确配置
  assistantId: 'Wky70IkEk8wa',
};

// 验证必需的配置项
if (!algoliaConfig.appId || !algoliaConfig.indexName || !algoliaConfig.apiKey) {
  console.warn(
    'Algolia DocSearch 配置不完整，请检查 config/algolia.config.ts 或环境变量',
  );
}
