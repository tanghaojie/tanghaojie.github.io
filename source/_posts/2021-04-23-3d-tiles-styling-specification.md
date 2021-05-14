---
title: 3D Tiles样式数据格式标准规范
top: false
cover: false
toc: true
mathjax: false
comment: true
date: 2021-04-23 22:10:34
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

- <a href="#概念" class="self">概念</a>
  - <a href="#要素样式" class="self">要素样式</a>

---

<a id="引" name="引"></a>

## 引

[官网文档](https://github.com/CesiumGS/3d-tiles/tree/master/specification/Styling)

---

<a id="概述" name="概述"></a>

## 概述

3D Tiles 样式为 tileset 要素提供了简洁的声明式样式。样式通常基于存储在图块的[批处理表(Batch Table)](/2021/04/23/3d-tiles-batch-table-specification)中的特征属性来定义表达式，以评定要素的显示表达，例如 `color`（RGB 和半透明）和 `show` 属性。

样式可以应用于不包含要素的图块，在这种情况下，图块被视为没有属性的隐式单个要素。

尽管可以为数据集创建样式并参考数据集的属性，但是样式独立于数据集，因此任何样式都可以应用于任何数据集。

样式使用 JSON 定义，并使用一部分 JavaScript 的表达式进行了增强扩展。此外，样式语言提供了一组内置函数来支持常见的数学运算。

以下示例根据建筑物高度分配颜色。

```json
{
  "show": "${Area} > 0",
  "color": {
    "conditions": [
      ["${Height} < 60", "color('#13293D')"],
      ["${Height} < 120", "color('#1B98E0')"],
      ["true", "color('#E8F1F2', 0.5)"]
    ]
  }
}
```

![](https://jackie_tang.gitee.io/pic_cloud/2021-04/3d-tiles/example.png)

---

<a id="概念" name="概念"></a>

## 概念

<a id="要素样式" name="要素样式"></a>

### 要素样式

用于要素样式的视觉属性是 `show` 属性，该属性的赋值表达式将评估为确定要素是否可见的布尔值，而 `color` 属性的赋值表达式将赋值为一个 `Color` 对象（RGB 和半透明）的属性来确定要素显示的颜色。

以下样式将默认的显示和颜色属性分配给每个要素：

```json
{
  "show": "true",
  "color": "color('#ffffff')"
}
```

`show`可以依赖于要素属性的表达式进行显示，而不是显示所有要素，例如，以下表达式将仅显示 zip code 为 19341 的要素：

```json
{
  "show": "${ZipCode} === '19341'"
}
```

`show`也可以用于更复杂的查询；例如，此处使用复合条件和正则表达式来仅显示`County`以`'Chest'`开始，且其`YearBuilt`大于或等于 1970 的要素：

```json
{
  "show": "(regExp('^Chest').test(${County})) && (${YearBuilt} >= 1970)"
}
```

颜色也可以通过要素属性的表达式来定义。例如，以下表达式为温度高于 90 的特征为红色，其余为白色：

```json
{
  "color": "(${Temperature} > 90) ? color('red') : color('white')"
}
```

颜色的 Alpha 部分定义了要素的不透明度。例如，以下内容根据要素的属性设置要素的 RGB 颜色部分，并使体积大于 100 的要素透明：

```json
{
  "color": "rgba(${red}, ${green}, ${blue}, (${volume} > 100 ? 0.5 : 1.0))"
}
```

**未完待续**

---

<a id="" name=""></a>

##

---

_版权声明：_
_除非注明，本博文章均为原创，转载请以链接形式标明本文地址。_

---
