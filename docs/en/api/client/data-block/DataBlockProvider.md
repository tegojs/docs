# DataBlockProvider

## Block Types

Blocks are divided into simple blocks and blocks containing various data.

### Simple Blocks

Simple blocks such as Markdown blocks.

It only has text content, no other more complex data, and the text content is stored in `schema`, not in the database.

```json {5}| pure
{
  "type": "void",
  "x-component": "Markdown.Void",
  "x-component-props": {
    "content": "markdown content"
  },
}
```

### Data Blocks

Data blocks refer to blocks whose data is stored in server-side data tables, such as the Table component.

Field information and list data in Table are all stored in the database.


## DataBlockProvider Introduction

To facilitate data management for data blocks, we provide the `DataBlockProvider` component, which internally encapsulates:

- `DataBlockProvider`: Encapsulates all the components below and provides block properties
  - [CollectionProvider](../data-source/CollectionProvider) / [AssociationProvider](../data-source/AssociationProvider): Queries corresponding data table data and relationship field information based on context information provided by `DataBlockProvider` and passes them on
  - [BlockResourceProvider](./DataBlockResourceProvider): Constructs block [Resource](../application/Request) API based on context information provided by `DataBlockProvider` for CRUD operations on block data
  - [BlockRequestProvider](./DataBlockRequestProvider): Automatically calls `resource.get()` or `resource.list()` provided by `BlockResourceProvider` based on context information provided by `DataBlockProvider` to initiate requests, get block data, and pass it on
    - [CollectionRecordProvider](../data-source/RecordProvider): For `resource.get()` scenarios, will automatically nest `CollectionRecordProvider` and pass the `resource.get()` request result down. For `resource.list()` scenarios, you need to use `CollectionRecordProvider` yourself to provide data records

```tsx | pure
const DataBlockProvider = (props) => {
  return <DataBlockContext.Provider>
    <CollectionDataSourceProvider>
      <CollectionProvider> / <AssociationProvider>
        <BlockResourceProvider>
          <BlockRequestProvider>
            {action !== 'list' && <CollectionRecordProvider record={blocRequest.data}>
              {props.children}
            </Record>}
          </BlockRequestProvider>
        </BlockResourceProvider>  / </AssociationProvider>
      </CollectionProvider>
    </CollectionDataSourceProvider>
  </DataBlockContext.Provider>
}
```

The above components are encapsulated inside `DataBlockProvider`. You only need to use `DataBlockProvider` to automatically get the above data.

### Usage

It is mainly used in the x-decorator of block schema, for example:

```js {5}| pure
{
  type: 'void',
  name: 'hello-block',
  'x-component':  'CardItem',
  'x-decorator': 'DataBlockProvider',
  'x-decorator-props': {
    collection: 'users',
    dataSource: 'main',
    action: 'list',
    tableProps: {
      bordered: true,
    }
  },
  'x-use-decorator-props': 'useDynamicDataBlockProps',
}
```

### Complete Example

<code src="./demos/data-block-provider/complete-demo.tsx"></code>

## Properties

### Static Properties and Dynamic Properties

- `x-decorator-props` in schema is called static properties, it is a regular object that records block configuration information
- Properties in `x-use-decorator-props` in schema are called dynamic properties, it is a React hook that can be used to get for example ID on URL, or parent context data

When both exist, they will be deeply merged as properties of `DataBlockProvider`.

### Property Details

```ts | pure
interface AllDataBlockProps {
  collection?: string;
  association?: string;
  sourceId?: string | number;
  record?: Record;
  action?: 'list' | 'get';
  filterByTk?: string;
  params?: Record<string, any>;
  parentRecord?: Record;
  [index: string]: any;
}
```

- collection (`x-decorator-props`): Block's collection table name, used to get block's field information and block data
- association (`x-decorator-props`): Block's relationship field name, used to get block's relationship field information and relationship field data
- dataSource (`x-decorator-props`): Data source
- action (`x-decorator-props`): Block's request type, `list` or `get`
- params (`x-decorator-props` and `x-use-decorator-props`): Block's request parameters, exists in both
- filterByTk (`x-use-decorator-props`): Equivalent to `params.filterByTk`, can be understood as `id`, used to get single data
- sourceId (`x-use-decorator-props`): Block's sourceId, used with `association` to get block's relationship field data
- record (`x-use-decorator-props`): When `record` is provided, will use `record` as block's data, no request will be initiated
- parentRecord (`x-use-decorator-props`): When `parentRecord` is provided, will use `parentRecord` as relationship field's table data, no request will be initiated

```tsx | pure
const DataBlockProvider = (props) => {
  return <DataBlockContext.Provider value={props}>
    <CollectionDataSourceProvider>
      <CollectionProvider name={props.collection}> / <CollectionProvider name={props.association}>
          <BlockResourceProvider {...props}>
            <BlockRequestProvider resource={resource}>
              {action !== 'list' && <CollectionRecordProvider record={blocRequest.data}>
                {props.children}
              </Record>}
            </BlockRequestProvider>
          </BlockResourceProvider>
        </CollectionProvider>
    </CollectionDataSourceProvider>
  </DataBlock.Provider>
}
```

### Property Combinations and Scenarios

These properties have 8 combinations according to different scenarios:

- collection
  - Create: `collection`
  - Get single data: `collection` + `action: get` + `params`
  - Get list data: `collection` + `action: list` + `params`
  - Use `record` as data: `collection` + `record`

For *Get single data* and *Get list data*, `params` is not required.

- association
  - Create: `association` + `sourceId`
  - Get single data: `association` + `sourceId` + `action: get` + `params` + `parentRecord`
  - Get list data: `association` + `sourceId` + `action: list` + `params` + `parentRecord`
  - Use `record` as data: `association` + `sourceId` + `record` + `parentRecord`


For *Get single data* and *Get list data*, `params` and `parentRecord` are not required. When there is no `parentRecord`, the corresponding `collection` will be queried based on `association`, then the corresponding `parentRecord` will be queried based on `collection`.

### Property Get and Modify

#### useDataBlock()

Can be used to get and modify properties of `DataBlockProvider`.

- Type

```tsx | pure
interface Result<T extends {} = {}> {
  props: AllDataBlockProps & T;
  dn: Designable;
}
const useDataBlock: <T extends {}>() => Result<T>
```

- Details

`props` corresponds to the `AllDataBlockProps` above.
`dn` is the `Designable` object, can be used to modify the UI schema of `DataBlockProvider`, see [Designable](../ui-schema/Designable) for details.

- Example

```tsx | pure
const { props, dn } = useDataBlock<{ tableProps: { bordered?: boolean } }>();

// Get
const checked = props.tableProps.bordered;

// Modify
dn.deepMerge({
  'x-decorator-props': {
    tableProps: {
      bordered: !checked,
    },
  },
});
```

#### useDataBlockProps()

Equivalent to `useDataBlock().props`.

```tsx | pure
const props = useDataBlockProps<{ tableProps: { bordered?: boolean } }>();

const checked = props.tableProps.bordered;
```

## Example

### association

association is similar to collection, just needs to provide `sourceId`. We take `Table list` as an example.

#### Table list & parentRecord

If `sourceId` is not provided, then `parentRecord` needs to be provided. We take `Table list` as an example.
