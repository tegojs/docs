# Aggregate Query

Used to perform aggregate function queries on data that meets conditions in a data table and return corresponding statistical results. Commonly used to process statistical data related to reports.

The node implementation is based on database aggregate functions. Currently, only statistics for a single field of one data table are supported. The numerical value of the statistical result will be saved in the node's result for use by other subsequent nodes.

## Installation

Built-in plugin, no installation required.

## User Manual

### Create Node

In the workflow configuration interface, click the plus ("+") button in the process to add an "Aggregate Query" node:

![Create Aggregate Query Node]
<!-- TODO: Insert image -->

### Node Configuration

![Aggregate Query Node_Node Configuration]
<!-- TODO: Insert image -->

#### Aggregate Function

Supports 5 aggregate functions in SQL: `COUNT`, `SUM`, `AVG`, `MIN`, and `MAX`. Select one of them to perform aggregate queries on data.

#### Target Type

The target of an aggregate query can be selected through two modes. One is to directly select the target data table and one of its fields. The other is through data objects already in the process context, selecting its one-to-many relationship data table and field to perform aggregate queries.

#### Distinct

That is, `DISTINCT` in SQL. The distinct field is the same as the selected data table field. Currently, selecting different fields for the two is not supported.

#### Filter Conditions

Similar to filter conditions when querying regular data tables, you can use context variables from the process.

### Example

Aggregate target of "Data Table Data" is relatively easy to understand. Here we use "Count total articles in the article category after adding a new article" as an example to introduce the use of aggregate target as "Associated Data Table Data".

First, create two data tables: "Articles" and "Categories", where articles have a many-to-one relationship field pointing to the categories table, and also create a reverse relationship field of category one-to-many articles:

| Field Name | Type              |
| ---------- | ----------------- |
| Title      | Single Line Text  |
| Category   | Many-to-One (Category) |

| Field Name | Type              |
| ---------- | ----------------- |
| Category Name | Single Line Text |
| Articles   | One-to-Many (Article) |

Next, create a workflow triggered by data table events, select to trigger after adding data to the articles table.

Then add an aggregate query node with the following configuration:

![Aggregate Query Node_Example_Node Configuration]
<!-- TODO: Insert image -->

This way, after the workflow is triggered, the aggregate query node will count the number of all articles under the category of the newly added article and save it as the node's result.

:::info{title=Note}
If you need to use relationship data from the data table event trigger, you need to configure the "Preload Associated Data" related fields in the trigger, otherwise it cannot be selected.
:::
