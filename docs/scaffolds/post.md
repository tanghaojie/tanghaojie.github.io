---
title: {{ title }}
date: {{ date }}
author: #文章作者（有默认值）
keywords: #默认title， 有keywords，就是title+keywords，用,分割
img: #文章特征图url
top: false # 推荐文章（文章是否置顶）
cover: false # 表示该文章是否需要加入到首页轮播封面中
coverImg: #首页轮播时的文章特征图，没有则用 img
password: #文章阅读密码，如果要对文章设置阅读验证密码的话，就可以设置 password 的值，该值必须是用 SHA256 加密后的密码，防止被他人识破。前提是在主题的 config.yml 中激活了 verifyPassword 选项
toc: true #是否开启 TOC，可以针对某篇文章单独关闭 TOC 的功能。前提是在主题的 config.yml 中激活了 toc 选项
mathjax: false #是否开启数学公式支持 ，本文章是否开启 mathjax，且需要在主题的 _config.yml 文件中也需要开启才行
comment: true #评论，好像要依赖插件
summary: # 文章摘要，自定义的文章摘要内容，如果这个属性有值，文章卡片摘要就显示这段文字，否则程序会自动截取文章的部分内容作为摘要
categories: # 文章分类，本主题的分类表示宏观上大的分类，只建议一篇文章一个分类
tags: # 文章标签，一篇文章可以多个标签


---
---
*版权声明：*
*除非注明，本博文章均为原创，转载请以链接形式标明本文地址。*
---