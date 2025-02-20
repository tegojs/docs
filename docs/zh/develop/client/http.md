# HTTP 请求

`APIClient` 用于发起 HTTP 请求，在客户端应用的 插件生命周期 内，可以使用 `app.apiClient` 发起客户端请求，在组件内可以使用 `useAPIClient()` 和 `useRequest()`

## 一. APIClient

### 插件中使用 APIClient

```typescript
// 在插件的 load() 方法中注入
export default class MyPlugin {
  async load() {
    try {
      // 发送 GET 请求
      const users = await this.app.apiClient.request({ url: '/users' })

      // 发送 POST 请求（带 JSON 数据）
      const newUser = await this.app.apiClient.request({
        url: '/users',
        method: 'post',
        data: { name: 'John Doe' },
      })
    } catch (error) {
      console.error('请求失败:', error)
    }
  }
}
```

### 组件内使用 APIClient

```typescript
import { useAPIClient, useRequest } from '@tachybase/client'

const SampleComponent = () => {
  const apiClient = useAPIClient()
  const { data, loading } = useRequest({ url: '/posts' })
  const fetchData = async () => {
    const response = await apiClient.request({
      url: '/search',
      params: { q: 'noco' },
    })
    console.log('搜索结果:', response.data)
  }

  return <div>SampleComponent</div>
}
```

## 二. useRequest()

异步数据管理，可以是发起的客户端请求数据，也可以是自定义的异步函数。详细用法参考 ahooks 的 [useRequest() 文档](https://ahooks.js.org/hooks/use-request/index)

```typescript
function useRequest<P>(
  service: AxiosRequestConfig<P> | ResourceActionOptions<P> | FunctionService,
  options?: Options<any, any>
)
```

```typescript
// 基础请求状态管理
const { data, loading, error, refresh } = useRequest({
  url: '/api/data',
  method: 'get',
})

// 带自定义查询参数的请求
const { params, run } = useRequest({
  url: '/search',
  defaultParams: { type: 'post' },
})

// 手动触发查询
run({ q: 'noco', page: 3 })
```
