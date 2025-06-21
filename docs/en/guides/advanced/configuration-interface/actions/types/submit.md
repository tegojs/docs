# 提交

## 介绍

提交操作用于保存表单数据（表单卡片特有），还可以结合工作流，实现数据自动化流程。

![20240413093210](/actions/submit-1.png)

## 操作配置项

![20240413095124](/actions/submit-2.png)

### 保存模式

仅新增数据的表单卡片的提交操作支持配置保存方式。

![20240413101209](/actions/submit-3.png)

![20240413100531](/actions/submit-4.png)

1. 直接插入新建；
2. 不存在时插入（需要配置用于判断记录是否存在的字段）；
3. 不存在时插入，否则更新（需要配置用于判断记录是否存在的字段）；

### 绑定工作流

只有在数据提交成功后才会触发绑定的工作流。

![20240417120149](/actions/submit-5.png)

更多内容可参考 [绑定工作流](/guides/advanced/configuration-interface/actions/action-settings/bind-workflow)


- [编辑按钮](/guides/advanced/configuration-interface/actions/action-settings/edit-button)
- [二次确认](/guides/advanced/configuration-interface/actions/action-settings/double-check)