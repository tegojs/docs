# HTTP Requests

`APIClient` is used to make HTTP requests. Within the plugin lifecycle of the client application, you can use `app.apiClient` to make client requests, and within components you can use `useAPIClient()` and `useRequest()`

## I. APIClient

### Using APIClient in Plugins

```typescript
// Inject in the plugin's load() method
export default class MyPlugin {
  async load() {
    try {
      // Send GET request
      const users = await this.app.apiClient.request({ url: '/users' })

      // Send POST request (with JSON data)
      const newUser = await this.app.apiClient.request({
        url: '/users',
        method: 'post',
        data: { name: 'John Doe' },
      })
    } catch (error) {
      console.error('Request failed:', error)
    }
  }
}
```

### Using APIClient in Components

```typescript
import { useAPIClient, useRequest } from '@tachybase/client'

const SampleComponent = () => {
  const apiClient = useAPIClient()
  const { data, loading } = useRequest({ url: '/posts' })
  const fetchData = async () => {
    const response = await apiClient.request({
      url: '/search',
      params: { q: 'value' },
    })
    console.log('Search results:', response.data)
  }

  return <div>SampleComponent</div>
}
```

## II. useRequest()

Asynchronous data management, can be client request data or custom async functions. For detailed usage, refer to ahooks' [useRequest() documentation](https://ahooks.js.org/hooks/use-request/index)

```typescript
function useRequest<P>(
  service: AxiosRequestConfig<P> | ResourceActionOptions<P> | FunctionService,
  options?: Options<any, any>
)
```

```typescript
// Basic request state management
const { data, loading, error, refresh } = useRequest({
  url: '/api/data',
  method: 'get',
})

// Request with custom query parameters
const { params, run } = useRequest({
  url: '/search',
  defaultParams: { type: 'post' },
})

// Manually trigger query
run({ q: 'value', page: 3 })
```
