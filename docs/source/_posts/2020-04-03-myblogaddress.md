---
title: 我的博客地址
top: false
cover: false
toc: true
mathjax: false
comment: true
date: 2020-04-03 12:43:56
author:
keywords:
img:
coverImg:
password:
summary:
categories:
 - blog
tags:
 - blog
---

> ~~由于众所周知的原因，单纯把博客部署到一个地方，很可能访问不到，或者访问很慢，所以这里同时部署到github和gitee，提高访问速度~~ [手动狗头]

- 前置条件：你会搭博客（网站）
## 示例
 我的两个博客地址：
 [http://tanghaojie.github.io/](http://tanghaojie.github.io/)
 [https://jackie_tang.gitee.io/](https://jackie_tang.gitee.io/)
 <br/>

 ---
## 从github同步方式部署
 - 在gitee新建仓库:
 ![就像这样配置就好](https://github.com/tanghaojie/tanghaojie.github.io/tree/master/my_images/gitee_blog.jpg)
 *注意点：*
 *1.仓库名用gitee给你分配的个人地址名，可以到 个人中心-->个人空间地址 中看到，不一定是你的用户名，比如我的地址是：Jackie_Tang，我的用户名是：JackieTang。因为我改过名。。。*
 *2.下面选择导入已有仓库，然后填入github地址以后，仓库名会自动变成github仓库名，所以又需要你自己去上面改一次*
 <br/>

 - 点击 创建，等待gitee自动导入github仓库。
 <br/>

 - 导入完成如图配置
 ![配置gitee pages](https://github.com/tanghaojie/tanghaojie.github.io/tree/master/my_images/gitee_blog2.jpg)
 *注意点：*
 *1.选择使用Https，否则会跨域*

 以上步骤就完成了，你的博客地址为：{个人地址名}.gitee.io，以后要同步github的数据，只需要这样操作：
 ![同步](https://github.com/tanghaojie/tanghaojie.github.io/tree/master/my_images/gitee_blog3.jpg)

 ---

## 同步上传
 我用的hexo，在 `_config.yml` 文件：
 ``` json
 deploy:
  type: git
  repo: 
    github: https://github.com/tanghaojie/tanghaojie.github.io.git
    gitee: https://gitee.com/Jackie_Tang/Jackie_Tang.git
  branch: master
 ```
 加两个repo就好

---
*版权声明：*
*除非注明，本博文章均为原创，转载请以链接形式标明本文地址。*
---