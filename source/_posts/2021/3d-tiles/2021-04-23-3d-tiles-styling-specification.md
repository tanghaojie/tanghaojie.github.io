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
  - <a href="#运算规则" class="self">运算规则</a>
  - <a href="#类型转换" class="self">类型转换</a>
  - <a href="#字符转换" class="self">字符转换</a>
  - <a href="#常量" class="self">常量</a>
  - <a href="#变量" class="self">变量</a>
  - <a href="#内置函数" class="self">内置函数</a>
  - <a href="#特殊说明" class="self">特殊说明</a>
- <a href="#点云" class="self">点云</a>
- <a href="#文件扩展名和MIME类型" class="self">文件扩展名和 MIME 类型</a>
- <a href="#属性参考" class="self">属性参考</a>

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

例如，以下表达式将 ID 属性映射到颜色。按条件顺序求值，因此如果`${id}`不是`'1'`或`'2'`，则`"true"`条件返回白色。如果不满足任何条件，则要是的颜色将为`undefined`：

```json
{
  "color": {
    "conditions": [
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
  "defines": {
    "NewHeight": "clamp((${Height} - 0.5) / 2.0, 1.0, 255.0)",
    "HeightColor": "rgb(${Height}, ${Height}, ${Height})"
  },
  "color": {
    "conditions": [
      ["(${NewHeight} >= 100.0)", "color('#0000FF') * ${HeightColor}"],
      ["(${NewHeight} >= 50.0)", "color('#00FF00') * ${HeightColor}"],
      ["(${NewHeight} >= 1.0)", "color('#FF0000') * ${HeightColor}"]
    ]
  },
  "show": "${NewHeight} < 200.0"
}
```

定义表达式不能引用其他定义。但是，它可能引用具有相同名称的要素属性。在下面的样式中，高度为 150 的要素将获得红色：

```json
{
  "defines": {
    "Height": "${Height}/2.0}"
  },
  "color": {
    "conditions": [
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
  "meta": {
    "description": "'Hello, ${featureName}.'"
  }
}
```

元属性表达式可以求值为任何类型。例如：

```json
{
  "meta": {
    "featureColor": "rgb(${red}, ${green}, ${blue})",
    "featureVolume": "${height} * ${width} * ${depth}"
  }
}
```

---

<a id="表达式" name="表达式"></a>

## 表达式

表达式语言是 JavaScript（[EMCAScript 5](http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf)）的一小部分，外加本机向量和正则表达式类型，并以只读变量的形式访问 tileset 要素属性。

> **注意：** CesiumJS 使用[jsep](http://jsep.from.so/) JavaScript 表达式解析器库将样式表达式解析为[抽象语法树（AST）](https://en.wikipedia.org/wiki/Abstract_syntax_tree)。

<a id="语法" name="语法"></a>

### 语法

点号用于按名称访问属性，例如`building.name`。

括号（`[]`）也用于访问属性，例如`building['name']`，或数组，例如`temperatures[1]`。

函数用括号（`()`）调用，逗号分隔参数，例如（`isNaN(0.0)`，`color('cyan', 0.5)`）。

---

<a id="运算符" name="运算符"></a>

### 运算符

支持以下运算符，其语义和优先级与 JavaScript 相同。

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

除`vec2`，`vec3`，`vec4`，`RegExp`外的所有类型，具有 JavaScript 相同的语法和运行时行为。 `vec2`，`vec3`和`vec4`是从 GLSL 向量派生的，类似于 JavaScript `Object`（请参见<a href="#vec" class="self">vec</a>）。颜色从[CSS3](https://www.w3.org/TR/css3-color/)颜色派生并实现为`vec4`。`RegExp`从 JavaScript 派生并在[<a href="#RegExp" class="self">RegExp</a>](https://github.com/CesiumGS/3d-tiles/tree/master/specification/Styling#regexp)描述。

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

和 JavaScript 中一样，数字可以是`NaN`或`Infinity`。支持以下检测方法：

- `isNaN(testValue : Number) : Boolean`
- `isFinite(testValue : Number) : Boolean`

<a id="String" name="String"></a>

#### String

字符串以 UTF-8 编码。

<a id="vec" name="vec"></a>

#### 向量

样式语言包括 2，2,3 和 4 维数组浮点矢量类型：`vec2`，`vec3`，和`vec4`。向量构造器与 GLSL 使用相同的规则：

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

与 GLSL 不同，样式语言不支持滚动。例如，`vec3(1.0).xy`不支持。

向量支持以下一元运算符：`-`，`+`。

向量通过执行基于组件的运算来支持以下二元运算符：`===`，`!==`，`+`，`-`，`*`，`/`，和`%`。例如`vec4(1.0) === vec4(1.0)`为`true`，因为*x*，_y_，*z*和*w*分量相等，就成立了。本质上是对`vec2`，`vec3`和`vec4`的运算符进行了重载。

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

由大小写不敏感的关键字（例如`'cyan'`）或十六进制 rgb 定义的颜色将作为字符串传递给`color`函数。例如：

- `color('cyan')`
- `color('#00FFFF')`
- `color('#0FF')`

`color`函数有一个可选的第二参数，它是用于定义 alpha 部分的不透明度，其中`0.0`完全透明而`1.0`完全不透明。例如：

- `color('cyan', 0.5)`

十进制 RGB 或 HSL 的颜色定义，以`rgb`和`hsl`创建，如同 CSS 一样（特别地，百分比范围从`0.0`到`1.0`表示从`0%`到`100%`）。例如：

- `rgb(100, 255, 190)`
- `hsl(1.0, 0.6, 0.7)`

`rgb`部分的范围从`0`到`255`。对于`hsl`，色相、饱和度、亮度从`0.0`到`1.0`。

`rgba`或`hsla`具有第四个参数定义的颜色，它是用于定义不透明度的 alpha 分量，其中`0.0`完全透明且`1.0`完全不透明。例如：

- `rgba(100, 255, 190, 0.25)`
- `hsla(1.0, 0.6, 0.7, 0.75)`

颜色与`vec4`类型相同，并且具有相同的方法，运算符和组件访问器。颜色分量存储在范围`0.0`到`1.0`中。

例如：

- `color('red').x`，`color('red').r`和`color('red')[0]`所有取值为`1.0`。
- `color('red').toString()` 结果为`(1.0, 0.0, 0.0, 1.0)`
- `color('red') * vec4(0.5)` 相当于 `vec4(0.5, 0.0, 0.0, 0.5)`

<a id="RegExp" name="RegExp"></a>

#### RegExp

使用以下方法创建正则表达式，类似于 JavaScript[`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)构造函数：

- `regExp()`
- `regExp(pattern : String, [flags : String])`

`regExp()`不带参数的调用与调用`regExp('(?:)')`相同。

如果指定，则`flags`可以具有以下值的任意组合：

- `g` -全局匹配
- `i` -忽略大小写
- `m` -多行匹配
- `u` -匹配 unicode
- `y`-sticky 匹配

正则表达式支持以下方法：

- `test(string : String) : Boolean` -测试指定的字符串是否匹配。
- `exec(string : String) : String`-在指定的字符串中搜索匹配项。如果搜索成功，则返回已捕获的第一个实例`String`。如果搜索失败，则返回`null`。

例如：

```json
{
  "Name": "Building 1"
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

例如，以下表达式求值均为 true：

```json
regExp('a') =~ 'abc'
'abc' =~ regExp('a')

regExp('a') !~ 'bcd'
'bcd' !~ regExp('a')
```

---

<a id="运算规则" name="运算规则"></a>

### 运算规则

- 一元运算符`+`，`-`仅对数字和向量表达式进行运算。
- 一元运算符`!`仅对布尔表达式进行运算。
- 二元运算符`<`，`<=`，`>`，和`>=`仅对数字表达式进行操作。
- 二元运算符`||`，`&&`仅对布尔表达式进行运算。
- 二元运算符`+`对以下表达式进行操作：
  - 数字表达式
  - 相同类型的向量表达式
  - 如果至少一个表达式是字符串，则另一个表达式将进行<a href="#字符串转换" class="self">字符串转换</a>之后转换为字符串，并且该操作将返回一个串联的字符串，例如，`"name" + 10`求值为`"name10"`
- 二进制运算符`-`对以下表达式进行操作：
  - 数字表达式
  - 相同类型的向量表达式
- 二进制运算符`*`对以下表达式进行操作：
  - 数字表达式
  - 相同类型的向量表达式
  - 数字表达式和矢量表达式的混合，例如`3 * vec3(1.0)`和`vec2(1.0) * 3`
- 二进制运算符`/`对以下表达式进行操作：
  - 数字表达式
  - 相同类型的向量表达式
  - 矢量表达式后跟数字表达式，例如`vec3(1.0) / 3`
- 二进制运算符`%`对以下表达式进行操作：
  - 数字表达式
  - 相同类型的向量表达式
- 二进制相等运算符`===`，可`!==`对任何表达式进行运算。`false`如果表达式类型不匹配，则操作返回。
- 二进制`regExp`运算符`=~`，`!~`要求一个参数是字符串表达式，另一个参数是`RegExp`表达式。
- 三元运算符`? :`条件参数必须是布尔表达式。

---

<a id="类型转换" name="类型转换"></a>

### 类型转换

基本类型之间的转换使用`Boolean`，`Number`和`String`方法来处理。

- `Boolean(value : Any) : Boolean`
- `Number(value : Any) : Number`
- `String(value : Any) : String`

例如：

```javascript
Boolean(1) === true
Number('1') === 1
String(1) === '1'
```

`Boolean`和`Number`遵循 JavaScript 约定。`String`遵循<a href="#字符串转换" class="self">字符串转换</a>。

这些本质上是强制类型转换，而不是构造函数。

除非上面另有说明，否则样式语言不允许进行隐式类型转换。像`vec3(1.0) === vec4(1.0)`和`"5" < 6`这样的表达式无效。

---

<a id="字符转换" name="字符转换"></a>

### 字符转换

`vec2`，`vec3`，`vec4`，和`RegExp`表达式转换为使用他们的字符串`toString`的方法。所有其他类型均遵循 JavaScript 规则。

- `true` -- `"true"`
- `false` -- `"false"`
- `null` -- `"null"`
- `undefined` -- `"undefined"`
- `5.0` -- `"5"`
- `NaN` -- `"NaN"`
- `Infinity` -- `"Infinity"`
- `"name"` -- `"name"`
- `[0, 1, 2]` -- `"[0, 1, 2]"`
- `vec2(1, 2)` -- `"(1, 2)"`
- `vec3(1, 2, 3)` -- `"(1, 2, 3)"`
- `vec4(1, 2, 3, 4)` -- `"(1, 2, 3, 4)"`
- `RegExp('a')` -- `"/a/"`

---

<a id="常量" name="常量"></a>

### 常量

样式语言支持以下常量：

- <a href="#PI" class="self">`Math.PI`</a>
- <a href="#E" class="self">`Math.E`</a>

<a id="PI" name="PI"></a>

#### PI

数学常数 PI 为圆的周长除以其直径，约`3.14159`。

```javascript
{
     “ show ”：“ cos（$ {Angle} + Math.PI）<0 ”
}
```

<a id="E" name="E"></a>

#### E

欧拉常数和自然对数的底数，约`2.71828`。

```javascript
{
     “ color ”：“ color（）* pow（Math.E / 2.0，$ {Temperature}）”
}
```

---

<a id="变量" name="变量"></a>

### 变量

变量用于检索图块集中各个要素的属性值。使用 ES 6（[ECMAScript 2015](http://www.ecma-international.org/ecma-262/6.0/)）模板文字语法（如`${feature.identifier}`、`${feature['identifier']}`）标识变量，其中标识符是区分大小写的属性名称。变量名称以 UTF-8 编码。`feature`是隐式的，在大多数情况下可以省略。如果标识符包含非字母数字字符，例如`:`，`-`，`#`，或空格，则应当使用`${feature['identifier']}`形式。

可以在任何接受有效表达式的地方使用变量，但在其他变量标识符中除外。例如，不允许以下内容：

```
${foo[${bar}]}
```

如果要素没有具有指定名称的属性，则该变量的值为`undefined`。请注意，如果属性是为某个属性显式存储的，`null`则该属性也可能是`null`。

变量可以是任何受支持的原生 JavaScript 类型：

- `Boolean`
- `Null`
- `Undefined`
- `Number`
- `String`
- `Array`

例如：

```javascript
{
    "enabled" : true,
    "description" : null,
    "order" : 1,
    "name" : "Feature name"
}
```

```javascript
${enabled} === true
${description} === null
${order} === 1
${name} === 'Feature name'
```

此外，存储在[批处理表(Batch Table)二进制文件](/2021/04/23/3d-tiles-batch-table-specification#二进制体)中矢量属性的变量被视为矢量类型：

| `componentType` | variable type |
| --------------- | ------------- |
| `"VEC2"`        | `vec2`        |
| `"VEC3"`        | `vec3`        |
| `"VEC4"`        |               |

变量可用于构造颜色或向量。例如：

```json
rgba(${red}, ${green}, ${blue}, ${alpha})
vec4(${temperature})
```

点或括号符号用于访问要素子属性。例如：

```json
{
  "address.street": "Maple Street",
  "address": {
    "street": "Oak Street"
  }
}
```

```json
${address.street} === `Example street`
${address['street']} === `Example street`

${address.city} === `Example city`
${address['city']} === `Example city`
```

括号表示法仅支持字符串文字。

可以显式使用`feature`关键字的括号表示法访问顶级属性。例如：

```json
{
  "address.street": "Maple Street",
  "address": {
    "street": "Oak Street"
  }
}
```

```json
${address.street} === `Oak Street`
${feature.address.street} === `Oak Street`
${feature['address'].street} === `Oak Street`
${feature['address.street']} === `Maple Street`
```

要访问名为`feature`的要素，请使用变量`${feature}`。这等效于访问`${feature.feature}`

```json
{
  "feature": "building"
}
```

```json
${feature} === `building`
${feature.feature} === `building`
```

也可以在用反引号定义的字符串内替换变量，例如：

```json
{
  "order": 1,
  "name": "Feature name"
}
```

```json
`Name is ${name}, order is ${order}`
```

括号符号用于访问要素子属性或数组。例如：

```json
{
  "temperatures": {
    "scale": "fahrenheit",
    "values": [70, 80, 90]
  }
}
```

```json
${temperatures['scale']} === 'fahrenheit'
${temperatures.values[0]} === 70
${temperatures['values'][0]} === 70 // Same as (temperatures[values])[0] and temperatures.values[0]
```

---

<a id="内置函数" name="内置函数"></a>

### 内置函数

- <a href="#abs" class="self">abs</a>
- <a href="#sqrt" class="self">sqrt</a>
- <a href="#cos" class="self">cos</a>
- <a href="#sin" class="self">sin</a>
- <a href="#tan" class="self">tan</a>
- <a href="#acos" class="self">acos</a>
- <a href="#asin" class="self">asin</a>
- <a href="#atan" class="self">atan</a>
- <a href="#atan2" class="self">atan2</a>
- <a href="#radians" class="self">radians</a>
- <a href="#degrees" class="self">degrees</a>
- <a href="#sign" class="self">sign</a>
- <a href="#floor" class="self">floor</a>
- <a href="#ceil" class="self">ceil</a>
- <a href="#round" class="self">round</a>
- <a href="#exp" class="self">exp</a>
- <a href="#log" class="self">log</a>
- <a href="#exp2" class="self">exp2</a>
- <a href="#log2" class="self">log2</a>
- <a href="#fract" class="self">fract</a>
- <a href="#pow" class="self">pow</a>
- <a href="#min" class="self">min</a>
- <a href="#max" class="self">max</a>
- <a href="#clamp" class="self">clamp</a>
- <a href="#mix" class="self">mix</a>
- <a href="#length" class="self">length</a>
- <a href="#distance" class="self">distance</a>
- <a href="#normalize" class="self">normalize</a>
- <a href="#dot" class="self">dot</a>
- <a href="#cross" class="self">cross</a>

许多内置函数都将标量或向量作为参数。对于向量参数，将按组件方式应用该函数，并返回结果向量。

<a id="abs" name="abs"></a>

#### abs

```javascript
abs(x : Number) : Number
abs(x : vec2) : vec2
abs(x : vec3) : vec3
abs(x : vec4) : vec4
```

返回`x`的绝对值。

```javascript
{
     "show" : "abs(${temperature}) > 20.0"
}
```

<a id="sqrt" name="sqrt"></a>

#### sqrt

```javascript
sqrt(x : Number) : Number
sqrt(x : vec2) : vec2
sqrt(x : vec3) : vec3
sqrt(x : vec4) : vec4
```

当`x >= 0`时，返回`x`的平方根。当`x < 0`时返回`NaN`。

```javascript
{
    "color" : {
        "conditions" : [
            ["${temperature} >= 0.5", "color('#00FFFF')"],
            ["${temperature} >= 0.0", "color('#FF00FF')"]
        ]
    }
}
```

<a id="cos" name="cos"></a>

#### cos

```javascript
cos(angle : Number) : Number
cos(angle : vec2) : vec2
cos(angle : vec3) : vec3
cos(angle : vec4) : vec4
```

返回`angle`弧度的余弦值。

```javascript
{
    "show" : "cos(${Angle}) > 0.0"
}
```

<a id="sin" name="sin"></a>

#### sin

```javascript
sin(angle : Number) : Number
sin(angle : vec2) : vec2
sin(angle : vec3) : vec3
sin(angle : vec4) : vec4
```

返回`angle`弧度的正弦值。

```javascript
{
    "show" : "sin(${Angle}) > 0.0"
}
```

<a id="tan" name="tan"></a>

#### tan

```javascript
tan(angle : Number) : Number
tan(angle : vec2) : vec2
tan(angle : vec3) : vec3
tan(angle : vec4) : vec4
```

返回`angle`弧度的正切值。

```javascript
{
    "show" : "tan(${Angle}) > 0.0"
}
```

<a id="acos" name="acos"></a>

#### acos

```javascript
acos(angle : Number) : Number
acos(angle : vec2) : vec2
acos(angle : vec3) : vec3
acos(angle : vec4) : vec4
```

返回`angle`弧度的反余弦值。

```javascript
{
    "show" : "acos(${Angle}) > 0.0"
}
```

<a id="asin" name="asin"></a>

#### asin

```javascript
asin(angle : Number) : Number
asin(angle : vec2) : vec2
asin(angle : vec3) : vec3
asin(angle : vec4) : vec4
```

返回`angle`弧度的反正弦值。

```javascript
{
    "show" : "asin(${Angle}) > 0.0"
}
```

<a id="atan" name="atan"></a>

#### atan

```javascript
atan(angle : Number) : Number
atan(angle : vec2) : vec2
atan(angle : vec3) : vec3
atan(angle : vec4) : vec4
```

返回`angle`弧度的反正切值。

```javascript
{
    "show" : "atan(${Angle}) > 0.0"
}
```

<a id="atan2" name="atan2"></a>

#### atan2

```javascript
atan2(y : Number, x : Number) : Number
atan2(y : vec2, x : vec2) : vec2
atan2(y : vec3, x : vec3) : vec3
atan2(y : vec4, x : vec4) : vec4
```

返回`y`和`x`商的反正切值。

```javascript
{
    "show" : "atan2(${GridY}, ${GridX}) > 0.0"
}
```

<a id="radians" name="radians"></a>

#### radians

```javascript
radians(angle : Number) : Number
radians(angle : vec2) : vec2
radians(angle : vec3) : vec3
radians(angle : vec4) : vec4
```

`angle`从度转换为弧度。

```javascript
{
    "show" : "radians(${Angle}) > 0.5"
}
```

<a id="degrees" name="degrees"></a>

#### degrees

```javascript
degrees(angle : Number) : Number
degrees(angle : vec2) : vec2
degrees(angle : vec3) : vec3
degrees(angle : vec4) : vec4
```

`angle`从弧度转换为度。

```javascript
{
    "show" : "degrees(${Angle}) > 45.0"
}
```

<a id="sign" name="sign"></a>

#### sign

```javascript
sign(x : Number) : Number
sign(x : vec2) : vec2
sign(x : vec3) : vec3
sign(x : vec4) : vec4
```

当`x`正数时返回 1.0 ，当`x`零时返回 0.0 ，当`x`负数时返回-1.0 。

```javascript
{
    "show" : "sign(${Temperature}) * sign(${Velocity}) === 1.0"
}
```

<a id="floor" name="floor"></a>

#### floor

```javascript
floor(x : Number) : Number
floor(x : vec2) : vec2
floor(x : vec3) : vec3
floor(x : vec4) : vec4
```

返回小于或等于`x`的最接近的整数。

```javascript
{
    "show" : "floor(${Position}) === 0"
}
```

<a id="ceil" name="ceil"></a>

#### ceil

```javascript
ceil(x : Number) : Number
ceil(x : vec2) : vec2
ceil(x : vec3) : vec3
ceil(x : vec4) : vec4
```

返回大于或等于`x`的最接近的整数。

```javascript
{
    "show" : "ceil(${Position}) === 1"
}
```

<a id="round" name="round"></a>

#### round

```javascript
round(x : Number) : Number
round(x : vec2) : vec2
round(x : vec3) : vec3
round(x : vec4) : vec4
```

返回最接近`x`的整数。小数为 0.5 的数字将按实现定义的方向四舍五入。

```javascript
{
    "show" : "round(${Position}) === 1"
}
```

<a id="exp" name="exp"></a>

#### exp

```javascript
exp(x : Number) : Number
exp(x : vec2) : vec2
exp(x : vec3) : vec3
exp(x : vec4) : vec4
```

返回`e`的`x`次幂，其中`e`欧拉常数，约为`2.71828`。

```javascript
{
    "show" : "exp(${Density}) > 1.0"
}
```

<a id="log" name="log"></a>

#### log

```javascript
log(x : Number) : Number
log(x : vec2) : vec2
log(x : vec3) : vec3
log(x : vec4) : vec4
```

返回自然数为底（`e`）`x`的对数。

```javascript
{
    "show" : "log(${Density}) > 1.0"
}
```

<a id="exp2" name="exp2"></a>

#### exp2

```javascript
exp2(x : Number) : Number
exp2(x : vec2) : vec2
exp2(x : vec3) : vec3
exp2(x : vec4) : vec4
```

返回 2 的`x`次幂。

```javascript
{
    "show" : "exp2(${Density}) > 1.0"
}
```

<a id="log2" name="log2"></a>

#### log2

```javascript
log2(x : Number) : Number
log2(x : vec2) : vec2
log2(x : vec3) : vec3
log2(x : vec4) : vec4
```

返回的以 2 为底`x`的对数。

```javascript
{
    "show" : "log2(${Density}) > 1.0"
}
```

<a id="fract" name="fract"></a>

#### fract

```javascript
fract(x : Number) : Number
fract(x : vec2) : vec2
fract(x : vec3) : vec3
fract(x : vec4) : vec4
```

返回`x`的小数部分。等同于`x - floor(x)`。

```javascript
{
    "color" : "color() * fract(${Density})"
}
```

<a id="pow" name="pow"></a>

#### pow

```javascript
pow(base : Number, exponent : Number) : Number
pow(base : vec2, exponent : vec2) : vec2
pow(base : vec3, exponent : vec3) : vec3
pow(base : vec4, exponent : vec4) : vec4
```

返回基数`base`的`exponent`次幂。

```javascript
{
    "show" : "pow(${Density}, ${Temperature}) > 1.0"
}
```

<a id="min" name="min"></a>

#### min

```javascript
min(x : Number, y : Number) : Number
min(x : vec2, y : vec2) : vec2
min(x : vec3, y : vec3) : vec3
min(x : vec4, y : vec4) : vec4
min(x : Number, y : Number) : Number
min(x : vec2, y : Number) : vec2
min(x : vec3, y : Number) : vec3
min(x : vec4, y : Number) : vec4
```

返回`x`和`y`中小的数。

```javascript
{
    "show" : "min(${Width}, ${Height}) > 10.0"
}
```

<a id="max" name="max"></a>

#### max

```javascript
max(x : Number, y : Number) : Number
max(x : vec2, y : vec2) : vec2
max(x : vec3, y : vec3) : vec3
max(x : vec4, y : vec4) : vec4
max(x : Number, y : Number) : Number
max(x : vec2, y : Number) : vec2
max(x : vec3, y : Number) : vec3
max(x : vec4, y : Number) : vec4
```

返回`x`和`y`中大的数。

```javascript
{
    "show" : "max(${Width}, ${Height}) > 10.0"
}
```

<a id="clamp" name="clamp"></a>

#### clamp

```javascript
clamp(x : Number,  min : Number, max : Number) : Number
clamp(x : vec2,  min : vec2, max : vec2) : vec2
clamp(x : vec3,  min : vec3, max : vec3) : vec3
clamp(x : vec4,  min : vec4, max : vec4) : vec4
clamp(x : Number,  min : Number, max : Number) : Number
clamp(x : vec2,  min : Number, max : Number) : vec2
clamp(x : vec3,  min : Number, max : Number) : vec3
clamp(x : vec4,  min : Number, max : Number) : vec4
```

约束`x`位于`min`和之间`max`。

```javascript
{
    "color" : "color() * clamp(${temperature}, 0.1, 0.2)"
}
```

<a id="mix" name="mix"></a>

#### mix

```javascript
mix(x : Number,  y : Number, a : Number) : Number
mix(x : vec2,  y : vec2, a : vec2) : vec2
mix(x : vec3,  y : vec3, a : vec3) : vec3
mix(x : vec4,  y : vec4, a : vec4) : vec4
mix(x : Number,  y : Number, a : Number) : Number
mix(x : vec2,  y : vec2, a : Number) : vec2
mix(x : vec3,  y : vec3, a : Number) : vec3
mix(x : vec4,  y : vec4, a : Number) : vec4
```

计算`x`和`y`的线性内插。

```javascript
{
    "show" : "mix(20.0, ${Angle}, 0.5) > 25.0"
}
```

<a id="length" name="length"></a>

#### length

```javascript
length(x : Number) : Number
length(x : vec2) : vec2
length(x : vec3) : vec3
length(x : vec4) : vec4
```

计算向量的长度`x`，即分量平方之和的平方根。如果`x`是数字，则`length`返回`x`。

```javascript
{
    "show" : "length(${Dimensions}) > 10.0"
}
```

<a id="distance" name="distance"></a>

#### distance

```javascript
distance(x : Number, y : Number) : Number
distance(x : vec2, y : vec2) : vec2
distance(x : vec3, y : vec3) : vec3
distance(x : vec4, y : vec4) : vec4
```

计算两个点之间的距离`x`和`y`，即`length(x - y)`。

```javascript
{
    "show" : "distance(${BottomRight}, ${UpperLeft}) > 50.0"
}
```

<a id="normalize" name="normalize"></a>

#### normalize

```javascript
normalize(x : Number) : Number
normalize(x : vec2) : vec2
normalize(x : vec3) : vec3
normalize(x : vec4) : vec4
```

返回长度为 1.0 的向量，该向量与`x`平行。当`x`为数字时，`normalize`返回 1.0。

```javascript
{
    "show" : "normalize(${RightVector}, ${UpVector}) > 0.5"
}
```

<a id="dot" name="dot"></a>

#### dot

```javascript
dot(x : Number, y : Number) : Number
dot(x : vec2, y : vec2) : vec2
dot(x : vec3, y : vec3) : vec3
dot(x : vec4, y : vec4) : vec4
```

计算`x`和`y`的点积。

```javascript
{
    "show" : "dot(${RightVector}, ${UpVector}) > 0.5"
}
```

<a id="cross" name="cross"></a>

#### cross

```javascript
cross(x : vec3, y : vec3) : vec3
```

计算`x`和`y`的叉积。该函数仅接受`vec3`参数。

```javascript
{
    "color" : "vec4(cross(${RightVector}, ${UpVector}), 1.0)"
}
```

---

<a id="特殊说明" name="特殊说明"></a>

### 特殊说明

不支持注释。

---

<a id="点云" name="点云"></a>

## 点云

[点云 (Point Cloud)](/2021/04/23/3d-tiles-point-cloud-specification)数据集可以像其他要素一样设计样式。除了点的`color`和`show`属性，点云的样式可以设置为`pointSize`，或每个像素点的大小。默认`pointSize`值为`1.0`。

```json
{
  "color": "color('red')",
  "pointSize": "${Temperature} * 0.5"
}
```

实现时，可以限制`pointSize`在系统支持的点大小范围内。例如，当`POINTS`渲染时，WebGL 渲染器可能会查询`ALIASED_POINT_SIZE_RANGE`以获取系统限制。`pointSize`为`1.0`必须得到支持。

点云样式还可以引用[点云要素表](/2021/04/23/3d-tiles-point-cloud-specification#要素表)语法，包括位置，颜色和法线，以允许对源数据进行更灵活的样式设置。

- `${POSITION}`在`RTC_CENTER`和平铺变换应用之前，以`vec3`存储 xyz 直角坐标系的点坐标。量化位置时，`${POSITION}`在`QUANTIZED_VOLUME_SCALE`应用后，但`QUANTIZED_VOLUME_OFFSET`应用前指定位置。
- `${POSITION_ABSOLUTE}`在`RTC_CENTER`和 tile 变换应用之后，以`vec3`存储 xyz 直角坐标系的点坐标。量化位置时，`${POSITION_ABSOLUTE}`在`QUANTIZED_VOLUME_SCALE`、`QUANTIZED_VOLUME_OFFSET`和瓦片变换应用后，指定位置。
- `${COLOR}`为该点存储`Color`的 rgba 颜色。当要素表的颜色语义为`RGB`或`RGB565`时，`${COLOR}.alpha`为`1.0`。如果未定义颜色语义，则`${COLOR}`求值为特定应用程序的默认颜色。
- `${NORMAL}`在应用 tile 变换之前，以`vec3`存储点的法线（以笛卡尔坐标表示）。当法线被八进制编码时，`${NORMAL}`引用解码后的法线。如果在要素表中未定义法线，则`${NORMAL}`的结果为`undefined`。

例如：

```json
{
  "color": "${COLOR} * color('red')'",
  "show": "${POSITION}.x > 0.5",
  "pointSize": "${NORMAL}.x > 0 ? 2 : 1"
}
```

> **实施注意：**点云样式引擎可能经常使用着色器（GLSL）实现，但是在纯 GLSL 实现中，表达语言的某些功能是不可能的。其中一些功能包括：
>
> - 求`isNaN`和`isFinite`（GLSL 2.0+支撑`isnan`和`isinf`分别用于这些功能）
> - `null`和`undefined`类型
> - 字符串，包括访问对象属性（`color()['r']`）和批处理表值
> - 正则表达式
> - 长度不是 2、3 或 4 的数组
> - 类型比较不匹配（例如`1.0 === false`）
> - 数组索引超出范围

---

<a id="文件扩展名和MIME类型" name="文件扩展名和MIME类型"></a>

## 文件扩展名和 MIME 类型

Tileset 样式使用`.json`扩展名和`application/json`mime 类型。

---

<a id="属性参考" name="属性参考"></a>

## 属性参考

- <a href="#r样式" class="self">样式</a>
  - <a href="#r布尔表达式" class="self">布尔表达式</a>
  - <a href="#r颜色表达式" class="self">颜色表达式</a>
  - <a href="#r多条件" class="self">多条件</a>
    - <a href="#r条件" class="self">条件</a>
  - <a href="#r表达式" class="self">表达式</a>
  - <a href="#r元" class="self">元</a>
  - <a href="#r数字表达式" class="self">数字表达式</a>
- <a href="#r点云样式" class="self">点云样式</a>

<a id="r样式" name="r样式"></a>

### 样式

3D Tiles 样式

|             | 类型                          | 描述                                                                                                                                                                       | 是否必需                        |
| ----------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| **defines** | `object`                      | <a href="#r表达式" class="self">`表达式`</a>映射到变量名称键的字符串的字典对象，在整个样式中都可以引用该对象。如果表达式引用定义的变量，则将其替换为相应表达式的求值结果。 | 不                              |
| **show**    | `boolean`，`string`，`object` | <a href="#r布尔表达式" class="self">`布尔表达式`</a>或<a href="#r多条件" class="self">`多条件`</a>属性，它确定是否应该显示的特征。                                         | 否，默认值： `true`             |
| **color**   | `string`， `object`           | <a href="#r颜色表达式" class="self">`颜色表达式`</a>或<a href="#r多条件" class="self">`多条件`</a>属性，它确定颜色混合与特征的固有颜色。                                   | 否，默认值： `color('#FFFFFF')` |
| **meta**    | `object`                      | <a href="#r元" class="self">`元`</a>，其确定所述特征的非可视属性的值的对象。                                                                                               |                                 |

---

<a id="r布尔表达式" name="r布尔表达式"></a>

#### 布尔表达式

具有 3D Tiles 样式表达式的布尔值或字符串，其值为布尔值。请参阅<a href="#表达式" class="self">表达式</a>。

---

<a id="r颜色表达式" name="r颜色表达式"></a>

#### 颜色表达式

3D Tiles 颜色样式的<a href="#r表达式" class="self">表达式</a>。请参阅[<a href="#表达式" class="self">表达式</a>](https://github.com/CesiumGS/3d-tiles/blob/master/specification/Styling/README.md#expressions)。

---

<a id="r多条件" name="r多条件"></a>

#### 多条件

一系列条件按顺序求值，例如一系列 if ... else 语句，这些表达式导致对表达式进行求值。

**特性**

|                | 类型         | 描述                                                                                                                                                                                                                                               | 是否必需 |
| -------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| **conditions** | `array` `[]` | 一系列布尔条件按顺序求值。对于第一个计算结果为 true 的值，将计算并返回其值“结果”（也是一个表达式）。结果表达式必须全部为同一类型。如果没有条件得出的结果为 true，则结果为`undefined`。当条件为`undefined`，`null`或为空对象时，结果为`undefined`。 | No       |

不允许使用其他属性。

---

<a id="r条件" name="r条件"></a>

##### 条件

<a href="#r表达式" class="self">表达式</a>作为条件为真的结果进行的评估。两个表达式的数组。如果对第一个表达式求值并且结果为`true`，则对第二个表达式求值并作为条件的结果返回。

---

<a id="r表达式" name="r表达式"></a>

#### 表达式

有效的 3D Tiles 样式表达式。请参阅<a href="#表达式" class="self">表达式</a>。

---

<a id="r元" name="r元"></a>

#### 元

一系列属性名称和<a href="#r表达式" class="self">表达式</a>用于评估该属性的值。

允许其他属性。

---

<a id="r数字表达式" name="r数字表达式"></a>

#### 数字表达式

3D Tiles 样式表达式，其计算结果为数字。请参阅<a href="#表达式" class="self">表达式</a>。

---

<a id="r点云样式" name="r点云样式"></a>

### 点云样式

具有点云附加属性的 3D Tiles 样式。

|               | 类型                          | 描述                                                                                                                                                                       | 是否必须                        |
| ------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| **defines**   | `object`                      | <a href="#r表达式" class="self">`表达式`</a>映射到变量名称键的字符串的字典对象，在整个样式中都可以引用该对象。如果表达式引用定义的变量，则将其替换为相应表达式的求值结果。 | No                              |
| **show**      | `boolean`, `string`, `object` | <a href="#r布尔表达式" class="self">`布尔表达式`</a>或<a href="#r多条件" class="self">`多条件`</a>属性，它确定是否应该显示的特征。                                         | No, default: `true`             |
| **color**     | `string`, `object`            | <a href="#r颜色表达式" class="self">`颜色表达式`</a>或<a href="#r多条件" class="self">`多条件`</a>属性，它确定颜色混合与特征的固有颜色。                                   | No, default: `color('#FFFFFF')` |
| **meta**      | `object`                      | <a href="#r元" class="self">`元`</a>，其确定所述特征的非可视属性的值的对象。                                                                                               | No                              |
| **pointSize** | `number`, `string`, `object`  | <a href="#r数字表达式" class="self">`数字表达式`</a>或<a href="#r多条件" class="self">`多条件`</a>属性，用于确定点的大小（以像素为单位）。                                 | No, default: `1`                |

不允许使用其他属性。

---

####

---

**未完**

---

<a id="" name=""></a>

##

---

_版权声明：_
_除非注明，本博文章均为原创，转载请以链接形式标明本文地址。_

---
