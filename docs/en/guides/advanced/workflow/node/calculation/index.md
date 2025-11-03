# Calculation

Although the calculation node does not control the process, it is an important function in the process. The calculation node can evaluate an expression, and the calculation result will be saved in the corresponding node's result for use by other subsequent nodes. It is a tool for calculating, processing, and transforming data. To a certain extent, it can replace the function of calling a value calculation function in a programming language and assigning it to a variable.

## Create Node

In the workflow configuration interface, click the plus ("+") button in the process to add a "Calculation" node:

<!-- ![Calculation Node_Add] -->
<!-- TODO: Insert image -->

## Node Configuration

<!-- ![Calculation Node_Node Configuration] -->
<!-- TODO: Insert image -->

### Calculation Engine

The calculation engine specifies the syntax supported by the expression. Currently supported calculation engines are [Math.js](https://mathjs.org/) and [Formula.js](https://formulajs.info/). Each engine has built-in a large number of commonly used functions and data operation methods. For specific usage, please refer to their official documentation.

:::info{title=Note}
It should be noted that different engines differ in array subscript access. Math.js indexes start from `1`, while Formula.js starts from `0`.
:::

Additionally, if simple string concatenation is needed, you can directly use "String Template". This engine will replace variables in the expression with corresponding values and then return the concatenated string.

### Expression

An expression is a string representation of a calculation formula, which can consist of variables, constants, operators, and supported functions. You can use context variables from the process, such as results from nodes preceding the calculation node, or local variables from loops.

When the expression input does not conform to the syntax, an error will be prompted in the node configuration. If variables do not exist during specific execution, types do not match, or non-existent functions are used, the calculation node will terminate early with an error status.

## Example

### Calculate Order Total

Typically, an order may have multiple products, each with different prices and quantities. The order total needs to calculate the sum of the product of price and quantity for all products. After loading the order details list (one-to-many relationship dataset), you can use a calculation node to calculate the order total:

<!-- ![Calculation Node_Example_Node Configuration] -->
<!-- TODO: Insert image -->

Among them, Formula.js's `SUMPRODUCT` function can calculate the sum of the products of each row of two arrays of the same length. Adding them up will give you the order total.
