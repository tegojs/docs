# JSON Template

## Introduction

In JSON templates, variables are in string format, so they need to be wrapped in double quotes like strings {{xxxx}}. When parsing variables, the variable's value will be converted to the corresponding type based on its actual content. In other words, although the variable itself is in string format, its parsed value is not necessarily a string type.

## Example

JSON template is

```json
{
  "key1": "{{current.key1}}",
  "key2": "{{current.key2}}",
  "key3": "{{current.key3}}",
  "key4": "{{current.key4}}",
  "key5": "{{current.key5}}",
  "key6": "{{current.key6}}",
  "key7": {
    "key1": "{{current.key1}}",
    "key2": "{{current.key2}}"
  },
  "key8": ["{{current.key1}}", "{{current.key3}}"],
  "key9": "{{current.key1}} - \"{{current.key3}}\" - {{current.key3}} - val9"
}
```

current variable is

```json
{
  "key1": "val1",
  "key2": null,
  "key3": 3,
  "key4": {"k": "v"},
  "key5": [1, 2, 3],
  "key6": undefined
}
```

Parsed result is

```json
{
  "key1": "val1",
  "key2": null,
  "key3": 3,
  "key4": {"k": "v"},
  "key5": [1, 2, 3],
  "key7": {
    "key1": "val1",
    "key2": null
  },
  "key8": ["val1", 3],
  "key9": "val1 - \"3\" - 3 - val9"
}
```
