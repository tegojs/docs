# End Process

When this node is executed, it will immediately end the currently executing workflow and end with the status configured in the node. Usually used for specific logic process control. After meeting certain logical conditions, exit the current workflow without continuing to execute subsequent process handling. Can be compared to the `return` instruction in programming languages, used to exit the currently executing function.

## Create Node

In the workflow configuration interface, click the plus ("+") button in the process to add an "End Process" node:

<!-- ![End Process_Add] -->
<!-- TODO: Insert image -->

## Node Configuration

<!-- ![End Process_Node Configuration] -->
<!-- TODO: Insert image -->

### End Status

The end status will affect the final status of the workflow execution plan and can be configured as "Success" or "Failure". When the process executes to this node, it will immediately exit with the configured status.

:::info{title=Note}
When used in "Pre-operation Event" type processes, it will cause the request that initiated the operation to be intercepted. For details, please refer to the ["Pre-operation Event" Usage Instructions](../../event-source/beforeOperation.md).

At the same time, in addition to causing the request that initiated the operation to be intercepted, the end status configuration will also affect the status of the information fed back by "Response Message" in this type of process.
:::
