# Connect Data Block

## Introduction

Connecting data blocks is used to implement filter linkage between blocks. The core is to connect two tables, one as the source table (main table) and the other as the target table (foreign key table), implementing data filter linkage. The available options for connecting blocks are **same-table data blocks or blocks from different tables with relationship foreign key constraints or inheritance relationships** on the current page (or current modal). Multiple blocks can be connected simultaneously. Regardless of which method, the essence is that the source table (actively connecting table) provides filter parameters to the target table (connected table).

## User Manual

### Filter Block Connects Data Block


### Data Block Connects Data Block

#### Same Data Table Data Block Linkage

Example: Order table block and order details block implement linkage.

#### Relationship Data Table Block Linkage (different table blocks with relationship foreign key constraints)

Example: The order table and customer table have a many-to-one relationship. Customer table block and order table block implement filter linkage, querying order data under a specified customer.
