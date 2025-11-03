# Spreadsheet

Main entry class, involving table initialization and data initialization

Calling method:

```js
// instance is the instance you created, public methods can be called directly, private methods cannot
instance.publicFn(args);
```

## Main Instance

Uniformly exposed under `window`

```javascript
// You can access on window
const spreadsheet = (el, options = {}) => new Spreadsheet(el, options);
if (window) {
  window.x_spreadsheet = spreadsheet;
  window.x_spreadsheet.locale = (lang, message) => locale(lang, message);
}
// You can create like this
const xs = x_spreadsheet(id, config);
```

You can also use the library as your development directory

```js
// index.js This is the default export
export default Spreadsheet;
export { spreadsheet };
// you local main page
// You can directly import the local library
import Spreadsheet from '[path]';
```

## Public Methods

### addSheet(name, active)

**Function** Add multiple sheets

`@param name` string Name

`@param active` boolean Default is true

### cell(ri, ci, sheetIndex)

**Function** Get cell content

`@param ri` number Row coordinate

`@param ci` number Column coordinate

`@param sheetIndex` number Default value: 0, current table index

### cellStyle(ri, ci, sheetIndex)

**Function** Get cell style properties

`@param ri` number Row coordinate

`@param ci` number Column coordinate

`@param sheetIndex` number Default value: 0, current table index

### cellText(ri, ci, text, sheetIndex)

**Function** Set the value of a cell in the selected table

`@param ri` number Row coordinate

`@param ci` number Column coordinate

`@param text` string

`@param sheetIndex` number Default value: 0, current table index

### reRender()

**Function** Re-refresh the entire table

### deleteSheet()

**Function** Delete current sheet

### loadData(data) Load data

`@param {data}` json Data format

**How to get data format:** Please use the `getData()` method

```js
import Spreadsheet from 'x-data-spreadsheet';

const xs = new Spreadsheet('#x-spreadsheet-demo');

// data is json format
// Load data
xs.loadData(data);
```

### getData() Get data

Get data

```js
// Get data d
const d = xs.getData();
```

### change(callback) Change event

Page operation or data change

```js
// Like
xs.change(function (data) {
  // Will return the entire data json by default
});
```

### locale(lang, message) Localization

```js
// Load language pack, need to introduce localization file via cdn or import from local
xs.locale('zh-cn');
```

### on(eventName, callback) Bind event

Listen to events

```js
xs.on('cell-selected', function (cell, ri, ci) {
  // to do ...
});
```
