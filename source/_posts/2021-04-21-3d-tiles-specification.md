---
title: 3D Tiles数据格式标准规范
top: false
cover: true
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
  - 3D Tiles
tags:
  - 3D Tiles
---

## 导航

- <a href="#写在前面" class="self">写在前面</a>
- <a href="#引子glTF" class="self">引子 glTF</a>
- <a href="#简介" class="self">简介</a>
- <a href="#文件扩展名和MIME类型" class="self">文件扩展名和 MIME 类型</a>
- <a href="#JSON编码" class="self">JSON 编码</a>
- <a href="#URIs" class="self">URIs</a>
- <a href="#单位" class="self">单位</a>
- <a href="#坐标参考系统（CRS）" class="self">坐标参考系统（CRS）</a>

- <a href="#概念" class="self">概念</a>

  - <a href="#Tiles" class="self">Tiles</a>

    - <a href="#几何误差（Geometric error）" class="self">几何误差（Geometric error）</a>
    - <a href="#细化/优化（Refinement）" class="self">细化/优化（Refinement）</a>
    - <a href="#边界盒/边界体（Boundingvolumes）" class="self">边界盒/边界体（Bounding Volumes）</a>
      - <a href="#边界盒（Box）" class="self">边界盒（Box）</a>
      - <a href="#边界球（Sphere）" class="self">边界球（Sphere）</a>
      - <a href="#边界区（Region）" class="self">边界区（Region）</a>
    - <a href="#观察请求盒/体（Viewerrequestvolume）" class="self">观察请求盒/体（Viewer Request Volume）</a>
    - <a href="#变换（Transforms）" class="self">变换（Transforms）</a>
      - <a href="#瓦片变换（Tiletransforms）" class="self">瓦片变换（Tile Transforms）</a>
      - <a href="#glTF变换（glTFtransforms）" class="self">glTF 变换（glTF Transforms）</a>
      - <a href="#实例" class="self">实例</a>
    - <a href="#瓦片JSON" class="self">瓦片 JSON</a>

  - <a href="#TilesetJSON" class="self">Tileset JSON</a>
    - <a href="#外部数据集（Externaltilesets）" class="self">外部数据集（External Tilesets）</a>
    - <a href="#边界体空间连续性（Boundingvolumespatialcoherence）" class="self">边界体空间连续性（Bounding volume spatial coherence）</a>
    - <a href="#空间数据结构（Spatialdatastructures）" class="self">空间数据结构（Spatial data structures）</a>
      - <a href="#四叉树（Quadtrees）" class="self">四叉树（Quadtrees）</a>
      - <a href="#K-d树（K-dtrees，K维树）" class="self">K-d 树（K-dtrees，K 维树）</a>
      - <a href="#八叉树（Octrees）" class="self">八叉树（Octrees）</a>
      - <a href="#网格（Grids）" class="self">网格（Grids）</a>
  - <a href="#扩展和附加功能" class="self">扩展和附加功能</a>
    - <a href="#扩展" class="self">扩展</a>
    - <a href="#附加功能" class="self">附加功能</a>

- <a href="#瓦片格式规范" class="self">瓦片格式规范</a>
- <a href="#声明式样式规范" class="self">声明式样式规范</a>
- <a href="#属性参考" class="self">属性参考</a>

---

<a id="写在前面" name="写在前面"></a>

## 写在前面

经常要用 3D Tiles 数据格式，官方文档只有英文的版本，看官网文档对于我这个英渣来说太慢太费时了，还是中文看着最顺眼。故准备翻译归纳总结一个中文版的 3D Tiles 数据格式规范，留着以后查询使用。

有疑问、异议的地方，还是建议去官网文档看原版的更加准确。

[3D Tiles 官网文档](https://github.com/CesiumGS/3d-tiles/tree/master/specification)

写到这的时候，官网文档的版本：_`Version 1.0, June 6th, 2018`_

---

<a id="引子glTF" name="引子glTF"></a>

## 引子 glTF

3D Tiles 规范重点在于解决三维模型 Tile（瓦片、切片）的问题，实际模型是基于 glTF 来构建的，所以了解 3D Tiles 就要先了解 glTF。

glTF (GL Transmission Format) 的创建目的，是为 3D 内容工具和服务定义了一种可扩展的通用发布格式。具体规范又是一大片文章了，这里先埋坑了，后面再补。

[glTF 数据格式标准规范](/2021/04/23/glTF-specification)

_注意：glTF 已经有版本分支了_

---

<a id="简介" name="简介"></a>

## 简介

3D Tiles 专为流式传输和渲染大量 3D 地理空间内容而设计，例如摄影测量、3D 建筑、BIM / CAD、要素实例和点云。它定义了分层的数据结构和一组可传递渲染内容的切片格式。3D Tiles 没有为可视化的内容明确的定义规则。客户可以视其需要可视化 3D Tiles 的数据。

在 3D Tiles 中，tileset 是按空间数据结构（tree）组织的一组瓦片(Tile)。tileset 是由至少一个 tileset JSON 文件构成，包括 tileset 元数据和 瓦片(Tile) 对象树，其中每个可渲染内容对象都是以下格式之一：

|                                               格式                                                |                                用途                                 |
| :-----------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------: |
|  [批处理 3D 模型 (Batched 3D Model (b3dm))](/2021/04/23/3d-tiles-batched-3d-model-specification)  | 异构 3D 模型。例如带纹理的地形和表面，3D 建筑外部和内部，大型模型。 |
| [实例 3D 模型 (Instanced 3D Model (i3dm))](/2021/04/23/3d-tiles-instanced-3d-model-specification) |                 3D 模型实例。例如树木，风车，螺栓。                 |
|            [点云 (Point Cloud (pnts))](/2021/04/23/3d-tiles-point-cloud-specification)            |                             大量的点。                              |
|            [复合对象 (Composite (cmpt))](/2021/04/23/3d-tiles-composite-specification)            |                  将不同格式的图块合并为一个图块。                   |

瓦片(Tile)（瓦片格式的一个单独实例）是一个二进制 blob，具有特定的组件格式，包括[要素表(Feature Table)](/2021/04/23/3d-tiles-feature-table-specification)和[批处理表(Batch Table)](/2021/04/23/3d-tiles-batch-table-specification)。

内容引用了一组要素，例如表示建筑物/树木的 3D 模型或点云中的点。每个要素的位置和外观属性都存储在瓦片(Tile)的要素表(Feature Table)中，额外附加或应用特定（additional application-specific）的属性存储在批处理表(Batch Table)中。客户端可以在运行时选择要素，并获取其属性以进行可视化或分析。

批处理 3D 模型(Batched 3D Model)和实例 3D 模型(Instanced 3D Model)格式基于 [glTF](/2021/04/23/glTF-specification) 构建，glTF 是一个为高效传输 3D 内容而设计的开放规范。这些格式的瓦片内容嵌入 glTF 资源的二进制主体中，其中包含模型几何和纹理信息。点云格式未嵌入 glTF。

瓦片(Tile)以树形结构组织，其中结合了详细层次结构（HLOD：Hierarchical Level of Detail）的概念，以实现空间数据的最佳渲染呈现。每个图块都有一个边界盒（bounding volume），即一个对象，该对象定义了一个完全包围其内容的空间范围。树具有<a href="#边界体空间连续性（Boundingvolumespatialcoherence）" class="self">空间连贯性</a>; 子瓦片的内容完整的包含在父级的边界盒之内。

![](https://jackie_tang.gitee.io/pic_cloud/2021-04/3d-tiles/tree.png)

切片集可以使用类似于栅格和矢量切片（如 Web 地图切片服务（WMTS）或 XYZ 方案）的 2D 空间切片方案，该二维空间切片方案以多级别（LOD）（或缩放级别）提供预定义的切片。但是，由于切片集的内容通常是不一致的，很难仅在二维上组织，因此树可以是具有空间一致性的任何<a href="#空间数据结构（Spatialdatastructures）" class="self">空间数据结构</a>，包括 k-d 树，四叉树，八叉树和网格。

可选地，可以将[3D Tiles 样式](/2021/04/23/3d-tiles-styling-specification)或 style 应用于 tileset。样式由表达式来定义其中的每一个要素显示方式。

---

<a id="文件扩展名和MIME类型" name="文件扩展名和MIME类型"></a>

## 文件扩展名和 MIME 类型

3D Tiles 使用以下文件扩展名和 MIME 类型。

- Tileset 文件使用 `.json` 扩展名和 `application/json` MIME 类型。
- 切片内容文件使用特定于其切片格式<a href="#瓦片格式规范" class="self">规范的文件类型</a>和 MIME 格式。
- Tileset 样式文件使用 `.json` 扩展名和 `application/json` MIME 类型。
  显式文件扩展名是可选的。有效的实现可能会忽略它，并通过其头中的 `magic` 字段标识内容的格式。

---

<a id="JSON编码" name="JSON编码"></a>

## JSON 编码

3D Tiles 对 JSON 格式和编码具有以下限制。

1. JSON 必须使用没有 BOM 的 UTF-8 编码。
2. 本规范中定义的所有字符串（属性名称，枚举）仅使用 ASCII 字符集，并且必须以纯文本形式编写。
3. JSON 对象中的名称（键）必须唯一，即不允许重复的键。

---

<a id="URIs" name="URIs"></a>

## URIs

3D Tiles 使用 URI 来引用 tile 内容。这些 URI 可以指向相对外部引用（[RFC3986](https://tools.ietf.org/html/rfc3986#section-4.2)），也可以是将资源嵌入 JSON 的数据 URI。嵌入式资源使用“数据” URI 方案（[RFC2397](https://tools.ietf.org/html/rfc2397)）。

如果 URI 是相对的，则其根始终相对于引用的 tileet JSON 文件。

客户端实现需要支持相对的外部引用和嵌入式资源。可选地，客户端实现可以支持其他方案（例如 http://）。所有 URI 必须有效且可解析。

---

<a id="单位" name="单位"></a>

## 单位

所有线性距离的单位是米。

所有角度均以弧度为单位。

---

<a id="坐标参考系统（CRS）" name="坐标参考系统（CRS）"></a>

## 坐标参考系统（CRS）

3D Tiles 使用右手笛卡尔坐标系；也就是说，x 和 y 的叉积得出 z。3D Tiles 将 z 轴定义为局部笛卡尔坐标系的上方向。一个数据集的全局坐标系通常位于 [WGS 84](http://earth-info.nga.mil/GandG/publications/tr8350.2/wgs84fin.pdf) 以地球为中心，固定于地球（ECEF）的参考系（[EPSG 4978](http://spatialreference.org/ref/epsg/4978/)）中，但不必须如此，例如，一个发电厂可以定义在其局部坐标系内，而不使用空间数据内容，仅仅使用模型工具。

可以应用额外的<a href="#变换（Transforms）" class="self">数据变换（tile transform）</a>来将瓦片的局部坐标系变换为父瓦片的坐标系。

<a href="#边界区（Region）" class="self">边界区（Region）</a>使用地理坐标系（纬度，经度，高度）指定边界，详情 [EPSG 4979](http://spatialreference.org/ref/epsg/4979/)。

---

<a id="概念" name="概念"></a>

## 概念

<a id="Tiles" name="Tiles"></a>

### Tiles

瓦片(Tiles)由元数据组成，用于定义瓦片(tile)是否渲染，可渲染内容的引用，以及子瓦片的数组。

---

<a id="几何误差（Geometric error）" name="几何误差（Geometric error）"></a>

#### 几何误差（Geometric error）

瓦片是树形结构合并构成的详细层次结构`Hierarchical Level of Detail (HLOD)`，以便客户端在运行时实现 瓦片 是否完全渲染 ， 以及瓦片的内容是否应由高质量的子瓦片来依次完成。一种实现是考虑最大屏幕允许空间误差`Screen-Space Error (SSE)`，该误差以像素为单位。

瓦片的几何误差定义了该瓦片的选择指标。它的值是一个非负数，来指定瓦片几何图形的最简化表示时的误差（单位：米）。根图块是源几何图形的最简化版本，其几何误差最大。然后，每个连续级别的子级将具有比其父级低的几何误差，而叶子图块的几何误差为 0 或接近 0。

在客户端实现中，几何误差与其他屏幕空间指标一起使用（例如，瓦片到相机的距离，屏幕大小和分辨率），以计算当瓦片被渲染而子瓦片不需要渲染时需要引入的几何误差（SSE）。如果引入的几何误差（SSE）超过了所允许的最大值，则将优化瓦片并考虑渲染其子级。

几何误差是根据诸如点密度，米为单位的瓦片大小，或该图块特有的其他因素之类的度量标准制定的。通常，较高的几何误差意味着更积极地细化图块，并且将更快地加载和渲染子图块。

---

<a id="细化/优化（Refinement）" name="细化/优化（Refinement）"></a>

#### 细化/优化（Refinement）

优化决定了较低分辨率的父瓦片被选择渲染的子级时渲染的过程。允许的细化类型为`替换（"REPLACE"）`和`添加（"ADD"）`。如果瓦片具有“替换”的细化配置，则将渲染子瓦片代替父瓦片，即不再渲染父瓦片。如果瓦片具有“添加”的细化配置，则除了父瓦片之外，还将渲染子瓦片。

区块集可以仅使用替换优化，仅添加改进或添加和替换优化的任意组合。

Tileset 的根图块需要细化类型；对于所有其他磁贴，它是可选的。如果省略，则 tile 会继承其父级的优化类型。

---

<a id="边界盒/边界体（Boundingvolumes）" name="边界盒/边界体（Boundingvolumes）"></a>

#### 边界盒/边界体（Bounding volumes）

边界盒定义了包围图块或图块内容的空间范围。为了支持各种数据集的紧密拟合体积，例如规则划分的地形，未与纬度或经度线对齐的城市，或任意点云，边界盒类型包括有向边界框，边界球，和由最小、最大纬度，经度和高度定义的边界区。

---

<a id="边界盒（Box）" name="边界盒（Box）"></a>

##### 边界盒（Box）

`boundingVolume.box`属性是由 12 个数字组成的数组，在右手 3 轴（x，y，z）笛卡尔坐标系中定义的一个有向包围盒，其中 z 轴是。前三个元素定义框中心的 x，y 和 z 值。接下来的三个元素（索引为 3、4 和 5）定义了 x 轴方向和一半长度（half-length）。接下来的三个元素（索引 6、7 和 8）定义 y 轴方向和一半长度（half-length）。最后三个元素（索引 9、10 和 11）定义 z 轴方向和一半长度（half-length）。

![](https://jackie_tang.gitee.io/pic_cloud/2021-04/3d-tiles/BoundingBox.jpg)

```json
"boundingVolume": {
  "box": [
    0,   0,   10,
    100, 0,   0,
    0,   100, 0,
    0,   0,   10
  ]
}
```

---

<a id="边界球（Sphere）" name="边界球（Sphere）"></a>

##### 边界球（Sphere）

`boundingVolume.sphere`属性是由 4 个数字组成的数组定义的边界球。前三个元素在右手 3 轴（x，y，z）笛卡尔坐标系中定义球体中心的 x，y 和 z 值，其中 z 轴朝上。最后一个元素（索引为 3）以米为单位定义半径。

![](https://jackie_tang.gitee.io/pic_cloud/2021-04/3d-tiles/BoundingSphere.jpg)

```json
"boundingVolume": {
  "sphere": [
    0,
    0,
    10,
    141.4214
  ]
}
```

---

<a id="边界区（Region）" name="边界区（Region）"></a>

##### 边界区（Region）

`boundingVolume.region`属性是一个由 6 个数字组成的数组，定义了由纬度，经度和高度坐标的地理边界区，使用`[west, south, east, north, minimum height, maximum height]`的顺序。纬度和经度是在 [EPSG 4979](http://spatialreference.org/ref/epsg/4979/) 中定义的 WGS 84 基准，以弧度表示。高度在 [WGS 84 椭球](http://earth-info.nga.mil/GandG/publications/tr8350.2/wgs84fin.pdf)上方（或下方）以米为单位。

![](https://jackie_tang.gitee.io/pic_cloud/2021-04/3d-tiles/BoundingRegion.jpg)

```json
"boundingVolume": {
  "region": [
    -1.3197004795898053,
    0.6988582109,
    -1.3196595204101946,
    0.6988897891,
    0,
    20
  ]
}
```

---

<a id="观察请求盒/体（Viewerrequestvolume）" name="观察请求盒/体（Viewerrequestvolume）"></a>

#### 观察请求盒/体（Viewer request volume）

瓦片的 观察请求盒/体（Viewer request volume） 可以用于组合异构数据集，也可以与外部数据集组合。

以下示例是一个在`b3dm`瓦片中的建筑物，并在建筑物中包含了在`pnts`瓦片中的点云。点云瓦片的`boundingVolume`是半径为 `1.25` 的边界球。它还有一个更大的，半径为 `15` 的`viewerRequestVolume`边界球配置。由于 `geometricError` 值为零，因此当观察者位于由`viewerRequestVolume`所定义的大的边界球内时，始终会渲染点云的内容。

简单来说，`viewerRequestVolume`是一个比`boundingVolume`优先级更高的显示配置，当视角进入`viewerRequestVolume`中是，瓦片就会显示，就不必须通过`boundingVolume`和`geometricError`来配置了。

```json
{
  "children": [
    {
      "transform": [
        4.843178171884396,
        1.2424271388626869,
        0,
        0,
        -0.7993325488216595,
        3.1159251367235608,
        3.8278032889280675,
        0,
        0.9511533376784163,
        -3.7077466670407433,
        3.2168186118075526,
        0,
        1215001.7612985559,
        -4736269.697480114,
        4081650.708604793,
        1
      ],
      "boundingVolume": {
        "box": [0, 0, 6.701, 3.738, 0, 0, 0, 3.72, 0, 0, 0, 13.402]
      },
      "geometricError": 32,
      "content": {
        "uri": "building.b3dm"
      }
    },
    {
      "transform": [
        0.968635634376879,
        0.24848542777253732,
        0,
        0,
        -0.15986650990768783,
        0.6231850279035362,
        0.7655606573007809,
        0,
        0.19023066741520941,
        -0.7415493329385225,
        0.6433637229384295,
        0,
        1215002.0371330238,
        -4736270.772726648,
        4081651.6414821907,
        1
      ],
      "viewerRequestVolume": {
        "sphere": [0, 0, 0, 15]
      },
      "boundingVolume": {
        "sphere": [0, 0, 0, 1.25]
      },
      "geometricError": 0,
      "content": {
        "uri": "points.pnts"
      }
    }
  ]
}
```

---

<a id="变换（Transforms）" name="变换（Transforms）"></a>

#### 变换（Transforms）

<a id="瓦片变换（Tiletransforms）" name="瓦片变换（Tiletransforms）"></a>

##### 瓦片变换（Tile transforms）

为了支持局部坐标系（例如，可以在城市数据集内部加载自定义坐标系的建筑数据集，并建筑数据集内部加载自定义坐标系的点云数据集），每个数据都有可选的`transform`属性。

`transform` 属性是一个 4x4 仿射变换矩阵（affine transformation matrix），以列优先顺序存储，从数据的本地坐标系转换到父数据的坐标系，或者到数据集根数据的变换。

> _\*仿射变换：保持原来的线共点、点共线的关系不变，保持原来相互平行的线仍然平行，保持原来的中点仍然是中点，保持原来在一条直线上各个线段之间的比例关系不变。但是仿射变换不能保持原来的线段长度不变，也不能保持原来的夹角角度不变。_

`transform`属性适用于

- `tile.content`
  - 每个要素的位置。
  - 每个要素的法线均应通过逆转置的左上 3x3 矩阵进行变换，以在使用 scale 时 transform 考虑正确的矢量变换。（Each feature's normal should be transformed by the top-left 3x3 matrix of the inverse-transpose of transform to account for [correct vector transforms when scale is used](http://www.realtimerendering.com/resources/RTNews/html/rtnews1a.html#art4).）
  - `tile.boundingVolume`，但 `tile.boundingVolume.region` 类型定义除外，该类型以 EPSG：4979 坐标系为准。
- `tile.boundingVolume`，但 `tile.boundingVolume.region` 类型定义除外，该类型以 EPSG：4979 坐标系为准。
- `tile.viewerRequestVolume`，但 `tile.viewerRequestVolume.region` 类型定义除外，该类型以 EPSG：4979 坐标系为准。

`transform`属性不适用于`geometricError`，例如，由`transform`定义的比例缩放(scale)不会缩放几何误差的值，几何误差始终以米为单位定义。

当`transform`没有定义，则默认为单位矩阵：

```
[
  1.0, 0.0, 0.0, 0.0,
  0.0, 1.0, 0.0, 0.0,
  0.0, 0.0, 1.0, 0.0,
  0.0, 0.0, 0.0, 1.0
]
```

从每个数据的局部坐标系到数据集全局坐标系的转换是通过对数据集自上而下的遍历，将子`transform `和父`transform `进行后乘（post-multiplying）运算得到的（例如计算机图形学中的传统场景图或节点层次结构）。

---

<a id="glTF变换（glTFtransforms）" name="glTF变换（glTFtransforms）"></a>

##### glTF 变换（glTF transforms）

[批处理 3D 模型（Batched 3D Model）](/2021/04/23/3d-tiles-batched-3d-model-specification)和[实例 3D 模型（Instanced 3D Model）](/2021/04/23/3d-tiles-instanced-3d-model-specification) 数据嵌入在 glTF 中，glTF 有其自己的节点层次结构，并使用 y 轴朝上的坐标系。所有指定于数据（a tile format）和`tile.transform`属性的转换都会被应用。

---

**glTF 节点层次结构（glTF node hierarchy）**

首先，根据[glTF 规范](https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#transformations)应用 glTF 节点层次结构转换。

---

**y 轴向上到 z 轴向上**

接下来，为了与 3D Tiles 坐标系的 z 轴保持一致，必须在运行时将 glTF 从 y 轴朝上转换为 z 轴朝上。这是通过将模型绕 x 轴旋转 π/ 2 弧度来完成的。等效地，应用以下矩阵变换（此处为行优先顺序）：

```
[
  1.0, 0.0,  0.0, 0.0,
  0.0, 0.0, -1.0, 0.0,
  0.0, 1.0,  0.0, 0.0,
  0.0, 0.0,  0.0, 1.0
]
```

总的来说，变换的顺序为：

1. glTF 节点层次结构（glTF node hierarchy）
2. y 轴向上到 z 轴向上
3. 任何数据类型特定的变换。
   - 批处理 3D 模型要素表可以定义`RTC_CENTER`用于转换模型的顶点。
   - 实例化 3D 模型要素表定义了每个实例的位置，法线和比例。用于创建按实例的 4x4 仿射变换矩阵，来应用于每个实例。
4. 瓦片变换

> 实现说明：使用固定的 z 轴向上的源数据，例如 WGS 84 坐标或 z 轴向上自定义坐标系中的数据源时，常见的工作流程是：
> 包括位置和法线的表面数据（Mesh data）不做修改，仍保持 z 向上。
> 根节点矩阵指定了列优先的从到 z 轴向上到 y 轴向上的变换。y 轴向上的 glTF 坐标系要求使用此类变化。
> 在运行时，glTF 被上面的变换转回。转换抵消了。（At runtime the glTF is transformed back from y-up to z-up with the matrix above. Effectively the transforms cancel out.）
> glTF 根节点示例：
>
> ```
> "nodes": [
>  {
>    "matrix": [1,0,0,0,0,0,-1,0,0,1,0,0,0,0,0,1],
>    "mesh": 0,
>    "name": "rootNode"
>  }
> ]
> ```

---

<a id="实例" name="实例"></a>

##### 实例

为数据集计算变换的例子：

![](https://jackie_tang.gitee.io/pic_cloud/2021-04/3d-tiles/tileTransform.png)

每个 Tile 的变换为：

- `TO`: `[T0]`
- `T1`: `[T0][T1]`
- `T2`: `[T0][T2]`
- `T3`: `[T0][T1][T3]`
- `T4`: `[T0][T1][T4]`

在变换之前， Tile 内容中的位置和法线也可以有 Tile 指定的转换来应用，（之前表示应用仿射变换之前）。例：

- `b3dm`和`i3dm`嵌入 glTF，glTF 定义了自己的节点层次结构和坐标系。`tile.transform`在这些变换之后执行。
- `i3dm`的要素表定义了每个实例的位置，法线和比例。用于每个实例按照 4x4 仿射变换矩阵创建，这些变换在`tile.transform`之前。
- 压缩的属性，如`i3dm`和`pnts`要素表中的`POSITION_QUANTIZED`，`pnts`中的`NORMAL_OCT16P`会在应用任何其他变换之前被解压缩。

因此，以上示例的完整计算转换为：

- `TO`: `[T0]`
- `T1`: `[T0][T1]`
- `T2`: `[T0][T2][pnts-specific transform, including RTC_CENTER (if defined)]`
- `T3`: `[T0][T1][T3][b3dm-specific transform, including RTC_CENTER (if defined), coordinate system transform, and glTF node hierarchy]`
- `T4`: `[T0][T1][T4][i3dm-specific transform, including per-instance transform, coordinate system transform, and glTF node hierarchy]`

---

<a id="瓦片JSON" name="瓦片JSON"></a>

#### 瓦片 JSON

瓦片 JSON 对象由以下属性组成。

![](https://jackie_tang.gitee.io/pic_cloud/2021-04/3d-tiles/tile.png)

以下示例展示了一个非叶子瓦片。

```json
{
  "boundingVolume": {
    "region": [
      -1.2419052957251926,
      0.7395016240301894,
      -1.2415404171917719,
      0.7396563300150859,
      0,
      20.4
    ]
  },
  "geometricError": 43.88464075650763,
  "refine" : "ADD",
  "content": {
    "boundingVolume": {
      "region": [
        -1.2418882438584018,
        0.7395016240301894,
        -1.2415422846940714,
        0.7396461198389616,
        0,
        19.4
      ]
    },
    "uri": "2/0/0.b3dm"
  },
  "children": [...]
}
```

`boundingVolume`定义瓦片的封闭体，并且被用来确定哪些瓦片在运行时进行渲染。上面的示例使用一个`region`边界体，也可以使用<a href="#边界盒/边界体（Boundingvolumes）" class="self">其他边界体</a>，例如`box`或`sphere`。

`geometricError`属性是一个非负数，用于定义误差（以米为单位），用来决定渲染此瓦片但不渲染其子瓦片。在运行时，几何误差用于计算屏幕空间误差（SSE），即以像素为单位的误差。SSE 确定某个瓦片是否对于当前视图足够详细，或者是否应考虑渲染其子视图。详见<a href="#几何误差（Geometric error）" class="self">几何误差</a>。

可选`viewerRequestVolume`属性（上面未显示）使用与`boundingVolume`配置参数，在执行瓦片内容的请求前，观察者位于`viewerRequestVolume`内，并且`viewerRequestVolume`优先于`geometricError`。详见<a href="#观察请求盒/体（Viewerrequestvolume）" class="self">观察请求盒/体</a>。

`refine` 属性是一个字符串，用`"REPLACE"`或`"ADD"`。数据集（tileset）的根图块需要设置；对于其他瓦片，它是可选的。数据集可以使用`添加`和`替换`的任意组合。`refine` 省略该属性时，从父瓦片继承的。详见<a href="#细化/优化（Refinement）" class="self">细化/优化</a>。

`content` 属性是一个对象，其中包含有关瓦片渲染内容的元数据。 `content.uri` 是一个 uri，指向瓦片的二进制内容（<a href="#瓦片格式规范" class="self">规范的文件类型</a>），或另一个数据集 JSON 以创建数据集(tileset)的数据集(tileset)（<a href="#外部数据集（Externaltilesets）" class="self">外部数据集</a>）。

`content.uri`中的文件扩展名不是必须的。瓦片内容格式由文件头中的`magic`字段指定，或者为 JSON，将其指定为外部数据集。

`content.boundingVolume`属性定义一个可选的<a href="#边界盒/边界体（Boundingvolumes）" class="self">边界体</a>，类似于顶级的`boundingVolume`属性。但是与顶级`boundingVolume`属性不同，`content.boundingVolume`是一个包裹瓦片内容的紧密封闭的包围体。`boundingVolume`提供空间连续性，`content.boundingVolume`实现严格地视图视锥剔除（view frustum culling），排除可能不在视域范围内的内容。如果未定义，则瓦片的边界体仍用于剔除（请参见<a href="#网格（Grids）" class="self">网格</a>）。

下面的截图显示了 Canary Wharf 的根图块的边界体积。 `boundingVolume` 以红色显示，将整个区域的数据集包围起来；`content.boundingVolume` 以蓝色显示，仅将根图块中的四个要素（模型）封闭起来。

![](https://jackie_tang.gitee.io/pic_cloud/2021-04/3d-tiles/contentsBox.png)

可选的 `transform` 属性（上面列出）定义 4×4 的仿射变换矩阵，该矩阵变换瓦片的 `content`，`boundingVolume` 和 `viewerRequestVolume`。

`children`属性是定义一组子瓦片的对象数组。每个子瓦片的内容都被其父瓦片的`boundingVolume `完全包围，通常 `geometricError` 小于其父级的 `geometricError`。对于叶瓦片，此数组的长度为零，children 可以不定义。请参阅下面的<a href="#TilesetJSON" class="self">Tileset JSON</a>部分。

完整的 json 定义

```json
{
  "$schema": "http://json-schema.org/draft-04/schema",
  "id": "tile.schema.json",
  "title": "Tile",
  "type": "object",
  "description": "A tile in a 3D Tiles tileset.",
  "properties": {
    "boundingVolume": {
      "description": "The bounding volume that encloses the tile.",
      "$ref": "boundingVolume.schema.json"
    },
    "viewerRequestVolume": {
      "description": "Optional bounding volume that defines the volume the viewer must be inside of before the tile's content will be requested and before the tile will be refined based on geometricError.",
      "$ref": "boundingVolume.schema.json"
    },
    "geometricError": {
      "type": "number",
      "description": "The error, in meters, introduced if this tile is rendered and its children are not. At runtime, the geometric error is used to compute screen space error (SSE), i.e., the error measured in pixels.",
      "minimum": 0
    },
    "refine": {
      "type": "string",
      "description": "Specifies if additive or replacement refinement is used when traversing the tileset for rendering.  This property is required for the root tile of a tileset; it is optional for all other tiles.  The default is to inherit from the parent tile.",
      "enum": ["ADD", "REPLACE"]
    },
    "transform": {
      "type": "array",
      "description": "A floating-point 4x4 affine transformation matrix, stored in column-major order, that transforms the tile's content--i.e., its features as well as content.boundingVolume, boundingVolume, and viewerRequestVolume--from the tile's local coordinate system to the parent tile's coordinate system, or, in the case of a root tile, from the tile's local coordinate system to the tileset's coordinate system.  transform does not apply to geometricError, nor does it apply any volume property when the volume is a region, defined in EPSG:4979 coordinates.",
      "items": {
        "type": "number"
      },
      "minItems": 16,
      "maxItems": 16,
      "default": [
        1.0,
        0.0,
        0.0,
        0.0,
        0.0,
        1.0,
        0.0,
        0.0,
        0.0,
        0.0,
        1.0,
        0.0,
        0.0,
        0.0,
        0.0,
        1.0
      ]
    },
    "content": {
      "description": "Metadata about the tile's content and a link to the content. When this is omitted the tile is just used for culling. This is required for leaf tiles.",
      "$ref": "tile.content.schema.json"
    },
    "children": {
      "type": "array",
      "description": "An array of objects that define child tiles. Each child tile content is fully enclosed by its parent tile's bounding volume and, generally, has a geometricError less than its parent tile's geometricError. For leaf tiles, the length of this array is zero, and children may not be defined.",
      "items": {
        "$ref": "tile.schema.json"
      },
      "uniqueItems": true
    },
    "extensions": {
      "$ref": "extension.schema.json"
    },
    "extras": {
      "$ref": "extras.schema.json"
    }
  },
  "required": ["boundingVolume", "geometricError"],
  "additionalProperties": false
}
```

---

<a id="TilesetJSON" name="TilesetJSON"></a>

### Tileset JSON

3D Tiles 使用一个主 tileset JSON 文件作为定义数据集（Tileset）的入口。入口和外部 tileset JSON 文件都不需要遵循任何命名规则。

这是一个 tileset JSON 的数据集

```json
{
  "asset" : {
    "version": "1.0",
    "tilesetVersion": "e575c6f1-a45b-420a-b172-6449fa6e0a59",
  },
  "properties": {
    "Height": {
      "minimum": 1,
      "maximum": 241.6
    }
  },
  "geometricError": 494.50961650991815,
  "root": {
    "boundingVolume": {
      "region": [
        -0.0005682966577418737,
        0.8987233516605286,
        0.00011646582098558159,
        0.8990603398325034,
        0,
        241.6
      ]
    },
    "geometricError": 268.37878244706053,
    "refine": "ADD",
    "content": {
      "uri": "0/0/0.b3dm",
      "boundingVolume": {
        "region": [
          -0.0004001690908972599,
          0.8988700116775743,
          0.00010096729722787196,
          0.8989625664878067,
          0,
          241.6
        ]
      }
    },
    "children": [..]
  }
}
```

Tilset JSON 有四个顶级属性：`asset`，`properties`，`geometricError`，和`root`。

`asset` 是一个包含有关整个数据集的元数据对象。`asset.version` 属性是一个定义 3D Tiles 版本的字符串，指定 tilset 的 JSON 模式和基本的 tile 格式。 `tilesetVersion` 属性是一个可选字符串，用于定义特定应用程序的 tileset 版本，例如，表示 tilset 是否被更新。

`properties` 是一个对象，包含数据集中每个要素属性。这个 tileet JSON 代码段适用于 3D 建筑物，因此每个瓦片均具有建筑物模型，并且每个建筑物模型均具有 Height 属性（详见[批处理表(Batch Table)](/2021/04/23/3d-tiles-batch-table-specification)）。`properties`中的名称与每个要素的属性名称匹配，其定义 minimum 和 maximum 的数字值，这些值对于创建样式色带非常有用。

`geometricError` 是一个非负数，用于定义误差（以米为单位），该值确定是否渲染图块。在运行时，几何误差用于计算屏幕空间误差（SSE），即以像素为单位的误差。如果 SSE 不超过所需的最小值，则不会渲染数据集，并且不会对其瓦片进行渲染。详见<a href="#几何误差（Geometric error）" class="self">几何误差（Geometric error）</a>。

`root` 是一个使用上一节中描述的瓦片 JSON 定义根图块的对象。`root.geometricError`与 tilset 顶级的`geometricError`不同。`geometricError`在运行时根据 SSE 决定根瓦片是否渲染;`root.geometricError`在运行时根据 SSE 决定根瓦片的子集是否渲染。

---

<a id="外部数据集（Externaltilesets）" name="外部数据集（Externaltilesets）"></a>

#### 外部数据集（External tilesets）

创建树的子节点，数据的`content.uri`可以指向一个外部数据集（另一个 数据集 JSON 文件的 uri）。例如，可以将每个城市存储在一个数据集中，然后组成一个全球数据集。

![](https://jackie_tang.gitee.io/pic_cloud/2021-04/3d-tiles/tilesets.png)

当瓦片指向外部数据集时，瓦片：

- 不能有子级；`tile.children` 必须为 `undefined` 或空数组。
- 不能有循环，例如，通过指向包含该图块的同一图块文件或指向另一个图块集文件，然后再指向包含该图块的初始文件，来创建循环。
- 会同时通过瓦片的 `transform` 和根瓦片的`transform`进行变换。例如，在下面的数据集引用外部数据集，`T3` 计算变换为 `[T0][T1][T2][T3]`。

![](https://jackie_tang.gitee.io/pic_cloud/2021-04/3d-tiles/tileTransformExternalTileset.png)

---

<a id="边界体空间连续性（Boundingvolumespatialcoherence）" name="边界体空间连续性（Boundingvolumespatialcoherence）"></a>

#### 边界体空间连续性（Bounding volume spatial coherence）

如上所述，树具有空间连贯性。每个瓦片都有一个完全包围其内容的边界体，子瓦片的内容完全位于父级的边界体之内。但这并不意味着子级的边界体完全在其父级的边界体之内。例如：

![地形数据的边界球](https://jackie_tang.gitee.io/pic_cloud/2021-04/3d-tiles/parentBoundingSphere.jpg)

![4个子瓦片的边界球。子级的内容完全在父级的边界球之内，但是子项的边界球并不在父级的边界球内，因为它们不紧密适配。](https://jackie_tang.gitee.io/pic_cloud/2021-04/3d-tiles/childBoundingSphere.jpg)

---

<a id="空间数据结构（Spatialdatastructures）" name="空间数据结构（Spatialdatastructures）"></a>

#### 空间数据结构（Spatial data structures）

3D Tiles 结合了详细层次结构（HLOD）的概念，以实现空间数据的最佳呈现。数据集由树结构组成，由`root`定义，并递归其`children`瓦片组成，并可以按不同类型的空间数据结构进行组织。

运行时引擎是通用的，可以渲染 tilset 定义的任何树。任意组合的瓦片格式和优化（refinement）方法组合都可以使用，从而可以灵活地支持异构数据集。详见<a href="#细化/优化（Refinement）" class="self">细化/优化（Refinement）</a>。

数据集可以使用类似于栅格和矢量切片方案的 2D 空间切片方案（例如 Web 地图切片服务（WMTS）或 XYZ 方案），该二维空间切片方案以多级别（LOD）（或缩放级别）提供预定义的切片。但是，由于数据集的内容通常是不一致的，或者可能不容易仅在二维上组织，因此其他空间数据结构可能更理想。

下面包括对 3D Tiles 如何表示各种空间数据结构的简要说明。

---

<a id="四叉树（Quadtrees）" name="四叉树（Quadtrees）"></a>

##### 四叉树（Quadtrees）

当每个瓦片具有四个统一细分的子级（例如，使用中心纬度和经度）时，将创建一个四叉树，类似于典型的 2D 地理空间切片方案。空的子图块可以省略。

![传统四叉树细分](https://jackie_tang.gitee.io/pic_cloud/2021-04/3d-tiles/quadtree.png)

3D Tiles 可以使用四叉树变体，例如非均匀细分和非紧密的边界体（例如，与边界不同，对稀疏数据集来说，父级的 25％是浪费的）。

![四叉树，子级有更紧密的边界](https://jackie_tang.gitee.io/pic_cloud/2021-04/3d-tiles/quadtree-tight.png)

3D Tiles 还支持其他四叉树变形，例如[松散四叉树](http://www.tulrich.com/geekstuff/partitioning.html)，其中子瓦片相互重叠，但仍保持空间连贯性，即，父瓦片完全包围了其所有子级。这种方法对于避免在瓦片之间分割要素（例如 3D 模型）很有用。

![不均匀且重叠的四叉树。](https://jackie_tang.gitee.io/pic_cloud/2021-04/3d-tiles/quadtree-overlap.png)

---

<a id="K-d树（K-dtrees，K维树）" name="K-d树（K-dtrees，K维树）"></a>

##### K-d 树（K-d trees，K 维树）

当瓦片具有两个由平行于 x，y 或 z 轴（或纬度，经度，高度）的分割面分隔的子代时，会创建 kd 树。随着树级别的递增，拆分轴通常是循环旋转的（可以参考平衡 K-d 树理解），可以选择中位数，表面积启发法（surface area heuristics）或其他方法来选择拆分平面。

![k-d树示例，非均匀切分](https://jackie_tang.gitee.io/pic_cloud/2021-04/3d-tiles/kdtree.png)

注意，k-d 树不像典型的 2D 地理空间切片方案那样具有统一的均匀细分，因此可以为稀疏和非均匀分布的数据集创建更加平衡的树。

3D Tiles 支持 k-d 树变体，例如[多路 kd 树](http://www.crs4.it/vic/cgi-bin/bib-page.cgi?id=%27Goswami:2013:EMF%27)，其中树的每个叶子上有多个拆分轴。这样就有`n`个子级，而不是每个瓦片有两个。

---

<a id="八叉树（Octrees）" name="八叉树（Octrees）"></a>

##### 八叉树（Octrees）

八叉树通过扩展四叉树使用三个正交拆分平面将图块细分为八个子级。像四叉树一样，3D Tiles 允许对八叉树变体，例如不均匀的细分，非紧密的边界体和重叠的子代。

![传统八叉树细分](https://jackie_tang.gitee.io/pic_cloud/2021-04/3d-tiles/octree.png)

![使用添加模式优化（additive refinement）](https://jackie_tang.gitee.io/pic_cloud/2021-04/3d-tiles/pointcloud-octree.jpg)

---

<a id="网格（Grids）" name="网格（Grids）"></a>

##### 网格（Grids）

3D Tiles 通过支持任意数量的子瓦片来实现均匀，不均匀和重叠的网格。例如，这是剑桥的不均匀重叠网格的俯视图：

![](https://jackie_tang.gitee.io/pic_cloud/2021-04/3d-tiles/grid.png)

3D Tiles 利用了空瓦片：那些具有边界体但没有内容的瓦片。由于瓦片的`content`不必须要被定义的属性，因此可以使用空的非叶子节点的瓦片来分层剔除，以加速非均匀网格。本质上，这会创建一个四叉树或八叉树，而没有层次的详细信息（HLOD）。

---

<a id="扩展和附加功能" name="扩展和附加功能"></a>

### 扩展和附加功能

（Specifying extensions and application specific extras）
3D Tiles 定义了扩展，以允许新功能扩展基本规范，包括附加应用程序特定元数据。

---

<a id="扩展" name="扩展"></a>

#### 扩展

扩展允许使用新功能扩展基本规范。可以将可选的 `extensions` 字典属性添加到任何 3D Tiles JSON 对象，该对象包含扩展名和扩展特定的对象。

```json
{
  "transform": [
    4.843178171884396,
    1.2424271388626869,
    0,
    0,
    -0.7993325488216595,
    3.1159251367235608,
    3.8278032889280675,
    0,
    0.9511533376784163,
    -3.7077466670407433,
    3.2168186118075526,
    0,
    1215001.7612985559,
    -4736269.697480114,
    4081650.708604793,
    1
  ],
  "boundingVolume": {
    "box": [0, 0, 6.701, 3.738, 0, 0, 0, 3.72, 0, 0, 0, 13.402]
  },
  "geometricError": 32,
  "content": {
    "uri": "building.b3dm"
  },
  "extensions": {
    "VENDOR_collision_volume": {
      "box": [0, 0, 6.8, 3.8, 0, 0, 0, 3.8, 0, 0, 0, 13.5]
    }
  }
}
```

数据集或子级的外部数据集中使用的所有扩展，都必须在入口 tileset JSON 的顶级`extensionsUsed`数组属性中列出，例如：

```json
{
  "extensionsUsed": ["VENDOR_collision_volume"]
}
```

所有扩展中，需要加载和渲染数据集或子级的外部数据集时，也必须在入口 tileset JSON 的顶级`extensionsRequired`数组属性中列出，`extensionsRequired`数组是`extensionsUsed`数组的子级。`extensionsRequired`中列出的值在`extensionsUsed`中也必须存在。

---

<a id="附加功能" name="附加功能"></a>

#### 附加功能

`extras`属性允许将特定于应用程序的元数据添加到任何 3D Tiles JSON 对象。以下示例显示了一个具有附加应用程序特定名称属性的 tile 对象。

```json
{
  "transform": [
    4.843178171884396,
    1.2424271388626869,
    0,
    0,
    -0.7993325488216595,
    3.1159251367235608,
    3.8278032889280675,
    0,
    0.9511533376784163,
    -3.7077466670407433,
    3.2168186118075526,
    0,
    1215001.7612985559,
    -4736269.697480114,
    4081650.708604793,
    1
  ],
  "boundingVolume": {
    "box": [0, 0, 6.701, 3.738, 0, 0, 0, 3.72, 0, 0, 0, 13.402]
  },
  "geometricError": 32,
  "content": {
    "uri": "building.b3dm"
  },
  "extras": {
    "name": "Empire State Building"
  }
}
```

---

<a id="瓦片格式规范" name="瓦片格式规范"></a>

## 瓦片格式规范

每个瓦片的`content.uri`属性可以是 uri 二进制 blob，其中包含用于渲染瓦片的 3D 内容的信息。内容是下表中列出的一种格式的实例。

|                                               格式                                                |                                用途                                 |
| :-----------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------: |
|  [批处理 3D 模型 (Batched 3D Model (b3dm))](/2021/04/23/3d-tiles-batched-3d-model-specification)  | 异构 3D 模型。例如带纹理的地形和表面，3D 建筑外部和内部，大型模型。 |
| [实例 3D 模型 (Instanced 3D Model (i3dm))](/2021/04/23/3d-tiles-instanced-3d-model-specification) |                 3D 模型实例。例如树木，风车，螺栓。                 |
|            [点云 (Point Cloud (pnts))](/2021/04/23/3d-tiles-point-cloud-specification)            |                             大量的点。                              |
|            [复合对象 (Composite (cmpt))](/2021/04/23/3d-tiles-composite-specification)            |                  将不同格式的图块合并为一个图块。                   |

tilset 可以包含 tile 格式的任意组合。3D Tiles 还支持不同格式在一个 Composite 瓦片中的组合。

---

<a id="声明式样式规范" name="声明式样式规范"></a>

## 声明式样式规范

3D Tiles 包含使用 JSON 定义的简洁声明式样式以及用一部分 JavaScript 增强的样式编写表达式。

样式定义要素如何显示，例如 `show` 和 `color`（RGB 和透明度），在要素属性上使用表达式。

下面的示例将高度超过 90 的要素涂为红色，将其他涂为白色。

```json
{
  "color": "(${Height} > 90) ? color('red') : color('white')"
}
```

更多内容，详见[3D Tiles 样式](/2021/04/23/3d-tiles-styling-specification)规范。

---

<a id="属性参考" name="属性参考"></a>

## 属性参考

- <a href="#reference-tileset" class="self">`Tileset`</a>

  - <a href="#reference-asset" class="self">`Asset`</a>
  - <a href="#reference-bounding-volume" class="self">`Bounding Volume`</a>
  - <a href="#reference-extension" class="self">`Extension`</a>
  - <a href="#reference-extras" class="self">`Extras`</a>
  - <a href="#reference-properties" class="self">`Properties`</a>
  - <a href="#reference-tile" class="self">`Tile`</a>
    - <a href="#reference-tile-content" class="self">`Content`</a>

---

<a id="reference-tileset" name="reference-tileset"></a>

### Tileset

一个 3D Tiles 数据集。

#### 属性

|                        | 类型             | 描述                                                                                        | 是否必须               |
| ---------------------- | ---------------- | ------------------------------------------------------------------------------------------- | ---------------------- |
| **asset**              | `object`         | 整个数据集的元数据 tileset.                                                                 | :white_check_mark: Yes |
| **properties**         | `any`            | 功能属性的元数据字典对象                                                                    | No                     |
| **geometricError**     | `number`         | 决定是否渲染此瓦片的误差值，以米为单位。在运行时，用于计算屏幕空间误差（SSE），以像素为单位 | :white_check_mark: Yes |
| **root**               | `object`         | 3D Tiles 数据集中的一个瓦片                                                                 | :white_check_mark: Yes |
| **extensionsUsed**     | `string` `[1-*]` | 在此数据集中某处使用的 3D Tiles 扩展名                                                      | No                     |
| **extensionsRequired** | `string` `[1-*]` | 需要加载的数据集的 3D Tiles 扩展名                                                          | No                     |
| **extensions**         | `object`         | 具有扩展名的特定对象的字典对象                                                              | No                     |
| **extras**             | `any`            | 附加于应用程序的数据                                                                        | No                     |

不允许使用其他属性。

---

<a id="reference-asset" name="reference-asset"></a>

### Asset

整个数据集的元数据

#### 属性

|                    | 类型     | 描述                                                                    | 是否必须               |
| ------------------ | -------- | ----------------------------------------------------------------------- | ---------------------- |
| **version**        | `string` | 3D Tiles 版本。该版本定义了数据集 JSON 的 JSON 模式和瓦片格式的基本集合 | :white_check_mark: Yes |
| **tilesetVersion** | `string` | 此瓦片的特定于应用程序的版本，例如，用于更新现有瓦片的标识              | No                     |
| **extensions**     | `object` | 具有扩展的特定对象的字典对象                                            | No                     |
| **extras**         | `any`    | 应用程序的附加数据                                                      | No                     |

不允许使用其他属性。

---

<a id="reference-bounding-volume" name="reference-bounding-volume"></a>

### Bounding Volume

包围瓦片或其内容的包围盒。有且需要一个`box`，`region`或`sphere`属性。

#### 属性

|                | 类型            | 描述                                                                                                                                                                                                                                                                                                                                                               | 是否必须 |
| -------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| **box**        | `number` `[12]` | 由 12 个数字组成的数组，在右手 3 轴（x，y，z）笛卡尔坐标系中定义的一个有向包围盒，其中 z 轴是。前三个元素定义框中心的 x，y 和 z 值。接下来的三个元素（索引为 3、4 和 5）定义了 x 轴方向和一半长度（half-length）。接下来的三个元素（索引 6、7 和 8）定义 y 轴方向和一半长度（half-length）。最后三个元素（索引 9、10 和 11）定义 z 轴方向和一半长度（half-length） | No       |
| **region**     | `number` `[6]`  | 由 6 个数字组成的数组，定义了由纬度，经度和高度坐标的地理边界区，使用`[west, south, east, north, minimum height, maximum height]`的顺序。纬度和经度是在 [EPSG 4979](http://spatialreference.org/ref/epsg/4979/) 中定义的 WGS 84 基准，以弧度表示。高度在 [WGS 84 椭球](http://earth-info.nga.mil/GandG/publications/tr8350.2/wgs84fin.pdf)上方（或下方）以米为单位 | No       |
| **sphere**     | `number` `[4]`  | 由 4 个数字组成的数组定义的边界球。前三个元素在右手 3 轴（x，y，z）笛卡尔坐标系中定义球体中心的 x，y 和 z 值，其中 z 轴朝上。最后一个元素（索引为 3）以米为单位定义半径                                                                                                                                                                                            | No       |
| **extensions** | `object`        | 具有扩展的特定对象的字典对象                                                                                                                                                                                                                                                                                                                                       | No       |
| **extras**     | `any`           | 应用程序的附加数据                                                                                                                                                                                                                                                                                                                                                 | No       |

不允许使用其他属性。

---

<a id="reference-extension" name="reference-extension"></a>

### Extension

具有扩展的特定对象的字典对象。

允许其他属性。

属性类型：`object`

---

<a id="reference-extras" name="reference-extras"></a>

### Extras

应用程序的附加数据。

JSON 样式：

```json
{
  "$schema": "http://json-schema.org/draft-04/schema",
  "title": "Extras",
  "description": "Application-specific data."
}
```

---

<a id="reference-properties" name="reference-properties"></a>

### Properties

功能属性的元数据字典对象。

#### 属性

|                | 类型     | 描述                           | 是否必须               |
| -------------- | -------- | ------------------------------ | ---------------------- |
| **maximum**    | `number` | 数据集中所有要素此属性的最大值 | :white_check_mark: Yes |
| **minimum**    | `number` | 数据集中所有要素此属性的最小值 | :white_check_mark: Yes |
| **extensions** | `object` | 具有扩展的特定对象的字典对象   | No                     |
| **extras**     | `any`    | 应用程序的附加数据             | No                     |

不允许使用其他属性。

---

<a id="reference-tile" name="reference-tile"></a>

### Tile

3D Tiles 数据集中的一个瓦片。

#### 属性（<a href="#Tiles" class="self">上面有一章专门讲这些属性，就不翻译了</a>）

|                         | 类型            | 描述                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 是否必须                                         |
| ----------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| **boundingVolume**      | `object`        | A bounding volume that encloses a tile or its content. Exactly one `box`, `region`, or `sphere` property is required.                                                                                                                                                                                                                                                                                                                                                                                                                                            | :white_check_mark: Yes                           |
| **viewerRequestVolume** | `object`        | A bounding volume that encloses a tile or its content. Exactly one `box`, `region`, or `sphere` property is required.                                                                                                                                                                                                                                                                                                                                                                                                                                            | No                                               |
| **geometricError**      | `number`        | The error, in meters, introduced if this tile is rendered and its children are not. At runtime, the geometric error is used to compute screen space error (SSE), i.e., the error measured in pixels.                                                                                                                                                                                                                                                                                                                                                             | :white_check_mark: Yes                           |
| **refine**              | `string`        | Specifies if additive or replacement refinement is used when traversing the tileset for rendering. This property is required for the root tile of a tileset; it is optional for all other tiles. The default is to inherit from the parent tile.                                                                                                                                                                                                                                                                                                                 | No                                               |
| **transform**           | `number` `[16]` | A floating-point 4x4 affine transformation matrix, stored in column-major order, that transforms the tile's content--i.e., its features as well as content.boundingVolume, boundingVolume, and viewerRequestVolume--from the tile's local coordinate system to the parent tile's coordinate system, or, in the case of a root tile, from the tile's local coordinate system to the tileset's coordinate system. transform does not apply to geometricError, nor does it apply any volume property when the volume is a region, defined in EPSG:4979 coordinates. | No, default: `[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]` |
| **content**             | `object`        | Metadata about the tile's content and a link to the content.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | No                                               |
| **children**            | `array[]`       | An array of objects that define child tiles. Each child tile content is fully enclosed by its parent tile's bounding volume and, generally, has a geometricError less than its parent tile's geometricError. For leaf tiles, the length of this array is zero, and children may not be defined.                                                                                                                                                                                                                                                                  | No                                               |
| **extensions**          | `object`        | Dictionary object with extension-specific objects.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | No                                               |
| **extras**              | `any`           | Application-specific data.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | No                                               |

---

<a id="reference-tile-content" name="reference-tile-content"></a>

### Tile Content

有关瓦片内容和该内容链接的元数据。

#### 属性

|                    | 类型     | 描述                                                                       | 是否必须               |
| ------------------ | -------- | -------------------------------------------------------------------------- | ---------------------- |
| **boundingVolume** | `object` | 包围瓦片或其内容的包围盒。有且需要一个`box`，`region`或`sphere`属性        | No                     |
| **uri**            | `string` | 指向图块内容的 uri。如果 uri 是相对的，则它是相对于引用的 tilset JSON 文件 | :white_check_mark: Yes |
| **extensions**     | `object` | 具有扩展的特定对象的字典对象                                               | No                     |
| **extras**         | `any`    | 应用程序的附加数据                                                         | No                     |

不允许使用其他属性。

---

_版权声明：_
_除非注明，本博文章均为原创，转载请以链接形式标明本文地址。_

---
