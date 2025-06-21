# 环境变量

## 如何设置环境变量？

### Git 源码或 create-tachybase-app 安装方式

在项目根目录下的 `.env` 文件里设置环境变量，修改环境变量之后需要 kill 应用进程，重新启动。

### Docker 安装方式

修改 `docker-compose.yml` 配置，在 `enviroment` 参数里设置环境变量。示例：

```yml
services:
  app:
    image: tachybase/tachybase:latest
    environment:
      - APP_ENV=production
```

也可以使用 `env_file`，即可在 `.env` 文件中设置环境变量。示例：

```yml
services:
  app:
    image: tachybase/tachybase:latest
    env_file: .env
```

修改环境变量之后，需要重建 app 容器。

```yml
docker-compose up -d app
```

## 全局环境变量

### TZ

用于设置应用的时区，默认为操作系统时区。

https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

:::warning
与时间相关的操作会依据该时区进行处理，修改 TZ 可能会影响数据库里的日期值。
:::

### APP_ENV

应用环境，默认值 `development`，可选项包括：

- `production` 生产环境
- `development` 开发环境

```bash
APP_ENV=production
```

APP_ENV=production 时，如果没有设置LOGGER_FORMAT，默认json格式。如果没有设置LOGGER_LEVEL，默认info级别。


### APP_KEY

应用的密钥，用于生成用户 token 等，修改为自己的应用密钥，并确保不对外泄露

:::warning
如果 APP_KEY 修改了，旧的 token 也会随之失效
:::

```bash
APP_KEY=app-key-test
```

### APP_PORT

应用端口，默认值 `3000`

```bash
APP_PORT=3000
```

### API_BASE_PATH

tachybase API 地址前缀，默认值 `/api/`

```bash
API_BASE_PATH=/api/
```

### LOCAL_STORAGE_DEST

本地存储路径，默认值 `storage/uploads`

```bash
LOCAL_STORAGE_DEST=storage/uploads
```

### PLUGIN_PACKAGE_PREFIX

插件包名前缀，默认为：`@tachybase/plugin-,@tachybase/preset-,@tachybase/module-,@hera/plugin-,@hera/module-`。

例如，添加 `hello` 插件到 `my-tachybase-app` 项目，插件的完整包名则为 `@my-tachybase-app/plugin-hello`。

PLUGIN_PACKAGE_PREFIX 可以配置为：

```bash
PLUGIN_PACKAGE_PREFIX=@tachybase/plugin-,@tachybase/preset-,@tachybase/module-,@hera/plugin-,@hera/module-
```

则插件名称和包名对应关系如下：

- `users` 插件的包名为 `@tachybase/module-users`
- `tachybase` 插件的包名为 `@tachybase/preset-tachybase`
- `hello` 插件的包名为 `@my-tachybase-app/plugin-hello`

### DB_DIALECT

数据库类型，默认值 `sqlite`，可选项包括：

- `sqlite`
- `mariadb`
- `mysql`
- `postgres`

推荐使用postgres数据库,部分数据库在特定插件下可能不支持

```bash
DB_DIALECT=postgres
```

### DB_STORAGE

数据库文件路径（使用 SQLite 数据库时配置）

```bash
# 相对路径
DB_STORAGE=storage/db/tachybase.db
# 绝对路径
DB_STORAGE=/your/path/tachybase.db
```

### DB_HOST

数据库主机（使用 MySQL 或 PostgreSQL 数据库时需要配置）

默认值 `localhost`

```bash
DB_HOST=localhost
```

### DB_PORT

数据库端口（使用 MySQL 或 PostgreSQL 数据库时需要配置）

- MySQL、MariaDB 默认端口 3306
- PostgreSQL 默认端口 5432

```bash
DB_PORT=3306
```

### DB_DATABASE

数据库名（使用 MySQL 或 PostgreSQL 数据库时需要配置）

```bash
DB_DATABASE=tachybase
```

### DB_USER

数据库用户（使用 MySQL 或 PostgreSQL 数据库时需要配置）

```bash
DB_USER=tachybase
```

### DB_PASSWORD

数据库密码（使用 MySQL 或 PostgreSQL 数据库时需要配置）

```bash
DB_PASSWORD=tachybase
```

### DB_TABLE_PREFIX

数据表前缀

```bash
DB_TABLE_PREFIX=tachybase_
```

### DB_UNDERSCORED

数据库表名、字段名是否转为 snake case 风格，默认为 `false`。如果使用 MySQL（MariaDB）数据库，并且 `lower_case_table_names=1`，则 DB_UNDERSCORED 必须为 `true`

:::warning
当 `DB_UNDERSCORED=true` 时，数据库实际的表名和字段名与界面所见的并不一致，如 `orderDetails` 数据库里的是 `order_details`
:::

### DB_LOGGING

数据库日志开关，默认值 `off`，可选项包括：

- `on` 打开
- `off` 关闭

```bash
DB_LOGGING=on
```

### LOGGER_TRANSPORT

日志输出方式，多个用 `,` 分隔。开发环境默认值 `console`，生产环境默认值 `console,dailyRotateFile`.
可选项：

- `console` - `console.log`
- `file` - `文件`
- `dailyRotateFile` - `按天滚动文件`

```bash
LOGGER_TRANSPORT=console,dailyRotateFile
```

### LOGGER_BASE_PATH

基于文件的日志存储路径，默认为 `storage/logs`。

```bash
LOGGER_BASE_PATH=storage/logs
```

### LOGGER_LEVEL

输出日志级别，开发环境默认值 `debug`，生产环境默认值 `info`. 可选项：

- `error`
- `warn`
- `info`
- `debug`
- `trace`

```bash
LOGGER_LEVEL=info
```

数据库日志输出级别为 `debug`，由 `DB_LOGGING` 控制是否输出，不受 `LOGGER_LEVEL` 影响。

### LOGGER_MAX_FILES

最大保留日志文件数。

- `LOGGER_TRANSPORT` 为 `file` 时，默认值为 `10`.
- `LOGGER_TRANSPORT` 为 `dailyRotateFile`，使用 `[n]d` 代表天数。默认值为 `14d`.

```bash
LOGGER_MAX_FILES=14d
```

### LOGGER_MAX_SIZE

按大小滚动日志。

- `LOGGER_TRANSPORT` 为 `file` 时，单位为 `byte`，默认值为 `20971520 (20 * 1024 * 1024)`.
- `LOGGER_TRANSPORT` 为 `dailyRotateFile`，可以使用 `[n]k`，`[n]m`，`[n]g`. 默认不配置。

```bash
LOGGER_MAX_SIZE=20971520
```

### LOGGER_FORMAT

日志打印格式，开发环境默认 `console`，生产环境默认 `json`. 可选项:

- `console`
- `json`
- `logfmt`
- `delimiter`

```bash
LOGGER_FORMAT=json
```

### CACHE_DEFAULT_STORE

使用缓存方式的唯一标识，指定服务端默认缓存方式，默认值 `memory`，内置可选项：

- `memory`
- `redis`

```bash
CACHE_DEFAULT_STORE=memory
```

### CACHE_MEMORY_MAX

内存缓存项目最大个数，默认值 `2000`。

```bash
CACHE_MEMORY_MAX=2000
```

### CACHE_REDIS_URL

Redis连接，可选。示例：`redis://localhost:6379`

```bash
CACHE_REDIS_URL=redis://localhost:6379
```

### ENCRYPTION_KEY

加密字段的加密密钥,32位字符串,默认为12345678901234567890123456789012。

```bash
ENCRYPTION_FIELD_KEY=12345678901234567890123456789012
```

### WOKER_COUNT

工作进程数，默认值 `1`。

```bash
WOKER_COUNT=1
```

### WORKER_COUNT_MAX

工作进程最大数，默认值 `8`。现在在网页上控制输入的线程数不能超过这个值。

```bash
WORKER_COUNT_MAX=8
```

### WORKER_TIMEOUT

工作进程处理事务最大超时时间（秒），默认值 `1800`。

```bash
WORKER_TIMEOUT=1800
```

### WORKER_ERROR_RETRY

工作进程启动失败重试次数，默认值 `5`。

```bash
WORKER_ERROR_RETRY=5
```

### WORKER_COUNT_SUB

子应用工作进程数，为防止开启多个子应用占用资源，默认值 `0`。

```bash
WORKER_COUNT_SUB=0
```


### EXPORT_LENGTH_MAX

导出表格最大长度，默认值 `2000`。

```bash
EXPORT_LENGTH_MAX=2000
```

### EXPORT_WORKER_PAGESIZE

使用工作线程导出表格的每页大小，默认值 `1000`。

```bash
EXPORT_WORKER_PAGESIZE=1000
```

### PRESETS_CORE_PLUGINS

内置插件的启用关闭，默认值为空。

名称前加!表示移除指定插件 名称前加|表示添加指定插件但默认禁用

```bash
PRESETS_CORE_PLUGINS=api-doc,api-keys,!messages
```

### PRESETS_LOCAL_PLUGINS

本地插件的启用关闭，默认值为空。

名称前加!表示移除指定插件 名称前加|表示添加指定插件但默认禁用

```bash
PRESETS_CORE_PLUGINS=gantt,!iframe-block,|audit-logs
```

### FORCE_LOCALE_CACHE

强制使用缓存的语言包，开启后在本地开发环境可以针对getLang接口缓存请求,返回302状态码, 不推荐开启. 默认值 `0`。

```bash
FORCE_LOCALE_CACHE=1
```

<!-- TODO: TELEMETRY 遥测有关 -->

## 临时环境变量

临时环境变量只在特定场合(安装)中生效，安装后不影响运行

安装 tachybase 时，可以通过设置临时的环境变量来辅助安装，如：

```bash
pnpm cross-env \
  INIT_APP_LANG=zh-CN \
  INIT_ROOT_EMAIL=demo@tachybase.com \
  INIT_ROOT_PASSWORD=admin123 \
  INIT_ROOT_NICKNAME="Super Admin" \
  tachybase install

# 等同于
pnpm tachybase install \
  --lang=zh-CN  \
  --root-email=demo@tachybase.com \
  --root-password=admin123 \
  --root-nickname="Super Admin"

# 等同于
pnpm tachybase install -l zh-CN -e demo@tachybase.com -p admin123 -n "Super Admin"
```

### INIT_APP_LANG

安装时的语言，默认值 `en-US`，可选项包括：

- `en-US`
- `zh-CN`

```bash
pnpm cross-env \
  INIT_APP_LANG=zh-CN \
  tachybase install
```

### INIT_ROOT_EMAIL

Root 用户邮箱

```bash
pnpm cross-env \
  INIT_APP_LANG=zh-CN \
  INIT_ROOT_EMAIL=demo@tachybase.com \
  tachybase install
```

### INIT_ROOT_PASSWORD

Root 用户密码

```bash
pnpm cross-env \
  INIT_APP_LANG=zh-CN \
  INIT_ROOT_EMAIL=demo@tachybase.com \
  INIT_ROOT_PASSWORD=admin123 \
  tachybase install
```

### INIT_ROOT_NICKNAME

Root 用户昵称

```bash
pnpm cross-env \
  INIT_APP_LANG=zh-CN \
  INIT_ROOT_EMAIL=demo@tachybase.com \
  INIT_ROOT_PASSWORD=admin123 \
  INIT_ROOT_NICKNAME="Super Admin" \
  tachybase install
```