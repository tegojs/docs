# Collections

## Collection

Collection is a collection of all kinds of data, translated in Chinese as "Data Table", such as orders, products, users, comments, etc. Different Collections are distinguished by name, such as:

```ts
// Orders
{
  name: 'orders',
}
// Products
{
  name: 'products',
}
// Users
{
  name: 'users',
}
// Comments
{
  name: 'comments',
}
```

## Collection Field

Each Collection has several Fields.

```ts
// Collection configuration
{
  name: 'users',
  fields: [
    { type: 'string', name: 'name' },
    { type: 'integer', name: 'age' },
    // Other fields
  ],
}
// Sample data
[
  {
    name: 'Zhang San',
    age: 20,
  },
  {
    name: 'Li Si',
    age: 18,
  }
];
```

In Tachybase, Collection Field consists of: Field Component and Field Interface

### Field Type

Different fields are distinguished by name. Type indicates the data type of the field, divided into Attribute Type and Association Type, such as:

**Attribute - Attribute Type**

- string
- text
- date
- boolean
- time
- float
- json
- location
- password
- virtual
- ...

**Association - Association Type**

- hasOne
- hasMany
- belongsTo
- belongsToMany
- ...

### Field Component

With data types for fields, field value IO is fine, but it's not enough. If you need to display the field on the interface, you need another dimension of configuration — `uiSchema`, such as:

```tsx | pure
// Email field, displayed with Input component, using email validation rule
{
  type: 'string',
  name: 'email',
  uiSchema: {
    'x-component': 'Input',
    'x-component-props': { size: 'large' },
    'x-validator': 'email',
    'x-pattern': 'editable', // Editable state, also has readonly non-editable state, read-pretty read state
  },
}

// Data example
{
  email: 'admin@tachybase.com',
}

// Component example
<Input name={'email'} size={'large'} value={'admin@tachybase.com'} />
```

uiSchema is used to configure the components displayed on the interface for fields. Each field component corresponds to a value, including several dimensions of configuration:

- Field component
- Component parameters
- Field validation rules
- Field pattern (editable, readonly, read-pretty)
- Field default value
- Others


Tachybase built-in field components include:

- Input
- InputNumber
- Select
- Radio
- Checkbox
- ...

### Field Interface

With Field Type and Field Component, you can freely combine several fields. We call this combined template Field Interface, such as:

```ts
// Email field string + input, email validation rule
{
  type: 'string',
  name: 'email',
  uiSchema: {
    'x-component': 'Input',
    'x-component-props': {},
    'x-validator': 'email',
  },
}

// Phone field string + input, phone validation rule
{
  type: 'string',
  name: 'phone',
  uiSchema: {
    'x-component': 'Input',
    'x-component-props': {},
    'x-validator': 'phone',
  },
}
```

The above email and phone need to configure complete uiSchema every time, which is very cumbersome. To simplify configuration, another concept Field interface is derived, which can template some parameters, such as:

```ts
// Email field template
interface email {
  type: 'string';
  uiSchema: {
    'x-component': 'Input',
    'x-component-props': {};
    'x-validator': 'email';
  };
}

// Phone field template
interface phone {
  type: 'string';
  uiSchema: {
    'x-component': 'Input',
    'x-component-props': {};
    'x-validator': 'phone';
  };
}

// Simplified field configuration
// email
{
  interface: 'email',
  name: 'email',
}

// phone
{
  interface: 'phone',
  name: 'phone',
}
```
