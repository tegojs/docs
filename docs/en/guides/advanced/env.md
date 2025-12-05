# Environment Variables

## How to Set Environment Variables?

### Git Source Code or create-tachybase-app Installation Method

Set environment variables in the `.env` file in the project root directory. After modifying environment variables, you need to kill the application process and restart.

### Docker Installation Method

Modify the `docker-compose.yml` configuration and set environment variables in the `environment` parameter. Example:

```yml
services:
  app:
    image: tachybase/tachybase:latest
    environment:
      - APP_ENV=production
```

You can also use `env_file`, which allows setting environment variables in the `.env` file. Example:

```yml
services:
  app:
    image: tachybase/tachybase:latest
    env_file: .env
```

After modifying environment variables, you need to rebuild the app container.

```yml
docker-compose up -d app
```

## Global Environment Variables

### TZ

Used to set the application's timezone, defaults to the operating system timezone.

https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

:::warning
Operations related to time will be processed according to this timezone. Modifying TZ may affect date values in the database.
:::

### APP_ENV

Application environment, default value `development`, options include:

- `production` Production environment
- `development` Development environment

```bash
APP_ENV=production
```

When APP_ENV=production, if LOGGER_FORMAT is not set, defaults to json format. If LOGGER_LEVEL is not set, defaults to info level.


### APP_KEY

Application secret key, used to generate user tokens, etc. Change to your own application secret key and ensure it's not leaked

:::warning
If APP_KEY is changed, old tokens will also become invalid
:::

```bash
APP_KEY=app-key-test
```

### APP_PORT

Application port, default value `3000`

```bash
APP_PORT=3000
```

### API_BASE_PATH

Tachybase API address prefix, default value `/api/`

```bash
API_BASE_PATH=/api/
```

### LOCAL_STORAGE_DEST

Local storage path, default value `storage/uploads`

```bash
LOCAL_STORAGE_DEST=storage/uploads
```

### PLUGIN_PACKAGE_PREFIX

Plugin package name prefix, defaults to: `@tachybase/plugin-,@tachybase/preset-,@tachybase/module-,@hera/plugin-,@hera/module-`.

For example, adding a `hello` plugin to a `my-tachybase-app` project, the plugin's full package name would be `@my-tachybase-app/plugin-hello`.

PLUGIN_PACKAGE_PREFIX can be configured as:

```bash
PLUGIN_PACKAGE_PREFIX=@tachybase/plugin-,@tachybase/preset-,@tachybase/module-,@hera/plugin-,@hera/module-
```

Then plugin names and package names correspond as follows:

- `users` plugin package name is `@tachybase/module-users`
- `tachybase` plugin package name is `@tachybase/preset-tachybase`
- `hello` plugin package name is `@my-tachybase-app/plugin-hello`

### DB_DIALECT

Database type, default value `sqlite`, options include:

- `sqlite`
- `mariadb`
- `mysql`
- `postgres`

Postgres database is recommended, some databases may not be supported under specific plugins

```bash
DB_DIALECT=postgres
```

### DB_STORAGE

Database file path (configured when using SQLite database)

```bash
# Relative path
DB_STORAGE=storage/db/tachybase.db
# Absolute path
DB_STORAGE=/your/path/tachybase.db
```

### DB_HOST

Database host (needs to be configured when using MySQL or PostgreSQL database)

Default value `localhost`

```bash
DB_HOST=localhost
```

### DB_PORT

Database port (needs to be configured when using MySQL or PostgreSQL database)

- MySQL, MariaDB default port 3306
- PostgreSQL default port 5432

```bash
DB_PORT=3306
```

### DB_DATABASE

Database name (needs to be configured when using MySQL or PostgreSQL database)

```bash
DB_DATABASE=tachybase
```

### DB_USER

Database user (needs to be configured when using MySQL or PostgreSQL database)

```bash
DB_USER=tachybase
```

### DB_PASSWORD

Database password (needs to be configured when using MySQL or PostgreSQL database)

```bash
DB_PASSWORD=tachybase
```

### DB_TABLE_PREFIX

Data table prefix

```bash
DB_TABLE_PREFIX=tachybase_
```

### DB_UNDERSCORED

Whether database table names and field names are converted to snake case style, defaults to `false`. If using MySQL (MariaDB) database and `lower_case_table_names=1`, then DB_UNDERSCORED must be `true`

:::warning
When `DB_UNDERSCORED=true`, the actual table names and field names in the database are not consistent with what you see in the interface, for example `orderDetails` in the database is `order_details`
:::

### DB_LOGGING

Database logging switch, default value `off`, options include:

- `on` On
- `off` Off

```bash
DB_LOGGING=true
```

### LOGGER_TRANSPORT

Log output method, multiple values separated by `,`. Development environment default value `console`, production environment default value `console,dailyRotateFile`.
Options:

- `console` - `console.log`
- `file` - `File`
- `dailyRotateFile` - `Daily rotating file`

```bash
LOGGER_TRANSPORT=console,dailyRotateFile
```

### LOGGER_BASE_PATH

File-based log storage path, defaults to `storage/logs`.

```bash
LOGGER_BASE_PATH=storage/logs
```

### LOGGER_LEVEL

Output log level, development environment default value `debug`, production environment default value `info`. Options:

- `error`
- `warn`
- `info`
- `debug`
- `trace`

```bash
LOGGER_LEVEL=info
```

Database log output level is `debug`, controlled by `DB_LOGGING` whether to output, not affected by `LOGGER_LEVEL`.

### LOGGER_MAX_FILES

Maximum number of log files to retain.

- When `LOGGER_TRANSPORT` is `file`, default value is `10`.
- When `LOGGER_TRANSPORT` is `dailyRotateFile`, use `[n]d` to represent days. Default value is `14d`.

```bash
LOGGER_MAX_FILES=14d
```

### LOGGER_MAX_SIZE

Log rotation by size.

- When `LOGGER_TRANSPORT` is `file`, unit is `byte`, default value is `20971520 (20 * 1024 * 1024)`.
- When `LOGGER_TRANSPORT` is `dailyRotateFile`, can use `[n]k`, `[n]m`, `[n]g`. No default configuration.

```bash
LOGGER_MAX_SIZE=20971520
```

### LOGGER_FORMAT

Log print format, development environment default `console`, production environment default `json`. Options:

- `console`
- `json`
- `logfmt`
- `delimiter`

```bash
LOGGER_FORMAT=json
```

### CACHE_DEFAULT_STORE

Unique identifier for cache method, specifies server's default cache method, default value `memory`, built-in options:

- `memory`
- `redis`

```bash
CACHE_DEFAULT_STORE=memory
```

### CACHE_MEMORY_MAX

Maximum number of memory cache items, default value `2000`.

```bash
CACHE_MEMORY_MAX=2000
```

### CACHE_REDIS_URL

Redis connection, optional. Example: `redis://localhost:6379`

```bash
CACHE_REDIS_URL=redis://localhost:6379
```

### ENCRYPTION_KEY

Encryption key for encrypted fields, 32-character string, defaults to 12345678901234567890123456789012.

```bash
ENCRYPTION_FIELD_KEY=12345678901234567890123456789012
```

### WOKER_COUNT

Number of worker processes, default value `1`.

```bash
WOKER_COUNT=1
```

### WORKER_COUNT_MAX

Maximum number of worker processes, default value `8`. Currently, the number of threads controlled input on the web page cannot exceed this value.

```bash
WORKER_COUNT_MAX=8
```

### WORKER_TIMEOUT

Worker process transaction maximum timeout (seconds), default value `1800`.

```bash
WORKER_TIMEOUT=1800
```

### WORKER_ERROR_RETRY

Worker process startup failure retry count, default value `5`.

```bash
WORKER_ERROR_RETRY=5
```

### WORKER_COUNT_SUB

Sub-application worker process count, to prevent multiple sub-applications from occupying resources, default value `0`.

```bash
WORKER_COUNT_SUB=0
```


### EXPORT_LENGTH_MAX

Export table maximum length, default value `2000`.

```bash
EXPORT_LENGTH_MAX=2000
```

### EXPORT_WORKER_PAGESIZE

Page size for exporting tables using worker threads, default value `1000`.

```bash
EXPORT_WORKER_PAGESIZE=1000
```

### PRESETS_CORE_PLUGINS

Enable/disable built-in plugins, default value is empty.

Add ! before name to remove specified plugin, add | before name to add specified plugin but disable by default

```bash
PRESETS_CORE_PLUGINS=api-doc,api-keys,!messages
```

### PRESETS_LOCAL_PLUGINS

Enable/disable local plugins, default value is empty.

Add ! before name to remove specified plugin, add | before name to add specified plugin but disable by default

```bash
PRESETS_CORE_PLUGINS=gantt,!iframe-block,|audit-logs
```

### FORCE_LOCALE_CACHE

Force use of cached language packs, when enabled in local development environment can cache requests for getLang interface, returning 302 status code, not recommended to enable. Default value `0`.

```bash
FORCE_LOCALE_CACHE=1
```

<!-- TODO: TELEMETRY telemetry related -->

## Temporary Environment Variables

Temporary environment variables only take effect in specific situations (installation), do not affect runtime after installation

When installing tachybase, you can set temporary environment variables to assist installation, such as:

```bash
pnpm cross-env \
  INIT_APP_LANG=zh-CN \
  INIT_ROOT_EMAIL=demo@tachybase.com \
  INIT_ROOT_PASSWORD=admin123 \
  INIT_ROOT_NICKNAME="Super Admin" \
  tachybase install

# Equivalent to
pnpm tachybase install \
  --lang=zh-CN  \
  --root-email=demo@tachybase.com \
  --root-password=admin123 \
  --root-nickname="Super Admin"

# Equivalent to
pnpm tachybase install -l zh-CN -e demo@tachybase.com -p admin123 -n "Super Admin"
```

### INIT_APP_LANG

Language during installation, default value `en-US`, options include:

- `en-US`
- `zh-CN`

```bash
pnpm cross-env \
  INIT_APP_LANG=zh-CN \
  tachybase install
```

### INIT_ROOT_EMAIL

Root user email

```bash
pnpm cross-env \
  INIT_APP_LANG=zh-CN \
  INIT_ROOT_EMAIL=demo@tachybase.com \
  tachybase install
```

### INIT_ROOT_PASSWORD

Root user password

```bash
pnpm cross-env \
  INIT_APP_LANG=zh-CN \
  INIT_ROOT_EMAIL=demo@tachybase.com \
  INIT_ROOT_PASSWORD=admin123 \
  tachybase install
```

### INIT_ROOT_NICKNAME

Root user nickname

```bash
pnpm cross-env \
  INIT_APP_LANG=zh-CN \
  INIT_ROOT_EMAIL=demo@tachybase.com \
  INIT_ROOT_PASSWORD=admin123 \
  INIT_ROOT_NICKNAME="Super Admin" \
  tachybase install
```
