# 自定义请求

> ℹ️ **提示**  
> 由插件 `plugin-action-custom-request` 提供

## 介绍

## 安装

内置插件，无需单独安装

## 使用说明

![20240426120014](/actions/custom-request-1.png)

### 配置权限

当勾选了允许配置界面时，可以配置自定义请求。

![20240426114957](/actions/custom-request-2.png)

customRequests 表是系统级的，通过 acl.registerSnippet 配置权限。

```typescript
this.app.acl.registerSnippet({
  name: 'ui.customRequests', // ui.* 对应的允许配置界面权限
  actions: ['customRequests:*'],
});
```
### 变量

支持在 URL 和请求体中配置变量。

- 当前记录
- 当前用户
- 当前时间
- API token（v1.3.22-beta 及以上版本支持）

![20240426120953](/actions/custom-request-3.png)

![20240426121051](/actions/custom-request-4.png)

## 操作配置项

### 请求设置

![20240426120131](/actions/custom-request-5.png)

### 权限控制

每个自定义请求操作支持自定义角色权限，默认拥有权限。

![20240426120451](/actions/custom-request-6.png)