/**
 * Algolia DocSearch 配置示例文件
 *
 * 使用方法：
 * 1. 复制此文件为 algolia.config.ts
 * 2. 修改配置值为你的实际值
 *
 * 注意：
 * - 此文件会在浏览器端运行，不能使用 process.env
 * - 这些配置都是公开的，可以直接放在代码中
 * - 如需修改，直接编辑配置文件即可
 *
 * 安全说明：
 * - appId、indexName、apiKey 都是公开的，可以提交到代码仓库
 * - assistantId 建议：
 *   * 公开文档：可以直接放在配置文件中
 *   * 需要保护：可以通过构建脚本替换
 *   * 不需要 AI：设置为 undefined 或不设置
 *
 * 常见错误处理：
 * - 401 UNAUTHORIZED 错误：通常是因为：
 *   1. assistantId 不正确或无效
 *   2. 域名未在 Algolia Dashboard 中添加到白名单
 *   3. LLM API Key（OpenAI/Anthropic）未正确配置
 *   解决方案：
 *   - 检查 Algolia Dashboard 中的 Ask AI 配置
 *   - 确认域名已添加到白名单
 *   - 如果暂时不需要 AI 功能，设置 assistantId: undefined
 */

export interface AlgoliaConfig {
  appId: string;
  indexName: string;
  apiKey: string;
  assistantId?: string;
}

export const algoliaConfig: AlgoliaConfig = {
  appId: 'YOUR_APP_ID',
  indexName: 'YOUR_INDEX_NAME',
  apiKey: 'YOUR_API_KEY',
  // assistantId: 如果遇到 401 UNAUTHORIZED 错误，请：
  // 1. 检查 assistantId 是否正确（在 Algolia Dashboard 中查看）
  // 2. 确认域名已在 Ask AI 配置中添加到白名单
  // 3. 确认 LLM API Key（OpenAI/Anthropic）已正确配置
  // 4. 如果暂时不需要 AI 功能，设置为 undefined
  assistantId: undefined, // 或 'YOUR_ASSISTANT_ID'
}
