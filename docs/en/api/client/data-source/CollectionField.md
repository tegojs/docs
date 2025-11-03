# CollectionField

The schema of a field is divided into 2 parts, one part in schema, one part in collection. For example:

```tsx | pure
const schema = {
  properties: {
    username: {
      'x-component': 'CollectionField',
      'x-decorator': 'FormItem',
    },
  }
}

const collection = {
  fields: [
    {
      type: 'string',
      name: 'username',
      interface: 'input',
      uiSchema: {
        title: 'UserName',
        type: 'string',
        'x-component': 'Input',
        required: true,
        description: 'description',
      },
    }
  ],
}
```

The two are connected through `name: username`. `CollectionField` will automatically read the schema `name` property, find the corresponding `uiSchema` property in the collection based on the `name` property, then splice it into the schema for rendering.

The benefit of doing this is that content created for the same field can share the same schema in different places. When the schema changes, only one place needs to be modified. For example, if the above `title: "UserName"` changes to `title: "Name"`, all places using this field will change.

<code src="./demos/collection-field/demo1.tsx"></code>

## 1. CollectionFieldOptions

Field configuration items.

```ts
interface CollectionFieldOptions {
  name?: any;
  collectionName?: string;
  sourceKey?: string;
  uiSchema?: ISchema;
  target?: string;

  [key: string]: any;
}
```

### Regular Fields and Relationship Fields

There are 2 types of fields: regular fields and relationship fields.

Relationship fields mean that the field's value is data from another collection. For example, `users` and `roles` are two collections. `users` has a field `roles`, and its value is data from the `roles` collection, so `roles` is a relationship field.

Example of regular field:

```json
{
  "key": "t09bauwm0wb",
  "name": "email",
  "type": "string",
  "interface": "email",
  "description": null,
  "collectionName": "users",
  "parentKey": null,
  "reverseKey": null,
  "unique": true,
  "uiSchema": {
    "type": "string",
    "title": "{{t('Email')}}",
    "x-component": "Input",
    "x-validator": "email",
    "required": true
  }
}
```

Example of relationship field:

```json
{
  "key": "fds09bauwm",
  "name": "roles",
  "type": "belongsToMany",
  "interface": "m2m",
  "description": null,
  "collectionName": "users",
  "parentKey": null,
  "reverseKey": null,
  "target": "roles",
  "foreignKey": "userId",
  "otherKey": "roleName",
  "onDelete": "CASCADE",
  "sourceKey": "id",
  "targetKey": "name",
  "through": "rolesUsers",
  "uiSchema": {
    "type": "array",
    "title": "{{t('Roles')}}",
    "x-component": "AssociationField",
    "x-component-props": {
      "multiple": true,
      "fieldNames": {
        "label": "title",
        "value": "name"
      }
    }
  }
}
```


### All Field Descriptions

- `name`: Field name
- `collectionName`: Data table name
- `sourceKey`: When field is a relationship field, the corresponding relationship field name.

## 2. Hooks

### useCollectionField()

Used to get field information.

```tsx | pure
const collection = {
  fields: [
    {
      type: 'string',
      name: 'username',
      interface: 'input',
      uiSchema: {
        title: 'UserName',
        type: 'string',
        'x-component': 'Input',
        required: true,
        description: 'description1',
      } as ISchema,
    }
  ],
}

const { uiSchema } = useCollectionField()
const required = uiSchema?.required
```

Usually used in SchemaSettings to get and modify field properties.

<code src="./demos/collection-field/demo2.tsx"></code>
