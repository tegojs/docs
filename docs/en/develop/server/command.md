# Command Line

In plugins, custom commands must be placed in the plugin's `packages/server/commands/*.ts` directory, with the following content:

```ts
import { Application } from '@tachybase/server';

export default function(app: Application) {
  app
    .command('echo')
    .option('-v, --version')
    .action(async ([options]) => {
      console.log('Hello World!');
      if (options.version) {
        console.log('Current version:', await app.version.get());
      }
    });
}
```

:::warning
Plugin custom commands only take effect after the plugin is installed and activated
:::

Special Command configuration

- `ipc()` When the app is running, the command line sends instructions via ipc to operate the running app instance. Without ipc() configuration, a new application instance will be created and operations will be executed (without interfering with the running app instance)
- `auth()` Performs database verification. If the database configuration is incorrect, the command will not be executed
- `preload()` Whether to preload the application configuration, i.e., execute app.load()

You can configure based on the actual purpose of the command, examples:

```ts
app.command('a').ipc().action()
app.command('a').auth().action()
app.command('a').preload().action()
```
