# SchemaInitializerManager

## Instance Methods

### schemaInitializerManager.add()

Add SchemaInitializer instance.

- Type

```tsx | pure
class SchemaInitializerManager {
    add(...schemaInitializerList: SchemaInitializer[]): void
}
```

- Example

```tsx | pure
const mySchemaInitializer = new SchemaInitializer({
  name: 'MySchemaInitializer',
  title: 'Add Block',
  items: [
    {
      name: 'demo',
      type: 'item',
      useComponentProps(){
          title: 'Demo'
      }
    }
  ],
});

class MyPlugin extends Plugin {
    async load() {
        this.app.schemaInitializerManager.add(mySchemaInitializer);
    }
}
```

### schemaInitializerManager.get()

Get a SchemaInitializer instance.

- Type

```tsx | pure
class SchemaInitializerManager {
    get<T = any>(name: string): SchemaInitializer<T> | undefined
}
```

- Example

```tsx | pure
class MyPlugin extends Plugin {
    async load() {
       const mySchemaInitializer = this.app.schemaInitializerManager.get('MySchemaInitializer');
    }
}
```

### schemaInitializerManager.getAll()

Get all SchemaInitializer instances.

- Type

```tsx | pure
class SchemaInitializerManager {
    getAll(): Record<string, SchemaInitializer<any, any>>
}
```

- Example

```tsx | pure
class MyPlugin extends Plugin {
    async load() {
        const list = this.app.schemaInitializerManager.getAll();
    }
}
```

### app.schemaInitializerManager.has()

Determine if a certain SchemaInitializer instance exists.

- Type

```tsx | pure
class SchemaInitializerManager {
    has(name: string): boolean
}
```

- Example

```tsx | pure
class MyPlugin extends Plugin {
    async load() {
        const hasMySchemaInitializer = this.app.schemaInitializerManager.has('MySchemaInitializer');
    }
}
```

### schemaInitializerManager.remove()

Remove SchemaInitializer instance.

- Type

```tsx | pure
class SchemaInitializerManager {
    remove(name: string): void
}
```

- Example

```tsx | pure
class MyPlugin extends Plugin {
    async load() {
        this.app.schemaInitializerManager.remove('MySchemaInitializer');
    }
}
```

### schemaInitializerManager.addItem()

Add Item of SchemaInitializer instance. The difference from directly calling schemaInitializer.add() method is that it can ensure addition only when the instance exists.

- Type

```tsx | pure
class SchemaInitializerManager {
    addItem(schemaInitializerName: string, itemName: string, data: Omit<SchemaInitializerItemType, 'name'>): void
}
```

- Example

```tsx | pure
class MyPlugin extends Plugin {
    async load() {
        // Method 1: First get, then add child item, need to ensure already registered
        const mySchemaInitializer = this.app.schemaInitializerManager.get('MySchemaInitializer');
        if (mySchemaInitializer) {
            mySchemaInitializer.add('b', { type: 'item', useComponentProps:{ title: 'B' } })
        }

        // Method 2: Through addItem, internally ensures addition only when mySchemaInitializer is registered
        this.app.schemaInitializerManager.addItem('MySchemaInitializer', 'b', {
            type: 'item',
            useComponentProps:{ title: 'B' }
        })
    }
}
```

### schemaInitializerManager.removeItem()

Remove Item of instance. The difference from directly calling schemaInitializer.remove() method is that it can ensure removal only when the instance exists.

- Type

```tsx | pure
class SchemaInitializerManager {
    removeItem(schemaInitializerName: string, itemName: string): void
}
```

- Example

```tsx | pure
class MyPlugin extends Plugin {
    async load() {
        // Method 1: First get, then delete child item, need to ensure already registered
        const mySchemaInitializer = this.app.schemaInitializerManager.get('MySchemaInitializer');
        if (mySchemaInitializer) {
            mySchemaInitializer.remove('a')
        }

        // Method 2: Through addItem, internally ensures removal only when mySchemaInitializer is registered
        this.app.schemaInitializerManager.remove('MySchemaInitializer', 'a')
    }
}
```
