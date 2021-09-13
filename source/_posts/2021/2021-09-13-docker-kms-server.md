---
title: docker-kms-server
top: false
cover: false
toc: true
mathjax: false
comment: true
date: 2021-09-13 19:40:31
author:
keywords:
img:
coverImg:
password:
summary:
categories:
tags:
---

## 安装 docker vlmscd

> docker pull mikolatero/vlmcsd
> docker run -d -p 1688:1688 --restart=always --name="vlmcsd" mikolatero/vlmcsd

## 打开防火墙和映射 1688 端口

## 查找对应的 GVLK

微软官方 GVLK 列表：

### Windows:

中文：[https://docs.microsoft.com/zh-cn/windows-server/get-started/kms-client-activation-keys](https://docs.microsoft.com/zh-cn/windows-server/get-started/kms-client-activation-keys)

英文：[https://docs.microsoft.com/en-us/windows-server/get-started/kms-client-activation-keys](https://docs.microsoft.com/en-us/windows-server/get-started/kms-client-activation-keys)

### Office

[https://docs.microsoft.com/zh-cn/DeployOffice/vlactivation/gvlks?redirectedfrom=MSDN](https://docs.microsoft.com/zh-cn/DeployOffice/vlactivation/gvlks?redirectedfrom=MSDN)

## 激活 windows

管理员运行 Power shell

> \# 这是 win10 专业版的 GVLK
> slmgr /ipk W269N-WFGWX-YVC9B-4J6C9-T83GX
> slmgr /skms ip:port
> slmgr /ato

## 激活 Office

管理员运行 Power shell

x86：

> cd c:\Program Files (x86)\Microsoft Office\Office16

x86_64：

> cd c:\Program Files\Microsoft Office\Office16

然后：

> cscript ospp.vbs /sethst:ip
> cscript ospp.vbs /setprt:port
> cscript ospp.vbs /inpkey:xxxxx-xxxxx-xxxxx-xxxxx-xxxxx
> cscript ospp.vbs /act

_可以把以上命令保存为.bat文件，当激活过期以后再次用管理员运行就好了_

---

_版权声明：_
_除非注明，本博文章均为原创，转载请以链接形式标明本文地址。_

---
