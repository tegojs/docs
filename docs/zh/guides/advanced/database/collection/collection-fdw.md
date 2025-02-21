# 连接外部数据表（FDW）

::: info &#9432; 提示
该功能由插件 module-data-source 提供。
:::

### 介绍
该插件基于数据库的外部数据包装器（Foreign Data Wrapper）实现了连接远程数据表的功能。目前支持 MySQL 和 PostgreSQL 数据库。

::: info 外部数据源VS外部数据表
- “连接数据源”是指与特定数据库或 API 服务建立连接，以完整使用数据库的特性或 API 提供的服务；
- “连接外部数据表”则是从外部获取数据并将其映射到本地使用，这在数据库中称为 FDW（Foreign Data Wrapper），是一种数据库技术，主要用于将远程表视作本地表进行操作，但只能逐一连接表。由于是远程访问，因此在使用时会面临各种约束和限制。

这两者也可以结合使用，前者用于建立与数据源的连接，后者用于跨数据源访问。例如，连接某个 PostgreSQL 数据源时，该数据源中可能包含一个基于 FDW 创建的外部数据表。
:::

#### MySQL
MySQL 通过引擎**Federated Engine**实现远程连接功能，需要先进行激活。该引擎支持连接远程 MySQL 数据库及其协议兼容的数据库，如 MariaDB。详细信息请参考[Federated Storage Engine文档](https://dev.mysql.com/doc/refman/8.0/en/federated-storage-engine.html)。

#### PostgreSQL
在 PostgreSQL 中，可以通过不同类型的**FDW**扩展支持多种远程数据类型。目前支持的扩展包括：

- [postgres_fdw](https://www.postgresql.org/docs/current/postgres-fdw.html)：用于在 PostgreSQL 中连接远程 PostgreSQL 数据库。
- [mysql_fdw（开发中）](https://github.com/EnterpriseDB/mysql_fdw)：用于在 PostgreSQL 中连接远程 MySQL 数据库。
其他类型的 FDW 扩展可以参考[PostgreSQL Foreign Data Wrappers](https://wiki.postgresql.org/wiki/Foreign_data_wrappers)。要接入灵矶，需要在代码中实现相应的适配接口。

### 安装
**前提条件**
<!--TODO: 添加链接-->
如果灵矶的主数据库是**MySQL**，则需要激活**federated**。请参考[如何启用 MySQL federated]()进行操作。接着，通过插件管理器安装并激活相关插件。
<!--TODO: 添加图片-->

### 使用手册
在「数据表管理 > 创建数据表」 下拉中，选择「连接外部数据」。
<!--TODO: 添加图片-->
在「数据库服务」下拉选项中，选择已存在的数据库服务，或者「创建数据库服务」。
<!--TODO: 添加图片-->
创建数据库服务。
<!--TODO: 添加图片-->
选择数据库服务之后， 在「远程表」的下拉选项中，选择需要连接的数据表。
<!--TODO: 添加图片-->
配置字段信息
<!--TODO: 添加图片-->
如果远程表有结构变化，也可以「从远程表同步」。
<!--TODO: 添加图片-->
远程表同步
<!--TODO: 添加图片-->
最后，在界面里显示。

