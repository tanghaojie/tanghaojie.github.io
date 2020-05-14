---
title: 几何算法延伸
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

*扩展*
1.ESRI shapefile：外层环序为顺时针。
2.[OGC规范](http://www.opengeospatial.org/standards/sfs)：此标准未定义多边形旋转；实际的多边形旋转可以沿顺时针或逆时针方向进行。
3.[Oracle](https://docs.oracle.com/cd/B10501_01/appdev.920/a96630/sdo_objgeom.htm#BGHFDDBF)：Exterior ring boundaries must be oriented counterclockwise, and interior ring boundaries must be oriented clockwise.（外部环边界必须逆时针定向，而内部环边界必须顺时针定向。）
4.[SQL Server](https://docs.microsoft.com/en-us/archive/blogs/edkatibah/working-with-invalid-data-and-the-sql-server-2008-geography-data-type-part-1b)： If SQL Server finds outer rings oriented in a clockwise direction, it will re-orient such rings to counter-clockwise - the direction required for outer rings in the Geography data type. The same goes for inner rings (holes), which SQL Server will orient to clockwise.（如果SQL Server找到沿顺时针方向定向的外环，则它将重新定位此类环为逆时针方向-Geography数据类型中外环所需的方向。内环（孔）也是如此，SQL Server会将其定位为顺时针方向。）
5.[PostGIS](https://postgis.net/docs/ST_ForceRHR.html)：Forces the orientation of the vertices in a polygon to follow a Right-Hand-Rule, in which the area that is bounded by the polygon is to the right of the boundary. In particular, the exterior ring is orientated in a clockwise direction and the interior rings in a counter-clockwise direction.（强制多边形中顶点的方向遵循“右手规则”，其中多边形所包围的区域在边界的右边。特别地，外环沿顺时针方向定向，而内环沿逆时针方向定向。）

## 判断多边形的环序
### 面积法
多边形面积为正：逆时针；面积为负：顺时针； 

### 凸多边形
![凸多边形计算环序方向](https://gitee.com/Jackie_Tang/Jackie_Tang/raw/master/my_images/director.jpg) 
任取一点叉乘：  
$$
\vec {AB} \times \vec{BC}
$$
值为正：逆时针；值为负：顺时针。

### 极点法
选择多边形上的某个极点（x最大、x最小、y最大、y最小），这个极点则一定在凸包上，计算叉积得到环序方向，和上面凸多边形算法结论一致。

## 计算多边形质心
### 三角形
三角形 $\triangle ABC$ 质心计算公式：
$$
Centroid_x = \frac{A_x + B_x + C_x}{3}
$$
$$
Centroid_y = \frac{A_y + B_y + C_y}{3}
$$
### 任意多边形
任意平面多边形，若能被拆分为 $i$个简单图形，每个简单图形的质心为：$C_i$，面积为：$A_i$。则质心Centroid的坐标$(Centroid_x, Centroid_y)$，满足以下公式：  
$$
Centroid_x = \frac{\sum {C_i}_x A_i}{\sum A_i}
$$
$$
Centroid_y = \frac{\sum {C_i}_y A_i}{\sum A_i}
$$


---
*版权声明：*
*除非注明，本博文章均为原创，转载请以链接形式标明本文地址。*
---