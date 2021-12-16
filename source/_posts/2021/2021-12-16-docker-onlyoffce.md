---
title: docker 安装部署 onlyoffice
top: false
cover: false
toc: true
mathjax: false
comment: true
date: 2021-12-16 16:49:09
author:
keywords:
img:
coverImg:
password:
summary:
categories:
tags:
---

## 安装

> docker volume create onlyoffice_logs

> docker volume create onlyoffice_data

> docker run \-itd \-p 60081:80 \-p 60441:443 \-\-name onlyoffice \-\-restart always \-v onlyoffice_logs:/var/log/onlyoffice \-v onlyoffice_data:/var/www/onlyoffice/Data onlyoffice/documentserver

## 启动 SSL

将申请的证书命名为：`onlyoffice.key` 和 `onlyoffice.crt` 。

然后在上面创建的`onlyoffice_data`这个 volume 中创建`certs`文件夹，把这两个证书文件放进去。

## 把证书文件设置为只读

> chmod 400 /app/onlyoffice/DocumentServer/data/certs/onlyoffice.key

重启容器就好了。

_版权声明：_
_除非注明，本博文章均为原创，转载请以链接形式标明本文地址。_

---
