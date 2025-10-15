# Markdown 处理脚本

将 `docs/zh/guides/` 目录下的 Markdown 文件合并并处理为单个文档，方便后续转换为 PDF 或其他格式。

## 快速开始

```bash
# 处理 Markdown（完整流程）
pnpm merge-md
```

处理后的文件位于 `dist/pdf/latest/3-3-images-processed.md`，你可以使用 Pandoc、Puppeteer 或其他工具将其转换为 PDF。

## 脚本说明

### 主脚本

- **`process-markdown.js`** - 主入口，执行完整处理流程（步骤1-3）
  - 自动生成任务ID（10位时间戳）
  - 依次调用所有子脚本
  - 合并、处理链接、处理图片路径

### 处理步骤

1. **合并 Markdown** (`merge-guides.js`)
   - 按 `_meta.json` 顺序合并文件
   - 调整标题层级
   - 处理相对路径
   - 处理 MDX 文件

2. **处理内部链接** (`process-links.js`)
   - 支持4种规则：手动映射、锚点、源文件标题、链接文本
   - 智能查找源文件
   - 转换为标准锚点格式

3. **处理图片路径** (`process-images.js`)
   - 转换 URL 路径为本地绝对路径
   - 检查文件是否存在
   - 记录缺失的图片

## 使用方法

```bash
pnpm merge-md
```

输出位置：
- `dist/pdf/{taskId}/3-3-images-processed.md` - 带时间戳的版本
- `dist/pdf/latest/3-3-images-processed.md` - 最新版本（快捷访问）

## 输出文件

每次运行会在 `dist/pdf/{taskId}/` 目录下生成：

```
dist/pdf/1728825025/
├── 1-1-skipped-files.json       # 步骤1：跳过的文件日志
├── 1-2-mdx-processed.json       # 步骤1：MDX 处理日志
├── 1-3-relative-links.json      # 步骤1：相对路径链接转换
├── 1-4-relative-images.json     # 步骤1：相对路径图片转换
├── 1-5-missing-meta.json        # 步骤1：缺失的 _meta.json
├── 1-6-merged.md                # 步骤1：合并后的 Markdown
├── 2-1-links.json               # 步骤2：链接处理详情
├── 2-2-links-skipped.json       # 步骤2：跳过的链接
├── 2-3-links-processed.md       # 步骤2：处理链接后
├── 3-1-images.json              # 步骤3：图片处理详情
├── 3-2-images-missing.json      # 步骤3：缺失的图片
└── 3-3-images-processed.md      # 步骤3：处理图片后（最终输出）⭐
```

## 后续转换为 PDF

处理后的 Markdown 文件可以使用多种工具转换为 PDF：

### 方式 1: 使用 Pandoc

```bash
pandoc dist/pdf/latest/3-3-images-processed.md \
  -o output.pdf \
  --pdf-engine=xelatex \
  --toc \
  -V CJKmainfont="Microsoft YaHei"
```

### 方式 2: 使用在线工具

- [Typora](https://typora.io/) - 支持导出为 PDF
- [Markdown PDF](https://www.markdowntopdf.com/) - 在线转换

### 方式 3: 使用 VS Code 插件

- [Markdown PDF](https://marketplace.visualstudio.com/items?itemName=yzane.markdown-pdf)

## 依赖工具

### 必需

1. **Node.js** (>= 16.0)
   - 用于运行脚本

### 可选

- **link-mapping.json** - 手动链接映射（根目录）

## 常见问题

### 如何跳过某个文件？

从对应的 `_meta.json` 中移除该文件即可。

### 如何调整章节顺序？

编辑对应的 `_meta.json`，调整数组顺序。

### 图片显示不正常？

检查 `dist/pdf/{taskId}/3-2-images-missing.json`，查看哪些图片缺失。

### 内部链接跳转失败？

查看 `dist/pdf/{taskId}/2-1-links.json`，检查链接转换规则。如需手动配置，编辑根目录的 `link-mapping.json`。

## 详细文档

查看项目根目录的 `PDF-REQUIREMENTS.md` 了解完整设计。

