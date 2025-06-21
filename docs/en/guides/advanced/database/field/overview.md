# 概述

## 数据表字段

### 字段的接口(Interface)类型

从接口(Interface)角度来看，灵矶将字段划分为以下几类:
![](../../../../../public/Interface_type.png)

### 字段数据类型
每个Field Interface都有一个默认的数据类型，例如，Interface类型为数字(Number)的字段，默认数据类型为double，但也可以是float、decimal等。目前支持的数据类型包括:

![](../../../../../public/data_type.png)


### 字段类型映射

主数据库新增字段的流程为:

1. 选择Interface类型
2. 配置当前Interface可选数据类型

![](../../../../../public/database_field.png)

为不数据源的字段映射流程为:

1. 自动根据外部数据库的字段类型映射到相应的数据类型（Field Type）和 UI 类型（Field Interface）。
2. 可根据需求调整为更合适的数据类型和 Interface 类型。
<!-- TODO: 插入图片 -->