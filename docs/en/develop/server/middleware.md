# Middleware

## How to Register Middleware?

Middleware registration methods are generally written in the load method

```ts
export class MyPlugin extends Plugin {
  load() {
    this.app.acl.use();
    this.app.resourcer.use();
    this.app.use();
  }
}
```

Explanation:

1. `app.acl.use()` Adds resource permission-level middleware, executed before permission judgment
2. `app.resourcer.use()` Adds resource-level middleware, only executed when a defined resource is requested
3. `app.use()` Adds application-level middleware, executed on every request

## Onion Model

```ts
app.use(async (ctx, next) => {
  ctx.body = ctx.body || [];
  ctx.body.push(1);
  await next();
  ctx.body.push(2);
});

app.use(async (ctx, next) => {
  ctx.body = ctx.body || [];
  ctx.body.push(3);
  await next();
  ctx.body.push(4);
});
```

Visit http://localhost:3000/api/hello to view, the browser response data is:

```js
{"data": [1,3,4,2]}
```

## Built-in Middleware and Execution Order

1. `bodyParser`
2. `cors`
3. `i18n`
4. `dataWrapping`
5. `db2resource`
6. `restApi` actually resourcer
   1. `auth`
   2. `acl`
      1. Other middleware added by `acl.use()`
   3. Other middleware added by `resourcer.use()`
   4. `action handler`
7. Other middleware added by `app.use()`

You can also use `before` or `after` to insert middleware at a position marked by a `tag`, such as:

```ts
app.use(m1, { tag: 'restApi' });
app.resourcer.use(m2, { tag: 'parseToken' });
app.resourcer.use(m3, { tag: 'checkRole' });
// m4 will be placed before m1
app.use(m4, { before: 'restApi' });
// m5 will be inserted between m2 and m3
app.resourcer.use(m5, { after: 'parseToken', before: 'checkRole' });
```

If the position is not specifically specified, the execution order of newly added middleware is:

1. First execute those added by acl.use,
2. Then those added by resourcer.use, including middleware handler and action handler,
3. Finally those added by app.use.


Visit http://localhost:3000/api/hello to view, the browser response data is:

```js
{"data": [1,2]}
```

Visit http://localhost:3000/api/test:list to view, the browser response data is:

```js
{"data": [5,3,7,1,2,8,4,6]}
```

### Resource undefined, middleware added by resourcer.use() is not executed

```ts
app.use(async (ctx, next) => {
  ctx.body = ctx.body || [];
  ctx.body.push(1);
  await next();
  ctx.body.push(2);
});

app.resourcer.use(async (ctx, next) => {
  ctx.body = ctx.body || [];
  ctx.body.push(3);
  await next();
  ctx.body.push(4);
});
```

Visit http://localhost:3000/api/hello to view, the browser response data is:

```js
{"data": [1,2]}
```

In the above example, the hello resource is undefined and will not enter the resourcer, so middleware in the resourcer will not be executed

## Helper Plugin

Enable dev tools to view the middleware execution order and related use stack addresses for the current request

![Middleware Execution Flow](./assets/middleware.png)
