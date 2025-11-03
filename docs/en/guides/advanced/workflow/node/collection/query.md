# Query Data

Used to query data that meets conditions in a data table and retrieve data records.

You can configure to query a single record or multiple records. Query results can be used as variables in subsequent nodes. When querying multiple records, the query result is an array. When the query result is empty, you can choose whether to continue executing subsequent nodes.

## Create Node

In the workflow configuration interface, click the plus ("+") button in the process to add a "Query Data" node:

![Query Data_Add]
<!-- TODO: Insert image -->

## Node Configuration

![Query Node_Node Configuration]
<!-- TODO: Insert image -->

### Data Table

Select the data table to be queried.

### Result Type

Result type is divided into "Single Data" and "Multiple Rows of Data":

- Single data: Result is an object, only the first matching record, or null.
- Multiple data: Result will be an array containing records matching the conditions. If no records match, it will be an empty array. Can be processed one by one through a loop node.

### Filter Conditions

Similar to filter conditions when querying regular data tables, you can use context variables from the process.

### Sorting

When querying one or multiple records, you can control the desired results through sorting rules. For example, to query the latest record, you can sort by the "Created Date" field in descending order.

### Pagination

When the result set may be very large, you can use pagination to control the quantity of query results. For example, to query the latest 10 records, you can sort by the "Created Date" field in descending order, then set pagination to 1 page with 10 records.

### Handling Empty Results

In single result mode, if there is no data meeting the conditions, the query result will be `null`. In multiple results mode, it will be an empty array (`[]`). You can choose whether to check "Exit process when query result is empty" as needed. When checked, if the query result is empty, subsequent nodes will not be executed and will exit early with a failed status.
