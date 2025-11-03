# DataSourceProvider

Used to provide `DataSource` instance.

## Component

- Type

```tsx | pure
interface DataSourceProviderProps {
  dataSource?: string;
  children?: ReactNode;
}
```

- Example

```tsx | pure
const MyComponent = () => {
  return (
    <DataSourceProvider dataSource="main">
      <MyChildComponent />
    </DataSourceProvider>
  );
}
```

## Hooks

### useDataSource()

Get `DataSource` instance.

- Type

```tsx | pure
function useDataSource(): DataSource;
```

- Example

```tsx | pure
const MyComponent = () => {
  const dataSource = useDataSource();
  return <div>{dataSource.displayName}</div>
}
```

### useDataSourceKey()

Get the key of `DataSource`.

- Type

```tsx | pure
function useDataSourceKey(): string;
```

- Example

```tsx | pure
const MyComponent = () => {
  const dataSourceKey = useDataSourceKey();
  return <div>{dataSourceKey}</div>
}
```
