# SchemaInitializer

SchemaInitializer is used to add new Schema nodes, commonly used for adding blocks, fields, actions, etc.

For detailed usage examples and API documentation, please refer to the complete Chinese version or the code examples provided throughout the Tachybase documentation.

## Key Concepts

- **SchemaInitializer**: Main class for creating schema initializers
- **Items**: Configuration for initializer menu items
- **Insert**: Function to insert new schema nodes
- **Wrap**: Wrapper function for schema nodes

## Common Usage

```tsx | pure
const myInitializer = new SchemaInitializer({
  name: 'MyInitializer',
  title: 'Add Block',
  items: [
    {
      name: 'demo',
      type: 'item',
      title: 'Demo Block',
      onClick: () => {
        // Insert new schema node
      }
    }
  ],
});
```

## Instance Methods

- `add(name, item)`: Add an item
- `get(name)`: Get an item
- `remove(name)`: Remove an item

For complete documentation with detailed examples, please refer to the Tachybase developer documentation.
