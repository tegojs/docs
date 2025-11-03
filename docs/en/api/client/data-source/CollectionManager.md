# CollectionManager

Used to manage [Collection](./Collection.md), which is managed by [DataSource](./DataSource.md).

## Instance Methods

### addCollections(collections)

Add data tables.

- Type

```tsx | pure
class CollectionManager {
  addCollections(collections: CollectionOptions[]): void
}
```

- Example

```tsx | pure
const userCollectionOptions = {
  "name": "users",
  "title": "Users",
  fields: [
    // ...
  ],
};

collectionManager.addCollections([userCollectionOptions]);
```

### setCollections(collections)

Reset data tables, will first remove all data tables, then call `addCollections()` to add data tables.

- Type

```tsx | pure
class CollectionManager {
  setCollections(collections: CollectionOptions[]): void
}
```

### reAddCollections(collections)

Since adding [CollectionTemplate](./CollectionTemplate.md) or [CollectionMixins](./CollectionMixins.md) will affect Collection instantiation, a method to re-add data tables is provided.

- Type

```tsx | pure
class CollectionManager {
  reAddCollections(collectionInstances: Collection[]): void
}
```

- Example

```tsx | pure
const userCollectionInstance = collectionManager.getCollection('users');
collectionManager.reAddCollections([userCollectionInstance]);
```

### getCollections(predicate?)

Get data table array.

- Type

```tsx | pure
class CollectionManager {
  getCollections(predicate?: (collection: Collection) => boolean)
}
```

- Example

```tsx | pure
collectionManager.getCollections(); // [ userCollection ]

collectionManager.getCollections(collection => collection.name === 'posts'); // [ postCollection ]
```


### getCollection(path)

Get data table.

- Type

```tsx | pure
class CollectionManager {
  getCollection<Mixins = {}>(path: string): (Mixins & Collection) | undefined
}
```

- Detailed Explanation
  - `path` parameter can be data table name or [relationship field](https://docs.tachybase.com/development/server/collections/association-fields) path.
    - `path: 'users'`: Get `users` data table
    - `path: 'users.posts'`: Get the data table corresponding to the `posts` association field of the `users` data table, i.e., `postCollection`

- Example

```tsx | pure
collectionManager.getCollection('users'); // userCollection

collectionManager.getCollection('users.posts'); // postCollection
collectionManager.getCollection('users.profileId'); // profileCollection
```

Use with Mixin:

```tsx | pure
const collection = collectionManager.getCollection<TestMixin>('users');
const collection = collectionManager.getCollection<TestMixin & TestMixin2>('users');
```

### getCollectionFields(collectionName)

Get data table field list.

- Type

```tsx | pure
class CollectionManager {
  getCollectionFields(collectionName: string): CollectionFieldOptions[];
}
```

- Example

```tsx | pure
collectionManager.getCollectionFields('users'); // [ { name: 'username', type: 'string', title: 'Username', .. }, { name: 'password', type: 'password', title: 'Password', .. } ]
```

### getCollectionName(path)

Get data table name.

- Type

```tsx | pure
class CollectionManager {
  getCollectionName(path: string: GetCollectionOptions): string | undefined;
}
```

- Example

```tsx | pure
collectionManager.getCollectionName('users'); // 'users'

collectionManager.getCollectionName('users.profiles'); // 'profiles'
```


### getCollectionField(path)

Get data table field.

- Type

```tsx | pure
class CollectionManager {
  getCollectionField(path: string: GetCollectionOptions): CollectionFieldOptions | undefined;
}
```

- Example

```tsx | pure
collectionManager.getCollectionField('users.username'); // { name: 'username', type: 'string', title: 'Username', .. }

collectionManager.getCollectionField('users.roles.name'); // Get the name field in the roles table corresponding to the roles association field
```
