# Editor Class

**Main Function:** Page edit box, dynamic position update, line break, set table value, suggestion trigger, validator related

Calling method:

```js
// instance is the instance you created, public methods can be called directly, private methods cannot
instance.sheet.editor.publicFn(args);
```

## Description

These help you understand the purpose of this file

## Private Methods

### resetTextareaSize()

Dynamic refresh edit box width and height setting function

### insertText({ target }, itxt)

Insert text value

`@param {target}` Target edit box

`@param itext` Rule

### keydownEventHandler(evt)

Listen to keyboard press event trigger function

`@param evt` Trigger event object

### inputEventHandler(evt)

Listen to edit box `textarea` input event trigger function

`@param evt` Trigger event object

### setTextareaRange(position)

Set cursor position in edit box `textarea`

`@param position` Position

### setText(text, position))

Set cursor position in edit box `textarea` and set value

`@param text` Target value

`@param position` Position where cursor should be set

### suggestItemClick(it)

Set suggestion box click event in input state

`@param it` Clicked target object value

### resetSuggestItems()

Reset suggestion box content setting function

### dateFormat(d)

Date formatting

`@param d` Date object

## Public Methods

Uniformly use `instance.function` to call

### setFreezeLengths(width, height)

Save frozen row and column set width and height to configuration for calculation

`@param width` Total width of frozen columns

`@param height` Total height of frozen rows

### clear()

Clear all input states, set to default value

### setOffset(offset, suggestPosition = 'top')

Set editor offset, positioning

`@param offset` Offset object

`@param suggestPosition` Set whether position is above or below the edit box `textarea`, two values `top` | `bottom`

### setCell(cell, validator)

Set cell value and load validator

`@param cell` Cell
`@param validator` Validation rule

### setText(text)

Set value and update input box size

`@param text` Target value
