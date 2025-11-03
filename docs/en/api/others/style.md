# Style Reference Table

```javascript
const style = [
  {
    border: {
      bottom: ['thick', '#000'],
    },
    color: '#ddd',
    bgColor: '#eee',
    font: {
      italic: true,
      size: 16,
      name: 'YaHei',
      bold: true,
    },
    underline: true,
    valign: 'middle',
    align: 'center',
  },
];
```

## border - Border Style

> border Border style data ['border style', 'border color']
> thick, thin, medium corresponding border styles are: solid

bottom

| bottom             | cssStyle                       |
| ------------------ | ------------------------------ |
| ['thick', '#000']  | border-bottom: solid 3px #000  |
| ['thin', '#000']   | border-bottom: solid 1px #000  |
| ['medium', '#000'] | border-bottom: solid 2px #000  |
| ['dashed', '#000'] | border-bottom: dashed 1px #000 |
| ['dotted', '#000'] | border-bottom: dotted 1px #000 |
| ['double', '#000'] | border-bottom: double 1px #000 |

top

| top                | cssStyle                    |
| ------------------ | --------------------------- |
| ['thick', '#000']  | border-top: solid 3px #000  |
| ['thin', '#000']   | border-top: solid 1px #000  |
| ['medium', '#000'] | border-top: solid 2px #000  |
| ['dashed', '#000'] | border-top: dashed 1px #000 |
| ['dotted', '#000'] | border-top: dotted 1px #000 |
| ['double', '#000'] | border-top: double 1px #000 |

right

| right              | cssStyle                      |
| ------------------ | ----------------------------- |
| ['thick', '#000']  | border-right: solid 3px #000  |
| ['thin', '#000']   | border-right: solid 1px #000  |
| ['medium', '#000'] | border-right: solid 2px #000  |
| ['dashed', '#000'] | border-right: dashed 1px #000 |
| ['dotted', '#000'] | border-right: dotted 1px #000 |
| ['double', '#000'] | border-right: double 1px #000 |

left

| left               | cssStyle                     |
| ------------------ | ---------------------------- |
| ['thick', '#000']  | border-left: solid 3px #000  |
| ['thin', '#000']   | border-left: solid 1px #000  |
| ['medium', '#000'] | border-left: solid 2px #000  |
| ['dashed', '#000'] | border-left: dashed 1px #000 |
| ['dotted', '#000'] | border-left: dotted 1px #000 |
| ['double', '#000'] | border-left: double 1px #000 |

## color - Font Color

| color  | cssStyle    |
| ------ | ----------- |
| '#HEX' | color: #HEX |

## bgColor - Background Color

| bgcolor | cssStyle              |
| ------- | --------------------- |
| '#HEX'  | backgroundColor: #HEX |

## font - Font Style

> italic Font italic effect, italic is true value is: italic
> \${} means get value

| font   | cssStyle              |
| ------ | --------------------- |
| italic | font-style: italic    |
| size   | font-size: \${size}   |
| bold   | font-weight: bold     |
| name   | font-family: \${name} |

## underline - Text Underline

> underline Text underline style, underline is true value is: underline

| underline | cssStyle                   |
| --------- | -------------------------- |
| true      | text-decoration: underline |

## strike - Text Strikethrough

> strike Text strikethrough style, strike is true line-through

| strike | cssStyle                      |
| ------ | ----------------------------- |
| true   | text-decoration: line-through |

## valign - Text Vertical Alignment Display Method

| valign | cssStyle               |
| ------ | ---------------------- |
| bottom | vertical-align: bottom |
| middle | vertical-align: middle |
| top    | vertical-align: top    |

## align - Text Horizontal Alignment Display Method

| align  | cssStyle           |
| ------ | ------------------ |
| center | text-align: center |
| left   | text-align: left   |
| right  | text-align: right  |
