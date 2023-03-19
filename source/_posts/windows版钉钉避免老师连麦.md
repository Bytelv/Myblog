---
abbrlink: ''
categories:
- 钉钉
cover: https://blog.lvbyte.top/img/2023/3/helloworld.jpg/20230104/RABvQ.123f8d6gig80.png
date: '2022-12-26 14:31:33'
description: windows版钉钉避免老师连麦
poster:
  caption: null
  color: white
  headline: windows版钉钉避免老师连麦
  topic: 字节君
references:
- title: 【钉钉】五分钟教你学会直播不被连麦的方法
  url: https://www.bilibili.com/video/BV1TD4y177pH/?spm_id_from=333.999.0.0&vd_source=6c38d3f6ea2518601f2bbe6ca8ce69a0
tags:
- 钉钉
- 网课
title: windows版钉钉避免老师连麦
updated: Sat, 11 Mar 2023 16:02:55 GMT
---
# 背景

随着国家防疫疫情的放开，身边的小阳人🐏越来越多。

教育局也下发通知：本学期不再举行线下课程和考试。

作为卑微的初三牲，还是得好好上网课。

可老师们的连麦，属实让人不爽😅

# 下载钉钉（6.0.8版本）

{% link https://www.aliyundrive.com/s/HqEtBHYi1Hx %}

下载完后不要打开钉钉

# 修改文件

### 1.打开钉钉源文件

删除文件：【DingTalkUpdater.exe】【updatepath.bin】

{% note 删除文件作用 阻止钉钉自动更新。 %}

打开文件(记事本)：【F:\DingDing\main\current\configurations\staticconfig.xml】

{% note 备注 链接根据你的实际情况。 %}

### 2.修改staticconfig.xml文件

将：

{% copy <item id="VersionString">6.0.8-Release.3310263</item> %}

更改为

{% copy <item id="VersionString">100dashabi</item> %}

### 3.打开钉钉并登录

{% note 注意事项 一定要勾选自动登录。 %}

### 4.再次修改staticconfig.xml文件

退出钉钉，再次修改staticconfig.xml文件

将：

{% copy <item id="VersionString">100dashabi</item> %}

更改为

{% copy <item id="VersionString">6.0.8-Release.3310263</item> %}

### 5.重新打开钉钉

这时，便成功避免老师连麦了

# 效果图

{% image https://c2.im5i.com/2022/12/26/RAUrR.png %}

# 最后

疫情这三年，很快就结束了。

不保证这个方法还能用多久。

把握时光，努力学习，考上好高中才是正事。
