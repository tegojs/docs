# 📋 Markdown 处理需求文档

## 🎯 核心目标

将 `docs/zh/guides/` 目录下的所有 markdown 文件合并并处理为单个文档，要求：
1. 按目录结构有序合并
2. 内部链接转换为锚点格式
3. 图片路径转换为本地绝对路径
4. 文档结构清晰，层级分明

处理后的 Markdown 文件可以使用 Pandoc、Puppeteer 或其他工具转换为 PDF 或其他格式。

---

## 📁 处理范围

**输入**: `docs/zh/guides/**/*.md` 和 `*.mdx`

**输出**: `dist/pdf/{taskId}/3-3-images-processed.md`

---

## 📝 实现步骤（3个步骤）

### 步骤 1：合并 Markdown

**脚本**: `scripts/merge-guides.js`

**输入**: `docs/zh/guides/**/*.md` 和 `*.mdx`

**输出**: `dist/pdf/{taskId}/1-6-merged.md`
- `{taskId}`: 任务ID，使用10位数时间戳（在脚本开始时生成，全程使用）
- 保留每次运行的结果

**额外日志输出**:
- `dist/pdf/{taskId}/1-1-skipped-files.json` - 跳过的文件
- `dist/pdf/{taskId}/1-2-mdx-processed.json` - MDX 处理记录
- `dist/pdf/{taskId}/1-3-relative-links.json` - 相对路径链接转换详情
- `dist/pdf/{taskId}/1-4-relative-images.json` - 相对路径图片转换详情
- `dist/pdf/{taskId}/1-5-missing-meta.json` - 缺失的 _meta.json 文件

**功能要求**:

#### 1.1 按顺序合并文件

**首先添加文档总标题**:
```markdown
# 灵矶使用指南

```

**然后按顺序合并目录内容**:
- 读取每个目录的 `_meta.json`
- 按配置的顺序遍历文件和子目录
- 支持三种 `_meta.json` 格式：
  ```json
  // 格式1: 对象数组（目录）
  [{"name": "start", "label": "开始", "type": "dir"}]
  
  // 格式2: 字符串数组（文件）
  ["introduction", "quick-start"]
  
  // 格式3: 混合数组（文件+目录）
  ["env", {"type": "dir", "name": "database", "label": "数据建模"}]
  ```

**数组项类型判断规则**:
- **字符串** → 文件，尝试读取 `{name}.md` 或 `{name}.mdx`
- **对象** → 目录，使用对象的 `label` 字段作为目录标题

**MDX 文件处理** (MDX = Markdown + JSX):
- 提取静态 Markdown 部分（保留标题和普通文本）
- 删除 `import` 语句和 JSX 组件标签（如 `<Component />`）
- 添加提示信息：`> **注意**: 此部分包含交互式内容，在 PDF 版本中不可用。请访问在线文档查看完整内容。`
- 记录处理详情到 `1-2-mdx-processed.json`

**跳过规则**:
- **不在 `_meta.json` 中的文件一律跳过** → 记录到 `1-1-skipped-files.json`
  - 包括根目录的独立文件（如 `introduction.md`、`summary.md`）
  - 包括子目录中未列出的文件
- 以 `.bak` 结尾的备份文件（如 `card.mdx.bak`、`default.mdx.bak`）→ 跳过
- **代码块内的内容** → 不处理链接和图片（先提取代码块位置 \`\`\`...\`\`\`，处理时跳过这些区间）

**处理原则**:
- 只处理 `_meta.json` 中明确列出的文件和目录
- 按照 `_meta.json` 的顺序处理
- 规则统一，不做特殊处理

#### 1.2 调整标题层级 ⭐ 重点

**问题**: 每个 md 文件都有自己的 `#` `##` `###`，合并后会混乱

**解决方案**: 根据文件在目录树中的**深度**调整标题层级

**示例**:

```
目录结构:
docs/zh/guides/
├── _meta.json          (定义处理顺序)
├── introduction.md     (不在 _meta.json 中 → 跳过)
├── start/              (在 _meta.json 中，深度1)
│   ├── _meta.json
│   └── introduction.md
├── advanced/           (在 _meta.json 中，深度1)
│   ├── _meta.json
│   └── database/       (深度2)
│       ├── _meta.json
│       └── field.md
└── summary.md          (不在 _meta.json 中 → 跳过)

处理顺序和层级:
1. start/ 目录 (在 _meta.json 中，对象类型)
   - 添加目录标题: ## 开始 (使用对象的 label，深度1 → H2)
   
2. start/introduction.md (在 start/_meta.json 中，字符串类型，深度1)
   - 文件不添加额外标题，只调整内部标题层级
   - 原文件: # 简介  → 调整为: ### 简介  (H1 + depth=1 + 1 → H3)
   - 原文件: ## 什么  → 调整为: #### 什么 (H2 + depth=1 + 1 → H4)
   
3. advanced/ 目录 (在 _meta.json 中，对象类型)
   - 添加目录标题: ## 进阶 (使用对象的 label，深度1 → H2)
   
4. advanced/database/ 目录 (在 advanced/_meta.json 中，对象类型，深度2)
   - 添加目录标题: ### 数据建模 (使用对象的 label，深度2 → H3)
   
5. advanced/database/field.md (在 database/_meta.json 中，字符串类型，深度2)
   - 文件不添加额外标题，只调整内部标题层级
   - 原文件: # 字段  → 调整为: #### 字段  (H1 + depth=2 + 1 → H4)
   - 原文件: ## 类型  → 调整为: ##### 类型 (H2 + depth=2 + 1 → H5)
```

**规则**:
```
1. 目录（对象类型）:
   - 添加目录标题: 层级 = 深度 + 1
   - 标题文本使用对象的 label 字段

2. 文件（字符串类型）:
   - 不添加额外标题
   - 只调整文件内部标题层级: 新层级 = 原层级 + 深度 + 1

3. 限制: 最多到 H6

4. 注意: 只处理 _meta.json 中列出的项目
```

#### 1.3 处理相对路径（链接和图片）

**在合并时立即转换**，因为此时知道文件位置：

**链接**:
```markdown
当前文件: docs/zh/guides/start/introduction.md
[详情](./quick-start.html)     → [详情](/guides/start/quick-start.html)
[进阶](../advanced/env.html)   → [进阶](/guides/advanced/env.html)
```

**图片**:
```markdown
当前文件: docs/zh/guides/start/introduction.md
![图](./screenshot.png)        → ![图](/guides/start/screenshot.png)
![图](../assets/logo.png)      → ![图](/guides/assets/logo.png)
```

**解析方法**: 使用 `path.join(currentDir, relPath)` 解析

**注意**: 
- 此步骤转换为 URL 绝对路径（`/guides/xxx`）
- 图片的文件系统路径转换在步骤3完成
- 跳过代码块内的内容

---

### 步骤 2：处理内部链接

**脚本**: `scripts/process-links.js`

**输入**: `dist/pdf/{taskId}/1-6-merged.md`

**输出**: 
- `dist/pdf/{taskId}/2-3-links-processed.md`（处理后的文档）
- `dist/pdf/{taskId}/2-1-links.json`（转换详情日志）
- `dist/pdf/{taskId}/2-2-links-skipped.json`（找不到源文件的链接）

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

直接使用配置的映射，不做任何处理。

---

#### 规则 2：保留锚点

```markdown
[数据库](/guides/advanced/env.html#db_dialect)
         ↓
[数据库](#db_dialect)
```

如果 URL 包含 `#`，直接提取并保留 `#` 后面的部分

---

#### 规则 3：读取源文件一级标题

```markdown
[插件详情](/guides/advanced/cloud-component/server.html)
         ↓
1. 定位源文件: docs/zh/guides/advanced/cloud-component/server.md
2. 读取第一个 # 标题: "服务端插件"
3. 在合并的 MD 中查找该标题对应的锚点 ID
4. 转换: [插件详情](#服务端插件)
```

**锚点 ID 生成规则**:
- 小写
- 空格转 `-`
- 移除特殊符号
- 保留中文

---

#### 规则 4：使用链接文本（兜底）

```markdown
[环境变量](/guides/unknown/path.html)
         ↓
[环境变量](#环境变量)
```

确保所有链接都能转换（即使可能跳转不到）

---

### 步骤 3：处理图片路径

**脚本**: `scripts/process-images.js`

**输入**: `dist/pdf/{taskId}/2-3-links-processed.md`

**输出**: 
- `dist/pdf/{taskId}/3-3-images-processed.md`（处理后的文档）⭐ **最终输出**
- `dist/pdf/{taskId}/3-1-images.json`（处理日志）
- `dist/pdf/{taskId}/3-2-images-missing.json`（缺失的图片）

**功能要求**:

#### 3.1 图片路径处理

**问题**: 图片链接是 URL 路径，需要转换为本地绝对路径

**示例**:

```markdown
原始: ![截图](/homepage/screenshot.png)
       ↓
1. 拼接路径: docs/public + /homepage/screenshot.png
2. 检查文件: docs/public/homepage/screenshot.png
3. 如果存在: ![截图](D:/Dev/TegoJS/docs/docs/public/homepage/screenshot.png)
4. 如果不存在: 记录到 images-missing.json，保留原样
```

#### 3.2 处理规则

**URL 路径** (以 `/` 开头):
```markdown
![alt](/path/to/image.png)
  ↓ 检查
docs/public/path/to/image.png
  ↓ 存在？
![alt](完整绝对路径)
```

**相对路径** (已在步骤1处理，这里跳过):
```markdown
![alt](./image.png)  # 已在合并时处理
```

**外部链接** (http/https):
```markdown
![alt](https://example.com/image.png)  # 保持不变
```

#### 3.3 输出日志

**成功处理的图片** (`3-1-images.json`):
```json
[
  {
    "alt": "",
    "originalPath": "/homepage/screenshot.png",
    "absolutePath": "D:/Dev/TegoJS/docs/docs/public/homepage/screenshot.png",
    "exists": true,
    "fileSize": "245.67 KB"
  }
]
```

**缺失的图片** (`3-2-images-missing.json`):
```json
[
  {
    "alt": "缺失图片",
    "originalPath": "/missing/image.png",
    "expectedPath": "docs/public/missing/image.png",
    "reason": "file_not_found"
  }
]
```

---

## 📦 最终文件清单

### 脚本（4个）
```
scripts/
├── merge-guides.js        # 步骤 1：合并 + 标题调整 + 相对路径
├── process-links.js       # 步骤 2：内部链接处理
├── process-images.js      # 步骤 3：图片路径处理
└── process-markdown.js    # 主入口：整合步骤 1-3
```

**说明**：
- 步骤 1-3：独立脚本，接收任务ID (taskId) 参数
- 主脚本在开始时生成 taskId，并传递给所有子脚本
- 所有脚本都输出到同一个任务ID目录

### 配置（1个）
```
link-mapping.json          # 手动链接映射（可选）
```

### 输出目录结构

```
dist/pdf/
├── 1728825025/                        # 第一次运行（任务ID = 10位时间戳）
│   ├── 1-1-skipped-files.json        # 步骤1日志：跳过的文件
│   ├── 1-2-mdx-processed.json        # 步骤1日志：MDX 处理
│   ├── 1-3-relative-links.json       # 步骤1日志：相对路径链接转换
│   ├── 1-4-relative-images.json      # 步骤1日志：相对路径图片转换
│   ├── 1-5-missing-meta.json         # 步骤1日志：缺失的 _meta.json
│   ├── 1-6-merged.md                 # 步骤1输出：合并后（含总标题）
│   ├── 2-1-links.json                # 步骤2日志：链接处理详情
│   ├── 2-2-links-skipped.json        # 步骤2日志：跳过的链接
│   ├── 2-3-links-processed.md        # 步骤2输出：处理链接后
│   ├── 3-1-images.json               # 步骤3日志：图片处理详情
│   ├── 3-2-images-missing.json       # 步骤3日志：缺失的图片
│   └── 3-3-images-processed.md       # 步骤3输出：处理图片后 ⭐ 最终输出
├── 1728825610/                        # 第二次运行（新的任务ID）
│   ├── 1-1-skipped-files.json
│   ├── ...
│   └── 3-3-images-processed.md
├── 1728830733/                        # 第三次运行（新的任务ID）
│   └── ...
└── latest/                            # 副本，指向最新运行的结果
    ├── 1-1-skipped-files.json
    ├── ...
    └── 3-3-images-processed.md       # 最新的处理结果（方便访问）
```

**优点**:
- ✅ **每步输出独立保留** - 可以查看任何中间步骤
- ✅ **不会覆盖** - 每次运行都有独立目录
- ✅ **方便对比** - 可以对比不同运行的差异
- ✅ **方便调试** - 出问题可以查看具体哪一步的输出
- ✅ **快捷访问** - `latest/` 总是指向最新结果

### 命令

```bash
pnpm merge-md
```

**说明**:
- 主命令，自动创建任务ID目录并执行完整的处理流程
- 处理完成后，输出文件位于 `dist/pdf/latest/3-3-images-processed.md`

---

## 🔄 后续转换为 PDF

处理后的 `3-3-images-processed.md` 可以使用多种工具转换为 PDF：

### 方式 1: 使用 Pandoc

```bash
pandoc dist/pdf/latest/3-3-images-processed.md \
  -o output.pdf \
  --pdf-engine=xelatex \
  --toc \
  --toc-depth=3 \
  --number-sections \
  -V CJKmainfont="Microsoft YaHei" \
  -V geometry:margin=2cm \
  -V papersize=a4
```

### 方式 2: 使用在线工具

- [Typora](https://typora.io/) - 支持导出为 PDF
- [Markdown PDF](https://www.markdowntopdf.com/) - 在线转换

### 方式 3: 使用 VS Code 插件

- [Markdown PDF](https://marketplace.visualstudio.com/items?itemName=yzane.markdown-pdf)

### 方式 4: 使用 Puppeteer (自定义脚本)

你可以自己编写 Puppeteer 脚本，将 Markdown 渲染为 HTML 后再导出为 PDF。

---

## ✨ 处理功能特性

### 已实现功能
- [x] 按 `_meta.json` 顺序合并文件
- [x] 标题层级自动调整
- [x] 内部链接转换为锚点
- [x] 图片路径转换为本地绝对路径
- [x] MDX 文件处理
- [x] 相对路径处理
- [x] 详细处理日志（链接、图片、MDX）
- [x] 任务ID管理（支持多次运行）

---

## 🖼️ 图片处理细节

### 根目录配置

```javascript
const PUBLIC_DIR = path.join(__dirname, '../docs/public');
```

所有 URL 路径（`/xxx`）都相对于 `docs/public/`

### 路径转换示例

```markdown
# 场景 1: 正常的 URL 路径
![截图](/homepage/chatGroup.png)
  ↓ 检查
docs/public/homepage/chatGroup.png (存在)
  ↓ 转换
![截图](D:/Dev/TegoJS/docs/docs/public/homepage/chatGroup.png)

# 场景 2: 图片不存在
![图片](/missing/image.png)
  ↓ 检查
docs/public/missing/image.png (不存在)
  ↓ 记录到 images-missing.json，保留原样
![图片](/missing/image.png)

# 场景 3: 外部图片
![logo](https://example.com/logo.png)
  ↓ 保持不变
![logo](https://example.com/logo.png)

# 场景 4: 相对路径（已在合并时处理）
![图](./local.png)
  ↓ 已转换为绝对路径（在步骤1）
![图](/guides/current-dir/local.png)
  ↓ 再次检查（在步骤3）
docs/public/guides/current-dir/local.png
```

---

## 🔍 关键细节

### 1. 任务ID管理

**生成和传递**:
```javascript
// 主脚本 generate-pdf.js
const taskId = Math.floor(Date.now() / 1000).toString(); // 在最开始生成
console.log(`任务 ID: ${taskId}`);

// 传递给子脚本
execSync(`node scripts/merge-guides.js ${taskId}`);
execSync(`node scripts/process-links.js ${taskId}`);
execSync(`node scripts/process-images.js ${taskId}`);

// 子脚本接收
const taskId = process.argv[2]; // 从命令行参数获取
const OUTPUT_DIR = path.join(__dirname, '../dist/pdf', taskId);
```

**用途**:
- 标识一次完整的运行
- 所有中间文件都保存在同一个任务ID目录下
- 方便调试和追溯
- 防止并发运行时的冲突

### 2. 标题层级调整算法

```javascript
// 伪代码
function main() {
  // 首先添加文档总标题
  let output = '# 灵矶使用指南\n\n';
  
  // 然后处理目录树（从 depth = 1 开始）
  output += processDirectory('docs/zh/guides', 1);
  
  return output;
}

function processDirectory(dirPath, depth = 0) {
  // 读取当前目录的 _meta.json
  const meta = readMetaJson(dirPath);
  
  // 按 meta 中的顺序处理每一项
  for (const item of meta) {
    if (typeof item === 'object' && item.type === 'dir') {
      // 对象 → 目录
      // 添加目录标题
      输出: '#'.repeat(depth + 1) + ' ' + item.label
      
      // 递归处理子目录
      processDirectory(path.join(dirPath, item.name), depth + 1)
      
    } else if (typeof item === 'string') {
      // 字符串 → 文件
      // 尝试读取 .md 或 .mdx
      const content = readFile(item + '.md') || readFile(item + '.mdx');
      
      // 调整文件内部标题层级（不添加额外标题）
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

### 3. 链接处理注意事项

- **先转换相对路径**（在合并时）
- **再处理绝对路径**（在链接处理时）
- **手动映射优先级最高**
- **不要瞎猜**：只用 4 个明确的规则

### 4. 图片处理注意事项

- **根目录**: `docs/public/`
- **只处理 URL 路径**：以 `/` 开头的
- **转换为绝对路径**: Windows/Linux 完整路径
- **检查存在性**: 不存在的记录到日志
- **不处理**:
  - 外部图片（http/https）
  - 相对路径图片（已在合并时处理）

---

## 📊 预期输出示例

### 控制台输出

```
╔════════════════════════════════════════╗
║   灵矶 Markdown 处理器                 ║
║   合并并处理 docs/zh/guides            ║
╚════════════════════════════════════════╝

任务 ID: 1728825025
输出目录: dist/pdf/1728825025/

[步骤 1/3] 合并 markdown...
  ✓ 处理 245 个文件
  ✓ 处理 2 个 MDX 文件
  ✓ 跳过 5 个文件（未在 meta 中或备份文件）
  ✓ 转换 12 个相对路径链接
  ✓ 转换 8 个相对路径图片
  ✓ 输出: 1-6-merged.md (6.8 MB)
  ✓ 日志: 1-2~1-5.json (4个日志文件)

[步骤 2/3] 处理内部链接...
  📁 扫描内部链接...
  📚 手动映射: 0 个
  ✓ 转换 156 个链接
    - [规则1] 手动映射: 0
    - [规则2] 锚点: 45
    - [规则3] 源文件: 108
    - [规则4] 文本: 3
  ✓ 输出: 2-3-links-processed.md
  ✓ 日志: 2-1-links.json, 2-2-links-skipped.json

[步骤 3/3] 处理图片路径...
  🖼️  扫描图片链接...
  ✓ 找到 89 个图片引用
  ✓ 转换为绝对路径: 85 个
  ⚠️  找不到文件: 4 个
  ✓ 输出: 3-3-images-processed.md
  ✓ 日志: 3-1-images.json, 3-2-images-missing.json

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 全部完成！
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 输出目录: dist/pdf/1728825025/
📄 处理后的文件: dist/pdf/1728825025/3-3-images-processed.md
🔗 快捷访问: dist/pdf/latest/3-3-images-processed.md

💡 提示: 你可以使用 Pandoc、Puppeteer 或其他工具将处理后的 markdown 转换为 PDF
```

