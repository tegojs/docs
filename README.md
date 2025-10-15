# Rspress Website

## Setup

Install the dependencies:

```bash
npm install
```

## Get Started

Start the dev server:

```bash
npm run dev
```

Build the website for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## 生成 PDF

从 `docs/zh/guides/` 生成 PDF 文档：

```bash
# 1. 合并并处理 Markdown（必须）
pnpm merge-md

# 2. 使用 Typora 或其他工具将生成的 MD 转为 PDF
# 处理后的文件位于: dist/pdf/latest/3-3-images-processed.md
```

**详细说明**: 查看 `scripts/merge-md/README.md`