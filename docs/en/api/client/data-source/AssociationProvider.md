# AssociationProvider

Used to pass association data fields and corresponding data table information, equivalent to `CollectionFieldProvider` + `CollectionProvider`.

```tsx | pure
const AssociationProvider = <CollectionFieldProvider name={fieldName}>
  <CollectionProvider name={collectionManager.getCollectionName(fieldName)}>
    {children}
  </CollectionProvider>
</CollectionFieldProvider>
```

For more information, please refer to [CollectionField](./CollectionField).
