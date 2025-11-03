# Migration Scripts

During plugin updates and iterations, there may be incompatible changes. These incompatible upgrade scripts can be handled by writing migration files, triggered by the `tachybase upgrade` command. The related process is as follows:

Upgrade migrations are divided into beforeLoad, afterSync, and afterLoad:

- beforeLoad: Executed before each module loads, divided into three phases:
  - Before core module loading
  - Before preset plugin loading
  - Before other plugin loading
- afterSync: After data table configuration is synchronized with the database, divided into three phases:
  - After core tables are synchronized with the database
  - After preset plugin tables are synchronized with the database
  - After other plugin tables are synchronized with the database
- afterLoad: Executed only after the entire application is loaded

## Creating Migration Files

Create migration files using the create-migration command

```bash
pnpm tachybase create-migration -h

Usage: tachybase create-migration [options] <name>

Options:
  --pkg <pkg>  package name
  --on [on]    Options include beforeLoad, afterSync and afterLoad
  -h, --help   display help for command
```

Example

```bash
$ pnpm tachybase create-migration update-ui --pkg=@tachybase/plugin-web

2024-01-07 17:33:13 [info ] add app main into supervisor     
2024-01-07 17:33:13 [info ] migration file in /packages/@tachybase/plugin-web/src/server/migrations/20240107173313-update-ui.ts
✨  Done in 5.02s.
```

This will generate a migration file in the src/server/migrations directory of the @tachybase/plugin-client plugin package, named 20240107173313-update-ui.ts, with the following initial content:

```ts
import { Migration } from '@tachybase/server';

export default class extends Migration {
  on = 'afterLoad'; // 'beforeLoad' | 'afterSync' | 'afterLoad'
  appVersion = '<0.19.0-alpha.3';

  async up() {
    // coding
  }
}
```

## Triggering Migrations

Trigger using the `tachybase upgrade` command

```bash
$ pnpm tachybase upgrade
```

## Testing Migrations

```ts
import { createMockServer, MockServer } from '@tachybase/test';

describe('test example', () => {
  let app: MockServer;

  beforeEach(async () => {
    app = await createMockServer({
      plugins: ['my-plugin'], // plugin
      version: '0.18.0-alpha.5', // version before upgrade
    });
  });

  afterEach(async () => {
    await app.destroy();
  });

  test('case1', async () => {
    await app.runCommand('upgrade');
    // coding...
  });
});
```
