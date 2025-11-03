# Update Data

Used to update data that meets conditions in a data table.

The data table and field assignment parts are the same as the create node. The main difference of the update node is the addition of filter conditions, and the update mode needs to be selected. Additionally, the update node's result will return the number of rows of successfully updated data, which can only be viewed in the execution history and cannot be used as a variable in subsequent nodes.

## Create Node

In the workflow configuration interface, click the plus ("+") button in the process to add an "Update Data" node:

![Update Data_Add]
<!-- TODO: Insert image -->

## Node Configuration

![Update Node_Node Configuration]
<!-- TODO: Insert image -->

### Data Table

Select the data table to be updated.

### Update Mode

Update mode can be "Batch" or "One by One". In batch mode, data table events for each updated record will not be triggered again, while updating one by one will trigger data table events for each updated record, but there will be performance issues with large data volumes, so use with caution. Usually choose based on the target data to be updated and whether to trigger other workflow events. If updating a single record based on primary key, it is recommended to use one-by-one update. If updating multiple records based on conditions, it is recommended to use batch update.

### Filter Conditions

Similar to filter conditions when querying regular data tables, you can use context variables from the process.

### Field Values

Similar to field assignment in create nodes, you can use variables from the process context or manually enter static values.

Note: The "Last Updated By" data is not automatically processed for data updated by update nodes in workflows. You need to configure the value of this field according to the situation.

## Example

For example, when adding an "Article", you need to automatically update the "Article Count" field in the "Article Category" table. This can be implemented using an update node:

![Update Node_Example_Node Configuration]
<!-- TODO: Insert image -->

After the workflow is triggered, it will automatically update the "Article Count" field in the "Article Category" table to the current article count +1.
