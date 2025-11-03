# Quick Start

````

## Default Configuration

```javascript
{
  mode: 'edit', // edit | read
  showToolbar: true,
  showGrid: true,
  showContextmenu: true,
  view: {
    height: () => document.documentElement.clientHeight,
    width: () => document.documentElement.clientWidth,
  },
  row: {
    len: 100,
    height: 25,
  },
  col: {
    len: 26,
    width: 100,
    indexWidth: 60,
    minWidth: 60,
  },
  style: {
    bgcolor: '#ffffff',
    align: 'left',
    valign: 'middle',
    textwrap: false,
    strike: false,
    underline: false,
    color: '#0a0a0a',
    font: {
      name: 'Helvetica',
      size: 10,
      bold: false,
      italic: false,
    },
  },
}
````

## Import and Export

For how to export, please [see](https://github.com/SheetJS/sheetjs/tree/master/demos/xspreadsheet#saving-data)
If you need custom export functionality, you can use [SheetJs](https://github.com/SheetJS/sheetjs) to complete the export, and thanks again

## Event Binding

Simple event binding

```js
const s = new Spreadsheet('#x-spreadsheet-demo');
// event of click on cell
s.on('cell-selected', (cell, ri, ci) => {});
s.on('cells-selected', (cell, { sri, sci, eri, eci }) => {});
// edited on cell
s.on('cell-edited', (text, ri, ci) => {});
```

## Quick Set Cell Value

Set value through `instance.cellText(ri,ci,text)`, call `reRender()` to refresh, you will see the data change

```js
const s = new Spreadsheet('#x-spreadsheet-demo');
s.cellText(5, 5, 'xxxx').cellText(6, 5, 'yyy').reRender();
```

## Get Style and Value of Selected Cell

```javascript
const s = new Spreadsheet('#x-spreadsheet-demo');
// cell(ri, ci, sheetIndex = 0)
s.cell(ri, ci);
// cellStyle(ri, ci, sheetIndex = 0)
s.cellStyle(ri, ci);
```
