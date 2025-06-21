# 数据源管理

::: info &#9432; 提示
该功能由插件 module-data-source 提供。
:::

### 介绍
灵矶提供了数据源管理插件，用于管理数据源及其数据表。该插件主要负责提供数据源的管理界面，而数据源的接入能力则需要与各类数据源插件配合使用。目前支持接入的数据源包括：

- **[主数据库](./datasource/data-source-main.md)**：灵矶的主数据库，支持 MySQL、PostgreSQL、SQLite 等多种关系型数据库。
- **外部数据库:**
  - **MySQL**：数据源可使用外部 MySQL 数据库。
  - **MariaDB**：数据源可使用外部 MariaDB 数据库。
  - **PostgreSQL**：数据源可使用外部 PostgreSQL 数据库。

此外，灵矶也支持通过插件扩展更多类型的数据源，包括各种类型的数据库，以及提供API(SDK)的平台。

### 安装
内置插件， 无需单独安装

### 使用说明
应用初始化安装时，会默认提供一个用于存储灵矶数据的数据源，称为[主数据源](./data-source-main.md)。
![](/datasource/data-source-1.png)
