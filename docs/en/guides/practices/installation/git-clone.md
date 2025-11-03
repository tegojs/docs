# Git Source Installation

## 0. Prerequisites

Please ensure you have:

- Installed Git, Node.js 20.18+, pnpm 9.15.1
- Configured and started one of the required databases: SQLite 3.x, MySQL 8.0.17+, MariaDB 10.9+, PostgreSQL 10+

## 1. Download Tachybase Locally

```bash
git clone https://github.com/tachybase/tachybase.git my-tachybase-app
```

## 2. Change Directory

```bash
cd my-tachybase-app
```

## 3. Install Dependencies

Due to network conditions in mainland China, it's strongly recommended to switch to a domestic mirror.

```bash
$ pnpm config set registry https://registry.npmmirror.com/
$ pnpm config set sqlite3_binary_host_mirror https://npmmirror.com/mirrors/sqlite3/
```

📢 Due to factors such as network environment and system configuration, this step may take more than ten minutes.

```bash
pnpm install --frozen-lockfile
# For production deployment, to reduce size, you can install only necessary dependencies
pnpm install --frozen-lockfile --production
```

## 4. Set Environment Variables

Tachybase's required environment variables are stored in the `.env` file in the root directory. Modify the environment variables according to your actual situation. If you don't know how to modify them, [click here to view the environment variables documentation](/guides/advanced/env.md), or you can keep the defaults.

```bash
# Use sqlite database
DB_DIALECT=sqlite
# sqlite file location
DB_STORAGE=storage/db/tachybase.sqlite
```

:::warning
- `APP_KEY` is the application's secret key, used to generate user tokens, etc. (If APP_KEY is modified, old tokens will also become invalid). It can be any random string. Please change it to your own secret key and ensure it is not leaked.
- `DB_*` are database-related. If it's not the default database service in the example, please modify according to your actual situation.
- When using MySQL (or MariaDB), you need to configure the DB_TIMEZONE environment variable, such as `DB_TIMEZONE=+08:00`
:::

## 5. Install Tachybase

```bash
pnpm tachybase install --lang=zh-CN
```

## 6. Start Tachybase

Development environment

```bash
pnpm dev
```

Production environment

```bash
# Compile (please ensure you've executed `pnpm install --frozen-lockfile`, note without `--production`)
pnpm build
# Start
pnpm start
```

## 7. Login to Tachybase

Open http://localhost:13000/ in your browser. The initial account and password are `tachybase` and `!Admin123.`.
