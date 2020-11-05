---
title: 大疆/千寻卫星后处理解算信息说明
top: false
cover: false
toc: false
mathjax: false
comment: false
date: 2020-11-05 21:01:37
author:
keywords:
img:
coverImg:
password:
summary:
categories:
tags:
---

大疆PPK文件也是用的千寻解算，格式一样。

| 列字段 | 单位 | 说明 |
| ------ | ------ | ------ |
| Station | - | 轨迹点序列 |
| Timestamp(ms) | 毫秒 | UTC时间戳 |
| GPSWeek | - | GPS周 |
| TOW(s) | 秒 | 周内秒 |
| Latitude(deg) | 度 | 纬度 |
| Longitude(deg) | 度 | 经度 |
| H-Ell(m) | 米 | 椭球高程 |
| X(m) | 米 | 高斯平面坐标系 X（如果指定『中央子午线』则有此输出字段） |
| Y(m) | 米 | 高斯平面坐标系 Y（如果指定『中央子午线』则有此输出字段） |
| SDNorth(m) | 米 | 北方向标准差 |
| SDEast(m) | 米 | 东方向标准差 |
| SDHeight(m) | 米 | 高程标准差 |
| Q | - | 解算质量标志位：1：固定解(大疆：50)；2：浮点解(大疆：34)；3：单点解(大疆：16)；4：未解出(大疆：0)； |

---
*版权声明：*
*除非注明，本博文章均为原创，转载请以链接形式标明本文地址。*
---