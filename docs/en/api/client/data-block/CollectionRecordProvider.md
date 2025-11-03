# CollectionRecordProvider

Used to provide [CollectionRecord](./CollectionRecord) instance.

## Component

- Type

```tsx | pure
interface CollectionRecordProviderProps<DataType = {}, ParentDataType = {}> {
  isNew?: boolean;
  record?: CollectionRecord<DataType, ParentDataType> | DataType;
  parentRecord?: CollectionRecord<ParentDataType> | DataType;
  /**
   * Collection name to which the current record belongs
   */
  collectionName?: string;
}
```

- Details

For specific parameter descriptions, see [CollectionRecord](./CollectionRecord).

It should be noted that both `record` and `parentRecord` can be either regular objects or [CollectionRecord](./CollectionRecord) instances, but they will eventually be converted to `CollectionRecord` instances and passed to child components through context.

## Example

- record parameter is CollectionRecord instance

```tsx | pure
import { CollectionRecord, CollectionRecordProvider } from '@tachybase/client';

const record = new CollectionRecord({ data: { id: 1, name: 'foo' } });

<CollectionRecordProvider record={record} />
// Data ultimately passed to child components: props.record
```

```tsx
import { CollectionRecord, useCollectionRecord, CollectionRecordProvider } from '@tachybase/client';

const record = new CollectionRecord({ data: { id: 1, name: 'foo' } });

const Demo = () => {
  const record = useCollectionRecord();
  return <pre>{JSON.stringify(record, null, 2)}</pre>;
}

export default () => <CollectionRecordProvider record={record}><Demo /></CollectionRecordProvider>
```

- record parameter is regular object

```tsx | pure
<CollectionRecordProvider record={{ id: 1, name: 'foo' }} />
// Data ultimately passed to child components: const record = new CollectionRecord({ data: { id: 1, name: 'foo' } });
```

```tsx
import { useCollectionRecord, CollectionRecordProvider } from '@tachybase/client';

const Demo = () => {
  const record = useCollectionRecord();
  return <pre>{JSON.stringify(record, null, 2)}</pre>;
}

export default () => <CollectionRecordProvider record={{ id: 1, name: 'foo' }}><Demo /></CollectionRecordProvider>
```

- record parameter is CollectionRecord instance with parent record

```tsx | pure
const parentRecord = new CollectionRecord({ data: { id: 1, role: 'admin' } });
const record = new CollectionRecord({ data: { id: 1, name: 'foo' }, parentRecord });

<CollectionRecordProvider record={record} />
// Data ultimately passed to child components: props.record
```

```tsx
import { CollectionRecord, useCollectionRecord, CollectionRecordProvider } from '@tachybase/client';

const parentRecord = new CollectionRecord({ data: { id: 1, role: 'admin' } });
const record = new CollectionRecord({ data: { id: 1, name: 'foo' }, parentRecord });

const Demo = () => {
  const record = useCollectionRecord();
  return <pre>{JSON.stringify(record, null, 2)}</pre>;
}

export default () => <CollectionRecordProvider record={record}><Demo /></CollectionRecordProvider>
```

- record parameter is CollectionRecord instance, parent record passed through `parentRecord` parameter

```tsx | pure
const parentRecord = new CollectionRecord({ data: { id: 1, role: 'admin' } });
const record = new CollectionRecord({ data: { id: 1, name: 'foo' } });

<CollectionRecordProvider record={record} parentRecord={parentRecord} />

// First set parent record: record.setParentRecord(parentRecord);
// Data ultimately passed to child components: record (with parent record)
```

```tsx
import { CollectionRecord, useCollectionRecord, CollectionRecordProvider } from '@tachybase/client';

const parentRecord = new CollectionRecord({ data: { id: 1, role: 'admin' } });
const record = new CollectionRecord({ data: { id: 1, name: 'foo' } });

const Demo = () => {
  const record = useCollectionRecord();
  return <pre>{JSON.stringify(record, null, 2)}</pre>;
}

export default () => <CollectionRecordProvider record={record} parentRecord={parentRecord}><Demo /></CollectionRecordProvider>
```

- record parameter is regular object, parent record is also regular object

```tsx | pure
<CollectionRecordProvider record={{ id: 1, name: 'foo' }} parentRecord={{ id: 1, role: 'admin' }} />

// First instantiate parent record: const parentRecord = new CollectionRecord({ data: { id: 1, role: 'admin' } });
// Then instantiate record: const record = new CollectionRecord({ data: { id: 1, name: 'foo' } });
// Finally set parent record: record.setParentRecord(parentRecord);
// Data ultimately passed to child components: record (with parent record)
```


```tsx
import { useCollectionRecord, CollectionRecordProvider } from '@tachybase/client';

const Demo = () => {
  const record = useCollectionRecord();
  return <pre>{JSON.stringify(record, null, 2)}</pre>;
}

export default () => <CollectionRecordProvider record={{ id: 1, name: 'foo' }} parentRecord={{ id: 1, role: 'admin' }} ><Demo /></CollectionRecordProvider>
```

## Hooks

### useCollectionRecord()

Used to get data records passed by the `CollectionRecordProvider` component.

- Example

```tsx | pure
const record = useCollectionRecord();

console.log(record, record.data, record.parentRecord, record.parentRecord.data);
```

```tsx
import { useCollectionRecord, CollectionRecordProvider } from '@tachybase/client';

const Demo = () => {
  const record = useCollectionRecord();
  return <div>
    <div>record: <pre>{JSON.stringify(record, null, 2)}</pre></div>
    <div style={{ marginTop: 10 }}>record.data: <pre>{JSON.stringify(record.data, null, 2)}</pre></div>
    <div style={{ marginTop: 10 }}>record.parentRecord: <pre>{JSON.stringify(record.parentRecord, null, 2)}</pre></div>
    <div style={{ marginTop: 10 }}>record.parentRecord.data: <pre>{JSON.stringify(record.parentRecord.data, null, 2)}</pre></div>
  </div>;
}

export default () => <CollectionRecordProvider record={{ id: 1, name: 'foo' }} parentRecord={{ id: 1, role: 'admin' }} ><Demo /></CollectionRecordProvider>
```

### useCollectionRecordData()

Directly get the `data` property of CollectionRecord, equivalent to `useCollectionRecord().data`.

- Example

```tsx | pure
const data = useCollectionRecordData();
const record = useCollectionRecord();
console.log(data === record.data);
```

```tsx
import { useCollectionRecord, useCollectionRecordData, CollectionRecordProvider } from '@tachybase/client';

const Demo = () => {
  const data = useCollectionRecordData();
  const record = useCollectionRecord();
  return <div>
    <div>data === record.data: { JSON.stringify(data === record.data) }</div>
    <div style={{ marginTop: 10 }}>data: <pre>{JSON.stringify(data, null, 2)}</pre></div>
    <div style={{ marginTop: 10 }}>record.data: <pre>{JSON.stringify(record.data, null, 2)}</pre></div>
  </div>;
}

export default () => <CollectionRecordProvider record={{ id: 1, name: 'foo' }} ><Demo /></CollectionRecordProvider>
```

### useCollectionParentRecord()

Directly get the `parentRecord` data of CollectionRecord, equivalent to `useCollectionRecord().parentRecord`.

- Example

```tsx | pure
const parentRecord = useCollectionParentRecord();
const record = useCollectionRecord();
console.log(parentRecord === record.parentRecord);
```

```tsx
import { useCollectionRecord, useCollectionParentRecord, CollectionRecordProvider } from '@tachybase/client';

const Demo = () => {
  const record = useCollectionRecord();
  const parentRecord = useCollectionParentRecord();
  return <div>
    <div>parentRecord === record.parentRecord: { JSON.stringify(parentRecord === record.parentRecord) }</div>
    <div style={{ marginTop: 10 }}>parentRecord: <pre>{JSON.stringify(parentRecord, null, 2)}</pre></div>
    <div style={{ marginTop: 10 }}>record.parentRecord: <pre>{JSON.stringify(record.parentRecord, null, 2)}</pre></div>
  </div>;
}

export default () => <CollectionRecordProvider record={{ id: 1, name: 'foo' }} parentRecord={{ id: 1, role: 'admin' }} ><Demo /></CollectionRecordProvider>
```


### useCollectionParentRecordData()

Directly get the `parentRecord.data` data of CollectionRecord, equivalent to `useCollectionRecord().parentRecord.data`.

- Example

```tsx | pure
const record = useCollectionRecord();
const parentData = useCollectionParentRecordData();
const parentRecord = useCollectionParentRecord();
console.log(parentData === parentRecord.data === record.parentRecord.data);
```

```tsx
import { useCollectionRecord, CollectionRecordProvider, useCollectionParentRecordData, useCollectionParentRecord } from '@tachybase/client';

const Demo = () => {
  const record = useCollectionRecord();
  const parentData = useCollectionParentRecordData();
  const parentRecord = useCollectionParentRecord();
  return <div>
    <div style={{ marginTop: 10 }}>parentData: <pre>{JSON.stringify(parentData, null, 2)}</pre></div>
    <div style={{ marginTop: 10 }}>parentRecord.data: <pre>{JSON.stringify(parentRecord.data, null, 2)}</pre></div>
    <div style={{ marginTop: 10 }}>record.parentRecord.data: <pre>{JSON.stringify(record.parentRecord.data, null, 2)}</pre></div>
  </div>;
}

export default () => <CollectionRecordProvider record={{ id: 1, name: 'foo' }} parentRecord={{ id: 1, role: 'admin' }} ><Demo /></CollectionRecordProvider>
```
