---
title: 3D Tiles点云(Point Cloud)数据格式标准规范
top: false
cover: false
toc: true
mathjax: false
comment: true
date: 2021-04-23 21:44:04
author:
keywords:
img:
coverImg:
password:
summary:
categories:
  - 3D Tiles
  - specification
tags:
  - 3D Tiles
  - specification
---

## 导航

- <a href="#引" class="self">引</a>

- <a href="#概述" class="self">概述</a>

- <a href="#文件结构" class="self">文件结构</a>

  - <a href="#结构填充" class="self">结构填充</a>

- <a href="#文件头" class="self">文件头</a>

- <a href="#要素表" class="self">要素表</a>

  - <a href="#语法定义" class="self">语法定义</a>

    - <a href="#点语法" class="self">点语法</a>
    - <a href="#全局语法" class="self">全局语法</a>

  - <a href="#点位置" class="self">点位置</a>

    - <a href="#坐标系" class="self">坐标系</a>
    - <a href="#RTC_CENTER" class="self">RTC_CENTER</a>
    - <a href="#量化位置" class="self">量化位置</a>

  - <a href="#点颜色" class="self">点颜色</a>

  - <a href="#点法线" class="self">点法线</a>

    - <a href="#八进制编码的法向向量" class="self">八进制编码的法向向量</a>

  - <a href="#批处理点" class="self">批处理点</a>

  - <a href="#例子" class="self">例子</a>

    - <a href="#仅位置" class="self">仅位置</a>
    - <a href="#位置和颜色" class="self">位置和颜色</a>
    - <a href="#量化位置和八进制编码法线" class="self">量化位置和八进制编码法线</a>
    - <a href="#批处理点sub" class="self">批处理点</a>
    - <a href="#每个点的属性" class="self">每个点的属性</a>

- <a href="#批量表" class="self">批量表</a>

- <a href="#扩展" class="self">扩展</a>

- <a href="#文件扩展名和MIME类型" class="self">文件扩展名和 MIME 类型</a>

- <a href="#实现示例" class="self">实现示例</a>

- <a href="#属性参考" class="self">属性参考</a>

---

<a id="引" name="引"></a>

## 引

[官网文档](https://github.com/CesiumGS/3d-tiles/tree/master/specification/TileFormats/PointCloud)

<a id="概述" name="概述"></a>

## 概述

---

<a id="文件结构" name="文件结构"></a>

## 文件结构

---

<a id="结构填充" name="结构填充"></a>

### 结构填充

---

<a id="文件头" name="文件头"></a>

## 文件头

---

<a id="要素表" name="要素表"></a>

## 要素表

---

<a id="语法定义" name="语法定义"></a>

### 语法定义

---

<a id="点语法" name="点语法"></a>

#### 点语法

---

<a id="全局语法" name="全局语法"></a>

#### 全局语法

---

<a id="点位置" name="点位置"></a>

### 点位置

---

<a id="坐标系" name="坐标系"></a>

#### 坐标系

---

<a id="RTC_CENTER" name="RTC_CENTER"></a>

#### RTC_CENTER

---

<a id="量化位置" name="量化位置"></a>

#### 量化位置

---

<a id="点颜色" name="点颜色"></a>

### 点颜色

---

<a id="点法线" name="点法线"></a>

### 点法线

---

<a id="八进制编码的法向向量" name="八进制编码的法向向量"></a>

#### 八进制编码的法向向量

---

<a id="批处理点" name="批处理点"></a>

### 批处理点

---

<a id="例子" name="例子"></a>

### 例子

---

<a id="仅位置" name="仅位置"></a>

#### 仅位置

---

<a id="位置和颜色" name="位置和颜色"></a>

#### 位置和颜色

---

<a id="量化位置和八进制编码法线" name="量化位置和八进制编码法线"></a>

#### 量化位置和八进制编码法线

---

<a id="批处理点sub" name="批处理点sub"></a>

#### 批处理点

---

<a id="每个点的属性" name="每个点的属性"></a>

#### 每个点的属性

---

<a id="批量表" name="批量表"></a>

## 批量表

---

<a id="扩展" name="扩展"></a>

## 扩展

---

<a id="文件扩展名和MIME类型" name="文件扩展名和MIME类型"></a>

## 文件扩展名和 MIME 类型

---

<a id="实现示例" name="实现示例"></a>

## 实现示例

---

<a id="属性参考" name="属性参考"></a>

## 属性参考

- <a href="#r点云要素表" class="self">点云要素表</a>
  - <a href="#r二进制体引用" class="self">二进制体引用</a>
  - <a href="#r全局笛卡尔3坐标系属性" class="self">全局笛卡尔 3 坐标系属性</a>
  - <a href="#r全局笛卡尔4坐标系属性" class="self">全局笛卡尔 4 坐标系属性</a>
  - <a href="#r全局标量属性" class="self">全局标量属性</a>
  - <a href="#r属性" class="self">属性</a>

---

<a id="r点云要素表" name="r点云要素表"></a>

### 点云要素表

---

<a id="r二进制体引用" name="r二进制体引用"></a>

### 二进制体引用

---

<a id="r全局笛卡尔3坐标系属性" name="r全局笛卡尔3坐标系属性"></a>

### 全局笛卡尔 3 坐标系属性

---

<a id="r全局笛卡尔4坐标系属性" name="r全局笛卡尔4坐标系属性"></a>

### 全局笛卡尔 4 坐标系属性

---

<a id="r全局标量属性" name="r全局标量属性"></a>

### 全局标量属性

---

<a id="r属性" name="r属性"></a>

### 属性

---

_版权声明：_
_除非注明，本博文章均为原创，转载请以链接形式标明本文地址。_

---
