# Schema Rendering
## Core Components
Schema rendering related components include:

<SchemaComponentProvider /> Provides the context required for schema rendering
<SchemaComponentOptions /> Used to extend components and scopes, not required
<SchemaComponent /> Used to render schema, must be used inside <SchemaComponentProvider />


## What is scope?
Scope refers to variables or functions available within the schema. For example, in the following example, the function t() needs to be registered in the scope to correctly render the title
```tsx
<SchemaComponent
  scope={{ t }}
  schema={{
    title: '{{t("Hello")}}',
  }}
>
```

## Register components and scopes

SchemaComponentProvider, SchemaComponentOptions, and SchemaComponent can all register components and scopes. The difference is:

SchemaComponentProvider provides the top-level context
SchemaComponentOptions is used for local context replacement and extension
SchemaComponent is the context for the current schema

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
- schema1 can use ComponentA, ComponentB
- schema2 can use ComponentA, ComponentC
- schema3 can use ComponentA, ComponentD, ComponentE
- schema4 can use ComponentA, ComponentD, ComponentF


## Using in Application
Tachybase client Application's Providers has built-in SchemaComponentProvider component

```tsx
class Application {
  // Default provided Providers
  addDefaultProviders() {
    this.addProvider(SchemaComponentProvider, {
      scopes: this.scopes
      components: this.components,
    });
  }
}
```
The final rendered component structure is as follows:

```tsx
<Router>
  {/* Router Context Provider */}
  <SchemaComponentProvider components={app.components} scopes={app.scopes}>
    {/* Other custom Provider components - Opening tags */}
    <Routes />
    {/* Other custom Provider components - Closing tags */}
  </SchemaComponentProvider>
</Router>
```
When used inside the application, there's no need to wrap with SchemaComponentProvider, just use SchemaComponent directly

In the application lifecycle methods, you can use app.addComponents() and app.addScopes() to extend global components and scopes.

```tsx
class PluginHello extends Plugin {
  async load() {
    this.app.addComponents({
      // Extended components
    });
    this.app.addScopes({
      // Extended scope
    });
  }
}
```
