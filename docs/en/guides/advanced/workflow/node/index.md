# Overview

Nodes are the basic units of logical orchestration in workflows. A workflow can have any number of nodes configured. Each node's type represents an instruction that determines the node's behavior. The node's configuration corresponds to the instruction's parameters, which determine the data objects or other content for its behavior operations.

:::info{title=Note}
The workflow trigger is not a node. It is only displayed as an entry node in the process diagram, but it is a different concept from nodes. For details, please refer to the content of [Event Sources](../event-source/overview.md).
:::

From a functional perspective, currently implemented nodes can be divided into four major categories (a total of 24 types of nodes):

- Process Control
  - [Condition](./process-control/condition.md)
  - [Delay] (provided by plugin @tachybase/plugin-workflow-deley)
  - [End Process](./process-control/end.md)
  - [JSON Variable Mapping] (provided by plugin @tachybase/plugin-workflow-json-variable-mapping)
  - [Loop](./process-control/loop.md) (provided by plugin @tachybase/plugin-workflow-loop)
  - [Parallel Branch] (provided by plugin @tachybase/plugin-workflow-parallel)
  - [Process Output] (provided by plugin @tachybase/plugin-workflow-subflow)
  - [Call Workflow] (provided by plugin @tachybase/plugin-workflow-subflow)
  - [Custom Variable] (provided by plugin @tachybase/plugin-workflow-variable)
- Calculation
  - [Calculation](./calculation/index.md)
  - [Date Calculation] (provided by plugin @tachybase/plugin-workflow-date-calculation)
  - [Dynamic Expression Calculation](./calculation/dynamic-calculation.md) (provided by plugin @tachybase/plugin-workflow-dynamic-calculation)
  - [JSON Calculation] (provided by plugin @tachybase/plugin-workflow-json-query)
- Data Table Operations
  - [Create Data](./collection/create.md)
  - [Update Data](./collection/update.md)
  - [Delete Data](./collection/destroy.md)
  - [Query Data](./collection/query.md)
  - [Aggregate Query](./collection/aggregate.md) (provided by plugin @tachybase/plugin-workflow-aggregate)
  - [SQL Operation](./collection/sql.md) (provided by plugin @tachybase/plugin-workflow-sql)
- Manual Processing
  - [Manual Processing](./manual/manual.md) (provided by plugin @tachybase/plugin-workflow-manual)
  - [Approval](./manual/approval.md) (provided by plugin @tachybase/plugin-workflow-approval)
- Other Extensions
  - [TypeScript](./extension-type/typeScript.md) (provided by plugin @tachybase/plugin-workflow-javascript)
  <!-- - [Email Sending](./mailer.md) (provided by plugin @tachybase/plugin-workflow-mailer) -->
  <!-- - [Notification](./notification.md) (provided by plugin @tachybase/plugin-workflow-notification) -->
  - [HTTP Request](./extension-type/request.md) (provided by plugin @tachybase/plugin-workflow-request)
  - [Response Message] (provided by plugin @tachybase/plugin-workflow-response-message)
