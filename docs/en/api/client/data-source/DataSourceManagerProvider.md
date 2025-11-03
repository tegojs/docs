# DataSourceManagerProvider

Used to provide `DataSourceManager` instance.


## Hooks

### useDataSourceManager()

Get `DataSourceManager` instance.

- Type

```tsx | pure
function useDataSourceManager(): DataSourceManager;
```

- Example

```tsx | pure
const MyComponent = () => {
  const dataSourceManager = useDataSourceManager();
  dataSourceManager.removeDataSources(['my-data-source']);
}
```
