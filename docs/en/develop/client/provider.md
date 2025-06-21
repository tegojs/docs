# Provider 组件
Provider 组件在外层定义，核心结构如下：

```tsx
<Router>
  {' '}
  {/* 路由的 Context Provider */}
  <ProviderA>
    <ProviderB>
      {/* 其他自定义 Provider 组件 - 开始标签 */}
      <Routes />
      {/* 其他自定义 Provider 组件 - 结束标签 */}
    </ProviderB>
  </ProviderA>
</Router>
```

因为定义在外层，所以 `Provider` 组件的用处有：

- 提供全局共享的上下文（`Context`），需要渲染 `props.children`
- 提供全局内容展示，需要渲染 `props.children`
- 拦截作用，根据条件渲染 `props.children`
