# 快速上手

````

## 默认配置

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

## 导入和导出

关于如何导出，请[查看](https://github.com/SheetJS/sheetjs/tree/master/demos/xspreadsheet#saving-data)
如果需要自定义导出，可以使用 [SheetJs](https://github.com/SheetJS/sheetjs) 来完成导出，并且再次感谢

## 绑定事件

简单的事件绑定

```js
const s = new Spreadsheet('#x-spreadsheet-demo');
// event of click on cell
s.on('cell-selected', (cell, ri, ci) => {});
s.on('cells-selected', (cell, { sri, sci, eri, eci }) => {});
// edited on cell
s.on('cell-edited', (text, ri, ci) => {});
```

## 快速设定单元格值

通过`instance.cellText(ri,ci,text)`来设定值，调用`reRender()`来刷新，你将会看到数据的变化

```js
const s = new Spreadsheet('#x-spreadsheet-demo');
s.cellText(5, 5, 'xxxx').cellText(6, 5, 'yyy').reRender();
```

## 获取选定表格中单元的样式和值

```javascript
const s = new Spreadsheet('#x-spreadsheet-demo');
// cell(ri, ci, sheetIndex = 0)
s.cell(ri, ci);
// cellStyle(ri, ci, sheetIndex = 0)
s.cellStyle(ri, ci);
```
