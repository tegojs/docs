# 路由

通过 app.router.add()和 app.pluginSettingsManager.add()可分别扩展常规页面和插件设置页，具体实现如下：

## 一、常规页面扩展（通过 `app.router.add()`）

通过`app.router.add()`方法可动态添加常规页面路由，支持多级路由结构：

```typescript
this.app.router.add('路由名称', {
  path: '/路径', // 路由路径（支持动态参数）
  element: <组件 />, // 页面组件（支持React组件或Outlet）
  exact: true, // 是否严格匹配路径
  title: '页面标题', // 页面标题（可选）
  icon: '图标名称', // 页面图标（可选）
})
```

- 路由路径支持层级结构（如 root.home）
- 可通过 `app.router.getRoutes()` 查看所有已注册路由

### 示例1：创建首页路由

```typescript
this.app.router.add('home', {
  path: '/',
  element: <HomeComponent />,
  title: '首页',
  icon: 'HomeOutlined',
})
```

### 示例2：多级路由配置

```typescript
class MyPlugin extends Plugin {
  async load() {
    // 添加根路由布局
    this.app.router.add('root', {
      element: <Layout />,
    })

    // 添加子页面路由
    this.app.router.add('root.home', {
      path: '/',
      element: <Home />,
    })
    this.app.router.add('root.about', {
      path: '/about',
      element: <About />,
    })
  }
}
```

## 二、插件设置页扩展（通过 app.pluginSettingsManager.add()）

通过 app.pluginSettingsManager.add()方法可注册插件专属设置页：

```typescript
class HelloPlugin extends Plugin {
  async load() {
    // 注册顶级设置页
    this.app.pluginSettingsManager.add('hello', {
      title: 'Hello',
      icon: 'ApiOutlined',
      Component: HelloSettingPage,
    })

    // 注册多级子设置页
    this.app.pluginSettingsManager.add('hello.demo1', {
      title: 'Demo1 Page',
      Component: () => <div>Demo1 Content</div>,
    })
    this.app.pluginSettingsManager.add('hello.demo2', {
      title: 'Demo2 Page',
      Component: () => <div>Demo2 Content</div>,
    })
  }
}
```

- 路由路径自动挂载到/admin/settings/*下
- 支持通过插件管理器统一管理设置页

## 三、初始路由说明

默认已注册以下路由：
| 名称           | 路径               | 组件           | 说明           |
|----------------|--------------------|----------------|----------------|
| admin          | /admin/*           | AdminLayout    | 后台管理主页   |
| admin.page     | /admin/:name       | AdminDynamicPage| 动态页面入口   |
| admin-settings | /_admin/:name      | AdminSettingsLayout | 系统配置页入口 |

## 四、扩展建议

1. 命名规范：建议使用 `pluginName.feature` 格式命名路由（如hello.demo1）
2. 组件复用：可通过`Outlet`组件实现多级页面嵌套
3. 图标配置：支持使用`Ant Design`图标库（如`ApiOutlined`）

通过上述方法，可灵活实现页面扩展与插件功能集成。
