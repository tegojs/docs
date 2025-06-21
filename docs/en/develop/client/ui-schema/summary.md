# 概述

| 概念      | 说明                                             |
| --------- | ------------------------------------------------ |
| UI Schema | 用于定义页面的结构和布局的 JSON 格式的配置文件。 |

## 一. 编写 Schema 组件

通过配置 `x-component` 将已注册的组件渲染出来

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

## 二. 初始化生成 Schema 组件

通过配置 `x-initializer` 将新的组件插入到已存在的 Schema 的相邻位置

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
  //  按钮标题标题
  title: 'Add block',
  wrap: Grid.wrap,
  items: [
    {
      name: 'demo1',
      title: 'Hello block',
      Component: () => {
        const itemConfig = useSchemaInitializerItem()
        // 调用插入功能
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
  // 为了更好的展示 demo，直接将 designable 设置为 true
  designable: true,
  plugins: [PluginHello],
})

export default app.getRootComponent()
```

## 三. 为 Schema 添加设计器工具栏

通过配置 `x-settings` 为 Schema 组件提供参数配置器，设计器工具栏默认开启拖拽功能

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
  //  按钮标题标题
  title: 'Button Text',
  wrap: Grid.wrap,
  // 调用 initializer.render() 时会渲染 items 列表
  items: [
    {
      name: 'demo1',
      title: 'Demo1',
      Component: () => {
        const itemConfig = useSchemaInitializerItem()
        // 调用插入功能
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
