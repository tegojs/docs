# Schema 协议

一种描述前端组件的协议，基于 Formily Schema 2.0，类 JSON Schema 风格。

```typescript
interface ISchema {
  type: 'void' | 'string' | 'number' | 'object' | 'array';
  name?: string;
  title?: any;
  // 包装器组件
  ['x-decorator']?: string;
  // 包装器组件属性
  ['x-decorator-props']?: any;
  // 动态包装器组件属性
  ['x-use-decorator-props']?: any;
  // 组件
  ['x-component']?: string;
  // 组件属性
  ['x-component-props']?: any;
  // 动态组件属性
  ['x-use-component-props']?: any;
  // 展示状态，默认为 'visible'
  ['x-display']?: 'none' | 'hidden' | 'visible';
  // 组件的子节点，简单使用
  ['x-content']?: any;
  // children 节点 schema
  properties?: Record<string, ISchema>;

  // 以下仅字段组件时使用

  // 字段联动
  ['x-reactions']?: SchemaReactions;
  // 字段 UI 交互模式，默认为 'editable'
  ['x-pattern']?: 'editable' | 'disabled' | 'readPretty';
  // 字段校验
  ['x-validator']?: Validator;
  // 默认数据
  default: ?:any;

  // 设计器相关

  // 初始化器，决定当前 schema 相邻位置可以插入什么
  ['x-initializer']?: string;
  ['x-initializer-props']?: any;

  // 区块设置，决定当前 schema 可以配置哪些参数
  ['x-settings']?: string;
  ['x-settings-props']?: any;

  // 工具栏组件
  ['x-toolbar']?: string;
  ['x-toolbar-props']?: any;
}
```
