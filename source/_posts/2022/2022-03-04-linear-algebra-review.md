---
title: 线性代数复习
top: false
cover: false
toc: true
mathjax: true
comment: true
date: 2022-03-04 21:43:23
author:
keywords:
img:
coverImg:
password:
summary:
categories:
tags:
---

## 序

最近 GIS 很火啊，各种应用和引擎呈百花齐放的形式，之前的重心方向：地理信息框架、底层数据组织、业务应用模式都接触很多了，自己也做了简单的开源 Web GIS 应用以做代学，详情可见[Github 仓库](https://github.com/tanghaojie/vue3-cesium-typescript-start-up-template)，后续的目标应该会集中在：显卡编程、GLSL、图形学上面，更偏底层一些，涉及到业务的更少，但能开拓的东西更多。

这块目标上随时都会涉及到线性代数的知识点，大学时候学习的线性代数这么多年没怎么用，已经基本还给老师了，所以很有必要进行一系列的回顾。故开此篇。

## 向量

向量的基础内容博客以前写过了，就不重新写了，详见：[基础内容](/2020/05/10/2020-2020-05-10-spatial-calculate-basic/)和[延伸内容](/2020/05/10/2020-2020-05-10-spatial-calculate-extend/)

## 矩阵

<!-- laTex矩阵表示
$$
\begin{gathered}
\begin{matrix} 0 & 1 \\\ 1 & 0 \end{matrix}
\quad
\begin{pmatrix} 0 & -i \\\ i & 0 \end{pmatrix}
\quad
\begin{bmatrix} 0 & -1 \\\ 1 & 0 \end{bmatrix}
\quad
\begin{Bmatrix} 1 & 0 \\\ 0 & -1 \end{Bmatrix}
\quad
\begin{vmatrix} a & b \\\ c & d \end{vmatrix}
\quad
\begin{Vmatrix} i & 0 \\\ 0 & -i \end{Vmatrix}
\end{gathered}
$$
-->

#### 矩阵向量表示

我们可以用一个矩阵来表示向量，如一个二维向量可以这样表示：

$ A = \begin{pmatrix} x \\\ y \end{pmatrix} $

$ A^T = \begin{pmatrix} x & y \end{pmatrix} $ _转置矩阵_

_注:一般习惯用列向量来表示，用行向量表示也可以，本质上没有区别_

#### 叉乘的性质

$\vec{x} \times \vec{y} = +\vec{z}$
$\vec{y} \times \vec{x} = -\vec{z}$
$\vec{y} \times \vec{z} = +\vec{x}$
$\vec{z} \times \vec{y} = -\vec{x}$
$\vec{z} \times \vec{x} = +\vec{y}$
$\vec{x} \times \vec{z} = -\vec{y}$

以上常用于定坐标系。

$\vec{a} \times \vec{b} = -\vec{b} \times \vec{a}$

$\vec{a} \times \vec{a} = 0$

$\vec{a} \times (\vec{b} + \vec{c})= \vec{a} \times \vec{b} + \vec{a} \times \vec{c}$

$\vec{a} \times (k \vec{b})= k(\vec{a} \times \vec{b})$

#### 矩阵表示

一个 m $\times$ n 的数组 $(m :rows, n :columns)$，例：

$ \begin{pmatrix} 1 & 3 \\\ 5 & 2 \\\ 0 & 4 \end{pmatrix} $

#### 矩阵相乘

必须满足：$(M \times {\color{red}{N}}) ({\color{red}{N}} \times P) = (M \times P)$

#### 如何计算

结果矩阵的元素 (i, j) 是，A 矩阵的第 i 行和 B 矩阵的第 j 列 点乘的结果。

$$
\begin{pmatrix} 1&3 \\\ 5&2 \\\ 0&4 \end{pmatrix} \begin{pmatrix} 3&6&9&4 \\\ 2&7&8&3 \end{pmatrix} = \begin{pmatrix} 9&27&33&13 \\\ 19&44&61&26 \\\ 8&28&32&12 \end{pmatrix}
$$

#### 矩阵乘法属性

- **不满足交换律**
  $AB \neq BA$

- 结合律和分配率可用
  $(AB)C = A(BC)$
  $A(B+C) = AB + AC$
  $(A+B)C = AC + BC$

## 变换

#### 缩放 Scale

$$
\begin{bmatrix} x' \\\ y' \end{bmatrix} = \begin{bmatrix} S_x&0 \\\ 0&S_y \end{bmatrix} \begin{bmatrix} x \\\ y\end{bmatrix}
$$

#### 剪切变换 Shear Matrix

$$
\begin{bmatrix} x' \\\ y' \end{bmatrix} = \begin{bmatrix} 1&a \\\ b&1 \end{bmatrix} \begin{bmatrix} x \\\ y\end{bmatrix}
$$

#### 旋转 Rotate

一切旋转不作特别说明的，都是以原点$(0,0)$为轴，逆时针(CCW)进行旋转。

$$
\begin{bmatrix} x' \\\ y' \end{bmatrix} = \begin{bmatrix} \\cos \\theta & -\\sin \\theta \\\ \\sin \\theta & \\cos \\theta \end{bmatrix} \begin{bmatrix} x \\\ y\end{bmatrix}
$$

#### 以上形式，我们称为线性变换

$ x' = ax + by $
$ y' = cx + dy $

<br />

$ \begin{bmatrix} x' \\\ y' \end{bmatrix} = \begin{bmatrix} a&b \\\ c&d \end{bmatrix} \begin{bmatrix} x \\\ y\end{bmatrix} $

<br />

$ x' = M x $

#### 平移 Translation

平移 $(t_x, t_y)$的距离，则：

$ x' = x + t_x $
$ y' = y + t_y $

<br />

$ \begin{bmatrix} x' \\\ y' \end{bmatrix} = \begin{bmatrix} a&b \\\ c&d \end{bmatrix} \begin{bmatrix} x \\\ y\end{bmatrix} + \begin{bmatrix} t_x \\\ t_y \end{bmatrix} $

$ {\color{red}{这是一个非线性变换}} $

为了解决平移非线性变换的问题，使所有变换能统一计算。引入 **齐次坐标 Homogenous Coordinates**

## 齐次坐标 Homogenous Coordinates

添加一个坐标，称为：w-coordinate

对于二维来说：

- 2D point = $ (x, y, {\color{red}{1}})^T $
- 2D vector = $ (x, y, {\color{red}{0}})^T $

通过 w-coordinate 的结果是 1 或 0，来验证

- vector + vector = vector
- point - point = vector
- point + vector = point
- point + point = center point

在齐次坐标中，如果 $ \begin{pmatrix} x \\\ y \\\ w \end{pmatrix} $ 是一个 2D 点，我们可以把 w-coordinate 归一，$ \begin{pmatrix} x/w \\\ y/w \\\ 1 \end{pmatrix} $, $ w \neq 0 $

#### 平移

有了齐次坐标，平移就可以表示为：

$ \begin{pmatrix} x' \\\ y' \\\ w' \end{pmatrix} = \begin{pmatrix} 1&0&t_x \\\ 0&1&t_y \\\ 0&0&1 \end{pmatrix} \\cdot \begin{pmatrix} x \\\ y \\\ 1 \end{pmatrix} = \begin{pmatrix} x+t_x \\\ y+t_y \\\ 1 \end{pmatrix} $

## 仿射变换 Affine Transformations

仿射变换 = 线性变换 + 平移变换

$ \begin{pmatrix} x' \\\ y' \end{pmatrix} = \begin{pmatrix} a&b \\\ c&d \end{pmatrix} \\cdot \begin{pmatrix} x \\\ y \end{pmatrix} + \begin{pmatrix} x' \\\ y' \end{pmatrix} $

使用齐次坐标

$ \begin{pmatrix} x' \\\ y' \\\ 1 \end{pmatrix} = \begin{pmatrix} a&b&t_x \\\ c&d&t_y \\\ 0&0&1 \end{pmatrix} \\cdot \begin{pmatrix} x \\\ y \\\ 1 \end{pmatrix} $

_可以看出变换矩阵的最后一行，始终是 0 0 1_

## 组合变换 Composite Transform

可以想象，使用旋转矩阵 R 和平移矩阵 T。先进行平移 T，再做旋转 R；和先进行旋转 R，再做平移 T，结果肯定是不一样的，既：$ RT \neq TR $。 这也证明了，矩阵不满足交换律。（记住：旋转默认情况下以原点，逆时针进行）

一个复杂的组合变换：

$ \begin{pmatrix} x' \\\ y' \\\ 1 \end{pmatrix} = A_n \\cdot \\cdot \\cdot A_2 \\cdot A_1 \\cdot \begin{pmatrix} x \\\ y \\\ 1 \end{pmatrix} $

其中，$ A_n \\cdot \\cdot \\cdot A_2 \\cdot A_1 $，是多个变换矩阵。

由于矩阵乘法满足分配律，且这些矩阵相乘，最终还是一个矩阵，所以，组合变换用一个矩阵就可以进行表示。

## 3D 变换

还是使用齐次坐标：

- 3D point = $ (x, y, z, {\color{red}{1}})^T $
- 3D vector = $ (x, y, z, {\color{red}{0}})^T $

一般地，$ (x, y, z, w) (w \neq 0) $ ，代表 3 维坐标点：$ (x/w, y/w, z/w) $

3D 的仿射变换，使用 $ 4 \times 4 $矩阵表示：

$ \begin{pmatrix} x' \\\ y' \\\ z' \\\ 1 \end{pmatrix} = \begin{pmatrix} a&b&c&t_x \\\ d&e&f&t_y \\\ g&h&i&t_z \\\ 0&0&0&1 \end{pmatrix} \\cdot \begin{pmatrix} x \\\ y \\\ z \\\ 1 \end{pmatrix} $

## 顺序

从上面文章中平移的公式：

$ \begin{bmatrix} x' \\\ y' \end{bmatrix} = \begin{bmatrix} a&b \\\ c&d \end{bmatrix} \begin{bmatrix} x \\\ y\end{bmatrix} + \begin{bmatrix} t_x \\\ t_y \end{bmatrix} $

可以看出，先做线性变换，再做平移。

---

_版权声明：_
_除非注明，本博文章均为原创，转载请以链接形式标明本文地址。_

---
