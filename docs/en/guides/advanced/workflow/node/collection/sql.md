# SQL Operation

In some special scenarios, the simple data table operation nodes above may not be able to perform complex operations. In such cases, you can directly use the SQL node to have the database directly execute complex SQL statements for data operations.

The difference from directly connecting to the database outside the application for SQL operations is that within the workflow, you can use context variables from the process as part of the parameters in the SQL statement.

## FAQ

### How to use the result of SQL nodes?

If a `SELECT` statement is used, the query result will be saved in the node in Sequelize's JSON format and can be parsed and used through the [JSON-query] plugin.

### Will SQL operations trigger data table events?

**No**. SQL operations directly send SQL statements to the database for processing. Related `CREATE` / `UPDATE` / `DELETE` operations all occur in the database, while data table events occur in the Node.js application layer (ORM processing), so they will not trigger data table events.

## Installation

Built-in plugin, no installation required.

## User Manual

### Create Node

In the workflow configuration interface, click the plus ("+") button in the process to add an "SQL Operation" node:

![SQL Operation_Add]
<!-- TODO: Insert image -->

### Node Configuration

![SQL Node_Node Configuration]
<!-- TODO: Insert image -->

#### Data Source

Select the data source for executing SQL.

The data source must be of database type, such as main data source, PostgreSQL type, and other Sequelize-compatible data sources.

#### SQL Content

Edit SQL statement. Currently only one SQL statement is supported.

Insert the required variables through the variable button in the upper right corner of the edit box. Before execution, they will be replaced with the corresponding variable values through text replacement, then the replaced text will be used as the final SQL statement and sent to the database for query.

### Node Execution Result

Starting from `v1.3.15-beta`, the result of SQL node execution is an array composed of pure data. Before this, it was Sequelize's native return structure containing query meta-information (see: [`sequelize.query()`]).

For example, the following query:

```sql
select count(id) from posts;
```

Result before `v1.3.15-beta`:

```json
[
    [
        { "count": 1 }
    ],
    {
        // meta
    }
]
```

Result after `v1.3.15-beta`:

```json
[
    { "count": 1 }
]
```
