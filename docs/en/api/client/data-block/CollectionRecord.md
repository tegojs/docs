# CollectionRecord

A record in a data table.

## Type

```tsx | pure
interface CollectionRecordOptions<DataType = {}, ParentDataType = {}> {
  isNew?: boolean;
  data?: DataType;
  parentRecord?: CollectionRecord<ParentDataType>;
  /**
   * Collection name to which the current record belongs
   */
  collectionName?: string;
}

class CollectionRecord<DataType = {}, ParentDataType = {}> {
  public isNew?: boolean;
  public data?: DataType;
  public parentRecord?: CollectionRecord<ParentDataType>;
  public collectionName?: string;
  constructor(options: CollectionRecordOptions<DataType, ParentDataType>) {}

  setData(data: DataType) {
    this.data = data;
  }

  setParentRecord(parentRecord: CollectionRecord<ParentDataType>) {
    this.parentRecord = parentRecord;
  }
}
```

## Details

### CollectionRecord Basic Concept

The CollectionRecord class is used to provide data records, usually corresponding to a record in the backend data table. Taking the user table as an example, its CollectionRecord class corresponding to one data record is as follows:

```tsx | pure
const useCollectionRecord = new CollectionRecord({
  data: {
    "id": 1,
    "roleId": 10,
    "appLang": null,
    "createdById": null,
    "email": "test@tachybase.com",
    "nickname": "Admin",
    "phone": null,
    "systemSettings": {},
    "updatedById": null,
    "username": "tachybase",
    "createdAt": "2023-12-04T09:42:52.953Z",
    "updatedAt": "2023-12-04T09:42:52.953Z",
  }
});
```

### Relationship between CollectionRecord and Collection

CollectionRecord refers to data, while Collection refers to table structure. For the above user table, its corresponding Collection is as follows:

```tsx | pure
const usersCollection = new Collection({
  name: 'users',
  fields: [
    {
      type: 'bigInt',
      name: 'id',
    },
    {
      type: 'string',
      name: 'username',
    },
    {
      type: 'integer',
      name: 'age',
    },
    {
      "name": "email",
      "type": "string",
    },
    // ....
  ],
});
```

### Parent-Child Relationship and Relationship Fields

For [relationship fields](https://docs.tachybase.com/development/server/collections/association-fields), such as the relationship between users and roles, there will be a `roleId` field in the user table, with its value being the `id` in the roles table. When we query the user's role through the `users.roleId` field:

```bash | pure
GET /api/users/1/roles:get/10
```

Where `1` is the user's `id` and `10` is the role's `id`, we can get the user's role data:

```tsx | pure
const roleRecord = new CollectionRecord({
  data: {
    "id": 10,
    "name": "member",
    "title": "test role",
    "strategy": {
      "actions": [
        "view",
        "update:own",
        "destroy:own",
        "create"
      ]
    },
    "createdAt": "2023-03-30T07:53:10.924Z",
    "updatedAt": "2023-12-15T02:51:43.577Z",
  }
})
```

We call the `users` record with id 1 the parent record:

```tsx | pure
roleRecord.setParentRecord(userRecord);
```

### New Record

For new forms, we can identify through the `isNew` property:

```tsx | pure
const record = new CollectionRecord({
  isNew: true,
});
```

## Example

### Basic Usage

```tsx | pure
import { CollectionRecord } from '@tachybase/client';

const record = new CollectionRecord({
  data: {
    name: 'foo',
  }
});
```

### Create Empty Record

```tsx | pure
import { CollectionRecord } from '@tachybase/client';

const record = new CollectionRecord({
  isNew: true,
});
```

### Set parentRecord

Method 1: Set through constructor

```tsx | pure
const parentRecord = new CollectionRecord({
  data: {
    foo: 'foo',
  }
});

const record = new CollectionRecord({
  data: {
    name: 'bar',
  },
  parentRecord,
});
```

Method 2: Set through `setParentRecord` method

```tsx | pure
const parentRecord = new CollectionRecord({
  data: {
    foo: 'foo',
  }
});

const record = new CollectionRecord({
  data: {
    name: 'bar',
  }
});

record.setParentRecord(parentRecord);
```
