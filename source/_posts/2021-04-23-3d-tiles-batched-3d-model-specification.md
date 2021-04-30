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

  - <a href="#结构填充" class="self">结构填充</a>

- <a href="#文件头" class="self">文件头</a>
- <a href="#要素表" class="self">要素表</a>

  - <a href="#语法定义" class="self">语法定义</a>
    - <a href="#要素语法" class="self">要素语法</a>
    - <a href="#全局语法" class="self">全局语法</a>

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

`批处理 3D 模型`允许离线批处理混合的 3D 模型（例如城市中的各个建筑物），高效地以流式传输到 Web 客户端进行渲染和交互。在单个请求中传输多个模型，并使用最少数量的 WebGL 调用来渲染以提供高效率。使用 3D Tiles core 规范语言，每个模型都是一个要素。

每个模型的属性（例如 ID）都可以在运行时识别和更新，例如显示/隐藏，高亮颜色等。属性可以用于通过 Web 服务查询访问元数据，例如传递建筑物的 ID 以获取其地址，动态修改引用的属性以更改模型的外观，基于属性值更改高亮颜色等等。

批处理 3D 模型数据是小端字节序的二进制 Blob。

---

<a id="文件结构" name="文件结构"></a>

## 文件结构

数据由两部分组成：文件头和紧随其后的主体。下图显示了“批处理 3D 模型”文件结构（虚线表示可选字段）：

![](https://gitee.com/Jackie_Tang/Jackie_Tang/raw/master/my_images/2021-04/3d-tiles/layout.png)

<a id="结构填充" name="结构填充"></a>

### 结构填充

数据 `byteLength` 必须以 8 个字节进行边界对齐。包含的[要素表(Feature Table)](/2021/04/23/3d-tiles-feature-table-specification#结构填充)和[批处理表(Batch Table)](/2021/04/23/3d-tiles-batch-table-specification#结构填充)必须符合其各自的填充要求。

<a href="#二进制glTF" class="self">二进制 glTF</a> 的开始和结束位置必须以 8 个字节进行边界对齐，以便满足 glTF 的字节对齐要求。这可以通过填充功能表或批处理表（如果存在）来实现。

---

<a id="文件头" name="文件头"></a>

## 文件头

28 字节的文件头包含以下字段：

| 字段名                         | 数据类型           | 描述                                                                                       |
| ------------------------------ | ------------------ | ------------------------------------------------------------------------------------------ |
| `magic`                        | 4-byte ANSI string | `"b3dm"`. 用于标识为“批处理 3D 模型”                                                       |
| `version`                      | `uint32`           | 版本。现在是`1`                                                                            |
| `byteLength`                   | `uint32`           | 整个数据的长度（包括文件头），以字节为单位                                                 |
| `featureTableJSONByteLength`   | `uint32`           | 要素表 JSON 部分的长度（以字节为单位）                                                     |
| `featureTableBinaryByteLength` | `uint32`           | 要素表二进制部分的长度（以字节为单位）                                                     |
| `batchTableJSONByteLength`     | `uint32`           | 批处理表 JSON 部分的长度（以字节为单位）。零表示没有批处理表                               |
| `batchTableBinaryByteLength`   | `uint32`           | 批处理表二进制部分的长度（以字节为单位）。如果`batchTableJSONByteLength`为零，则也将为零。 |

文件主体部分紧跟着文件头，并且由三个字段组成：`Feature Table`，`Batch Table`，和`Binary glTF`。

---

<a id="要素表" name="要素表"></a>

## 要素表

包含`b3dm`语法。

[要素表(Feature Table)](/2021/04/23/3d-tiles-feature-table-specification) 查看更多信息。

<a href="#属性参考" class="self">属性参考</a> 查看 `b3dm` 要素表的更多参考。

完整 [JSON](https://github.com/CesiumGS/3d-tiles/blob/master/specification/schema/b3dm.featureTable.schema.json) 定义：

```json
{
  "$schema": "http://json-schema.org/draft-04/schema",
  "id": "b3dm.featureTable.schema.json",
  "title": "Batched 3D Model Feature Table",
  "type": "object",
  "description": "A set of Batched 3D Model semantics that contain additional information about features in a tile.",
  "allOf": [
    {
      "$ref": "featureTable.schema.json"
    },
    {
      "properties": {
        "BATCH_LENGTH": {
          "description": "A `GlobalPropertyScalar` object defining a numeric property for all features. See the corresponding property semantic in [Semantics](/specification/TileFormats/Batched3DModel/README.md#semantics).",
          "allOf": [
            {
              "$ref": "featureTable.schema.json#/definitions/globalPropertyScalar"
            }
          ]
        },
        "RTC_CENTER": {
          "description": "A `GlobalPropertyCartesian3` object defining a 3-component numeric property for all features. See the corresponding property semantic in [Semantics](/specification/TileFormats/Batched3DModel/README.md#semantics).",
          "allOf": [
            {
              "$ref": "featureTable.schema.json#/definitions/globalPropertyCartesian3"
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
      "required": ["BATCH_LENGTH"]
    }
  ]
}
```

<a id="语法定义" name="语法定义"></a>

### 语法定义

<a id="要素语法" name="要素语法"></a>

#### 要素语法

当前没有按要素的语法。

---

<a id="全局语法" name="全局语法"></a>

#### 全局语法

以下语法定义了所有要素的全局属性。

| 语法           | 数据类型     | 描述                                                                                                  | 是否必须                |
| -------------- | ------------ | ----------------------------------------------------------------------------------------------------- | ----------------------- |
| `BATCH_LENGTH` | `uint32`     | 数据中可区分模型（要素）的数量。如果 Binary glTF 没有`batchId`属性，则此字段必须为`0`。               | :white_check_mark: Yes. |
| `RTC_CENTER`   | `float32[3]` | 当位置相对于中心定义时，由三维数组定义的中心位置（请参阅<a href="#坐标系" class="self">坐标系</a>）。 | :red_circle: No.        |

---

<a id="批处理表" name="批处理表"></a>

## 批处理表

`批处理表`包含每一模型的应用特定属性，通过`batchId`索引，可被用于[声明样式](/2021/04/23/3d-tiles-styling-specification)和应用特定的使用，如填充 UI 或者进行 REST API 请求。在二进制 glTF 部分，每个顶点都有一个 `batchId` 的数值属性，整型数组范围内[0, number of models in the batch - 1]。`batchId` 指示该顶点所属的模型。这样可以将模型整合在一起（batched together），并且仍然可以识别。

更多相关信息，请参见[批处理表(Batch Table)](/2021/04/23/3d-tiles-batch-table-specification)。

---

<a id="二进制glTF" name="二进制glTF"></a>

## 二进制 glTF

批处理 3D 模型嵌入了包含模型几何和纹理信息的[glTF 2.0](https://github.com/KhronosGroup/glTF/tree/master/specification/2.0)。

[二进制 glTF](https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#binary-gltf-layout) 紧随要素表和批处理表。它可能嵌入了其所有的几何，纹理和动画，或者可能引用了某些或所有这些数据的外部来源。

如上所述，每个顶点具有 `batchId` 指示其所属模型的属性。例如，具有三个模型的批处理的顶点可能看起来像这样：

```
batchId:  [0,   0,   0,   ..., 1,   1,   1,   ..., 2,   2,   2,   ...]
position: [xyz, xyz, xyz, ..., xyz, xyz, xyz, ..., xyz, xyz, xyz, ...]
normal:   [xyz, xyz, xyz, ..., xyz, xyz, xyz, ..., xyz, xyz, xyz, ...]
```

顶点是必须以`batchId`排序的，因此以下形式也可以：

```
batchId:  [0,   1,   2,   ..., 2,   1,   0,   ..., 1,   2,   0,   ...]
position: [xyz, xyz, xyz, ..., xyz, xyz, xyz, ..., xyz, xyz, xyz, ...]
normal:   [xyz, xyz, xyz, ..., xyz, xyz, xyz, ..., xyz, xyz, xyz, ...]
```

注意，一个顶点不能属于多个模型。在这种情况下，需要复制顶点，以便`batchId`s 可以分配。

`batchId` 参数是在 glTF [图元](https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#reference-primitive)中通过设置`_BATCHID `属性定义的，`batchId`的值对应 [accessor](https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#accessors) 的顺序索引。例如，

```json
"primitives": [
    {
        "attributes": {
            "_BATCHID": 0
        }
    }
]
```

```json
{
  "accessors": [
    {
      "bufferView": 1,
      "byteOffset": 0,
      "componentType": 5126,
      "count": 4860,
      "max": [2],
      "min": [0],
      "type": "SCALAR"
    }
  ]
}
```

`accessor.type`的值必须是`"SCALAR"`。所有其他属性必须符合 glTF 模式，但没有其他额外要求。

当批处理表存在或`BATCH_LENGTH`属性大于`0`时，`_BATCHID`属性为必填；否则，可以不填。

---

<a id="坐标系" name="坐标系"></a>

### 坐标系

默认情况下，嵌入式 glTF 使用右手坐标系，其中 y 轴朝上。为了与 3D Tiles 的 z 向上坐标系保持一致，必须在运行时转换 glTF。详细信息，请参考[glTF 转换](/2021/04/21/3d-tiles-specification/#glTF%E5%8F%98%E6%8D%A2%EF%BC%88glTFtransforms%EF%BC%89)。

可以相对于中心定义顶点位置以进行高精度渲染，请参见[Precisions,Precisions](http://help.agi.com/AGIComponents/html/BlogPrecisionsPrecisions.htm)。如果定义，则 `RTC_CENTER` 指定在应用坐标系变换和 glTF 节点层次结构变换之后，所有顶点位置都相对于其的中心位置。

---

<a id="扩展名和MIME类型" name="扩展名和MIME类型"></a>

## 扩展名和 MIME 类型

批处理 3D 模型数据使用`.b3dm`扩展名和`application/octet-stream`的 MIME 类型。

显式文件扩展名是可选的。有些实现可能会忽略它，并通过 `magic` 其标头中的字段标识内容的格式。

---

<a id="实例" name="实例"></a>

## 实例

_本节是非规范性的_

可以在 CesiumJS 的 3D Tiles 实现中找到读取文件头的代码 [Batched3DModelTileContent.js](https://github.com/CesiumGS/cesium/blob/master/Source/Scene/Batched3DModel3DTileContent.js) 。

---

<a id="属性参考" name="属性参考"></a>

## 属性参考

- <a href="#r批处理3D模型要素表" class="self">批处理 3D 模型要素表</a>
  - <a href="#r二进制体引用" class="self">二进制体引用</a>
  - <a href="#r全局笛卡尔坐标系属性" class="self">全局笛卡尔坐标系属性</a>
  - <a href="#r全局标量属性" class="self">全局标量属性</a>
  - <a href="#r属性" class="self">属性</a>

---

<a id="r批处理3D模型要素表" name="r批处理3D模型要素表"></a>

### 批处理 3D 模型要素表

一组批处理 3D 模型定义，其中包含有关数据中要素的额外信息。

|                  | 类型                               | 描述                                                                                                                                                                 | 是否必须               |
| ---------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| **extensions**   | `object`                           | 扩展特定的字典对象                                                                                                                                                   | No                     |
| **extras**       | `any`                              | 应用程序特定数据                                                                                                                                                     | No                     |
| **BATCH_LENGTH** | `object`, `number` `[1]`, `number` | 一个<a href="#r全局标量属性" class="self">`全局标量属性`</a>对象定义所有要素得数据属性，查看相应<a href="#语法定义" class="self">语法定义</a>                        | :white_check_mark: Yes |
| **RTC_CENTER**   | `object`, `number` `[3]`           | 一个<a href="#r全局笛卡尔坐标系属性" class="self">`全局笛卡尔坐标系属性`</a>对象定义的所有要素的 3 个数值属性，查看相应<a href="#语法定义" class="self">语法定义</a> | No                     |

允许其他属性。

---

<a id="r二进制体引用" name="r二进制体引用"></a>

#### 二进制体引用

一个对象，定义对要素表的二进制主体的引用部分，如果未在 JSON 中直接定义属性值，则在该部分储存。

|                | 类型     | 描述                           | 是否必须               |
| -------------- | -------- | ------------------------------ | ---------------------- |
| **byteOffset** | `number` | 缓冲区的偏移量（以字节为单位） | :white_check_mark: Yes |

允许其他属性。

---

<a id="r全局笛卡尔坐标系属性" name="r全局笛卡尔坐标系属性"></a>

#### 全局笛卡尔坐标系属性

定义所有要素的全局三维数组属性对象。

---

<a id="r全局标量属性" name="r全局标量属性"></a>

#### 全局标量属性

定义所有要素的全局数值属性对象。

---

<a id="r属性" name="r属性"></a>

#### 属性

用户自定义的属性，用来在数据中指定每个要素的应用程序特定的元数据。值可以直接在 JSON 中定义为数组，也可以引用<a href="#r二进制体引用" class="self">二进制体</a>中的部分。

---

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
