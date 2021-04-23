---
title: 文章中超链接打开方式target修改
top: false
cover: false
toc: true
mathjax: false
comment: true
date: 2021-04-23 19:52:15
author:
keywords:
img:
coverImg:
password:
summary:
categories:
tags:
---

<a id="reference-1" name="reference-1"></a>

## 问题

`hexo-theme-matery`主题默认配置了所有链接都是从新窗口中打开，但自己写的文章锚点，我们肯定希望直接页面内直接跳转就行了，否则的话打开的页面就太多了。

---

<a id="reference-2" name="reference-2"></a>

## 原理

修改配置的话，在`/themes/hexo-theme-matery/source/js/matery.js`这个文件下面的：

```javascript
 /*文章内容详情的一些初始化特性*/
  let articleInit = function () {
    $('#articleContent a').attr('target', '_blank')
   ...
   }
```

---

<a id="reference-3" name="reference-3"></a>

## 优化

修改这里的`_blank`到`_self`，就可以把默认配置从`新页面打开`修改为`当前页打开`了。

但是修改默认值这种方式会影响到全局，可能引入不必要的错误，所以这里推荐一种更好用的方式。

在下面添加一行，写上：

```javascript
 /*文章内容详情的一些初始化特性*/
  let articleInit = function () {
    $('#articleContent a').attr('target', '_blank')
    $('#articleContent a.self').attr('target', '_self')
   ...
   }
```

之前写的文章会继续按照默认的方式运行，如果想在当前页内跳转的话，就使用 `<a class="self" href="跳转的地址">跳转按钮</a>`，这样的写法，重点是`class="self"`，就会在当前页内跳转了。

---

<a id="reference-4" name="reference-4"></a>

## 如何设置锚点

设置锚点的话，就是在你想跳转到的地方，插入：

```
<a id="自己取一个唯一的名字作为id" name="和左边id里面填写一样的值"></a>
```

其实设置锚点，只用设置`<a>`标签里面`name`属性的值，但是 HTML4.0 修改了标准，任何标签添加了`id`属性以后，都可以作为锚点来使用。但是注意：matery 主题用其他任意标签设置锚点是能够自动跳转的，但是由于解析后的大小问题，样式有一些问题。所以还是建议使用`a`标签作为锚点，但同时设置`id`和`name`属性来保证兼容性。

---

<a id="reference-5" name="reference-5"></a>

## 例子

_当前文章目录_

- <a class="self none-decoration" href="#reference-1">`问题（页内跳转）`</a>
- <a class="self none-decoration" href="#reference-2">`原理（页内跳转）`</a>
- <a class="self none-decoration" href="#reference-3">`优化（页内跳转）`</a>
- <a class="none-decoration" href="#reference-4">`如何设置锚点（打开新页面）`</a>
- <a class="none-decoration" href="#reference-5">`例子（打开新页面）`</a>

---

_版权声明：_
_除非注明，本博文章均为原创，转载请以链接形式标明本文地址。_

---
