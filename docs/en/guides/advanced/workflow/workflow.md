# Workflow

## Introduction

The workflow plugin is a powerful tool for orchestrating and configuring automated processes, commonly known in the industry as Business Process Management (BPM) tools. It is commonly used for business process design and orchestration based on data models, achieving automated circulation of business processes through trigger conditions and execution process node orchestration.

In tachybase applications, the workflow plugin is designed for no-code scenarios. Using this plugin, most common business orchestration and data processing can be completed on the UI interface to dynamically implement business process changes in the system.

Each workflow is orchestrated through a trigger and several nodes. Through the specific functions of each node, it describes the business logic that needs to be processed after the corresponding event occurs in the system.

The above workflow's function is: when a user submits an order form, the system automatically checks the product inventory in the order. If the inventory is sufficient, it deducts the inventory; otherwise, the order is updated as invalid.

From a more general perspective, workflows in tachybase applications can solve problems in several major scenarios:

- Automated data processing: For example, after adding a new record in a data table, automatically process the data according to a predetermined process, such as calculating triggered data and then updating associated data, etc.
- Business processes involving manual intervention: When business processes cannot be fully automated for decision-making, manual-type nodes can be used to hand over some decision-making power to manual processing, such as approval, review, etc. After the manual processing results are submitted, the subsequent process continues.
- Connection with external systems: Request nodes (or extend various nodes that call third-party functions) can be used to call external system API interfaces to achieve data interaction with external systems.

## Installation

Workflow is a built-in plugin of tachybase and requires no additional installation.
