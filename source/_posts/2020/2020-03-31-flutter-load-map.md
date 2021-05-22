---
title: flutter加载地图的几种方式对比[测试]
top: false
cover: false
toc: false
mathjax: false
comment: true
date: 2020-03-31 20:14:47
author:
img: https://jackie_tang.gitee.io/pic_cloud/2020-03/cover1.jpg
coverImg:
password:
summary:
keywords: flutter
categories:
  - flutter
tags:
  - flutter
---

1.[flutter_map](https://pub.dev/packages/flutter_map)：Leaflet 用 Flutter 的实现，主要用于加载瓦片地图和简单注记，复杂的几何要素可以用插件的形式，但要自己实现代码。没有自带定位的功能，要自己处理。综合来看，只用瓦片地图，定位这些基础功能的话，可以选这个，团队强大的话，复杂功能也可以自己搞插件。天花板挺高的。

![flutter_map，自己加了定位](https://jackie_tang.gitee.io/pic_cloud/2020-03/flutter_map.jpg)

2.[webview_flutter](https://pub.dev/packages/webview_flutter)：fluter 官方出品的 webview 插件，没什么好说的，网页能干的事他都能干。最大的问题是目前还是预览版，官方说因为用了新的机制，具体什么机制我也没看，能不能实现官方没说，deadline 也没说，有点不让人放心。

3.[flutter_webview_plugin](https://pub.dev/packages/flutter_webview_plugin)：网上综合推荐比较多的一个插件了，就是调用 native webview，稳定性，兼容性肯定没问题。但是由于接入原生，导致 webview 始终在最上层，会覆盖在所有 Flutter widget 之上，灵活性牺牲很大。最新的说明里写了，要把这个插件合并到上面提到的官方插件里面去了。所以基本上不用选了。

![flutter_webview_plugin,注意右上角debug标识都被覆盖了](https://jackie_tang.gitee.io/pic_cloud/2020-03/webviewplugin.jpg)

4.其他库：比如说高德 amap，百度地图，这类就局限平台了。

---

目前就测试了这几种地图使用方式，总的来说，有团队，有时间，能自己研发的，可以上。不然的话还是用混合开发吧，flutter 还需要给他些时间来成熟。

---

_版权声明：_
_除非注明，本博文章均为原创，转载请以链接形式标明本文地址。_

---
