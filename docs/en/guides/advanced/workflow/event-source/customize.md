# Custom Resource Operations


Custom resources can have custom interface names for monitoring resources, which can be invoked through custom requests from elsewhere, making it more convenient for users to monitor and process customized business.

## Create Event Source

Configuration items:

- Name: Event source name.
- Workflow: Workflow to be triggered for execution.
- Type: Custom resource operation.
- Options:
    - Resource Name: Resource to be monitored.
    - Action Name: Specified name to be requested


After triggering, these associated data can be used directly in the process.
