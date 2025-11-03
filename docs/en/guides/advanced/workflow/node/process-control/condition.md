# Condition

Similar to the `if` statement in programming languages, based on the result of the configured condition judgment, it determines the direction of the subsequent process.

## Create Node

Condition judgment has two modes: "Continue if 'Yes'" and "Continue separately for 'Yes' and 'No'". When creating a node, you need to select one of these modes, which cannot be modified afterwards in the node configuration.

<!-- ![Condition_Mode Selection] -->
<!-- TODO: Insert image -->

In "Continue if 'Yes'" mode, when the condition judgment result is "Yes", the process will continue to execute subsequent nodes. Otherwise, the process will terminate and exit early with a failed status.

<!-- !["Yes" Continue Mode] -->
<!-- TODO: Insert image -->

This mode is suitable for scenarios where the process does not continue when conditions are not met. For example, a form submit button bound to a "Pre-operation Event" submits an order, but if the product inventory for the order is insufficient, instead of continuing to generate the order, it fails and exits.

In "Continue separately for 'Yes' and 'No'" mode, two branch processes will be generated after the condition node, corresponding to the processes when the condition judgment result is "Yes" and "No" respectively. The two branch processes can configure subsequent nodes separately. After any branch execution is completed, it automatically merges back to the parent branch where the condition node is located and continues to execute subsequent nodes.

<!-- !["Yes" and "No" Continue Separately Mode] -->
<!-- TODO: Insert image -->

This mode is suitable for scenarios where the process needs to execute different operations separately when conditions are met and not met. For example, query whether a certain data exists; if it doesn't exist, add it; if it exists, update it.

## Node Configuration

### Calculation Engine

Currently supports three engines:

- **Basic**: Obtain logical results through simple binary calculations and "AND"/"OR" grouping.
- **Math.js**: Calculate expressions supported by the [Math.js](https://mathjs.org/) engine to obtain logical results.
- **Formula.js**: Calculate expressions supported by the [Formula.js](https://formulajs.info/) engine to obtain logical results.

In all three calculations, you can use context variables from the process as operands for calculation.

## Example

### "Continue if 'Yes'" Mode

<!-- TODO -->

### "Continue separately for 'Yes' and 'No'" Mode

<!-- TODO -->
