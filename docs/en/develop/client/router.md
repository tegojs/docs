# Routing

Through `app.router.add()` and `app.systemSettingsManager.add()`, you can extend regular pages and system settings pages respectively. The specific implementation is as follows:

## I. Regular Page Extension

Through the `app.router.add()` method, you can dynamically add regular page routes, supporting multi-level routing structures:

```typescript
this.app.router.add('Route Name', {
  path: '/path', // Route path (supports dynamic parameters)
  element: <Component />, // Page component (supports React components or Outlet)
  exact: true, // Whether to strictly match the path
  title: 'Page Title', // Page title (optional)
  icon: 'Icon Name', // Page icon (optional)
})
```

- Route paths support hierarchical structure (e.g., `root.home`)
- You can view all registered routes through `app.router.getRoutes()`

### Example 1: Create Home Route

```typescript
this.app.router.add('home', {
  path: '/',
  element: <HomeComponent />,
  title: 'Home',
  icon: 'HomeOutlined',
})
```

### Example 2: Multi-level Route Configuration

```typescript
class MyPlugin extends Plugin {
  async load() {
    // Add root route layout
    this.app.router.add('root', {
      element: <Layout />,
    })

    // Add child page routes
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

## II. System Settings Page Extension

Through the `app.systemSettingsManager.add()` method, you can register system-exclusive settings pages:

```typescript
class HelloPlugin extends Plugin {
  async load() {
    // Register top-level settings page
    this.app.systemSettingsManager.add('hello', {
      title: 'Hello',
      icon: 'ApiOutlined',
      Component: HelloSettingPage,
    })

    // Register multi-level sub-settings pages
    this.app.systemSettingsManager.add('hello.demo1', {
      title: 'Demo1 Page',
      Component: () => <div>Demo1 Content</div>,
    })
    
    this.app.systemSettingsManager.add('hello.demo2', {
      title: 'Demo2 Page',
      Component: () => <div>Demo2 Content</div>,
    })
  }
}
```

- Route paths are automatically mounted under `/_admin/:name`
- Supports unified management of settings pages through the system settings interface

## III. Initial Route Description

The following routes are registered by default:
| Name           | Path               | Component           | Description           |
|----------------|--------------------|---------------------|----------------------|
| admin          | /admin/*           | AdminLayout         | Backend admin homepage |
| admin.page     | /admin/:name       | AdminDynamicPage    | Dynamic page entry   |
| admin-settings | /_admin/:name      | AdminSettingsLayout | System config page entry |

## IV. Extension Recommendations

1. Naming Convention: It's recommended to use the `pluginName.feature` format for naming routes (e.g., hello.demo1)
2. Component Reuse: Multi-level page nesting can be achieved through the `Outlet` component
3. Icon Configuration: Supports using the `Ant Design` icon library (e.g., `ApiOutlined`)

**Through the above methods, you can flexibly implement page extension and plugin feature integration.**
