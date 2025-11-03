# Events

Tachybase provides numerous event listeners in the lifecycle of applications, plugins, and databases. These methods only execute after the events are triggered.

## How to Add Event Listeners?

Event registration is generally placed in afterAdd or beforeLoad

```ts
export class MyPlugin extends Plugin {
  // afterAdd() is executed after the plugin is added, regardless of activation
  afterAdd() {
    this.app.on();
    this.db.on();
  }

  // beforeLoad() is only executed after the plugin is activated
  beforeLoad() {
    this.app.on();
    this.db.on();
  }
}
```

### `db.on`

Leveraging Sequelize, database-related events are related to Collection configuration and Repository CRUD, including:

- 'beforeSync' / 'afterSync'
- 'beforeValidate' / 'afterValidate'
- 'beforeCreate' / 'afterCreate'
- 'beforeUpdate' / 'afterUpdate'
- 'beforeSave' / 'afterSave'
- 'beforeDestroy' / 'afterDestroy'
- 'afterCreateWithAssociations'
- 'afterUpdateWithAssociations'
- 'afterSaveWithAssociations'
- 'beforeDefineCollection'
- 'afterDefineCollection'
- 'beforeRemoveCollection' / 'afterRemoveCollection


### `app.on`

App events are related to the application lifecycle, including:

- 'beforeLoad' / 'afterLoad'
- 'beforeInstall' / 'afterInstall'
- 'beforeUpgrade' / 'afterUpgrade'
- 'beforeStart' / 'afterStart'
- 'beforeStop' / 'afterStop'
- 'beforeDestroy' / 'afterDestroy'


## Examples

We continue to use a simple online store as an example. For relevant data table modeling, you can review the examples in the [Collections and Fields](/development/) section.

### Reduce Product Inventory After Creating Order

Usually, products and orders are in different data tables. Reducing the product inventory after a customer places an order can solve the overselling problem. At this time, we can define corresponding events for the data operation of creating orders, and solve the inventory modification problem at this time:

```ts
class ShopPlugin extends Plugin {
  beforeLoad() {
    this.db.on('orders.afterCreate', async (order, options) => {
      const product = await order.getProduct({
        transaction: options.transaction,
      });

      await product.update(
        {
          inventory: product.inventory - order.quantity,
        },
        {
          transaction: options.transaction,
        },
      );
    });
  }
}
```

Because Sequelize's events carry transaction information by default, we can directly use the transaction to ensure both data operations are performed in the same transaction.

Similarly, you can also modify the order status to shipped after creating a delivery record:

```ts
class ShopPlugin extends Plugin {
  load() {
    this.db.on('deliveries.afterCreate', async (delivery, options) => {
      const orderRepo = this.db.getRepository('orders');
      await orderRepo.update({
        filterByTk: delivery.orderId,
        value: {
          status: 2
        }
        transaction: options.transaction
      });
    });
  }
}
```

### Scheduled Tasks That Exist Alongside the Application

Without considering complex scenarios such as using workflow plugins, we can also implement a simple scheduled task mechanism through application-level events, which can be bound to the application's process and stop after exiting. For example, we want to regularly scan all orders and automatically sign for orders that exceed the signing time:

```ts
class ShopPlugin extends Plugin {
  timer = null;
  orderReceiveExpires = 86400 * 7;

  checkOrder = async () => {
    const expiredDate = new Date(Date.now() - this.orderReceiveExpires);
    const deliveryRepo = this.db.getRepository('deliveries');
    const expiredDeliveries = await deliveryRepo.find({
      fields: ['id', 'orderId'],
      filter: {
        status: 0,
        createdAt: {
          $lt: expiredDate,
        },
      },
    });
    await deliveryRepo.update({
      filter: {
        id: expiredDeliveries.map((item) => item.get('id')),
      },
      values: {
        status: 1,
      },
    });
    const orderRepo = this.db.getRepository('orders');
    const [updated] = await orderRepo.update({
      filter: {
        status: 2,
        id: expiredDeliveries.map((item) => item.get('orderId')),
      },
      values: {
        status: 3,
      },
    });

    console.log('%d orders expired', updated);
  };

  load() {
    this.app.on('beforeStart', () => {
      // Execute every minute
      this.timer = setInterval(this.checkOrder, 1000 * 60);
    });

    this.app.on('beforeStop', () => {
      clearInterval(this.timer);
      this.timer = null;
    });
  }
}
```

## Summary

Through the above examples, we have basically understood the role of events and ways to extend them:

- Database-related events
- Application-related events
