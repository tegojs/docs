# Inheritance Structure Table

::: info &#9432; Note
This feature is provided by the module-data-source plugin.
:::

### Introduction
::: warning &#9888; WARNING
Only supported when main database is PostgreSQL
:::

In database design, you can create a parent table and derive multiple child tables based on its structure. Child tables inherit the fields from the parent table and can define additional columns to meet specific needs. This inheritance pattern helps organize and manage data with similar structures but with differences.

**Main features of inheritance tables:**
- **Parent Table**: Defines common fields, providing a unified data structure.
- **Child Tables**: Inherit fields from the parent table while supporting additional columns to meet personalized needs.
- **Flexible Queries**: Supports querying the entire inheritance hierarchy, or only the parent table or specific child tables.
- **Reduced Redundancy**: Through the inheritance mechanism, avoids duplicate fields, improving data consistency and maintainability.

While inheritance tables can optimize data organization, they may increase query complexity, especially when querying cross-hierarchy data. Therefore, when using them, you need to consider database characteristics and balance performance with maintainability.

### User Manual
![](/datasource/datasource-6.png)
