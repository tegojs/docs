import * as path from 'node:path';
import { defineConfig } from 'rspress/config';
import { pluginPreview } from '@rspress/plugin-preview';
import mermaid from 'rspress-plugin-mermaid';
import { pluginMarkdownTips } from './src/plugins/markdown-tips';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  plugins: [
    mermaid(),
    pluginPreview({
      iframeOptions: {
        devPort: 7777,
        position: 'follow',
      },
      previewMode: 'iframe',
      defaultRenderMode: 'pure',
    }),
    pluginMarkdownTips({
      enableIcons: true,
      iconMap: {
        info: 'ℹ️',
        warning: '⚠️',
        error: '❌',
        success: '✅',
        tip: '💡',
        note: '📝',
        important: '🔥',
        question: '❓',
        example: '💡',
        quote: '💬',
      },
    }),
  ],
  markdown: {
    showLineNumbers: true,
    defaultWrapCode: true,
    highlightLanguages: [
      'js',
      'ts',
      'jsx',
      'tsx',
      'json',
      'md',
      'html',
      'css',
      'scss',
      'less',
      'bash',
      'shell',
      'sql',
      'python',
      'java',
      'c',
      'cpp',
      'csharp',
      'php',
      'go',
      'rust',
      'swift',
      'kotlin',
      'dart',
      'r',
      'matlab',
      'scala',
      'ruby',
      'perl',
      'lua',
      'powershell',
      'yaml',
      'toml',
      'ini',
      'xml',
      'svg',
      'dockerfile',
      'makefile',
      'gitignore',
      'markdown',
      'text',
      'plaintext',
    ],
  },
  head: [['link', { rel: 'stylesheet', href: '/styles/markdown-tips.css' }]],
  title: 'Tachybase',
  icon: '/tachybase-icon-light.png',
  logo: {
    light: '/tachybase-light-blue.png',
    dark: '/tachybase-dark-white.png',
  },
  themeConfig: {
    lastUpdated: true,
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/tachybase/tachybase',
      },
    ],
    locales: [
      {
        lang: 'en',
        label: 'dd',
        outlineTitle: 'ON THIS Page',
      },
      {
        lang: 'zh',
        label: 'dd',
        outlineTitle: '大纲',
      },
    ],
  },
  lang: 'zh',
  locales: [
    {
      lang: "en",
      // 导航栏切换语言的标签
      label: "English",
      title: "Rspress",
      description: "Static Site Generator",
    },
    {
      lang: 'zh',
      label: '简体中文',
      title: 'Rspress',
      description: '静态网站生成器',
    },
  ],
});
