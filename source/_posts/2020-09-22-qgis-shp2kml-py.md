---
title: QGIS将文件夹中的所有Esri Shape转换为KML文件的python处理代码
top: false
cover: false
toc: false
mathjax: false
comment: false
date: 2020-09-22 19:07:42
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
dir = r'C:\Users\YourFolderPathContainShapefile'
toDir = r'C:\Users\YourFolderPathKMLWillOutput'
crs = QgsCoordinateReferenceSystem(4326)
list = os.listdir(dir)
for l in list:
    if not l.endswith('.shp'):
        continue
    inPath = os.path.join(dir, l)
    vl = QgsVectorLayer(inPath, l, 'ogr')
    valid = vl.isValid()
    if not vl.isValid():
        print(inPath)
        print('invalid')
        continue
    toFile = os.path.join(toDir, l.replace('.shp', '.kml'))
    QgsVectorFileWriter.writeAsVectorFormat(vl, toFile, 'utf-8', crs, 'kml')
```

---
*版权声明：*
*除非注明，本博文章均为原创，转载请以链接形式标明本文地址。*
---