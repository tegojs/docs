# 通过 Docker Compose 部署

其他流程与 [Docker 安装](/guides/advanced/env.html#docker-安装方式) 无异。

<br />

[>>> 更多内容，查看完整的「环境变量」列表 <<<](/guides/advanced/env)

## 绑定域名

以 nginx 为例，通过 nginx 代理 http://127.0.0.1:13000/

```bash
server {
    listen 80;
    server_name your_domain.com;  # 将 your_domain.com 替换为您的域名

    location / {
        proxy_pass http://127.0.0.1:13000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

## 子路径部署

部署到子路径，需要配置 `APP_PUBLIC_PATH` 环境变量。

```diff
services:
  app:
    image: tachybase/tachybase:latest
    environment:
+     - APP_PUBLIC_PATH=/tachybase/
```

应用的 URL 是 http://127.0.0.1:13000/tachybase/ ，Nginx 配置为

```bash
server {
    listen 80;
    server_name your_domain.com;  # 将 your_domain.com 替换为您的域名

    location /tachybase/ {
        proxy_pass http://127.0.0.1:13000/tachybase/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

最后就可以通过 http://your_domain.com/tachybase/ 访问了
