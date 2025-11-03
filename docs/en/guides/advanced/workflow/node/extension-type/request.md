# HTTP Request

<PluginInfo name="workflow-request" link="/handbook/workflow-request"></PluginInfo>

When you need to interact with another web system, you can use the HTTP request node. When this node executes, it will send an HTTP request to the corresponding address according to the configuration, can carry data in JSON or `application/x-www-form-urlencoded` format, and complete data interaction with external systems.

If you are familiar with request sending tools like Postman, you can quickly master the usage of HTTP request nodes. Different from these tools, various parameters in HTTP request nodes can use context variables from the current process and can be organically combined with the business processing of the current system.

## Installation

Built-in plugin, no installation required.

## User Manual

### Create Node

In the workflow configuration interface, click the plus ("+") button in the process to add an "HTTP Request" node:

![HTTP Request_Add]
<!-- TODO: Insert image -->

### Node Configuration

![HTTP Request Node_Node Configuration]
<!-- TODO: Insert image -->

#### Request Method

Optional HTTP request methods: `GET`, `POST`, `PUT`, `PATCH`, and `DELETE`.

#### Request URL

The URL of the HTTP service, needs to include the protocol part (`http://` or `https://`), `https://` is recommended.

#### Request Data Format

That is, `Content-Type` in the request header, supports two formats: `application/json` and `application/x-www-form-urlencoded`.

#### Request Header Configuration

Key-value pairs in the request Header part. Related values can use context variables from the process.

:::info{title=Note}
For the `Content-Type` request header, it is already configured through the request data format and does not need to be filled in. Overriding is invalid.
:::

#### Request Parameters

Key-value pairs in the request query part. Related values can use context variables from the process.

#### Request Body

The Body part of the request. Currently only supports standard JSON format. You can insert variables from the process context through the variable button in the upper right corner of the text edit box.

:::info{title=Note}
Note: Variables must be used in JSON strings, for example: `"a": "{{$context.data.a}}"`.
:::

#### Timeout Setting

When a request does not respond for a long time, cancel the execution of the request through timeout setting. After the request times out, the current process will terminate early with a failed status.

#### Ignore Failure

The request node will consider status codes between `200`~`299` (inclusive) of standard HTTP status codes as success status. All others are considered failures. If the "Ignore failed requests and continue workflow" option is checked, then the process will continue to execute other subsequent process nodes after the request fails.

### Using Response Results

HTTP request response results can be parsed through the [JSON Parse] node for use by subsequent nodes.

Starting from version `v1.0.0-alpha.16`, three parts of the response result in the request node can be used separately as variables:

* Response status code
* Response headers
* Response data

![HTTP Request Node_Response Result Usage]
<!-- TODO: Insert image -->

Among them, the response status code is usually a numeric standard HTTP status code, such as `200`, `403`, etc. (specifically provided by the service provider).

Response headers are in JSON format, including JSON format response data, which still needs to be parsed using JSON node before use.

### Example

For example, we can use request nodes to interface with cloud platforms to send notification SMS. Taking the Alibaba Cloud SMS sending interface as an example, the configuration is as follows (related parameters need to be adapted by referring to the documentation yourself):

![HTTP Request Node_Node Configuration]
<!-- TODO: Insert image -->

When the workflow triggers this node for execution, it will call Alibaba Cloud's SMS interface with the configured content. If the request is successful, an SMS will be sent through the SMS cloud service.
