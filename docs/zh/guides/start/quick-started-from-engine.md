# 快速开始（灵矶引擎）

## 0.先决条件
 请确保你已经：

- 安装了 Node.js 20.19.0 及以上版本

 ```bash
$ node -v 
v20.19.0
 ```

## 1.安装项目

```bash
# 初始化环境
npx tego init my-app

# 切换到对应目录
cd my-app

```

## 2. 设置环境变量

Tego 所需的环境变量储存在根目录 `.env` 文件里，根据实际情况修改环境变量，如果你不知道怎么改，[点此查看环境变量说明](../env.md)，也可以保持默认。

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
npx tego start --quickstart
```

## 4. 访问灵矶

使用浏览器打开 [http://localhost:3000](http://localhost:3000) 初始化账号和密码是 `admin@tachybase.com` 和 `!Admin123.`。


## 其他说明

如果需要所有的插件，可以使用下面这个命令来初始化应用

```bash
npx tego init my-app --plugins action-bulk-edit,action-bulk-update,action-custom-request,action-duplicate,action-export,action-import,action-print,block-calendar,block-charts,block-gantt,block-kanban,block-presentation,field-china-region,field-formula,field-sequence,field-encryption,log-viewer,otp,full-text-search,password-policy,auth-pages,manual-notification,adapter-bullmq,adapter-red-node,adapter-remix,api-keys,audit-logs,auth-cas,auth-dingtalk,auth-lark,auth-oidc,auth-saml,auth-sms,auth-wechat,auth-wecom,block-comments,block-map,block-step-form,data-source-common,demos-game-runesweeper,devtools,field-markdown-vditor,field-snapshot,i18n-editor,multi-app-share-collection,online-user,simple-cms,sub-accounts,theme-editor,workflow-approval,ai-chat,department,workflow-analysis,api-logs,ocr-convert,text-copy
```
