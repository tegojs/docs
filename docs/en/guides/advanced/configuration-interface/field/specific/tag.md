# Tag

### Overview

Tag is a display component for read mode of relationship fields. Needs to configure title field and color field for clear identification and differentiation of different tags.

### Usage Instructions

#### Use in Table

Example: The order table has a many-to-one relationship field "Tags".
The tags table contains two fields: "Tag Name" and "Tag Color". The tag component can display tags with corresponding colors based on these two fields.
![](/field/field-15.png)

#### Use in Details
![](/field/field-16.png)

Suitable for displaying associated data in tag form on details page.

### Field Configuration Items
#### Title Field
![](/field/field-17.png)

Used to display the main information of the tag, such as tag name.
For more content, refer to [Title Field](../field-settings/title-field.md).

#### Enable Link (enabled by default)

Allows clicking on the tag to pop up details or edit form for viewing and modifying associated records.
![](/field/field-18.png)
Can customize popup content according to needs.
For more content, refer to [Field Component](../field-settings/field-component.md).
