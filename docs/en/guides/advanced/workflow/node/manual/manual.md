# Manual Node

## Create Node

In the workflow configuration interface, click the plus ("+") button in the process to add a "Manual Processing" node:

![Create Manual Node]
<!-- TODO: Insert image -->

## Configure Node

### Assignee

The manual node needs to specify a user as the executor of the to-do task. The to-do task list can be added when adding a block to the page. The task popup content for each node needs to be configured in the interface within the node.

Select a user, or select the primary key or foreign key of user data in the context through variables.

![Manual Node_Configuration_Assignee_Select Variable]
<!-- TODO: Insert image -->

:::info{title=Note}
Currently, the assignee option of manual nodes does not support multiple person processing, which will be supported in future versions.
:::

### Configure User Interface

The interface configuration of to-do items is the core content of manual nodes. You can open independent configuration by clicking the "Configure User Interface" button to pop up a window. Like ordinary pages, you can configure WYSIWYG:

![Manual Node_Node Configuration_Interface Configuration]
<!-- TODO: Insert image -->

#### Tabs

Tabs can be used to distinguish different content. For example, one tab for approved form submission, another tab for rejected form submission, or for displaying related data details, etc., which can be freely configured.

#### Blocks

Supported block types mainly include two categories: data blocks and form blocks. Additionally, Markdown is mainly used for static content such as prompt information.

##### Data Blocks

Data blocks can select trigger data or any node processing result to provide relevant context information to the to-do assignee. For example, if the workflow is triggered by a form event, you can create a details block for trigger data. Consistent with regular page details configuration, you can select any fields in the trigger data for data display:

![Manual Node_Node Configuration_Interface Configuration_Data Block_Trigger]
<!-- TODO: Insert image -->

Node data blocks are similar. You can select data results from upstream nodes for details display. For example, the result of an upstream calculation node as context reference information for the assignee's to-do:

![Manual Node_Node Configuration_Interface Configuration_Data Block_Node Data]
<!-- TODO: Insert image -->

:::info{title=Note}
Since workflows are in an unexecuted state when configuring the interface, data blocks have no specific data displayed. Only after the workflow is triggered and executed can you see the specific process related data in the to-do popup interface.
:::

##### Form Blocks

At least one form block needs to be configured in the to-do interface as the final decision processing for whether the workflow continues to execute. Not configuring a form will cause the process to be unable to continue after interruption. There are three types of form blocks:

- Custom form
- Create data form
- Update data form

![Manual Node_Node Configuration_Interface Configuration_Form Type]
<!-- TODO: Insert image -->

Create data forms and update data forms need to select a based data table. After the to-do user submits, the values in the form will be used to create or update data in a specific data table. Custom forms can freely define a temporary form unrelated to data tables. After the to-do user submits, field values can be used in subsequent nodes.

Form submit buttons can be configured with three types:

- Continue process after submission
- Terminate process after submission
- Only save form values temporarily

![Manual Node_Node Configuration_Interface Configuration_Form Buttons]
<!-- TODO: Insert image -->

The three buttons represent three node statuses in process handling. After submission, the node's status is modified to "Completed", "Rejected", or continues to be in "Waiting" status. A form must configure at least one of the first two to determine the subsequent processing direction of the entire process.

On the "Continue Process" button, you can configure assignments to form fields:

![Manual Node_Node Configuration_Interface Configuration_Form Button_Set Form Values]
<!-- TODO: Insert image -->

![Manual Node_Node Configuration_Interface Configuration_Form Button_Set Form Values Popup]
<!-- TODO: Insert image -->

After opening the popup, you can assign values to any field in the form. After form submission, this value will be used as the field's final value. This is usually useful when reviewing some data. You can use multiple different "Continue Process" buttons in the form, each button setting different enumeration values for fields like status, to achieve the effect of continuing subsequent process execution and using different data values.
