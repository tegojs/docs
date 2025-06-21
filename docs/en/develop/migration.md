# 升级脚本

插件在更新迭代过程中，可能会出现某些不兼容的改动，这些不兼容的升级脚本可以通过编写 migration 文件来处理，由 `tachybase upgrade` 命令触发，相关流程如下：

升级的 migrations 有 beforeLoad、afterSync 和 afterLoad 之分：

- beforeLoad：在各模块加载前执行，分为三个阶段：
  - 内核模块加载前
  - preset 插件加载前
  - 其他插件加载前
- afterSync：在数据表配置与数据库同步之后，分为三个阶段：
  - 内核表与数据库同步之后
  - preset 插件的表与数据库同步之后
  - 其他插件的表与数据库同步后
- afterLoad：应用全部加载之后才执行

## 创建 migration 文件

通过 create-migration 命令创建 migration 文件

```bash
pnpm tachybase create-migration -h

Usage: tachybase create-migration [options] <name>

Options:
  --pkg <pkg>  package name
  --on [on]    Options include beforeLoad, afterSync and afterLoad
  -h, --help   display help for command
```

示例

```bash
$ pnpm tachybase create-migration update-ui --pkg=@tachybase/plugin-web

2024-01-07 17:33:13 [info ] add app main into supervisor     
2024-01-07 17:33:13 [info ] migration file in /packages/@tachybase/plugin-web/src/server/migrations/20240107173313-update-ui.ts
✨  Done in 5.02s.
```

将在插件包 @tachybase/plugin-client 的 src/server/migrations 里生成一个 migration 文件，名为 20240107173313-update-ui.ts，初始内容如下：

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

## 触发 migration

通过 `tachybase upgrade` 命令触发

```bash
$ pnpm tachybase upgrade
```

## 测试 migration

```ts
import { createMockServer, MockServer } from '@tachybase/test';

describe('test example', () => {
  let app: MockServer;

  beforeEach(async () => {
    app = await createMockServer({
      plugins: ['my-plugin'], // 插件
      version: '0.18.0-alpha.5', // 升级前的版本
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