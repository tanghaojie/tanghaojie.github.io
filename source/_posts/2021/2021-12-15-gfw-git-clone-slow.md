---
title: 国内git clone速度缓慢的解决办法汇总
top: false
cover: false
toc: true
mathjax: false
comment: true
date: 2021-12-15 21:10:48
author:
keywords:
img:
coverImg:
password:
summary:
categories:
tags:
---

## 改本地 host

在网站 [https://www.ipaddress.com](https://www.ipaddress.com) 分别查询这两个域名所对应的最快 IP 地址：

> github.global.ssl.fastly.net
> github.com

然后在 host 里面做一下映射。

## 增大缓存大小

> git config --global http.postBuffer 524288000

## 使用代理

`后面对应你代理软件的ip和端口`

> git config --global https.proxy http://127.0.0.1:1080
> git config --global https.proxy https://127.0.0.1:1080
> git config --global http.proxy 'socks5://127.0.0.1:1080'
> git config --global https.proxy 'socks5://127.0.0.1:1080'

---

_版权声明：_
_除非注明，本博文章均为原创，转载请以链接形式标明本文地址。_

---
