---
title: 3D Tiles格式规范
top: false
cover: false
toc: true
mathjax: false
comment: true
date: 2021-04-21 20:12:57
author:
keywords:
img:
coverImg:
password:
summary:
categories:
tags:
---

## 写在前面

经常要用 3D Tiles 数据格式，官方文档只有英文的版本，看官网文档对于我这个英渣来说太慢太费时了，还是中文看着最顺眼。故准备翻译归纳总结一个中文版的 3D Tiles 数据格式规范，留着以后查询使用。

有疑问、异议的地方，还是建议去官网文档看原版的更加准确。

3D Tiles 规范官网文档地址：[https://github.com/CesiumGS/3d-tiles/tree/master/specification](https://github.com/CesiumGS/3d-tiles/tree/master/specification)

写到这的时候，官网文档的版本是：_`Version 1.0, June 6th, 2018`_

## 引子 glTF

3D Tiles 规范重点在于解决三维模型 Tile（瓦片、切片）的问题，实际模型是基于 glTF 来构建的，所以了解 3D Tiles 就要先了解 glTF。

glTF (GL Transmission Format) 的创建目的，是为 3D 内容工具和服务定义了一种可扩展的通用发布格式。具体规范又是一大片文章了，这里先埋坑了，后面再补。

glTF 规范官网文档地址：[https://github.com/KhronosGroup/glTF/tree/master/specification](https://github.com/KhronosGroup/glTF/tree/master/specification)

_注意：glTF 已经有版本分支了_

## 介绍

3D Tiles 专为流式传输和渲染大量 3D 地理空间内容而设计，例如摄影测量、3D 建筑、BIM / CAD、要素实例和点云。它定义了分层的数据结构和一组可传递渲染内容的切片格式。3D Tiles 没有为可视化的内容明确的定义规则。客户可以视其需要可视化 3D Tiles 的数据。

在 3D Tiles 中，tileset 是按空间数据结构（tree）组织的一组瓦片(Tile)。tileset 是由至少一个 tileset JSON 文件构成，包括 tileset 元数据和 瓦片(Tile) 对象树，其中每个可渲染内容对象都是以下格式之一：

|                   格式                   |                                用途                                 |
| :--------------------------------------: | :-----------------------------------------------------------------: |
| 批处理 3D 模型 (Batched 3D Model (b3dm)) | 异构 3D 模型。例如带纹理的地形和表面，3D 建筑外部和内部，大型模型。 |
| 实例 3D 模型 (Instanced 3D Model (i3dm)) |                 3D 模型实例。例如树木，风车，螺栓。                 |
|        点云 (Point Cloud (pnts))         |                             大量的点。                              |
|        复合对象 Composite (cmpt)         |                  将不同格式的图块合并为一个图块。                   |

瓦片(Tile)（瓦片格式的一个单独实例）是一个二进制 blob，具有特定的组件格式，包括要素表(Feature Table)和批处理表(Batch Table)。

内容引用了一组要素，例如表示建筑物/树木的 3D 模型或点云中的点。每个要素的位置和外观属性都存储在瓦片(Tile)的要素表(Feature Table)中，额外附加或应用特定（additional application-specific）的属性存储在批处理表(Batch Table)中。客户端可以在运行时选择要素，并获取其属性以进行可视化或分析。

批处理 3D 模型(Batched 3D Model)和实例 3D 模型(Instanced 3D Model)格式基于 glTF 构建，glTF 是一个为高效传输 3D 内容而设计的开放规范。这些格式的瓦片内容嵌入 glTF 资源的二进制主体中，其中包含模型几何和纹理信息。点云格式未嵌入 glTF。

瓦片(Tile)以树形结构组织，其中结合了详细层次结构（HLOD：Hierarchical Level of Detail）的概念，以实现空间数据的最佳渲染呈现。每个图块都有一个边界体（bounding volume），即一个对象，该对象定义了一个完全包围其内容的空间范围。树具有空间连贯性; 子瓦片的内容完整的包含在父级的边界体之内。

![](https://gitee.com/Jackie_Tang/Jackie_Tang/raw/master/my_images/2021-04/3d-tiles/tree.jpg)

切片集可以使用类似于栅格和矢量切片（如 Web 地图切片服务（WMTS）或 XYZ 方案）的 2D 空间切片方案，该二维空间切片方案以多级别（LOD）（或缩放级别）提供预定义的切片。但是，由于切片集的内容通常是不一致的，很难仅在二维上组织，因此树可以是具有空间一致性的任何空间数据结构，包括 k-d 树，四叉树，八叉树和网格。

可选地，可以将 3D Tiles 样式或 style 应用于 tileset。样式由表达式来定义其中的每一个要素显示方式。

## 文件扩展名和 MIME 类型

3D Tiles 使用以下文件扩展名和 MIME 类型。

- Tileset 文件使用 `.json` 扩展名和 `application/json` MIME 类型。
- 切片内容文件使用特定于其切片格式规范的文件类型和 MIME 格式。
- Tileset 样式文件使用 `.json` 扩展名和 `application/json` MIME 类型。
  显式文件扩展名是可选的。有效的实现可能会忽略它，并通过其头中的 `magic` 字段标识内容的格式。

## JSON 编码

3D Tiles 对 JSON 格式和编码具有以下限制。

1. JSON 必须使用没有 BOM 的 UTF-8 编码。
2. 本规范中定义的所有字符串（属性名称，枚举）仅使用 ASCII 字符集，并且必须以纯文本形式编写。
3. JSON 对象中的名称（键）必须唯一，即不允许重复的键。

## URIs

3D Tiles 使用 URI 来引用 tile 内容。这些 URI 可以指向相对外部引用（[RFC3986](https://tools.ietf.org/html/rfc3986#section-4.2)），也可以是将资源嵌入 JSON 的数据 URI。嵌入式资源使用“数据” URI 方案（[RFC2397](https://tools.ietf.org/html/rfc2397)）。

如果 URI 是相对的，则其根始终相对于引用的 tileet JSON 文件。

客户端实现需要支持相对的外部引用和嵌入式资源。可选地，客户端实现可以支持其他方案（例如 http://）。所有 URI 必须有效且可解析。

## 单位

所有线性距离的单位是米。

所有角度均以弧度为单位。

## 坐标参考系统（CRS）

3D Tiles 使用右手笛卡尔坐标系；也就是说，x 和 y 的叉积得出 z。3D Tiles 将 z 轴定义为局部笛卡尔坐标系的上方向。一个数据集的全局坐标系通常位于 [WGS 84](http://earth-info.nga.mil/GandG/publications/tr8350.2/wgs84fin.pdf) 以地球为中心，固定于地球（ECEF）的参考系（[EPSG 4978](http://spatialreference.org/ref/epsg/4978/)）中，但不必须如此，例如，一个发电厂可以定义在其局部坐标系内，而不使用空间数据内容，仅仅使用模型工具。

可以应用额外的瓦片变换（tile transform）来将瓦片的局部坐标系变换为父瓦片的坐标系。

区域边界体指定边界使用地理坐标系（纬度，经度，高度），详情 [EPSG 4979](http://spatialreference.org/ref/epsg/4979/)。

## Tiles

瓦片(Tiles)由元数据组成，用于定义瓦片(tile)是否渲染，可渲染内容的引用，以及子瓦片的数组。

## 几何误差（Geometric error）

瓦片是树形结构合并构成的详细层次结构`Hierarchical Level of Detail (HLOD)`，以便客户端在运行时实现 瓦片 是否完全渲染 ， 以及瓦片的内容是否应由高质量的子瓦片来依次完成。一种实现是考虑最大屏幕允许空间误差`Screen-Space Error (SSE)`，该误差以像素为单位。

瓦片的几何误差定义了该瓦片的选择指标。它的值是一个非负数，来指定瓦片几何图形的最简化表示时的误差（单位：米）。根图块是源几何图形的最简化版本，其几何误差最大。然后，每个连续级别的子级将具有比其父级低的几何误差，而叶子图块的几何误差为 0 或接近 0。

在客户端实现中，几何误差与其他屏幕空间指标一起使用（例如，瓦片到相机的距离，屏幕大小和分辨率），以计算当瓦片被渲染而子瓦片不需要渲染时需要引入的几何误差（SSE）。如果引入的几何误差（SSE）超过了所允许的最大值，则将优化瓦片并考虑渲染其子级。

几何误差是根据诸如点密度，米为单位的瓦片大小，或该图块特有的其他因素之类的度量标准制定的。通常，较高的几何误差意味着更积极地细化图块，并且将更快地加载和渲染子图块。

## 细化/优化（Refinement）

优化决定了较低分辨率的父瓦片被选择渲染的子级时渲染的过程。允许的细化类型为替换（"REPLACE"）和添加（"ADD"）。如果瓦片具有“替换”的细化配置，则将渲染子瓦片代替父瓦片，即不再渲染父瓦片。如果瓦片具有“添加”的细化配置，则除了父瓦片之外，还将渲染子瓦片。

区块集可以仅使用替换优化，仅添加改进或添加和替换优化的任意组合。

Tileset 的根图块需要细化类型；对于所有其他磁贴，它是可选的。如果省略，则 tile 会继承其父级的优化类型。

---

_版权声明：_
_除非注明，本博文章均为原创，转载请以链接形式标明本文地址。_

---
