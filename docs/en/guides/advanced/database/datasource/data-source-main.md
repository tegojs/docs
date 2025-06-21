# 主数据库

::: info &#9432; 提示
该功能由插件 module-collection 提供。
:::

### 介绍
灵矶的主数据库负责存储业务数据，与此同时还用于管理应用的元数据，如系统表和自定义表等。灵矶同时支持 MySQL、PostgreSQL、SQLite 等主流关系型数据库，并在灵矶安装时一同部署，且无法被移除

### 安装
内置插件， 无需单独安装

### 数据表管理
![](/datasource/data-source-2.png)

#### 支持各类数据表
- [普通表](./collection/general-collection.md): 标准的常用字段设置;
- [评论表](./collection/): 存储用户对内容的反馈和评论;
- [树结构表](./collection/collection-tree.md): 用于表示层级关系的数据结构，如目录或分类;
- [表达式表](./collection/workflow-dynamic-calculation.md): 用于表达工作流的动态场景;
- [日历数据表](./collection/calendar-collection.md): 用于存储日期和时间相关的事件信息;
- [文件数据表](./collection/file-collection.md): 用于管理文件的元数据，如文件名、路径和大小;
- [继承表](./collection/inheritance-collection.md): 创建一个父表，然后从父表中衍生出字表;
- [SQL数据表](./collection/sql.md): 用于存储通过 SQL 查询获取的数据;
- [外部数据表(FDW)](./collection/collection-fdw.md): 用于连接远程数据表;
- [连接数据库视图](./collection/collection-view.md): 用于提供不同数据模型间的数据视图和整合;

#### 支持数据表分类管理
![](/datasource/data-source-3.png)

#### 支持各种字段类型
![](/datasource/data-source-4.png)
更多内容查看「[数据表字段 / 概述](./field/overview.md)」章节

