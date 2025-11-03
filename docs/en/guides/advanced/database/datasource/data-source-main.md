# Main Database

::: info &#9432; Note
This feature is provided by the module-collection plugin.
:::

### Introduction
Tachybase's main database is responsible for storing business data and is also used to manage application metadata, such as system tables and custom tables. Tachybase simultaneously supports mainstream relational databases such as MySQL, PostgreSQL, SQLite, etc., and is deployed together with Tachybase installation and cannot be removed.

### Installation
Built-in plugin, no separate installation required

### Data Table Management
![](/datasource/data-source-2.png)

#### Support for Various Data Tables
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

#### Support for Data Table Category Management
![](/datasource/data-source-3.png)

#### Support for Various Field Types
![](/datasource/data-source-4.png)
For more content, see the「[Data Table Fields / Overview](./field/overview.md)」section
