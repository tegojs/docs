# SystemSettingsManager

Used to manage plugin configuration pages, underlying it corresponds to [RouterManager](./RouterManager).

```tsx | pure
interface PluginSettingOptionsType {
  title: string;
  /**
   * @default `Outlet`
   */
  Component?: ComponentType<T> | string;
  icon?: string;
  /**
   * sort, the smaller the number, the higher the priority
   * @default 0
   */
  sort?: number;
  aclSnippet?: string;
}

interface PluginSettingsPageType {
  label?: string;
  title: string;
  key: string;
  icon: any;
  path: string;
  sort?: number;
  name?: string;
  isAllow?: boolean;
  topLevelName?: string;
  aclSnippet: string;
  children?: PluginSettingsPageType[];
}

class SystemSettingsManager {
  add(name: string, options: PluginSettingOptionsType): void
  get(name: string, filterAuth?: boolean): PluginSettingsPageType;
  getList(filterAuth?: boolean): PluginSettingsPageType[]
  has(name: string): boolean;
  remove(name: string): void;
  getRouteName(name: string): string
  getRoutePath(name: string): string;
  hasAuth(name: string): boolean;
}
```

## Instance Methods

### systemSettingsManager.add()

Add plugin configuration page.

- Type

```tsx | pure
class SystemSettingsManager {
    add(name: string, options: PluginSettingOptionsType): void
}
```

- Detailed Explanation

The first parameter `name` is the unique route identifier for subsequent CRUD operations, and `name` supports `.` for splitting levels. However, note that when using `.` for layering, the parent must use [Outlet](https://reactrouter.com/en/main/components/outlet) so that child elements can render normally.

The second parameter's `Component` supports both component form and string form. If it's a string component, it must be registered first through [app.addComponents](./Application), specifically refer to [RouterManager](./RouterManager).

- Example

Single-level configuration.

```tsx | pure
const HelloSettingPage = () => {
    return <div>hello setting page</div>
}

class MyPlugin extends Plugin {
    async load() {
        this.app.systemSettingsManager.add('hello', {
            title: 'Hello',  // menu title and page title
            icon: 'ApiOutlined', // menu icon
            Component: HelloSettingPage
        })
    }
}
```

Multi-level configuration.

```tsx | pure
// Multi-level configuration page

class MyPlugin extends Plugin {
    async load() {
        this.app.systemSettingsManager.add('hello', {
          title: 'HelloWorld',
          icon: '',
          // Component: Outlet, defaults to react-router-dom's Outlet component, can be customized
        })

        this.app.systemSettingsManager.add('hello.demo1', {
          title: 'Demo1 Page',
          Component: () => <div>Demo1 Page Content</div>
        })

        this.app.systemSettingsManager.add('hello.demo2', {
          title: 'Demo2 Page',
          Component: () => <div>Demo2 Page Content</div>
        })
    }
}
```

### systemSettingsManager.get()

Get configuration information.

- Type

```tsx | pure
class SystemSettingsManager {
    get(name: string, filterAuth?: boolean): PluginSettingsPageType;
}
```

- Detailed Explanation

The first is the name parameter when adding, the second parameter is whether to perform permission filtering when getting.

- Example

Get in component.

```tsx | pure
const Demo = () => {
    const app = useApp();
    const helloSettingPage = this.app.systemSettingsManager.get('hello');
}
```

Get in plugin.

```tsx | pure
class MyPlugin extends Plugin {
    async load() {
        const helloSettingPage = this.app.systemSettingsManager.get('hello')
        const helloSettingPage = this.app.systemSettingsManager.get('hello', false);

        const mobileAppConfigPage = this.app.systemSettingsManager.get('mobile.app')
    }
}
```

### systemSettingsManager.getList()

Get plugin configuration page list.

- Type

```tsx | pure
class SystemSettingsManager {
    getList(filterAuth?: boolean): PluginSettingsPageType[]
}
```

- Detailed Explanation

`filterAuth` defaults to `true`, i.e., perform permission filtering.

- Example

```tsx | pure
const Demo = () => {
    const app = useApp();
    const settings = app.systemSettingsManager.getList();
    const settings = app.systemSettingsManager.getList(false);
}
```

### systemSettingsManager.has()

Determine if exists, permission filtering is already performed internally.

- Type

```tsx | pure
class SystemSettingsManager {
    has(name: string): boolean;
}
```

- Example

```tsx | pure
class MyPlugin extends Plugin {
    async load() {
        this.app.systemSettingsManager.has('hello');
    }
}
```

### systemSettingsManager.remove()

Remove configuration.

```tsx | pure
class SystemSettingsManager {
    remove(name: string): void;
}
```

### systemSettingsManager.getRouteName()

Get the name of the corresponding route.

- Type

```tsx | pure
class SystemSettingsManager {
    getRouteName(name: string): string
}
```

- Example

```tsx | pure
class MyPlugin extends Plugin {
    async load() {
        const helloRouteName = this.systemSettingsManager.getRouteName('hello'); // admin.settings.hello
    }
}
```

### systemSettingsManager.getRoutePath()

Get the page path corresponding to the plugin configuration.

- Type

```tsx | pure
class SystemSettingsManager {
    getRoutePath(name: string): string;
}
```

- Example

```tsx | pure
const Demo = () => {
    const navigate = useNavigate();
    const app = useApp();
    const helloSettingPath =  app.systemSettingsManager.getRoutePath('hello');

    return <div onClick={()=> navigate(helloSettingPath)}>
        go to hello setting page
     </div>
}
```

### systemSettingsManager.hasAuth()

Separately determine if has permission.

```tsx | pure
class SystemSettingsManager {
    hasAuth(name: string): boolean;
}
```
