---
title: nginx反向代理nextcloud开启ssl
top: false
cover: false
toc: true
mathjax: false
comment: true
date: 2021-12-14 20:57:27
author:
keywords:
img:
coverImg:
password:
summary:
categories:
tags:
---

## docker nginx 安装

> docker pull nginx
> docker volume create nginx_config
> docker run \-\-name nginx-for-nextcloud \-\-restart=always \-p 8443:443 \-p 8080:80 \-v nginx_config:/etc/nginx \-d nginx

## 拷贝证书到 nginx_config/\_data 文件夹下

对于 nginx 来说，是两个文件 `*.key` 和 `*.crt`

## 修改 nginx 代理配置

```
upstream nextcloud {
    server 192.168.6.2:9000;
}

server {
    listen  80;
    listen       443 ssl;
    server_name  jackietang.dynv6.net;

    ssl_certificate ./jackietang.dynv6.net_chain.crt;
    ssl_certificate_key ./jackietang.dynv6.net_key.key;

    location / {
        proxy_set_header Host $http_host;
        proxy_set_header  X-Real-IP  $remote_addr;
        proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass http://nextcloud;
        proxy_redirect http:// https://;
    }
}

```

## 修改 nextcloud 配置

添加 ` 'overwriteprotocol' => 'https',` ，保证 nextcloud 协议正确性

---

_版权声明：_
_除非注明，本博文章均为原创，转载请以链接形式标明本文地址。_

---
