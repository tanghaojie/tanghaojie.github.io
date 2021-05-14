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

`点云`瓦片格式支持大规模的点云三维可视化的高效数据流。每个点都由位置和可选的外观属性定义（例如颜色和法线）以及可选的定义特定于应用程序的元数据属性。

使用 3D Tiles 术语，每个点都是一个要是。

点云数据是小端字节序的二进制 Blob。

---

<a id="文件结构" name="文件结构"></a>

## 文件结构

数据由文件头部分和紧随其后的二进制主体组成。下图显示了实例化 3D 模型的布局（破折号表示可选字段）：

![](https://jackie_tang.gitee.io/pic_cloud/2021-04/3d-tiles/point-cloud-layout.png)

---

<a id="结构填充" name="结构填充"></a>

### 结构填充

数据 `byteLength` 必须以 8 个字节进行边界对齐。包含的[要素表(Feature Table)](/2021/04/23/3d-tiles-feature-table-specification#结构填充)和[批处理表(Batch Table)](/2021/04/23/3d-tiles-batch-table-specification#结构填充)必须符合其各自的填充要求。

---

<a id="文件头" name="文件头"></a>

## 文件头

28 字节的文件头包含以下字段：

| 字段名                         | 数据类型           | 描述                                                                                     |
| ------------------------------ | ------------------ | ---------------------------------------------------------------------------------------- |
| `magic`                        | 4-byte ANSI string | `"pnts"`                                                                                 |
| `version`                      | `uint32`           | 版本。现在是`1`                                                                          |
| `byteLength`                   | `uint32`           | 整个数据的长度（包括文件头）（以字节为单位）                                             |
| `featureTableJSONByteLength`   | `uint32`           | 要素表 JSON 部分的长度（以字节为单位）                                                   |
| `featureTableBinaryByteLength` | `uint32`           | 要素表二进制部分的长度（以字节为单位）                                                   |
| `batchTableJSONByteLength`     | `uint32`           | 批处理表 JSON 部分的长度（以字节为单位），零表示没有批处理表                             |
| `batchTableBinaryByteLength`   | `uint32`           | 批处理表二进制部分的长度（以字节为单位），如果`batchTableJSONByteLength`为零，则也将为零 |

主体部分紧着文件头，并且由`Feature Table`，`Batch Table`组成。

---

<a id="要素表" name="要素表"></a>

## 要素表

包含每块和每点的值，这些值定义在何处以及如何渲染点。详见[要素表(Feature Table)](/2021/04/23/3d-tiles-feature-table-specification)。

`pnts` 要素表模式的<a href="#属性参考" class="self">属性参考</a>。完整的 JSON 模式可以在 [pnts.featureTable.schema.json](https://github.com/CesiumGS/3d-tiles/blob/master/specification/schema/pnts.featureTable.schema.json) 中找到。

---

<a id="语法定义" name="语法定义"></a>

### 语法定义

---

<a id="点语法" name="点语法"></a>

#### 点语法

这些语法映射定义每个点的一组要素值数组。对于所有语法定义，这些数组的长度必须相同，并且等于点数。每个点语法的值必须是对要素表二进制主体的引用；它们不能嵌入要素表的 JSON 头中。

如果一个语法依赖于另一个语法，则必须定义该语法。如果同时为点定义 `POSITION` 和 `POSITION_QUANTIZED` ，`POSITION` 将使用更高精度的值。如果同时为点定义 `NORMAL` 和 `NORMAL_OCT16P` ，`NORMAL` 将使用更高精度的值。

| 语法                 | 数据类型                              | 描述                                                                                 | 是否必须                                                    |
| -------------------- | ------------------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| `POSITION`           | `float32[3]`                          | 由三部分组成的数组，包含点的笛卡尔坐标系`x`，`y`和`z`的位置                          | :white_check_mark: Yes, 是，除非定义了 `POSITION_QUANTIZED` |
| `POSITION_QUANTIZED` | `uint16[3]`                           | 由三部分组成的数组，包含点的量化笛卡尔坐标系`x`，`y`和`z`的位置                      | :white_check_mark: Yes, 是，除非定义了 `POSITION`           |
| `RGBA`               | `uint8[4]`                            | 由四部分组成的数组，包含点的`RGBA`颜色值                                             | :red_circle: No.                                            |
| `RGB`                | `uint8[3]`                            | 由三部分组成的数组，包含点的`RGB`颜色值                                              | :red_circle: No.                                            |
| `RGB565`             | `uint16`                              | 一种有损压缩的颜色格式，将`RGB`颜色打包为 16 位，其中红色 5 位，绿色 6 位和蓝色 5 位 | :red_circle: No.                                            |
| `NORMAL`             | `float32[3]`                          | 定义点法线的单位向量                                                                 | :red_circle: No.                                            |
| `NORMAL_OCT16P`      | `uint8[2]`                            | 具有 16 位精度的八进制编码单位向量，用于定义点的法线                                 | :red_circle: No.                                            |
| `BATCH_ID`           | `uint8`, `uint16` (默认), or `uint32` | `batchId`用于从`Batch Table`检索点的元数据                                           | :red_circle: No.                                            |

---

<a id="全局语法" name="全局语法"></a>

#### 全局语法

这些语法定义了所有点的全局属性。

| 语法                      | 数据类型     | 描述                                               | 是否必须                                                 |
| ------------------------- | ------------ | -------------------------------------------------- | -------------------------------------------------------- |
| `POINTS_LENGTH`           | `uint32`     | 渲染的点数。点定义的每个数组值的长度应等于此长度   | :white_check_mark: Yes.                                  |
| `RTC_CENTER`              | `float32[3]` | 由三部分组成的数组，包含当点相对于中心定义时的位置 | :red_circle: No.                                         |
| `QUANTIZED_VOLUME_OFFSET` | `float32[3]` | 由三部分组成的数组，定义量化体积的偏移量           | :red_circle: No, unless `POSITION_QUANTIZED` is defined. |
| `QUANTIZED_VOLUME_SCALE`  | `float32[3]` | 由三部分组成的数组，定义量化体积的比例。           | :red_circle: No, unless `POSITION_QUANTIZED` is defined. |
| `CONSTANT_RGBA`           | `uint8[4]`   | 由四部分组成的数组，定义所有点的`RGBA`颜色值       | :red_circle: No.                                         |
| `BATCH_LENGTH`            | `uint32`     | 唯一的`BATCH_ID`值的数量                           | :red_circle: No, unless `BATCH_ID` is defined.           |

使用这些语法的示例可以在下面的<a href="#实现示例" class="self">实现示例</a>中找到。

---

<a id="点位置" name="点位置"></a>

### 点位置

`POSITION` 在应用任何图块转换之前定义点的位置。

---

<a id="坐标系" name="坐标系"></a>

#### 坐标系

3D Tiles 局部坐标系统使用右手 3 轴（x，y，z）直角坐标系；_x_ 和 _y_ 的叉积得出 _z_ 。3D Tiles 定义 z 轴向上。

---

<a id="RTC_CENTER" name="RTC_CENTER"></a>

#### RTC_CENTER

可以相对于中心位置定义以进行高精度渲染，参见 [Precisions，Precisions](http://help.agi.com/AGIComponents/html/BlogPrecisionsPrecisions.htm)。如果定义，则 `RTC_CENTER` 指定中心位置，并将所有点位置都视为相对于该值的位置。

---

<a id="量化位置" name="量化位置"></a>

#### 量化位置

如果 `POSITION` 未定义，则位置可以存储在`POSITION_QUANTIZED`中，该位置定义了相对于量化体积的点位置。如果 `POSITION` 和 `POSITION_QUANTIZED` 都未定义，则不需要渲染数据。

量化体积由`offset`和`scale`定义量化位置到本地空间位置的映射。下图显示了基于 `offset` 和 `scale`的量化体积：

![](https://jackie_tang.gitee.io/pic_cloud/2021-04/3d-tiles/quantized-volume.png)

`offset`保存在全局语义`QUANTIZED_VOLUME_OFFSET`中，`scale`保存在全局语义`QUANTIZED_VOLUME_SCALE`中。如果这些全局语义未定义，`POSITION_QUANTIZED` 无法使用。

可以使用以下公式将量化位置映射到本地空间位置：

`POSITION = POSITION_QUANTIZED * QUANTIZED_VOLUME_SCALE / 65535.0 + QUANTIZED_VOLUME_OFFSET`

---

<a id="点颜色" name="点颜色"></a>

### 点颜色

如果定义多种颜色，则优先顺序是 `RGBA`，`RGB`，`RGB565`，`CONSTANT_RGBA`。例如，如果图块的要素表同时包含 `RGBA` 和 `CONSTANT_RGBA` 属性，则运行时使用`RGBA` 对每个点颜色进行渲染 。

如果没有颜色定义，则运行时可以使用特定于应用程序的默认颜色来自由设置点颜色。

任何情况下，运行时都可以使用 [3D Tiles 样式](/2021/04/23/3d-tiles-styling-specification) 更改最终渲染的颜色和其他视觉属性。

---

<a id="点法线" name="点法线"></a>

### 点法线

每个点的法线是一个可选属性，可以通过启用照明、隐藏的表面移除（hidden surface removal）和其他渲染技术来帮助改善点的视觉质量。使用平铺变换的逆转置来变换法线。

---

<a id="八进制编码的法向向量" name="八进制编码的法向向量"></a>

#### 八进制编码的法向向量

在[独立单位向量的有效表示法](http://jcgt.org/published/0003/02/01/)中描述的八进制编码。八进制编码的值存储在无符号的非归一化范围（`[0, 255]`）中，然后在运行时映射到有符号的规范化范围（`[-1.0, 1.0]`）。

> 在 CesiumJS 的[AttributeCompression](https://github.com/CesiumGS/cesium/blob/master/Source/Core/AttributeCompression.js)模块中可以找到对这些单位矢量进行编码和解码的实现。

---

<a id="批处理点" name="批处理点"></a>

### 批处理点

使用`BATCH_ID`可以将点云特定功能的点批处理在一起。例如，组成房屋门的所有点可以分配相同的`BATCH_ID`，而组成窗户的所有点分配不同的`BATCH_ID`。这对于按对象选择和存储应用程序特定的元数据以进行样式声明和特定于应用程序的用例（例如，填充 UI 或基于每个对象而不是基于每个点发出 REST API 请求）很有用。

`BATCH_ID`语义可以有一个 `componentType` 的 `UNSIGNED_BYTE`，`UNSIGNED_SHORT` 或 `UNSIGNED_INT`。当 `componentType` 不存在时，使用 `UNSIGNED_SHORT`。全局语义 `BATCH_LENGTH` 定义唯一 `batchId` 值的数量，类似于 Batched 3D Model 标头中的 `batchLength `字段。

---

<a id="例子" name="例子"></a>

### 例子

_本节是非规范性的_

这些示例说明如何为要素表生成 JSON 和二进制缓冲区。

---

<a id="仅位置" name="仅位置"></a>

#### 仅位置

这个最小示例在单位长度正方形的角上有四个点：

```json
var featureTableJSON = {
    "POINTS_LENGTH" : 4,
    "POSITION" : {
        "byteOffset" : 0
    }
};

var featureTableBinary = new Buffer(new Float32Array([
    0.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    0.0, 0.0, 1.0,
    1.0, 0.0, 1.0
]).buffer);
```

---

<a id="位置和颜色" name="位置和颜色"></a>

#### 位置和颜色

以下示例在地球上方有四个点（红，绿，蓝和黄）。它们的位置是相对于中心定义的：

```json
var featureTableJSON = {
    "POINTS_LENGTH" : 4,
    "RTC_CENTER" : [1215013.8, -4736316.7, 4081608.4],
    "POSITION" : {
        "byteOffset" : 0
    },
    "RGB" : {
        "byteOffset" : 48
    }
};

var positionBinary = new Buffer(new Float32Array([
    0.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    0.0, 0.0, 1.0,
    1.0, 0.0, 1.0
]).buffer);

var colorBinary = new Buffer(new Uint8Array([
    255, 0, 0,
    0, 255, 0,
    0, 0, 255,
    255, 255, 0,
]).buffer);

var featureTableBinary = Buffer.concat([positionBinary, colorBinary]);
```

---

<a id="量化位置和八进制编码法线" name="量化位置和八进制编码法线"></a>

#### 量化位置和八进制编码法线

在此示例中，四个点的法线以八进制编码格式指向朝上`[0.0, 1.0, 0.0]`，并且将它们放置在量化体积的角上，在`x`和`z`方向上的跨度为`-250.0` 到 `250.0` 个单位：

```json
var featureTableJSON = {
    "POINTS_LENGTH" : 4,
    "QUANTIZED_VOLUME_OFFSET" : [-250.0, 0.0, -250.0],
    "QUANTIZED_VOLUME_SCALE" : [500.0, 0.0, 500.0],
    "POSITION_QUANTIZED ": {
        "byteOffset" : 0
    },
    "NORMAL_OCT16P" : {
        "byteOffset" : 24
    }
};

var positionQuantizedBinary = new Buffer(new Uint16Array([
    0, 0, 0,
    65535, 0, 0,
    0, 0, 65535,
    65535, 0, 65535
]).buffer);

var normalOct16PBinary = new Buffer(new Uint8Array([
    128, 255,
    128, 255,
    128, 255,
    128, 255
]).buffer);

var featureTableBinary = Buffer.concat([positionQuantizedBinary, normalOct16PBinary]);
```

---

<a id="批处理点sub" name="批处理点sub"></a>

#### 批处理点

在此示例中，前两个点的`batchId`为`0`，后两个点的`batchId `为`1`。请注意，批处理表只有两个名称：

```json
var featureTableJSON = {
    "POINTS_LENGTH" : 4,
    "BATCH_LENGTH" : 2,
    "POSITION" : {
        "byteOffset" : 0
    },
    BATCH_ID : {
        "byteOffset" : 48,
        "componentType" : "UNSIGNED_BYTE"
    }
};

var positionBinary = new Buffer(new Float32Array([
    0.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    0.0, 0.0, 1.0,
    1.0, 0.0, 1.0
]).buffer);

var batchIdBinary = new Buffer(new Uint8Array([
    0,
    0,
    1,
    1
]).buffer);

var featureTableBinary = Buffer.concat([positionBinary, batchIdBinary]);

var batchTableJSON = {
    "names" : ['object1', 'object2']
};
```

---

<a id="每个点的属性" name="每个点的属性"></a>

#### 每个点的属性

在此示例中，这 4 个点中的每个点都将元数据存储在 Batch Table JSON 和二进制文件中。

```json
var featureTableJSON = {
    "POINTS_LENGTH ": 4,
    "POSITION" : {
        "byteOffset" : 0
    }
};

var featureTableBinary = new Buffer(new Float32Array([
    0.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    0.0, 0.0, 1.0,
    1.0, 0.0, 1.0
]).buffer);

var batchTableJSON = {
    "names" : ['point1', 'point2', 'point3', 'point4']
};
```

---

<a id="批量表" name="批量表"></a>

## 批量表

`批处理表`包含应用程序特定的元数据，通过`batchId`进行索引，可被用于声明式样式和应用特定的用例如填充 UI 或者发出 REST API 请求。

- 如果`BATCH_ID`定义，则批处理表将存储每个元数据`batchId`，并且批处理表数组的长度将等于`BATCH_LENGTH`。
- 如果`BATCH_ID`未定义，则批处理表将存储每个点的元数据，并且批处理表数组的长度将等于`POINTS_LENGTH`。

更多信息，请参见[批处理表(Batch Table)](/2021/04/23/3d-tiles-batch-table-specification)。

---

<a id="扩展" name="扩展"></a>

## 扩展

以下扩展可以应用于点云瓦片。

- [3DTILES_draco_point_compression](https://github.com/CesiumGS/3d-tiles/tree/master/extensions/3DTILES_draco_point_compression)

---

<a id="文件扩展名和MIME类型" name="文件扩展名和MIME类型"></a>

## 文件扩展名和 MIME 类型

点云瓦片使用`.pnts `扩展名和 `application/octet-stream` MIME 类型。

显式文件扩展名是可选的。有效的实现可能会忽略它，并通过 `magic` 其标头中的字段标识内容的格式。

---

<a id="实现示例" name="实现示例"></a>

## 实现示例

_本节是非规范性的_

可以在 3D Tiles 的 CesiumJS 实现[PointCloud3DModelTileContent.js](https://github.com/CesiumGS/cesium/blob/master/Source/Scene/PointCloud3DTileContent.js)中找到用于读取标头的代码。

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

一组点云语义，其中包含定义图块中点的位置和外观属性的值。

|                             | 类型                               | 描述                                                                                                                                                                 | 是否必须               |
| --------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| **extensions**              | `object`                           | 扩展特定的字典对象                                                                                                                                                   | No                     |
| **extras**                  | `any`                              | 应用特定数据                                                                                                                                                         | No                     |
| **POSITION**                | `object`                           | <a href="#r二进制体引用" class="self">二进制体引用</a> 对象，定义存储了属性值的二进制体部分的引用。查看相应属性的定义<a href="#语法定义" class="self">语法定义</a>   | No                     |
| **POSITION_QUANTIZED**      | `object`                           | <a href="#r二进制体引用" class="self">二进制体引用</a> 对象，定义存储了属性值的二进制体部分的引用。查看相应属性的定义<a href="#语法定义" class="self">语法定义</a>   | No                     |
| **RGBA**                    | `object`                           | <a href="#r二进制体引用" class="self">二进制体引用</a> 对象，定义存储了属性值的二进制体部分的引用。查看相应属性的定义<a href="#语法定义" class="self">语法定义</a>   | No                     |
| **RGB**                     | `object`                           | <a href="#r二进制体引用" class="self">二进制体引用</a> 对象，定义存储了属性值的二进制体部分的引用。查看相应属性的定义<a href="#语法定义" class="self">语法定义</a>   | No                     |
| **RGB565**                  | `object`                           | <a href="#r二进制体引用" class="self">二进制体引用</a> 对象，定义存储了属性值的二进制体部分的引用。查看相应属性的定义<a href="#语法定义" class="self">语法定义</a>   | No                     |
| **NORMAL**                  | `object`                           | <a href="#r二进制体引用" class="self">二进制体引用</a> 对象，定义存储了属性值的二进制体部分的引用。查看相应属性的定义<a href="#语法定义" class="self">语法定义</a>   | No                     |
| **NORMAL_OCT16P**           | `object`                           | <a href="#r二进制体引用" class="self">二进制体引用</a> 对象，定义存储了属性值的二进制体部分的引用。查看相应属性的定义<a href="#语法定义" class="self">语法定义</a>   | No                     |
| **BATCH_ID**                | `object`                           | <a href="#r二进制体引用" class="self">二进制体引用</a> 对象，定义存储了属性值的二进制体部分的引用。查看相应属性的定义<a href="#语法定义" class="self">语法定义</a>   | No                     |
| **POINTS_LENGTH**           | `object`, `number` `[1]`, `number` | <a href="#r全局标量属性" class="self">全局标量属性</a> 对象，定义所有要素的数量。查看相应属性的定义<a href="#语法定义" class="self">语法定义</a>                     | :white_check_mark: Yes |
| **RTC_CENTER**              | `object`, `number` `[3]`           | <a href="#r全局笛卡尔3坐标系属性" class="self">全局笛卡尔 3 坐标系属性</a> 对象，定义所有要素的数量。查看相应属性的定义<a href="#语法定义" class="self">语法定义</a> | No                     |
| **QUANTIZED_VOLUME_OFFSET** | `object`, `number` `[3]`           | <a href="#r全局笛卡尔3坐标系属性" class="self">全局笛卡尔 3 坐标系属性</a> 对象，定义所有要素的数量。查看相应属性的定义<a href="#语法定义" class="self">语法定义</a> | No                     |
| **QUANTIZED_VOLUME_SCALE**  | `object`, `number` `[3]`           | <a href="#r全局笛卡尔3坐标系属性" class="self">全局笛卡尔 3 坐标系属性</a> 对象，定义所有要素的数量。查看相应属性的定义<a href="#语法定义" class="self">语法定义</a> | No                     |
| **CONSTANT_RGBA**           | `object`, `number` `[4]`           | <a href="#r全局笛卡尔4坐标系属性" class="self">全局笛卡尔 4 坐标系属性</a> 对象，定义所有要素的数量。查看相应属性的定义<a href="#语法定义" class="self">语法定义</a> | No                     |
| **BATCH_LENGTH**            | `object`, `number` `[1]`, `number` | <a href="#r全局标量属性" class="self">全局标量属性</a> 对象，定义所有要素的数量。查看相应属性的定义<a href="#语法定义" class="self">语法定义</a>                     | No                     |

允许其他属性。

---

<a id="r二进制体引用" name="r二进制体引用"></a>

### 二进制体引用

一个对象，用于定义对要素表的二进制主体部分的引用，如果未在 JSON 中直接定义属性值，则在该部分存储属性值。

|                | 类型     | 描述                           | 是否必须               |
| -------------- | -------- | ------------------------------ | ---------------------- |
| **byteOffset** | `number` | 缓冲区的偏移量（以字节为单位） | :white_check_mark: Yes |

---

<a id="r全局笛卡尔3坐标系属性" name="r全局笛卡尔3坐标系属性"></a>

### 全局笛卡尔 3 坐标系属性

为所有要素定义全局 3 组分数值属性值的对象。

---

<a id="r全局笛卡尔4坐标系属性" name="r全局笛卡尔4坐标系属性"></a>

### 全局笛卡尔 4 坐标系属性

为所有要素定义全局 4 组分数值属性值的对象。

---

<a id="r全局标量属性" name="r全局标量属性"></a>

### 全局标量属性

为所有要素定义全局数值属性值的对象。

---

<a id="r属性" name="r属性"></a>

### 属性

用户自定义的属性，用来在数据中指定每个要素的应用程序特定的元数据。值可以直接在 JSON 中定义为数组，也可以引用<a href="#r二进制体引用" class="self">二进制体</a>中的部分。

[JSON 定义示例](https://github.com/CesiumGS/3d-tiles/blob/master/specification/schema/featureTable.schema.json)

```json
{
  "$schema": "http://json-schema.org/draft-04/schema",
  "id": "featureTable.schema.json",
  "title": "Feature Table",
  "type": "object",
  "description": "A set of semantics containing per-tile and per-feature values defining the position and appearance properties for features in a tile.",
  "definitions": {
    "binaryBodyReference": {
      "title": "BinaryBodyReference",
      "type": "object",
      "description": "An object defining the reference to a section of the binary body of the features table where the property values are stored if not defined directly in the JSON.",
      "properties": {
        "byteOffset": {
          "type": "number",
          "description": "The offset into the buffer in bytes.",
          "minimum": 0
        },
        "componentType": {
          "type": "number",
          "description": "The datatype of components in the property. This is defined only if the semantic allows for overriding the implicit component type. These cases are specified in each tile format.",
          "enum": [
            "BYTE",
            "UNSIGNED_BYTE",
            "SHORT",
            "UNSIGNED_SHORT",
            "INT",
            "UNSIGNED_INT",
            "FLOAT",
            "DOUBLE"
          ]
        }
      },
      "required": ["byteOffset"]
    },
    "numericArray": {
      "type": "array",
      "items": {
        "type": "number"
      }
    },
    "property": {
      "title": "Property",
      "description": "A user-defined property which specifies per-feature application-specific metadata in a tile. Values either can be defined directly in the JSON as an array, or can refer to sections in the binary body with a `BinaryBodyReference` object.",
      "oneOf": [
        {
          "$ref": "#/definitions/binaryBodyReference"
        },
        {
          "type": "array",
          "items": {
            "type": "number"
          }
        },
        {
          "type": "number"
        }
      ]
    },
    "globalPropertyBoolean": {
      "title": "GlobalPropertyBoolean",
      "description": "An object defining a global boolean property value for all features.",
      "type": "boolean"
    },
    "globalPropertyScalar": {
      "title": "GlobalPropertyScalar",
      "description": "An object defining a global numeric property value for all features.",
      "oneOf": [
        {
          "type": "object",
          "properties": {
            "byteOffset": {
              "type": "number",
              "description": "The offset into the buffer in bytes.",
              "minimum": 0
            }
          },
          "required": ["byteOffset"]
        },
        {
          "type": "array",
          "items": {
            "type": "number"
          },
          "minItems": 1,
          "maxItems": 1
        },
        {
          "type": "number",
          "minimum": 0
        }
      ]
    },
    "globalPropertyCartesian3": {
      "title": "GlobalPropertyCartesian3",
      "description": "An object defining a global 3-component numeric property values for all features.",
      "oneOf": [
        {
          "type": "object",
          "properties": {
            "byteOffset": {
              "type": "number",
              "description": "The offset into the buffer in bytes.",
              "minimum": 0
            }
          },
          "required": ["byteOffset"]
        },
        {
          "type": "array",
          "items": {
            "type": "number"
          },
          "minItems": 3,
          "maxItems": 3
        }
      ]
    },
    "globalPropertyCartesian4": {
      "title": "GlobalPropertyCartesian4",
      "description": "An object defining a global 4-component numeric property values for all features.",
      "oneOf": [
        {
          "type": "object",
          "properties": {
            "byteOffset": {
              "type": "number",
              "description": "The offset into the buffer in bytes.",
              "minimum": 0
            }
          },
          "required": ["byteOffset"]
        },
        {
          "type": "array",
          "items": {
            "type": "number"
          },
          "minItems": 4,
          "maxItems": 4
        }
      ]
    }
  },
  "properties": {
    "extensions": {
      "$ref": "extension.schema.json"
    },
    "extras": {
      "$ref": "extras.schema.json"
    }
  },
  "additionalProperties": {
    "$ref": "#/definitions/property"
  }
}
```

---

_版权声明：_
_除非注明，本博文章均为原创，转载请以链接形式标明本文地址。_

---
