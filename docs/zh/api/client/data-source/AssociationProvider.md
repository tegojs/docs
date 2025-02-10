# AssociationProvider

用于传递关联数据字段以及对应的数据表信息，等同于 `CollectionFieldProvider` + `CollectionProvider`。

```tsx | pure
const AssociationProvider = <CollectionFieldProvider name={fieldName}>
  <CollectionProvider name={collectionManager.getCollectionName(fieldName)}>
    {children}
  </CollectionProvider>
</CollectionFieldProvider>
```

更多信息，请参考 [CollectionField](./CollectionField)。
