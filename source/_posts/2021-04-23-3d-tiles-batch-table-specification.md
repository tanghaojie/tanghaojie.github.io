---
title: 3D Tiles批处理表(Batch Table)数据格式标准规范
top: false
cover: false
toc: true
mathjax: false
comment: true
date: 2021-04-23 21:45:35
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
  - <a href="#JSON头" class="self">JSON 头</a>
  - <a href="#二进制体" class="self">二进制体</a>
- <a href="#实例" class="self">实例</a>
- <a href="#属性参考" class="self">属性参考</a>

---

<a id="引" name="引"></a>

## 引

[官网文档](https://github.com/CesiumGS/3d-tiles/tree/master/specification/TileFormats/BatchTable)

<a id="概述" name="概述"></a>

## 概述

`批处理表`是瓦片二进制体的一个组成部分，包含瓦片中每个要素的应用程序特定属性。在运行时查询这些属性以声明样式和任何应用程序特定的用法，例如填充 UI 或发出 REST API 请求。一些示例批处理表属性是建筑物高度，地理坐标和数据库主键。

批处理表用于以下数据格式：

- [批处理 3D 模型 (Batched 3D Model (b3dm))](/2021/04/23/3d-tiles-batched-3d-model-specification)
- [实例 3D 模型 (Instanced 3D Model (i3dm))](/2021/04/23/3d-tiles-instanced-3d-model-specification)
- [点云 (Point Cloud (pnts))](/2021/04/23/3d-tiles-point-cloud-specification)

---

<a id="文件结构" name="文件结构"></a>

## 文件结构

批处理表由两部分组成：JSON 头和可选的小端字节序二进制主体。JSON 描述了属性，这些属性的值可以直接在 JSON 中定义为数组，也可以引用二进制主体中的部分。将长数字数组存储在二进制体中的效率更高。下图显示了批处理表布局：

![](https://jackie_tang.gitee.io/pic_cloud/2021-04/3d-tiles/batch-table-layout.png)

当瓦片数据包含批处理表时，批处理表将紧随瓦片的要素表之后。文件头还将包含 `batchTableJSONByteLength` 和 `batchTableBinaryByteLength` 的 `uint32` 字段，可用于提取批处理表的各个部分。

---

<a id="结构填充" name="结构填充"></a>

### 结构填充

JSON 头必须以 8 个字节为界结束，否则，在 JSON 头尾部填充空格（`0x20`）以满足此要求。

二进制体必须以 8 个字节为界开始和结束。为了满足此要求，可以用任意值填充空白部分。

二进制属性必须以一个字节偏移量开始，该字节偏移量是必须是属性隐含类型大小的倍数。例如，组件的某个元素有 4 个字节长度的属性 `FLOAT` ，因此必须以 4 的倍数计算偏移量。为了满足此要求，可以用任意值填充空白部分。

---

<a id="JSON头" name="JSON头"></a>

### JSON 头

批处理表值可以两种不同的方式在 JSON 标头中表示：

1. 值的数组，例如，`"name" : ['name1', 'name2', 'name3']`或`"height" : [10.0, 20.0, 15.0]`。

   - 数组元素可以是任何有效的 JSON 数据类型，包括对象和数组。元素可能是`null`。

   - 每个数组的长度等于 `batchLength`，以每种数据格式指定。这是数据中要素的数量。例如，`batchLength` 可以是 b3dm 数据中的模型数，i3dm 数据中的实例数，或 pnts 数据中的点数（或对象数）。

2. 引用数据的二进制体，通过`byteOffset`表示对象，`componentType` 和 `type` 属性，例如，`"height" : { "byteOffset" : 24, "componentType" : "FLOAT", "type" : "SCALAR"}`。
   - `byteOffset` 指定相对于二进制主体从零开始的偏移量。 `byteOffset` 的值必须是该属性`componentType`字节大小的倍数 ，例如，属性具有组件类型 `FLOAT` 的 `byteOffset` 的值必须是`4`的倍数。
   - `componentType` 是组件特定的数据类型。允许的值是`"BYTE"`，`"UNSIGNED_BYTE"`，`"SHORT"`，`"UNSIGNED_SHORT"`，`"INT"`，`"UNSIGNED_INT"`，`"FLOAT"`，和`"DOUBLE"`。
   - `type` 指定属性是标量还是向量。允许的值是`"SCALAR"`，`"VEC2"`，`"VEC3"`，和`"VEC4"`。

批处理表 JSON 是 `UTF-8` 的 JSON 字符串。

> 注意：在 JavaScript 中，可以使用`ArrayBuffer`的`TextDecoder`JavaScript API 来提取 Batch Table JSON，并使用`JSON.parse`转换为 JavaScript 对象。

`batchId`用于访问每个数组中的元素并提取相应的属性。例如，以下批处理表有两个要素的一批属性：

```json
{
  "id": ["unique id", "another unique id"],
  "displayName": ["Building name", "Another building name"],
  "yearBuilt": [1999, 2015],
  "address": [
    { "street": "Main Street", "houseNumber": "1" },
    { "street": "Main Street", "houseNumber": "2" }
  ]
}
```

要素`batchId = 0`的属性是：

```javascript
id[0] = 'unique id'
displayName[0] = 'Building name'
yearBuilt[0] = 1999
address[0] = { street: 'Main Street', houseNumber: '1' }
```

要素`batchId = 1`的属性是：

```javascript
id[1] = 'another unique id'
displayName[1] = 'Another building name'
yearBuilt[1] = 2015
address[1] = { street: 'Main Street', houseNumber: '2' }
```

完整的 JSON 头定义，详见<a href="#属性参考" class="self">属性参考</a>。以下是一个完整的 JSON 格式。

<a id="JSONSchema" name="JSONSchema"></a>

[JSON:](hhttps://github.com/CesiumGS/3d-tiles/blob/master/specification/schema/batchTable.schema.json)

```json
{
  "$schema": "http://json-schema.org/draft-04/schema",
  "id": "batchTable.schema.json",
  "title": "Batch Table",
  "type": "object",
  "description": "A set of properties defining application-specific metadata for features in a tile.",
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
  },
  "definitions": {
    "binaryBodyReference": {
      "title": "BinaryBodyReference",
      "type": "object",
      "description": "An object defining the reference to a section of the binary body of the batch table where the property values are stored if not defined directly in the JSON.",
      "properties": {
        "byteOffset": {
          "type": "number",
          "description": "The offset into the buffer in bytes.",
          "minimum": 0
        },
        "componentType": {
          "type": "string",
          "description": "The datatype of components in the property.",
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
        },
        "type": {
          "type": "string",
          "description": "Specifies if the property is a scalar or vector.",
          "enum": ["SCALAR", "VEC2", "VEC3", "VEC4"]
        }
      },
      "required": ["byteOffset", "componentType", "type"]
    },
    "property": {
      "title": "Property",
      "description": "A user-defined property which specifies per-feature application-specific metadata in a tile. Values either can be defined directly in the JSON as an array, or can refer to sections in the binary body with a `BinaryBodyReference` object.",
      "oneOf": [
        { "$ref": "#/definitions/binaryBodyReference" },
        { "type": "array" }
      ]
    }
  }
}
```

---

<a id="二进制体" name="二进制体"></a>

### 二进制体

当 JSON 头包含对二进制部分的引用时，所提供的 `byteOffset` 用于索引数据，如下图所示：

![](https://jackie_tang.gitee.io/pic_cloud/2021-04/3d-tiles/batch-table-binary-index.png)

可以使用要素长度来数据值`batchLength`；所需的批量表 ID`batchId`; `componentType` 和 `type` 定义在 JSON 头中。

下表可用于计算属性的字节大小。

| `componentType`    | 字节大小 |
| ------------------ | -------- |
| `"BYTE"`           | 1        |
| `"UNSIGNED_BYTE"`  | 1        |
| `"SHORT"`          | 2        |
| `"UNSIGNED_SHORT"` | 2        |
| `"INT"`            | 4        |
| `"UNSIGNED_INT"`   | 4        |
| `"FLOAT"`          | 4        |
| `"DOUBLE"`         | 8        |

<br>

| `type`     | 部件数 |
| ---------- | ------ |
| `"SCALAR"` | 1      |
| `"VEC2"`   | 2      |
| `"VEC3"`   | 3      |
| `"VEC4"`   | 4      |

---

<a id="扩展" name="扩展"></a>

## 扩展

以下扩展可以应用于批处理表。

[3DTILES_batch_table_hierarchy](https://github.com/CesiumGS/3d-tiles/tree/master/extensions/3DTILES_batch_table_hierarchy)

---

<a id="实例" name="实例"></a>

## 实例

_本节是非规范性的_

以下示例访问批处理表 JSON 的`"height"`和`"geographic"`的值`batchLength`的长度是 10：

```json
{
  "height": {
    "byteOffset": 0,
    "componentType": "FLOAT",
    "type": "SCALAR"
  },
  "geographic": {
    "byteOffset": 40,
    "componentType": "DOUBLE",
    "type": "VEC3"
  }
}
```

获得`"height"`的值：

```javascript
var height = batchTableJSON.height
var byteOffset = height.byteOffset
var componentType = height.componentType
var type = height.type

var heightArrayByteLength =
  batchLength * sizeInBytes(componentType) * numberOfComponents(type) // 10 * 4 * 1
var heightArray = new Float32Array(
  batchTableBinary.buffer,
  byteOffset,
  heightArrayByteLength
)
var heightOfFeature = heightArray[batchId]
```

获得`"geographic"`的值：

```javascript
var geographic = batchTableJSON.geographic
var byteOffset = geographic.byteOffset
var componentType = geographic.componentType
var type = geographic.type
var componentSizeInBytes = sizeInBytes(componentType)
var numberOfComponents = numberOfComponents(type)

var geographicArrayByteLength =
  batchLength * componentSizeInBytes * numberOfComponents // 10 * 8 * 3
var geographicArray = new Float64Array(
  batchTableBinary.buffer,
  byteOffset,
  geographicArrayByteLength
)
var geographicOfFeature = positionArray.subarray(
  batchId * numberOfComponents,
  batchId * numberOfComponents + numberOfComponents
) // Using subarray creates a view into the array, and not a new array.
```

CesiumJS 的 3D Tiles 实现了读取批量表的功能，[Cesium3DTileBatchTable.js](https://github.com/CesiumGS/cesium/blob/master/Source/Scene/Cesium3DTileBatchTable.js)。

---

<a id="属性参考" name="属性参考"></a>

## 属性参考

<a href="#r批处理表" class="self">批处理表</a>
<a href="#r二进制体引用" class="self">二进制体引用</a>
<a href="#r属性" class="self">属性</a>

---

<a id="r批处理表" name="r批处理表"></a>

### 批处理表

一组属性，用于定义数据中要素的应用程序特定元数据。

|                | 类型     | 描述                   | 是否必须 |
| -------------- | -------- | ---------------------- | -------- |
| **extensions** | `object` | 特定扩展对象的字典对象 | No       |
| **extras**     | `any`    | 应用程序的特定数据     | No       |

允许其他属性。

---

<a id="r二进制体引用" name="r二进制体引用"></a>

### 二进制体引用

一个对象，用于定义对要素表的二进制主体部分的引用，如果未在 JSON 头中直接定义属性值，则在该部分存储。

|                   | 类型     | 描述                           | 是否必须               |
| ----------------- | -------- | ------------------------------ | ---------------------- |
| **byteOffset**    | `number` | 缓冲区的偏移量（以字节为单位） | :white_check_mark: Yes |
| **componentType** | `string` | 属性所属部分的数据类型         | :white_check_mark: Yes |
| **type**          | `string` | 指定属性是标量还是向量         | :white_check_mark: Yes |

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
