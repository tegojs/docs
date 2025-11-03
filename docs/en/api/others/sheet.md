# Sheet Class

**Main Function:** Table initialization, event initialization, binding. Calling method:

```js
// instance is the instance you created, public methods can be called directly, private methods cannot
instance.sheet.publicFn(args);
```

## Instance Properties

For in-depth learning, instance property overview

### eventMap

`eventMap` Initialize event Map object, similar to event management center, mounted on Sheet class

### el

`el` Initialize Sheet instance's element object, **element:** is rewritten element object, not native dom object, mounted on Sheet class

### toolbar

`toolbar` Initialize toolbar instance object, mounted on Sheet class

### print

`print` Initialize print instance object, mounted on Sheet class

### data

`data` Initialize data_proxy instance object, mounted on Sheet class

### tableEl

`tableEl` Initialize table instance's element instance, mounted on Sheet class

### rowResizer

`rowResizer` Initialize row adjustment instance object, mounted on Sheet class

### colResizer

`colResizer` Initialize column adjustment instance object, mounted on Sheet class

### verticalScrollbar

`verticalScrollbar` Initialize vertical scrollbar instance object, mounted on Sheet class

### horizontalScrollbar

`horizontalScrollbar` Initialize horizontal scrollbar instance object, mounted on Sheet class

### editor

`editor` Initialize table edit function instance object, mounted on Sheet class

### modalValidation

`modalValidation` Initialize format validation instance object, mounted on Sheet class

### contextMenu

`contextMenu` Initialize right-click menu instance object, mounted on Sheet class

### selector

`selector` Initialize selector instance object, function involves click operation, mounted on Sheet class

### overlayerEl

`overlayerEl` Initialize overlay dom instance object, mounted on Sheet class

### sortFilter

`sortFilter` Initialize filter instance object, mounted on Sheet class

### table

`table` Initialize table instance object, mounted on Sheet class

## Private Methods

### scrollbarMove()

Scrollbar scroll event setting

### selectorSet()

Table selector setting

### selectorMove()

Table selector movement setting

### overlayerMousemove(evt)

Table overlay mouse down move event

`@param evt` Event object

### overlayerMousescroll(evt)

Table overlay mouse scroll event

`@param evt` Event object

### overlayerTouch(direction, distance)

Table overlay touch event

`@param direction` Direction

`@param distance` Distance

### verticalScrollbarSet()

Vertical scrollbar setting

### horizontalScrollbarSet()

Horizontal scrollbar setting

### sheetFreeze()

Freeze row and column setting function

### sheetReset()

Table reset refresh function

### clearClipboard()

Clear clipboard

### copy()

Copy function

### cut()

Cut function

### paste()

Paste function

### hideRowsOrCols()

Hide rows and columns function

### unhideRowsOrCols(type, index)

Unhide rows or columns

`@param type` row | col

`@param index` rowIndex | colIndex

### autofilter()

Auto filter function

### toolbarChangePaintformatPaste()

Format paste

### overlayerMousedown(evt)

Overlay mouse down operation

`@param evt` event object

### editorSetOffset()

Editor layer offset

### editorSet()

Editor layer setting

### verticalScrollbarMove(distance)

Vertical scrolling setting

`@param distance` Distance

### horizontalScrollbarMove(distance)

Horizontal scrolling setting

`@param distance` Distance

### rowResizerFinished(cRect, distance)

Adjust row end event

`@param cRect` Boundary

`@param distance` Distance

### colResizerFinished(cRect, distance)

Adjust column end event

`@param cRect` Boundary

`@param distance` Distance

### dataSetCellText(text, state = 'finished')

Set data and re-refresh table

`@param text` Text

`@param state` Input state

### insertDeleteRowColumn(type)

Integrate table functionality

`@param type` Function type

### toolbarChange(type, value)

Event triggered when toolbar changes

`@param type` Function type

`@param value` Target result value

### sortFilterChange(ci, order, operator, value)

Filter change event

`@param ci` Column id

`@param order` Order

`@param operator` Operation value

`@param value` Result value

### sheetInitEvents()

Table initialization bind events

## Public Methods

### on(eventName, func)

Can be called through instantiated Sheet instance, bind event function

`@param eventName` Event name

`@param func` Custom event

Calling method `instance.on(eventName, func){}`

### trigger(eventName, ...args)

Can be called through instantiated Sheet instance, listen trigger function

`@param eventName` Event name

`@param ...args` One or more parameters

Calling method `instance.trigger(eventName, ...args){}`

### resetData(data)

Can be called through instantiated Sheet instance, reset refresh table

`@param data` Data

Calling method `instance.resetData(data)`

### loadData(data)

Can be called through instantiated Sheet instance, load necessary data

`@param data` Data

Calling method `instance.loadData(data)`

### freeze(ri, ci)

Can be called through instantiated Sheet instance, set freeze row/column

`@param ri` Row index

`@param ci` Column index

Calling method `instance.freeze(ri, ci)`

### undo()

Mount undo function

Calling method `instance.undo()`

### redo()

Mount redo function

Calling method `instance.redo()`

### reload()

Reload table, initialize events, etc.

Calling method `instance.reload()`

### getRect()

Can get current table width and height, not including index bar and table title bar

Calling method `instance.getRect()`

### getTableOffset()

Can get current table width and height, left, top to get current table's detailed offset information

Calling method `instance.getTableOffset()`
