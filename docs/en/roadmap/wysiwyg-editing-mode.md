# WYSIWYG Editing Mode Enhancement

## Overview

This is a significant user experience improvement initiative aimed at transforming Tachybase's editing mode from traditional editor to a modern WYSIWYG (What You See Is What You Get) editing mode similar to collaborative tools like Lark/Feishu.

## Current Pain Points

The current editing mode has the following issues:

1. **Scattered Operations**: Toolbar, initializer, and settings functions are dispersed across different locations, increasing the learning curve for users
2. **UI Intrusiveness**: Editing operations often interfere with the block's UI display, affecting user experience
3. **Inconvenient Layout Adjustment**: Lacks intuitive drag-and-drop layout capabilities; adjusting page structure requires multiple operations
4. **Separation of Editing and Preview**: Users find it difficult to intuitively see the final result during the editing process

## Improvement Plan

### Core Design Philosophy

Adopt a **non-intrusive editing** design philosophy, where editing functionality serves content rather than interfering with content display.

### Key Features

#### 1. Unified Block Toolbar

Provide a unified toolbar above each block, integrating the original three functional modules and expanding with more practical features:

**Toolbar Features Include:**

- **Block Title**: Directly editable block name, click to modify
- **Toolbar**: Provides quick action buttons like copy, delete, move, etc.
- **Initializer**: Quickly add new content blocks or components
- **Settings**: Configure various properties and parameters of the current block
- **Debug Tools**: Developer assistance features like viewing Schema, logs, etc.
- **More Actions**: Access additional functions through dropdown menu

**Visual Design:**

The UI team has established complete visual specifications with a modern design style for the toolbar:

```
┌─────────────────────────────────────────────────────────────────────┐
│  [✏️Block Name] [📋] [✂️] [🗑️] [➕] [⚙️] [🐛] [⋮More]            │ ← Unified Toolbar
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                        Block Content Area                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

- **Hover Activation**: Toolbar displays when mouse hovers over the block
- **Semi-transparent Background**: Toolbar uses subtle transparency to reduce visual interference
- **Icon-based Design**: All operations represented with intuitive icons
- **Responsive Layout**: Automatically adjusts toolbar display based on block width

**Advantages:**
- All editing operations centralized in one place, reducing learning costs
- Toolbar positioned outside the block, not interfering with content display
- Dynamically displays relevant functions based on block type
- Professional visual design enhances overall quality

#### 2. Drag-and-Drop Layout Capability

Provide intuitive drag-and-drop operations, allowing users to:

- **Drag to Move**: Directly drag blocks to adjust position
- **Drag to Resize**: Adjust block size by dragging edges
- **Drag to Create**: Drag from component library to create new blocks
- **Visual Feedback**: Provide clear drag preview and drop zone indicators

**Interaction Example:**

```
Before dragging:
┌──────┐ ┌──────┐
│Block A│ │Block B│
└──────┘ └──────┘

During drag (showing dashed preview):
┌ ─ ─ ─┐ ┌──────┐
│Preview│ │Block B│
└ ─ ─ ─┘ └──────┘
         👆Dragging

After dragging:
┌──────┐ ┌──────┐
│Block B│ │Block A│
└──────┘ └──────┘
```

#### 3. Non-Intrusive Editing

Design Principles:

- **Floating Display**: Toolbar only appears on hover or selection, hidden otherwise
- **Minimal Interference**: Toolbar uses semi-transparent design, not blocking key content
- **Maintain Original Appearance**: In edit mode, block content is exactly as final display
- **Quick Toggle**: Provide shortcuts to quickly enter/exit edit mode

**Compact Toolbar for Internal Fields:**

For individual fields and components within blocks, a more streamlined compact toolbar design is adopted:

```
┌─────────────────────────────────────────┐
│  Dropdown Checkbox            [📋] [🗑️]│ ← Show only 2 most-used icons
├─────────────────────────────────────────┤
│  [Select...  ▼]                         │
└─────────────────────────────────────────┘
```

**Compact Toolbar Characteristics:**

- **Maximum 2 Icons Displayed**: Only show the most commonly used operations (e.g., copy, delete)
- **More Actions Dropdown Menu**: Click "More" icon (⋮) to expand full operation list
- **Context-Aware**: Dynamically displays most relevant operations based on field type
- **Lightweight Design**: Minimal space footprint, reducing interference with original UI to the minimum

```
┌─────────────────────────────────────────┐
│  Single Line Text      [📋] [⋮More ▼]   │ ← Click "More" to expand menu
├─────────────────────────────────────────┤
│  [Enter text...]                         │
└─────────────────────────────────────────┘
                                    ↓
                            ┌──────────────┐
                            │ 📋 Copy       │
                            │ ✂️ Cut        │
                            │ 🗑️ Delete     │
                            │ ⚙️ Settings   │
                            │ 🔄 Replace    │
                            │ 📏 Resize     │
                            └──────────────┘
```

**Actual Interface Example:**

The image below shows the actual form editing interface, where you can see:
- The unified toolbar at the top contains the block title and various action icons
- Each field has a compact toolbar on the right showing the most commonly used action icons
- The interface is clean and clear, with editing tools not interfering with content display

![Form Editing Interface Example](/public/wysiwyg-form-editing-example.png)

This design ensures complete editing functionality while maximizing the simplicity of the original interface.

#### 4. WYSIWYG Editing Experience

Reference modern editors like Lark, Notion for interaction:

- **Real-time Preview**: Any modification is immediately reflected in the interface
- **Inline Editing**: Edit directly on content, no modal dialogs needed
- **Smart Suggestions**: Provide intelligent suggestions and auto-completion during input
- **Quick Formatting**: Support Markdown shortcuts and rich text toolbar

## Technical Implementation Points

### Frontend Architecture

1. **Component-based Design**
   - Abstract unified `CardToolbar` component
   - Implement pluggable toolbar plugin system
   - Provide standardized toolbar API

2. **Drag System**
   - Based on HTML5 Drag and Drop API
   - Implement unified drag event management
   - Provide global Store for drag state

3. **UI Schema Enhancement**
   - Extend Schema protocol to support new editing mode
   - Maintain backward compatibility
   - Provide migration tools to assist upgrades

### Interaction Optimization

1. **Performance Optimization**
   - Use virtual scrolling for handling large number of blocks
   - Implement lazy loading for toolbar
   - Optimize rendering performance during drag operations

2. **Accessibility**
   - Support keyboard shortcuts
   - Provide screen reader support
   - Ensure color contrast meets standards

## Expected Benefits

### User Experience Improvement

- **Reduced Learning Curve**: Unified operation entry point, aligned with modern editor usage habits
- **Improved Editing Efficiency**: Drag operations reduce clicks, quickly complete page layout
- **Better Visual Experience**: Non-intrusive design lets users focus on content itself

### Developer Friendly

- **Unified API**: Simplify plugin development, reduce extension difficulty
- **Better Maintainability**: Modular functionality, easy for future iterations
- **Standardized Interfaces**: Promote ecosystem development, encourage community contributions

### Product Competitiveness

- **Benchmark First-class Products**: Editing experience aligned with Notion, Lark, etc.
- **Differentiation Advantage**: Combined with Tachybase's flexibility, provide more powerful customization capabilities
- **Attract New Users**: Modern editing experience lowers user migration barriers

## Compatibility Notes

To ensure a smooth transition, we will:

1. **Maintain Backward Compatibility**: Existing editing modes remain available
2. **Progressive Migration**: Provide migration tools and detailed documentation
3. **Configuration Options**: Allow users to switch between new and old modes
4. **Thorough Testing**: Ensure no impact on existing functionality

## Reference Cases

- **Lark/Feishu Docs**: Inline editing, drag layout
- **Notion**: Block-level editing, unified toolbar
- **Yuque**: WYSIWYG, quick operations
- **Craft**: Non-intrusive design, elegant interaction

## Summary

This improvement plan will bring a qualitative leap to Tachybase. Through a modern editing experience, we can:

- Significantly reduce user learning and usage costs
- Enhance overall product competitiveness
- Lay a solid foundation for future feature expansion

We look forward to this improvement making Tachybase an even more user-friendly and powerful low-code platform.

## Related Resources

- [UI Schema Design Protocol](/develop/client/ui-schema/schema-protocol)
- [Schema Toolbar Development](/develop/client/ui-schema/schema-toolbar)
- [Schema Settings Development](/develop/client/ui-schema/schema-settings)
- [Schema Initializer Development](/develop/client/ui-schema/schema-initializer)

