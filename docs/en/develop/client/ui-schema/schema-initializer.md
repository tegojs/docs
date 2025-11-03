# SchemaInitializer

After activating UI configuration, the various orange buttons that are intuitively visible on the interface are Schema initializers, used to add various blocks, fields, actions, etc. to the interface.

![](/schemas/schema-init.png)

## Add Items to Existing Initializers

It's recommended to use the schemaInitializerManager.addItem() method to add items

```tsx
class PluginDemoAddSchemaInitializerItem extends Plugin {
  async load() {
    this.schemaInitializerManager.addItem(
      'myInitializer', // Example, existing schema initializer
      'otherBlocks.custom', // Add custom to the otherBlocks group
      {
        type: 'item',
        useComponentProps() {},
      }
    )
  }
}
```

## Add New Initializer

```tsx
const myInitializer = new SchemaInitializer({
  // Initializer identifier, globally unique
  name: 'myInitializer',
  title: 'Add Block',
  // Wrapper, for example, when inserting into Grid, need to use Grid.wrap to handle (add row and column labels)
  wrap: Grid.wrap,
  // Insert position, default is beforeEnd, supports 'beforeBegin' | 'afterBegin' | 'beforeEnd' | 'afterEnd'
  insertPosition: 'beforeEnd',
  // Dropdown menu items
  items: [
    {
      name: 'a',
      type: 'item',
      useComponentProps() {},
    },
  ],
})
```

### Register in Plugin load Method

It's recommended to use schemaInitializerManager.add() to add the new initializer to the application

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

### How to Use the Newly Added Initializer

SchemaInitializer is used in the x-initializer parameter of Schema.

Common Schema components that support x-initializer include Grid, ActionBar, Tabs, for example:

```json
{
  "type": "void",
  "x-component": "Grid",
  "x-initializer": "myInitializer"
}
```

If components like Grid, ActionBar, Tabs do not meet your needs, in custom components, you can also use useSchemaInitializerRender() to handle the rendering of x-initializer.
