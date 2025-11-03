# SchemaSettings

## new SchemaSettings(options)

Create a SchemaSettings instance.

```tsx | pure
interface SchemaSettingsOptions<T = {}> {
  name: string;
  Component?: ComponentType<T>;
  componentProps?: T;
  style?: React.CSSProperties;

  items: SchemaSettingsItemType[];
}

class SchemaSettings<T = {}>{
    constructor(options: SchemaSettingsOptions<T>): SchemaSettings<T>;
    add(name: string, item: Omit<SchemaSettingsItemType, 'name'>): void
    get(nestedName: string): SchemaSettingsItemType | undefined
    remove(nestedName: string): void
}
```

### Detailed Explanation

- name: Unique identifier, required
- Component related

  - Component: Trigger component, default is `<MenuOutlined />` component
  - componentProps: Component properties
  - style: Component style
- items: List item configuration

### Example

#### Basic Usage

```tsx | pure
const mySchemaSettings = new SchemaSettings({
  name: 'MySchemaSettings',
  items: [
    {
      name: 'demo1', // Unique identifier
      type: 'item', // Built-in type
      componentProps: {
        title: 'DEMO1',
        onClick() {
          alert('DEMO1');
        },
      },
    },
    {
      name: 'demo2',
      Component: () => <SchemaSettings.Item title="DEMO2" onClick={() => alert('DEMO2')} />, // Directly use Component component
    },
  ],
});
```

#### Customize `Component`

```tsx | pure
const mySchemaSettings = new SchemaSettings({
  name: 'MySchemaSettings',
  Component: Button, // Custom component
  componentProps: {
    type: 'primary',
    children: 'Custom Button',
  },
  // Component: (props) => <Button type='primary' {...props}>Custom Button</Button>, // Equivalent to the above effect
  items: [
    {
      name: 'demo1',
      type: 'item',
      componentProps: {
        title: 'DEMO',
      },
    },
  ],
});
```

## options.items Configuration Details

```tsx | pure
interface SchemaSettingsItemCommon<T = {}> {
  name: string;
  sort?: number;
  type?: string;
  Component: string | ComponentType<T>;
  useVisible?: () => boolean;
  children?: SchemaSettingsItemType[];
  useChildren?: () => SchemaSettingsItemType[];
  checkChildrenLength?: boolean;
  componentProps?: Omit<T, 'children'>;
  useComponentProps?: () => Omit<T, 'children'>;
}
```

### Two Definition Methods: `Component` and `type`


- Define through `Component`

```tsx | pure

const Demo = () => {
  // Finally renders `SchemaSettingsItem`
  return <SchemaSettingsItem title='Demo' />
}

const mySettings = new SchemaSettings({
  name: 'mySettings',
  items: [
    {
      name: 'a',
      Component: Demo, // Define through Component
    }
  ],
});
```

- Define through `type`

Tachybase has built-in some commonly used `type`, for example `type: 'item'`, equivalent to `Component: SchemaSettingsItem`.

For more built-in types, please refer to: [Built-in Components and Types](./SchemaSettings)

```tsx | pure
const mySettings = new SchemaSettings({
  name: 'mySettings',
  items: [
    {
      name: 'a',
      type: 'item',
      componentProps: {
        title: 'Demo',
      },
    }
  ],
});
```

<code src="./demos/schema-settings-options-item-define.tsx"></code>

### `children` and Dynamic Method `useChildren`

For some components, there are child list items, such as `type: 'itemGroup'`, then we use the children property. At the same time, considering that in some scenarios children are dynamic and need to be obtained from Hooks, you can define them through `useChildren`.

<code src="./demos/schema-settings-options-item-children.tsx"></code>

### Dynamic Show/Hide `useVisible`

<code src="./demos/schema-settings-options-item-visible.tsx"></code>

### Component Properties `componentProps` and Dynamic Properties `useComponentProps`

For some general components, we can define component properties through `componentProps`. At the same time, considering that in some scenarios component properties are dynamic and need to be obtained from Hooks, you can define them through `useComponentProps`.

Of course, you can also not use these two properties, directly encapsulate into a component, then define through `Component`.

<code src="./demos/schema-settings-options-item-props.tsx"></code>

## Instance Methods

```tsx | pure
const mySchemaSettings = new SchemaSettings({
  name: 'MySchemaSettings',
  items: [
    {
      name: 'a',
      type: 'itemGroup',
      componentProps: {
        title: 'item a'
      },
      children: [
          {
              name: 'a1',
              title: 'item a1',
          }
      ],
    },
  ],
});
```

### schemaSettings.add()

Used to add Item.

- Type

```tsx | pure
class SchemaSettings {
    add(name: string, item: Omit<SchemaSettingsItemType, 'name'>): void
}
```

- Parameter Description

The first parameter is name, as a unique identifier for CRUD operations, and `name` supports `.` for splitting levels.

- Example

```tsx | pure
mySchemaSetting.add('b', {
    type: 'item',
    title: 'item b',
})

mySchemaSetting.add('a.a2', {
    type: 'item',
    title: 'item a2',
})
```

### schemaSettings.get()

- Type

```tsx | pure
class SchemaSettings {
    get(nestedName: string): SchemaSettingsItemType| undefined
}
```

- Example

```tsx | pure
const itemA = mySchemaSetting.get('a')

const itemA1 = mySchemaSetting.add('a.a1')
```

### schemaSettings.remove()

- Type

```tsx | pure
class SchemaSettings {
    remove(nestedName: string): void
}
```

- Example

```tsx | pure
mySchemaSetting.remove('a.a1')

mySchemaSetting.remove('a')
```

## Hooks

### useSchemaSettingsRender()

Used to render SchemaSettings.

- Type

```tsx | pure
function useSchemaSettingsRender(name: string, options?: SchemaSettingsOptions): {
    exists: boolean;
    render: (options?: SchemaSettingsRenderOptions) => React.ReactElement;
}
```

- Example

```tsx | pure
const Demo = () => {
    const filedSchema = useFieldSchema();
    const { render, exists } = useSchemaSettingsRender(fieldSchema['x-settings'], fieldSchema['x-settings-props'])
    return <div>
        <div>{ render() }</div>
        <div>Can override parameters: { render({ style: { color: 'red' } }) }</div>
    </div>
}
```

<code src="./demos/schema-settings-render.tsx"></code>

### useSchemaSettings()

Get schemaSetting context data.

Context data contains `options` from `schemaSetting` instantiation and `options` passed when calling `useSchemaSettingsRender()`.

- Type

```tsx | pure
interface UseSchemaSettingsResult<T> extends SchemaSettingsOptions<T> {
  dn?: Designable;
  field?: GeneralField;
  fieldSchema?: Schema;
}

function useSchemaSettings(): UseSchemaSettingsResult;
```

- Example

```tsx | pure
const { dn } = useSchemaSettings();
```

### useSchemaSettingsItem()

Used to get an item's data.

- Type

```tsx | pure
export type SchemaSettingsItemType<T = {}> = {
  name: string;
  type?: string;
  sort?: number;
  Component?: string | ComponentType<T>;
  componentProps?: T;
  useComponentProps?: () => T;
  useVisible?: () => boolean;
  children?: SchemaSettingsItemType[];
  [index]: any;
};

function useSchemaSettingsItem(): SchemaSettingsItemType;
```

- Example

```tsx | pure
const { name } = useSchemaSettingsItem();
```

## Built-in Components and Types

| type        | Component                      | Effect                                      |
| ----------- | ------------------------------ | ----------------------------------------- |
| item        | SchemaSettingsItem            | Text                                      |
| itemGroup   | SchemaSettingsItemGroup       | Group, same as Menu component's `type: 'itemGroup'`      |
| subMenu     | SchemaSettingsSubMenu         | Submenu, same as Menu component's submenu              |
| divider     | SchemaSettingsDivider         | Divider, same as Menu component's `type: 'divider'` |
| remove      | SchemaSettingsRemove          | Delete, used to delete a block                    |
| select      | SchemaSettingsSelectItem      | Dropdown select                                  |
| cascader    | SchemaSettingsCascaderItem    | Cascade select                                  |
| switch      | SchemaSettingsSwitchItem      | Switch                                      |
| popup       | SchemaSettingsPopupItem       | Popup layer                                    |
| actionModal | SchemaSettingsActionModalItem | Action modal                                  |
| modal       | SchemaSettingsModalItem       | Modal                                      |

### SchemaSettingsItem

Text, corresponding `type` is `item`.

```tsx | pure
interface SchemaSettingsItemProps extends Omit<MenuItemProps, 'title'> {
  title: string;
}
```

Core parameters are `title` and `onClick`. You can modify schema in `onClick`.

<code src="./demos/schema-settings-components-item.tsx"></code>

### SchemaSettingsItemGroup

Group, corresponding `type` is `itemGroup`.

Core parameter is `title`.

<code src="./demos/schema-settings-components-group.tsx"></code>

### SchemaSettingsSubMenu

Submenu, corresponding `type` is `subMenu`.

Core parameter is `title`.

<code src="./demos/schema-settings-components-sub-menu.tsx"></code>

### SchemaSettingsDivider

Divider, corresponding `type` is `divider`.

<code src="./demos/schema-settings-components-divider.tsx"></code>

### SchemaSettingsRemove

Delete, corresponding `type` is `remove`.

```tsx | pure
interface SchemaSettingsRemoveProps {
  confirm?: ModalFuncProps;
  removeParentsIfNoChildren?: boolean;
  breakRemoveOn?: ISchema | ((s: ISchema) => boolean);
}
```

- `confirm`: Confirmation modal before deletion
- `removeParentsIfNoChildren`: Whether to delete parent node if there are no child nodes after deletion
- `breakRemoveOn`: Whether to interrupt deletion if the deleted node meets the condition

<code src="./demos/schema-settings-components-remove.tsx"></code>

### SchemaSettingsSelectItem

Selector, corresponding `type` is `select`.

<code src="./demos/schema-settings-components-select.tsx"></code>

### SchemaSettingsCascaderItem

Cascade select, corresponding `type` is `cascader`.

### SchemaSettingsSwitchItem

Switch, corresponding `type` is `switch`.

<code src="./demos/schema-settings-components-switch.tsx"></code>

### SchemaSettingsModalItem

Modal, corresponding `type` is `modal`.

```tsx | pure
export interface SchemaSettingsModalItemProps {
  title: string;
  onSubmit: (values: any) => void;
  initialValues?: any;
  schema?: ISchema | (() => ISchema);
  modalTip?: string;
  components?: any;
  hidden?: boolean;
  scope?: any;
  effects?: any;
  width?: string | number;
  children?: ReactNode;
  asyncGetInitialValues?: () => Promise<any>;
  eventKey?: string;
  hide?: boolean;
}
```

We can define the modal's form through the `schema` parameter, then get the form's values in `onSubmit`, then modify the current schema node.

<code src="./demos/schema-settings-components-modal.tsx"></code>

### SchemaSettingsActionModalItem

Action modal, corresponding `type` is `actionModal`.

The difference from `modal` is that `SchemaSettingsModalItem` modal will lose context, while `SchemaSettingsActionModalItem` will retain context. Simple scenarios can use `SchemaSettingsModalItem`, complex scenarios can use `SchemaSettingsActionModalItem`.

```tsx | pure
export interface SchemaSettingsActionModalItemProps extends SchemaSettingsModalItemProps, Omit<SchemaSettingsItemProps, 'onSubmit' | 'onClick'> {
  uid?: string;
  initialSchema?: ISchema;
  schema?: ISchema;
  beforeOpen?: () => void;
  maskClosable?: boolean;
}
```

<code src="./demos/schema-settings-components-action-modal.tsx"></code>
