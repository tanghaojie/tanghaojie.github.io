---
title: Hexo添加数学公式支持
top: false
cover: false
toc: false
mathjax: true
comment: true
date: 2020-05-10 11:50:01
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

为后面的文档做准备，添加数学公式的支持。  
网上一堆更新渲染插件的办法，我都准备用了。幸好先看完了文章，后面要改 node_modules 里面的源码，这怎么可能！  
我不能把 node_modules 上传到 github 吧，不上传又怎么同步呢。后来看了一下，hexo-theme-matery 做好了插件，那就简单了：  
themes/hexo-theme-matery/\_config.yml 中：

> mathjax:  
>  enable: true

完工～  
就是这么简单，然后每篇要用到公式的文档，头上修改`mathjax: true`就好了。

#### _示例_

$\cos$

$x_i^2$

$|x+y|$

$\sqrt[3]{x+y}$

$\int_{r=1}^\infty$

$\frac{\partial x}{\partial y}$

$$\Gamma(z) = \int_0^\infty t^{z-1}e^{-t}dt\,.$$

$\alpha$ $\beta$ $\theta$

$\sum_{r=1}^n$

$\prod_{i=1}^{K}$

$$
\begin{bmatrix} a & b & c & d & e\\\\ f & g & h & i & j \\\\ k & l & m & n & o \\\\ p & q & r & s & t \end{bmatrix}
$$

---

_版权声明：_
_除非注明，本博文章均为原创，转载请以链接形式标明本文地址。_

---
