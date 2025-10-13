# PDF 生成脚本

将 `docs/zh/guides/` 目录下的 Markdown 文件生成为单个 PDF 文档。

## 快速开始

```bash
# 生成 PDF（完整流程）
pnpm pdf
```

## 脚本说明

### 主脚本

- **`generate-pdf.js`** - 主入口，执行完整流程（步骤1-6）
  - 自动生成任务ID（10位时间戳）
  - 依次调用所有子脚本
  - 检查必需工具（pandoc、xelatex）
  - 生成最终 PDF

### 子脚本（用于调试）

- **`merge-guides.js <taskId>`** - 步骤1：合并 Markdown
  - 按 `_meta.json` 顺序合并文件
  - 调整标题层级
  - 处理相对路径
  - 处理 MDX 文件
  
- **`process-links.js <taskId>`** - 步骤2：处理内部链接（待实现）
  - 转换内部链接为 Pandoc 锚点
  
- **`process-images.js <taskId>`** - 步骤3：处理图片路径（待实现）
  - 转换图片路径为本地绝对路径

## 使用示例

### 完整流程

```bash
pnpm pdf
```

输出位置：
- `dist/pdf/{taskId}/guides-zh.pdf` - 带时间戳的版本
- `dist/pdf/latest/guides-zh.pdf` - 最新版本（快捷访问）

### 调试单个步骤

```bash
# 假设任务ID是 1728825025

# 只运行步骤1（合并）
pnpm pdf:merge 1728825025

# 只运行步骤2（链接）
pnpm pdf:links 1728825025

# 只运行步骤3（图片）
pnpm pdf:images 1728825025
```

## 输出文件

每次运行会在 `dist/pdf/{taskId}/` 目录下生成：

```
dist/pdf/1728825025/
├── 1-merged.md              # 合并后的 Markdown
├── 1-skipped-files.json     # 跳过的文件日志
├── 1-mdx-processed.json     # MDX 处理日志
├── 2-links-processed.md     # 处理链接后
├── 2-links.json             # 链接处理日志
├── 2-links-skipped.json     # 跳过的链接
├── 3-images-processed.md    # 处理图片后
├── 3-images.json            # 图片处理日志
├── 3-images-missing.json    # 缺失的图片
├── 4-cleaned.md             # 清理特殊字符后
└── guides-zh.pdf            # 最终 PDF ⭐
```

## 依赖工具

### 必需

1. **Pandoc** (>= 2.0)
   - 下载：https://pandoc.org/installing.html
   - 检查：`pandoc --version`

2. **XeLaTeX** (MiKTeX 或 TeX Live)
   - 下载：https://miktex.org/download
   - 检查：`xelatex --version`

### 可选

- **link-mapping.json** - 手动链接映射（根目录）

## 常见问题

### 如何跳过某个文件？

从对应的 `_meta.json` 中移除该文件即可。

### 如何调整章节顺序？

编辑对应的 `_meta.json`，调整数组顺序。

### 图片显示不正常？

检查 `dist/pdf/{taskId}/3-images-missing.json`，查看哪些图片缺失。

## 详细文档

查看项目根目录的 `PDF-REQUIREMENTS.md` 了解完整设计。

