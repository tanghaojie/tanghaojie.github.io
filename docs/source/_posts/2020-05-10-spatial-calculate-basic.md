---
title: 几何计算基础
top: false
cover: false
toc: true
mathjax: true
comment: true
date: 2020-05-10 12:24:04
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
#### 加
$$
\vec A + \vec B = (A_x + B_x, A_y + B_y, A_z + B_z)
$$

#### 减
$$
\vec A - \vec B = (A_x - B_x, A_y - B_y, A_z - B_z)
$$

#### 模
$$
\left| \vec A \right| = \sqrt[]{ A_x^2 + A_y^2 + A_z^2 }
$$

#### 数乘（伸缩，换向）
$$
k \vec A = (kA_x, kA_y, kA_z)
$$

#### 点乘
$$
\vec A \cdot \vec B = \sum A_i B_i = A_xB_x + A_yB_y + A_zB_z
$$

$$
\vec A \cdot \vec B = \left| \vec A \right| \left| \vec B \right| \cos \theta
$$

结果是一个**标量**（数）
几何意义：1.降维，2.$\vec B$在$\vec A$上的投影

$$
\left| \vec B \right| \cos \theta
$$  

##### 点乘延伸：
$$
\left| \vec A \cdot \vec B \right| \le \left| \vec A \right| \left| \vec B \right|
$$
等号只在$\vec A$与$\vec B$共线时成立.

$$
\vec A \cdot \vec B = \vec B \cdot \vec A 
$$

$\vec A \cdot \vec B > 0$，夹角在 $0^\circ$ 到 $90^\circ$ 之间
$\vec A \cdot \vec B = 0$，垂直
$\vec A \cdot \vec B < 0$，夹角在 $90^\circ$ 到 $180^\circ$ 之间

#### 叉乘
$$
\vec A \times \vec B = \left| \vec A \right| \left| \vec B \right| \sin \theta
$$

二维：
$$
\vec A \times \vec B = A_xB_y - B_xA_y
$$

三维：
$$
\vec A \times \vec B = A_yB_z- B_yA_z + A_zB_x - A_xB_z+ A_xB_y - A_yB_x
$$

几何意义：
二维：
$
(0,0) \quad (A_x, A_y) \quad (B_x, B_y) \quad ((A+B)_x, (A+B)_y)
$
构成的平行四边形带符号的面积
三维：
$\vec A \times \vec B$ 结果的向量，垂直于 $\vec A$ 和 $\vec B$ 构成的平面

##### 叉乘延伸：
$$
\left| \vec A \times \vec B \right| = \left| \vec A \right| \left| \vec B \right| \sin \theta
$$

$$
\vec A \times \vec B = - \vec B \times \vec A
$$


---
*版权声明：*
*除非注明，本博文章均为原创，转载请以链接形式标明本文地址。*
---