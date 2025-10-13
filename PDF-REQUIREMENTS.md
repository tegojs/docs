# 📋 PDF 生成需求文档

## 🎯 核心目标

将 `docs/zh/guides/` 目录下的所有 markdown 文件生成为**一个 PDF**，要求：
1. 有可点击跳转的目录（TOC）
2. 内部链接能正确跳转
3. 文档结构清晰，层级分明

---

## 📁 处理范围

**输入**: `docs/zh/guides/**/*.md` 和 `*.mdx`

**输出**: `dist/pdf/guides-zh.pdf`

---

## 🔧 技术方案

**Pandoc + XeLaTeX**
- Pandoc: Markdown → PDF 转换
- XeLaTeX: 中文支持
- 字体: Microsoft YaHei（微软雅黑）

---

## 📝 实现步骤（6个步骤）

### 步骤 1：合并 Markdown

**脚本**: `scripts/merge-guides.js`

**输入**: `docs/zh/guides/**/*.md` 和 `*.mdx`

**输出**: `dist/pdf/{taskId}/1-merged.md`
- `{taskId}`: 任务ID，使用10位数时间戳（在脚本开始时生成，全程使用）
- 保留每次运行的结果

**额外日志输出**:
- `dist/pdf/{taskId}/1-skipped-files.json` - 跳过的文件
- `dist/pdf/{taskId}/1-mdx-processed.json` - MDX 处理记录

**功能要求**:

#### 1.1 按顺序合并文件

**首先添加 PDF 总标题**:
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
- 记录处理详情到 `1-mdx-processed.json`

**跳过规则**:
- **不在 `_meta.json` 中的文件一律跳过** → 记录到 `1-skipped-files.json`
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

**输入**: `dist/pdf/{taskId}/1-merged.md`

**输出**: 
- `dist/pdf/{taskId}/2-links-processed.md`
- `dist/pdf/{taskId}/2-links.json`（日志）
- `dist/pdf/{taskId}/2-links-skipped.json`（跳过的，应该没有）

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
3. 在合并的 MD 中查找该标题对应的 Pandoc ID
4. 转换: [插件详情](#服务端插件)
```

**Pandoc ID 生成规则**:
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

**输入**: `dist/pdf/{taskId}/2-links-processed.md`

**输出**: 
- `dist/pdf/{taskId}/3-images-processed.md`（处理后的文档）
- `dist/pdf/{taskId}/3-images.json`（处理日志）
- `dist/pdf/{taskId}/3-images-missing.json`（缺失的图片）

**功能要求**:

#### 3.1 图片路径处理

**问题**: 图片链接是 URL 路径，PDF 需要本地绝对路径

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

**成功处理的图片** (`images-processed.json`):
```json
[
  {
    "originalPath": "/homepage/screenshot.png",
    "absolutePath": "D:/Dev/TegoJS/docs/docs/public/homepage/screenshot.png",
    "exists": true,
    "fileSize": "245 KB"
  }
]
```

**缺失的图片** (`images-missing.json`):
```json
[
  {
    "originalPath": "/missing/image.png",
    "expectedPath": "docs/public/missing/image.png",
    "sourceFile": "可能的来源文件（如果能追踪）"
  }
]
```

#### 3.4 控制台输出

```
🖼️  处理图片路径...

📁 扫描图片链接...
   找到 89 个图片引用

📊 图片处理统计:
  ✓ 成功转换: 85 个
  ⚠️  找不到文件: 4 个

✓ 已保存处理日志: dist/pdf/images-processed.json
⚠️  已保存缺失图片: dist/pdf/images-missing.json

⚠️  以下图片文件不存在:
  1. /missing/screenshot.png
     期望位置: docs/public/missing/screenshot.png
  2. /another/image.png
     期望位置: docs/public/another/image.png
  ...

💡 提示: 请检查这些图片是否存在或路径是否正确
```

---

### 步骤 4：处理特殊字符

**在主脚本中执行**（不单独成脚本）

**输入**: `dist/pdf/{taskId}/3-images-processed.md`

**输出**: `dist/pdf/{taskId}/4-cleaned.md`

**功能**:
- 移除 emoji 字符（避免字体不支持）
- 移除其他可能导致 LaTeX 错误的特殊 Unicode 字符
- 清理多余空格

**处理内容**:
```javascript
content = content
  // 移除 emoji 范围
  .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
  .replace(/[\u{2600}-\u{27BF}]/gu, '')
  .replace(/[\u{1F000}-\u{1F6FF}]/gu, '')
  .replace(/[\u{1F900}-\u{1F9FF}]/gu, '')
  // 移除其他问题字符
  .replace(/[\u{2640}\u{2642}\u{2695}-\u{2699}\u{26A0}-\u{26FF}]/gu, '')
  .replace(/[\u{2700}-\u{27BF}]/gu, '')
  // 清理空格
  .replace(/  +/g, ' ');

// 保存到独立文件
fs.writeFileSync('dist/pdf/{taskId}/4-cleaned.md', content, 'utf-8');
```

**统计输出**:
```
🧹 清理特殊字符...
  ✓ 移除了 23 个 emoji 字符
  ✓ 清理了多余空格
  ✓ 输出: dist/pdf/{taskId}/4-cleaned.md
```

---

### 步骤 5：检查工具

**在主脚本中执行**（不单独成脚本）

**功能**:
检查必需的工具是否已安装

**检查项**:
1. **Pandoc**
   ```bash
   pandoc --version
   ```
   - 如果不存在：提示安装 URL
   - 退出程序

2. **XeLaTeX**
   ```bash
   xelatex --version
   ```
   - 如果不存在：提示安装 MiKTeX 或 TeX Live
   - 退出程序

**输出**:
```
🔍 检查工具...
  ✓ Pandoc 3.1.2
  ✓ XeLaTeX 3.141592653
```

---

### 步骤 6：生成 PDF

**在主脚本中执行**

**输入**: `dist/pdf/{taskId}/4-cleaned.md`

**输出**: `dist/pdf/{taskId}/guides-zh.pdf`

**整合所有步骤**:

```
// 生成任务ID（在脚本最开始，全程使用）
const taskId = Math.floor(Date.now() / 1000).toString(); // 10位时间戳作为任务ID

const outputDir = `dist/pdf/${taskId}/`;
fs.mkdirSync(outputDir, { recursive: true });

步骤 1: 调用 merge-guides.js ${taskId}
        输入: docs/zh/guides/
        处理: 
          - 添加 PDF 总标题（H1）
          - 只处理 _meta.json 中列出的文件和目录
          - 调整标题层级
          - 处理相对路径
          - 处理 MDX 文件
        输出 → {outputDir}/1-merged.md
              {outputDir}/1-skipped-files.json
              {outputDir}/1-mdx-processed.json
   ↓
步骤 2: 调用 process-links.js ${taskId}
        输入: {outputDir}/1-merged.md
        输出 → {outputDir}/2-links-processed.md
              {outputDir}/2-links.json
              {outputDir}/2-links-skipped.json
   ↓
步骤 3: 调用 process-images.js ${taskId}
        输入: {outputDir}/2-links-processed.md
        输出 → {outputDir}/3-images-processed.md
              {outputDir}/3-images.json
              {outputDir}/3-images-missing.json
   ↓
步骤 4: 清理特殊字符
        输入: {outputDir}/3-images-processed.md
        输出 → {outputDir}/4-cleaned.md
   ↓
步骤 5: 检查工具（pandoc、xelatex）
   ↓
步骤 6: 调用 Pandoc
        输入: {outputDir}/4-cleaned.md
        输出 → {outputDir}/guides-zh.pdf
   ↓
步骤 7: 创建 latest 快捷访问
        复制到 dist/pdf/latest/

注意: 所有子脚本接收 taskId 作为参数
```

**Pandoc 命令**:

```bash
pandoc dist/pdf/{taskId}/4-cleaned.md \
  -o dist/pdf/{taskId}/guides-zh.pdf \
  --pdf-engine=xelatex \
  --toc \                    # 生成目录
  --toc-depth=3 \            # 目录深度
  --number-sections \        # 章节编号
  -V CJKmainfont="Microsoft YaHei" \
  -V geometry:margin=2cm \
  -V papersize=a4
```

---

## 📦 最终文件清单

### 脚本（4个）
```
scripts/
├── merge-guides.js        # 步骤 1：合并 + 标题调整 + 相对路径
├── process-links.js       # 步骤 2：内部链接处理
├── process-images.js      # 步骤 3：图片路径处理
└── generate-pdf.js        # 主入口：整合步骤 1-6
```

**说明**：
- 步骤 1-3：独立脚本，接收任务ID (taskId) 参数
- 步骤 4-6：集成在主脚本中
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
│   ├── 1-merged.md                   # 步骤1输出：合并后（含PDF总标题）
│   ├── 1-skipped-files.json          # 步骤1日志：跳过的文件
│   ├── 1-mdx-processed.json          # 步骤1日志：MDX 处理
│   ├── 2-links-processed.md          # 步骤2输出：处理链接后
│   ├── 2-links.json                  # 步骤2日志：链接处理详情
│   ├── 2-links-skipped.json          # 步骤2日志：跳过的链接
│   ├── 3-images-processed.md         # 步骤3输出：处理图片后
│   ├── 3-images.json                 # 步骤3日志：图片处理详情
│   ├── 3-images-missing.json         # 步骤3日志：缺失的图片
│   ├── 4-cleaned.md                  # 步骤4输出：清理后
│   └── guides-zh.pdf                 # 步骤6输出：最终 PDF ⭐
├── 1728825610/                        # 第二次运行（新的任务ID）
│   ├── 1-merged.md
│   ├── 2-links-processed.md
│   ├── ...
│   └── guides-zh.pdf
├── 1728830733/                        # 第三次运行（新的任务ID）
│   └── ...
└── latest/                            # 副本，指向最新运行的结果
    ├── 1-merged.md
    ├── 2-links-processed.md
    ├── ...
    └── guides-zh.pdf                 # 最新的 PDF（方便访问）
```

**优点**:
- ✅ **每步输出独立保留** - 可以查看任何中间步骤
- ✅ **不会覆盖** - 每次运行都有独立目录
- ✅ **方便对比** - 可以对比不同运行的差异
- ✅ **方便调试** - 出问题可以查看具体哪一步的输出
- ✅ **快捷访问** - `latest/` 总是指向最新结果

### 命令（4个）
```json
{
  "scripts": {
    "pdf": "node scripts/generate-pdf.js",
    "pdf:merge": "node scripts/merge-guides.js {taskId}",
    "pdf:links": "node scripts/process-links.js {taskId}",
    "pdf:images": "node scripts/process-images.js {taskId}"
  }
}
```

**说明**:
- `pdf`: 主命令，自动创建任务ID目录并执行全流程
- `pdf:merge/links/images`: 调试命令，需要传入任务ID参数
  - 例如: `pnpm pdf:merge 1728825025`
  - 例如: `pnpm pdf:links 1728825025`
  - 例如: `pnpm pdf:images 1728825025`

---

## ✨ PDF 功能特性

### 必需功能
- [x] 可点击的目录（3级深度）
- [x] 内部链接跳转
- [x] 图片路径处理（转换为本地绝对路径）
- [x] 章节编号
- [x] 中文支持
- [x] 标题层级自动调整

### 可选功能
- [x] 代码语法高亮
- [x] 蓝色可点击链接
- [x] 详细处理日志（链接、图片）
- [ ] 页眉页脚（未来）
- [ ] 封面页（未来）

---

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

### 检查文件存在性

```javascript
const imagePath = path.join(PUBLIC_DIR, urlPath);
if (fs.existsSync(imagePath)) {
  // 转换为绝对路径
  const absolutePath = path.resolve(imagePath);
  return `![${alt}](${absolutePath})`;
} else {
  // 记录缺失，保留原样
  logMissingImage(urlPath);
  return original;
}
```

---

## 🔍 关键细节

### 0. 任务ID管理

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

### 1. 标题层级调整算法

```javascript
// 伪代码
function main() {
  // 首先添加 PDF 总标题
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

### 2. 链接处理注意事项

- **先转换相对路径**（在合并时）
- **再处理绝对路径**（在链接处理时）
- **手动映射优先级最高**
- **不要瞎猜**：只用 4 个明确的规则

### 3. 图片处理注意事项

- **根目录**: `docs/public/`
- **只处理 URL 路径**：以 `/` 开头的
- **转换为绝对路径**: Windows 完整路径（如 `D:/...`）
- **检查存在性**: 不存在的记录到日志
- **不处理**:
  - 外部图片（http/https）
  - 相对路径图片（已在合并时处理）

### 4. 特殊字符处理（步骤4）

**需要移除的字符**:
- Emoji 字符（U+1F300-1F9FF 等范围）
- 特殊符号（U+2600-27BF 等）
- 零宽字符

**原因**:
- Microsoft YaHei 不支持 emoji
- 避免 LaTeX 编译错误
- 避免 Windows 控制台崩溃

**不会影响**:
- 中文字符
- 普通标点符号
- 代码内容

### 5. 工具检查（步骤5）

**必需工具**:
1. Pandoc（>= 2.0）
2. XeLaTeX（MiKTeX 或 TeX Live）

**检查逻辑**:
```javascript
try {
  execSync('pandoc --version', { stdio: 'pipe' });
  console.log('✓ Pandoc 已安装');
} catch {
  console.error('❌ Pandoc 未安装');
  console.log('下载: https://pandoc.org/installing.html');
  process.exit(1);
}

try {
  execSync('xelatex --version', { stdio: 'pipe' });
  console.log('✓ XeLaTeX 已安装');
} catch {
  console.error('❌ XeLaTeX 未安装');
  console.log('下载: https://miktex.org/download');
  process.exit(1);
}
```

### 6. 编码处理

- **合并输出**: UTF-8 with BOM
- **链接/图片处理输出**: UTF-8 without BOM
- **最终 markdown**: UTF-8 without BOM（给 Pandoc）

---

## 📊 预期输出示例

### 控制台输出

```
╔════════════════════════════════════════╗
║   Tachybase PDF Generator              ║
║   docs/zh/guides → guides-zh.pdf       ║
╚════════════════════════════════════════╝

任务 ID: 1728825025
输出目录: dist/pdf/1728825025/

[步骤 1/6] 合并 markdown...
  ✓ 找到 245 个文件
  ✓ 处理 2 个 MDX 文件
  ✓ 跳过 5 个文件（未在 meta 中）
  ✓ 跳过 2 个备份文件 (.bak)
  ✓ 调整标题层级
  ✓ 处理 12 个相对路径链接
  ✓ 处理 8 个相对路径图片
  ✓ 输出: 1-merged.md (6.8 MB)

[步骤 2/6] 处理内部链接...
  📁 扫描源文件: 245 个
  📚 手动映射: 0 个
  ✓ 转换 156 个链接
    - [规则1] 手动映射: 0
    - [规则2] 锚点: 45
    - [规则3] 源文件: 108
    - [规则4] 文本: 3
  ✓ 输出: 2-links-processed.md
  ✓ 日志: 2-links.json

[步骤 3/6] 处理图片路径...
  🖼️  扫描图片: 89 个
  ✓ 转换为绝对路径: 85 个
  ⚠️  找不到文件: 4 个
  ✓ 输出: 3-images-processed.md
  ✓ 日志: 3-images.json
  ⚠️  缺失: 3-images-missing.json

[步骤 4/6] 清理特殊字符...
  ✓ 移除 23 个 emoji
  ✓ 清理多余空格
  ✓ 输出: 4-cleaned.md

[步骤 5/6] 检查工具...
  ✓ Pandoc 3.1.2
  ✓ XeLaTeX 3.141592653

[步骤 6/6] 生成 PDF...
  ⏳ 编译中（约 3-5 分钟）...
  ✓ 成功！guides-zh.pdf (12.5 MB)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 全部完成！
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 输出目录: dist/pdf/1728825025/
📄 最终 PDF: dist/pdf/1728825025/guides-zh.pdf
🔗 快捷访问: dist/pdf/latest/guides-zh.pdf

完成！用时 4 分 32 秒
```

