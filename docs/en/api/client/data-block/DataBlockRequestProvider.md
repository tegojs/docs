# DataBlockRequestProvider

Internally gets the `resource` provided by [BlockResourceProvider](./DataBlockResourceProvider), and automatically calls `resource.get()` or `resource.list()` based on parameters provided by [BlockProvider](./DataBlockProvider) to get block data, and passes it down through context.

## Request Parameters

Request parameters are `params` and `filterByTk` obtained from what `DataBlockProvider` provides.

```ts | pure
const schema = {
  'x-decorator': 'DataBlockProvider',
  'x-decorator-props': {
    'collection': 'users',
    'action': 'list',
    // Static parameters
    params: {
      pageSize: 10,
    }
  },
  // Dynamic parameters
  'x-use-decorator-props': 'useDynamicDataBlockProps',
}

const useDynamicDataBlockProps: UseDataBlockProps<'CollectionList'>  = () => {
  return {
    params: {
      size: 15,
    }
  }
}
```

Will automatically call `resource.list()` to get data, initiating a `GET /api/users:list?pageSize=10&size=15` request.

## Hooks

### useDataBlockRequest()

Used to get request object, generally used in block components.

```tsx | pure
const MyTable = () => {
  const { data, loading } = useDataBlockRequest();

  return (
    <Table
      dataSource={data?.data || []}
      loading={loading}
      pagination={{
        total: data?.meta.total,
        pageSize: data?.meta.pageSize,
        page: data?.meta.page,
      }}
    />
  )
}
```

## Record

### Get Request

For `get` requests, after getting `data`, will provide `record` object through `CollectionRecordProvider` for getting the current block's data.

```ts | pure
const schema = {
  'x-decorator': 'DataBlockProvider',
  'x-decorator-props': {
    'collection': 'users',
    'action': 'get', // get request
  },
  // Dynamic parameters
  'x-use-decorator-props': 'useDynamicFormProps',
}

const useDynamicDataBlockProps: UseDataBlockProps<'CollectionGet'>  = () => {
  return {
    params: {
      filterByTk: 1,
    }
  }
}
```

Will automatically call `resource.get()` to get data, initiating a `GET /api/users:get/1` request, and provide context through `CollectionRecordProvider`.

```tsx | pure
const { data } = useDataBlockRequest();
const record = useCollectionRecord(); // record context data

// Equal
record.data === data;
```

### List Request

For `list` requests, `record` object will not be provided. You need to set context yourself through `<CollectionRecordProvider />`.

```tsx | pure
const MyTable = () => {
  const { data } = useDataBlockRequest();

  return (
    <Table
      dataSource={data?.data || []}
      columns={[
        {
          title: 'ID',
          dataIndex: 'id',
        },
        {
          title: 'Action',
          render: (v, record) => {
            return (
              <CollectionRecordProvider record={record}>
                <MyAction />
              </CollectionRecordProvider>
            )
          },
        },
      ]}
      pagination={{
        total: data?.meta.total,
        pageSize: data?.meta.pageSize,
        page: data?.meta.page,
      }}
    />
  )
}

const MyAction = () => {
  const record = useCollectionRecord();
  return (
    <Button onClick={() => {
      console.log(record.data);
    }}>Dialog</Button>
  )
}
```
