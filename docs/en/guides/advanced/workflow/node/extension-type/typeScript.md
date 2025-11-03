# TypeScript Script

The TypeScript script node allows users to execute a custom server-side TypeScript script in a workflow. Variables from upstream in the process can be used as parameters in the script, and the script's return value can be provided for downstream nodes to use.

The script will execute in a worker thread opened on the tachybase application's server and supports most features of Node.js, but there are still some differences from the native execution environment. See [Feature List](#feature-list) for details.

## User Manual

### Create Node

In the workflow configuration interface, click the plus ("+") button in the process to add a "TypeScript" node:



### Node Configuration


#### Parameters

Used to pass context variables or static values from the process into the script for use by the code logic in the script. `name` is the parameter name, which becomes a variable name after being passed into the script. `value` is the parameter value, which can select variables or input constants.

#### Script Content

Script content can be seen as a function. You can write any TypeScript code supported in the Node.js environment, and can use the `return` statement to return a value as the node's running result for subsequent nodes to use as variables.

After writing code, you can use the test button below the edit box to open the test execution dialog and simulate execution with static values filled in parameters. After execution, you can see the return value and output (log) content in the dialog.


#### Timeout Setting

Unit is in milliseconds. When set to `0`, it means no timeout is set.

#### Continue Process After Error

After checking, subsequent nodes will still execute when the script errors or times out.

:::info{title="Note"}
After a script error, there will be no return value, and the node's result will be filled with error information. If the script node's result variable is used in subsequent nodes, it needs to be handled carefully.
:::

## Feature List

### Node.js Version

Consistent with the Node.js version running in the main application.

### Module Support

Modules can be used with restrictions in scripts. Consistent with CommonJS, use the `require()` instruction in code to import modules.

Supports Node.js native modules and modules already installed in `node_modules` (including dependency packages used by tachybase). Modules to be provided for code use need to be declared in the application environment variable `WORKFLOW_SCRIPT_MODULES`, with multiple package names separated by semicolons, for example:

```ini
WORKFLOW_SCRIPT_MODULES=crypto,timers,lodash,dayjs
```

:::info{title="Note"}
Modules not declared in the environment variable `WORKFLOW_SCRIPT_MODULES`, even if they are Node.js native or already installed in `node_modules`, **cannot** be used in scripts. This policy can be used to manage the list of modules users can use at the operations level, avoiding excessive script permissions in some scenarios.
:::

### Global Variables

**Does not support** global variables such as `global`, `process`, `__dirname`, and `__filename`.

```js
console.log(global); // will throw error: "global is not defined"
```

### Passed Parameters

Parameters configured in the node will be used as global variables in the script and can be used directly. Parameters passed into the script only support basic types, such as `boolean`, `number`, `string`, `number`, `object`, and arrays. `Date` objects will be converted to ISO format strings after being passed in. Other complex types cannot be passed directly, such as instances of custom classes.

### Return Value

Data of basic types (same as parameter rules) can be returned to the node as a result through the `return` statement. If the `return` statement is not called in the code, the node execution has no return value.

```js
return 123;
```

### Output (Logs)

**Supports** using `console` to output logs.

```js
console.log('hello world!');
```

When the workflow executes, the output of the script node will also be recorded in the log file of the corresponding workflow.

### Asynchronous

**Supports** using `async` to define asynchronous functions and `await` to call asynchronous functions. **Supports** using the `Promise` global object.

```js
async function test() {
  return Promise.resolve(1);
}

const value = await test();
return value;
```

### Timers

If you need to use methods such as `setTimeout`, `setInterval`, or `setImmediate`, you need to import them through Node.js's `timers` package.

```js
const { setTimeout, setInterval, setImmediate, clearTimeout, clearInterval, clearImmediate } = require('timers');

async function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

await sleep(1000);

return 123;
```
