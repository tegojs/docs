# Data Source Management

::: info &#9432; Note
This feature is provided by the module-data-source plugin.
:::

### Introduction
Tachybase provides a data source management plugin for managing data sources and their data tables. This plugin is primarily responsible for providing a management interface for data sources, while the data source integration capability needs to be used in conjunction with various data source plugins. Currently supported data sources include:

- **[Main Database](./datasource/data-source-main.md)**: Tachybase's main database, supports multiple relational databases such as MySQL, PostgreSQL, SQLite, etc.
- **External Databases:**
  - **MySQL**: Data source can use external MySQL database.
  - **MariaDB**: Data source can use external MariaDB database.
  - **PostgreSQL**: Data source can use external PostgreSQL database.

In addition, Tachybase also supports extending more types of data sources through plugins, including various types of databases and platforms that provide APIs (SDKs).

### Installation
Built-in plugin, no separate installation required

### Usage Instructions
When the application is initialized and installed, a data source for storing Tachybase data is provided by default, called the [Main Data Source](./data-source-main.md).
![](/datasource/data-source-1.png)
