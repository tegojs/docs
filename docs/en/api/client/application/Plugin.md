# Plugin

Plugin base class.

- Type

```tsx | pure
class Plugin<T = any> {
  constructor(
    protected options: T,
    protected app: Application,
  ) {
    this.options = options;
    this.app = app;
  }

  get pluginManager() {
    return this.app.pluginManager;
  }

  get router() {
    return this.app.router;
  }

  get systemSettingsManager() {
    return this.app.systemSettingsManager;
  }

  get schemaInitializerManager() {
    return this.app.schemaInitializerManager;
  }

  get schemaSettingsManager() {
    return this.app.schemaSettingsManager;
  }

  get dataSourceManager() {
    return this.app.dataSourceManager;
  }

  async afterAdd() {}

  async beforeLoad() {}

  async load() {}
}
```

- Details

  - Constructor
    - `options`: There are two ways to add plugins. One way is to remotely load from the plugin list, another way is through [PluginManager](./PluginManager) to add
      - Remote loading: `options` will be automatically injected with `{ name: 'npm package.name' }`
      - PluginManager `options` are passed by users themselves
    - `app`: This parameter is automatically injected and is the application instance
  - Quick access: The base class provides quick access to some methods and properties of `app`
    - `pluginManager`
    - `router`
    - `systemSettingsManager`
    - `schemaSettingsManager`
    - `schemaInitializerManager`
  - Lifecycle
    - `afterAdd`: Executes immediately after plugin is added
    - `beforeLoad`: Executes during rendering, after `afterAdd`, before `load`
    - `load`: Executes last
- Example

```tsx | pure
class MyPlugin extends Plugin {

  async afterAdd() {
    console.log('afterAdd')
  }

  async beforeLoad() {
    console.log('beforeLoad')
  }

  async load() {
    console.log('load')

    // Can access application instance
    console.log(this.app)

    // Access application instance content
    console.log(this.app.router, this.router);
  }
}
```
