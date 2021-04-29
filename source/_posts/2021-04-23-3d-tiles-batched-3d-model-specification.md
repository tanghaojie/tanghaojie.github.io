---
title: 3D Tiles批处理3D模型 (Batched 3D Model)数据格式标准规范
top: false
cover: false
toc: true
mathjax: false
comment: true
date: 2021-04-23 21:43:25
author:
keywords:
img:
coverImg:
password:
summary:
categories:
  - 3D Tiles
tags:
  - 3D Tiles
---

## 导航

- <a href="#引" class="self">引</a>
- <a href="#概述" class="self">概述</a>
- <a href="#文件结构" class="self">文件结构</a>
  - <a href="#详细内容" class="self">详细内容</a>
- <a href="#要素表" class="self">要素表</a>

  - <a href="#语法定义" class="self">语法定义</a>
    - <a href="#要素定义" class="self">要素定义</a>
    - <a href="#全局定义" class="self">全局定义</a>

- <a href="#批处理表" class="self">批处理表</a>
- <a href="#二进制glTF" class="self">二进制 glTF</a>
  - <a href="#坐标系" class="self">坐标系</a>
- <a href="#扩展名和MIME类型" class="self">扩展名和 MIME 类型</a>

- <a href="#实例" class="self">实例</a>
- <a href="#属性参考" class="self">属性参考</a>

---

<a id="引" name="引"></a>

## 引

[官网文档](https://github.com/CesiumGS/3d-tiles/blob/master/specification/TileFormats/Batched3DModel)

<a id="概述" name="概述"></a>

## 概述

`批处理 3D 模型`允许离线批处理混合的 3D 模型（例如城市中的各个建筑物），高效地以流式传输到 Web 客户端进行渲染和交互。高效率来自于在单个请求中传输多个模型，并在所需的最少数量的 WebGL 绘制调用中呈现它们。使用核心 3D Tiles 规范语言，每个模型都是一个功能。

每个模型的属性（例如 ID）都可以在运行时识别和更新各个模型，例如显示/隐藏，突出显示颜色等。可以使用属性来查询 Web 服务以访问元数据，例如传递建筑物的 ID 以获取其地址。或者可以动态引用属性以更改模型的外观，例如，基于属性值更改突出显示颜色。

批处理 3D 模型图块是小尾数形式的二进制 Blob。

---

<a id="文件结构" name="文件结构"></a>

## 文件结构

---

<a id="详细内容" name="详细内容"></a>

### 详细内容

---

<a id="要素表" name="要素表"></a>

## 要素表

<a id="语法定义" name="语法定义"></a>

### 语法定义

<a id="要素定义" name="要素定义"></a>

#### 要素定义

---

<a id="全局定义" name="全局定义"></a>

#### 全局定义

---

---

<a id="批处理表" name="批处理表"></a>

## 批处理表

---

<a id="二进制glTF" name="二进制glTF"></a>

## 二进制 glTF

<a id="坐标系" name="坐标系"></a>

### 坐标系

---

<a id="扩展名和MIME类型" name="扩展名和MIME类型"></a>

## 扩展名和 MIME 类型

---

<a id="实例" name="实例"></a>

## 实例

---

<a id="属性参考" name="属性参考"></a>

## 属性参考

<a href="#r批处理表" class="self">批处理表</a>
<a href="#r二进制体引用" class="self">二进制体引用</a>
<a href="#r属性" class="self">属性</a>

---

<a id="r批处理表" name="r批处理表"></a>

### 批处理表

---

<a id="r二进制体引用" name="r二进制体引用"></a>

### 二进制体引用

---

<a id="r属性" name="r属性"></a>

### 属性

---

---

_版权声明：_
_除非注明，本博文章均为原创，转载请以链接形式标明本文地址。_

---
