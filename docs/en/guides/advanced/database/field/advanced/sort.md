# Sort Field

### Introduction

The **Sort Field** is used to sort records in a data table and supports grouping first, then sorting (like sort1).

::: warning &#9888; WARNING
Since the sort field belongs to the same table, in grouped sorting, the same record cannot be assigned to multiple groups simultaneously.
:::

### Interface Configuration

When creating a sort field, the system will initialize the sort values:

- If grouping is not enabled, sort values will be initialized based on the primary key field and creation date field.
- If grouping is enabled, the system will first group the data, then initialize sort values based on the primary key field and creation date field.

::: warning &#9888; WARNING
Transaction consistency notes:

- When creating a field, if sort value initialization fails, the sort field will not be created.
- When a record moves from position A to position B within a specified range, the sort values of all records in the A to B interval will be updated. If the sort value update of any record fails, the entire move operation will fail, and the sort values of related records will not be updated.

:::

#### Create sort_1 field
<!-- TODO: Insert image -->

sort field without grouping

![](../../../../../../public/sort1.png)

The sort field for each record will be initialized based on the primary key field and creation date field:

<!-- TODO: Insert image -->

#### Create a sort_2 field grouped by Class ID

<!-- TODO: Insert image -->

At this time, all records in the data table will be grouped first (by Class ID), then sorted by sort field (sort_2):

<!-- TODO: Insert image -->

#### Drag and Drop Sorting

The sort field is mainly used for drag and drop sorting of block records. Currently supported drag and drop sorting blocks include tables and kanban.

::: warning &#9888; WARNING

1. Using the same sort field in multiple blocks may affect existing sorting rules.
2. When dragging and dropping in tables, you cannot select a sort field with grouping rules.
3. Exception: In one-to-many relationship table blocks, the foreign key field can be used as a grouping field.
4. Currently, only kanban blocks support drag and drop operations for grouped sorting.

:::

##### Drag and Drop Sorting of Table Rows

Table block

<!-- TODO: Insert image -->

Relationship table block

<!-- TODO: Insert video -->

::: warning &#9888; WARNING

Sorting rules for one-to-many relationship blocks

- If the selected sort field is ungrouped, all records may participate in sorting.
- If grouping is based on foreign key, the sorting rule will only affect data within the current group.

Although the final sorting result is the same, the number of records participating in sorting may be different.

:::

##### Kanban Block Drag and Drop Sorting

<!-- TODO: Insert image -->

#### Sorting Rules Explanation

Movement between ungrouped (or same group) elements
Suppose there is a dataset:

`[1, 2, 3, 4, 5, 6, 7, 8, 9]`

When element 7 moves forward to position 4, only the sequence numbers of 4, 5, 6, 7 will change. 7 takes position 4, and 4, 5, 6 each move back one position.

`[1, 2, 3, 7, 4, 5, 6, 8, 9]`

Then, continue moving 8 backward to position 6. 8 takes position 6, and 5 and 6 each move forward one position.

`[1, 2, 3, 7, 4, 5, 8, 6, 9]`

Movement of elements between different groups
In grouped sorting, if a record moves to another group, its group will also change. For example:

```
Group A: [1, 2, 3, 4]
Group B: [5, 6, 7, 8]
```

When 3 moves to position 6 (assuming it defaults to the end), 3's group changes from A to B:

```
Group A: [1, 2, 4]
Group B: [5, 6, 3, 7, 8]
```

Sort changes and displayed interface data
For example, suppose there is a dataset:

`[1, 2, 3, 4, 5, 6, 7, 8, 9]`

But the interface only displays:

`[2, 6, 9]`

When 2 moves to position 9, although the positions of the intermediate data (3, 4, 5, 6, 7, 8) change, the interface still displays:

`[6, 9, 2]`
