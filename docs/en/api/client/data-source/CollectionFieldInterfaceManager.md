# CollectionFieldInterfaceManager

Mainly used to manage [CollectionFieldInterface](./CollectionFieldInterface) and [CollectionFieldInterfaceGroups](#CollectionFieldInterfaceGroups), which is managed by [DataSourceManager](./DataSourceManager).


## 1. CollectionFieldInterfaceGroups

CollectionFieldInterfaceGroups is used to group data table fields.

<!-- ![Field Groups](./images/field-groups.png) -->

## 2. Instance Methods

### field interface

#### addFieldInterfaces()

Add field interface.

- Type

```tsx | pure
class CollectionFieldInterfaceManager {
  addFieldInterfaces(fieldInterfaces: CollectionFieldInterface[]): void
}
```

- Example

```tsx | pure
class CheckboxFieldInterface extends CollectionFieldInterface {
  name = 'checkbox';
  type = 'object';
  group = 'choices';
  title = '{{t("Checkbox")}}';
  // ...
}

class MyPlugin extends Plugin {
  async load() {
    this.app.dataSourceManager.collectionFieldInterfaceManager.addFieldInterfaces([CheckboxFieldInterface]);
    // or
    this.app.dataSourceManager.addFieldInterfaces([CheckboxFieldInterface]);
  }
}
```

#### getFieldInterface(name)

Get field interface.

- Type

```tsx | pure
class CollectionFieldInterfaceManager {
  getFieldInterface<T extends CollectionFieldInterface>(name: string): T;
}
```

- Example

```tsx | pure
class MyPlugin extends Plugin {
  async load() {
    const fieldInterface = this.app.dataSourceManager.collectionFieldInterfaceManager.getFieldInterface('checkbox'); // checkboxFieldInterface
  }
}
```

#### getFieldInterfaces()

Get all field interfaces.

- Type

```tsx | pure
class CollectionFieldInterfaceManager {
  getFieldInterfaces(): CollectionFieldInterface[];
}
```

- Example

```tsx | pure
class MyPlugin extends Plugin {
  async load() {
    const fieldInterfaces = this.app.dataSourceManager.collectionFieldInterfaceManager.getFieldInterfaces();
  }
}
```

Add Field interface component option.

- Type

```tsx | pure
interface CollectionFieldInterfaceComponentOption {
  label: string;
  value: string;
  useVisible?: () => boolean;
  useProps?: () => any;
}

class CollectionFieldInterfaceManager {
  addFieldInterfaceComponentOption(interfaceName: string, componentOption: CollectionFieldInterfaceComponentOption): void
}
```

- Example

```tsx | pure
class MyPlugin extends Plugin {
  async load() {
    this.app.dataSourceManager.collectionFieldInterfaceManager.addFieldInterfaceComponentOption('url', {
      label: 'Preview',
      value: 'Input.Preview',
    });
  }
}
```

### field interface group

#### addFieldInterfaceGroups(fieldGroups)

Add field interface group.

- Type

```tsx | pure
class CollectionFieldInterfaceManager {
  addFieldInterfaceGroups(fieldGroups: Record<string, { label: string; order?: number }>): void;
}
```

- Example

```tsx | pure
class MyPlugin extends Plugin {
  async load() {
    this.app.dataSourceManager.collectionFieldInterfaceManager.addFieldInterfaceGroups({
      'test': {
        label: 'Test',
        order: 1,
      }
    });

    // or
    this.app.dataSourceManager.addFieldInterfaceGroups({
      'test': {
        label: 'Test',
        order: 1,
      }
    });
  }
}
```

#### getFieldInterfaceGroups()

Get all field interface groups.

- Type

```tsx | pure
class CollectionFieldInterfaceManager {
  getFieldInterfaceGroups(): Record<string, { label: string; order?: number }>;
}
```

- Example

```tsx | pure
class MyPlugin extends Plugin {
  async load() {
    const fieldInterfaceGroups = this.app.dataSourceManager.collectionFieldInterfaceManager.getFieldInterfaceGroups(); // { 'test': { label: 'Test', order: 1 } }
  }
}
```

#### getFieldInterfaceGroup(name)

Get field interface group.

- Type

```tsx | pure
class CollectionFieldInterfaceManager {
  getFieldInterfaceGroup(name: string): { label: string; order?: number };
}
```

- Example

```tsx | pure
class MyPlugin extends Plugin {
  async load() {
    const fieldInterfaceGroup = this.app.dataSourceManager.collectionFieldInterfaceManager.getFieldInterfaceGroup('test'); // { label: 'Test', order: 1 }
  }
}
```
