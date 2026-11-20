---
title: "QGIS将文件夹中的所有Esri Shape转换为KML文件的python处理代码"
date: "2020-09-22T11:07:42.000Z"
legacyPath: "2020/09/22/2020-2020-09-22-qgis-shp2kml-py"
tags: ["QGIS","python"]
categories: ["QGIS","python"]
excerpt: "--- 版权声明： 除非注明，本博文章均为原创，转载请以链接形式标明本文地址。 ---"
math: false
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

_版权声明：_
_除非注明，本博文章均为原创，转载请以链接形式标明本文地址。_

---

