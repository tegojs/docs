# Database Events

Database event types will monitor create, update, and delete events of data tables. When data operations on the table occur and meet the configured conditions, the corresponding workflow is triggered. For example, deducting product inventory after adding an order, waiting for manual review after adding a comment, etc.

## Basic Usage

There are several situations for data table changes:

1. After adding data.
2. After updating data.
3. After adding or updating data.
4. After deleting data.


You can choose when to listen according to different business needs.

After database events are monitored, the data row that generated the event will be injected into the triggered workflow execution plan as trigger context data for subsequent nodes in the process to use as variables. However, when subsequent nodes need to use the relationship fields of this data, you need to first configure preloading of relationship data. The selected relationship data will be injected into the context together after triggering and can be selected and used by level.

## Related Notes

### Batch Data Operations Not Currently Supported

Database events do not currently support monitoring of batch data operations. For example, when adding article data and simultaneously adding multiple tag data for that article (one-to-many relationship data), only the event of adding the article can be monitored, while the multiple tags added simultaneously will not trigger the event source for adding tags. When associating and adding many-to-many relationship data, the event source of the intermediate table will not be monitored either.

### Data Operations Outside the Application Will Not Trigger

Calling application interfaces through HTTP API to operate on data tables can also trigger corresponding events, but if you directly operate the database without going through the application, the corresponding events cannot be monitored. For example, the monitoring in the database itself will not be associated with the event source monitoring in the application.

In addition, using SQL operation nodes to operate on the database is equivalent to directly operating the database, and the event source will not monitor it either.

### External Data Sources

Starting from `0.20`, workflows support external data sources. If you use external data source plugins and the data table event is configured for an external data source, as long as data operations on that data source are completed within the application (user additions, updates, and workflow data operations, etc.), the corresponding database events can be monitored. However, if data changes are made through other systems or directly in the external database, events cannot be monitored.

## Example

Take the scenario of calculating the total price and deducting inventory after adding an order.

First, we create a products table and an orders table with the following data models:

| Field Name | Field Type  |
| ---------- | ----------- |
| Product Name | Single Line Text |
| Price      | Number      |
| Inventory  | Integer     |

| Field Name | Field Type         |
| ---------- | ------------------ |
| Order Number | Auto Sequence     |
| Order Product | Many-to-One (Product) |
| Order Total | Number            |

And add basic product data:

| Product Name  | Price | Inventory |
| ------------- | ----- | --------- |
| iPhone 14 Pro | 7999  | 10        |
| iPhone 13 Pro | 5999  | 0         |

Then create an event source based on order data table events:

![Data Table Event_Example_Add Order Trigger]

Configuration items:

- Name: Event source name.
- Workflow: Workflow to be triggered for execution.
- Type: Database event.
- Options:
    - Data Table: Leave blank.
    - Data Table Event: Leave blank.
    - Event Name: Table name + hook event to monitor


Then configure other nodes of the workflow according to the process logic, check if product inventory is greater than 0, deduct inventory if greater than 0, otherwise delete the order as invalid:

Node configuration will be explained in detail in the introduction documentation for specific types.

Enable this event source and test by adding orders through the interface.
