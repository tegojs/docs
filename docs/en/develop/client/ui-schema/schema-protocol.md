# Schema Protocol

A protocol for describing frontend components, based on Formily Schema 2.0, JSON Schema style.

```typescript
interface ISchema {
  type: 'void' | 'string' | 'number' | 'object' | 'array';
  name?: string;
  title?: any;
  // Wrapper component
  ['x-decorator']?: string;
  // Wrapper component properties
  ['x-decorator-props']?: any;
  // Dynamic wrapper component properties
  ['x-use-decorator-props']?: any;
  // Component
  ['x-component']?: string;
  // Component properties
  ['x-component-props']?: any;
  // Dynamic component properties
  ['x-use-component-props']?: any;
  // Display status, default is 'visible'
  ['x-display']?: 'none' | 'hidden' | 'visible';
  // Component's child nodes, simple use
  ['x-content']?: any;
  // Children node schema
  properties?: Record<string, ISchema>;

  // The following are only used for field components

  // Field linkage
  ['x-reactions']?: SchemaReactions;
  // Field UI interaction mode, default is 'editable'
  ['x-pattern']?: 'editable' | 'disabled' | 'readPretty';
  // Field validation
  ['x-validator']?: Validator;
  // Default data
  default: ?:any;

  // Designer related

  // Initializer, determines what can be inserted at adjacent positions of current schema
  ['x-initializer']?: string;
  ['x-initializer-props']?: any;

  // Block settings, determines what parameters current schema can configure
  ['x-settings']?: string;
  ['x-settings-props']?: any;

  // Toolbar component
  ['x-toolbar']?: string;
  ['x-toolbar-props']?: any;
}
```
