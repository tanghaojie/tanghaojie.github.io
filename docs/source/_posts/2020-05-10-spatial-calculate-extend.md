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

## 计算任意多边形面积
### 计算三角形面积
![计算三角形面积](https://gitee.com/Jackie_Tang/Jackie_Tang/raw/master/my_images/tri.jpg)  
根据上一篇几何基础，向量叉乘结果为带符号的平行四边形面积，那么三角形的面积为：  
$$
Area = \frac{\vec {AB} \times \vec {AC}}{2}
$$
面积结果为带符号的值，正面积则ABC成左手系，负面积则ABC成右手系。 
### 计算任意凹凸多边形面积
![计算任意多边形面积](https://gitee.com/Jackie_Tang/Jackie_Tang/raw/master/my_images/area.jpg)
计算多边形面积就是把多边形切分为多个三角形计算就好了。  
由于面积计算的结果是带符号的，因此，此结果对于凹凸多边形都是有效。  
甚至可以选取多边形外的一个点，来构建三角形计算，也是同样有效的，像这样：  
![外部选点](https://gitee.com/Jackie_Tang/Jackie_Tang/raw/master/my_images/area2.jpg)  
当然一般不会选择外部的点。  
### 计算带孔多边形的面积
![孔洞多边形](https://gitee.com/Jackie_Tang/Jackie_Tang/raw/master/my_images/area3.jpg) 
当多边形存在“孔洞”时， 第一层孔洞的环序是与外环序一定是相反的，因此孔洞的面积和外环的面积结果也是相反的，直接相加即可。多层孔洞当然也是一样的道理。  
**注意**  
1. 环序是很重要的，同一层环进行面积计算的时候，要始终保持同一个方向的环序进行计算。  
2. 不同文件格式要求的最外部环序是不一样的，因此不要认为外环总是和大部分情况一样是逆时针的。  







---
*版权声明：*
*除非注明，本博文章均为原创，转载请以链接形式标明本文地址。*
---