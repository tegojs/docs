# CollectionProvider

Used to provide [Collection](./Collection.md) instance.

## Component

### CollectionProvider

- Type

```tsx | pure
interface CollectionProviderProps {
  name: string;
  dataSource?: string;
  children?: ReactNode;
}
```

- Details

The component will query data table information from [CollectionManager](/core/data-source/collection-manager) based on `name`. If not found, it will not render.

`dataSource` is used to specify the [namespace](/core/data-source/collection-manager#datasource) where the data table is located. If not specified, defaults to default namespace.

- Example

```tsx | pure
import { CollectionProvider } from '@tachybase/client';

const MyComponent = () => {
  return (
    <CollectionProvider name="users">
      <div>...</div>
    </CollectionProvider>
  )
}
```


## Hooks

### useCollection()

Used to get the `Collection` instance passed by `CollectionProvider`.

```tsx | pure
const collection = useCollection()

console.log(collection instanceof Collection) // true
console.log(collection);
```

Use with Mixin:

```tsx | pure
const collection = useCollection<TestMixin>()
const collection = useCollection<TestMixin & TestMixin2>()
```

## Example

<code src="./demos/collection/demo1.tsx"></code>
