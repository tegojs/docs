# RouterManager

Used to manage routes.

```tsx | pure
import { ComponentType } from 'react';
import { RouteObject } from 'react-router-dom';

interface RouteType extends Omit<RouteObject, 'children' | 'Component'> {
  Component?: ComponentType<T> | string;
}

class RouterManager {
    add(name: string, route: RouteType): void;
    getRoutes(): Record<string, RouteType>;
    getRoutesTree(): RouteObject[];
    get(name: string): RouteType;
    has(name: string): boolean;
    remove(name: string): void;
    setType(type: 'browser' | 'memory' | 'hash'): void;
    setBasename(basename: string): void;
}
```

## Instance Methods

### router.add()

Add a route.

- Type

```tsx | pure
class RouterManager {
    add(name: string, route: RouteType): void
}
```

- Details

The first parameter `name` is the unique route identifier for subsequent CRUD operations, and `name` supports `.` for splitting levels. However, note that when using `.` for layering, the parent must use [Outlet](https://reactrouter.com/en/main/components/outlet) so that child elements can render normally.

The second parameter `RouteType`'s `Component` supports both component form and string form. If it's a string component, it must be registered first through [app.addComponents](./Application).

- Example

Single-level routes.

```tsx | pure
class MyPlugin extends Plugin {
    async load() {
      this.app.router.add('home', {
            path: '/',
            Component: () => <div>home page</div>
        })
        this.app.router.add('login', {
            path: '/login',
            element: <div>login page</div>
        })
    }
}
```

```tsx
import { useNavigate } from 'react-router-dom';
import { Plugin, Application } from '@tachybase/client';

const HomePage = () => {
  const navigate = useNavigate();
  return <div>
    <div>home page</div>
    <button onClick={() => navigate('/login')}>GO To LoginPage</button>
  </div>
}

const LoginPage = () => {
  const navigate = useNavigate();
  return <div>
    <div>login page</div>
    <button onClick={() => navigate('/')}>GO To HomePage</button>
  </div>
}

class MyPlugin extends Plugin {
    async load() {
      this.app.router.add('home', {
            path: '/',
            Component: HomePage
        })
        this.app.router.add('login', {
            path: '/login',
            Component: LoginPage
        })
    }
}


const app = new Application({
    plugins: [MyPlugin],
    router: {
        type: 'memory',
        initialEntries: ['/'],
    }
});

export default app.getRootComponent();
```

Multi-level routes.

```tsx | pure
import { Plugin } from '@tachybase/client';
import { Outlet } from 'react-router-dom';

const AdminLayout = () =>{
    return <div>
        <div>This is admin layout</div>
        <Outlet />
    </div>
}

const AdminSettings = () => {
    return <div>This is admin settings page</div>
}

class MyPlugin extends Plugin {
    async load() {
        this.app.router.add('admin', {
            path: '/admin',
            Component: AdminLayout
        })
        this.app.router.add('admin.settings', {
            path: '/admin/settings',
            Component: AdminSettings ,
        })
    }
}
```


```tsx
import { useNavigate, Outlet } from 'react-router-dom';
import { Plugin, Application } from '@tachybase/client';

const AdminLayout = () =>{
    return <div>
        <div>This is admin layout</div>
        <Outlet />
    </div>
}

const AdminSettings = () => {
    return <div>This is admin settings page</div>
}

class MyPlugin extends Plugin {
    async load() {
      this.app.router.add('admin', {
          path: '/admin',
          Component: AdminLayout
      })
      this.app.router.add('admin.settings', {
          path: '/admin/settings',
          Component: AdminSettings ,
      })
    }
}


const app = new Application({
    plugins: [MyPlugin],
    router: {
        type: 'memory',
        initialEntries: ['/admin/settings'],
    }
});

export default app.getRootComponent();
```

`Component` parameter as string.

```tsx | pure
const LoginPage = () => {
    return <div>login page</div>
}

class MyPlugin extends Plugin {
    async load() {
        // Register through app.addComponents
        this.app.addComponents({ LoginPage })

        this.app.router.add('login', {
            path: '/login',
            Component: 'LoginPage', // String can be used here now
        })
    }
}
```

### router.getRoutes()

Get route list.

- Type

```tsx | pure
class RouterManager {
    getRoutes(): Record<string, RouteType>
}
```

- Example

```tsx | pure
class MyPlugin extends Plugin {
    async load() {
        console.log(this.app.router.getRoutes());
    }
}
```
### router.getRoutesTree()

Get data for [useRoutes()](https://reactrouter.com/hooks/use-routes).

- Type

```tsx | pure
class RouterManager {
    getRoutesTree(): RouteObject[]
}
```

- Example

```tsx | pure
class MyPlugin extends Plugin {
    async load() {
        const routes = this.app.router.getRoutesTree();
    }
}
```

### router.get()

Get single route configuration.

- Type

```tsx | pure
class RouterManager {
    get(name: string): RouteType
}
```

- Example

```tsx | pure
class MyPlugin extends Plugin {
    async load() {
        const adminRoute = this.app.router.get('admin')
        const adminSettings = this.app.router.get('admin.settings')
    }
}
```

### router.has()

Determine if route has been added.

- Type

```tsx | pure
class RouterManager {
    has(name: string): boolean;
}
```

- Example

```tsx | pure
class MyPlugin extends Plugin {
    async load() {
        const hasAdminRoute = this.app.router.has('admin')
        const hasAdminSettings = this.app.router.has('admin.settings')
    }
}
```

### router.remove()

Remove route configuration.

- Type

```tsx | pure
class RouterManager {
    remove(name: string): void;
}
```

- Example

```tsx | pure
class MyPlugin extends Plugin {
    async load() {
        this.app.router.remove('admin')
        this.app.router.remove('admin.settings')
    }
}
```

### router.setType()

Set route type, default is `browser`.


- Type

```tsx | pure
class RouterManager {
    setType(type: 'browser' | 'memory' | 'hash'): void;
}
```

- Detailed Explanation
  - browser: [BrowserRouter](https://reactrouter.com/en/main/router-components/browser-router)
  - memory: [MemoryRouter](https://reactrouter.com/en/main/router-components/hash-router)
  - hash: [HashRouter](https://reactrouter.com/en/main/router-components/memory-router)

- Example

```tsx | pure
class MyPlugin extends Plugin {
    async load() {
        this.app.router.setType('hash')
    }
}
```

### router.setBasename()

Set [basename](https://reactrouter.com/en/main/router-components/browser-router#basename).

- Type

```tsx | pure
class RouterManager {
    setBasename(basename: string): void;
}
```

- Example

```tsx | pure
class MyPlugin extends Plugin {
    async load() {
        this.app.router.setBasename('/')
    }
}
```

## Hooks

### useRouter()

Get the current router instance, equivalent to `app.router`.

- Type

```tsx | pure
const useRouter: () => RouterManager
```

- Example

```tsx | pure
import { useRouter } from '@tachybase/client';

const Demo = () => {
    const router = useRouter();
}
```
