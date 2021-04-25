---
title: 3D Tiles要素表(Feature Table)数据格式标准规范
top: false
cover: false
toc: true
mathjax: false
comment: true
date: 2021-04-23 21:45:23
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
  - <a href="#结构" class="self">结构</a>
  - <a href="#JSON头" class="self">JSON 头</a>
  - <a href="#二进制体" class="self">二进制体</a>
- <a href="#实例" class="self">实例</a>
- <a href="#属性参考" class="self">属性参考</a>

---

<a id="引" name="引"></a>

## 引

[官网文档](https://github.com/CesiumGS/3d-tiles/tree/master/specification/TileFormats/FeatureTable)

---

<a id="概述" name="概述"></a>

## 概述

`要素表(Feature Table)`是瓦片的实例二进制组件，用户描述每一个瓦片在 **渲染** 时的位置和外观属性。而`批处理表(Batch Table)`，只用于包含应用程序特定的 **属性**，在渲染时不是必须的。

要素表可以被所有瓦片格式使用，例如[批处理 3D 模型 (Batched 3D Model (b3dm))](/2021/04/23/3d-tiles-batched-3d-model-specification)，每一个模型是一个要素；[点云 (Point Cloud (pnts))](/2021/04/23/3d-tiles-point-cloud-specification)，每一个点是一个要素。

每个要素的属性是由每种数据格式规范所定义的特定语法。例如，实例 3D 模型，`SCALE_NON_UNIFORM` 定义每个 3D 模型实例的非均匀比例。

---

<a id="文件结构" name="文件结构"></a>

## 文件结构

要素表由两部分组成：JSON 头和可选的小端字节序二进制主体。JSON 属性名称是数据格式特定的语法，并且它们的值可以直接在 JSON 中定义，也可以引用二进制主体部分。将长数字数组存储在二进制体中的效率更高。下图显示了要素表布局：

![](https://gitee.com/Jackie_Tang/Jackie_Tang/raw/master/my_images/2021-04/3d-tiles/feature-table-layout.png)

当一种数据包括要素表时，要素表紧随在若干个字节的文件头后。文件头还要包含 `featureTableJSONByteLength` 和 `featureTableBinaryByteLength` 的 `uint32` 字段，可用于表示要素表的各个部分。

---

<a id="结构" name="结构"></a>

### 结构

JSON 头必须以 8 个字节为界结束，否则，在 JSON 头尾部填充空格（`0x20`）以满足此要求。

二进制体必须以 8 个字节为界开始和结束。为了满足此要求，可以用任意值填充空白部分。

二进制属性必须以一个字节偏移量开始，该字节偏移量是必须是属性隐含类型大小的倍数。例如，组件的某个元素有 4 个字节长度的属性 `FLOAT` ，因此必须以 4 的倍数计算偏移量。为了满足此要求，可以用任意值填充空白部分。

_这里如果看不懂，先把后面看完再回头来看，应该就懂了。_

---

<a id="JSON头" name="JSON头"></a>

### JSON 头

可以通过以下三种方式在 JSON 标中表示要素表的值：

1. 单个值或对象，如，`"INSTANCES_LENGTH": 4`。

   - 这用于全局定义，如，`"INSTANCES_LENGTH"`，它定义了实例化 3D 模型数据中的模型实例数。

2. 数组，如，`"POSITION" : [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]`。

   - 这用于按要素定义，如，实例 3D 模型中的`"POSITION"`。如上面的数组，每个都 `POSITION` 对应 `float32[3]` 数据类型，因此有三个要素：`要素 0's position= (1.0, 0.0, 0.0)`，`要素 1's position= (0.0, 1.0, 0.0)`，`要素 2's position= (0.0, 0.0, 1.0)`。

3. 一个指向二进制体中数据的引用，由具有 `byteOffset` 属性的对象表示，例如`"SCALE" : { "byteOffset" : 24}`。

   - `byteOffset` 指定相对于二进制体从零开始的偏移量。`byteOffset` 的值必须是属性隐含类型大小（以字节为单位）的倍数，例如，`"POSITION"`属性的数据类型是 `FLOAT`（4 个字节），因此 `byteOffset`的值必须是 4 的倍数 。

   - 语法定义了允许的数据类型。例如，实例 3D 模型的`"POSITION"`属性从二进制体中引用时，属性类型为`FLOAT`，属性长度为`3`。

   - 有些语法允许覆盖（override）属性隐含的类型。这些情况以每种图块格式指定，如，`"BATCH_ID" : { "byteOffset" : 24, "componentType" : "UNSIGNED_BYTE"}`。JSON 头中有效的属性是各个数据格式预定义的，以及可选的 `extras` 和 `extensions` 属性。应用程序特定的数据应存储在批处理表(Batch Table)中。

完整的 JSON 头定义，详见<a href="#属性参考" class="self">属性参考</a>。以下是一个完整的 JSON 格式。

<a id="JSONSchema" name="JSONSchema"></a>

[JSON:](https://github.com/CesiumGS/3d-tiles/blob/master/specification/schema/featureTable.schema.json)

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

<a id="二进制体" name="二进制体"></a>

### 二进制体

当 JSON 头包含对二进制文件的引用时，所提供的`byteOffset`内容将用于索引数据。下图显示了如何在要素表二进制体中索引数据：

![](https://gitee.com/Jackie_Tang/Jackie_Tang/raw/master/my_images/2021-04/3d-tiles/feature-table-binary-index.png)

使用要素数量来检索值,`featuresLength`；要素 ID,`featureId`；以及要素定义的其他数据类型（属性类型和长度）。

---

<a id="实例" name="实例"></a>

## 实例

_本节是非规范性的_

以下示例使用`POSITION`访问 position 属性，`POSITION`是`float32[3]`的类型：

```javascript
var byteOffset = featureTableJSON.POSITION.byteOffset

var positionArray = new Float32Array(
  featureTableBinary.buffer,
  byteOffset,
  featuresLength * 3
) // There are three components for each POSITION feature.
var position = positionArray.subarray(featureId * 3, featureId * 3 + 3) // Using subarray creates a view into the array, and not a new array.
```

CesiumJS 的 3D Tiles 实现了读取要素表的功能，[Cesium3DTileFeatureTable.js](https://github.com/CesiumGS/cesium/blob/master/Source/Scene/Cesium3DTileFeatureTable.js)。

---

<a id="属性参考" name="属性参考"></a>

## 属性参考

<a href="#r要素表" class="self">要素表</a>

- <a href="#r二进制体引用" class="self">二进制体引用</a>
- <a href="#r属性" class="self">属性</a>

---

<a id="r要素表" name="r要素表"></a>

### 要素表

一组语法定义，用于为瓦片中的要素提供每个瓦片每个要素的位置和属性的定义。

|                | 类型     | 描述                       | 是否必须 |
| -------------- | -------- | -------------------------- | -------- |
| **extensions** | `object` | 具有扩展特定对象的字典对象 | No       |
| **extras**     | `any`    | 应用特定数据               | No       |

允许其他属性。

---

<a id="r二进制体引用" name="r二进制体引用"></a>

### 二进制体引用

一个对象，用于定义对要素表的二进制主体部分的引用，如果未在 JSON 头中直接定义属性值，则在该部分存储。

|                | 类型     | 描述                           | 是否必须               |
| -------------- | -------- | ------------------------------ | ---------------------- |
| **byteOffset** | `number` | 缓冲区的偏移量（以字节为单位） | :white_check_mark: Yes |

允许其他属性。

---

<a id="r属性" name="r属性"></a>

### 属性

用户定义的属性，用于在数据中指定每个功能的特定于应用程序的元数据。值可以直接在 JSON 中定义为数组，也可以使用 <a href="#r二进制体引用" class="self">`二进制体引用`</a> 对象引用二进制主体中的部分。

JSON 参考，<a href="#JSONSchema" class="self">见上面</a>。

---

---

_版权声明：_
_除非注明，本博文章均为原创，转载请以链接形式标明本文地址。_

---
