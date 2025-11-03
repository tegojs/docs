# SchemaToolbar

## Components

### SchemaToolbar Component

This is the default Toolbar component. It will automatically render `SchemaSettings`, `SchemaInitializer` and `Drag` components based on Schema's `x-settings` and `x-initializer`.

The specific rendering rules for Toolbar are: when there is `x-toolbar`, the corresponding component will be rendered; when there is no `x-toolbar` but there is `x-settings` or `x-initializer`, the default `SchemaToolbar` component will be rendered.

- Type

```tsx | pure
interface SchemaToolbarProps {
  title?: string;
  draggable?: boolean;
  initializer?: string | false;
  settings?: string | false;
  /**
   * @default true
   */
  showBorder?: boolean;
  showBackground?: boolean;
}
```

- Detailed Explanation
  - `title`: Title in the upper left corner
  - `draggable`: Whether it can be dragged, default is `true`
  - `initializer`: Default value of `SchemaInitializer`. When there is no `x-initializer` in schema, this value will be used; when it is `false`, `SchemaInitializer` will not be rendered
  - `settings`: Default value of `SchemaSettings`. When there is no `x-settings` in schema, this value will be used; when it is `false`, `SchemaSettings` will not be rendered
  - `showBorder`: Whether border changes to orange
  - `showBackground`: Whether background changes to orange

- Example

When `x-toolbar` is not specified, the default `SchemaToolbar` component will be rendered.

```tsx
import { useFieldSchema } from '@tachybase/schema';
import {
  Application,
  CardItem,
  Grid,
  Plugin,
  SchemaComponent,
  SchemaInitializer,
  SchemaInitializerItem,
  SchemaSettings,
  useSchemaInitializer,
  useSchemaInitializerItem,
} from '@tachybase/client';
import React from 'react';

const mySettings = new SchemaSettings({
  name: 'mySettings',
  items: [
    {
      name: 'remove',
      type: 'remove',
      componentProps: {
        removeParentsIfNoChildren: true,
      },
    },
  ],
});

const myInitializer = new SchemaInitializer({
  name: 'MyInitializer',
  title: 'Button Text',
  wrap: Grid.wrap,
  items: [
    {
      name: 'demo1',
      title: 'Demo1',
      Component: () => {
        const itemConfig = useSchemaInitializerItem();
        const { insert } = useSchemaInitializer();
        const handleClick = () => {
          insert({
            type: 'void',
            'x-settings': 'mySettings',
            'x-decorator': 'CardItem',
            'x-component': 'Hello',
          });
        };
        return <SchemaInitializerItem title={itemConfig.title} onClick={handleClick}></SchemaInitializerItem>;
      },
    },
  ],
});

const Hello = () => {
  const schema = useFieldSchema();
  return <h1>Hello, world! {schema.name}</h1>;
};

const hello1 = Grid.wrap({
  type: 'void',
  // Only specified `x-settings` but no `x-toolbar`, will use default `SchemaToolbar` component
  'x-settings': 'mySettings',
  'x-decorator': 'CardItem',
  'x-component': 'Hello',
});

const HelloPage = () => {
  return (
    <div>
      <SchemaComponent
        schema={{
          name: 'root',
          type: 'void',
          'x-component': 'Grid',
          'x-initializer': 'MyInitializer',
          properties: {
            hello1,
          },
        }}
      />
    </div>
  );
};

class PluginHello extends Plugin {
  async load() {
    this.app.addComponents({ Grid, CardItem, Hello });
    this.app.schemaSettingsManager.add(mySettings);
    this.app.schemaInitializerManager.add(myInitializer);
    this.router.add('hello', {
      path: '/',
      Component: HelloPage,
    });
  }
}

const app = new Application({
  router: {
    type: 'memory',
  },
  designable: true,
  plugins: [PluginHello],
});

export default app.getRootComponent();
```

Custom Toolbar component.


```tsx
import { Card } from 'antd';
import { useFieldSchema } from '@tachybase/schema';
import {
  Application,
  CardItem,
  Grid,
  Plugin,
  SchemaComponent,
  SchemaInitializer,
  SchemaInitializerItem,
  SchemaSettings,
  SchemaToolbar,
  useSchemaInitializer,
  useSchemaInitializerItem,
  useSchemaToolbarRender
} from '@tachybase/client';
import React from 'react';

const mySettings = new SchemaSettings({
  name: 'mySettings',
  items: [
    {
      name: 'remove',
      type: 'remove',
      componentProps: {
        removeParentsIfNoChildren: true,
      },
    },
  ],
});

const MyToolbar = (props) => {
  return <SchemaToolbar showBackground title='Test' {...props} />
}

// Custom wrapper
const MyDecorator = ({children}) => {
  const filedSchema = useFieldSchema();
  // Use `useSchemaToolbarRender()` to get and render content
  const { render } = useSchemaToolbarRender(filedSchema);
  return <Card style={{ marginBottom: 10 }}>{ render({ draggable: false }) }{children}</Card>
}

const myInitializer = new SchemaInitializer({
  name: 'MyInitializer',
  title: 'Button Text',
  wrap: Grid.wrap,
  items: [
    {
      name: 'demo1',
      title: 'Demo1',
      Component: () => {
        const itemConfig = useSchemaInitializerItem();
        // Call insert function
        const { insert } = useSchemaInitializer();
        const handleClick = () => {
          insert({
            type: 'void',
            // Use custom Toolbar component
            'x-toolbar': 'MyToolbar',
            'x-settings': 'mySettings',
            'x-decorator': 'MyDecorator',
            'x-component': 'Hello',
          });
        };
        return <SchemaInitializerItem title={itemConfig.title} onClick={handleClick}></SchemaInitializerItem>;
      },
    },
  ],
});

const Hello = () => {
  const schema = useFieldSchema();
  return <h1>Hello, world! {schema.name}</h1>;
};

const hello1 = Grid.wrap({
  type: 'void',
  // Use custom Toolbar component
  'x-toolbar': 'MyToolbar',
  'x-settings': 'mySettings',
  'x-decorator': 'MyDecorator',
  'x-component': 'Hello',
});

const HelloPage = () => {
  return (
    <div>
      <SchemaComponent
        schema={{
          name: 'root',
          type: 'void',
          'x-component': 'Grid',
          'x-initializer': 'MyInitializer',
          properties: {
            hello1,
          },
        }}
      />
    </div>
  );
};

class PluginHello extends Plugin {
  async load() {
    this.app.addComponents({ Grid, CardItem, Hello, MyToolbar, MyDecorator });
    this.app.schemaSettingsManager.add(mySettings);
    this.app.schemaInitializerManager.add(myInitializer);
    this.router.add('hello', {
      path: '/',
      Component: HelloPage,
    });
  }
}

const app = new Application({
  router: {
    type: 'memory',
  },
  designable: true,
  plugins: [PluginHello],
});

export default app.getRootComponent();
```

## Hooks

### useSchemaToolbarRender()

Used to render `SchemaToolbar`.

- Type

```tsx | pure
const useSchemaToolbarRender: (fieldSchema: ISchema) => {
    render(props?: SchemaToolbarProps): React.JSX.Element;
    exists: boolean;
}
```

- Detailed Explanation

In the previous example, the component `CardItem` in `'x-decorator': 'CardItem'` called `useSchemaToolbarRender()` for rendering. Built-in components also include: `BlockItem`, `CardItem`, `Action`, `FormItem`.

`render()` supports overriding component properties a second time.

- Example

```tsx | pure
const MyDecorator = () => {
  const filedSchema = useFieldSchema();
  const { render } = useSchemaToolbarRender(filedSchema); // Read Toolbar component from Schema

  return <Card>{ render() }</Card>
}
```
