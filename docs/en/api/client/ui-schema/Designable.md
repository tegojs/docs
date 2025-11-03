# Designable

Designable provides the capability to modify Schema nodes dynamically. It is a core utility for UI configuration in Tachybase.

## Key Concepts

- **Schema Modification**: Modify schema properties dynamically
- **Node Operations**: Insert, remove, move schema nodes
- **Deep Merge**: Merge new properties into existing schema

## Common Usage

```tsx | pure
const dn = useDesignable();

// Modify schema
dn.deepMerge({
  'x-component-props': {
    bordered: true,
  },
});

// Remove node
dn.remove();

// Insert node
dn.insertAfterEnd(newSchema);
```

## Instance Methods

- `deepMerge(schema)`: Deep merge properties into current schema
- `shallowMerge(schema)`: Shallow merge properties
- `remove()`: Remove current schema node
- `insertAdjacent(position, schema)`: Insert schema at specified position
- `insertBeforeBegin(schema)`: Insert before current node
- `insertAfterBegin(schema)`: Insert as first child
- `insertBeforeEnd(schema)`: Insert as last child
- `insertAfterEnd(schema)`: Insert after current node

## Hooks

### useDesignable()

Get Designable instance for current schema node.

```tsx | pure
const dn = useDesignable();
```

For complete documentation with detailed examples, please refer to the Tachybase developer documentation.
