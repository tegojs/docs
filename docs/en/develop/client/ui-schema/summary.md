# Overview

| Concept   | Description                                                    |
| --------- | -------------------------------------------------------------- |
| UI Schema | JSON format configuration file for defining page structure and layout. |

## I. Writing Schema Components

Render registered components through configuring `x-component`

```typescript
import { Application, Plugin, SchemaComponent } from '@tachybase/client'
import React from 'react'

const HelloComponent = () => <h1>Hello World!</h1>

const HelloPage = () => {
  return (
    <SchemaComponent
      schema={{
        name: 'hello',
        type: 'void',
        'x-component': 'HelloComponent',
      }}
    />
  )
}

class PluginHello extends Plugin {
  async load() {
    this.app.addComponents({
      HelloComponent,
    })

    this.router.add('hello', {
      path: '/',
      Component: HelloPage,
    })
  }
}

const app = new Application({
  router: {
    type: 'memory',
  },
  plugins: [PluginHello],
})

export default app.getRootComponent()
```

## II. Initialize and Generate Schema Components

Insert new components into adjacent positions of existing Schema through configuring `x-initializer`

```typescript
import {
  Application,
  CardItem,
  Grid,
  Plugin,
  SchemaComponent,
  SchemaInitializer,
  SchemaInitializerItem,
  useSchemaInitializer,
  useSchemaInitializerItem,
} from '@tachybase/client'
import React from 'react'

const HelloComponent = () => <h1>Hello World!</h1>

const myInitializer = new SchemaInitializer({
  name: 'myInitializer',
  //  Button title
  title: 'Add block',
  wrap: Grid.wrap,
  items: [
    {
      name: 'demo1',
      title: 'Hello block',
      Component: () => {
        const itemConfig = useSchemaInitializerItem()
        // Call insert function
        const { insert } = useSchemaInitializer()
        const handleClick = () => {
          insert({
            type: 'void',
            'x-component': 'HelloComponent',
          })
        }
        return (
          <SchemaInitializerItem
            title={itemConfig.title}
            onClick={handleClick}
          ></SchemaInitializerItem>
        )
      },
    },
  ],
})

const HelloPage = () => {
  return (
    <div>
      <SchemaComponent
        schema={{
          name: 'hello',
          type: 'void',
          'x-component': 'Grid',
          'x-initializer': 'myInitializer',
        }}
      />
    </div>
  )
}

class PluginHello extends Plugin {
  async load() {
    this.app.addComponents({
      Grid,
      CardItem,
      HelloComponent,
    })
    this.router.add('hello', {
      path: '/',
      Component: HelloPage,
    })
    this.app.schemaInitializerManager.add(myInitializer)
  }
}

const app = new Application({
  router: {
    type: 'memory',
  },
  // For better demo display, directly set designable to true
  designable: true,
  plugins: [PluginHello],
})

export default app.getRootComponent()
```

## III. Add Designer Toolbar for Schema

Provide parameter configurator for Schema components through configuring `x-settings`, designer toolbar enables drag functionality by default

```typescript
import React from 'react'
import {  useFieldSchema } from '@tachybase/schema'
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
} from '@tachybase/client'


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
})

const myInitializer = new SchemaInitializer({
  name: 'MyInitializer',
  //  Button title
  title: 'Button Text',
  wrap: Grid.wrap,
  // When calling initializer.render(), the items list will be rendered
  items: [
    {
      name: 'demo1',
      title: 'Demo1',
      Component: () => {
        const itemConfig = useSchemaInitializerItem()
        // Call insert function
        const { insert } = useSchemaInitializer()
        const handleClick = () => {
          insert({
            type: 'void',
            'x-settings': 'mySettings',
            'x-decorator': 'CardItem',
            'x-component': 'Hello',
          })
        }
        return (
          <SchemaInitializerItem
            title={itemConfig.title}
            onClick={handleClick}
          ></SchemaInitializerItem>
        )
      },
    },
  ],
})

const HelloComponent = () => {
  const schema = useFieldSchema()
  return <h1>Hello, world! {schema.name}</h1>
}

const hello1 = Grid.wrap({
  type: 'void',
  'x-settings': 'mySettings',
  'x-decorator': 'CardItem',
  'x-component': 'HelloComponent',
})

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
  )
}

class PluginHello extends Plugin {
  async load() {
    this.app.addComponents({ Grid, CardItem, HelloComponent })
    this.app.schemaSettingsManager.add(mySettings)
    this.app.schemaInitializerManager.add(myInitializer)
    this.router.add('hello', {
      path: '/',
      Component: HelloPage,
    })
  }
}

const app = new Application({
  router: {
    type: 'memory',
  },
  designable: true,
  plugins: [PluginHello],
})

export default app.getRootComponent()
```
