# Block Height

## Introduction

Block height setting supports three situations: default height, specified height, and full height. Most blocks support height setting (Gantt chart block does not support it yet, chart block controls height through parameters).

### Default

Different types of blocks have different default height processing. For example, table and form blocks adapt height based on content, while kanban blocks have a default height set to 70% of the viewport height.
### Specified Height

Users can specify the total height of the block's outer frame. The block automatically calculates and allocates height internally.


### Full Height

Similar to specified height, full height mode automatically calculates and allocates block height based on the height of the window's visible area. The page will not have scroll bars; scroll bars will only appear inside the block.

Different blocks have detail differences in height processing:

- Table: tbody internal scrolling;
- Form/Details: Scrolling within Grid, that is, the part excluding actions scrolls;
- List/Grid Card: Scrolling within Grid, that is, the part excluding actions and pagination bar scrolls;
- Kanban: Column height (scroll bar inside each column);
- Map and Calendar: (Overall adaptive height, no scroll bar);
- Iframe/Markdown: Limits the total height of the block's outer frame, scroll bar appears inside the block;

#### Table Full Height


#### Form Full Height
