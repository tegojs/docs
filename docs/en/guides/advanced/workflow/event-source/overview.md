# Event Source Overview

Event sources are the trigger entry points for workflows. When an event that meets the event source conditions occurs during application runtime, the workflow will be triggered for execution. Currently supported event source types are as follows:

- [Database Events](./set.md)
- [Application Events](./application.md)
- [Pre-Resource Operation Events](./beforeOperation.md)
- [Post-Resource Operation Events](./afterOperation.md)
- [Custom Resource Operations](./customize.md)

For example, when a user submits a form, or data in a data table changes due to user operations or program calls, it will trigger the event source and invoke workflow execution.

Event sources related to data (such as operations, database events) usually carry trigger context data, which can be referenced in workflow nodes to implement automated data processing. For example, when a user submits a form for modification, the event source will monitor and call the corresponding workflow, and the data submitted by the form will be injected into the execution plan's context environment for subsequent nodes to use as variables.

After creating a workflow, on the workflow view page, the event source trigger will be displayed as an entry node style at the beginning of the process. Clicking on this card will open the configuration drawer. Depending on the type of event source, relevant conditions can be configured.
