---
title: 我的博客地址
top: false
cover: false
toc: true
mathjax: false
comment: true
date: 2020-04-03 20:43:56
author:
keywords:
img:
coverImg:
password:
summary:
categories:
  - other
tags:
  - other
---

> ~~由于众所周知的原因，单纯把博客部署到一个地方，很可能访问不到，或者访问很慢，所以这里同时部署到 github 和 gitee，提高访问速度~~ [手动狗头]

- 前置条件：你会搭博客（网站）

## 示例

我的两个博客地址：
[https://tanghaojie.github.io/](https://tanghaojie.github.io/)
[http://jackie_tang.gitee.io/](http://jackie_tang.gitee.io/)
<br/>

---

## gitee pages 的一个坑

每次远程部署以后，需要手动到 gitee pages 服务里面去，手动点击更新按钮才能自动更新博客。（想自动更新？gitee pages pro 了解一下）

## 从 github 同步方式部署

- 在 gitee 新建仓库:
  ![就像这样配置就好](http://gitee.com/Jackie_Tang/Jackie_Tang/raw/master/my_images/2020-04/gitee_blog.jpg)
  _注意点：_
  _1.仓库名用 gitee 给你分配的个人地址名，可以到 个人中心-->个人空间地址 中看到，不一定是你的用户名，比如我的地址是：Jackie_Tang，我的用户名是：JackieTang。因为我改过名。。。_
  _2.下面选择导入已有仓库，然后填入 github 地址以后，仓库名会自动变成 github 仓库名，所以又需要你自己去上面改一次_
  <br/>

- 点击 创建，等待 gitee 自动导入 github 仓库。
  <br/>

- 导入完成如图配置
  ![配置gitee pages](http://gitee.com/Jackie_Tang/Jackie_Tang/raw/master/my_images/2020-04/gitee_blog2.jpg)
  _注意点：_
  _1.选择使用 Https，否则会跨域_

以上步骤就完成了，你的博客地址为：{个人地址名}.gitee.io，以后要同步 github 的数据，只需要这样操作：
![同步](http://gitee.com/Jackie_Tang/Jackie_Tang/raw/master/my_images/2020-04/gitee_blog3.jpg)

---

## 同步上传

我用的 hexo，在 `_config.yml` 文件：

```json
deploy:
 type: git
 repo:
   github: https://github.com/tanghaojie/tanghaojie.github.io.git
   gitee: https://gitee.com/Jackie_Tang/Jackie_Tang.git
 branch: master
```

加两个 repo 就好

---

_版权声明：_
_除非注明，本博文章均为原创，转载请以链接形式标明本文地址。_

---
