# DataBlockResourceProvider

Based on properties like `collection`, `association`, `sourceId`, etc. in `DataBlockProvider`, constructs [resource](../application/Request) object to facilitate child components' CRUD operations on block data. It is built into [DataBlockProvider](./DataBlockProvider).


## useDataBlockResource

Used to get the resource object of the current data block.

- Type

```ts | pure
function useDataBlockResource(): IResource
```

- Example

```ts | pure
const  resource = useDataBlockResource();

const onSubmit = async (values) => {
  // Create
  await resource.create({ values });
}
```

```ts | pure
const  resource = useDataBlockResource();

const onDelete = async () => {
  // Delete
  await resource.destroy();
}
```
