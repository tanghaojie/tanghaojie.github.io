---
title: DJI照片元数据主要信息列表
top: false
cover: false
toc: false
mathjax: false
comment: false
date: 2020-11-25 20:34:21
author:
keywords:
img:
coverImg:
password:
summary:
categories:
tags:
---

| 字段 | 说明 |
| ------ | ------ |
| ModifyDate="2018-08-09" | 照片修改日期 |
| CreateDate="2018-08-09" | 照片创建日期 |
| Make="DJI" | 制造商 |
| Model="FC6310R" | 相机型号 |
| format="image/jpg" | 照片格式 |
| AbsoluteAltitude="+150.09" | 相机的绝对高度，基于使用的椭球模型（通常为WGS84或CGCS2000）。 |
| RelativeAltitude="+109.86" | 基于原点（起飞点）的摄像机的相对高度。 |
| GpsLatitude="22.63093244" | 相机位置的纬度，在北正南负，单位：度。 |
| GpsLongtitude="113.93793694" | 相机位置的经度，单位：度。 |
| GimbalRollDegree="+0.00" | 云台侧倾角（在东北地面框架中，北为真北） |
| GimbalYawDegree="-38.00" | 云台偏航角（在东北地面框架中，北为真北） |
| GimbalPitchDegree="-89.90" | 云台俯仰角（在东北地面框架中，北为真北） |
| FlightRollDegree="+4.70" | 无人机侧倾角（在东北地面框架中，北为真北 |
| FlightYawDegree="-36.10" | 无人机偏航角（在东北地面框架中，北为真北） |
| FlightPitchDegree="+0.80" | 无人机云台俯仰角（在东北地面框架中，北为真北） |
| FlightXSpeed="+6.60" | 北方地面速度（m / s） |
| FlightYSpeed="-5.20" | 东方地面速度（m / s） |
| FlightZSpeed="+0.00" | 垂直地面速度（m / s） |
| CalibratedFocalLength="3666.666504" | 镜头的设计焦距，单位：像素。 |
| CalibratedOpticalCenterX="2736.000000" | 光学设计位置的X轴坐标中心，单位：像素。 |
| CalibratedOpticalCenterY="1824.000000" | 光学设计位置的Y轴坐标中心，单位：像素。 |
| RtkFlag="50" | RTK状态。（前面文章有说明）[大疆/千寻卫星后处理解算信息说明](/2020/11/05/DJI-PPK-Format-Meaning/) |
| RtkStdLon="0.01160" | 照片记录的标准偏差（以米为单位）在经度方向上的位置。当标准图像的偏差大于0.1，为建议不要使用此照片。 |
| RtkStdLat="0.01095" | 照片记录的标准偏差（以米为单位）在纬度方向上的位置。当标准图像的偏差大于0.1，为建议不要使用此照片。 |
| RtkStdHgt="0.02918" | 照片记录的标准偏差（以米为单位）在高度方向上的位置。当标准图像的偏差大于0.1，为建议不要使用此照片。 |
| DewarpData= "... ..." | 畸变纠正参数。（前面文章有说明）[相机内参和畸变校正参数说明](/2020/09/29/camera-calibrate/) |

---
*版权声明：*
*除非注明，本博文章均为原创，转载请以链接形式标明本文地址。*
---