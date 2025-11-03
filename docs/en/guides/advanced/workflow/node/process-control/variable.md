# Custom Variable

<PluginInfo name="workflow-variable" link="/handbook/workflow-variable" commercial="true"></PluginInfo>

Variables can be declared in the process, or values can be assigned to already declared variables, typically used to save some temporary data in the process.

## User Manual

### Create Node

In the workflow configuration interface, click the plus ("+") button in the process to add a "Variable" node:

![Add Variable Node]

### Configure Node

#### Mode

Variable nodes are similar to variables in programs. They need to be declared first before they can be used and assigned values. So when creating a variable node, you need to select the variable's mode. There are two modes to choose from:

![Select Mode]

- Declare new variable: Create a new variable.
- Assign to existing variable: Assign to a variable already declared in the previous process, equivalent to modifying the variable's value.

When the created node is the first variable node in the process, you can only select declare mode because there are no variables available for assignment yet.

When selecting to assign to an already declared variable, you also need to select the target variable, which is the node that declares the variable:

![Select Variable to Assign]

#### Value

The variable's value can be of any type, can be constants such as strings, numbers, boolean values, dates, etc., or can be other variables in the process.

In declare mode, setting the variable value is equivalent to assigning an initial value to the variable.

![Declare Initial Value]

In assignment mode, setting the variable value is equivalent to modifying the value of the already declared target variable to a new value. In subsequent use, this new value will be obtained.

![Assign Trigger Variable to Declared Variable]

### Using Variable Values

In nodes subsequent to the variable node, select the declared variable from the "Node Variables" group to use that variable's value. For example, in a query node, use the variable's value as a query condition:

![Use Variable Value as Query Filter Condition]

### Example

A more useful scenario for variable nodes is in some branches, calculating or merging some new values with previous values (similar to `reduce`/`concat` in programming), and then using them after the branch ends. The following uses loop branches and variable nodes to implement an example of concatenating recipient strings.

First, create a data table-triggered workflow that triggers when "Article" data is updated, and preload related "Author" relationship data (for obtaining recipients):

![Configure Trigger]

Then create a variable node to store the recipient string:

![Recipient Variable Node]

Next, create a loop branch node to traverse the article's authors and concatenate their recipients to the recipient variable:

![Loop Through Authors in Article]

In the loop branch, first create a calculation node to concatenate the current author with the already stored author string:

![Concatenate Recipient String]

After the calculation node, create another variable node, select assignment mode, select the recipient variable node as the assignment target, and select the calculation node's result as the value:

![Assign Concatenated Recipient String to Recipient Node]

This way, after the loop branch ends, the recipient variable stores the recipient string of all article authors. Then you can use an HTTP request node after the loop to call the email sending interface, passing the recipient variable's value as the recipient parameter to the interface:

![Send Email to Recipients Through Request Node]

So far, a simple mass email function has been implemented through loop and variable nodes.
