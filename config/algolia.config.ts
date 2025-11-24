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
  appId: 'Q0I2R1AMX5',
  indexName: 'Tachybase Docs',
  apiKey: 'db4a2609cf948c8f5d33d6a423693482',
  // assistantId: 启用 AI 功能
  // 如果遇到 401 UNAUTHORIZED 错误，系统会自动降级到基础搜索功能
  // 要解决 401 错误，请：
  // 1. 检查 assistantId 是否正确
  // 2. 确认域名已在 Algolia Dashboard 中添加到白名单
  // 3. 确认 LLM API Key 已正确配置
  assistantId: 'uveOHn7M7pwm',
}

// 验证必需的配置项
if (!algoliaConfig.appId || !algoliaConfig.indexName || !algoliaConfig.apiKey) {
  console.warn(
    'Algolia DocSearch 配置不完整，请检查 config/algolia.config.ts 或环境变量',
  );
}
