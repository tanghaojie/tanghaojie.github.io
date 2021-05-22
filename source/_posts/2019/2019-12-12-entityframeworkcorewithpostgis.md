---
title: Postgis和EntityFrameworkCore的关系映射，几何字段映射
top: false
cover: false
toc: false
mathjax: false
comment: true
date: 2019-12-12 21:02:03
author:
img:
coverImg:
password:
summary:
categories:
  - .net core
  - GIS
tags:
  - .net core
  - GIS
---

`这篇文章主要讨论Code First模式，其他模式我不怎么用的，不敢保证`

&emsp;&emsp;现在搞开发数据库操作基本上都用 Orm 了吧，但是我们搞 GIS 的，因为涉及到空间几何字段、空间拓扑运算操作的情况，很多时候传统的 Orm 就解决不了了，所以很多时候要么就直接用 odbc 原生 Sql 操作了；或者是业务部分 EF+空间几何 Sql 这么来操作。这两个方案实现起来确实没什么问题，但前者用起来实在麻烦，很多简单的东西就搞复杂了，要么统一封装一下的话就又回到 Orm 的路子上；后者是最灵活的一种方案了，任何需求都可以用这个办法来解决，但问题就是整个软件的框架会显得很混乱，新人来了经常问为啥要这样搞，思维切换起来很麻烦，如果要改需求还涉及到空间几何的话，那只能打一架好了...

&emsp;&emsp;之前的 DotnetFramework+Npgsql+EF 是不支持使用 PostGIS 扩展的，官方一直也没明确表态后续规划什么的，直到最近在 github 上看到开发者说以后应该不会支持了，会把重心放到 EF Core 上。因此，想要直接映射几何字段几乎变成了不可能的事情。

> _网上有用 SharpMap 做映射的解决方案，但是我一直没有测试成功过_ > _官方的数据类型映射表里面也写了 System.Data.Spatial.DbGeometry 可以映射到 Geometry 类型。这个能在 CodeFirst 下识别，但生成的字段类型并不是 Geometry，而是 Byte[]，我也不知道哪错了，诶_

&emsp;&emsp;直到最近我打算把平台切换到.NetCore，然后去研究了一下，整个人就豁然开朗了啊。1.微软官方明确表态实现几何类型的字段。2.Npgsql 的 Core 版本确实在实现 Postgis 的东西，而且进度神速。那么，就用呗~

依赖很简单，就两个包：

```powershell
1.Npgsql.EntityFrameworkCore.PostgreSQL
2.Npgsql.EntityFrameworkCore.PostgreSQL.NetTopologySuite
```

然后是配置，首先数据库里面要启用 Postgis，简单：`Create Extension Postgis;`
EFCore 框架：

```csharp
dbContextOptions.UseNpgsql(connectionString, o => o.UseNetTopologySuite()); //这在哪自己找一下

//这在你的DbContext里面
protected override void OnModelCreating(ModelBuilder builder)
{
    builder.HasPostgresExtension("postgis"); //启用postgis扩展，需要手动写扩展名也是有原因的哦
}
```

齐活了，就这么简单。
使用的话就很简单了：

```csharp
using NetTopologySuite.Geometries;
public class TestGeometry{
  [Column(TypeName = "geometry (MultiLineString)")] //可以指定类型、维度、坐标系
  public MultiLineString Geom { get; set; }
}
```

有了这个后续的操作就简单多了：

```csharp
Geom.Area //面积
Geom.AsBinary() //转wkb
Geom.AsText() //同ToString()，转wkt
...
...
```

就不一一列举了，官方文档很全面的。

**_ 补充一下其他的坑吧，转 .Net Core 以后，Gdal 会成为一个很大的问题，这个需要好好的评估一下，Gdal 目前还没有官方做 Core 的适配，这个影响挺大的。当然 Gdal 的功能也有相应各个独立的库能替换的，但始终不会像 Gdal 这么得心应手，一定要注意评估这一点！！！ _**

---

_版权声明：_
_除非注明，本博文章均为原创，转载请以链接形式标明本文地址。_

---
