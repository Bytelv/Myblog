---
abbrlink: ''
banner: null
categories: []
cover: null
date: '2023-01-26 21:26:45'
description: null
poster:
  caption: null
  color: null
  headline: null
  topic: null
tags: []
title: 微软todo嵌入关于页面
updated: '2023-01-26 21:26:47'
---

# 资料收集

### 1.微软To do list api：

https://learn.microsoft.com/zh-cn/graph/todo-concept-overview


#### 常用微软待办 API 操作


| 操作                     | 请求                                                                                                                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 列出所有任务列表         | 获取[https://graph.microsoft.com/v1.0/me/todo/lists](https://graph.microsoft.com/v1.0/me/todo/lists)                                                                                 |
| 列出任务列表中的所有任务 | 获取[https://graph.microsoft.com/v1.0/me/todo/lists/{todoTaskListId}/tasks](https://graph.microsoft.com/v1.0/me/todo/lists/%7BtodoTaskListId%7D/tasks)                               |
| 创建新任务               | 发布[https://graph.microsoft.com/v1.0/me/todo/lists/{todoTaskListId}/tasks](https://graph.microsoft.com/v1.0/me/todo/lists/%7BtodoTaskListId%7D/tasks)                               |
| 更新任务                 | 修补[https://graph.microsoft.com/v1.0/me/todo/lists/{todoTaskListId}/tasks/{todoTaskId}](https://graph.microsoft.com/v1.0/me/todo/lists/%7BtodoTaskListId%7D/tasks/%7BtodoTaskId%7D) |
| 删除任务                 | 删除[https://graph.microsoft.com/v1.0/me/todo/lists/{todoTaskListId}/tasks/{todoTaskId}](https://graph.microsoft.com/v1.0/me/todo/lists/%7BtodoTaskListId%7D/tasks/%7BtodoTaskId%7D) |
