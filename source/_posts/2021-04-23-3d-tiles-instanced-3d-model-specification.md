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

<a id="语法" name="语法"></a>

### 语法

<a id="实例语法" name="实例语法"></a>

### 实例语法

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

### 全局语法

---

<a id="批处理表" name="批处理表"></a>

## 批处理表

---

<a id="glTF" name="glTF"></a>

## glTF

---

<a id="属性参考" name="属性参考"></a>

## 属性参考

---

_版权声明：_
_除非注明，本博文章均为原创，转载请以链接形式标明本文地址。_

---
