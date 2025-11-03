# CollectionTemplateManager

Used to manage [CollectionTemplate](./CollectionTemplate), which is managed by [DataSourceManager](./DataSourceManager).

## Instance Methods

### addCollectionTemplates(templates)

Used to add collection template.

- Type

```tsx | pure
class CollectionTemplateManager {
  addCollectionTemplates(templates: CollectionTemplate[]): void;
}
```

- Example

```tsx | pure
class SqlCollectionTemplate extends CollectionTemplate {
  name = 'sql';
  type = 'object';
  title = '{{t("SQL collection")}}';
  configurableProperties = {
    // ...
  }
}

class TreeCollectionTemplate extends CollectionTemplate {
  name = 'tree';
  type = 'object';
  title = '{{t("Tree collection")}}';
  configurableProperties = {
    // ...
  }
}

class MyPlugin extends Plugin {
  async load() {
    this.dataSourceManager.collectionTemplateManager.addCollectionTemplates([ SqlCollectionTemplate, TreeCollectionTemplate ]);

    // or
    this.dataSourceManager.addCollectionTemplates([ SqlCollectionTemplate, TreeCollectionTemplate ]);
  }
}
```

### getCollectionTemplate(name)

Used to get collection template.

- Type

```tsx | pure
class CollectionTemplateManager {
  getCollectionTemplate(name: string): CollectionTemplate;
}
```

- Example

```tsx | pure
collectionManager.getCollectionTemplate(); // generalCollectionTemplate

collectionManager.getCollectionTemplate('tree'); // treeCollectionTemplate
```

### getCollectionTemplates()

Used to get all collection templates.

- Type

```tsx | pure
class CollectionTemplateManager {
  getCollectionTemplates(): CollectionTemplate[];
}
```

- Example

```tsx | pure
collectionManager.getCollectionTemplates(); // [ generalCollectionTemplate, treeCollectionTemplate, sqlCollectionTemplate ]
```
