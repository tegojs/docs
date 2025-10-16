# Markdown 合并处理工具

将 `docs/zh/guides/` 目录下的所有 Markdown 文件合并并处理为单个文档，方便后续转换为 PDF 或其他格式。

## 📋 快速开始

### 环境要求

- Node.js >= 14.x
- pnpm (或 npm / yarn)

### 基本用法

```bash
# 运行完整处理流程（容错模式）
pnpm merge-md

# 运行严格模式（遇到错误立即停止）
pnpm merge-md --strict
```

**运行模式**：
- **容错模式**（默认）：遇到错误（如文件读取失败、文件过大）会记录警告但继续处理
- **严格模式** (`--strict`)：遇到任何错误立即停止，适合调试或要求零错误的场景

**输出位置**:
- `dist/pdf/{taskId}/Tego-Guides-zh-YYYY.MM.DD.md` - 带日期的最终文件 ⭐
- `dist/pdf/{taskId}/3-3-images-processed.md` - 处理后的文件
- `dist/pdf/latest/Tego-Guides-zh-YYYY.MM.DD.md` - 最新版本（快捷访问）⭐

---

## 🏗️ 架构说明

### 目录结构

```
scripts/merge-md/
├── index.js                   # 主入口，协调三个处理步骤
├── README.md                  # 本文档
├── steps/                     # 处理步骤（按顺序执行）
│   ├── 1-merge-guides.js     # 步骤1：合并 Markdown
│   ├── 2-process-links.js    # 步骤2：处理内部链接
│   └── 3-process-images.js   # 步骤3：处理图片路径
└── assets/                    # 资源文件
    ├── header.md             # PDF 头部模板
    └── tegodocs.css          # Typora 主题文件（基于 GitHub 主题）
```

### 处理流程

```
docs/zh/guides/**/*.md
         ↓
[步骤1] 合并 Markdown
         ↓
  1-7-merged.md
         ↓
[步骤2] 处理内部链接
         ↓
  2-3-links-processed.md
         ↓
[步骤3] 处理图片路径
         ↓
  3-3-images-processed.md ⭐ 最终输出
```

---

## 🔧 详细功能说明

### 步骤 1：合并 Markdown (`1-merge-guides.js`)

**输入**: `docs/zh/guides/**/*.md` 和 `*.mdx`

**输出**: `dist/pdf/{taskId}/1-7-merged.md`

**限制**:
- 单个文件大小限制：10 MB
- 超过限制的文件会被跳过（容错模式）或导致失败（严格模式）

**功能**:
1. 按顺序合并文件
2. 调整标题层级
3. 处理相对路径
4. 转换提示框语法
5. 处理 MDX 文件

#### 1.1 按顺序合并文件

- 读取每个目录的 `_meta.json` 确定处理顺序
- 配置格式为**数组**，数组元素可以是：
  - **字符串**：表示文件名（不含扩展名），如 `"introduction"`
  - **对象**：表示子目录，需包含 `type: "dir"`、`name` 和 `label` 属性
  
  ```json
  [
    "env",
    {"type": "dir", "name": "database", "label": "数据建模"},
    "quick-start"
  ]
  ```
- **只处理** `_meta.json` 中明确列出的文件和目录
- 跳过规则：
  - 不在 `_meta.json` 中的文件
  - 以 `.bak` 结尾的备份文件
  - 代码块内的内容不处理

#### 1.2 调整标题层级

根据文件在目录树中的深度自动调整标题层级：

```
目录结构:
docs/zh/guides/
├── _meta.json          (定义顺序)
├── start/              (深度1，对象类型)
│   ├── _meta.json
│   └── introduction.md (深度1，字符串类型)
└── advanced/           (深度1)
    └── database/       (深度2)
        └── field.md    (深度2)

处理后:
## 开始                 (目录标题，H2 = depth+1)
### 简介                (文件H1→H3 = H1+depth+1)
## 进阶                 (目录标题，H2)
### 数据建模            (目录标题，H3 = depth+1)
#### 字段               (文件H1→H4 = H1+depth+1)
```

**规则**:
- 目录（对象类型）：添加标题，层级 = `depth + 1`
- 文件（字符串类型）：不添加额外标题，只调整内部标题层级 = `原层级 + depth + 1`
- 标题层级处理：
  - H1-H6：正常标题，保留语义和锚点功能
  - H7：转换为**加粗文本**（自动处理，不记录日志）
  - H8：转换为**_加粗斜体_**（自动处理，不记录日志）
  - H9+：转换为**_加粗斜体_**（记录到日志，需要优化）

**⚠️ 注意**：H7 及以上标题转换为加粗文本后会**失去标题语义和锚点功能**，这意味着：
- 无法被 Typora/Pandoc 识别为标题
- 不会出现在目录中
- 不会生成锚点 ID
- **内部链接无法跳转到这些位置**

强烈建议避免出现 H7+ 的情况。如果出现，请优化文档结构：
1. 减少 `_meta.json` 中的目录嵌套深度
2. 降低源 Markdown 文件中的标题层级
3. 考虑拆分复杂文档为多个独立文件

#### 1.3 处理相对路径

在合并时立即转换相对路径（因为此时知道文件位置）：

**链接转换**:
```markdown
# 当前文件: docs/zh/guides/start/introduction.md
[详情](./quick-start.html)     → [详情](/guides/start/quick-start.html)
[进阶](../advanced/env.html)   → [进阶](/guides/advanced/env.html)
```

**图片转换**:
```markdown
# 当前文件: docs/zh/guides/start/introduction.md
![图](./screenshot.png)        → ![图](/guides/start/screenshot.png)
![图](../assets/logo.png)      → ![图](/guides/assets/logo.png)
```

#### 1.4 处理特殊语法

**提示框转换**：

将 VuePress/Docusaurus 风格的提示框转换为标准 Markdown 引用块，支持以下格式：

```markdown
# 格式1: {title=xxx}
:::info{title=提示}
内容
:::

# 格式2: 冒号后有空格 + 类型 + 标题
::: warning &#9888; 警告
内容
:::

# 格式3: 冒号后无空格 + 类型 + 标题
:::tip 小技巧
内容
:::

# 格式4: 仅类型（使用默认标题）
:::note
内容
:::

# 转换后（统一格式）
> **ℹ️ 提示**
>
> 内容

> **⚠️ &#9888; 警告**
>
> 内容

> **💡 小技巧**
>
> 内容

> **📝 注意**
>
> 内容
```

**说明**：
- 支持 `:::` 和类型之间有或没有空格
- 支持类型后跟标题文本（可包含 HTML 实体如 `&#9432;`）
- 如果没有指定标题，使用类型的默认标题

**支持的提示框类型**：
- `info` → ℹ️ 提示
- `tip` → 💡 技巧
- `warning` → ⚠️ 警告
- `danger` → 🚫 危险
- `note` → 📝 注意
- `caution` → ⚡ 小心
- `important` → ❗ 重要
- `success` → ✅ 成功

**JSX 组件和特殊标签清理**：

脚本会自动删除普通 `.md` 文件中的 JSX 组件和特殊 HTML 标签，并添加统一的友好提示（包含在线文档链接）：

```markdown
# 原格式
<PluginInfo name="file-manager"></PluginInfo>
<embed src="./env-note.md"></embed>

# 转换后（统一提示，包含在线文档链接）
> **📌 交互式内容**
>
> 此处包含交互式内容，仅在在线文档中可用。
>
> 💡 **查看完整内容**：[https://tachybase.org/guides/advanced/...](https://tachybase.org/guides/advanced/...)
```

链接会自动根据当前文件路径生成，指向对应的在线文档页面。

#### 1.5 处理 MDX 文件

MDX（Markdown + JSX）文件处理：
- 删除 `import` 语句
- 删除 JSX 组件标签
- 保留标题和普通文本
- 添加统一的提示信息（与普通 MD 文件的特殊标签处理一致，包含在线文档链接）：

```markdown
> **📌 交互式内容**
>
> 此处包含交互式内容，仅在在线文档中可用。
>
> 💡 **查看完整内容**：[https://tachybase.org/guides/basic/...](https://tachybase.org/guides/basic/...)
```

链接会根据源文件路径自动生成。

**日志输出**:
- `1-1-skipped-files.json` - 跳过的文件
- `1-2-mdx-processed.json` - MDX 处理记录
- `1-3-relative-links.json` - 相对路径链接转换详情
- `1-4-relative-images.json` - 相对路径图片转换详情
- `1-5-missing-meta.json` - 缺失的 `_meta.json` 文件
- `1-6-heading-overflow.json` - 深层标题（H9+）详情

---

### 步骤 2：处理内部链接 (`2-process-links.js`)

**输入**: `dist/pdf/{taskId}/1-7-merged.md`

**输出**: `dist/pdf/{taskId}/2-3-links-processed.md`

**功能**: 将内部链接（`/guides/...`）转换为文档内锚点（`#...`）

**处理规则**（按优先级从高到低）:

#### 规则 1：手动映射（最高优先级）

```json
// link-mapping.json
{
  "mappings": {
    "/guides/advanced/env.html#db_dialect": "数据库配置"
  }
}
```
直接使用配置的映射。

#### 规则 2：保留锚点

```markdown
[数据库](/guides/advanced/env.html#db_dialect)
         ↓
[数据库](#db_dialect)
```
如果 URL 包含 `#`，直接提取并保留锚点部分。

#### 规则 3：读取源文件一级标题

```markdown
[插件详情](/guides/advanced/cloud-component/server.html)
         ↓
1. 定位源文件: docs/zh/guides/advanced/cloud-component/server.md
2. 读取第一个 # 标题: "服务端插件"
3. 转换为锚点: [插件详情](#服务端插件)
```

**锚点 ID 生成规则**（Pandoc 兼容）:
- 转小写
- 空格转 `-`
- 移除特殊符号
- 保留中文、字母、数字、下划线、短横线

**关于重复标题的锚点**：
- 脚本**不会**对重复的标题 ID 进行去重处理
- Typora/Pandoc 在生成 PDF 时会自动处理重复标题（添加 `-1`, `-2` 等后缀）
- 如果有链接指向重复标题，可能需要使用 `link-mapping.json` 手动映射到正确的标题

#### 规则 4：使用链接文本（兜底）

```markdown
[环境变量](/guides/unknown/path.html)
         ↓
[环境变量](#环境变量)
```
确保所有链接都能转换（即使可能跳转不到）。

**日志输出**:
- `2-1-links.json` - 转换详情（包含规则统计）
- `2-2-links-skipped.json` - 找不到源文件的链接

---

### 步骤 3：处理图片路径 (`3-process-images.js`)

**输入**: `dist/pdf/{taskId}/2-3-links-processed.md`

**输出**: `dist/pdf/{taskId}/3-3-images-processed.md` ⭐ **最终输出**

**功能**: 将图片 URL 路径转换为本地绝对路径

**处理规则**:

#### 场景 1：URL 路径（以 `/` 开头）

```markdown
![截图](/homepage/screenshot.png)
       ↓
1. 拼接路径: docs/public + /homepage/screenshot.png
2. 检查文件: docs/public/homepage/screenshot.png
3. 如果存在: ![截图](D:/Dev/TegoJS/docs/docs/public/homepage/screenshot.png)
4. 如果不存在: 记录到 images-missing.json，保留原样
```

#### 场景 2：外部链接（http/https）

```markdown
![logo](https://example.com/logo.png)
# 保持不变
```

#### 场景 3：相对路径

```markdown
![图](./image.png)
# 已在步骤1处理，这里跳过
```

**日志输出**:

`3-1-images.json` - 成功处理的图片：
```json
{
  "alt": "截图",
  "originalPath": "/homepage/screenshot.png",
  "absolutePath": "D:/Dev/TegoJS/docs/docs/public/homepage/screenshot.png",
  "exists": true,
  "fileSize": "245.67 KB"
}
```

`3-2-images-missing.json` - 缺失的图片：
```json
{
  "alt": "缺失图片",
  "originalPath": "/missing/image.png",
  "expectedPath": "docs/public/missing/image.png",
  "reason": "file_not_found"
}
```

---

## 📂 输出文件清单

每次运行会在 `dist/pdf/{taskId}/` 目录下生成：

```
dist/pdf/1728825025/              # 任务ID = 10位时间戳
├── 1-1-skipped-files.json        # 步骤1：跳过的文件
├── 1-2-mdx-processed.json        # 步骤1：MDX 处理日志
├── 1-3-relative-links.json       # 步骤1：相对路径链接转换
├── 1-4-relative-images.json      # 步骤1：相对路径图片转换
├── 1-5-missing-meta.json         # 步骤1：缺失的 _meta.json
├── 1-6-heading-overflow.json     # 步骤1：深层标题（H9+）详情
├── 1-7-merged.md                 # 步骤1：合并后的文档
├── 2-1-links.json                # 步骤2：链接处理详情
├── 2-2-links-skipped.json        # 步骤2：跳过的链接
├── 2-3-links-processed.md        # 步骤2：处理链接后
├── 3-1-images.json               # 步骤3：图片处理详情
├── 3-2-images-missing.json       # 步骤3：缺失的图片
├── 3-3-images-processed.md       # 步骤3：处理图片后
└── Tego-Guides-zh-2025.10.15.md  # 带日期的最终文件 ⭐
```

同时会创建 `dist/pdf/latest/` 副本（指向最新运行结果）。

**文件说明**:
- `3-3-images-processed.md` - 原始处理文件
- `Tego-Guides-zh-YYYY.MM.DD.md` - 带日期的副本，方便识别版本和分发

**优点**:
- ✅ 每步输出独立保留，方便调试
- ✅ 不会覆盖历史记录
- ✅ 可以对比不同运行的差异
- ✅ 带日期的文件名，方便版本管理
- ✅ `latest/` 提供快捷访问

---

## 🔍 关键技术细节

### 任务ID管理

```javascript
// 主脚本生成任务ID
const TASK_ID = Math.floor(Date.now() / 1000).toString(); // 10位时间戳

// 传递给子脚本
execSync(`node steps/1-merge-guides.js ${TASK_ID}`);

// 子脚本接收
const TASK_ID = process.argv[2];
const OUTPUT_DIR = path.join(ROOT_DIR, 'dist/pdf', TASK_ID);
```

**用途**:
- 标识一次完整的运行
- 所有中间文件保存在同一个任务ID目录
- 防止并发运行时的冲突

### 标题层级调整算法

```javascript
function processDirectory(dirPath, depth = 0) {
  // 读取 _meta.json
  const meta = readMetaJson(dirPath);
  
  for (const item of meta) {
    if (typeof item === 'object' && item.type === 'dir') {
      // 对象 → 目录
      // 添加目录标题：depth从0开始
      输出: '#'.repeat(depth + 1) + ' ' + item.label
      
      // 递归处理子目录
      processDirectory(path.join(dirPath, item.name), depth + 1)
      
    } else if (typeof item === 'string') {
      // 字符串 → 文件
      const content = readFile(item);
      
      // 调整文件内部标题层级
      const adjusted = content.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, text) => {
        当前层级 = hashes.length
        新层级 = Math.min(当前层级 + depth + 1, 6)  // 最多 H6
        return '#'.repeat(新层级) + ' ' + text
      });
      
      输出: adjusted
    }
  }
}
```

### 代码块保护

处理链接和图片时，自动跳过代码块内的内容：

```javascript
// 提取代码块位置（保护所有类型的代码块）
function extractCodeBlocks(content) {
  const blocks = [];
  
  // 1. 围栏代码块 (```) - 最高优先级
  const regex = /```[\s\S]*?```/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    blocks.push({
      start: match.index,
      end: match.index + match[0].length,
      type: 'fenced',
    });
  }
  
  // 2. 缩进代码块（连续的4空格或tab缩进行）
  // 检测时排除已在围栏代码块内的区域，避免重复检测
  // ... 详见源码
  
  // 3. 行内代码（单个或多个反引号）
  // 先匹配单反引号 `code`
  regex = /`[^`\n]+`/g;
  while ((match = regex.exec(content)) !== null) {
    // 检查是否在已有的代码块内
    const inExistingBlock = blocks.some(
      block => match.index >= block.start && match.index < block.end
    );
    if (!inExistingBlock) {
      blocks.push({
        start: match.index,
        end: match.index + match[0].length,
      });
    }
  }
  
  // 再匹配多反引号 ``code with ` backtick``
  regex = /``+[^\n]*?``+/g;
  while ((match = regex.exec(content)) !== null) {
    const inExistingBlock = blocks.some(
      block => match.index >= block.start && match.index < block.end
    );
    if (!inExistingBlock) {
      blocks.push({
        start: match.index,
        end: match.index + match[0].length,
      });
    }
  }
  
  return blocks;
}

// 检查偏移量是否在代码块内
function isInCodeBlock(offset, codeBlocks) {
  return codeBlocks.some(block => offset >= block.start && offset <= block.end);
}
```

### 路径解析

**路径处理工具函数**（所有步骤）:

为了统一处理跨平台路径（Windows `\` vs Unix `/`），提供了两个工具函数：

```javascript
// 文件系统路径 → URL 路径
function fileSystemPathToUrl(fsPath) {
  return fsPath.split(path.sep).join('/');
}

// URL 路径 → 文件系统路径
function urlPathToFileSystem(urlPath, basePath) {
  const parts = urlPath.split('/').filter(Boolean);
  return path.join(basePath, ...parts);
}
```

**相对路径转绝对路径**（步骤1）:
```javascript
function resolveRelativePath(currentDir, relativePath) {
  // docs/zh/guides/start/introduction.md + ./quick-start.html
  const absolutePath = path.join(currentDir, relativePath);
  
  // 转换为 URL 路径（使用工具函数）
  const relative = path.relative(path.join(ROOT_DIR, 'docs/zh'), absolutePath);
  return '/' + fileSystemPathToUrl(relative); // /guides/start/quick-start.html
}
```

**URL路径转源文件路径**（步骤2）:
```javascript
function urlToSourcePath(url) {
  // /guides/advanced/env.html → docs/zh/guides/advanced/env.md
  let cleanUrl = url.replace(/\.html$/, '').replace(/^\/guides\//, '');
  
  // 使用工具函数转换为文件系统路径
  const basePath = urlPathToFileSystem(cleanUrl, path.join(ROOT_DIR, 'docs', 'zh', 'guides'));
  
  // 尝试多种文件扩展名
  const candidates = [
    basePath + '.md',
    basePath + '.mdx',
    path.join(basePath, 'index.md'),
  ];
  
  return candidates.find(p => fs.existsSync(p)) || null;
}
```

**URL路径转文件系统路径**（步骤3）:
```javascript
function processUrlPath(url) {
  // /homepage/screenshot.png → docs/public/homepage/screenshot.png
  // 使用工具函数处理 URL 路径到文件系统路径的转换
  const imagePath = urlPathToFileSystem(url, PUBLIC_DIR);
  
  if (fs.existsSync(imagePath)) {
    // 转换为绝对路径
    return path.resolve(imagePath);
  }
  
  return null;
}
```

---

## 🎨 自定义配置

### 配置文件说明

所有配置文件都是**可选的**，不创建则使用默认行为。

### 1. 手动链接映射（可选）

**文件位置**: `link-mapping.json`（项目根目录）

**用途**: 自定义特定链接的转换规则，将内部链接映射到指定的锚点文本

**示例配置**:

```json
{
  "_comment": "手动链接映射配置文件（可选）",
  "_description": "用于处理特殊的链接转换需求，将内部链接映射到特定的锚点文本",
  "mappings": {
    "_example1": "映射格式：完整URL路径 -> 目标标题文本",
    "_example2": "/guides/advanced/env.html#db_dialect -> 数据库配置",
    "_note": "以下是实际映射，以 _ 开头的键会被忽略",
    "/guides/advanced/env.html#db_dialect": "数据库配置",
    "/guides/ui/form.html": "表单字段"
  }
}
```

**配置说明**:
- 以 `_` 开头的键会被忽略，可用于添加注释
- 映射优先级最高，会覆盖自动生成的锚点
- 键格式：完整的 URL 路径（可包含锚点）
- 值格式：目标标题的文本内容（将转换为锚点 ID）

**何时使用**:
- **重复标题**：文档中有多个同名标题，需要明确指定链接目标
- **链接跳转不正确**：自动转换的锚点无法正确跳转
- **自定义跳转**：需要将多个链接指向同一个标题
- **H7+ 标题**：指向被转换为加粗文本的深层标题（已失去锚点功能）

**工作原理**:
1. 脚本读取 `link-mapping.json` 中的映射关系
2. 对于配置中的链接，直接使用映射的标题文本生成锚点
3. 例如：`"/guides/advanced/env.html": "数据库配置"` → 链接转换为 `#数据库配置`

**注意**: 
- 大多数情况下**不需要**创建此文件，链接会自动处理
- 只有在遇到上述特殊情况时才需要手动配置
- 重复标题的锚点由 Typora/Pandoc 自动生成（如 `#配置`, `#配置-1`），脚本无法预测

### 2. PDF 头部模板

**文件位置**: `scripts/merge-md/assets/header.md`

**用途**: 定义生成 PDF 的封面页和元数据

**编辑方法**: 直接修改该文件

```markdown
---
title: 灵矶使用指南
author: TegoJS
creator: TegoJS
subject: 灵矶使用指南
keywords: [灵矶使用指南, Tego, 灵矶]
header: 灵矶使用指南 {{GENERATION_DATE}}
footer: ${pageNo} / ${totalPages}
---

<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>

<div align="center">
  <h1 style="font-size: 3em; margin: 2em 0 1em 0;">灵矶使用指南</h1>
</div>

<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>

<div align="center">
  <p style="font-size: 1.2em; color: #999;">{{GENERATION_DATE}}</p>
</div>

```

**模板变量**:
- `{{GENERATION_DATE}}` - 自动替换为生成日期（格式：YYYY.MM.DD）

**YAML Front Matter 说明**:
- `title`, `author`, `creator`, `subject`, `keywords` - PDF 元数据
- `header`, `footer` - 页眉页脚格式
  - `${pageNo}` - 当前页码
  - `${totalPages}` - 总页数

### 3. Typora 主题

**文件位置**: `scripts/merge-md/assets/tegodocs.css`

**用途**: 定义导出 PDF 时的样式

`scripts/merge-md/assets/tegodocs.css` 为本项目自定义的 Typora 主题文件，基于 [Typora 默认主题](https://github.com/typora/typora-default-themes) 中的 Github 主题，移除了标题下划线。

---

## 🚀 转换为 PDF

### 使用 Typora 导出（唯一推荐方式）

处理后的 Markdown 文件需要使用 Typora 导出为 PDF。

#### 1. 安装主题

文档推荐使用的主题为 `scripts/merge-md/assets/tegodocs.css`

主题基于 Typora 默认的 GitHub 主题修改，安装前请确认 Typora 自带的 GitHub 主题存在，即主题目录下有 `github/` 文件夹

然后将主题文件复制到 Typora 主题目录即可完成安装

#### 2. 配置 Typora 导出设置

打开 Typora → 文件 → 偏好设置 → 导出 → PDF：

**必需配置**:

- ✅ **勾选**: 按一级标题分页
- ✅ **勾选**: 允许 YAML front matters 覆盖当前设置
- 📌 **其他选项**: 保持默认设置

**主题选择**:

- 在 偏好设置 → 外观 → 主题 中选择 `TegoDocs`

#### 3. 导出 PDF

1. 用 Typora 打开最终输出文件：
   - `dist/pdf/latest/Tego-Guides-zh-YYYY.MM.DD.md` 
2. 文件 → 导出 → PDF
3. 选择保存位置和文件名
4. 等待导出完成

#### 4. 验证输出

检查生成的 PDF：
- ✅ 封面页显示正确（标题、日期）
- ✅ 每个一级标题开始新页
- ✅ 目录结构清晰
- ✅ 图片正常显示
- ✅ 代码块格式正确
- ✅ 页眉页脚显示正确（已经在头部的 YAML front matter 中配置）

---

**提示**:
- 不支持其他 PDF 生成工具（如 Pandoc、VS Code 插件等）
- TegoDocs 主题样式已针对灵矶文档优化
- 如需自定义样式，可编辑 `scripts/merge-md/assets/tegodocs.css`

---

## ❓ 常见问题

### Q: 运行时遇到错误怎么办？

**容错模式**（默认）会记录错误但继续处理。如需调试，使用 `pnpm merge-md --strict` 启用严格模式，这样遇到第一个错误就会停止。

### Q: 文件过大怎么办？

单个文件限制为 10 MB。如果文件过大：
1. 检查是否包含大量重复内容或图片（应使用链接）
2. 考虑拆分为多个文件
3. 在容错模式下，过大的文件会被自动跳过

### Q: 如何跳过某个文件？

从对应的 `_meta.json` 中移除该文件即可。脚本只处理 `_meta.json` 中明确列出的项目。

### Q: 如何调整章节顺序？

编辑对应的 `_meta.json`，调整数组顺序。

### Q: 图片显示不正常？

检查 `dist/pdf/{taskId}/3-2-images-missing.json`，查看哪些图片缺失。确保图片文件存在于 `docs/public/` 目录下。

### Q: 内部链接跳转失败？

查看 `dist/pdf/{taskId}/2-1-links.json`，检查链接转换规则。

**常见原因**：
1. **重复标题**：文档中有多个同名标题，Typora/Pandoc 会自动添加 `-1`, `-2` 后缀，但脚本无法预测
2. **H7+ 标题**：链接指向被转换为加粗文本的标题（已失去锚点功能）
3. **源文件找不到**：检查 `2-2-links-skipped.json` 查看找不到的文件

**解决方案**：
- 对于重复标题或 H7+ 标题：在根目录创建 `link-mapping.json`，手动映射链接到正确的标题
- 对于找不到的源文件：检查文件路径是否正确，是否在 `_meta.json` 中配置

### Q: 标题层级不对？

检查 `_meta.json` 配置，确保目录（对象类型）和文件（字符串类型）的区分正确。

### Q: 如何处理深层标题（H9+）的警告？

查看 `1-6-heading-overflow.json` 文件，里面详细列出了所有 H9 及以上标题的信息（包括文件路径、原始层级和标题内容）。

**自动兼容处理**：
- H7 自动转换为**加粗文本**（不记录日志）
- H8 自动转换为**_加粗斜体_**（不记录日志）
- H9+ 自动转换为**_加粗斜体_**（记录到日志，建议优化）

H7 和 H8 是合理的层级扩展，会自动处理。只有 H9 及以上才会记录到日志，表示文档结构可能过于复杂。

**⚠️ 重要说明**：
- **标题转换为加粗文本后，将失去 Markdown 标题的语义**
- **Typora/Pandoc 不会为加粗文本生成锚点**
- **如果有内部链接指向这些"标题"，跳转将会失败**
- 建议避免出现 H7+ 的情况，以确保文档内链接的完整性

**建议**：
1. 简化目录层级（减少嵌套深度）
2. 降低源文件中的标题层级（使用 H1-H3）
3. 重新组织文档结构，避免过深嵌套
4. 如果必须保留深层结构，考虑拆分为多个独立文档

### Q: MDX 文件内容丢失？

MDX 文件中的 JSX 组件会被移除（因为无法在 PDF 中展示）。查看 `1-2-mdx-processed.json` 了解处理详情。

### Q: 如何创建 link-mapping.json 配置文件？

大多数情况下**不需要**创建此文件，链接会自动处理。需要创建的情况：

1. **遇到重复标题**：文档中有多个同名标题，链接跳转到了错误的位置
2. **H7+ 深层标题**：链接指向被转换为加粗文本的标题（已失去锚点）
3. **自定义跳转需求**：需要特殊的链接映射逻辑

参见"自定义配置 > 手动链接映射"章节了解详细配置方法。

### Q: 支持哪些操作系统？

支持 Windows、macOS 和 Linux。脚本会自动处理不同系统的路径分隔符差异。

