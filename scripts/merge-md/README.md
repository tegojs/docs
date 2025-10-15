# Markdown 合并处理工具

将 `docs/zh/guides/` 目录下的所有 Markdown 文件合并并处理为单个文档，方便后续转换为 PDF 或其他格式。

## 📋 快速开始

```bash
# 运行完整处理流程
pnpm merge-md
```

**输出位置**:
- `dist/pdf/{taskId}/3-3-images-processed.md` - 带时间戳的版本
- `dist/pdf/latest/3-3-images-processed.md` - 最新版本（快捷访问）⭐

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
    └── tegodocs.css          # Typora 样式文件
```

### 处理流程

```
docs/zh/guides/**/*.md
         ↓
[步骤1] 合并 Markdown
         ↓
  1-6-merged.md
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

**输出**: `dist/pdf/{taskId}/1-6-merged.md`

**功能**:

#### 1.1 按顺序合并文件

- 读取每个目录的 `_meta.json` 确定处理顺序
- 支持三种配置格式：
  ```json
  // 格式1: 对象数组（目录）
  [{"name": "start", "label": "开始", "type": "dir"}]
  
  // 格式2: 字符串数组（文件）
  ["introduction", "quick-start"]
  
  // 格式3: 混合数组
  ["env", {"type": "dir", "name": "database", "label": "数据建模"}]
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
- 最大层级限制为 H6

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

#### 1.4 处理 MDX 文件

MDX（Markdown + JSX）文件处理：
- 删除 `import` 语句
- 删除 JSX 组件标签
- 保留标题和普通文本
- 添加提示信息：
  - 纯组件页面：`> **📌 交互式内容** ...`
  - 混合内容：`> **注意**: 此部分包含交互式内容...`

**日志输出**:
- `1-1-skipped-files.json` - 跳过的文件
- `1-2-mdx-processed.json` - MDX 处理记录
- `1-3-relative-links.json` - 相对路径链接转换详情
- `1-4-relative-images.json` - 相对路径图片转换详情
- `1-5-missing-meta.json` - 缺失的 `_meta.json` 文件

---

### 步骤 2：处理内部链接 (`2-process-links.js`)

**输入**: `dist/pdf/{taskId}/1-6-merged.md`

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
├── 1-6-merged.md                 # 步骤1：合并后的文档
├── 2-1-links.json                # 步骤2：链接处理详情
├── 2-2-links-skipped.json        # 步骤2：跳过的链接
├── 2-3-links-processed.md        # 步骤2：处理链接后
├── 3-1-images.json               # 步骤3：图片处理详情
├── 3-2-images-missing.json       # 步骤3：缺失的图片
└── 3-3-images-processed.md       # 步骤3：最终输出 ⭐
```

同时会创建 `dist/pdf/latest/` 副本（指向最新运行结果）。

**优点**:
- ✅ 每步输出独立保留，方便调试
- ✅ 不会覆盖历史记录
- ✅ 可以对比不同运行的差异
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
// 提取代码块位置
function extractCodeBlocks(content) {
  const blocks = [];
  const regex = /```[\s\S]*?```/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    blocks.push({
      start: match.index,
      end: match.index + match[0].length,
    });
  }
  return blocks;
}

// 检查偏移量是否在代码块内
function isInCodeBlock(offset, codeBlocks) {
  return codeBlocks.some(block => offset >= block.start && offset <= block.end);
}
```

### 路径解析

**相对路径转绝对路径**（步骤1）:
```javascript
function resolveRelativePath(currentDir, relativePath) {
  // docs/zh/guides/start/introduction.md + ./quick-start.html
  const absolutePath = path.join(currentDir, relativePath);
  
  // 转换为 URL 路径
  const relative = path.relative(path.join(ROOT_DIR, 'docs/zh'), absolutePath);
  return '/' + relative.replace(/\\/g, '/'); // /guides/start/quick-start.html
}
```

**URL路径转源文件路径**（步骤2）:
```javascript
function urlToSourcePath(url) {
  // /guides/advanced/env.html → docs/zh/guides/advanced/env.md
  let cleanUrl = url.replace(/\.html$/, '').replace(/^\/guides\//, '');
  
  // 尝试多种文件扩展名
  const candidates = [
    path.join(ROOT_DIR, 'docs/zh/guides', cleanUrl + '.md'),
    path.join(ROOT_DIR, 'docs/zh/guides', cleanUrl + '.mdx'),
    path.join(ROOT_DIR, 'docs/zh/guides', cleanUrl, 'index.md'),
  ];
  
  return candidates.find(p => fs.existsSync(p)) || null;
}
```

**URL路径转文件系统路径**（步骤3）:
```javascript
function processUrlPath(url) {
  // /homepage/screenshot.png → docs/public/homepage/screenshot.png
  const imagePath = path.join(PUBLIC_DIR, url);
  
  if (fs.existsSync(imagePath)) {
    // 转换为绝对路径
    return path.resolve(imagePath);
  }
  
  return null;
}
```

---

## 🎨 自定义配置

### 1. 手动链接映射

创建 `link-mapping.json`（项目根目录）：

```json
{
  "mappings": {
    "/guides/advanced/env.html#db_dialect": "数据库配置",
    "/guides/ui/form.html": "表单字段"
  }
}
```

### 2. PDF 头部模板

编辑 `scripts/merge-md/assets/header.md`：

```markdown
<br>
<br>
<br>

<div align="center">
  <h1 style="font-size: 3em;">灵矶使用指南</h1>
  <p style="font-size: 1.2em; color: #999;">{{GENERATION_DATE}}</p>
</div>

<br>
<br>
<br>

---
```

`{{GENERATION_DATE}}` 会被自动替换为生成日期。

### 3. Typora 样式

使用 `scripts/merge-md/assets/tegodocs.css` 自定义 Typora 主题样式（用于本地预览和导出 PDF）。

---

## 🚀 后续转换为 PDF

处理后的 `3-3-images-processed.md` 可以使用多种工具转换为 PDF：

### 方式 1: Typora（推荐）

1. 用 Typora 打开 `dist/pdf/latest/3-3-images-processed.md`
2. 文件 → 导出 → PDF
3. 自定义样式（可选）：
   - 将 `scripts/merge-md/assets/tegodocs.css` 复制到 Typora 主题目录
   - 偏好设置 → 主题 → 选择 TegoDocs

### 方式 2: Pandoc

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

### 方式 3: VS Code 插件

安装 [Markdown PDF](https://marketplace.visualstudio.com/items?itemName=yzane.markdown-pdf) 插件：
1. 打开 `dist/pdf/latest/3-3-images-processed.md`
2. 右键 → Markdown PDF: Export (pdf)

### 方式 4: 在线工具

- [Typora](https://typora.io/)
- [Markdown PDF](https://www.markdowntopdf.com/)

---

## ❓ 常见问题

### Q: 如何跳过某个文件？

从对应的 `_meta.json` 中移除该文件即可。脚本只处理 `_meta.json` 中明确列出的项目。

### Q: 如何调整章节顺序？

编辑对应的 `_meta.json`，调整数组顺序。

### Q: 图片显示不正常？

检查 `dist/pdf/{taskId}/3-2-images-missing.json`，查看哪些图片缺失。确保图片文件存在于 `docs/public/` 目录下。

### Q: 内部链接跳转失败？

查看 `dist/pdf/{taskId}/2-1-links.json`，检查链接转换规则。如需手动配置，编辑根目录的 `link-mapping.json`。

### Q: 标题层级不对？

检查 `_meta.json` 配置，确保目录（对象类型）和文件（字符串类型）的区分正确。

### Q: MDX 文件内容丢失？

MDX 文件中的 JSX 组件会被移除（因为无法在 PDF 中展示）。查看 `1-2-mdx-processed.json` 了解处理详情。

---

## 🔧 开发说明

### 依赖

**必需**:
- Node.js >= 16.0
- `chalk@4` - 终端颜色库（最流行、最广泛使用）

**可选**:
- `link-mapping.json` - 手动链接映射（项目根目录）

### 修改脚本

修改后运行测试：

```bash
# 运行完整流程
pnpm merge-md

# 检查输出
ls dist/pdf/latest/

# 查看日志
cat dist/pdf/latest/1-1-skipped-files.json
cat dist/pdf/latest/2-1-links.json
cat dist/pdf/latest/3-1-images.json
```

### 添加新功能

建议流程：
1. 在对应的步骤脚本中添加功能
2. 添加日志输出（JSON 格式）
3. 在控制台输出中添加统计信息
4. 更新本 README

---

## 📝 更新日志

- **v1.0** - 初始版本
  - 支持按 `_meta.json` 顺序合并
  - 自动调整标题层级
  - 处理内部链接和图片路径
  - 支持 MDX 文件
  - 完整的日志记录

---

## 📄 许可证

MIT License

