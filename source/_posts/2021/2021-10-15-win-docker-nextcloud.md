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

## 手动添加文件后 nextcloud 没有编辑权限

> docker exec -u root nextcloud chown -R www-data /var/www/html/data

## 中文目录问题

> docker exec -it nextcloud env LANG=C.UTF-8 /bin/bash

## 手动安装应用后设置权限

> chown -R www-data:root maps # maps=应用名

## 配置后台任务 cron

在宿主机执行:

> docker exec -u www-data -i nextcloud php -f /var/www/html/cron.php

测试是否能成功执行。

之后还是在**宿主机**，使用 `crontab` 创建定时任务：

> crontab -e

在文本编辑器中输入(以下代表每五分钟执行一次)：

`*/5 * * * * docker exec --user www-data -i nextcloud php -f /var/www/html/cron.php`

查看定时任务：

> crontab -l

## 地图应用安装后手动全局扫描图片

> docker exec -u www-data nextcloud php occ maps:scan-photos

## 设置缩略图

容器内安装 ffmpeg:

> apt install ffmpeg -y

修改 `config.php` 文件，添加：

```
'enable_previews' => true,
'enabledPreviewProviders' =>
array (
  0 => 'OC\\Preview\\Image',
  1 => 'OC\\Preview\\Movie',
  2 => 'OC\\Preview\\TXT',
),
```

## 电子邮件服务器

先去 QQ 邮箱-设置-账户-开启 SMTP 服务

然后去 nextcloud 设置：

> 来自地址：你的 QQ 邮箱
> 认证方法：登录，勾上需要认证
> 服务器地址：smtp.qq.com : 465
> 证书：你的 QQ 邮箱，密码是开启 SMTP 服务时给你的密钥

重启容器

## wsl 开启 cron.log

> sudo vim /etc/rsyslog.d/50-default.conf

将 cron 前面的注释符去掉后，重启相关服务

> sudo service rsyslog restart

> sudo service cron restart

之后在`/var/log`下面，就有`cron.log`文件了

## 您的安装没有设置默认的电话区域

`config.pho`添加一行：`'default_phone_region' => 'CN',`

## 此实例中的 php-imagick 模块不支持 SVG

1. 进入容器
2. > apt search libmagickcore-                    #查找包
3. > apt install libmagickcore-6.q16-6-extra       #安装包
4. 退出容器，重启

_版权声明：_
_除非注明，本博文章均为原创，转载请以链接形式标明本文地址。_

---
