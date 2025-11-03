# Create Data

Used to add a new row of data to a data table.

Field values for the new data row can use variables from the process context. Assignments to relationship fields can directly reference corresponding data variables in the context, which can be objects or foreign key values. If variables are not used, foreign key values need to be manually entered. Multiple foreign key values for one-to-many relationships need to be separated by English commas.

## Create Node

In the workflow configuration interface, click the plus ("+") button in the process to add a "Create Data" node:

![Create Create Data Node]
<!-- TODO: Insert image -->

## Node Configuration

![Create Node_Example_Node Configuration]
<!-- TODO: Insert image -->

### Data Table

Select the data table to which data will be added.

### Field Values

Assign values to fields in the data table. You can use variables from the process context or manually enter static values.

:::info{title="Note"}
The "Created By" and "Last Updated By" user data are not automatically processed for data created by create nodes in workflows. You need to configure the values of these two fields according to the situation.
:::

### Preload Relationship Data

If the fields of the data to be added contain relationship fields and you want to use the corresponding relationship data in subsequent processes, you can check the corresponding relationship fields in the preload configuration. This way, after the data is added, the corresponding relationship data will be automatically loaded and stored together in the node's result data.

## Example

For example, when data in the "Articles" table is added or updated, a "Article Version" data record needs to be automatically added to record a change history of the article. This can be implemented using a create node:

![Create Node_Example_Process Configuration]
<!-- TODO: Insert image -->

![Create Node_Example_Node Configuration]
<!-- TODO: Insert image -->

After enabling the workflow with this configuration, when data in the "Articles" table changes, an "Article Version" data record will be automatically added to record the article's change history.
