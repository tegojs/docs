# DataSource

主要是用于获取数据源和数据源的数据表结构列表，并在获取后交给 [CollectionManager](./CollectionManager) 进行管理，其被 [DataSourceManager](./DataSourceManager) 管理。

## 1. 数据源定义

数据源的定义需要继承 `DataSource` 类，并实现 `getDataSource` 方法，当调用 `reload` 方法时，会调用 `getDataSource` 方法获取数据表结构。

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

### 数据源注册

数据源需要在插件中注册，通过 `DataSourceManager` 的 `addDataSource` 方法进行注册。

初始化添加的时候 `collections` 可以为空，当调用 `reload` 方法时，会调用 `getDataSource` 方法获取数据表结构。

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

- `key`：数据源的唯一标识
- `displayName`：数据源的显示名称
- `status`：数据源的状态 `DataSourceState`，`loaded` 表示已加载，`loading` 表示正在加载，`loading-failed` 表示加载失败, `reloading` 表示正在重新加载，`reloading-failed` 表示重新加载失败
  
```tsx | pure
type DataSourceState = 'loading' | 'loaded' | 'loading-failed' | 'reloading' | 'reloading-failed';
```
- `errorMessage`：错误信息
- `collections`：数据表结构




## 2. 实例方法

### getDataSource()

用于获取数据源信息，其会被 `reload` 方法内部调用，外部不需要调用。

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

用于添加数据源加载完成后的回调函数。

- 类型

```tsx | pure
type LoadCallback = (collections: CollectionOptions[]) => void

class DataSource {
  addReloadCallback(callback: LoadCallback): void
}
```

### removeReloadCallback()

用于移除数据源加载完成后的回调函数。

- 类型

```tsx | pure
type LoadCallback = (collections: CollectionOptions[]) => void
class DataSource {
  removeReloadCallback(callback: LoadCallback): void
}
```

- 示例

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

用于重新加载数据源，会调用 `getDataSource` 方法获取数据表结构，并内部调用 `addReloadCallback` 添加的回调函数。

- 类型

```tsx | pure
class DataSource {
  reload(): Promise<void>
}
```

- 示例

```tsx | pure
const MyComponent = () => {
  const dataSource = useDataSource()

  const handleClick = async () => {
    await dataSource.reload()
  }
}
```

### getOptions()

获取数据源的配置信息列表。

- 类型

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

获取数据源的配置信息。

- 类型

```tsx | pure
class DataSource {
  getOption(key: string): any
}
```

- 示例

```tsx | pure
const MyComponent = () => {
  const dataSource = useDataSource()

  const handleClick = async () => {
    console.log(dataSource.getOption('key'))
  }
}
```
