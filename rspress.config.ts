import * as path from "node:path";
import { defineConfig } from "rspress/config";
import { pluginPreview } from "@rspress/plugin-preview";
import { pluginPlayground } from "@rspress/plugin-playground";

export default defineConfig({
  root: path.join(__dirname, "docs"),
  plugins: [
    pluginPreview({
      defaultRenderMode: "pure",
    }),
    pluginPlayground({
      defaultRenderMode: "pure",
      defaultDirection: "vertical",
    }),
  ],
  title: "Tachybase",
  icon: "/tachybase-icon-light.png",
  logo: {
    light: "/tachybase-light-blue.png",
    dark: "/tachybase-dark-white.png",
  },
  themeConfig: {
    socialLinks: [
      {
        icon: "github",
        mode: "link",
        content: "https://github.com/tachybase/tachybase",
      },
    ],
    locales: [
      {
        lang: "en",
        label: "dd",
        outlineTitle: "ON THIS Page",
      },
      {
        lang: "zh",
        label: "dd",
        outlineTitle: "大纲",
      },
    ],
  },
  lang: "zh",
  locales: [
    {
      lang: "en",
      // 导航栏切换语言的标签
      label: "English",
      title: "Rspress",
      description: "Static Site Generator",
    },
    {
      lang: "zh",
      label: "简体中文",
      title: "Rspress",
      description: "静态网站生成器",
    },
  ],
});
