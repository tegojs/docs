# SchemaToolbar

After activating UI configuration, when the mouse moves over specified blocks, fields, or actions, the corresponding Schema toolbar will be displayed.

![](/schemas/schema-toolbar.png)

The toolbar components include:

- Title, default is empty
- Drag control, used to provide drag capability, draggable by default
- Initializer, default is empty
- Settings controller, default is empty

```tsx
<SchemaToolbar title="Title" draggable initialize={'myInitializer'} settings={'mySettings'} />
```

## Usage

SchemaToolbar component is used in x-toolbar, such as:

```json
// Use built-in SchemaToolbar
{
  'x-toolbar': 'SchemaToolbar',
  'x-toolbar-props': {},
}
// Custom SchemaToolbar
{
  'x-toolbar': 'MySchemaToolbar',
  'x-toolbar-props': {},
}

```
## Schema Components that Support x-toolbar

- BlockItem (wrapper component, generally used in x-decorator)
- CardItem (wrapper component, generally used in x-decorator)
- FormItem (wrapper component, generally used in x-decorator)
- Action (action button component, used in x-component)
If the schema's x-component or x-decorator uses the above components and x-settings is configured, x-toolbar can be omitted, and the built-in SchemaToolbar will be used for rendering by default
