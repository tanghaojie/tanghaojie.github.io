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
  - <a href="#条件表达式" class="self">条件表达式</a>
  - <a href="#定义变量" class="self">定义变量</a>
  - <a href="#元属性" class="self">元属性</a>
- <a href="#表达式" class="self">表达式</a>
  - <a href="#语法" class="self">语法</a>
  - <a href="#运算符" class="self">运算符</a>
  - <a href="#数据类型" class="self">数据类型</a>
    - <a href="#Number" class="self">Number</a>
    - <a href="#String" class="self">String</a>
    - <a href="#vec" class="self">vec</a>
    - <a href="#Color" class="self">Color</a>
    - <a href="#RegExp" class="self">RegExp</a>

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

---

<a id="条件表达式" name="条件表达式"></a>

### 条件表达式（Conditions）

除了包含表达式的字符串外，`color`和`show`可以定义一系列条件的数组（类似于`if...else`语句）。例如，可以使用条件制作具有任何类型的包含/排除间隔的颜色图和颜色渐变。

例如，以下表达式将ID属性映射到颜色。按条件顺序求值，因此如果`${id}`不是`'1'`或`'2'`，则`"true"`条件返回白色。如果不满足任何条件，则要是的颜色将为`undefined`：

```json
{
  "color" : {
    "conditions" : [
      ["${id} === '1'", "color('#FF0000')"],
      ["${id} === '2'", "color('#00FF00')"],
      ["true", "color('#FFFFFF')"]
    ]
  }
}
```

下一个示例显示如何使用条件使用包含下限值和上限值的间隔来创建色带：

```json
"color" : {
  "conditions" : [
    ["(${Height} >= 1.0)  && (${Height} < 10.0)", "color('#FF00FF')"],
    ["(${Height} >= 10.0) && (${Height} < 30.0)", "color('#FF0000')"],
    ["(${Height} >= 30.0) && (${Height} < 50.0)", "color('#FFFF00')"],
    ["(${Height} >= 50.0) && (${Height} < 70.0)", "color('#00FF00')"],
    ["(${Height} >= 70.0) && (${Height} < 100.0)", "color('#00FFFF')"],
    ["(${Height} >= 100.0)", "color('#0000FF')"]
  ]
}
```

由于条件是按顺序判断的，因此以上内容可以写得更简洁：

```json
"color" : {
  "conditions" : [
    ["(${Height} >= 100.0)", "color('#0000FF')"],
    ["(${Height} >= 70.0)", "color('#00FFFF')"],
    ["(${Height} >= 50.0)", "color('#00FF00')"],
    ["(${Height} >= 30.0)", "color('#FFFF00')"],
    ["(${Height} >= 10.0)", "color('#FF0000')"],
    ["(${Height} >= 1.0)", "color('#FF00FF')"]
  ]
}
```

---

<a id="定义变量" name="定义变量"></a>

### 定义变量

常用的表达式可以以`defines`变量名作为键存储在对象中。如果变量引用了已定义表达式的名称，则将其替换为所引用的求值表达式的结果：

```json
{
  "defines" : {
    "NewHeight" : "clamp((${Height} - 0.5) / 2.0, 1.0, 255.0)",
    "HeightColor" : "rgb(${Height}, ${Height}, ${Height})"
  },
  "color" : {
    "conditions" : [
      ["(${NewHeight} >= 100.0)", "color('#0000FF') * ${HeightColor}"],
      ["(${NewHeight} >= 50.0)", "color('#00FF00') * ${HeightColor}"],
      ["(${NewHeight} >= 1.0)", "color('#FF0000') * ${HeightColor}"]
    ]
  },
  "show" : "${NewHeight} < 200.0"
}
```

定义表达式不能引用其他定义。但是，它可能引用具有相同名称的要素属性。在下面的样式中，高度为150的要素将获得红色：

```json
{
  "defines" : {
    "Height" : "${Height}/2.0}",
  },
  "color" : {
    "conditions" : [
      ["(${Height} >= 100.0)", "color('#0000FF')"],
      ["(${Height} >= 1.0)", "color('#FF0000')"]
    ]
  }
}
```

---

<a id="元属性" name="元属性"></a>

### 元属性

可以使用`meta`属性定义要素的非可视属性。例如，以下设置元属性的一个`description`为包含要素名称的字符串：

```json
{
  "meta" : {
    "description" : "'Hello, ${featureName}.'"
  }
}
```

元属性表达式可以求值为任何类型。例如：

```json
{
  "meta" : {
    "featureColor" : "rgb(${red}, ${green}, ${blue})",
    "featureVolume" : "${height} * ${width} * ${depth}"
  }
}
```

---

<a id="表达式" name="表达式"></a>

##  表达式

表达式语言是JavaScript（[EMCAScript 5](http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf)）的一小部分，外加本机向量和正则表达式类型，并以只读变量的形式访问tileset要素属性。

>  **注意：** CesiumJS使用[jsep](http://jsep.from.so/) JavaScript表达式解析器库将样式表达式解析为[抽象语法树（AST）](https://en.wikipedia.org/wiki/Abstract_syntax_tree)。

<a id="语法" name="语法"></a>

### 语法

点号用于按名称访问属性，例如`building.name`。

括号（`[]`）也用于访问属性，例如`building['name']`，或数组，例如`temperatures[1]`。

函数用括号（`()`）调用，逗号分隔参数，例如（`isNaN(0.0)`，`color('cyan', 0.5)`）。

---

<a id="运算符" name="运算符"></a>

### 运算符

支持以下运算符，其语义和优先级与JavaScript相同。

- 一元运算符：`+`, `-`, `!`

  - 不支持： `~`

- 二元运算符：`||`, `&&`, `===`, `!==`, `<`, `>`, `<=`, `>=`, `+`, `-`, `*`, `/`, `%`, `=~`, `!~`

  - 不支持：`|`，`^`，`&`，`<<`，`>>`，和`>>>`

- 三元运算符： `? :`

`(`和`)`同样也支持对表达式进行分组以提高清晰度和优先级。

逻辑运算符`||`并`&&`实现短路；`true || expression`不评估右侧的表达式，`false && expression`也不评估右侧的表达式。

同样，`true ? leftExpression : rightExpression`仅执行左侧表达式，并且`false ? leftExpression : rightExpression`仅执行右侧表达式。

---

<a id="数据类型" name="数据类型"></a>

### 数据类型

支持以下类型：

- `Boolean`
- `Null`
- `Undefined`
- `Number`
- `String`
- `Array`
- `vec2`
- `vec3`
- `vec4`
- `RegExp`

除`vec2`，`vec3`，`vec4`，`RegExp`外的所有类型，具有JavaScript相同的语法和运行时行为。 `vec2`，`vec3`和`vec4`是从GLSL向量派生的，类似于JavaScript `Object`（请参见<a href="#vec" class="self">vec</a>）。颜色从[CSS3](https://www.w3.org/TR/css3-color/)颜色派生并实现为`vec4`。`RegExp`从JavaScript派生并在[<a href="#RegExp" class="self">RegExp</a>](https://github.com/CesiumGS/3d-tiles/tree/master/specification/Styling#regexp)描述。

各个类型的示例包括以下内容：

- `true`, `false`
- `null`
- `undefined`
- `1.0`, `NaN`, `Infinity`
- `'Cesium'`, `"Cesium"`
- `[0, 1, 2]`
- `vec2(1.0, 2.0)`
- `vec3(1.0, 2.0, 3.0)`
- `vec4(1.0, 2.0, 3.0, 4.0)`
- `color('#00FFFF')`
- `regExp('^Chest'))`

<a id="Number" name="Number"></a>

#### Number

和JavaScript中一样，数字可以是`NaN`或`Infinity`。支持以下检测方法：

- `isNaN(testValue : Number) : Boolean`
- `isFinite(testValue : Number) : Boolean`

<a id="String" name="String"></a>

#### String

字符串以UTF-8编码。

<a id="vec" name="vec"></a>

#### 向量

样式语言包括2，2,3和4维数组浮点矢量类型：`vec2`，`vec3`，和`vec4`。向量构造器与GLSL使用相同的规则：

##### vec2

- `vec2(xy : Number)` - 用数字初始化每个组件
- `vec2(x : Number, y : Number)` -用两个数字初始化
- `vec2(xy : vec2)` - 用另一个 `vec2`初始化
- `vec2(xyz : vec3)` - 删除 `vec3`的第三部分
- `vec2(xyzw : vec4)` - 删除 `vec4`的第三、四部分

##### vec3

- `vec3(xyz : Number)` -用数字初始化每个组件
- `vec3(x : Number, y : Number, z : Number)` -用三个数字初始化
- `vec3(xyz : vec3)` -用另一个 `vec3`初始化
- `vec3(xyzw : vec4)` -删除 `vec4`的第四部分
- `vec3(xy : vec2, z : Number)`-用`vec2`和数字初始化
- `vec3(x : Number, yz : vec2)`-用`vec2`和数字初始化

##### vec4

- `vec4(xyzw : Number)` -用数字初始化每个组件
- `vec4(x : Number, y : Number, z : Number, w : Number)` -用四个数字初始化
- `vec4(xyzw : vec4)` -用另一个 `vec4`初始化
- `vec4(xy : vec2, z : Number, w : Number)`-用`vec2`和两个数字初始化
- `vec4(x : Number, yz : vec2, w : Number)`-用`vec2`和两个数字初始化
- `vec4(x : Number, y : Number, zw : vec2)`-用`vec2`和两个数字初始化
- `vec4(xyz : vec3, w : Number)`-用`vec3`和数字初始化
- `vec4(x : Number, yzw : vec3)`-用`vec3`和数字初始化

##### 向量用法

`vec2` 组件可以通过以下方式访问

- `.x`, `.y`
- `.r`, `.g`
- `[0]`, `[1]`

`vec3` 组件可以通过以下方式访问

- `.x`, `.y`, `.z`
- `.r`, `.g`, `.b`
- `[0]`, `[1]`, `[2]`

`vec4` 组件可以通过以下方式访问

- `.x`, `.y`, `.z`, `.w`
- `.r`, `.g`, `.b`, `.a`
- `[0]`, `[1]`, `[2]`, `[3]`

与GLSL不同，样式语言不支持滚动。例如，`vec3(1.0).xy`不支持。

向量支持以下一元运算符：`-`，`+`。

向量通过执行基于组件的运算来支持以下二元运算符：`===`，`!==`，`+`，`-`，`*`，`/`，和`%`。例如`vec4(1.0) === vec4(1.0)`为`true`，因为*x*，*y*，*z*和*w*分量相等，就成立了。本质上是对`vec2`，`vec3`和`vec4`的运算符进行了重载。

`vec2`，`vec3`和`vec4`具有`toString`的方法，在显式（隐式）的变换为字符串，以`'(x, y)'`，`'(x, y, z)'`和`'(x, y, z, w)'`的格式。

- `toString() : String`

`vec2`，`vec3`和`vec4`不暴露其他任何方法或`prototype`对象。

<a id="Color" name="Color"></a>

#### Color

颜色实现为`vec4`，并可以通过以下方法之一创建：

- `color()`
- `color(keyword : String, [alpha : Number])`
- `color(6-digit-hex : String, [alpha : Number])`
- `color(3-digit-hex : String, [alpha : Number])`
- `rgb(red : Number, green : Number, blue : Number)`
- `rgba(red : Number, green : Number, blue : Number, alpha : Number)`
- `hsl(hue : Number, saturation : Number, lightness : Number)`
- `hsla(hue : Number, saturation : Number, lightness : Number, alpha : Number)`

`color()`不带参数的调用与调用`color('#FFFFFF')`相同。

由大小写不敏感的关键字（例如`'cyan'`）或十六进制rgb定义的颜色将作为字符串传递给`color`函数。例如：

- `color('cyan')`
- `color('#00FFFF')`
- `color('#0FF')`

`color`函数有一个可选的第二参数，它是用于定义alpha部分的不透明度，其中`0.0`完全透明而`1.0`完全不透明。例如：

- `color('cyan', 0.5)`

十进制RGB或HSL的颜色定义，以`rgb`和`hsl`创建，如同CSS一样（特别地，百分比范围从`0.0`到`1.0`表示从`0%`到`100%`）。例如：

- `rgb(100, 255, 190)`
- `hsl(1.0, 0.6, 0.7)`

`rgb`部分的范围从`0`到`255`。对于`hsl`，色相、饱和度、亮度从`0.0`到`1.0`。

`rgba`或`hsla`具有第四个参数定义的颜色，它是用于定义不透明度的alpha分量，其中`0.0`完全透明且`1.0`完全不透明。例如：

- `rgba(100, 255, 190, 0.25)`
- `hsla(1.0, 0.6, 0.7, 0.75)`

颜色与`vec4`类型相同，并且具有相同的方法，运算符和组件访问器。颜色分量存储在范围`0.0`到`1.0`中。

例如：

- `color('red').x`，`color('red').r`和`color('red')[0]`所有取值为`1.0`。
- `color('red').toString()` 结果为`(1.0, 0.0, 0.0, 1.0)`
- `color('red') * vec4(0.5)` 相当于 `vec4(0.5, 0.0, 0.0, 0.5)`

<a id="RegExp" name="RegExp"></a>

####  RegExp

使用以下方法创建正则表达式，类似于JavaScript[`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)构造函数：

- `regExp()`
- `regExp(pattern : String, [flags : String])`

`regExp()`不带参数的调用与调用`regExp('(?:)')`相同。

如果指定，则`flags`可以具有以下值的任意组合：

- `g` -全局匹配
- `i` -忽略大小写
- `m` -多行匹配
- `u` -匹配unicode
- `y`-sticky匹配

正则表达式支持以下方法：

- `test(string : String) : Boolean` -测试指定的字符串是否匹配。
- `exec(string : String) : String`-在指定的字符串中搜索匹配项。如果搜索成功，则返回已捕获的第一个实例`String`。如果搜索失败，则返回`null`。

例如：

```json
{
  "Name" : "Building 1"
}
```

```json
regExp('a').test('abc') === true
regExp('a(.)', 'i').exec('Abc') === 'b'
regExp('Building\s(\d)').exec(${Name}) === '1'
```

正则表达式具有`toString`方法显式（隐式）转换为`'pattern'`格式的字符串：

- `toString() : String`

正则表达式不会暴露任何其他函数或`prototype`对象。

运算符`=~`和`!~`对正则表达式进行了重载。`=~`运算符的行为匹配`test`方法，并测试匹配指定的字符串。它返回`true`找到一个，`false`找不到。`!~`是`=~`的逆操作。返回`true`如果找不到匹配项，返回`false`找到匹配项。两个运算符都是可交换的。

例如，以下表达式求值均为true：

```json
regExp('a') =~ 'abc'
'abc' =~ regExp('a')

regExp('a') !~ 'bcd'
'bcd' !~ regExp('a')
```





**未完待续**

---

<a id="" name=""></a>

##

---

_版权声明：_
_除非注明，本博文章均为原创，转载请以链接形式标明本文地址。_

---
