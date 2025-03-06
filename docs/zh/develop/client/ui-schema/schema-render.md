# Schema 渲染
## 核心组件
Schema 渲染相关组件包括：

<SchemaComponentProvider /> 提供 schema 渲染所需的上下文
<SchemaComponentOptions /> 用于扩展 components 和 scopes，非必须
<SchemaComponent /> 用于渲染 schema，必须用在 <SchemaComponentProvider /> 内部


## 什么是 scope？
scope 指的是 schema 内可用的变量或函数。例如以下例子的函数 t() 需要注册到 scope 里，才能正确渲染 title
```tsx
<SchemaComponent
  scope={{ t }}
  schema={{
    title: '{{t("Hello")}}',
  }}
>
```

## 注册 components 和 scopes

SchemaComponentProvider、SchemaComponentOptions 和 SchemaComponent 都可以注册 components 和 scopes。区别在于：

SchemaComponentProvider 提供最顶层的上下文
SchemaComponentOptions 用于局部上下文的替换和扩展
SchemaComponent 为当前 schema 的上下文

```tsx
<SchemaComponentProvider components={{ ComponentA }}>
  <SchemaComponent components={{ ComponentB }} schema={schema1}>
  <SchemaComponent components={{ ComponentC }} schema={schema2}>
  <SchemaComponentOptions components={{ ComponentD }}>
    <SchemaComponent components={{ ComponentE }} schema={schema3}>
    <SchemaComponent components={{ ComponentF }} schema={schema4}>
  </SchemaComponentOptions>
</SchemaComponentProvider>
```
- schema1 里可以使用 ComponentA、ComponentB
- schema2 里可以使用 ComponentA、ComponentC
- schema3 里可以使用 ComponentA、ComponentD、ComponentE
- schema4 里可以使用 ComponentA、ComponentD、ComponentF


## 在 Application 里使用
Tachybase 客户端的 Application 的 Providers 内置了 SchemaComponentProvider 组件

```tsx
class Application {
  // 默认提供的 Providers
  addDefaultProviders() {
    this.addProvider(SchemaComponentProvider, {
      scopes: this.scopes
      components: this.components,
    });
  }
}
```
最终渲染的组件结构如下:

```tsx
<Router>
  {/* 路由的 Context Provider */}
  <SchemaComponentProvider components={app.components} scopes={app.scopes}>
    {/* 其他自定义 Provider 组件 - 开始标签 */}
    <Routes />
    {/* 其他自定义 Provider 组件 - 结束标签 */}
  </SchemaComponentProvider>
</Router>
```
应用内部使用时，无需再套 SchemaComponentProvider，直接用 SchemaComponent 就可以了

在应用的生命周期方法内可以使用 app.addComponents() 和 app.addScopes() 扩展全局的 components 和 scopes。

```tsx
class PluginHello extends Plugin {
  async load() {
    this.app.addComponents({
      // 扩展的组件
    });
    this.app.addScopes({
      // 扩展的 scope
    });
  }
}
```


