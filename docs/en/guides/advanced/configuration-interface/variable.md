# Variables

## Introduction
Variables are a set of markers used to identify a certain value in the current context. They can be used in scenarios such as configuring block data scope, field default values, linkage rules, workflows, etc.

![2024-09-25_20-08-38-2024-09-25-20-11-51](/variables-1.png)

## Currently Supported Variables

### Current User

Represents the data of the currently logged-in user.

![20240416154950](/variables-2.png)

### Current Role

Represents the role identifier (role name) of the currently logged-in user.

![20240416155100](/variables-3.png)

### Current Form

The value of the current form, only used for form blocks. Usage scenarios include:

- Linkage rules for current form
- Form field default values (only valid when adding data)
- Data scope settings for relationship fields
- Field assignment configuration for submit operations

#### Linkage Rules for Current Form

![20240416170732_rec_](/variables-4.gif)

#### Form Field Default Values (only valid when adding data)

![20240416171129_rec_](/variables-5.gif)

#### Data Scope Settings for Relationship Fields

Used to handle linkage between relationships, for example:

![20240416171743_rec_](/variables-6.gif)

#### Field Assignment Configuration for Submit Operations

![20240416171215_rec_](/variables-7.gif)

### Current Object

Currently only used for field configuration of sub-forms and sub-tables in form blocks, representing the value of each item:

- Default values for sub-fields
- Data scope for sub-relationship fields

#### Default Values for Sub-fields

![20240416172933_rec_](/variables-8.gif)

#### Data Scope for Sub-relationship Fields

![20240416173043_rec_](/variables-9.gif)

<!-- ### Parent Object -->
<!-- This should not exist in tachybase -->

### Current Record

A record refers to a row in a data table, with each row representing a record. There is a "Current Record" variable in **linkage rules for row operations** in display-type blocks.

#### Linkage Rules for Row Operations

![20240416174813_rec_](/variables-10.gif)

<!-- ### Current Modal Record
tachybase has not implemented modal logic -->

### Date Variables

Related variables include:

- Current time
- Yesterday
- Today
- Tomorrow
- Last week
- This week
- Next week
- Last month
- This month
- Next month
- Last quarter
- This quarter
- Next quarter
- Last year
- This year
- Next year
- Last 7 days
- Next 7 days
- Last 30 days
- Next 30 days
- Last 90 days
- Next 90 days

<br />

:::warning
Except for current time (Current time) which is a moment (string), other date variables are time periods (arrays). Currently, time periods can only be used in data scope, not in field default values.
:::

Related usage scenarios include:

- Date field condition settings for block data scope
- Date field condition settings for relationship field data scope
- Date field condition settings for operation linkage rules
- Date field default value settings

<!-- tachybase not implemented -->
<!-- ### URL Query Parameters -->
<!-- 
This variable represents the query parameters in the current page URL. This variable is only available when there is a query string in the page URL. It is more convenient to use together with [Link Operation]().


### API token

The value of this variable is a string, which is a credential for accessing the NocoBase API. It can be used to verify the user's identity. -->
