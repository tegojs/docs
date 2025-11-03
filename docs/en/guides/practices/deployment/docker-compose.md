# Deploy via Docker Compose

The process is the same as [Docker Installation](/guides/advanced/env#docker-installation-method).

<br />

[>>> For more details, see the complete "Environment Variables" list <<<](/guides/advanced/env)

## Bind Domain Name

Using nginx as an example, proxy http://127.0.0.1:13000/ through nginx

```bash
server {
    listen 80;
    server_name your_domain.com;  # Replace your_domain.com with your domain

    location / {
        proxy_pass http://127.0.0.1:13000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

## Deploy to Subpath

To deploy to a subpath, you need to configure the `APP_PUBLIC_PATH` environment variable.

```diff
services:
  app:
    image: tachybase/tachybase:latest
    environment:
+     - APP_PUBLIC_PATH=/tachybase/
```

The application URL will be http://127.0.0.1:13000/tachybase/, and the Nginx configuration should be:

```bash
server {
    listen 80;
    server_name your_domain.com;  # Replace your_domain.com with your domain

    location /tachybase/ {
        proxy_pass http://127.0.0.1:13000/tachybase/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

Finally, you can access the application at http://your_domain.com/tachybase/
