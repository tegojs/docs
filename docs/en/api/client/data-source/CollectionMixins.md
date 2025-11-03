# Collection Mixins

Collection Mixins is a mechanism provided for extending the Collection class. Collection Mixins can be added through `dataSourceManager.addCollectionMixins()`.

## Definition and Registration

```tsx | pure
import { Collection, Plugin } from '@tachybase/client';

class TestMixin extends Collection {
  test() {
    const { name } = this.options;
    return 'test '+ name;
  }
}

class MyPlugin extends Plugin {
  async load() {
    this.app.dataSourceManager.addCollectionMixins([TestMixin]);
  }
}
```

## Usage

- Usage 1: Call `getCollection()` on the `CollectionManager` instance to get the specified `Collection` instance.

```tsx | pure
const Demo = () => {
  const cm = useCollectionManager();
  const userCollection = cm.getCollection<TestMixin>('users');

  userCollection.test(); // 'test users'
}
```

- Usage 2: Call `useCollection()` to get the data table information of the current context.

```tsx | pure
const Demo = () => {
  const collection = useCollection<TestMixin>();
  collection.test(); // 'test users'
}
```

## Using Multiple Mixins

If Mixins are added, you can get type hints through the following method:

```tsx | pure
const Demo = () => {
  const collection = useCollection<TestMixin & Test2Mixin>();
}
```

<code src='./demos/data-source-manager/mixins.tsx'></code>
