# Many-to-Many

### Introduction

### Field Configuration

![](../../../../../../public/m2m1.png)

### Interface Configuration

### Usage Parameters

**Source Collection**
Source table, refers to the table where the current field is located.

**Target Collection**
Target table, refers to the table that is associated with the current table.

**Through Collection**
Intermediate table, used to store many-to-many relationships between two entities. The intermediate table typically has two foreign keys, representing the associations between the two entities.

**Source Key**
Field referenced by the foreign key constraint, must be unique.

**Foreign Key 1**
Field in the intermediate table, used to establish association with the source table.

**Foreign Key 2**
Field in the intermediate table, used to establish association with the target table.

**Target Key**
Field referenced by the foreign key constraint, must be unique.

**ON DELETE**
ON DELETE is used to define the operation rules for foreign key references in child tables when deleting parent table records. Common ON DELETE options include:

- **CASCADE**: When deleting a parent table record, automatically delete all associated child table records.
- **SET NULL**: When deleting a parent table record, set the associated foreign key values in the child table to NULL.
- **RESTRICT**: Default option, prohibits deletion of parent table records if associated child table records exist.
- **NO ACTION**: Similar to RESTRICT, prohibits deletion of parent table records if associated child table records exist.
