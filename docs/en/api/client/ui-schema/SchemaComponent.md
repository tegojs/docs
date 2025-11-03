# SchemaComponent

## Context

### SchemaComponentContext

```tsx | pure
interface SchemaComponentContext {
  scope?: any;
  components?: SchemaReactComponents;
  refresh?: () => void;
  reset?: () => void;
  designable?: boolean;
  setDesignable?: (value: boolean) => void;
}
```

Schema rendering context.

- `scope`: Variable mapping in Schema
- `components`: Component mapping in Schema
- `refresh`: Utility function to trigger React re-rendering
- `reset`: Reset entire Schema node
- `designable`: Whether to display designer, default `false`
- `setDesignable`: Used to toggle the value of `designable`

## Hooks

### useSchemaOptionsContext()

Used to get registered `scope` and `components`.

```tsx | pure
const { scope, components } = useSchemaOptionsContext();
```

## Components

### SchemaComponentProvider

It is an encapsulation of `SchemaComponentContext.Provider` and [FormProvider](https://react.formilyjs.org/api/components/form-provider), and is built into `Application`, and will pass `app.components` and `app.scopes`. So in general, *you don't need to worry about* this component.

- props

```tsx | pure
interface SchemaComponentProviderProps {
  designable?: boolean;
  form?: Form;
  scope?: any;
  components?: SchemaReactComponents;
}
```

- Detailed Explanation
  - `designable`: Default value of `designable` in `SchemaComponentContext`
  - `form`: Tachybase's Schema capability is based on formily's `FormProvider`, form is its parameter, defaults to `createForm()`
  - `scope`: Variables used in Schema, will be passed through `SchemaComponentContext`
  - `components`: Components used in Schema, will be passed through `SchemaComponentContext`

### SchemaComponent

Used to render Schema. This component must be used with `SchemaComponentProvider` because `SchemaComponentProvider` provides [FormProvider](https://react.formilyjs.org/api/components/form-provider) as the root node for rendering Schema.

- Props

```tsx | pure
type SchemaComponentProps = (ISchemaFieldProps | IRecursionFieldProps) & {
    memoized?: boolean;
    components?: SchemaReactComponents;
    scope?: any;
}
```

- Detailed Explanation

  - `memoized`: When `true`, will use `useMemo()` to process each layer of Schema
  - `components`: Same as `components` in `SchemaComponentProvider`
  - `scope`: Same as `components` in `SchemaComponentProvider`

## Comprehensive Example

Combining `SchemaComponentProvider`, `useSchemaComponentContext()` and `SchemaComponent`.

```tsx
/**
 * defaultShowCode: true
 */
import { SchemaComponentProvider, useSchemaComponentContext, SchemaComponent, } from '@tachybase/client';
const Hello = () => {
    const { designable, setDesignable } = useSchemaComponentContext();
    return <div>
        <div style={{ padding: 20, border: designable ? '1px solid red' : undefined }} contentEditable={designable}>hello world</div>
        <button onClick={() => setDesignable(!designable) }>change designable</button>
    </div>;
}

const schema = {
  type: 'void',
  name: 'hello',
  'x-component': 'Hello',
}

const Demo = () => {
  return <SchemaComponent schema={schema} />
}

const Root = () => {
  return <SchemaComponentProvider components={{ Hello }}>
    <Demo />
  </SchemaComponentProvider>
}

export default Root;
```

Using the `new Application()` method, which has built-in `SchemaComponentProvider`, we can operate as follows:

```tsx
/**
 * defaultShowCode: true
 */
import { Application, Plugin, useSchemaComponentContext, SchemaComponent } from '@tachybase/client';
const Hello = () => {
    const { designable, setDesignable } = useSchemaComponentContext();
    return <div>
        <div style={{ padding: 20, border: designable ? '1px solid red' : undefined }} contentEditable={designable}>hello world</div>
        <button onClick={() => setDesignable(!designable) }>change designable</button>
    </div>;
}

const schema = {
    type: 'void',
    name: 'hello',
    'x-component': 'Hello',
}

const HomePage = () => {
    return <SchemaComponent components={{ Hello }} schema={schema} />
}

class MyPlugin extends Plugin {
    async load() {
        this.app.addComponents({ Hello });
        this.app.router.add('home', {
            path: '/',
            Component: HomePage,
        })
    }
}

const app = new Application({
    router: {
        type: 'memory',
        initialEntries: ['/'],
    },
    plugins: [MyPlugin],
})

export default app.getRootComponent();
```

### SchemaComponentOptions

In an application, there will be many levels of nesting, each level may provide its own components and scope. This component is for passing the `components` and `scope` required by Schema layer by layer.

- props

```tsx | pure
interface SchemaComponentOptionsProps {
  scope?: any;
  components?: SchemaReactComponents;
}
```

- Example

```tsx
/**
 * defaultShowCode: true
 */
import { SchemaComponentProvider, useSchemaComponentContext, SchemaComponent, SchemaComponentOptions } from '@tachybase/client';
const World = () => {
   return <div>world</div>
}

const Hello = ({ children }) => {
    return <div>
        <div>hello</div>
        <SchemaComponentOptions components={{ World }}>{ children }</SchemaComponentOptions>
    </div>;
}

const schema = {
    type: 'void',
    name: 'hello',
    'x-component': 'Hello',
    properties: {
        world: {
          type: 'void',
          'x-component': 'World',
        },
    },
}

const Root = () => {
    return <SchemaComponentProvider components={{ Hello }}>
       <SchemaComponent schema={schema} />
    </SchemaComponentProvider>
}

export default Root;
```
