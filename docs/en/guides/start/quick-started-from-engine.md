# Quick Start (Tachybase Engine)

## 0. Prerequisites
Make sure you have:

- Installed Node.js version 20.18.0 or above

 ```bash
$ node -v 
v20.18.0
 ```

## 1. Install the Project

```bash
# Initialize environment
npx @tachybase/engine init my-app

# Change to the corresponding directory
cd my-app

```

## 2. Set Environment Variables

The environment variables required by Tachybase are stored in the `.env` file in the root directory. Modify the environment variables according to actual conditions. If you don't know how to modify them, [click here to view environment variable instructions](/guides/advanced/env.md), or you can keep the defaults.

```bash
TZ=Asia/Shanghai
APP_KEY=your-secret-key
DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=postgres
DB_USER=tachybase
DB_PASSWORD=tachybase
```

:::warning

  - `TZ` is used to set the application's timezone, defaults to the operating system timezone;
  - `APP_KEY` is the application's secret key, used to generate user tokens, etc. (if APP_KEY is changed, old tokens will also become invalid). It can be any random string. Please change it to your own secret key and ensure it is not leaked;
  - `DB_*` are database-related. If it's not the default database service in the example, please modify according to actual conditions.

::: 

## 3. Start Tachybase

```bash
npx @tachybase/engine start --quickstart
```

## 4. Access Tachybase

Open [http://localhost:3000](http://localhost:3000) in your browser. The initial account and password are `admin@tachybase.com` and `!Admin123.`.
