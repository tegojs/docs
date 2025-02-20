# 概述

## 目录结构

```markdown
|- /plugin-sample
  |- /src
    |- /client # 插件客户端代码
      |- plugin.ts # 插件类
      |- index.ts # 客户端入口
  |- client.d.ts
  |- client.js
```

## Plugin Class

plugin.ts 提供了插件生命周期的各种方法的调用

```typescript
import { Plugin } from '@tachybase/client'

export class PluginSampleClient extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {}
}

export default PluginSampleClient
```

## 插件的生命周期

![](../../../public/plugin-lifecycle.png)
1. 在插件初始化之后，触发 afterAdd。需要注意的是，插件的添加是无序的，所以不要在 afterAdd 里获取其他插件的实例，如果需要获取其他插件的实例，可以在 beforeLoad 或者 load 里获取 
2. 在 beforeLoad 里所有已激活的插件都实例化了，此时可以通过 app.pluginManager.get() 获取到实例
3. 在 load 里，所有插件的 beforeLoad 方法都已执行完毕，此时可以进行插件的初始化工作，比如注册路由

## 插件类里常用的属性及方法

1. app.i18n	国际化
2. app.apiClient	API 客户端
3. app.pluginManager	插件管理器
4. app.router	路由管理
5. app.pluginSettingsManager	插件配置页
6. app.schemaInitializerManager	Schema Initializer 配置
7. app.schemaSettingsManager	Schema Settings 配置
8. app.addProviders	Provider 组件
9. app.addComponents	Schema 渲染
10. app.addScopes	Schema 渲染

## 组件里常用的 React hooks

1. useApp()	useApp() API
2. usePlugin()	usePlugin() API
3. useAPIClient()	API 客户端
4. useRequest()	API 客户端
