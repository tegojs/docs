# 表单筛选卡片

## 介绍

表单筛选区块可以和数据区块进行连接，连接之后就可以为数据区块提供筛选能力。

## 添加区块

![](/filters/form-add.png)

## 区块配置项

![](/filters/form-setting.png)

### 连接数据区块

示例：表单筛选区块连接详情数据区块实现联动。
![](/filters/form-link.png)

## 配置字段

### 本表字段

![](/filters/form-search.png)

### 关系表字段

支持以关系表的字段为筛选条件
![](/filters/form-relate-search.png)

### 给字段设置默认值

像普通的表单区块一样，可以为普通字段和关系字段设置默认值。当字段存在默认值时，会在页面首次渲染时自动触发一次筛选操作，以使与其相连接的数据区块展示相匹配的数据。

## 配置操作

![](/filters/form-action.png)

### 重置按钮

![](/filters/form-reset.png)
