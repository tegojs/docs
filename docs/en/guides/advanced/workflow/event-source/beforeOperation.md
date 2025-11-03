# Pre-Resource Operation Events

Pre-resource operation events monitor specified data tables before operations such as adding, deleting, and modifying data are performed, and trigger specified workflows, such as before form addition, before form modification, etc.

## Create Event Source

Configuration items:

- Name: Event source name.
- Workflow: Workflow to be triggered for execution.
- Type: Pre-resource operation event.
- Options:
    - Resource Name: Resource to be monitored.
    - Action Name: Specified operation to monitor


After triggering, these associated data can be used directly in the process.
