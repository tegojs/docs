# Approval Node

In approval workflows, the specialized "Approval" node needs to be used to configure operation logic for approvers to handle (approve, reject, or return) initiated approvals. The "Approval" node can only be used in approval processes.

:::info{title=Note}
Difference from regular "Manual Processing" nodes: Regular "Manual Processing" nodes are more generalized and can be used for more types of workflows such as manual data input, manual decision on whether the process continues, etc. The "Approval Node" is specialized for approval process handling and cannot be used in other workflows.
:::

## Create Node

Click the plus ("+") button in the process to add an "Approval" node, then select one of the approval modes to create an approval node:

![Approval Node_Create]
<!-- TODO: Insert image -->

## Approval Mode

There are two approval modes:

1.  Direct mode: Usually used for relatively simple processes. Whether the approval node passes or not only determines whether the process ends. If not passed, it directly exits the process.

    ![Approval Node_Approval Mode_Direct Mode]
<!-- TODO: Insert image -->

2.  Branch mode: Usually used for more complex data logic. After the approval node produces any result, other nodes can continue to execute in its result branch.

    ![Approval Node_Approval Mode_Branch Mode]
<!-- TODO: Insert image -->

    If the node is configured with a "Return" operation, a "Return" branch will be generated, and after the return branch executes, it will forcibly exit the current process.

    After this node is "Approved", in addition to executing the approval branch, it will also continue to execute subsequent processes. After the "Reject" operation, it can also continue to execute subsequent processes by default, or it can be configured in the node to end the process after executing the branch.

:::info{title=Note}
The approval mode cannot be modified after the node is created.
:::

## Approver

Approvers are the user collection responsible for approval behavior of this node. Can be one or more users. The selection source can be static values selected from the user list or dynamic values specified by variables.

![Approval Node_Approver]
<!-- TODO: Insert image -->

When selecting variables, you can only select primary keys or foreign keys of user data in the context and node results. If the selected variable is an array during execution (one-to-many relationship), then each user in the array will be merged into the entire approver collection.

## Negotiation Mode

If there is only one approver in the final execution (including the case after deduplication of multiple variables), then regardless of which negotiation mode is selected, approval operations will only be performed by that user, and the result will only be determined by that user.

When there are multiple users in the approver collection, selecting different negotiation modes represents different processing methods:

1. OR: Only one person needs to approve for the node to be approved. The node is rejected only if all people reject.
2. AND: All people need to approve for the node to be approved. If any one person rejects, the node is rejected.
3. Vote: More than the set percentage of people need to approve for the node to be approved, otherwise the node is rejected.

For return operations, in any mode, if a user in the approver collection processes as return, the node will directly exit the process.

## Processing Order

Similarly, when there are multiple users in the approver collection, selecting different processing orders represents different processing methods:

1. Parallel: All approvers can process in any order, the order of processing is irrelevant.
2. Sequential: Approvers process in the order of the approver collection. After the previous approver in the approver list submits, the next one can process.

Regardless of whether it is set to "Sequential" processing, the results generated according to the actual processing order also follow the rules in the above "Negotiation Mode". After meeting the corresponding conditions, the node completes execution.

## Exit Workflow After Rejection Branch Ends

When "Approval Mode" is set to "Branch Mode", you can choose to exit the workflow after the rejection branch ends. After checking, an "✗" will be displayed at the end of the rejection branch, indicating that subsequent nodes will not continue after this branch ends:

![Approval Node_Exit After Rejection]
<!-- TODO: Insert image -->

## Approver Interface Configuration

Approver interface configuration is used to provide approvers with the operation interface when the approval workflow executes to this node. Click the configuration button to open the popup:

![Approval Node_Interface Configuration_Popup]
<!-- TODO: Insert image -->

In the configuration popup, you can add cards such as approval details, action bar, and custom prompt text:

![Approval Node_Interface Configuration_Add Block]
<!-- TODO: Insert image -->

### Details Block

Among them, the approval content details block is the data block submitted by the initiator. Similar to regular data blocks, you can add field components of any data table and arrange them in any way to organize the content that approvers need to view:

![Approval Node_Interface Configuration_Details Block]
<!-- TODO: Insert image -->

### Form Block

In the operation form block, you can add operation buttons supported by this node, including "Approve", "Reject", "Return", "Reassign", and "Add Approval":

![Approval Node_Interface Configuration_Operation Form Block]
<!-- TODO: Insert image -->

Additionally, fields that can be modified by approvers can also be added to the operation form. These fields will be displayed in the operation form when the approver processes the approval. Approvers can modify the values of these fields. After submission, both the data used for approval and the snapshot of corresponding data in the approval process will be updated simultaneously.

![Approval Node_Interface Configuration_Operation Form_Modify Approval Content Fields]
<!-- TODO: Insert image -->

### "Approve", "Reject" and "Return"

Among approval operation buttons, "Approve", "Reject", and "Return" are decisive operations. After submission, the approver's processing at this node is completed. Additional fields that need to be filled when submitting can be added in the "Processing Configuration" popup of the operation button, such as "Comment", etc.

![Approval Node_Interface Configuration_Operation Form_Processing Configuration]
<!-- TODO: Insert image -->

### "Reassign" and "Add Approval"

"Reassign" and "Add Approval" are non-decisive operations used to dynamically adjust approvers in the approval process. "Reassign" is to transfer the current user's approval task to another user for processing on their behalf. "Add Approval" is to add an approver before or after the current approver, with the newly added approver continuing to approve together.

After enabling the "Reassign" or "Add Approval" operation button, you need to select "Assignable Person Range" in the button's configuration menu to set the range of new approvers that can be assigned:

![Approval Node_Interface Configuration_Operation Form_Assignable Person Range]
<!-- TODO: Insert image -->

Like the node's original approver configuration, the assignable person range can also be directly selected approvers or based on query conditions of the user table. They will eventually be merged into a collection and will not include users already in the approver collection.

:::warning{title=Important}
If an operation button is enabled or disabled, or if the assignable person range is modified, you need to save the node's configuration after closing the operation interface configuration popup, otherwise the changes to the operation button will not take effect.
:::
