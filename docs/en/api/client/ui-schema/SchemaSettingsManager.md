# SchemaSettingsManager

## Instance Methods

### schemaSettingsManager.add()

Add SchemaSettings instance.

- Type

```tsx | pure
class SchemaSettingsManager {
    add<T = any>(...schemaSettingList: SchemaSetting<T>[]): void
}
```

- Example

```tsx | pure
const mySchemaSettings = new SchemaSetting({
  name: 'MySchemaSettings',
  title: 'Add block',
  items: [
    {
      name: 'demo',
      type: 'item',
      componentProps:{
          title: 'Demo'
      }
    }
  ],
});

class MyPlugin extends Plugin {
    async load() {
        this.app.schemaSettingsManager.add(mySchemaSettings);
    }
}
```

### schemaSettingsManager.get()

Get a SchemaSettings instance.

- Type

```tsx | pure
class SchemaSettingsManager {
    get<T = any>(name: string): SchemaSetting<T> | undefined
}
```

- Example

```tsx | pure
class MyPlugin extends Plugin {
    async load() {
       const mySchemaSettings = this.app.schemaSettingsManager.get('MySchemaSettings');
    }
}
```

### schemaSettingsManager.getAll()

Get all SchemaSettings instances.

- Type

```tsx | pure
class SchemaSettingsManager {
    getAll(): Record<string, SchemaInitializer<any, any>>
}
```

- Example

```tsx | pure
class MyPlugin extends Plugin {
    async load() {
        const list = this.app.schemaSettingsManager.getAll();
    }
}
```

### app.schemaSettingsManager.has()

Determine if a certain SchemaSettings instance exists.

- Type

```tsx | pure
class SchemaSettingsManager {
    has(name: string): boolean
}
```

- Example

```tsx | pure
class MyPlugin extends Plugin {
    async load() {
        const hasMySchemaSettings = this.app.schemaSettingsManager.has('MySchemaSettings');
    }
}
```

### schemaSettingsManager.remove()

Remove SchemaSettings instance.

- Type

```tsx | pure
class SchemaSettingsManager {
    remove(name: string): void
}
```

- Example

```tsx | pure
class MyPlugin extends Plugin {
    async load() {
        this.app.schemaSettingsManager.remove('MySchemaSettings');
    }
}
```

### schemaSettingsManager.addItem()

Add Item of SchemaSettings instance. The difference from directly calling schemaInitializer.add() method is that it can ensure addition only when the instance exists.

- Type

```tsx | pure
class SchemaSettingsManager {
    addItem(schemaInitializerName: string, itemName: string, data: Omit<SchemaInitializerItemType, 'name'>): void
}
```

- Example

```tsx | pure
class MyPlugin extends Plugin {
    async load() {
        // Method 1: First get, then add child item, need to ensure already registered
        const mySchemaSettings = this.app.schemaSettingsManager.get('MySchemaSettings');
        if (mySchemaSettings) {
            mySchemaSettings.add('b', { type: 'item', componentProps:{ title: 'B' } })
        }

        // Method 2: Through addItem, internally ensures addition only when mySchemaSettings is registered
        this.app.schemaSettingsManager.addItem('MySchemaSettings', 'b', {
            type: 'item',
            componentProps:{ title: 'B' }
        })
    }
}
```

### schemaSettingsManager.removeItem()

Remove Item of instance. The difference from directly calling schemaInitializer.remove() method is that it can ensure removal only when the instance exists.

- Type

```tsx | pure
class SchemaSettingsManager {
    removeItem(schemaInitializerName: string, itemName: string): void
}
```

- Example

```tsx | pure
class MyPlugin extends Plugin {
    async load() {
        // Method 1: First get, then delete child item, need to ensure already registered
        const mySchemaSettings = this.app.schemaSettingsManager.get('MySchemaSettings');
        if (mySchemaSettings) {
            mySchemaSettings.remove('a')
        }

        // Method 2: Through addItem, internally ensures removal only when mySchemaSettings is registered
        this.app.schemaSettingsManager.remove('MySchemaSettings', 'a')
    }
}
```
