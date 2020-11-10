---
title: metashape-cluster
top: false
cover: false
toc: false
mathjax: false
comment: false
date: 2020-11-10 21:23:19
author:
keywords:
img:
coverImg:
password:
summary:
categories:
tags:
---

1.所有电脑在同一局域网，设置固定IP地址，使用千兆交换机（如果只有两台设备，可以采用网线直连）。
2.共享网络文件夹，右键需共享的工程目录文件夹，选择属性-共享，选择everyone，点击共享。选择高级共享，打勾共享文件夹，点击权限，选择everyone，权限选择完全控制。
3.打开软件，菜单栏工具——偏好设置——网络，勾选network，填入服务端IP地址（不能使用127.0.0.1）和项目所在目录（就是上面共享的目录）。
4.作为服务端的电脑，打开cmd，输入（不能出现中文字符）：`“C\Program Files\Agisoft\Metashape Pro\Metashape.exe” --server --control 192.168.0.1:5840 --dispatch 192.168.0.1:5841`。也可以把这段话保存成：server.bat文件，打开就自动执行了。
5.作为节点的电脑，打开cmd，输入（不能出现中文字符）：`"C:\Program Files\Agisoft\Metashape Pro\Metashape.exe" --node --dispatch 192.168.0.1:5841 --root \\DESKTOP-PC\Cluster`，--dispatch参数要一样，--root就是保存项目所有文件的共享文件夹，共享目录名用计算机名的形式，别用ip形式。同样也可以保存成：node.bat，方便使用。
6.打开Agisoft Network Monitor，输入主机的ip和端口，点击connect，就可以查看连接的电脑了。
7.打开软件，按照正常流程创建工程后保存，一定要保存到共享目录下面。之后进行运算的时候软件会询问是否通过集群进行计算。

---
*版权声明：*
*除非注明，本博文章均为原创，转载请以链接形式标明本文地址。*
---