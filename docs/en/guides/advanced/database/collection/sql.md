# SQL Data Table

::: info &#9432; Note
This feature is provided by the module-data-source plugin.
:::

### Introduction
SQL collection extracts data through SQL statements and, after configuring field metadata, enables users to apply it to tables, charts, workflows, and other scenarios just like using regular tables, suitable for relational queries, statistical analysis, and other needs.

### User Manual

#### Create New
![](/datasource/datasource-17.png)
1. After entering an SQL statement in the SQL input box and clicking Execute, the system will parse the SQL statement, identify the tables and fields used, and extract field metadata from the source tables.
![](/datasource/datasource-18.png)
2. If the system's automatic parsing of source tables and fields is incorrect, you can manually specify the corresponding tables and fields to ensure the correct field metadata is used. When operating, you need to first select the source table, and then you can select fields from that table in the field source.
![](/datasource/datasource-19.png)
3. If a field has no corresponding source field, the system will automatically infer the field type based on the data type. If the inference result is inaccurate, users can manually adjust the field type to ensure data is correctly parsed and used.
![](/datasource/datasource-20.png)
4. When configuring fields, the preview area will synchronously display the corresponding display effect, making it convenient for users to visually inspect and adjust field settings.
![](/datasource/datasource-21.png)
5. After configuration is complete and confirmed to be correct, you need to click the Confirm button below the SQL input box to complete the final submission.
![](/datasource/datasource-22.png)
#### Edit

1. When the SQL statement changes, you can click the "Edit" button to directly edit the SQL statement and reconfigure fields.

2. If you need to modify field metadata, you can do so through "Configure fields", similar to field configuration for regular tables.

#### Sync

1. When the SQL statement has not changed but the database table structure has changed, you can sync and configure fields by clicking "Configure fields" - "Sync from database".
![](/datasource/datasource-23.png)

#### SQL Data Table vs Connect Database View

|Data Table Type|Use Case|Implementation Principle|Add/Delete/Modify Support|
|:---------:|:------:|:-------:|:--------:|
|SQL Data Table| Model is relatively simple and suitable for lightweight scenarios; inconvenient to operate database; don't want to maintain; view wishes to be fully operated through user interface (UI)|SQL subquery|Not supported|
|Database View| Database needs to be relatively good and stable; has database interaction needs; data modification needs; model is relatively complex |Database view|Partially supported|

::: warning &#9888; WARNING
When using SQL tables, please select data tables manageable in Tachybase. If you select other tables in the same database that are not connected to Tachybase, it may cause SQL statement parsing to be inaccurate. If you have this need, you can consider creating a view and connecting it.
:::
