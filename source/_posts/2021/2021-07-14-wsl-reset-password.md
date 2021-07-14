---
title: Windows中的wsl重置密码
top: false
cover: false
toc: true
mathjax: false
comment: true
date: 2021-07-14 17:05:20
author:
keywords:
img:
coverImg:
password:
summary:
categories:
tags:
---

wsl 中的用户名同步 windows 的用户名，但是密码不同步，默认密码也不知道，所以，重置吧。

首先进 wsl 记下你的 Linux 用户名，输入`whoami`就行，或者到 home 里面自己看；

然后关闭所有 ubuntu/linux 的 Bash；

在 Windows 中，以管理员运行命令提示符，输入：

> ubuntu config --default-user root

如果是 Ubuntu18.04，则命令为：

> ubuntu1804 config --default-user root

切换到默认用 root 登录以后，进入 ubuntu/linux 的 Bash，修改密码：

> passwd your_username

修改完成以后，关闭 Bash，回到 Windows，切换回默认普通用户：

> ubuntu config --default-user your_username

大功告成~

---

_版权声明：_
_除非注明，本博文章均为原创，转载请以链接形式标明本文地址。_

---
