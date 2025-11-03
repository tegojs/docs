# Local Storage

Uploaded files will be saved in the server's local hard disk directory, suitable for scenarios where the total amount of uploaded files managed by the system is small or for experimental purposes.

## Configuration Parameters
![](/core/storage-1.png)

:::info{title=Note}
Only the dedicated parameters for the local storage engine are introduced here. For common parameters, please refer to [Engine Common Parameters](./index.md#engine-common-parameters).
:::

### Path

Represents both the relative path where files are stored on the server and the URL access path. For example: "`user/avatar`" (no leading or trailing "`/`" needed), which represents:

1. The relative path where files are stored on the server when uploading: `/path/to/tachybase-app/storage/uploads/user/avatar`.
2. The URL address prefix when accessing: ``.
