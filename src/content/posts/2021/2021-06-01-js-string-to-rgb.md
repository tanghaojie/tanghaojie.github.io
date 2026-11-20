---
title: "js任意string转随机颜色"
date: "2021-06-01T02:47:09.000Z"
legacyPath: "2021/06/01/2021-2021-06-01-js-string-to-rgb"
tags: []
categories: []
excerpt: "--- 版权声明： 除非注明，本博文章均为原创，转载请以链接形式标明本文地址。 ---"
math: false
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

