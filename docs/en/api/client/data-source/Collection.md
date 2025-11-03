# Collection

Collection data table class, which is managed by [CollectionManager](./CollectionManager).

## 1. Type

```tsx | pure
interface CollectionOptions {
  name: string;
  title?: string;
  fields?: FieldOptions[];
  // ....
}

class Collection {
  app: Application;
  collectionManager: CollectionManager;

  constructor(options: CollectionOptions) {}

  name: string;
  primaryKey: string;
  titleField: string;

  getOptions(): CollectionOptions;
  setOptions(options: CollectionOptions): void;
  getOption<K extends keyof CollectionOptions>(key: K): CollectionOptions[K];

  getFields(predicate?: CollectionFieldOptions | ((collection: CollectionFieldOptions) => boolean) | keyof CollectionFieldOptions): any[]
  getField(name: SchemaKey): CollectionFieldOptions
  hasField(name: SchemaKey): boolean;
}
```

```tsx | pure
const usersCollection = new Collection({
  name: 'users',
  title: 'Users',
  fields: [
    {
      type: 'string',
      name: 'username',
    },
    {
      type: 'integer',
      name: 'age',
    },
  ],
});
```

## 2. CollectionOptions

```tsx | pure
export interface CollectionOptions {
  name: string;
  title?: string;
  dataSource?: string;
  duplicator?:
    | dumpable
    | {
        dumpable: dumpable;
        with?: string[] | string;
        delayRestore?: any;
      };

  tableName?: string;
  inherits?: string[] | string;
  inherit?: string;
  key?: string;
  viewName?: string;
  writableView?: boolean;

  filterTargetKey?: string;
  fields?: CollectionFieldOptions[];
  model?: any;
  repository?: any;
  sortable?: CollectionSortable;
  /**
   * @default true
   */
  autoGenId?: boolean;
  /**
   * @default 'options'
   */
  magicAttribute?: string;

  tree?: string;

  template?: string;

  isThrough?: boolean;
  autoCreate?: boolean;
  resource?: string;
  collectionName?: string;
  sourceKey?: string;
  uiSchema?: any;
  [key: string]: any;
}
```

- name: Collection's identifier, must be unique.

- title: Collection's title, used for display.

- fields: Field list, for details please see [CollectionField](./CollectionField)

- template: Template identifier, used to identify which template created this Collection, for details please see [CollectionTemplate](./CollectionTemplate)

- dataSource: Data source identifier, used to identify which data source created this Collection, for details please see [DataSource](./DataSource)

- duplicator

- tableName

- inherits

- viewName

- writableView

- filterTargetKey

- model

- repository


## 3. Instance Properties

### collection.collectionManager

[CollectionManager](./CollectionManager) instance.

### collection.titleFieldName

The name property of the title field.

### Other Properties

Other properties are the same as [CollectionOptions](#CollectionOptions).

## 4. Instance Methods

### collection.getOptions()

Get all configuration items of collection.

- Type

```tsx | pure
class Collection {
  getOptions(): CollectionOptions;
}
```

- Example

```tsx | pure
const usersCollection = new Collection({
  name: 'users',
  title: 'Users',
  fields: [
    // ...
  ],
});

console.log(usersCollection.getOptions()); // { name: 'users', title: 'Users', fields: [ ] }
```

### collection.setOptions(options)

Set collection configuration items, which will eventually be merged with default configuration items.

- Type

```tsx | pure
class Collection {
  setOptions(options: CollectionOptions): void;
}
```

- Example

```tsx | pure
collection.setOptions({
  name: 'users',
  title: 'Users',
  fields: [
    // ...
  ],
});
```

### collection.getOption(key)

Get a single configuration item of collection.

- Type

```tsx | pure
class Collection {
  getOption<K extends keyof CollectionOptions>(key: K): CollectionOptions[K];
}
```

- Example

```tsx | pure
collection.getOption('name'); // 'users'
collection.getOption('title'); // 'Users'
```

### collection.getFields(predicate?)

Get the field list of collection.

- Type

```tsx | pure
class Collection {
  getFields(predicate?: CollectionFieldOptions | ((collection: CollectionFieldOptions) => boolean) | keyof CollectionFieldOptions): any[]
}
```

- Details
  - predicate
    - Type
      - `CollectionFieldOptions`
      - `(collection: CollectionFieldOptions) => boolean`
      - `keyof CollectionFieldOptions`
    - Description
      - If `predicate` is passed, returns field list that meets the condition
      - If `predicate` is not passed, returns all field list

Usage of `predicate` can refer to [lodash.filter](https://www.lodashjs.com/docs/lodash.filter).

- Example

```tsx | pure
collection.getFields(); // [{ name: 'username', type: 'string', primaryKey: true }, { name: 'age', type: 'integer' }]

collection.getFields({ name: 'age' }); // [{ name: 'age', type: 'integer' }]

collection.getFields('primaryKey'); // [{ name: 'username', type: 'string', primaryKey: true }]

collection.getFields(field => field.type === 'string'); // [{ name: 'name', type: 'string' }]
```

### collection.getField(name)

Get a single field of collection.

- Type

```tsx | pure
class Collection {
  getField(name: SchemaKey): CollectionFieldOptions
}
```

- Example

```tsx | pure
collection.getField('username'); // { name: 'username', type: 'string', primaryKey: true }
```

### collection.hasField(name)

Determine if collection has a certain field.

- Type

```tsx | pure
class Collection {
  hasField(name: SchemaKey): boolean;
}
```

- Example

```tsx | pure
collection.hasField('username'); // true
collection.hasField('name'); // false
```
