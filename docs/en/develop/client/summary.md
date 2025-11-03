# Overview

## Directory Structure

```markdown
|- /plugin-sample
  |- /src
    |- /client # Plugin client code
      |- plugin.ts # Plugin class
      |- index.ts # Client entry
  |- client.d.ts
  |- client.js
```

## Plugin Class

`plugin.ts` provides calls to various methods in the plugin lifecycle

```typescript
import { Plugin } from '@tachybase/client'

export class PluginSampleClient extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {}
}

export default PluginSampleClient
```

## Plugin Lifecycle

![](/plugin-lifecycle.jpeg)
1. After plugin initialization, `afterAdd` is triggered. Note that plugin addition is unordered, so don't get other plugin instances in `afterAdd`. If you need to get other plugin instances, you can get them in `beforeLoad` or `load`
2. In `beforeLoad`, all activated plugins are instantiated, and instances can be obtained through `app.pluginManager.get()`
3. In `load`, the `beforeLoad` methods of all plugins have been executed, and plugin initialization work can be performed, such as registering routes

## Common Properties and Methods in Plugin Class

1. `app.i18n` - Internationalization
2. `app.apiClient` - API Client
3. `app.pluginManager` - Plugin Manager
4. `app.router` - Route Management
5. `app.systemSettingsManager` - System Settings Page
6. `app.schemaInitializerManager` - Schema Initializer Configuration
7. `app.schemaSettingsManager` - Schema Settings Configuration
8. `app.addProviders` - Provider Components
9. `app.addComponents` - Schema Rendering
10. `app.addScopes` - Schema Rendering

## Common React Hooks in Components

1. `useApp()` - useApp() API
2. `usePlugin()` - usePlugin() API
3. `useAPIClient()` - API Client
4. `useRequest()` - API Client
