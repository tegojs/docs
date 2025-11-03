# DataSource

Mainly used to get data sources and data source data table structure lists, and after getting them, hand them over to [CollectionManager](./CollectionManager) for management. It is managed by [DataSourceManager](./DataSourceManager).

## 1. Data Source Definition

Data source definition needs to extend the `DataSource` class and implement the `getDataSource` method. When the `reload` method is called, the `getDataSource` method will be called to get the data table structure.

```tsx | pure
import { DataSource } from '@tachybase/client'

class MyDataSource extends DataSource {
  async getDataSource() {
    return this.app.request({
      url: 'xxx',
      method: 'GET',
    })
  }
}
```

### Data Source Registration

Data sources need to be registered in plugins through the `addDataSource` method of `DataSourceManager`.

When initially adding, `collections` can be empty. When the `reload` method is called, the `getDataSource` method will be called to get the data table structure.

```tsx | pure
import { Plugin, DataSource, DataSourceOptions } from '@tachybase/client'

class MyPlugin extends Plugin {
  async load() {
    this.app.dataSourceManager.addDataSource(MyDataSource, {
      key: 'my-data-source',
      displayName: 'My Data Source',
      status: 'loaded',
      errorMessage: 'error message',
      collections: [
        {
          name: 'users',
          fields: [
            {
              name: 'name',
              type: 'string',
            },
          ],
        },
      ],
    })
  }
}
```

- `key`: Unique identifier of the data source
- `displayName`: Display name of the data source
- `status`: Status of the data source `DataSourceState`, `loaded` means loaded, `loading` means loading, `loading-failed` means loading failed, `reloading` means reloading, `reloading-failed` means reloading failed
  
```tsx | pure
type DataSourceState = 'loading' | 'loaded' | 'loading-failed' | 'reloading' | 'reloading-failed';
```
- `errorMessage`: Error message
- `collections`: Data table structure




## 2. Instance Methods

### getDataSource()

Used to get data source information, which will be called internally by the `reload` method, external calls are not needed.

``` tsx | pure

export abstract class DataSource {
  /** other code */
  abstract getDataSource(): Promise<Omit<Partial<DataSourceOptions>, 'key'>> | Omit<Partial<DataSourceOptions>, 'key'>;

  async reload() {
    const dataSource = await this.getDataSource();
    this.setOptions(dataSource);
    this.collectionManager.setCollections(dataSource.collections || []);
    this.reloadCallbacks.forEach((callback) => callback(dataSource.collections));
    return this.options;
  }
  /** other code */
}

  
```

### addReloadCallback()

Used to add callback functions after data source loading is complete.

- Type

```tsx | pure
type LoadCallback = (collections: CollectionOptions[]) => void

class DataSource {
  addReloadCallback(callback: LoadCallback): void
}
```

### removeReloadCallback()

Used to remove callback functions after data source loading is complete.

- Type

```tsx | pure
type LoadCallback = (collections: CollectionOptions[]) => void
class DataSource {
  removeReloadCallback(callback: LoadCallback): void
}
```

- Example

```tsx | pure
const MyComponent = () => {
  const dataSource = useDataSource()

  useEffect(() => {
    const callback = collections => {
      console.log(collections)
    }
    dataSource.addReloadCallback(callback)
    return () => {
      dataSource.removeReloadCallback(callback)
    }
  }, [])
}
```

### reload()

Used to reload data source, will call `getDataSource` method to get data table structure, and internally call callback functions added by `addReloadCallback`.

- Type

```tsx | pure
class DataSource {
  reload(): Promise<void>
}
```

- Example

```tsx | pure
const MyComponent = () => {
  const dataSource = useDataSource()

  const handleClick = async () => {
    await dataSource.reload()
  }
}
```

### getOptions()

Get the configuration information list of the data source.

- Type

```tsx | pure
interface DataSourceOptions {
  key: string
  displayName: string
  collections?: CollectionOptions[]
  errorMessage?: string
  status?: DataSourceState;
}

type DataSourceState = 'loading' | 'loaded' | 'loading-failed' | 'reloading' | 'reloading-failed';

class DataSource {
  getOptions(): DataSourceOptions
}
```

### getOption(key)

Get the configuration information of the data source.

- Type

```tsx | pure
class DataSource {
  getOption(key: string): any
}
```

- Example

```tsx | pure
const MyComponent = () => {
  const dataSource = useDataSource()

  const handleClick = async () => {
    console.log(dataSource.getOption('key'))
  }
}
```
