# 快速开始（灵矶引擎）

## 0.先决条件
 请确保你已经：

- 安装了 Node.js 20.18.0 及以上版本

 ```bash
$ node -v 
v20.18.0
 ```

## 1.安装项目

```bash
# 初始化环境
npx @tachybase/engine init my-app

# 切换到对应目录
cd my-app

```

## 2. 设置环境变量

Tachybase 所需的环境变量储存在根目录 `.env` 文件里，根据实际情况修改环境变量，如果你不知道怎么改，[点此查看环境变量说明](/guides/advanced/env.md)，也可以保持默认。

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

  - `TZ` 用于设置应用的时区，默认为操作系统时区；
  - `APP_KEY` 是应用的密钥，用于生成用户 token 等（如果 APP_KEY 修改了，旧的 token 也会随之失效）。它可以是任意随机字符串。请修改为自己的秘钥，并确保不对外泄露；
  - `DB_*` 为数据库相关，如果不是例子默认的数据库服务，请根据实际情况修改。

::: 

## 3. 启动灵矶

```bash
npx @tachybase/engine start --quickstart
```

## 4. 访问灵矶

使用浏览器打开 [http://localhost:3000](http://localhost:3000) 初始化账号和密码是 `admin@tachybase.com` 和 `!Admin123.`。