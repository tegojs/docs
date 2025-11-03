# Custom Request

> ℹ️ **Note**  
> Provided by the `plugin-action-custom-request` plugin

## Introduction

## Installation

Built-in plugin, no separate installation required

## Usage Instructions

![20240426120014](/actions/custom-request-1.png)

### Configure Permissions

When "Allow configuration interface" is checked, custom requests can be configured.

![20240426114957](/actions/custom-request-2.png)

The customRequests table is system-level, with permissions configured through acl.registerSnippet.

```typescript
this.app.acl.registerSnippet({
  name: 'ui.customRequests', // ui.* corresponds to allow configuration interface permissions
  actions: ['customRequests:*'],
});
```
### Variables

Supports configuring variables in URL and request body.

- Current record
- Current user
- Current time
- API token (supported in v1.3.22-beta and above)

![20240426120953](/actions/custom-request-3.png)

![20240426121051](/actions/custom-request-4.png)

## Operation Configuration Items

### Request Settings

![20240426120131](/actions/custom-request-5.png)

### Permission Control

Each custom request operation supports custom role permissions, with permissions by default.

![20240426120451](/actions/custom-request-6.png)
