# 筛选表单字段

### 概述

筛选表单支持选择本表字段和关系表字段（即关系的关系字段）作为筛选字段。

![](../../../../../../public/filter-form-item.png)
![](../../../../../../public/filter-form-item1.png)

**示例**
以关系表的字段作为筛选字段。例如，产品表和用户表是多对一的关系，可以配置用户表中的昵称和手机号作为筛选字段来筛选订单。

![](../../../../../../public/filter-form-item2.png)


### 字段配置项

#### 运算符

根据字段类型选择合适的运算符进行筛选，以提高筛选的准确性和效率。对于字符串类型字段，默认使用模糊匹配。

![](../../../../../../public/filter-form-item3.png)
![](../../../../../../public/filter-form-item4.png)

- [编辑字段标题](../field-settings/edit-title.md)
- [显示标题](../field-settings/display-title.md)
- [编辑字段描述](../field-settings/edit-description.md)
- [编辑字段提示信息](../field-settings/edit-tooltip.md)
- [显示模式](../field-settings/pattern.md)