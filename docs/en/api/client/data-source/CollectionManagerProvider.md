# CollectionManagerProvider

Used to provide [CollectionManager](./CollectionManager) instance.

## Component

- Type

```tsx | pure
interface CollectionManagerProviderProps {
  instance?: CollectionManager;
  dataSource?: string;
  children?: ReactNode;
}
```

- Parameter Details
  - `dataSource` - Data source name. If empty, the default data source will be used.
  - `instance` - CollectionManager instance. If not provided, will use the collectionManager corresponding to `dataSource`.

- Example

```tsx | pure
const  collectionManager = new CollectionManager();

const Demo = () => {
  return (
    <CollectionManagerProvider dataSource='test'>
      <div>...</div>
    </CollectionManagerProvider>
  );
};
```

## Hooks

### useCollectionManager()

Used to get the instance passed by `CollectionManagerProvider`.

- Example

```tsx | pure
const Demo = () => {
  const collectionManager = useCollectionManager();
  const collections = collectionManager.getCollections()

  return <div>
    <pre>{JSON.stringify(collections, null, 2)}</pre>
  </div>;
};
```
