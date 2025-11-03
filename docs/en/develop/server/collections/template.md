# Collection Templates

In actual business scenarios, different collections may have their own initialization rules and business logic. TachyBase provides Collection templates to solve such problems.

## General Table

```ts
db.collection({
  name: "posts",
  fields: [
    {
      type: "string",
      name: "title",
    },
  ],
});
```

## Tree Structure Table

```ts
db.collection({
  name: "categories",
  tree: "adjacency-list",
  fields: [
    {
      interface: "integer",
      name: "parentId",
      type: "bigInt",
      isForeignKey: true,
      uiSchema: {
        type: "number",
        title: '{{t("Parent ID")}}',
        "x-component": "InputNumber",
        "x-read-pretty": true,
      },
    },
    {
      interface: "m2o",
      type: "belongsTo",
      name: "parent",
      foreignKey: "parentId",
      treeParent: true,
      onDelete: "CASCADE",
      target: options.name,
      uiSchema: {
        title: '{{t("Parent")}}',
        "x-component": "AssociationField",
        "x-component-props": {
          multiple: false,
          fieldNames: { label: "id", value: "id" },
        },
      },
    },
    {
      interface: "o2m",
      type: "hasMany",
      name: "children",
      foreignKey: "parentId",
      treeChildren: true,
      onDelete: "CASCADE",
      target: options.name,
      uiSchema: {
        title: '{{t("Children")}}',
        "x-component": "AssociationField",
        "x-component-props": {
          multiple: true,
          fieldNames: { label: "id", value: "id" },
        },
      },
    },
  ],
});
```

## Parent-Child Inheritance Table

Specify the parent table to inherit through inherits

```ts
db.collection({
  name: "a",
  fields: [],
});

db.collection({
  name: "b",
  inherits: "a",
  fields: [],
});
```

## More Templates

Such as calendar tables, each initialized table needs to initialize special cron and exclude fields, and the definition of such fields is completed by the template

```ts
db.collection({
  name: "events",
  template: "calendar",
});
```
