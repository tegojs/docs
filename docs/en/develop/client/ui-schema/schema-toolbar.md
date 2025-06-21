# SchemaToolbar 工具栏

激活 UI 配置之后，鼠标移动到指定卡片、字段、操作上方时，会显示对应的 Schema 的工具栏。

![](/schemas/schema-toolbar.png)

工具栏的组成部分包括：

- 标题，默认为空
- 拖拽控件，用于提供拖拽能力，默认可拖拽
- 初始化器，默认为空
- 设置器，默认为空

```tsx
<SchemaToolbar title="Title" draggable initialize={'myInitializer'} settings={'mySettings'} />
```

## 用法

SchemaToolbar 组件用于 x-toolbar 中，如：

```json
// 使用内置的 SchemaToolbar
{
  'x-toolbar': 'SchemaToolbar',
  'x-toolbar-props': {},
}
// 自定义 SchemaToolbar
{
  'x-toolbar': 'MySchemaToolbar',
  'x-toolbar-props': {},
}

```
## 支持 x-toolbar 的 Schema 组件有

- BlockItem（包装器组件，一般用在 x-decorator 中）
- CardItem（包装器组件，一般用在 x-decorator 中）
- FormItem（包装器组件，一般用在 x-decorator 中）
- Action（操作按钮组件，用在 x-component 中）
如果 schema 的 x-component 或 x-decorator 使用了以上组件，又配置了 x-settings，x-toolbar 可以缺失，默认使用内置的 SchemaToolbar 渲染
