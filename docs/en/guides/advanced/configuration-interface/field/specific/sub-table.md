# Sub-table

### Overview

Sub-table is suitable for handling to-many relationship fields, supporting batch creation of target table data and then associating, or selecting from existing data for association.

### Usage Instructions

![](/sub-table1.png)

- Field Display and Edit
In sub-tables, different types of fields display different field components. For large fields (such as rich text, Json, multi-line text, etc.), editing will be done through hover popup.

![](/sub-table2.png)

- Relationship Fields
Example: User (one-to-many) > Product (one-to-many) > Category.

![](/field/field-8.png)

- Field Component
Relationship field component defaults to dropdown selector, but also supports other components such as data picker or sub-form (popover).
![](/field/field-9.png)

- Drag and Drop Sorting
Supports drag and drop sorting of data within sub-table.
![](/field/field-10.gif)

### Field Configuration Items

#### Allow Select Existing Data (not enabled by default)
Can select and associate data from existing data.

![](/field/field-11.png)

#### Field Component
Supports switching to other relationship [Field Components](../field-settings/field-component.md), such as dropdown select, data picker, etc.

<!-- #### Linkage Rules -->

<!-- TODO: Insert video -->

<!-- Suitable for setting linkage between fields.
For more content, refer to [Linkage Rules](../../block/block-settings/linkage-rule.md). -->

<!-- #### Allow Disassociate Existing Data Association -->

<!-- TODO: Insert video -->

<!-- Supports disassociating from already associated data. -->
