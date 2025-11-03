# Overview

Tachybase uses a proprietary Domain-Specific Language called **collections** to uniformly describe data structures from various sources, making data management, analysis, and application more intuitive and convenient.
![](../../../../../public/fields.png)

To quickly create various data models, different types of data tables have been designed to support:

- [General Table](./collection/general-collection.md): Standard common field settings;
- [Comment Table](./collection/): Stores user feedback and comments on content;
- [Tree Structure Table](./collection/collection-tree.md): Data structure for representing hierarchical relationships, such as directories or categories;
- [Expression Table](./collection/workflow-dynamic-calculation.md): Used to express dynamic workflow scenarios;
- [Calendar Data Table](./collection/calendar-collection.md): Used to store date and time-related event information;
- [File Data Table](./collection/file-collection.md): Used to manage file metadata, such as file name, path, and size;
- [Inheritance Table](./collection/inheritance-collection.md): Create a parent table, then derive child tables from the parent table;
- [SQL Data Table](./collection/sql.md): Used to store data obtained through SQL queries;
- [External Data Table (FDW)](./collection/collection-fdw.md): Used to connect to remote data tables;
- [Connect Database View](./collection/collection-view.md): Used to provide data views and integration between different data models;
