---
abbrlink: ''
categories:
- - termux
- - 小米手表
cover: https://blog.lvbyte.top/img/2023/1/15251875958364.png
date: '2023-01-16 20:40:36'
description: null
references:
- title: termux安装ssh并连接
  url: https://www.cnblogs.com/CJTARRR
- title: Cloudflare Argo Tunnel – 公网 IP 的新解决方案
  url: https://azhuge233.com/cloudflare-argo-tunnel-%E5%85%AC%E7%BD%91-ip-%E7%9A%84%E6%96%B0%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/
tags:
- termux
- 小米手表
- 折腾
title: 小米手表之Temrux折腾
updated: Sat, 11 Mar 2023 16:04:20 GMT
---
{% quot 前言 el:h3 %}

我一直有自建服务器的想法，可家里旧的台式电脑耗电太大。回想起2年前折腾的Termux，便把“魔爪”伸向了我的小米手表。尝试搭建一些服务在手表上。

以下是我的折腾过程。

{% quot 安装 Termux el:h3 %}

小米手表的安卓版本是支持安装最新的Termux

下载链接[官方]：

{% link https://f-droid.org/en/packages/com.termux/ F-Droid %}

下载完apk文件后，利用 安卓手表ADB实用工具箱 将apk文件安装到小米手表上。

{% quot 更改dpi el:h3 %}

由于小米手表的屏幕过小，在Termux中无法调用输入法，因此利用 “安卓手表ADB实用工具箱” 更改dpi至150

{% quot 更换清华源 el:h3 %}
众所周知的原因，我们需要更换软件源以提高下载速度这里推荐使用清华源使用如下命令行替换官方源为 TUNA 镜像源

```
sed -i 's@^\(deb.*stable main\)$@#\1\ndeb https://mirrors.tuna.tsinghua.edu.cn/termux/apt/termux-main stable main@' $PREFIX/etc/apt/sources.list
```

```
apt update && apt upgrade
```

{% quot ssh服务 el:h3 %}
**1.安装openssh**：pkg install openssh
**2.启动openssh**： sshd
开放端口默认为8022
**3.查看用户名**： whoami
**4.修改用户密码**: passwd
**5.查看IP地址**： ifconfig

后续可根据平台选择对应的ssh软件（我是用Xshell）

{% quot 安装Ubuntu el:h3 %}
**1.安装基础件proot-distro:**

```
pkg install proot-distro
```

**2.安装Ubuntu:**

```
proot-distro install ubuntu
```

**3.进入Ubuntu：**

```
proot-distro login ubuntu
```

{% quot 安装网盘服务alist el:h3 %}
**1.在termux本体中运行：**

```
pkg i alist
```

**2.提权：**

```
chmod +x alist
```

**3.获取管理员信息（登陆要用）**

```
alist admin
```

{% image https://cdn.staticaly.com/gh/Bytelv/lvbyteCdn@main/Qexo/2023/1/admin.PNG 如图所示 %}我的管理员信息是：

* name: admin* passwd: VYHkW1dl

**4.开启alist服务**

```
alist server
```

{% image https://cdn.staticaly.com/gh/Bytelv/lvbyteCdn@main/Qexo/2023/1/server.PNG 如图所示 %}在这里可以查看到服务端口是5244打开浏览器输入以下地址：http://ip地址:5244(ip地址是你的手表的网络ip)恭喜你🤗 ，你已经成功配置了alist服务

**5.登录alist**

打开浏览器输入：

http://192.168.0.119:5244/@login(192.168.0.119是我的ip地址，你需要根据你的ip进行替换)用户名填写：admin密码填写：******   (刚刚在第三步获取的密码)

**6.配置相关设置**

这一步便需要你自己探索了，这里提供官方wiki：https://alist.nn.ci/zh/

{% quot Termux设置自启动 el:h3 %}

每一次打开termux都要重新输入命令，实在有点繁琐。

我们可以编辑**.bashrc**文件来配置启动项
**1.安装vim**

```
pkg install vim
```

**2.打开.bashrc文件**

```
vi ~/.bashrc
```

**3.编辑.bashrc文件**

```
输入 "i"进入编辑模式
```

我的.bashrc文件如下(根据你的需要编辑)：

```
sshd  #开始ssh服务alist server #开启alist服务curl -s i996.me | bash -s ****** #开启内网穿透服务
```

**4.保存退出**

```
按下esc -> 输入冒号+wq字符，按下回车
```

{% quot 内网穿透 el:h3 %}

由于众所周知的原因，普通用户家里是没有公网IP的。如果我们想在外部网络访问搭建在小米手表上的服务，我们需要使用内网穿透。

我这里是推荐大家使用**i996内网穿透服务**: https://www.i996.me/

这个内网穿透服务可以在**微信公众号**配置，而开启这个服务也仅仅需要一行命令，而且**纯免费**！！

注意：目前由于强的关系，无法绑定自定义域名，故提供以下方案

{% quot Cloudflare Argo Tunnel – 公网 IP el:h3 %}
**1.安装Argo Tunnel Client**

```
pkg install cloudflared
```

**2.身份认证**

```
cloudflared tunnel login
```

执行完毕后会输出一个链接，复制链接到浏览器内登陆账号，登录后选择使用的域名，完成验证Cloudflared 会在 *\~/.cloudlflared/* 下生成 cert.pem 证书，之后的操作都依赖于此文件

**3.新建 Tunnel**

```
cloudflared tunnel create [Tunnel 名称]
```

我的【Tunnel名称】为bit

执行完命令后会输出UUID,即：

Created tunnel 【Tunnel 名称】 with id 【UUID】

每个 Tunnel 都对应一个 UUID，每新建一个 Tunnel，Cloudflared 都会在 */.cloudflared/* 下生成对应 UUID 的 json 文件\~

**4.配置 DNS 记录**

访问域名的控制面板，进入 DNS 配置页，新建 CNAME 记录，名称填写你想要的名称，目标填写 【UUID】.cfargotunnel.com

Argo Tunnel 的一个 UUID 只会与同一账户下的一个 DNS 记录绑定

**5.新建配置文件**

新建 YAML 配置文件于~/.cloudflared 目录下，写入以下内容

```
tunnel: [tunnel 的名称或 UUID]credentials-file: [tunnel 的 UUID].jsoningress:  - hostname: [CNAME 记录名称].[接入 CLoudflare 的域名]    service: http://localhost:[你想要使用的端口]  - service: http_status:404
```

我的yaml文件名为：miwatch.yaml

**6.开启 Tunnel**
cd到~/.cloudflared 目录

```
cd ~/.cloudflared
```

执行

```
cloudflared tunnel --config miwatch.yaml run
```

将miwatch.yaml更改为你的yaml文件

### 效果

![](https://cdn.staticaly.com/gh/Bytelv/lvbyteCdn@main/Qexo/2023/1/%E5%86%85%E7%BD%91%E7%A9%BF%E9%80%8F.PNG)
