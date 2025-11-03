# Set Data Scope

## Introduction

Data scope setting for relationship fields is similar to data scope setting for blocks, setting default filter conditions for relationship data.

## Usage Instructions

![20240422153711](/field/field-settings/data-scope-1.png)

### Static Values

Example: Only on-sale products can be selected for association.

![20240422155953](/field/field-settings/data-scope-2.png)

### Variable Values

Example: Only products with production date earlier than last month can be selected for association.

![20240422163640](/field/field-settings/data-scope-3.png)

For more about variables, refer to [Variables](../../variable.md)

### Relationship Field Linkage

Relationship fields achieve linkage through setting data scope.

Example: The order table has many-to-many relationship field "Products" and many-to-one relationship field "Customer". The products table has many-to-many relationship field "Customers". In the order form block, the selectable data for products is products associated with the customer selected in the current form.

![20240422163640](/field/field-settings/data-scope-4.png)
