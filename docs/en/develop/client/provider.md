# Provider Components
Provider components are defined in the outer layer, with the core structure as follows:

```tsx
<Router>
  {' '}
  {/* Router Context Provider */}
  <ProviderA>
    <ProviderB>
      {/* Other custom Provider components - Opening tags */}
      <Routes />
      {/* Other custom Provider components - Closing tags */}
    </ProviderB>
  </ProviderA>
</Router>
```

Because they are defined in the outer layer, the purposes of `Provider` components are:

- Provide globally shared context (`Context`), need to render `props.children`
- Provide global content display, need to render `props.children`
- Interception, conditionally render `props.children`
