---
title: 3D Tiles实例3D模型(Instanced 3D Model)数据格式标准规范
top: false
cover: false
toc: true
mathjax: false
comment: true
date: 2021-04-23 21:43:49
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

  - <a href="#结构填充" class="self">结构填充</a>

- <a href="#文件头" class="self">文件头</a>
- <a href="#要素表" class="self">要素表</a>

  - <a href="#语法定义" class="self">语法定义</a>

    - <a href="#实例语法" class="self">实例语法</a>
    - <a href="#全局语法" class="self">全局语法</a>

  - <a href="#实例方向" class="self">实例方向</a>

    - <a href="#八进制编码的法向向量" class="self">八进制编码的法向向量</a>
    - <a href="#默认方向" class="self">默认方向</a>

  - <a href="#实例位置" class="self">实例位置</a>

    - <a href="#RTC_CENTER" class="self">RTC_CENTER</a>
    - <a href="#量化位置" class="self">量化位置</a>

  - <a href="#实例缩放" class="self">实例缩放</a>

  - <a href="#例子" class="self">例子</a>

    - <a href="#仅位置" class="self">仅位置</a>
    - <a href="#量化位置和八进制编码法线" class="self">量化位置和八进制编码法线</a>

- <a href="#批处理表" class="self">批处理表</a>
- <a href="#glTF" class="self">glTF</a>
  - <a href="#坐标系" class="self">坐标系</a>
- <a href="#文件扩展名和MIME类型" class="self">文件扩展名和 MIME 类型</a>

- <a href="#属性参考" class="self">属性参考</a>

---

<a id="引" name="引"></a>

## 引

[官网文档](https://github.com/CesiumGS/3d-tiles/tree/master/specification/TileFormats/Instanced3DModel)

---

<a id="概述" name="概述"></a>

## 概述

`实例 3D 模型`是一种切片数据格式，用于高效地流式传输和渲染大数据量的模型，称为实例，但会稍有变化。在最简单的情况下，例如，同一棵树模型可能会放置在多个地方（实例化）。每个实例都引用相同的模型，但每个实例都有属性，例如位置。使用 core 3D Tiles 规范语言，每个实例是一个要素。

除树木外，实例 3D 模型还可用于表面特征（例如消火栓，下水道盖，灯和交通信号灯），以及用于内部 CAD 特征（例如螺栓，阀门和电源插座）。

实例化 3D 模型数据是小端字节序的二进制 Blob。

> 实现提示：[复合对象 (Composite)](/2021/04/23/3d-tiles-composite-specification)可以通过组合不同类型的实例模型来创建，例如，通过合并两个实例化 3D 模型图块来绘制树木和交通信号灯。

> 实现提示：实例化 3D 模型可以很好地映射到 [ANGLE_instanced_arrays](https://www.khronos.org/registry/webgl/extensions/ANGLE_instanced_arrays/) 扩展，以便使用 WebGL 进行高效渲染。

---

<a id="文件结构" name="文件结构"></a>

## 文件结构

数据由文件头部分和紧随其后的二进制主体组成。下图显示了实例化 3D 模型的布局（破折号表示可选字段）：

![](https://gitee.com/Jackie_Tang/Jackie_Tang/raw/master/my_images/2021-04/3d-tiles/header-layout.png)

---

<a id="结构填充" name="结构填充"></a>

### 结构填充

数据 `byteLength` 必须以 8 个字节进行边界对齐。包含的[要素表(Feature Table)](/2021/04/23/3d-tiles-feature-table-specification#结构填充)和[批处理表(Batch Table)](/2021/04/23/3d-tiles-batch-table-specification#结构填充)必须符合其各自的填充要求。

<a href="#二进制glTF" class="self">二进制 glTF</a> （如果存在）的开始和结束位置必须以 8 个字节进行边界对齐，以便满足 glTF 的字节对齐要求。这可以通过填充功能表或批处理表（如果存在）来实现。

否则，如果 glTF 字段是 UTF-8 字符串，则必须用尾随空格字符（`0x20`）填充它，以满足数据的对齐要求，在请求 glTF 数据之前，必须在运行时将其删除。

---

<a id="文件头" name="文件头"></a>

## 文件头

32 字节的文件头包含以下字段：

| Field name                     | Data type          | Description                                                                                                                               |
| ------------------------------ | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `magic`                        | 4-byte ANSI string | `"i3dm"`。用于将内容标识为“实例 3D 模型”                                                                                                  |
| `version`                      | `uint32`           | 版本。现在是`1`。                                                                                                                         |
| `byteLength`                   | `uint32`           | 整个数据的长度（包括文件头），以字节为单位                                                                                                |
| `featureTableJSONByteLength`   | `uint32`           | 要素表 JSON 部分的长度（以字节为单位）                                                                                                    |
| `featureTableBinaryByteLength` | `uint32`           | 要素表二进制部分的长度（以字节为单位）                                                                                                    |
| `batchTableJSONByteLength`     | `uint32`           | 批处理表 JSON 部分的长度（以字节为单位），零表示没有批处理表                                                                              |
| `batchTableBinaryByteLength`   | `uint32`           | 批处理表二进制部分的长度（以字节为单位），如果`batchTableJSONByteLength`为零，则也将为零。                                                |
| `gltfFormat`                   | `uint32`           | 指示主体的 glTF 字段的格式。 `0`表示它是一个 uri，`1`表示它是嵌入式二进制 glTF。请参阅下面的 <a href="#glTF" class="self">glTF</a> 部分。 |

主体部分紧着文件头，并且由三个字段组成：`Feature Table`，`Batch Table`，和`glTF`。

---

<a id="要素表" name="要素表"></a>

## 要素表

要素表包含`i3dm`用于创建实例模型的语法值。更多信息请查看[要素表(Feature Table)规范](/2021/04/23/3d-tiles-feature-table-specification)。

在<a href="#属性参考" class="self">属性参考</a> 查看`i3dm` 要素表的参考。完整 JSON 定义[i3dm.featureTable.schema.json](https://github.com/CesiumGS/3d-tiles/blob/master/specification/schema/i3dm.featureTable.schema.json)。

```json
{
  "$schema": "http://json-schema.org/draft-04/schema",
  "id": "i3dm.featureTable.schema.json",
  "title": "Instanced 3D Model Feature Table",
  "type": "object",
  "description": "A set of Instanced 3D Model semantics that contains values defining the position and appearance properties for instanced models in a tile.",
  "allOf": [
    {
      "$ref": "featureTable.schema.json"
    },
    {
      "properties": {
        "POSITION": {
          "description": "A `BinaryBodyReference` object defining the reference to a section of the binary body where the property values are stored. See the corresponding property semantic in [Semantics](/specification/TileFormats/Instanced3DModel/README.md#semantics).",
          "allOf": [
            {
              "$ref": "featureTable.schema.json#/definitions/binaryBodyReference"
            }
          ]
        },
        "POSITION_QUANTIZED": {
          "description": "A `BinaryBodyReference` object defining the reference to a section of the binary body where the property values are stored. See the corresponding property semantic in [Semantics](/specification/TileFormats/Instanced3DModel/README.md#semantics).",
          "allOf": [
            {
              "$ref": "featureTable.schema.json#/definitions/binaryBodyReference"
            }
          ]
        },
        "NORMAL_UP": {
          "description": "A `BinaryBodyReference` object defining the reference to a section of the binary body where the property values are stored. See the corresponding property semantic in [Semantics](/specification/TileFormats/Instanced3DModel/README.md#semantics).",
          "allOf": [
            {
              "$ref": "featureTable.schema.json#/definitions/binaryBodyReference"
            }
          ]
        },
        "NORMAL_RIGHT": {
          "description": "A `BinaryBodyReference` object defining the reference to a section of the binary body where the property values are stored. See the corresponding property semantic in [Semantics](/specification/TileFormats/Instanced3DModel/README.md#semantics).",
          "allOf": [
            {
              "$ref": "featureTable.schema.json#/definitions/binaryBodyReference"
            }
          ]
        },
        "NORMAL_UP_OCT32P": {
          "description": "A `BinaryBodyReference` object defining the reference to a section of the binary body where the property values are stored. See the corresponding property semantic in [Semantics](/specification/TileFormats/Instanced3DModel/README.md#semantics).",
          "allOf": [
            {
              "$ref": "featureTable.schema.json#/definitions/binaryBodyReference"
            }
          ]
        },
        "NORMAL_RIGHT_OCT32P": {
          "description": "A `BinaryBodyReference` object defining the reference to a section of the binary body where the property values are stored. See the corresponding property semantic in [Semantics](/specification/TileFormats/Instanced3DModel/README.md#semantics).",
          "allOf": [
            {
              "$ref": "featureTable.schema.json#/definitions/binaryBodyReference"
            }
          ]
        },
        "SCALE": {
          "description": "A `BinaryBodyReference` object defining the reference to a section of the binary body where the property values are stored. See the corresponding property semantic in [Semantics](/specification/TileFormats/Instanced3DModel/README.md#semantics).",
          "allOf": [
            {
              "$ref": "featureTable.schema.json#/definitions/binaryBodyReference"
            }
          ]
        },
        "SCALE_NON_UNIFORM": {
          "description": "A `BinaryBodyReference` object defining the reference to a section of the binary body where the property values are stored. See the corresponding property semantic in [Semantics](/specification/TileFormats/Instanced3DModel/README.md#semantics).",
          "allOf": [
            {
              "$ref": "featureTable.schema.json#/definitions/binaryBodyReference"
            }
          ]
        },
        "BATCH_ID": {
          "description": "A `BinaryBodyReference` object defining the reference to a section of the binary body where the property values are stored. See the corresponding property semantic in [Semantics](/specification/TileFormats/Instanced3DModel/README.md#semantics).",
          "allOf": [
            {
              "$ref": "featureTable.schema.json#/definitions/binaryBodyReference"
            }
          ]
        },
        "INSTANCES_LENGTH": {
          "description": "A `GlobalPropertyScalar` object defining a numeric property for all features. See the corresponding property semantic in [Semantics](/specification/TileFormats/Instanced3DModel/README.md#semantics).",
          "allOf": [
            {
              "$ref": "featureTable.schema.json#/definitions/globalPropertyScalar"
            }
          ]
        },
        "RTC_CENTER": {
          "description": "A `GlobalPropertyCartesian3` object defining a 3-component numeric property for all features. See the corresponding property semantic in [Semantics](/specification/TileFormats/Instanced3DModel/README.md#semantics).",
          "allOf": [
            {
              "$ref": "featureTable.schema.json#/definitions/globalPropertyCartesian3"
            }
          ]
        },
        "QUANTIZED_VOLUME_OFFSET": {
          "description": "A `GlobalPropertyCartesian3` object defining a 3-component numeric property for all features. See the corresponding property semantic in [Semantics](/specification/TileFormats/Instanced3DModel/README.md#semantics).",
          "allOf": [
            {
              "$ref": "featureTable.schema.json#/definitions/globalPropertyCartesian3"
            }
          ]
        },
        "QUANTIZED_VOLUME_SCALE": {
          "description": "A `GlobalPropertyCartesian3` object defining a 3-component numeric property for all features. See the corresponding property semantic in [Semantics](/specification/TileFormats/Instanced3DModel/README.md#semantics).",
          "allOf": [
            {
              "$ref": "featureTable.schema.json#/definitions/globalPropertyCartesian3"
            }
          ]
        },
        "EAST_NORTH_UP": {
          "description": "A `GlobalPropertyBoolean` object defining a boolean property for all features. See the corresponding property semantic in [Semantics](/specification/TileFormats/Instanced3DModel/README.md#semantics).",
          "allOf": [
            {
              "$ref": "featureTable.schema.json#/definitions/globalPropertyBoolean"
            }
          ]
        },
        "extensions": {
          "$ref": "extension.schema.json"
        },
        "extras": {
          "$ref": "extras.schema.json"
        }
      },
      "oneOf": [
        {
          "required": ["POSITION"]
        },
        {
          "required": ["POSITION_QUANTIZED"]
        }
      ],
      "dependencies": {
        "POSITION_QUANTIZED": [
          "QUANTIZED_VOLUME_OFFSET",
          "QUANTIZED_VOLUME_SCALE"
        ],
        "NORMAL_UP": ["NORMAL_RIGHT"],
        "NORMAL_RIGHT": ["NORMAL_UP"],
        "NORMAL_UP_OCT32P": ["NORMAL_RIGHT_OCT32P"],
        "NORMAL_RIGHT_OCT32P": ["NORMAL_UP_OCT32P"]
      },
      "required": ["INSTANCES_LENGTH"]
    }
  ]
}
```

---

<a id="语法定义" name="语法定义"></a>

### 语法定义

<a id="实例语法" name="实例语法"></a>

#### 实例语法

语法映射到要素值的数组，用于创建实例的。对于语法，这些数组的长度必须相同，并且必须等于实例数。每个实例的值必须是对要素表二进制主体的引用；它们不能嵌入要素表的 JSON 头中。

如果一个语法依赖于另一个语法，则必须定义该语法。如果实例同时定义了 `SCALE` 和 `SCALE_NON_UNIFORM`，则将应用两个缩放操作。如果实例同时定义了 `POSITION` 和 `POSITION_QUANTIZED`，更高精度的`POSITION` 将被使用。如果实例同时定义了 `NORMAL_UP`，`NORMAL_RIGHT`，`NORMAL_UP_OCT32P`，和 `NORMAL_RIGHT_OCT32P`，更高精度的 `NORMAL_UP` 和 `NORMAL_RIGHT` 将被使用。

| 语法                  | 数据类型                                 | 描述                                                                                               | 是否必须                                                |
| --------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `POSITION`            | `float32[3]`                             | 3 个部分的数组包含`x`，`y`以及`z`的笛卡尔坐标表示实例的位置                                        | :white_check_mark: Yes, 除非定义了 `POSITION_QUANTIZED` |
| `POSITION_QUANTIZED`  | `uint16[3]`                              | 3 个部分的数组包含`x`，`y`以及`z`的量化笛卡尔坐标（quantized Cartesian coordinates）表示实例的位置 | :white_check_mark: Yes, 除非定义了 `POSITION`           |
| `NORMAL_UP`           | `float32[3]`                             | 定义实例`up`方向的单位向量                                                                         | :red_circle: No, 除非定义了 `NORMAL_RIGHT`              |
| `NORMAL_RIGHT`        | `float32[3]`                             | 定义实例`right`方向的单位向量，必须与`up`方向正交                                                  | :red_circle: No, 除非定义了 `NORMAL_UP`                 |
| `NORMAL_UP_OCT32P`    | `uint16[2]`                              | 32 位精度的八进制编码的单位矢量，`up`用于定义实例定向的方向                                        | :red_circle: No, 除非定义了 `NORMAL_RIGHT_OCT32P`       |
| `NORMAL_RIGHT_OCT32P` | `uint16[2]`                              | 32 位精度的八进制编码的单位矢量，`right`用于定义实例定向的方向，必须与`up`方向正交                 | :red_circle: No, 除非定义了 `NORMAL_UP_OCT32P`          |
| `SCALE`               | `float32`                                | 一个数字用于定义实例所有轴的比例                                                                   | :red_circle: No.                                        |
| `SCALE_NON_UNIFORM`   | `float32[3]`                             | 3 个部分数组的比例数字，定义实例`x`，`y`以及`z`轴的比例                                            | :red_circle: No.                                        |
| `BATCH_ID`            | `uint8`, `uint16` (default), or `uint32` | 实例的`batchId`用于从`Batch Table`检索元数据                                                       | :red_circle: No.                                        |

---

<a id="全局语法" name="全局语法"></a>

#### 全局语法

这些语法定义了所有实例的全局属性。

| 语法                      | 数据类型     | 描述                                                                                     | 是否必须                                         |
| ------------------------- | ------------ | ---------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `INSTANCES_LENGTH`        | `uint32`     | 要生成的实例数。实例语义的每个数组值的长度应等于此长度                                   | :white_check_mark: Yes.                          |
| `RTC_CENTER`              | `float32[3]` | 当实例位置相对于中心定义时，由三部分组成的数字数组定义中心位.                            | :red_circle: No.                                 |
| `QUANTIZED_VOLUME_OFFSET` | `float32[3]` | 由三部分组成的数字数组，用于定义量化体积的偏移量                                         | :red_circle: No, 除非定义了 `POSITION_QUANTIZED` |
| `QUANTIZED_VOLUME_SCALE`  | `float32[3]` | 由三部分组成的数字数组，用于定义量化体积的比例                                           | :red_circle: No, 除非定义了 `POSITION_QUANTIZED` |
| `EAST_NORTH_UP`           | `boolean`    | 当`true`未定义按实例的方向时，每个实例将默认为椭球`east/north/up`上参考框架的方向`WGS84` | :red_circle: No.                                 |

---

<a id="实例方向" name="实例方向"></a>

### 实例方向

实例的方向由`up`和`right`矢量创建的正交基准定义。方向将通过[瓦片变换](/2021/04/21/3d-tiles-specification/#瓦片变换（Tiletransforms）) 进行。

`x`标准基向量在变换时映射到`right`基向量，`y`向量映射到`up`向量。`z`向量映射到`forward`向量，但它忽略，因为它总是`right`和`up`的正交。

![](https://gitee.com/Jackie_Tang/Jackie_Tang/raw/master/my_images/2021-04/3d-tiles/box-standard-basis.png)

在标准坐标轴中的盒子

![](https://gitee.com/Jackie_Tang/Jackie_Tang/raw/master/my_images/2021-04/3d-tiles/box-rotated-basis.png)

经过旋转变换的盒子

---

<a id="八进制编码的法向向量" name="八进制编码的法向向量"></a>

#### 八进制编码的法向向量

如果`NORMAL_UP`与`NORMAL_RIGHT`不被实例所定义，其取向可以被存储为八进制编码的法向`NORMAL_UP_OCT32P`和`NORMAL_RIGHT_OCT32P`。它们定义`up`和`right`使用[独立单位向量的有效表示法](http://jcgt.org/published/0003/02/01/)中描述的八进制编码。八进制编码的值存储在无符号的非规范化范围（`[0, 65535]`）中，然后在运行时映射到有符号（`[-1.0, 1.0]`）的规范化范围。

> 在 CesiumJS 的[AttributeCompression](https://github.com/CesiumGS/cesium/blob/master/Source/Core/AttributeCompression.js)模块中可以找到对这些单位矢量进行编码和解码的实现。

---

<a id="默认方向" name="默认方向"></a>

#### 默认方向

如果不存在`NORMAL_UP`和`NORMAL_RIGHT`或`NORMAL_UP_OCT32P`和`NORMAL_RIGHT_OCT32P`，则实例将没有自定义方向。如果`EAST_NORTH_UP`为 `true`，则假定该实例位于`WGS84`椭球体上，并且其方向将默认为`east/north/up`参考框架在其制图位置处的位置。这适用于诸如树木之类的实例模型，其方向始终从其在椭球表面上的位置朝上。

---

<a id="实例位置" name="实例位置"></a>

### 实例位置

`POSITION`定义实例的位置，在应用任何变换之前。

---

<a id="RTC_CENTER" name="RTC_CENTER"></a>

#### RTC_CENTER

可以相对于中心定义位置以进行高精度渲染，请参见[Precisions，Precisions](http://help.agi.com/AGIComponents/html/BlogPrecisionsPrecisions.htm)。如果定义，则 `RTC_CENTER` 指定中心位置，并且所有实例位置均相对于此值。

---

<a id="量化位置" name="量化位置"></a>

#### 量化位置

如果没有为实例定义`POSITION`，则其位置可以存储在`POSITION_QUANTIZED`中，其定义了相对于量化体的实例位置。如果没有 `POSITION` 或 `POSITION_QUANTIZED` 定义，实例将不会被创建。

量化体由`offset`和`scale`定义，并将量化的位置映射到局部空间，如下图所示：

![](https://gitee.com/Jackie_Tang/Jackie_Tang/raw/master/my_images/2021-04/3d-tiles/quantized-volume.png)

`offset`全局语义存储在`QUANTIZED_VOLUME_OFFSET`，`scale`全局语义存储在`QUANTIZED_VOLUME_SCALE`。如果未定义这些全局语义，则`POSITION_QUANTIZED`无法使用。

可以使用以下公式将量化的位置映射到本地空间：

`POSITION = POSITION_QUANTIZED \* QUANTIZED_VOLUME_SCALE / 65535.0 + QUANTIZED_VOLUME_OFFSET`

---

<a id="实例缩放" name="实例缩放"></a>

### 实例缩放

缩放可以使用`SCALE`和`SCALE_NON_UNIFORM`语义应用于实例。 `SCALE`沿着所有轴应用统一的缩放，`SCALE_NON_UNIFORM`分别在`x`，`y`和`z`轴应用独立的缩放。

---

<a id="例子" name="例子"></a>

### 例子

这些示例说明如何为要素表生成 JSON 和二进制缓冲区。

<a id="仅位置" name="仅位置"></a>

#### 仅位置

在这个最小的示例中，我们将四个实例以默认方向放置在单位长度正方形的角上：

```javascript
var featureTableJSON = {
  INSTANCES_LENGTH: 4,
  POSITION: {
    byteOffset: 0
  }
}

var featureTableBinary = new Buffer(
  new Float32Array([
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    1.0,
    0.0,
    1.0
  ]).buffer
)
```

---

<a id="量化位置和八进制编码法线" name="量化位置和八进制编码法线"></a>

#### 量化位置和八进制编码法线

在此示例中，四个实例会被放置在`up`方向为`[0.0, 1.0, 0.0]`，`right` 为`[1.0, 0.0, 0.0]`的八进制编码格式，并且将它们放置在量化体积的角上，该量化体积在`x`和`z`方向上跨度为`-250.0` 到 `250.0 `个单位：

```javascript
var featureTableJSON = {
  INSTANCES_LENGTH: 4,
  QUANTIZED_VOLUME_OFFSET: [-250.0, 0.0, -250.0],
  QUANTIZED_VOLUME_SCALE: [500.0, 0.0, 500.0],
  POSITION_QUANTIZED: {
    byteOffset: 0
  },
  NORMAL_UP_OCT32P: {
    byteOffset: 24
  },
  NORMAL_RIGHT_OCT32P: {
    byteOffset: 40
  }
}

var positionQuantizedBinary = new Buffer(
  new Uint16Array([0, 0, 0, 65535, 0, 0, 0, 0, 65535, 65535, 0, 65535]).buffer
)

var normalUpOct32PBinary = new Buffer(
  new Uint16Array([
    32768,
    65535,
    32768,
    65535,
    32768,
    65535,
    32768,
    65535
  ]).buffer
)

var normalRightOct32PBinary = new Buffer(
  new Uint16Array([
    65535,
    32768,
    65535,
    32768,
    65535,
    32768,
    65535,
    32768
  ]).buffer
)

var featureTableBinary = Buffer.concat([
  positionQuantizedBinary,
  normalUpOct32PBinary,
  normalRightOct32PBinary
])
```

---

<a id="批处理表" name="批处理表"></a>

## 批处理表

包含由`batchId`组成的元数据，可用于样式声明。有关更多信息，请参见[批处理表(Batch Table)](/2021/04/23/3d-tiles-batch-table-specification)。

---

<a id="glTF" name="glTF"></a>

## glTF

实例化 3D 模型嵌入了包含模型几何和纹理信息的 [glTF 2.0](https://github.com/KhronosGroup/glTF/tree/master/specification/2.0)。

glTF 资源存储在要素表和批处理表之后。它可能嵌入了所有的几何，纹理和动画，或者可能引用了某些或所有这些数据的外部来源。

`header.gltfFormat` 确定 glTF 字段的格式

- 当 `header.gltfFormat` 的值是 `0`， glTF 字段是 UTF-8 字符串，其包含 glTF 或二进制 glTF 模型的内容的 URI。
- 当 `header.gltfFormat` 的值是 `1`，glTF 字段是包含[二进制 glTF](https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#binary-gltf-layout) 的二进制 blob 。

---

<a id="坐标系" name="坐标系"></a>

### 坐标系

默认情况下，glTF 使用右手坐标系，其中 y 轴朝上。为了与 3D Tiles 的 z 向上坐标系保持一致，必须在运行时转换 glTF。有关更多详细信息，请参见[glTF 变换](/2021/04/21/3d-tiles-specification/#glTF变换（glTFtransforms）) 。

---

<a id="文件扩展名和MIME类型" name="文件扩展名和MIME类型"></a>

## 文件扩展名和 MIME 类型

实例化 3D 模型使用`.i3dm `扩展名和 `application/octet-stream` MIME 类型。

显式文件扩展名是可选的。有效的实现可能会忽略它，并通过 `magic` 其标头中的字段标识内容的格式。

---

<a id="属性参考" name="属性参考"></a>

## 属性参考

- <a href="#r实例化3D模型要素表" class="self">实例化 3D 模型要素表</a>

  - <a href="#r二进制体引用" class="self">二进制体引用</a>
  - <a href="#r全局笛卡尔坐标系属性" class="self">全局笛卡尔坐标系属性</a>
  - <a href="#r全局标量属性" class="self">全局标量属性</a>
  - <a href="#r全局布尔属性" class="self">全局布尔属性</a>
  - <a href="#r属性" class="self">属性</a>

<a id="r实例化3D模型要素表" name="r实例化3D模型要素表"></a>

### 实例化 3D 模型要素表

一组实例化 3D 模型语义，其中包含定义图块中实例化模型的位置和外观属性的值。

|                             | 类型                               | 描述                                                                                                                                                                | 是否必须               |
| --------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| **extensions**              | `object`                           | 扩展特定的字典对象                                                                                                                                                  | No                     |
| **extras**                  | `any`                              | 应用特定数据                                                                                                                                                        | No                     |
| **POSITION**                | `object`                           | <a href="#r二进制体引用" class="self">二进制体引用</a> 对象，定义存储了属性值的二进制体部分的引用。查看相应属性的定义<a href="#语法" class="self">语法</a>          | No                     |
| **POSITION_QUANTIZED**      | `object`                           | <a href="#r二进制体引用" class="self">二进制体引用</a> 对象，定义存储了属性值的二进制体部分的引用。查看相应属性的定义<a href="#语法" class="self">语法</a>          | No                     |
| **NORMAL_UP**               | `object`                           | <a href="#r二进制体引用" class="self">二进制体引用</a> 对象，定义存储了属性值的二进制体部分的引用。查看相应属性的定义<a href="#语法" class="self">语法</a>          | No                     |
| **NORMAL_RIGHT**            | `object`                           | <a href="#r二进制体引用" class="self">二进制体引用</a> 对象，定义存储了属性值的二进制体部分的引用。查看相应属性的定义<a href="#语法" class="self">语法</a>          | No                     |
| **NORMAL_UP_OCT32P**        | `object`                           | <a href="#r二进制体引用" class="self">二进制体引用</a> 对象，定义存储了属性值的二进制体部分的引用。查看相应属性的定义<a href="#语法" class="self">语法</a>          | No                     |
| **NORMAL_RIGHT_OCT32P**     | `object`                           | <a href="#r二进制体引用" class="self">二进制体引用</a> 对象，定义存储了属性值的二进制体部分的引用。查看相应属性的定义<a href="#语法" class="self">语法</a>          | No                     |
| **SCALE**                   | `object`                           | <a href="#r二进制体引用" class="self">二进制体引用</a> 对象，定义存储了属性值的二进制体部分的引用。查看相应属性的定义<a href="#语法" class="self">语法</a>          | No                     |
| **SCALE_NON_UNIFORM**       | `object`                           | <a href="#r二进制体引用" class="self">二进制体引用</a> 对象，定义存储了属性值的二进制体部分的引用。查看相应属性的定义<a href="#语法" class="self">语法</a>          | No                     |
| **BATCH_ID**                | `object`                           | <a href="#r二进制体引用" class="self">二进制体引用</a> 对象，定义存储了属性值的二进制体部分的引用。查看相应属性的定义<a href="#语法" class="self">语法</a>          | No                     |
| **INSTANCES_LENGTH**        | `object`, `number` `[1]`, `number` | <a href="#r全局标量属性" class="self">全局标量属性</a> 对象，定义所有要素的数量。查看相应属性的定义<a href="#语法" class="self">语法</a>                            | :white_check_mark: Yes |
| **RTC_CENTER**              | `object`, `number` `[3]`           | <a href="#r全局笛卡尔坐标系属性" class="self">全局笛卡尔坐标系属性</a> 对象，定义所有要素的 3 部分数值属性。查看相应属性的定义<a href="#语法" class="self">语法</a> | No                     |
| **QUANTIZED_VOLUME_OFFSET** | `object`, `number` `[3]`           | <a href="#r全局笛卡尔坐标系属性" class="self">全局笛卡尔坐标系属性</a> 对象，定义所有要素的 3 部分数值属性。查看相应属性的定义<a href="#语法" class="self">语法</a> | No                     |
| **QUANTIZED_VOLUME_SCALE**  | `object`, `number` `[3]`           | <a href="#r全局笛卡尔坐标系属性" class="self">全局笛卡尔坐标系属性</a> 对象，定义所有要素的 3 部分数值属性。查看相应属性的定义<a href="#语法" class="self">语法</a> | No                     |
| **EAST_NORTH_UP**           | `boolean`                          | <a href="#r全局布尔属性" class="self">全局布尔属性</a> 对象，定义所有要素的布尔值属性。查看相应属性的定义<a href="#语法" class="self">语法</a>                      | No                     |

允许其他属性。

---

<a id="r二进制体引用" name="r二进制体引用"></a>

### 二进制体引用

一个对象，用于定义对要素表的二进制主体部分的引用，如果未在 JSON 中直接定义属性值，则在该部分存储属性值。

|                | 类型     | 描述                           | 是否必须               |
| -------------- | -------- | ------------------------------ | ---------------------- |
| **byteOffset** | `number` | 缓冲区的偏移量（以字节为单位） | :white_check_mark: Yes |

允许其他属性。

---

<a id="r全局笛卡尔坐标系属性" name="r全局笛卡尔坐标系属性"></a>

### 全局笛卡尔坐标系属性

为所有要素定义全局 3 组分数值属性值的对象。

---

<a id="r全局标量属性" name="r全局标量属性"></a>

### 全局标量属性

为所有要素定义全局数值属性值的对象。

---

<a id="r全局布尔属性" name="r全局布尔属性"></a>

### 全局布尔属性

为所有要素定义全局布尔属性值的对象。

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

---

_版权声明：_
_除非注明，本博文章均为原创，转载请以链接形式标明本文地址。_

---
