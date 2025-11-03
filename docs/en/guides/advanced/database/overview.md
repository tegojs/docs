# Overview
Data modeling is a core component of data management and system design. Through structured data processing, it not only optimizes system performance and improves maintainability, but also promotes seamless integration between different systems, providing a solid foundation for data management and system design. The **Tachybase** platform is built on this advanced data model and has the following unique features:

---

### Multi-Source Data Integration Support
The Tachybase platform's data sources support various types of databases, files, or external data sources.

![](/datasource.png)

Tachybase provides a [Data Source Management Plugin](./datasource/data-source-management.md) for managing different data sources and their data tables. This plugin only provides a unified management interface and does not have the capability to directly connect to data sources, so it needs to be used in conjunction with corresponding data source plugins. Currently supported data sources include:

- **[Main Database](./datasource/data-source-main.md)**: Tachybase's main database, supports multiple relational databases such as MySQL, PostgreSQL, SQLite, etc.
- **External Databases:**
  - **MySQL**: Data source can use external MySQL database.
  - **MariaDB**: Data source can use external MariaDB database.
  - **PostgreSQL**: Data source can use external PostgreSQL database.

![](/REST_API.png)

### Support for Diverse Data Modeling
Supports concise data table management interface: Used to create various data tables or connect to existing data tables.
![](/datasource_table.png)
Supports [ER-like diagram](./datasource/tool.md) visual interface: Helps users extract relevant entities and their relationships from business requirements. This approach can more intuitively reflect the entities and business relationships of the data model.

<!-- TODO: Insert image -->

### Support for Various Data Tables
| Data Table | Description                     |
|:-------:|------------------------|
| [General Table](./collection/general-collection.md) | Standard common field settings        |
| [Comment Table](./collection/) | Stores user feedback and comments on content |
| [Tree Structure Table](./collection/collection-tree.md) | Data structure for representing hierarchical relationships, such as directories or categories |
| [Expression Table](./collection/workflow-dynamic-calculation.md) | Used to express dynamic workflow scenarios |
| [Calendar Data Table](./collection/calendar-collection.md) | Used to store date and time-related event information |
| [File Data Table](./collection/file-collection.md) | Used to manage file metadata, such as file name, path, and size |
| [Inheritance Table](./collection/inheritance-collection.md) | Create a parent table, then derive child tables from the parent table |
| [SQL Data Table](./collection/sql.md) | Used to store data obtained through SQL queries |
| [External Data Table (FDW)](./collection/collection-fdw.md) | Used to connect to remote data tables |
| [Connect Database View](./collection/collection-view.md) | Used to provide data views and integration between different data models |

![](../../../../public/datasource_createtable.png)
For more content, see the「[Data Tables / Overview](./collection/overview.md)」section

### Support for Various Data Field Types
![](../../../../public/datasource_fields.png)
For more content, see the「[Data Table Fields / Overview](./field/overview.md)」section
