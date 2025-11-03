# Logger

## Introduction

Logs are an important tool to help us locate system issues. Tachybase's server-side logs mainly include API request logs and system runtime logs, supporting configuration of log levels, rolling strategies, size, print format, etc. This documentation mainly introduces the relevant content of Tachybase server-side logs and how to use the server-side log packaging and downloading functionality provided by the logger plugin.

## Log Configuration

You can configure log-related parameters such as log level, output method, and print format through [Environment Variables].

## Log Formats

Tachybase supports 4 different log formats.

### `console`

Default format for development environment, messages are displayed with highlighted colors.

```
2023-12-30 22:40:06 [info ] response                                     method=GET path=/api/uiSchemas:getJsonSchema/tachybase-admin-menu res={"status":200} action={"actionName":"getJsonSchema","resourceName":"uiSchemas","params":{"filterByTk":"tachybase-admin-menu","resourceName":"uiSchemas","resourceIndex":"tachybase-admin-menu","actionName":"getJsonSchema"}} userId=1 status=200 cost=5 app=main reqId=ccf4e3bd-beb0-4350-af6e-b1fc1d9b6c3f
2023-12-30 22:43:12 [debug] Database dialect: mysql                      module=application method=install app=main reqId=31ffa8b5-f377-456b-a295-0c8a28938228
2023-12-30 22:43:12 [warn ] app is installed                             module=application method=install app=main reqId=31ffa8b5-f377-456b-a295-0c8a28938228
```

### `json`

Default format for production environment.

```json
{
  "level": "info",
  "timestamp": "2023-12-26 22:04:56",
  "reqId": "7612ef42-58e8-4c35-bac2-2e6c9d8ec96e",
  "message": "response",
  "method": "POST",
  "path": "/api/authenticators:publicList",
  "res": { "status": 200 },
  "action": {
    "actionName": "publicList",
    "resourceName": "authenticators",
    "params": { "resourceName": "authenticators", "actionName": "publicList" }
  },
  "status": 200,
  "cost": 16
}
```

### `logfmt`

> https://brandur.org/logfmt.

```
level=info timestamp=2023-12-21 14:18:02 reqId=8b59a40d-68ee-4c97-8001-71a47a92805a
message=response method=POST path=/api/authenticators:publicList res={"status":200}
action={"actionName":"publicList","resourceName":"authenticators","params":{"resourceName":"authenticators","actionName":"publicList"}}
userId=undefined status=200 cost=14
```

### `delimiter`

Separated by delimiter `|`.

```
info|2023-12-26 22:07:09|13cd16f0-1568-418d-ac37-6771ee650e14|response|POST|/api/authenticators:publicList|{"status":200}|{"actionName":"publicList","resourceName":"authenticators","params":{"resourceName":"authenticators","actionName":"publicList"}}||200|25
```

## Log Directory

The main directory structure of Tachybase log files is:

- `storage/logs` - Log output directory
  - `main` - Main application name
    - `request_YYYY-MM-DD.log` - Request logs
    - `system_YYYY-MM-DD.log` - System logs
    - `system_error_YYYY-MM-DD.log` - System error logs
    - `sql_YYYY-MM-DD.log` - SQL execution logs
    - ...
  - `sub-app` - Sub-application name
    - `request_YYYY-MM-DD.log`
    - ...

## Log Files

### Request Logs

`request_YYYY-MM-DD.log`, API request and response logs.

| Field         | Description                        |
| ------------- | ---------------------------------- |
| `level`       | Log level                          |
| `timestamp`   | Log print time `YYYY-MM-DD hh:mm:ss` |
| `message`     | `request` or `response`            |
| `userId`      | Only in `response`                 |
| `method`      | Request method                     |
| `path`        | Request path                       |
| `req` / `res` | Request/response content           |
| `action`      | Request resource and parameters    |
| `status`      | Response status code               |
| `cost`        | Request duration                   |
| `app`         | Current application name           |
| `reqId`       | Request ID                         |

:::info{title=Note}
`reqId` is sent to the frontend via the `X-Request-Id` response header.
:::

### System Logs

`system_YYYY-MM-DD.log`, application, middleware, plugin and other system runtime logs. `error` level logs are printed separately to `system_error_YYYY-MM-DD.log`

| Field       | Description                        |
| ----------- | ---------------------------------- |
| `level`     | Log level                          |
| `timestamp` | Log print time `YYYY-MM-DD hh:mm:ss` |
| `message`   | Log message                        |
| `module`    | Module                             |
| `submodule` | Submodule                          |
| `method`    | Called method                      |
| `meta`      | Other related information, JSON format |
| `app`       | Current application name           |
| `reqId`     | Request ID                         |

### SQL Execution Logs

`sql_YYYY-MM-DD.log`, database SQL execution logs. `INSERT INTO` statements only retain the first 2000 characters.

| Field       | Description                        |
| ----------- | ---------------------------------- |
| `level`     | Log level                          |
| `timestamp` | Log print time `YYYY-MM-DD hh:mm:ss` |
| `sql`       | SQL statement                      |
| `app`       | Current application name           |
| `reqId`     | Request ID                         |

## Log Package Download


1. Enter the log management page.
2. Select the log files you want to download.
3. Click the Download button.
