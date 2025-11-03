# data_proxy Data-Driven Core Class

Data core class, which proxies many functions

```js
// instance is the instance you created, public methods can be called directly, private methods cannot
instance.data.publicFn(args);
// or
instance.sheet.data.publicFn(args);
```

## Private Methods

### Method: `canPaste`

Called before paste to determine if paste is possible

`@param {Object}` src Object wrapped by cellRange, source cell

`@param {Object}` dst Object wrapped by cellRange, target cell

`@param {Function}` error Error callback, called when target cell contains merge

`@returns {boolean}` Whether paste is possible

```js
function canPaste(src, dst, error = () => {}) {
  // Normally returns Boolean type
  // If target cell contains merge, call error() and return false
})
```

### Method: `copyPaste`

Used when pasting copied cells, to copy source cell to target cell

`@param {Object}` srcCellRange Object wrapped by cellRange, source cell

`@param {Object}` dstCellRange Object wrapped by cellRange, target cell

`@param {String}` what Copy condition all (all) | format (format only)

`@param {Boolean}` autofill Whether to autofill, default false

```js
function copyPaste(srcCellRange, dstCellRange, what, autofill = false) {
  // According to what condition
  // Call rows.copyPaste to copy cells
})
```

### Method: `cutPaste`

Used when pasting cut cells, to copy source cell to target cell

`@param {Object}` srcCellRange Object wrapped by cellRange, source cell

`@param {Object}` dstCellRange Object wrapped by cellRange, target cell

`@param {String}` what Copy condition all (all) | format (format only)

`@param {Boolean}` autofill Whether to autofill, default false

```js
function cutPaste(srcCellRange, dstCellRange) {
  // Call rows.cutPaste to paste cut cells
})
```

### Method:`setStyleBorder`

Set border of specified cell

`@param {Number}` ri Row index

`@param {Number}` ci Column index

`@param {Object}` bss Border style

```js
function setStyleBorder(ri, ci, bss) {
  // Add bss style to style data through this.addStyle method, and set the returned style index to cell.style cell data
})
```

### Method:`setStyleBorders`

Batch set borders for multiple cells based on current selection (this.selector)

`@param {String}` mode all (all) | inside (inner border) | outside (outer border) | horizontal (horizontal border) | vertical (vertical border) | none (no border)

`@param {String}` style Border style

`@param {String}` color Border color

```js
function setStyleBorders({ mode, style, color }) {
  // Set border according to mode
})
```

### Method:`getCellRowByY`

Get row index based on Y coordinate

`@param {Number}` y Y coordinate

`@param {Number}` scrollOffsety Scrollbar Offset Y

`@returns {Object}` Object with ri row index

```js
function getCellRowByY(y, scrollOffsety) {
  // Return { ri, top, height } based on Y coordinate
})
```

### Method: `getCellRowByX`

Get cell by X coordinate

Get row index based on X coordinate

`@param {Number}` x X coordinate

`@param {Number}` scrollOffsety Scrollbar Offset X

Return format

```ts
interface ICellRetun {
  ci: number;
  left: number;
  width: number;
}
```

## DataProxy Class

### Method: `addValidation(mode, ref, validator)`

Add validation

@param mode Edit mode

@param ref Reference range

@param validator Validator

### Method: `removeValidation()`

Remove validation range

### Method: `getSelectedValidator()`

Get filter or validator of selected range class

### Method: `getSelectedValidation()`

Get specific information of filter or validator of selected range class

### Method: `canUndo()`

Whether can undo, undo operation

### Method: `canRedo()`

Whether can redo

### Method: `undo()`

Undo one step

### Method: `redo()`

Redo one step

### Method: `copy()`

Copy current selection

### Method: `copyToSystemClipboard()`

Copy to system clipboard

### Method: `cut()`

Integrated cut event

### Method: `paste(what, error)`

Paste event

@param what: all (all) | text (text) | format (format)

@param error: Function

### Method: `pasteFromText(txt)`

Paste text

@param txt: string

### Method: `autofill(cellRange, what, error)`

Autofill

@param cellRange: CellRange

@param what: all (all) | text (text) | format (format)

@param error: Function

### Method: `clearClipboard()`

Clear clipboard data

### Method: `calSelectedRangeByEnd(ri, ci)`

Calculate selection range by end coordinate

@param ri Row index

@param ci Column index

### Method: `calSelectedRangeByStart(ri, ci)`

Calculate selection range by start coordinate

@param ri Row index

@param ci Column index

### Method: `setSelectedCellAttr(property, value)`

Set selected cell attributes

@param property: string Property

@param value: string | number | unknown

### Method: `setSelectedCellText(text, state = 'input)`

Set selected cell text

@param text: string Text

@param state: string Current input state

### Method: `getSelectedCell()`

Get current selected cell

### Method: `xyInSelectedRect()`

Determine if current mouse click coordinates are in selected range

### Method: `getSelectedRect()`

Get selected rectangular area

### Method: `getClipboardRect()`

Get current clipboard selected area

### Method: `getRect(cellRange)`

Get set selected range area

@param cellRange: CellRange

### Method: `getCellRectByXY(x, y)`

Get current selected area by mouse x and y coordinates

@param x: number

@param y: number

### Method: `isSignleSelected()`

Determine if single selection

### Method: `canUnmerge()`

Can unmerge

### Method: `merge()`

Merge

### Method: `unmerge()`

Don't merge, undo merge

### Method: `canAutofilter()`

Can auto filter

### Method: `autofilter()`

Filter

### Method: `setAutoFilter(ci, order, operator, value)`

Set filter

@param ci Column index

@param order Sort method

@param operator Operation

@param value Value

### Method: `resetAutoFilter()`

Reset auto filter

### Method: `deleteCell(what = 'all')`

Delete cell

@param what: string all (all) | format (format)

### Method: `insert(type, n = 1)`

Insert row or column

@param type: string Possible values row | column

@param n: number > 0

### Method: `delete(type)`

Delete selected row or column

@param type: string Possible values row | column

### Method: `scrollx(x, cb)`

Scroll x distance to trigger cb

@param x: number Distance

@param cb: Function Triggered callback function

### Method: `scrolly(y, cb)`

Scroll y distance to trigger cb

@param y: number Distance

@param cb: Function Triggered callback function

### Method: `cellRect(ri, ci)`

Return specific coordinate information of current cell

@param ri: number Row index

@param ci: number Column index

### Method: `getCell(ri, ci)`

Get current cell by index

@param ri: number Row index

@param ci: number Column index

### Method: `getCellTextOrDefault(ri, ci)`

Get current cell text or default value

@param ri: number Row index

@param ci: number Column index

### Method: `getCellStyle(ri, ci)`

Get current cell style

@param ri: number Row index

@param ci: number Column index

### Method: `getCellStyleOrDefault(ri, ci)`

Get current cell style or default value

@param ri: number Row index

@param ci: number Column index

### Method: `getSelectedCellStyle()`

Get current selected cell style

### Method: `setCellText(ri, ci, text, state)`

Set specified cell value and update input state

@param ri: number Row index

@param ci: number Column index

@param text: string Text

@param state: string input | finished

### Method: `freezeIsActive()`

Whether freeze can be activated

### Method: `setFreeze(ri, ci)`

Set freeze bar

@param ri: number Row index

@param ci: number Column index

### Method: `freezeTotalWidth()`

Get total width of freeze bar

### Method: `freezeTotalHeight()`

Get total height of freeze bar

### Method: `setRowHeight(ri, height)`

Set height of a certain row

@param ri: number Row index

@param height: number Row height

### Method: `setColWidth(ci, width)`

Set width of a certain column

@param ci: number Column index

@param width: number Column width

### Method: `viewHeight()`

Get visible area height

### Method: `viewWidth()`

Get visible area width

### Method: `freezeViewRange()`

Get freeze range

### Method: `contentRange()`

Get text area display range

### Method: `exceptRowTotalHeight(sri, eri)`

Get total height after excluding rows

### Method: `viewRange()`

Get visible area display range

### Method: `eachMergesInView(viewRange, cb)`

Callback triggered when each merge occurs

@param viewRange: ViewRange

@param cb: Function

### Method: `hideRowsOrCols()`

Hide selected columns or rows

### Method: `unhideRowsOrCols(type, index)`

Unhide rows or columns

@param type: row | col

@param index: row-index | col-index

### Method: `rowEach(min, max, cb)`

Row traversal, can specify range

@param min: number Minimum row

@param max: number Maximum row

@param cb: Function

### Method: `colEach(min, max, cb)`

Column traversal, can specify range

@param min: number Minimum column

@param max: number Maximum column

@param cb: Function

### Method: `defaultStyle()`

Get default style

### Method: `addStyle(nstyle)`

Set multiple styles

@param nstyle object

### Method: `changeData(cb)`

Set callback function when data changes

@param cb: Function

### Method: `setData(d)`

Set table data, if you don't know d, you can get a default one first through the getData() method

@param d: object

### Method: `getData()`

Get current table data
