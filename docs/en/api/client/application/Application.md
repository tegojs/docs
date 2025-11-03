# Application

## new Application(options)

Create a Tachybase application.

- Type

```tsx | pure
export interface ApplicationOptions {
  apiClient?: APIClientOptions | APIClient;
  ws?: WebSocketClientOptions | boolean;
  i18n?: i18next;
  providers?: (ComponentType | ComponentAndProps)[];
  plugins?: PluginType[];
  components?: Record<string, ComponentType>;
  scopes?: Record<string, any>;
  router?: RouterOptions;
  schemaSettings?: SchemaSetting[];
  schemaInitializers?: SchemaInitializer[];
  loadRemotePlugins?: boolean;
  dataSourceManager?: DataSourceManagerOptions;
  addFieldInterfaceComponentOption(fieldName: string, componentOption: CollectionFieldInterfaceComponentOption): void;
}
```

- Details
  - `apiClient`: API request instance
  - `i18n`: Internationalization, for details please refer to: [https://www.i18next.com/overview/api#createinstance](https://www.i18next.com/overview/api#createinstance)
  - `providers`: Context
  - `components`: Global components
  - `scopes`: Global scopes
  - `router`: Configure routes, for details please refer to: [RouterManager](./RouterManager)
  - `pluginSettings`: [SystemSettingsManager](./SystemSettingsManager)
  - `schemaSettings`: Schema settings tool, for details refer to: [SchemaSettingsManager](./SchemaInitializerManager)
  - `schemaInitializers`: Schema add tool, for details refer to: [SchemaInitializerManager](../ui-schema/SchemaInitializerManager)
  - `loadRemotePlugins`: Used to control whether to load remote plugins, default is `false`, i.e., do not load remote plugins (convenient for unit tests and DEMO environment).
  - `dataSourceManager`: Data source manager, for details refer to: [DataSourceManager](../data-source/DataSourceManager)
  - `addFieldInterfaceComponentOption`: Add Field interface component option. For details refer to: [CollectionFieldInterfaceManager](../data-source/CollectionFieldInterfaceManager)
- Example

```tsx
/**
 * defaultShowCode: true
 */
import { Application, Plugin } from '@tachybase/client';

const ProviderDemo = ({ children }) => {
    return <div>
        <div>hello world</div>
        <div style={{ marginTop: 10 }}>{children}</div>
    </div>
}

class MyPlugin extends Plugin {
    async load(){
        this.app.router.add('home', {
            path: '/',
            Component: () => <div>home page</div>
        })
    }
}

const app = new Application({
    providers: [ProviderDemo],
    plugins: [MyPlugin],
    router: {
        type: 'memory',
        initialEntries: ['/'],
    }
});

export default app.getRootComponent();
```

## Instance Properties

### app.i18n

```tsx | pure
class Application {
    i18n: i18next;
}
```

For detailed introduction, please refer to: [i18next](https://www.i18next.com/overview/api#createinstance)

### app.apiClient

```tsx | pure
class Application {
    apiClient: APIClient;
}
```

For detailed introduction, please refer to: [Request](./Request)

### app.router

For detailed introduction, please refer to: [RouterManager](./RouterManager)

### app.systemSettingsManager

For detailed introduction, please refer to: [SystemSettingsManager](./SystemSettingsManager)

### app.schemaSettingsManager

For detailed introduction, please refer to: [SchemaSettingsManager](../ui-schema/SchemaInitializerManager)

### app.schemaInitializerManager

For detailed introduction, please refer to: [SchemaInitializerManager](../ui-schema/SchemaInitializerManager)

### app.dataSourceManager

For detailed introduction, please refer to: [DataSourceManager](../data-source/DataSourceManager)

## Instance Methods

### app.getRootComponent()

Get the root component of the application.

- Type

```tsx | pure
class Application {
    getRootComponent(): React.FC
}
```

- Example

```tsx | pure
import { Application } from '@tachybase/client';

const app = new Application();

const App = app.getRootComponent();
```

### app.mount()

Mount the application instance in a container element.

- Type

```tsx | pure
class Application {
    mount(containerOrSelector: Element | ShadowRoot | string): ReactDOM.Root
}
```

- Example

```tsx | pure
import { Application } from '@tachybase/client';

const app = new Application();

app.mount('#root');
```

### app.addProvider()

Add `Provider` context.

- Type

```tsx | pure
class Application {
    addProvider<T = any>(component: ComponentType, props?: T): void;
}
```

- Details

The first parameter is a component, the second parameter is component parameters. Note that `Provider` must render `children`.

- Example

```tsx | pure
// Scenario 1: Third-party library, or Context created by yourself
const MyContext = createContext({});
app.addProvider(MyContext.provider, { value: { color: 'red' } });
```

```tsx
import { createContext, useContext } from 'react';
import { Application, Plugin } from '@tachybase/client';

const MyContext = createContext();

const HomePage = () => {
    const { color } = useContext(MyContext) || {};
    return <div style={{ color }}>home page</div>
}

class MyPlugin extends Plugin {
    async load(){
        this.app.addProvider(MyContext.Provider, { value: { color: 'red' } });
        this.app.router.add('home', {
            path: '/',
            Component: HomePage
        })
    }
}

const app = new Application({
    plugins: [MyPlugin],
    router: {
        type: 'memory',
        initialEntries: ['/'],
    }
});

export default app.getRootComponent();
```

```tsx | pure
// Scenario 2: Custom component, note children
const GlobalDemo = ({ name, children }) => {
    return <div>
        <div>hello, { name }</div>
        <div>{ children }</div>
    </div>
}
app.addProvider(GlobalDemo, { name: 'tachybase' });
```


```tsx
import { Application, Plugin } from '@tachybase/client';

const GlobalDemo = ({ name, children }) => {
    return <div>
        <div>hello, { name }</div>
        <div>{ children }</div>
    </div>
}

class MyPlugin extends Plugin {
    async load(){
        this.app.addProvider(GlobalDemo, { name: 'tachybase' });
        this.app.router.add('home', {
            path: '/',
            Component: () => <div>home page</div>
        })
    }
}

const app = new Application({
    plugins: [MyPlugin],
    router: {
        type: 'memory',
        initialEntries: ['/'],
    }
});

export default app.getRootComponent();
```


### app.addProviders()

Add multiple `Provider` contexts.

- Type

```tsx | pure
class Application {
    addProviders(providers: (ComponentType | [ComponentType, any])[]): void;
}
```

- Details

Add multiple `Providers` at once.

- Example

```tsx | pure
app.addProviders([[MyContext.provider, { value: { color: 'red' } }], [GlobalDemo, { name: 'tachybase' }]])
```

### app.addComponents()

Add global components.

Global components can be used in [RouterManager](./RouterManager) and [UI Schema](../ui-schema/SchemaComponent).

- Type

```tsx | pure
class Application {
    addComponents(components: Record<string, ComponentType>): void;
}
```

- Example

```tsx | pure
app.addComponents({ Demo, Foo, Bar })
```

### app.addScopes()

Add global scopes.

Global scopes can be used in [UI Schema](../ui-schema/SchemaComponent).

- Type

```tsx | pure
class Application {
    addScopes(scopes: Record<string, any>): void;
}
```

- Example

```tsx | pure
function useSomeThing() {}
const anyVar = '';

app.addScopes({ useSomeThing, anyVar })
```

### app.getCollectionManager()

Get the [collection manager](../data-source/CollectionManager) instance for the specified data source.

- Type

```tsx | pure
class Application {
  getCollectionManager(dataSource?: string): CollectionManager;
}
```

- Example

```tsx | pure
app.getCollectionManager() // Get collection manager of default data source
app.getCollectionManager('test') // Get collection manager of specified data source
```

## Hooks

### useApp()

Get the instance of the current application.

- Type

```tsx | pure
const useApp: () => Application
```

- Example

```tsx | pure
const Demo = () => {
    const app = useApp();
    return <div>{ JSON.stringify(app.router.getRouters()) }</div>
}
```

```tsx
import { Application, Plugin, useApp } from '@tachybase/client';

const HomePage = () => {
    const app = useApp();
    return <div>{ JSON.stringify(app.router.getRoutes()) }</div>
}

class MyPlugin extends Plugin {
    async load(){
        this.app.router.add('home', {
            path: '/',
            Component: HomePage
        })
    }
}

const app = new Application({
    plugins: [MyPlugin],
    router: {
        type: 'memory',
        initialEntries: ['/'],
    }
});

export default app.getRootComponent();
```
