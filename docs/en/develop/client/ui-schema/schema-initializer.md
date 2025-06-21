## SchemaInitializer 初始化器

当激活 UI 配置之后，界面上直观可见的各种橙色按钮就是 Schema 初始化器，用于向界面内添加各种卡片、字段、操作等。

![](/schemas/schema-init.png)

## 向已有的初始化器里添加项

推荐使用 schemaInitializerManager.addItem() 方法添加项

```tsx
class PluginDemoAddSchemaInitializerItem extends Plugin {
  async load() {
    this.schemaInitializerManager.addItem(
      'myInitializer', // 示例，已存在的 schema initializer
      'otherBlocks.custom', // 向 otherBlocks 分组内添加 custom
      {
        type: 'item',
        useComponentProps() {},
      }
    )
  }
}
```

## 添加新的初始化器

```tsx
const myInitializer = new SchemaInitializer({
  // 初始化器标识，全局唯一
  name: 'myInitializer',
  title: 'Add Block',
  // 包装，例如插入到 Grid 里，需要用 Grid.wrap 处理（添加行列标签）
  wrap: Grid.wrap,
  // 插入位置，默认为 beforeEnd，支持 'beforeBegin' | 'afterBegin' | 'beforeEnd' | 'afterEnd'
  insertPosition: 'beforeEnd',
  // 下拉菜单项
  items: [
    {
      name: 'a',
      type: 'item',
      useComponentProps() {},
    },
  ],
})
```

### 在插件的 load 方法中注册

推荐使用 schemaInitializerManager.add() 将新增的初始化器添加到应用里

```tsx
class PluginDemoAddSchemaInitializer extends Plugin {
  async load() {
    const myInitializer = new SchemaInitializer({
      name: 'myInitializer',
      title: 'Add block',
      wrap: Grid.wrap,
      items: [
        {
          name: 'helloBlock',
          type: 'item',
          useComponentProps() {
            const { insert } = useSchemaInitializer()
            return {
              title: 'Hello',
              onClick: () => {
                insert({
                  type: 'void',
                  'x-decorator': 'CardItem',
                  'x-component': 'h1',
                  'x-content': 'Hello, world!',
                })
              },
            }
          },
        },
      ],
    })
    this.schemaInitializerManager.add(myInitializer)
  }
}
```

### 如何使用新添加的初始化器

SchemaInitializer 用于 Schema 的 x-initializer 参数中。

通用的支持 x-initializer 的 Schema 组件有 Grid、ActionBar、Tabs，例如：

```json
{
  "type": "void",
  "x-component": "Grid",
  "x-initializer": "myInitializer"
}
```

如果 Grid、ActionBar、Tabs 这类组件并不满足需求，自定义的组件中，也可以使用 useSchemaInitializerRender() 处理 x-initializer 的渲染。
