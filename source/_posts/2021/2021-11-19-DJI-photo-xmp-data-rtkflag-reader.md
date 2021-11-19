---
title: 读取大疆照片中XMP元数据的RtkFlag信息
top: false
cover: false
toc: false
mathjax: false
comment: true
date: 2021-11-19 22:19:00
author:
keywords:
img:
coverImg:
password:
summary:
categories:
tags:
---

```python

import os
from PIL import Image
from xml.dom.minidom import parseString

def readXMPRtkFlag(filename):
    with Image.open(filename) as im:
        for segment, content in im.applist:
            if segment != 'APP1':
                continue
            marker, body = content.rsplit(b'\x00', 1)
            if marker != b'http://ns.adobe.com/xap/1.0/':
                continue
            strBody = str(body, encoding='utf-8')
            doc = parseString(strBody)
            docRoot = doc.documentElement
            ele = docRoot.getElementsByTagName("rdf:Description")[0]
            return ele.getAttribute('drone-dji:RtkFlag')
    return ''

def main():
    root = './'
    subs = os.listdir(root)
    with open('result.txt', 'w') as f:
        for sub in subs:
            path = os.path.join(root, sub)
            if not os.path.isfile(path):
                continue
            if not path.upper().endswith('JPG'):
                continue
            flag = readXMPRtkFlag(path)
            f.write(path + '\t' + flag + '\n')

main()

```

---

_版权声明：_
_除非注明，本博文章均为原创，转载请以链接形式标明本文地址。_

---
