# Loop

Loop is equivalent to syntax structures like `for`/`while`/`forEach` in programming languages. When you need to repeat some operations a certain number of times or for a data collection (array), you can use loop nodes.

## Create Node

In the workflow configuration interface, click the plus ("+") button in the process to add a "Loop" node:

<!-- ![Create Loop Node] -->
<!-- TODO: Insert image -->

After creating a loop node, a branch inside the loop will be generated. You can add any number of nodes in the branch. These nodes can not only use context variables from the process, but also use local variables from the loop context, such as the data object from each iteration in the loop collection, or the index of the loop count (index starts counting from `0`). The scope of local variables is limited to inside the loop. If there are multiple nested loops, you can use local variables of specific loops by layer.

## Node Configuration

### Loop Object

The loop will process differently based on different data types of the loop object:

1.  **Array**: The most common case, usually you can select variables from the process context, such as multiple data results from query nodes, or preloaded one-to-many relationship data. If an array is selected, the loop node will traverse each element in the array. Each iteration will assign the current element to a local variable in the loop context.

2.  **Number**: When the selected variable is a number, it will use that number as the number of loop iterations. The index of the loop count in local variables is also the value of the loop object.

3.  **String**: When the selected variable is a string, it will use the length of that string as the number of loop iterations, processing each character in the string by index each time.

4.  **Other**: Other types of values (including object types) are only treated as loop objects for single processing and will only loop once. Usually, loops are not needed in this case.

In addition to selecting variables, for number and string types, you can also directly input constants. For example, input `5` (number type), the loop node will loop 5 times. Input `abc` (string type), the loop node will loop 3 times, processing the three characters `a`, `b`, `c` respectively. Select the type you want to use as a constant in the variable selection tool.

## Example

For example, when placing an order, you need to check the inventory for each product in the order. If the inventory is sufficient, deduct the inventory; otherwise, update the product in the order details as invalid.

1.  Create three tables: Products table <-(1:m)-- Order Details table --(m:1)-> Orders table, with the following data models:

    | Field Name       | Field Type        |
    | ---------------- | ----------------- |
    | Order Details    | Many-to-One (Details) |
    | Order Total      | Number            |

    | Field Name | Field Type         |
    | ---------- | ------------------ |
    | Product    | One-to-Many (Product) |
    | Quantity   | Number             |

    | Field Name | Field Type       |
    | ---------- | ---------------- |
    | Product Name | Single Line Text |
    | Price      | Number           |
    | Inventory  | Integer          |

2.  Create a workflow with trigger selecting "Data Table Event", select "Orders" table "When Data is Added" to trigger, and need to configure preloading of "Order Details" table and product table relationship data under details:

    <!-- ![Loop Node_Example_Trigger Configuration] -->
    <!-- TODO: Insert image -->


3.  Create a loop node, select loop object as "Trigger Data / Order Details", i.e., for each data record in the order details table:

    <!-- ![Loop Node_Example_Loop Node Configuration] -->
    <!-- TODO: Insert image -->

4.  Inside the loop node, create a "Condition" node to determine if the product inventory is sufficient:

    <!-- ![Loop Node_Example_Condition Node Configuration] -->
    <!-- TODO: Insert image -->

5.  If sufficient, create a "Calculation Node" and an "Update Data" node in the "Yes" branch to update the calculated deducted inventory to the corresponding product record:

    <!-- ![Loop Node_Example_Calculation Node Configuration] -->
    <!-- TODO: Insert image -->

    <!-- ![Loop Node_Example_Update Inventory Node Configuration] -->
    <!-- TODO: Insert image -->

6.  Otherwise, in the "No" branch, create an "Update Data" node to update the order detail status to "Invalid":

    <!-- ![Loop Node_Example_Update Order Detail Node Configuration] -->
    <!-- TODO: Insert image -->

The overall process structure is as follows:

<!-- ![Loop Node_Example_Process Structure] -->
<!-- TODO: Insert image -->

After completing the configuration and activating this process, when creating a new order, it will automatically check the product inventory in the order details. If the inventory is sufficient, it will deduct the inventory; otherwise, the product in the order details will be updated as invalid (to facilitate calculating the valid order total).
