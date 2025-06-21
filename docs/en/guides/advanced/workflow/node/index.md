# 概述

节点是工作流中逻辑编排的基本单元，一个工作流可以配置任意多个节点，每个节点的类型代表一个指令，决定了节点的行为。节点的配置即对应指令的参数，参数决定其行为的操作数据对象或其他内容。

:::info{title=提示}
工作流的触发器不属于节点，只是以入口节点的形式展示在流程图中，但与节点是不同的概念，详情请参考[事件源](../event-source/overview.md)的内容。
:::

从功能角度，目前已实现的节点可以分为四大类（共 24 种节点）：

- 流程控制类
  - [条件判断](./process-control/condition.md)
  - [延时]（插件 @tachybase/plugin-workflow-deley 提供）
  - [结束流程](./process-control/end.md)
  - [JSON 变量映射]（插件 @tachybase/plugin-workflow-json-variable-mapping 提供）
  - [循环](./process-control/loop.md)（插件 @tachybase/plugin-workflow-loop 提供）
  - [并行分支]（插件 @tachybase/plugin-workflow-parallel 提供）
  - [流程输出]（插件 @tachybase/plugin-workflow-subflow 提供）
  - [调用工作流]（插件 @tachybase/plugin-workflow-subflow 提供）
  - [自定义变量]（插件 @tachybase/plugin-workflow-variable 提供）
- 计算类
  - [运算](./calculation/index.md)
  - [日期计算]（插件 @tachybase/plugin-workflow-date-calculation 提供）
  - [动态表达式运算](./calculation/dynamic-calculation.md)（插件 @tachybase/plugin-workflow-dynamic-calculation 提供）
  - [JSON 计算]（插件 @tachybase/plugin-workflow-json-query 提供）
- 数据表操作
  - [新增数据](./collection/create.md)
  - [更新数据](./collection/update.md)
  - [删除数据](./collection/destroy.md)
  - [查询数据](./collection/query.md)
  - [聚合查询](./collection/aggregate.md)（插件 @tachybase/plugin-workflow-aggregate 提供）
  - [SQL 操作](./collection/sql.md)（插件 @tachybase/plugin-workflow-sql 提供）
- 人工处理
  - [人工处理](./manual/manual.md)（插件 @tachybase/plugin-workflow-manual 提供）
  - [审批](./manual/approval.md)（插件 @tachybase/plugin-workflow-approval 提供）
- 其他扩展
  - [TypeScript](./extension-type/typeScript.md)（插件 @tachybase/plugin-workflow-javascript 提供）
  <!-- - [邮件发送](./mailer.md)（插件 @tachybase/plugin-workflow-mailer 提供） -->
  <!-- - [通知](./notification.md)（插件 @tachybase/plugin-workflow-notification 提供） -->
  - [HTTP 请求](./extension-type/request.md)（插件 @tachybase/plugin-workflow-request 提供）
  - [响应消息]（插件 @tachybase/plugin-workflow-response-message 提供）