# Parallel Branch

The parallel branch node can divide the process into multiple branches, each branch can configure different nodes. Depending on the branch mode, the execution method of branches also differs. In scenarios where multiple operations need to be executed simultaneously, you can use parallel branch nodes.

## Installation

Built-in plugin, no installation required.

## User Manual

### Create Node

In the workflow configuration interface, click the plus ("+") button in the process to add a "Parallel Branch" node:

![Parallel Branch_Add]

After adding a parallel branch node to the process, two sub-branches will be added by default. You can also click the add branch button to add any number of branches. Each branch can add any nodes. Unneeded branches can be deleted by clicking the delete button at the beginning of the branch.

![Parallel Branch_Branch Management]

### Node Configuration

#### Branch Mode

Parallel branch nodes have the following three modes:

- **All Success**: All branches must execute successfully before the process will continue to execute nodes after the branch ends. Otherwise, if any branch terminates early, whether it's failure, error, or other non-success status, it will cause the entire parallel branch node to terminate early with that status, also known as "All Mode".
- **Any Success**: As long as any branch executes successfully, the process will continue to execute nodes after the branch ends. Unless all branches terminate early, whether it's failure, error, or other non-success status, it will cause the entire parallel branch node to terminate early with that status, also known as "Any Mode".
- **Any Success and Failure**: After any branch executes successfully, the process will continue to execute nodes after the branch ends, but if any node fails, it will cause the entire parallel to terminate early with that status, also known as "Race Mode".

Regardless of which mode, each branch will be attempted to execute sequentially from left to right until the relevant conditions of the preset branch mode are met, then continue to execute subsequent nodes or exit early.
