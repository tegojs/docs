# 配置文件说明

## Algolia 配置

### 配置文件位置

- **实际配置**: `config/algolia.config.ts`
- **示例配置**: `config/algolia.config.example.ts`

### 配置项说明

```typescript
{
  appId: string          // Algolia 应用 ID（公开的，可提交到代码仓库）
  indexName: string      // 搜索索引名称（公开的）
  apiKey: string         // 搜索 API Key（公开的，仅用于搜索，可提交到代码仓库）
  assistantId?: string   // AI Assistant ID（可选，见下方安全说明）
}
```

### assistantId 安全说明

**assistantId 的敏感性分析：**

1. **不是密钥**：assistantId 本身不是 API Key 或密码，只是一个标识符
2. **关联配置**：它关联到你的 Algolia Assistant 配置（LLM Provider、API Key 等）
3. **风险等级**：**低到中等**
   - 如果 Assistant 使用你自己的 OpenAI/Anthropic API Key，则应该保护
   - 如果只是公开的文档搜索，风险较低

**建议的处理方式：**

#### 场景 1: 公开文档网站（推荐放在配置文件中）

如果你的文档网站是公开的，Assistant 配置也是公开的，可以直接放在配置文件中：

```typescript
assistantId: 'uveOHn7M7pwm' // 可以直接提交到代码仓库
```

#### 场景 2: 需要保护 Assistant 配置（推荐使用环境变量）

如果 Assistant 关联到付费服务或敏感配置，使用环境变量：

```bash
# .env.local（不提交到 Git）
ALGOLIA_ASSISTANT_ID=uveOHn7M7pwm
```

#### 场景 3: 不需要 AI 功能

如果不需要 AI 搜索功能，可以留空：

```typescript
assistantId: undefined // 或不设置此字段
```

或者设置环境变量为空：

```bash
ALGOLIA_ASSISTANT_ID=
```

### 配置方式

#### 方式 1: 直接修改配置文件（推荐用于开发）

编辑 `config/algolia.config.ts`，修改配置值：

```typescript
export const algoliaConfig: AlgoliaConfig = {
  appId: 'YOUR_APP_ID',
  indexName: 'YOUR_INDEX_NAME',
  apiKey: 'YOUR_API_KEY',
  assistantId: 'YOUR_ASSISTANT_ID', // 可选
}
```

#### 方式 2: 使用环境变量（如果需要）

由于配置文件会在浏览器端运行，不能直接使用 `process.env`。

如果需要使用环境变量，可以：
1. 在构建时通过 CI/CD 替换配置文件
2. 或者修改 `config/algolia.config.ts` 文件直接使用你的配置值

**注意**：这些配置都是公开的，可以直接放在配置文件中，无需使用环境变量。

### 安全提示

⚠️ **重要**:

- `appId`、`indexName`、`apiKey` 都是公开的搜索配置，可以安全地提交到代码仓库
- `assistantId` 处理建议：
  - **公开文档网站**：可以直接放在配置文件中
  - **需要保护**：使用环境变量（如果 Assistant 关联到付费服务或敏感配置）
  - **不需要 AI**：可以留空或不设置
- 生产环境建议使用环境变量或 CI/CD 的 secrets 功能

### 更新配置后

修改配置后，需要重启开发服务器：

```bash
pnpm dev
```
