# Delete Data

Used to delete data that meets conditions in a data table.

The basic use of the delete node is similar to the update node, except the delete node does not require field assignment, only selecting the data table and filter conditions. The delete node's result will return the number of rows of successfully deleted data, which can only be viewed in the execution history and cannot be used as a variable in subsequent nodes.

:::info{title=Note}
Currently, the delete node does not support deleting one by one; all deletions are batch deletions, so other events for each data deletion will not be triggered.
:::

## Create Node

In the workflow configuration interface, click the plus ("+") button in the process to add a "Delete Data" node:

![Create Delete Data Node]
<!-- TODO: Insert image -->

## Node Configuration

![Delete Node_Node Configuration]
<!-- TODO: Insert image -->

### Data Table

Select the data table from which data will be deleted.

### Filter Conditions

Similar to filter conditions when querying regular data tables, you can use context variables from the process.

## Example

For example, to regularly clean up invalid historical order data that has been canceled, you can use a delete node:

![Delete Node_Example_Node Configuration]
<!-- TODO: Insert image -->

The workflow will be triggered periodically and execute deletion of all canceled invalid historical order data.
