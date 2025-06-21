# Collection 模板

在实际的业务场景中，不同的 collection 可能有自己的初始化规则和业务逻辑，TachyBase 通过提供 Collection 模板来解决这类问题。

## 常规表

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

## 树结构表

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

## 父子继承表

通过inherits指定要继承的父表

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

## 更多模板

如日历表，每个初始化的表都需要初始化特殊的 cron 和 exclude 字段，而这种字段的定义就由模板来完成

```ts
db.collection({
  name: "events",
  template: "calendar",
});
```
