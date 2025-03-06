# SchemaSettings 设置器

激活 UI 配置之后，鼠标移动到指定区块、字段、操作上方时，会显示对应的 Schema 工具栏，工具栏的设置按钮就是当前 Schema 的设置器。
![](/schemas/schema-settings.png)

## SchemaSettings 的作用

SchemaSettings 通过修改 FieldSchema 或者 Field 的属性，组件读取这些属性来实现对区块、字段、操作等的配置。

Field 是 FieldSchema 的实例，如果是修改 Field 不会将 Schema 结构保存到数据库，只是修改当前实例的属性，刷新页面后会丢失。如果你需要保存到数据库，需要修改 FieldSchema。

## 内置的设置器

![](/schemas/setting-tools.png)

## 向已有的设置器里添加设置项

推荐使用 schemaSettingsManager.addItem() 方法添加设置项，item 的详细配置参考 SchemaSettings Item API

```tsx
class PluginDemoAddSchemaSettingsItem extends Plugin {
  async load() {
    this.schemaSettingsManager.addItem(
      'mySettings', // 示例，已存在的 schema settings
      'customItem',
      {
        type: 'item',
        useComponentProps() {},
      }
    )
  }
}
```

## 添加新的设置器

SchemaSettings 的详细参数参考 SchemaSettingsOptions API

```tsx
const mySettings = new SchemaSettings({
  // 必须是唯一标识
  name: 'mySettings',
  // 下拉菜单项
  items: [
    {
      name: 'edit',
      type: 'item',
      useComponentProps() {},
    },
  ],
})
```

### 在插件的 load 方法中添加

推荐使用 schemaSettingsManager.add() 将新增的设置器添加到应用里

```tsx
class PluginDemoAddSchemaSettings extends Plugin {
  async load() {
    // 注册全局组件
    this.app.addComponents({ CardItem, HomePage })
    const mySettings = new SchemaSettings({
      name: 'mySettings',
      items: [
        {
          type: 'item',
          name: 'edit',
          useComponentProps() {
            // TODO: 补充相关设置逻辑
            return {
              title: 'Edit',
              onClick() {
                // todo
              },
            }
          },
        },
      ],
    })
    this.schemaSettingsManager.add(mySettings)
  }
}
```

### 如何使用新添加的设置器

添加进来的 SchemaSettings，可以用于 Schema 的 x-settings 参数中，并不是所有的组件都支持 x-settings，通常需要和 BlockItem、FormItem、CardItem 这类包装器组件结合使用。自定义的组件中，也可以使用 useSchemaSettingsRender() 自主处理 x-settings 的渲染。

大部分场景 x-settings 需要和 BlockItem、FormItem、CardItem 这类包装器组件结合使用。例如：

```json
{
  "type": "void",
  "x-settings": "mySettings",
  "x-decorator": "CardItem",
  "x-component": "Hello"
}
```
如果 BlockItem、FormItem、CardItem 这类包装器组件并不满足需求时，也可以使用 useSchemaSettingsRender() 处理 x-settings 的渲染。

大部分场景 settings 都是放在 SchemaToolbar 上的，所以为自定义组件支持 x-toolbar，也可以变相的支持 x-settings，更多用法参考 Schema 工具栏

## 如何实现 Schema 的设置？
通过 useSchemaSettings() 获取当前 Schema 的 Designable，通过 Designable 来操作 Schema，常用 api 有

dn.insertAdjacent()
dn.getSchemaAttribute()
dn.shallowMerge()
dn.deepMerge()
dn.findOne()
dn.find()
dn.remove()
dn.remove()
