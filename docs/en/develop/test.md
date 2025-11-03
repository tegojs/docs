# Testing

Testing is based on the [Jest](https://jestjs.io/) testing framework. For convenient test writing, `mockDatabase()` and `mockServer()` are provided for database and server application testing.

:::warning
Test environment variables are configured in the `.env.test` file. It's recommended to use an independent test database for testing.
:::

## `mockDatabase()`

Provides a completely isolated db test environment by default

```ts
import { mockDatabase } from '@tachybase/test';

describe('my db suite', () => {
  let db;

  beforeEach(async () => {
    db = mockDatabase();
    db.collection({
      name: 'posts',
      fields: [
        {
          type: 'string',
          name: 'title',
        },
      ],
    });
    await db.sync();
  });

  afterEach(async () => {
    await db.close();
  });

  test('my case', async () => {
    const repository = db.getRepository('posts');
    const post = await repository.create({
      values: {
        title: 'hello',
      },
    });

    expect(post.get('title')).toEqual('hello');
  });
});
```

## `mockServer()`

Provides a mock server application instance, with corresponding app.db as a `mockDatabase()` instance. It also provides convenient `app.agent()` for testing HTTP APIs. For Tachybase Resource Actions, `app.agent().resource()` is also encapsulated for testing resource Actions.

```ts
import { MockServer, mockServer } from '@tachybase/test';

// The minimally installed plugins for each plugin's app are different, plugins need to add essential plugins according to their own situation
async function createApp(options: any = {}) {
  const app = mockServer({
    ...options,
    plugins: [
      'acl',
      'users',
      'collection-manager',
      'error-handler',
      ...options.plugins,
    ],
    // There will also be some other parameter configurations
  });
  // Here you can supplement some logic that needs special handling, such as importing data tables needed for testing
  return app;
}

// Most tests need to start the application, so a common startup method can also be provided
async function startApp() {
  const app = createApp();
  await app.quickstart({
    // Clear database before running tests
    clean: true,
  });
  return app;
}

describe('test example', () => {
  let app: MockServer;

  beforeEach(async () => {
    app = await startApp();
  });

  afterEach(async () => {
    // Clear database after running tests
    await app.destroy();
    // Only stop without clearing database
    await app.stop();
  });

  test('case1', async () => {
    // coding...
  });
});
```

## Common Application Processes

If you need to test different process scenarios, you can execute related commands according to the following examples.

### Install First, Then Start

Terminal command line

```bash
pnpm tachybase install
pnpm start
```

Pre-test process

```ts
const app = mockServer();
await app.runCommand('install');
await app.runCommand('start');
```

### Start First, Then Install

Terminal command line

```bash
pnpm start # Resident in memory
# Execute in another terminal
pnpm tachybase install
```

Pre-test process

```ts
const app = mockServer();
await app.runCommand('start');
await app.runCommand('install');
```

### Quick Start (Automatic Install or Upgrade)

Terminal command line

```bash
yarn start --quickstart
```

Pre-test process

```ts
const app = mockServer();
await app.runCommand('start', '--quickstart');
```

### Reinstall Already Installed and Started Application

Terminal command line

```bash
pnpm start --quickstart
# Execute in another terminal
pnpm tachybase install -f
```

Pre-test process

```ts
const app = mockServer();
await app.runCommand('start', '--quickstart');
await app.runCommand('install', '-f');
```

### Upgrade Application (Before Start)

Terminal command line

```bash
pnpm tachybase upgrade
pnpm start
```

Pre-test process

```ts
const app = mockServer();
await app.runCommand('upgrade', '-f');
await app.runCommand('start', '--quickstart');
```

### Upgrade Application (After Start)

```bash
pnpm start # Resident in memory
# Execute in another terminal
pnpm tachybase upgrade
```

Pre-test process

```ts
const app = mockServer();
await app.runCommand('start', '--quickstart');
await app.runCommand('upgrade', '-f');
```

### Enable Plugin

Terminal command line

```bash
yarn start --quickstart
yarn pm enable @my-project/plugin-hello
```

Pre-test process

```ts
const app = mockServer();
await app.runCommand('start', '--quickstart');
await app.runCommand('pm', 'enable', '@my-project/plugin-hello');
```

### Disable Plugin

Terminal command line

```bash
yarn start --quickstart
yarn pm disable @my-project/plugin-hello
```

Pre-test process

```ts
const app = mockServer();
await app.runCommand('start', '--quickstart');
await app.runCommand('pm', 'disable', '@my-project/plugin-hello');
```
