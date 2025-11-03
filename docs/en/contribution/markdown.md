# How to Write Markdown Documents

## Headings

Use # marks at the beginning, with a space in between, corresponding to h1-h6

**Note:** Search functionality only applies to first through third-level headings (h1-h3)

### First-Level Heading

There should be one and only one

```html
# Text
```

### Second-Level Heading

```html
## Text
```

### Third-Level Heading

```html
### Text
```

### Fourth-Level Heading

```html
#### Text
```

### Fifth-Level Heading

```html
##### Text
```

### Sixth-Level Heading

```html
###### Text
```

## Bold and Italic

You can use `*` or `_` as marks to make text bold or italic

### Bold

Use `**` or `__` as marks, appearing in pairs

::: tip Example
`**Your text**` : **Your text**

`__Your text__` : **Your text**
:::

### Italic

Use `*` or `_` as marks, appearing in pairs

::: tip Example
`*Your text*` : _Your text_

`_Your text_` : _Your text_
:::

### Bold Italic

Use `***` or `___` as marks, appearing in pairs

:::tip Example
`***Your text***` : **_Your text_**

`___Your text___` : **_Your text_**  
:::

## Lists

### Ordered Lists

Use 1. as marks, with English punctuation

:::tip This is an ordered list `1. Test`

1. Test
2. Test
   :::

### Unordered Lists

Can use `-`, `+`, `*` to write unordered lists

::: tip Example `- Test`, `+`, `*` are all the same

- Test

- Test

:::

## Quotes

Use `>` marks at the beginning, can be nested

::: tip Example

> This is a quote 1
>
> > This is a quote 2
> >
> > > This is a quote 3

:::

Quotes can be used in lists

## Code Blocks

Inline code blocks can use "`" marks, appearing in pairs

`Test text`

Multi-line wrapped code blocks use " ```javascript/php/typescript... " to wrap, appearing in pairs, with language annotation after the opening mark

```js
const txt = 'test';
```

## Hyperlinks

Add hyperlinks to pages using `[text](address)` or directly using address `<address>`

:::tip Example
`[text](address)`: [Baidu](https://www.baidu.com)

`<address>`: <https://www.baidu.com>
:::

## Images

Add images to pages using `![text description](address)`

::: tip Example
`![test address](http://bbs.cnlinfo.net/up/tou/150611164743.jpg)`:![test address](http://bbs.cnlinfo.net/up/tou/150611164743.jpg)
:::

## Tables

Quickly embed tables

```html
| Header | Header | | ---- | ---- | // Can use alignment, :- left align, -: right align, :-:
center align | Cell | Cell | | Cell | Cell |
```

::: tip Example
| Header | Header |
| ---- | ---- |
| Cell | Cell |
| Cell | Cell |
:::
