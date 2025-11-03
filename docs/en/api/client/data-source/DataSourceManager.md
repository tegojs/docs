# DataSourceManager

Data source manager, used to manage `DataSource` instances.

## 1. Instance Properties

### collectionTemplateManager

Used to manage `CollectionTemplate` instances.

```tsx | pure
import { Plugin, CollectionTemplate } from '@tachybase/client'

class MyCollectionTemplate extends CollectionTemplate {
  name = 'my-collection-template'
}

class MyPlugin extends Plugin {
  async load() {
    this.app.dataSourceManager.collectionTemplateManager.addCollectionTemplates([
      MyCollectionTemplate,
    ])
  }
}
```

For details please refer to: [CollectionTemplateManager](./CollectionTemplateManager)

### collectionFieldInterfaceManager

Used to manage `CollectionFieldInterface` instances.

```tsx | pure
import { Plugin, CollectionFieldInterface } from '@tachybase/client'

class MyCollectionFieldInterface extends CollectionFieldInterface {
  name = 'my-collection-field-interface'
}

class MyPlugin extends Plugin {
  async load() {
    this.app.dataSourceManager.collectionFieldInterfaceManager.addFieldInterfaces([
      MyCollectionFieldInterface,
    ])
  }
}
```

For details please refer to: [CollectionFieldInterfaceManager](./CollectionFieldInterfaceManager)

## 2. Instance Methods

### addCollectionTemplates()

Shortcut method for `CollectionTemplateManager`, used to add `CollectionTemplate`.

- Type

```tsx | pure
class DataSourceManager {
  addCollectionTemplates(templates: CollectionTemplate[]): void
}
```

- Example

```tsx | pure
import { Plugin, CollectionTemplate } from '@tachybase/client'

class MyCollectionTemplate extends CollectionTemplate {
  name = 'my-collection-template'
}

class MyPlugin extends Plugin {
  async load() {
    this.app.dataSourceManager.collectionTemplateManager.addCollectionTemplates([
      MyCollectionTemplate,
    ])
  }
}
```

For more details please refer to: [CollectionTemplateManager](./CollectionTemplateManager)

### addFieldInterfaces()

Shortcut method for `CollectionFieldInterfaceManager`, used to add `CollectionFieldInterface`.

- Type

```tsx | pure
class DataSourceManager {
  addFieldInterfaces(fieldInterfaces: CollectionFieldInterface[]): void
}
```

- Example

```tsx | pure
import { Plugin, CollectionFieldInterface } from '@tachybase/client'

class MyCollectionFieldInterface extends CollectionFieldInterface {
  name = 'my-collection-field-interface'
}

class MyPlugin extends Plugin {
  async load() {
    this.app.dataSourceManager.collectionFieldInterfaceManager.addFieldInterfaces([
      MyCollectionFieldInterface,
    ])
  }
}
```

For more details please refer to: [CollectionFieldInterfaceManager](./CollectionFieldInterfaceManager)

### addCollectionMixins()

Used to add Mixins for `Collection`.

- Type

```tsx | pure
class DataSourceManager {
  addCollectionMixins(mixins: (typeof Collection)[]): void
}
```

- Example

```tsx | pure
import { Plugin, Collection } from '@tachybase/client'

class MyCollectionMixin extends Collection {
  otherMethod() {
    console.log('otherMethod')
  }
}

class MyPlugin extends Plugin {
  async load() {
    this.app.dataSourceManager.addCollectionMixins([MyCollectionMixin])
  }
}

const MyComponent = () => {
  const collection = useCollection<MyCollectionMixin>()
  collection.otherMethod()
}
```

For more details please refer to: [CollectionMixins](./CollectionMixins)

### addDataSource()

Used to add `DataSource`.

- Type

```tsx | pure
class DataSourceManager {
  addDataSource(DataSource: DataSource, options: DataSourceOptions): void
}
```

- Example

```tsx | pure
import { Plugin, DataSource, DataSourceOptions } from '@tachybase/client'

class MyDataSource extends DataSource {
  async getDataSource() {
    return {
      status: 'loaded',
      collections: [{ name: 'users' }],
    }
  }
}

class MyPlugin extends Plugin {
  async load() {
    this.app.dataSourceManager.addDataSource(MyDataSource, {
      key: 'my-data-source',
      displayName: 'My Data Source',
    })
  }
}
```

For more details please refer to: [DataSource](./DataSource)

### removeDataSources()

Remove `DataSource`.

- Type

```tsx | pure
class DataSourceManager {
  removeDataSources(keys: string[]): void
}
```

- Example

```tsx | pure
const MyComponent = () => {
  const dataSourceManager = useDataSourceManager()
  dataSourceManager.removeDataSources(['my-data-source'])
}
```

### getDataSources()

Get all `DataSource` instance list.

- Type

```tsx | pure
class DataSourceManager {
  getDataSources(): DataSource[]
}
```

- Example

```tsx | pure
const MyComponent = () => {
  const dataSourceManager = useDataSourceManager()
  const dataSources = dataSourceManager.getDataSources()

  return (
    <div>
      {dataSources.map(dataSource => (
        <div key={dataSource.key}>{dataSource.displayName}</div>
      ))}
    </div>
  )
}
```

### getDataSource(key)

Get `DataSource` instance.

- Type

```tsx | pure
class DataSourceManager {
  getDataSource(key: string): DataSource
}
```

- Example

```tsx | pure
const MyComponent = () => {
  const dataSourceManager = useDataSourceManager()
  const dataSource = dataSourceManager.getDataSource('my-data-source')

  return <div>{dataSource.displayName}</div>
}
```

### getAllCollections()

Get all Collection instances of all DataSources.

- Type

```tsx | pure
class DataSourceManager {
  getAllCollections(options?: {
    filterCollection?: (collection: Collection) => boolean
    filterDataSource?: (dataSource: DataSource) => boolean
  }): (DataSourceOptions & { collections: Collection[] })[]
}
```

- Example

```tsx | pure
const MyComponent = () => {
  const dataSourceManager = useDataSourceManager()
  const collections = dataSourceManager.getAllCollections()

  return (
    <div>
      {collections.map(({ key, displayName, collections }) => (
        <div key={key}>
          <h3>{displayName}</h3>
          <ul>
            {collections.map(collection => (
              <li key={collection.name}>{collection.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
```

### reload()

Reload all `DataSource`.

- Type

```tsx | pure
class DataSourceManager {
  reload(): Promise<void>
}
```

- Example

```tsx | pure
const MyComponent = () => {
  const dataSourceManager = useDataSourceManager()
  dataSourceManager.reload()
}
```
