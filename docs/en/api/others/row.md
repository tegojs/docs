# Row Class

Mainly for row and column operation settings, set height, hide rows and columns, etc. This class is mounted under the data instance, so the global calling property method is:

::: tip New Version
A separate data object is created for each individual worksheet, so you should now find the corresponding data object in instance.datas and then operate
:::

```js
// instance is the instance you created, public methods can be called directly, private methods cannot

// Your current sheet name
const target_sheet_name = `sheet2`;

const target_data = instance.datas.find((it) => it.name === target_sheet_name);

target_data.rows.publicFn(args);
```

## Instantiation

Need to pass in height and total number of rows len, in object form `{ len, height }`

## Instance Properties

### \_(underscore)

Data storage location

### len

Total number of rows

### height

Default row height

## Public Methods

### copyPaste(srcCellRange, dstCellRange, what, autofill = false, cb = () => {})

**Function** Copy paste

`@param srcCellRange` Input copy area

`@param dstCellRange` Output paste area

`@param what` type: all | format | text

`@param autofill` Autofill

`@param cb` callback

### cutPaste(srcCellRange, dstCellRange)

**Function** Cut paste

`@param srcCellRange` Input cut area

`@param dstCellRange` Output paste area

### delete(sri, eri)

**Function** Delete row

`@param sri` Start row coordinate

`@param eri` End row coordinate

### deleteCell(ri, ci, what = 'all')

**Function** Clear single cell

`@param ri` Row coordinate

`@param ci` Column coordinate

`@param what` type: all | text | format | merge Delete type

### deleteCells(cellRange, what = 'all')

**Function** Clear area cells

`@param cellRange` Cell selection

`@param what` type: all | text | format | merge Delete type

### deleteColumn(sci, eci)

**Function** Delete column

`@param sci` Start column coordinate

`@param eci` End column coordinate

### each(cb)

**Function** Enhanced each function for row

`@param cb` Callback function, accepts two parameters ri, row

### eachCells(ri, cb)

**Function** Enhanced each function for cells

`@param ri` Row index

`@param cb` Callback function, accepts two parameters ci, cell

### get(ri)

**Function** Get certain row data

`@param ri` Row index

### getCell(ri, ci)

**Function** Get cell data

`@param ri` Row index

`@param ci` Column index

### getCellMerge(ri, ci)

**Function** Get cell merge information

`@param ri` Row index

`@param ci` Column index

### getCellOrNew(ri, ci)

**Function** Get cell, if not found, return default value

`@param ri` Row index

`@param ci` Column index

### getData()

**Function** Get all row and column data

### getHeight(ri)

**Function** Get height

`@param ri` number Row index

### getOrNew(ri)

**Function** Get certain row, if not found, return default configuration

### insert(sri, n = 1)

**Function** Insert row

`@param sri` Insert start position row coordinate

`@param n` Quantity

### insertColumn(sci, n = 1)

**Function** Insert column

`@param sci` Insert start position column coordinate

`@param n` Quantity

### isHide(ri)

**Function** Check if hidden, returns Boolean

`@param ri` Row index

### maxCell()

**Function** Return bottom right cell coordinates

### paste(src, dstCellRange)

**Function** Copy function

`@param src` Input copy selection range

`@param dstCellRange` Output copy selection range

### setCell(ri, ci, cell, what = 'all')

**Function** Set cell data, object form

`@param ri` Row index

`@param ci` Column index

`@param cell` Cell object

`@param what` what: all | text | format, Set type

### setCellText(ri, ci, text)

**Function** Set cell text, value form

`@param ri` Row index

`@param ci` Column index

`@param text` string/number

### setData(d)

**Function** Set all cell data

`@param d` Incoming data

### setHeight(ri, v)

**Function** Set row height

`@param ri` Row index

`@param v` Height, value

### setHide(ri, v)

**Function** Set hide row

`@param ri` Row index

`@param v` value

### setStyle(ri, style)

**Function** Set row style

`@param ri` Row index

`@param style` Style object

### sumHeight(min, max, exceptSet)

**Function** Get spacing/height between two rows

`@param min` Row start index

`@param max` Row end index

`@param exceptSet` Exclude calculation area

### totalHeight()

**Function** Get sum of all row heights

### unhide(idx)

**Function** Unhide row

`@param idx` Row index
