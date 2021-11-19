---
title: windows docker 安装部署 postgres
top: false
cover: false
toc: true
mathjax: false
comment: true
date: 2021-10-15 21:49:27
author:
keywords:
img:
coverImg:
password:
summary:
categories:
tags:
---

## 拉取镜像

> docker pull postgres

## 创建 data volume

> docker volume create postgres-data

_windows 版本的 docker，默认 volume 存放位置在：`\\wsl$\docker-desktop-data\version-pack-data\community\docker\volumes`实际位置一般在`C:\Users\UserName\AppData\Roaming\Microsoft\Windows\Network Shortcuts\docker volumes`_

## 创建容器

> docker run -it \-\-name postgres \-\-restart always -e POSTGRES_PASSWORD=\'abc123\' -e ALLOW_IP_RANGE=0.0.0.0/0 -v postgres-data:/var/lib/postgresql/data -p 5432:5432 -d postgres

## （可选）进入 postgres 容器

> docker exec -it postgres bash

## （可选）切换用户，登录数据库

> su postgres
> psql -U postgres -W

## 配置数据库

很多种办法： 1.直接去 windows 映射的 volume`C:\Users\UserName\AppData\Roaming\Microsoft\Windows\Network Shortcuts\docker volumes\docker-desktop-data\version-pack-data\community\docker\volumes\postgres-data\_data\`

2.命令行到`/var/lib/postgresql/data`

下面的`pg_hba.conf`文件：

```
# IPv4 local connections:
host    all             all             127.0.0.1/32            trust
host    all             all              0.0.0.0/0                trust
```

添加任何 ip 地址可以访问

## 重启容器

> docker restart postgres

---

_版权声明：_
_除非注明，本博文章均为原创，转载请以链接形式标明本文地址。_

---
