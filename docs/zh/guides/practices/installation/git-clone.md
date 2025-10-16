# Git 源码安装

## 0. 先决条件

请确保你已经：

- 安装了 Git、Node.js 20.18+、pnpm 9.15.1
- 配置并启动了所需数据库 SQLite 3.x、MySQL 8.0.17+、MariaDB 10.9+、PostgreSQL 10+ 任选其一

## 1. 将 Tachybase 下载到本地

```bash
git clone https://github.com/tachybase/tachybase.git my-tachybase-app
```

## 2. 切换目录

```bash
cd my-tachybase-app
```

## 3. 安装依赖

由于国内网络环境的原因，强烈建议你更换国内镜像。

```bash
$ pnpm config set registry https://registry.npmmirror.com/
$ pnpm config set sqlite3_binary_host_mirror https://npmmirror.com/mirrors/sqlite3/
```

📢 由于网络环境、系统配置等因素影响，接下来这一步骤可能需要十几分钟时间。

```bash
pnpm install --frozen-lockfile
# 生产环境部署时，为了减少体积，可以只安装必要的依赖
pnpm install --frozen-lockfile --production
```

## 4. 设置环境变量

Tachybase 所需的环境变量储存在根目录 `.env` 文件里，根据实际情况修改环境变量，如果你不知道怎么改，[点此查看环境变量说明](/guides/advanced/env.md)，也可以保持默认。

```bash
# 使用 sqlite 数据库
DB_DIALECT=sqlite
# sqlite 文件地址
DB_STORAGE=storage/db/tachybase.sqlite
```

:::warning
- `APP_KEY` 是应用的密钥，用于生成用户 token 等（如果 APP_KEY 修改了，旧的 token 也会随之失效）。它可以是任意随机字符串。请修改为自己的秘钥，并确保不对外泄露。
- `DB_*` 为数据库相关，如果不是例子默认的数据库服务，请根据实际情况修改
- 使用 MySQL（或 MariaDB）时，需要配置 DB_TIMEZONE 环境变量，如 `DB_TIMEZONE=+08:00`
:::

## 5. 安装 Tachybase

```bash
pnpm tachybase install --lang=zh-CN
```

## 6. 启动 Tachybase

开发环境

```bash
pnpm dev
```

生产环境

```bash
# 编译（请确保已执行 `pnpm install --frozen-lockfile`，注意不带 `--production`）
pnpm build
# 启动
pnpm start
```

## 7. 登录 Tachybase

使用浏览器打开 http://localhost:13000/ 初始化账号和密码是 `tachybase` 和 `!Admin123.`。
