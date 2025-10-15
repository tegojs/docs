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

## Generate PDF

Generate PDF from `docs/zh/guides/`:

```bash
# Pandoc (推荐 - 支持 PDF 书签)
pnpm pdf:pandoc

# Puppeteer (备选 - 无需安装工具)
pnpm pdf:puppeteer

# 检查系统字体
pnpm pdf:check-fonts
```

**Output**: `dist/pdf/latest/6-1-guides-zh.pdf`

**详细文档**: 查看 `scripts/QUICK-START.md`