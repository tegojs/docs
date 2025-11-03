# CollectionTemplate

Used to create templates for data tables.


```ts
interface AvailableFieldInterfacesInclude {
  include?: any[];
}

interface AvailableFieldInterfacesExclude {
  exclude?: any[];
}

interface CollectionTemplateDefaultOptions {
  /**
   * Auto-generate id
   * @default true
   * */
  autoGenId?: boolean;
  /** Created by */
  createdBy?: boolean;
  /** Updated by */
  updatedBy?: boolean;
  /** Created at */
  createdAt?: boolean;
  /** Updated at */
  updatedAt?: boolean;
  /** Sortable */
  sortable?: boolean;
  /* Tree structure */
  tree?: string;
  /* Logging */
  logging?: boolean;
  /** Inherits */
  inherits?: string | string[];
  /* Field list */
  fields?: CollectionOptions['fields'];
}

class CollectionTemplate {
  constructor(public collectionTemplateManager: CollectionTemplateManager) {}
  name: string;
  Collection?: typeof Collection;
  title?: string;
  color?: string;
  /** Sorting */
  order?: number;
  /** Default configuration */
  default?: CollectionTemplateDefaultOptions;
  events?: any;
  /** UI configurable CollectionOptions parameters (fields for adding or editing Collection forms) */
  configurableProperties?: Record<string, ISchema>;
  /** Available field types for the current template */
  availableFieldInterfaces?: AvailableFieldInterfacesInclude | AvailableFieldInterfacesExclude;
  /** Whether it is a divider */
  divider?: boolean;
  /** Template description */
  description?: string;
  /** Configure buttons in the configuration fields */
  configureActions?: Record<string, ISchema>;
  // Whether to prohibit deleting fields
  forbidDeletion?: boolean;

  supportDataSourceType?: string[];
  notSupportDataSourceType?: string[];

  transform?(collection: CollectionOptions, app: Application): CollectionOptions;
}
```

Needs to be used in conjunction with [CollectionTemplateManager](./CollectionTemplateManager).

```ts
import { Plugin, Collection, CollectionTemplate } from '@tachybase/client';

class SqlCollection extends Collection {
  otherMethods() {
    // ...
  }
}

class SqlCollectionTemplate extends CollectionTemplate {
  name = 'sql';
  Collection = SqlCollection; // Custom data table class
  title = '{{t("SQL collection")}}';
  order = 4;
  color = 'yellow';
  default = {
    fields: [],
  };
  configurableProperties = {
    // ...
  }
}

class MyPlugin extends Plugin {
  async load() {
    this.app.dataSourceManager.collectionTemplateManager.addCollectionTemplates([ SqlCollectionTemplate ]);

    // or
    this.app.dataSourceManager.addCollectionTemplates([ SqlCollectionTemplate ]);
  }
}
```

## 1. Instance Properties

### name

Unique identifier of the template.


### Collection

Data table class corresponding to the template.

After creating a data table, Collection will have a [template field](./Collection), used to identify which template created this data table.

When adding data table objects through `collectionManager.addCollections()`, it will first read the `collection.template` field, then get `collectionTemplate` through `collectionManager.getCollectionTemplate(collection.template)`.

Read the `collectionTemplate.Collection` field and create the corresponding instance through `new collectionTemplate.Collection(collection)`.

If `Collection` is not passed, the corresponding instance will be created through `new Collection(collection)`.

```ts
class SqlCollection extends Collection {
  otherMethods() {
    // ...
  }
}

class SqlCollectionTemplate extends CollectionTemplate {
  name = 'sql';
  Collection = SqlCollection; // Custom data table class
  // ...
}

const userCollection = {
  name: 'users',
  template: 'sql',
  // ...
}

// Internally will call new SqlCollection(userCollection)
```

### title

Title of the template.

### color

Color of the template.

### order

Sorting of the template.

### events

- `beforeSubmit`: Triggered before submission


### configurableProperties

Form configuration items.

<!-- ![](./images//collection-template-form.png) -->

```ts
class SqlCollectionTemplate extends CollectionTemplate {
  name = 'sql',
  // ...
  configurableProperties = {
    title: {
      type: 'string',
      title: '{{ t("Collection display name") }}',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    name: {
      type: 'string',
      title: '{{t("Collection name")}}',
      required: true,
      'x-disabled': '{{ !createOnly }}',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-validator': 'uid',
      description:
        "{{t('Randomly generated and can be modified. Support letters, numbers and underscores, must start with an letter.')}}",
    },
    // ...
  },
}
```

### default

Form default value.



## 2. Instance Methods

## 3. Utils

### getConfigurableProperties()

Used to get built-in configuration item fields.

- Type

```tsx | pure
export type DefaultConfigurableKeys =
  | 'name'
  | 'title'
  | 'inherits'
  | 'category'
  | 'autoGenId'
  | 'createdBy'
  | 'updatedBy'
  | 'createdAt'
  | 'updatedAt'
  | 'sortable'
  | 'description'
  | 'moreOptions';

const getConfigurableProperties: (...keys: DefaultConfigurableKeys[]) => Record<DefaultConfigurableKeys, any>
```

- Example

```tsx | pure
import { getConfigurableProperties } from '@tachybase/client';

const sqlCollectionTemplate = new CollectionTemplate({
  name: 'sql',
  // ...
  configurableProperties: {
    ...getConfigurableProperties('name', 'title', 'description'),
    // ...
  },
});
```
