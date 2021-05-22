---
title: 3D Tiles复合对象(Composite)数据格式标准规范
top: false
cover: false
toc: true
mathjax: false
comment: true
date: 2021-04-23 21:44:17
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

- <a href="#内部瓦片" class="self">内部瓦片</a>

- <a href="#文件扩展名和MIME类型" class="self">文件扩展名和 MIME 类型</a>

- <a href="#实现示例" class="self">实现示例</a>

---

<a id="引" name="引"></a>

## 引

[官网文档](https://github.com/CesiumGS/3d-tiles/tree/master/specification/TileFormats/Composite)

<a id="概述" name="概述"></a>

## 概述

复合对象格式允许拼接的不同格式的数据变成一个区块。

3D 瓦片和复合对象瓦片为流式异构数据集提供了灵活性。例如，建筑物和树木可以存储在两个单独的“批处理 3D 模型”和“实例化 3D 模型”图块中，或者可以使用“复合”图块进行组合。

支持瓦片间（同一数据集中不同格式的不同瓦片）和瓦片内（同一复合图块中不同格式的瓦片）选项的异构数据集，使转换工具可以在多个请求之间进行权衡，优化特定类型的细分方式，以及可见/隐藏层的流式传输方式。

复合数据是小端字节序的二进制 Blob。

---

<a id="文件结构" name="文件结构"></a>

## 文件结构

复合数据的文件结构（破折号表示可选字段）：

![](https://jackie_tang.gitee.io/pic_cloud/2021-04/3d-tiles/ccc.png)

---

<a id="结构填充" name="结构填充"></a>

### 结构填充

数据 `byteLength` 必须以 8 个字节进行边界对齐。包含的所有数据也必须对齐 8 个字节的边界。

---

<a id="文件头" name="文件头"></a>

## 文件头

16 字节的文件头包含以下字段：

| 字段名        | 类型               | 描述                                                       |
| ------------- | ------------------ | ---------------------------------------------------------- |
| `magic`       | 4 字节 ANSI 字符串 | `"cmpt"`                                                   |
| `version`     | `uint32`           | 版本。现在是`1`                                            |
| `byteLength`  | `uint32`           | 整个复合数据的长度（包括标头和每个内部数据），以字节为单位 |
| `tilesLength` | `uint32`           | 复合中的图块数                                             |

---

<a id="内部瓦片" name="内部瓦片"></a>

## 内部瓦片

内部瓦片字段紧跟在文件头部分之后。以下信息描述了复合图块读取器可能利用其来查找内部图块边界的所有图块格式的一般特征：

- 每个图块均以 4 字节 ANSI 字符串开头，该字符串 `magic` 可用于确定图块格式以进行进一步解析。有关可能格式的列表，请参见[瓦片格式规范](/2021/04/21/3d-tiles-specification/#瓦片格式规范)。复合图块可以包含复合图块。

- 每个图块的标头包含一个 `uint32` `byteLength`，用于定义内部图块的长度（包括其标头），以字节为单位。这可用于遍历内部瓦片。

- 对于任何版本为 1 的图块格式，所有图块的前 12 个字节为以下字段：

| 字段名       | 类型               | 描述                           |
| ------------ | ------------------ | ------------------------------ |
| `magic`      | 4 字节 ANSI 字符串 | 表示图块格式                   |
| `version`    | `uint32`           | `1`                            |
| `byteLength` | `uint32`           | 整个图块的长度（以字节为单位） |

有关更多详细信息，请参考每种图块格式的规范。

---

<a id="文件扩展名和MIME类型" name="文件扩展名和MIME类型"></a>

## 文件扩展名和 MIME 类型

复合图块使用`.cmpt`扩展名和`application/octet-stream`MIME 类型。

显式文件扩展名是可选的。有效的实现可能会忽略它，并通过 `magic` 其标头中的字段标识内容的格式。

---

<a id="实现示例" name="实现示例"></a>

## 实现示例

本节是非规范性的

- [Python gltf2glb 工具集中的 `packcmpt` 工具](https://github.com/Geopipe/gltf2glb)包含用于将一个或多个“批处理 3D 模型”或“实例化 3D 模型”图块组合到单个“复合”图块文件中的代码。

- 可以在 3D Tiles 的 CesiumJS 实现 [Composite3DTileContent.js](https://github.com/CesiumGS/cesium/blob/master/Source/Scene/Composite3DTileContent.js) 中找到用于读取文件头的代码 。

---

---

_版权声明：_
_除非注明，本博文章均为原创，转载请以链接形式标明本文地址。_

---
