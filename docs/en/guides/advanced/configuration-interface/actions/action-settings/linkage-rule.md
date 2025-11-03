# Operation Linkage Rules

## Introduction

Operation linkage rules configure conditions and execution results based on context data. By configuring operation linkage rules, control the operation's status (display, hide, enable, disable).

![20240423113057](/actions/linkage-rule.png)

## Usage Instructions

![20240413102150](/actions/linkage-rule-1.png)

When conditions are met (no conditions default to pass), trigger execution. Supports using constants/variables in condition judgment.

### Which buttons can configure linkage rules

Currently only buttons with data context support configuring linkage rules.

Row buttons of blocks like tables, Gantt charts, etc.;

Buttons of details blocks;


### Constants

Example: Hide view button for disabled users

![20240423113212](/actions/linkage-rule-2.png)

### Variables

Example: Disable delete button for orders with delivery date later than today.

![20240423113504](/actions/linkage-rule-3.png)

<!-- TODO: Insert variable link -->
For more about variables, refer to [Variables]
