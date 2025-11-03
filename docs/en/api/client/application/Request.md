# Request

## APIClient

```ts
class APIClient {
  // axios instance
  axios: AxiosInstance;
  // Cache results of useRequest({}, {uid}) with uid, can be called by other components
  services: Record<string, Result<any, any>>;
  // Constructor
  constructor(instance?: AxiosInstance | AxiosRequestConfig);
  // Client request, supports AxiosRequestConfig and ResourceActionOptions
  request<T = any, R = AxiosResponse<T>, D = any>(config: AxiosRequestConfig<D> | ResourceActionOptions): Promise<R>;
  // Get resource
  resource<R = IResource>(name: string, of?: any): R;
}
```

Example

```ts
import axios from 'axios';

// When no parameters are passed, axios instance is created internally
const apiClient = new APIClient();

// Provide AxiosRequestConfig configuration parameters
const apiClient = new APIClient({
  baseURL: '',
});

// Provide AxiosInstance
const instance = axios.create({
  baseURL: '',
});
const apiClient = new APIClient(instance);

// Regular request
const response = await apiClient.request({ url });

// Tachybase specific resource operations
const response = await apiClient.resource('posts').list();

// Request sharing
const { data, loading, run } = apiClient.service('uid');
```

Example of `api.service(uid)`, ComponentB refreshes ComponentA's request data

<code src="./demos/demo3.tsx"></code>

## APIClientProvider

Context that provides APIClient instance.

```tsx | pure
const apiClient = new APIClient();

<APIClientProvider apiClient={apiClient}></APIClientProvider>
```

## useAPIClient

Get the APIClient instance of the current context.

```ts
const apiClient = useAPIClient();
```

## useRequest

```ts
function useRequest<P>(
  service: AxiosRequestConfig<P> | ResourceActionOptions<P> | FunctionService,
  options?: Options<any, any>,
);
```

Supports `axios.request(config)`, for config details see [axios](https://github.com/axios/axios#request-config)

```ts
const { data, loading, refresh, run, params } = useRequest({ url: '/users' });

// useRequest passes AxiosRequestConfig, so run also passes AxiosRequestConfig
run({
  params: {
    pageSize: 20,
  }
});
```

Example:

<code src="./demos/demo2.tsx"></code>

Or Tachybase's resource & action requests:

```ts
const { data, run } = useRequest({
  resource: 'users',
  action: 'list',
  params: {
    pageSize: 20,
  },
});

// useRequest passes ResourceActionOptions, so run can directly pass action params.
run({
  pageSize: 50,
});
```

Example:

<code src="./demos/demo1.tsx"></code>

Can also be a custom async function:

```ts
const { data, loading, run, refresh, params } = useRequest((...params) => Promise.resolve({}));

run(...params);
```

For more usage, see ahooks' [useRequest()](https://ahooks.js.org/hooks/use-request/index)

## useResource

```ts
function useResource(name: string, of?: string | number): IResource;
```

Resource is a core concept in Tachybase, including:

- Independent resources, such as `posts`
- Relationship resources, such as `posts.tags` `posts.user` `posts.comments`

Resource URI

```bash
# Independent resource, articles
/api/posts
# Relationship resource, comments for article ID=1
/api/posts/1/comments
```

Get resource through APIClient

```ts
const api = new APIClient();

api.resource('posts');
api.resource('posts.comments', 1);
```

useResource usage:

```ts
const resource = useResource('posts');
const resource = useResource('posts.comments', 1);
```
