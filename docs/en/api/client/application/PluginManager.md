# PluginManager

Used to manage plugins.

```tsx | pure
class PluginManager {
   add<T = any>(plugin: typeof Plugin, opts?: PluginOptions<T>): Promise<void>

   get<T extends typeof Plugin>(PluginClass: T): InstanceType<T>;
   get<T extends {}>(name: string): T;
}
```

## Instance Methods

### pluginManager.add()

Add a plugin to the application.

- Type

```tsx | pure
class PluginManager {
    add<T = any>(plugin: typeof Plugin, opts?: PluginOptions<T>): Promise<void>
}
```

- Details

The first parameter is the plugin class, the second is the parameters passed during instantiation. As mentioned before, the `afterAdd` hook function will be called immediately after adding the plugin, so it returns `Promise<void>`.

For remote components, a `name` parameter will be automatically passed.

- Example

```tsx | pure
class MyPluginA extends Plugin {
    async load() {
        console.log('options', this.options)
        console.log('app', this.app);
        console.log('router', this.app.router, this.router);
    }
}

class MyPluginB extends Plugin {
    // Methods that need to be executed in afterAdd
    async afterAdd() {
      // When adding plugins through `app.pluginManager.add()`, the first parameter is the plugin class, the second parameter is the parameters passed during instantiation
      this.app.pluginManager.add(MyPluginA, { name: 'MyPluginA', hello: 'world' })
    }
}

const app = new Application({
    plugins: [MyPluginB],
});
```

### pluginManager.get()

Get plugin instance.

- Type

```tsx | pure
class PluginManager {
      get<T extends typeof Plugin>(PluginClass: T): InstanceType<T>;
      get<T extends {}>(name: string): T;
}
```

- Details

Can get plugin example through Class. If there is a name when the plugin is registered, you can also get it through the string name.

If it's a remote plugin, name will be automatically passed in, with the value being the package's name.

- Example

```tsx | pure
import MyPluginA from 'xxx';

class MyPluginB extends Plugin {
    async load() {
        // Method 1: Get through Class
        const myPluginA = this.app.pluginManager.get(MyPluginA);

        // Method 2: Get through name (need to pass name parameter when adding)
        const myPluginA = this.app.pluginManager.get('MyPluginA');
    }
}
```

## Hooks

Get plugin instance, equivalent to `pluginManager.get()`.

### usePlugin()

```tsx | pure
function usePlugin<T extends typeof Plugin>(plugin: T): InstanceType<T>;
function usePlugin<T extends {}>(name: string): T;
```

- Details

Can get plugin example through Class. If there is a name when the plugin is registered, you can also get it through the string name.

- Example

```tsx | pure
import { usePlugin } from '@tachybase/client';

const Demo = () => {
    // Get through Class
    const myPlugin = usePlugin(MyPlugin);

    // Get through name (need to pass name parameter when adding)
    const myPlugin = usePlugin('MyPlugin');

    return <div></div>
}
```
