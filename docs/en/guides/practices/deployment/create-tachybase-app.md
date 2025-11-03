# Deploy with create-tachybase-app

The process is the same as [create-tachybase-app Installation](/guides/advanced/env#git-source-code-or-create-tachybase-app-installation-method).

<embed src="./env-note.md"></embed>
- For production deployment, to reduce package size, you can install only necessary dependencies with `pnpm install --production`

<br />

[>>> For more details, see the complete "Environment Variables" list <<<](/guides/advanced/env)

## Manage Application Process

Tachybase has built-in [PM2](https://pm2.keymetrics.io/) for managing application processes. In production, you can simply run `pnpm start`. To run it in the background, add the `-d` parameter, for example:

```bash
# Run in background
pnpm start -d
```

More PM2 commands

```bash
pnpm tachybase pm2 -h
```

## Configure Nginx

In production, you can consider having Nginx serve static files. Tachybase provides the `create-nginx-conf` command to generate Nginx configuration files.

```bash
pnpm tachybase create-nginx-conf
```

The file is located at `./storage/tachybase.conf`. Adjust it according to your actual situation, and then add it to `/etc/nginx/sites-enabled`, for example:

```bash
ln -s /app/tachybase/storage/tachybase.conf /etc/nginx/sites-enabled/tachybase.conf
```

**Notes**

- To deploy to a subpath, configure the `APP_PUBLIC_PATH` environment variable. After configuration, re-run the `create-nginx-conf` command;
- Modify the generated `tachybase.conf` according to your actual situation, such as configuring the domain name;
- `/app/tachybase/` is the example application directory, adjust it according to your actual situation;
- `/etc/nginx/sites-enabled` is the default Nginx configuration path, which may vary in practice. You can check with `nginx -V`;
- If you're not using Nginx, you can refer to the Nginx configuration for adjustments.
