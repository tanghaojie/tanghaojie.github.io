---
title: windows docker 安装部署 nextcloud
top: false
cover: false
toc: true
mathjax: false
comment: true
date: 2021-10-15 22:44:14
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

> docker pull nextcloud

## 创建容器

> docker run -d -p 9000:80 \-\-restart always -v /mnt/d/docker/win-mount/nextcloud-data:/var/www/html/data -v nextcloud:/var/www/html \-\-name nextcloud nextcloud


然后直接访问就行了。

## 手动添加文件后重新扫描命令

> docker exec -u www-data nextcloud php occ files:scan \-\-all

## 手动添加文件后nextcloud没有编辑权限

> docker exec -u root nextcloud chown -R www-data /var/www/html/data

## 中文目录问题

> docker exec -it nextcloud env LANG=C.UTF-8 /bin/bash

---

_版权声明：_
_除非注明，本博文章均为原创，转载请以链接形式标明本文地址。_

---
