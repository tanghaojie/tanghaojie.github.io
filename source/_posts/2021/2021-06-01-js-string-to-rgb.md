---
title: js任意string转随机颜色
top: false
cover: false
toc: false
mathjax: false
comment: true
date: 2021-06-01 10:47:09
author:
keywords:
img:
coverImg:
password:
summary:
categories:
tags:
---

```javascript
function hashCode(str) {
  // java String#hashCode
  var hash = 0
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return hash
}

function intToRGB(i) {
  return (i & 0x00ffffff).toString(16).padStart(6, '0')
}
```

---

_版权声明：_
_除非注明，本博文章均为原创，转载请以链接形式标明本文地址。_

---
