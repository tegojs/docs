# Add Record

## Introduction

The add record operation allows users to add records to any data table in the operation.

![20240423202949](/actions/add-record-1.png)

Select the target data table and add a form block.

![20240423203010](/actions/add-record-2.png)

## Use Table Selected Records

Currently only used for the default value of form fields in the "Add Record" operation of table blocks.

Example: The order table and product table have a many-to-many relationship. Configure the "Add Record" operation in the product table block to add data to the order table.

![20240426101803](/actions/add-record-3.png)

Configure the default value of the order table relationship field "Products" as "Table Selected Records".

![20240426101823](/actions/add-record-4.png)

![20240426101922](/actions/add-record-5.png)

<!-- TODO: Insert video or gif -->

## Operation Configuration Items

![20240423203050](/actions/add-record-6.png)

- [Edit Button](/guides/advanced/configuration-interface/actions/action-settings/edit-button)
- [Open Mode](/guides/advanced/configuration-interface/actions/action-settings/open-mode)
- [Popup Size](/guides/advanced/configuration-interface/actions/action-settings/popup-size)
