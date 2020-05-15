---
title: Hexo添加数学公式支持
top: false
cover: false
toc: true
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
tags:
---
为后面的文档做准备，添加数学公式的支持。  
网上一堆更新渲染插件的办法，我都准备用了。幸好先看完了文章，后面要改node_modules里面的源码，这怎么可能！  
我不能把node_modules上传到github吧，不上传又怎么同步呢。后来看了一下，hexo-theme-matery做好了插件，那就简单了：  
themes/hexo-theme-matery/_config.yml中：
> mathjax:  
>    enable: true  

完工～  
就是这么简单，然后每篇要用到公式的文档，头上修改`mathjax: true`就好了。
#### *示例*  

$\cos$   

$x_i^2$  

$|x+y|$  

$\sqrt[3]{x+y}$  

$\int_{r=1}^\infty$

$\frac{\partial x}{\partial y}$  

$$\Gamma(z) = \int_0^\infty t^{z-1}e^{-t}dt\,.$$

$\alpha$  $\beta$  $\theta$

$\sum_{r=1}^n$

$\prod_{i=1}^{K}$

$$
\begin{bmatrix} a & b & c & d & e\\\\ f & g & h & i & j \\\\ k & l & m & n & o \\\\ p & q & r & s & t \end{bmatrix}
$$
---
*版权声明：*
*除非注明，本博文章均为原创，转载请以链接形式标明本文地址。*
---