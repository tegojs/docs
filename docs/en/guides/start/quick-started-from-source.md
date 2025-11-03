# Quick Start (From Source)

## 0. Prerequisites
Make sure you have:

- Installed Node.js version 20.18.0 or above + pnpm 10.12.1

 ```bash
$ node -v 
v20.18.0
$ pnpm -v
10.12.1
 ```

## 1. Clone the Project

```bash
git clone https://github.com/tachybase/tachybase.git
```

## 2. Change Directory

```bash
cd tachybase
```

## 3. Install Dependencies

📢 Due to factors such as network environment and system configuration, this step may take more than ten minutes.

```bash
pnpm install
```

## 4. Set Environment Variables

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


>  - `TZ` is used to set the application's timezone, defaults to the operating system timezone;
>  - `APP_KEY` is the application's secret key, used to generate user tokens, etc. (if APP_KEY is changed, old tokens will also become invalid). It can be any random string. Please change it to your own secret key and ensure it is not leaked;
>  - `DB_*` are database-related. If it's not the default database service in the example, please modify according to actual conditions.


## 5. Initialize Tachybase

```bash
pnpm tachybase install --lang=zh-CN
```
## 6. Start Tachybase

```bash
pnpm dev
```

## 7. Access Tachybase

Open [http://localhost:3000](http://localhost:3000) in your browser. The initial account and password are `admin@tachybase.com` and `!Admin123.`.


## Additional Notes

Due to domestic network environment in China, it is strongly recommended that you switch to a Chinese mirror.

```bash
$ pnpm config set disable-self-update-check true
$ pnpm config set registry https://registry.npmmirror.com/
$ pnpm config set sqlite3_binary_host_mirror https://npmmirror.com/mirrors/sqlite3/
```
