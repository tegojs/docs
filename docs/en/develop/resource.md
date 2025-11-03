# Resources

Same concept as resources in RESTful, it refers to objects that can be operated on and exposed externally by the system, which can be data tables, files, and other custom objects.

Operations mainly refer to reading and writing resources, typically used for viewing data, creating data, updating data, deleting data, etc. Tachybase implements resource access by defining operations, the core of which is essentially a middleware function for handling requests that is compatible with Koa.

### Automatic Mapping of Data Tables to Resources

Currently, resources mainly target data in data tables. By default, Tachybase automatically maps database tables to resources and also provides server-side data interfaces. So by default, as long as you define a data table using `db.collection()`, you can access the data resources of this data table through Tachybase's HTTP API. The name of the automatically generated resource is the same as the table name defined in the data table. For example, a data table defined with `db.collection({ name: 'users' })` corresponds to a resource name of `users`.

At the same time, common CRUD operations are built-in for these data resources, and relational data resources also have built-in methods for operating associated data.

Default operations for simple data resources:

- [`list`](/api/actions#list): Query data list in data table
- [`get`](/api/actions#get): Query single data record in data table
- [`create`](/api/actions#create): Create single data record in data table
- [`update`](/api/actions#update): Update single data record in data table
- [`destroy`](/api/actions#destroy): Delete single data record in data table

In addition to simple CRUD operations, relational resources also have default relational operations:

- [`add`](/api/actions#add): Add association to data
- [`remove`](/api/actions#remove): Remove association from data
- [`set`](/api/actions#set): Set association for data
- [`toggle`](/api/actions#toggle): Add or remove association for data

For example, define a posts data table and sync it to the database:

```ts
app.db.collection({
  name: 'posts',
  fields: [{ type: 'string', name: 'title' }],
});

await app.db.sync();
```

After that, all CRUD methods for the `posts` data resource can be directly called via HTTP API:

```bash
# create
curl -X POST -H "Content-Type: application/json" -d '{"title":"first"}' http://localhost:3000/api/posts:create
# list
curl http://localhost:3000/api/posts:list
# update
curl -X PUT -H "Content-Type: application/json" -d '{"title":"second"}' http://localhost:3000/api/posts:update
# destroy
curl -X DELETE http://localhost:3000/api/posts:destroy?filterByTk=1
```

### Custom Actions

When the default CRUD and other operations don't meet business scenarios, you can also extend more operations for specific resources. For example, additional processing of built-in operations, or setting default parameters.

Custom operations for specific resources, such as overriding the `create` operation in the posts table:

```ts
// Equivalent to app.resourcer.registerActions()
// Register create operation method for posts resource
app.actions({
  async ['posts:create'](ctx, next) {
    const postRepo = ctx.db.getRepository('posts');
    await postRepo.create({
      values: {
        ...ctx.action.params.values,
        // Restrict current user as post creator
        userId: ctx.state.currentUserId,
      },
    });

    await next();
  },
});
```

This adds reasonable restrictions in business logic, preventing users from creating posts under other user identities.

Custom operations for all resources globally, such as adding an `export` operation for all data tables:

```ts
app.actions({
  // Add export method for all resources, used to export data
  async export(ctx, next) {
    const repo = ctx.db.getRepository(ctx.action.resource);
    const results = await repo.find({
      filter: ctx.action.params.filter,
    });
    ctx.type = 'text/csv';
    // Format as CSV
    ctx.body = results
      .map((row) =>
        Object.keys(row)
          .reduce((arr, col) => [...arr, row[col]], [])
          .join(','),
      )
      .join('\n');

    next();
  },
});
```

Then you can export CSV format data via the following HTTP API:

```bash
curl http://localhost:3000/api/<any_table>:export
```

### Action Parameters

When client requests reach the server, related request parameters are parsed according to rules and placed on the `ctx.action.params` object of the request. Action parameters mainly come from three sources:

1. Default parameters when Action is defined
2. Carried by client requests
3. Pre-processed by other middleware

Before the actual operation processing function handles it, these three parts of parameters are merged together in this order and ultimately passed into the operation's execution function. This is also true across multiple middleware, where parameters processed by the previous middleware continue to be passed with `ctx` to the next middleware.

For parameters that can be used with built-in operations, refer to the [@tachybase/actions](/api/actions) package content. Except for custom operations, client requests mainly use these parameters, and custom operations can extend needed parameters according to business requirements.

Middleware pre-processing mainly uses the `ctx.action.mergeParams()` method, and different parameter types have different merge strategies, which can also be referenced in the [mergeParams()](/api/resourcer/action#mergeparams) method content.

Default parameters of built-in Actions can only be merged according to the default strategy for each parameter in the `mergeParams()` method, to achieve certain operation restrictions on the server side. For example:

```ts
app.resource({
  name: 'posts',
  actions: {
    create: {
      whitelist: ['title', 'content'],
      blacklist: ['createdAt', 'createdById'],
    },
  },
});
```

The above defines the `create` operation for the `posts` resource, where `whitelist` and `blacklist` are respectively the whitelist and blacklist for the `values` parameter, meaning only `title` and `content` fields in the `values` parameter are allowed, and `createdAt` and `createdById` fields in the `values` parameter are prohibited.

### Custom Resources

Data-type resources are further divided into independent resources and relational resources:

- Independent resource: `<collection>`
- Relational resource: `<collection>.<association>`

```ts
// Equivalent to app.resourcer.define()

// Define posts resource
app.resource({
  name: 'posts',
});

// Define author resource for posts
app.resource({
  name: 'posts.user',
});

// Define comments resource for posts
app.resource({
  name: 'posts.coments',
});
```

Customization is mainly needed for non-database table resources, such as in-memory data, proxy interfaces for other services, etc., as well as cases where specific operations need to be defined for existing database table resources.

For example, define a resource for sending notification operations unrelated to the database:

```ts
app.resource({
  name: 'notifications',
  actions: {
    async send(ctx, next) {
      await someProvider.send(ctx.request.body);
      next();
    },
  },
});
```

Then in HTTP API you can access it like this:

```bash
curl -X POST -d '{"title": "Hello", "to": "hello@tachybase.com"}' 'http://localhost:3000/api/notifications:send'
```

## Example

We continue the simple shop scenario from the previous [Data Tables and Fields Example](/development/server/collections-fields#example) to further understand concepts related to resources and operations. Here we assume further resource and operation definitions based on previous data table examples, so the data table content is not repeated here.

As long as corresponding data tables are defined, we can directly use default operations for data resources like products, orders, etc. to complete the most basic CRUD scenarios.

### Override Default Operations

Sometimes, it's not just simple single-record operations, or default operation parameters need some control, so we can override default operations. For example, when creating an order, the `userId` should not be submitted by the client to represent order ownership, but should be determined by the server based on the currently logged-in user. In this case, we can override the default `create` operation. For simple extensions, we can write directly in the plugin's main class:

```ts
import { Plugin } from '@tachybase/server';
import actions from '@tachybase/actions';

export default class ShopPlugin extends Plugin {
  async load() {
    // ...
    this.app.resource({
      name: 'orders',
      actions: {
        async create(ctx, next) {
          ctx.action.mergeParams({
            values: {
              userId: ctx.state.user.id,
            },
          });

          return actions.create(ctx, next);
        },
      },
    });
  }
}
```

Thus, we override the default `create` operation for the orders data resource during plugin loading, but after modifying operation parameters, we still call the default logic without writing it ourselves. The `mergeParams()` method for modifying submission parameters is very useful for built-in default operations, which we'll introduce later.

### Custom Operations for Data Table Resources

When built-in operations can't meet business needs, we can extend resource functionality through custom operations. For example, an order typically has many statuses. If we design the `status` field's values as a series of enumerated values:

- `-1`: Canceled
- `0`: Ordered, not paid
- `1`: Paid, not shipped
- `2`: Shipped, not received
- `3`: Received, order completed

Then we can implement order status changes through custom operations. For example, a shipping operation for orders. Although simple cases can be implemented through `update` operations, if there are more complex situations like payment, receipt, etc., using only `update` would cause unclear semantics and parameter confusion. Therefore, we can implement through custom operations.

First, we add a delivery information table definition, saved to `collections/deliveries.ts`:

```ts
export default {
  name: 'deliveries',
  fields: [
    {
      type: 'belongsTo',
      name: 'order',
    },
    {
      type: 'string',
      name: 'provider',
    },
    {
      type: 'string',
      name: 'trackingNumber',
    },
    {
      type: 'integer',
      name: 'status',
    },
  ],
};
```

At the same time, extend the orders table with a delivery information association field (`collections/orders.ts`):

```ts
export default {
  name: 'orders',
  fields: [
    // ...other fields
    {
      type: 'hasOne',
      name: 'delivery',
    },
  ],
};
```

Then we add the corresponding operation definition in the plugin's main class:

```ts
import { Plugin } from '@tachybase/server';

export default class ShopPlugin extends Plugin {
  async load() {
    // ...
    this.app.resource({
      name: 'orders',
      actions: {
        async deliver(ctx, next) {
          const { filterByTk } = ctx.action.params;
          const orderRepo = ctx.db.getRepository('orders');

          const [order] = await orderRepo.update({
            filterByTk,
            values: {
              status: 2,
              delivery: {
                ...ctx.action.params.values,
                status: 0,
              },
            },
          });

          ctx.body = order;

          next();
        },
      },
    });
  }
}
```

Among them, Repository is the data repository class used for data tables, most data read and write operations will be completed by this, for details refer to the [Repository API](/api/database/repository) section.

After defining, we can call the "deliver" operation from the client via HTTP API:

```bash
curl \
  -X POST \
  -H 'Content-Type: application/json' \
  -d '{"provider": "SF", "trackingNumber": "SF1234567890"}' \
  '/api/orders:deliver/<id>'
```

Similarly, we can define more similar operations, such as payment, receipt, etc.

### Parameter Merging

Suppose we want users to be able to query their own orders and only their own orders, and we need to restrict users from querying canceled orders. We can define this through action default parameters:

```ts
import { Plugin } from '@tachybase/server';

export default class ShopPlugin extends Plugin {
  async load() {
    // ...
    this.app.resource({
      name: 'orders',
      actions: {
        // Default parameters for list operation
        list: {
          filter: {
            // Filter operator extended by users plugin
            $isCurrentUser: true,
            status: {
              $ne: -1,
            },
          },
          fields: ['id', 'status', 'createdAt', 'updatedAt'],
        },
      },
    });
  }
}
```

When users query from the client, they can also add other parameters in the request URL, such as:

```bash
curl 'http://localhost:3000/api/orders:list?productId=1&fields=id,status,quantity,totalPrice&appends=product'
```

The actual query conditions will be merged into:

```json
{
  "filter": {
    "$and": {
      "$isCurrentUser": true,
      "status": {
        "$ne": -1
      },
      "productId": 1
    }
  },
  "fields": [
    "id",
    "status",
    "quantity",
    "totalPrice",
    "createdAt",
    "updatedAt"
  ],
  "appends": ["product"]
}
```

And get the expected query results.

Additionally, if we need to restrict the order creation interface from allowing clients to submit order number (`id`), total price (`totalPrice`), and other fields, we can control this by defining default parameters for the `create` operation:

```ts
import { Plugin } from '@tachybase/server';

export default class ShopPlugin extends Plugin {
  async load() {
    // ...
    this.app.resource({
      name: 'orders',
      actions: {
        create: {
          blacklist: ['id', 'totalPrice', 'status', 'createdAt', 'updatedAt'],
          values: {
            status: 0,
          },
        },
      },
    });
  }
}
```

This way, even if the client deliberately submits these fields, they will be filtered out and won't exist in the `ctx.action.params` parameter set.

If there are more complex restrictions, such as only being able to place orders when products are on shelves and in stock, this can be implemented by configuring middleware:

```ts
import { Plugin } from '@tachybase/server';

export default class ShopPlugin extends Plugin {
  async load() {
    // ...
    this.app.resource({
      name: 'orders',
      actions: {
        create: {
          middlewares: [
            async (ctx, next) => {
              const { productId } = ctx.action.params.values;

              const product = await ctx.db.getRepository('products').findOne({
                filterByTk: productId,
                filter: {
                  enabled: true,
                  inventory: {
                    $gt: 0,
                  },
                },
              });

              if (!product) {
                return ctx.throw(404);
              }

              await next();
            },
          ],
        },
      },
    });
  }
}
```

Putting part of the business logic (especially pre-processing) into middleware can make our code clearer and easier to maintain.

## Summary

Through the above examples, we've introduced how to define resources and related operations. Let's review the content of this chapter:

- Automatic mapping of data tables to resources
- Built-in default resource operations
- Custom operations for resources
- Parameter merge order and strategy for operations
