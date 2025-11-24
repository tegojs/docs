import * as path from 'node:path'
import { pluginPreview } from '@rspress/plugin-preview'
import mermaid from 'rspress-plugin-mermaid'
import { defineConfig } from 'rspress/config'
import { algoliaConfig } from './config/algolia.config'

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  plugins: [
    // biome-ignore lint/suspicious/noExplicitAny: mermaid 插件使用旧版本的 @rspress/shared，需要类型断言
    mermaid() as any,
    pluginPreview({
      iframeOptions: {
        devPort: 7777,
        position: 'follow',
      },
      previewMode: 'iframe',
      defaultRenderMode: 'pure',
    }),
  ],
  logo: {
    light: '/tachybase-light-blue.png',
    dark: '/tachybase-dark-white.png',
  },
  // favicon 已在 builderConfig.html.tags 中配置
  themeConfig: {
    lastUpdated: true,
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/tachybase/tachybase',
      },
    ],
    search: false, // 使用自定义 Algolia DocSearch 组件
    locales: [
      {
        lang: 'en',
        label: 'dd',
        outlineTitle: 'ON THIS Page',
        editLink: {
          docRepoBaseUrl: 'https://github.com/tegojs/docs/tree/main/docs',
          text: '📝 Edit this page on GitHub',
        },
        searchPlaceholderText: 'Type keywords to search...',
        searchNoResultsText: 'No results found',
        searchSuggestedQueryText: 'Please try again with a different keyword',
      },
      {
        lang: 'zh',
        label: 'dd',
        outlineTitle: '大纲',
        editLink: {
          docRepoBaseUrl: 'https://github.com/tegojs/docs/tree/main/docs',
          text: '📝 在 GitHub 上编辑此页',
        },
        searchPlaceholderText: '输入关键词搜索...',
        searchNoResultsText: '未找到结果',
        searchSuggestedQueryText: '请尝试使用不同的关键词',
      },
    ],
  },
  lang: 'zh',
  locales: [
    {
      lang: 'en',
      // 导航栏切换语言的标签
      label: 'English',
      title: 'Rspress',
      description: 'Static Site Generator',
    },
    {
      lang: 'zh',
      label: '简体中文',
      title: 'Rspress',
      description: '静态网站生成器',
    },
  ],
  globalStyles: '/styles/index.css',
  builderConfig: {
    html: {
      tags: [
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            type: 'image/png',
            href: '/tachybase-icon-light.png',
          },
        },
        {
          tag: 'script',
          attrs: {
            src: 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js',
            async: true,
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'preconnect',
            href: `https://${algoliaConfig.appId}-dsn.algolia.net`,
            crossorigin: '',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'dns-prefetch',
            href: `https://${algoliaConfig.appId}-dsn.algolia.net`,
          },
        },
        {
          tag: 'meta',
          attrs: {
            name: 'algolia-site-verification',
            content: 'D198F62CCC517EC9',
          },
        },
      ],
    },
  },
})
