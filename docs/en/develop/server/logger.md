# Logger

Tachybase logging is based on <a href="https://github.com/winstonjs/winston" target="_blank">Winston</a> encapsulation. By default, Tachybase divides logs into API request logs, system runtime logs, and SQL execution logs. API request logs and SQL execution logs are printed by the application internally. Plugin developers typically only need to print system runtime logs related to their plugins.

This documentation mainly introduces how to create and print logs when developing plugins.

## Default Print Methods

Tachybase provides print methods for system runtime logs. Logs are printed according to specified fields and simultaneously output to specified files.

```ts
// Default print method
app.log.info("message");

// Use in middleware
async function (ctx, next) {
  ctx.log.info("message");
}

// Use in plugins
class CustomPlugin extends Plugin {
  async load() {
    this.log.info("message");
  }
}
```

The above methods all follow the usage below:

The first parameter is the log message, and the second parameter is an optional metadata object, which can be any key-value pair. Among them, `module`, `submodule`, and `method` will be extracted as separate fields, and the remaining fields will be placed in the `meta` field.

```ts
app.log.info('message', {
  module: 'module',
  submodule: 'submodule',
  method: 'method',
  key1: 'value1',
  key2: 'value2',
});
// => level=info timestamp=2023-12-27 10:30:23 message=message module=module submodule=submodule method=method meta={"key1": "value1", "key2": "value2"}

app.log.debug();
app.log.warn();
app.log.error();
```

## Output to Other Files

If you want to use the system's default print method but don't want to output to the default file, you can use `createSystemLogger` to create a custom system log instance.

```ts
import { createSystemLogger } from '@tachybase/logger';

const logger = createSystemLogger({
  dirname: '/pathto/',
  filename: 'xxx',
  seperateError: true, // Whether to output error level logs separately to 'xxx_error.log'
});
```

## Custom Logger

If you don't want to use the system's provided print methods and want to use Winston's native methods, you can create logs through the following methods.

### `createLogger`

```ts
import { createLogger } from '@tachybase/logger';

const logger = createLogger({
  // options
});
```

`options` extends the original `winston.LoggerOptions`.

- `transports` - You can use `'console' | 'file' | 'dailyRotateFile'` for preset output methods.
- `format` - You can use `'logfmt' | 'json' | 'delimiter'` for preset print formats.

### `app.createLogger`

In multi-application scenarios, sometimes we want to customize the output directory and file, which can be output to the current application name's directory.

```ts
app.createLogger({
  dirname: '',
  filename: 'custom', // Output to /storage/logs/main/custom.log
});
```

### `plugin.createLogger`

Usage and use case same as `app.createLogger`.

```ts
class CustomPlugin extends Plugin {
  async load() {
    const logger = this.createLogger({
      // Output to /storage/logs/main/custom-plugin/YYYY-MM-DD.log
      dirname: 'custom-plugin',
      filename: '%DATE%.log',
      transports: ['dailyRotateFile'],
    });
  }
}
```
