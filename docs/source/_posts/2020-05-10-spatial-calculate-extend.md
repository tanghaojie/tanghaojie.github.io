---
title: 几何计算延伸
top: false
cover: false
toc: true
mathjax: true
comment: true
date: 2020-05-10 15:10:26
author:
keywords:
img:
coverImg:
password:
summary:
categories:
 - 几何计算
tags:
 - 几何计算
---

### 线平行
$$
A_xB_y = A_yB_x
$$

$$
\frac{A_x}{A_y} = \frac{B_x}{B_y}
$$

$$
\frac{A_x}{A_y} = \frac{B_x}{B_y} = \frac{B_z}{B_z}
$$

### 线垂直
$$
A_xB_x + A_yB_y = 0
$$

$$
A_xB_x + A_yB_y + A_zB_z = 0
$$

## 向量 $\vec A$ $\vec B$ 夹角方向（**叉乘**）
$\vec A$ $\times$ $\vec B$ > 0 , $\vec A$在$\vec B$的顺时针方向。
$\vec A$ $\times$ $\vec B$ < 0 , $\vec A$在$\vec B$的逆时针方向。
$\vec A$ $\times$ $\vec B$ = 0 , $\vec A$ $\vec B$共线。

## 判断凸多边形
根据上面方向的性质，可以推论出来。  
以多边形相邻两条边为向量进行叉积和，如果全部大于零则是凸多边形，如果全部为零则共线，否则就是凹多边形。



---
*版权声明：*
*除非注明，本博文章均为原创，转载请以链接形式标明本文地址。*
---