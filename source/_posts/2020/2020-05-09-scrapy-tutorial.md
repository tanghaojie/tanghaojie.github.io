---
title: Scrapy爬虫使用
top: false
cover: false
toc: true
mathjax: false
comment: true
date: 2020-05-09 21:20:01
author:
keywords:
img:
coverImg:
password:
summary:
categories:
  - scrapy
  - python
tags:
  - scrapy
  - python
---

## 飞速起步

- 安装 scrapy
  `pip install Scrapy`（_类 unix 记得加 `sudo`_）  
  安装完成以后，到命令行输入`Scrapy`，查看是否安装成功。

## 准备和配置

- `scrapy startproject [name]`创建项目。
- 项目文件说明
  > items.py：数据模型，类似于 dto、orm 中的 model  
  > spiders：爬虫程序  
  > middlewares.py：模型中的中间件  
  > pipelines.py：管道，对 item 进行处理，类似于很多服务器的请求管道  
  > settings.py：程序设置,主要是一些优先级设置,优先级越高,值越小  
  > scrapy.cfg：配置
- 基础设置  
  settings.py 中，找到`ROBOTSTXT_OBEY = True`，改为`ROBOTSTXT_OBEY = False`或者把他注释了  
  这东西的意思是：每个网站可以在根目录下放一个 robots.txt 的文件，文件里面告诉了爬虫哪些网址是可以爬的，当然这就是个君子协议，靠你自己选择是不是要遵守。
- 设置 UTF-8：  
  settings.py 中，添加一行：`FEED_EXPORT_ENCODING = 'utf-8'`
- 生成爬虫
  命令行输入：`scrapy genspider [文件名] [网址]`，生成爬虫文件。可以在 spiders 文件夹下面看到。

## 开始代码

- item：自己写一个 item

```python
class yourItem(scrapy.Item):
    info1 = scrapy.Field()
    info2 = scrapy.Field()
```

info1、info2，就是数据模型对应的字段，看 scrapy.Item 的源码，实际上就是个 dict
所以可以这样理解：

```json
{
  "info1": None,
  "info2": None
}
```

- spider

```python
from name.items import yourItem
class YourSpider(scrapy.Spider):
    name = 'yourname'
    allowed_domains = ['xxx.com']
    start_urls = ['http://xxx.com/yyy/zzz']

    def parse(self, response):
        info1 = response.xpath('//div/a/text()').extract_first() #第一个
        info2 = response.xpath('//div/a/text()').extract() #extract 永远返回一个数组
        item = yourItem()
        item['info1'] = info1
        item['info2'] = info2
        yield item
```

没啥好说的，就是爬取信息，然后设置 item 的属性就好。

- 可以爬了！！  
  命令行输入：`scrapy crawl yourname -o filename.csv`，yourname 对应 YourSpider 这个类的 name 变量值。就会爬取数据放到 filename.csv 中，还有其他格式，自己研究。
- pipelines  
  如果你不想用 scrapy 默认的保存文件方法，那么就自定义一个保存文件的管道：

```python
class YourPipeline(object):
    def process_item(self, item, spider):
        # 伪代码
        # open file
        # file.write(item.info1)
        # file.write(item.info2)
        # save and close file
        return item
```

之后到 settings.py，输入：

```
ITEM_PIPELINES = {
    'name.pipelines.YourPipeline': 300,
}
```

启动当前管道配置优先级，数字越小，优先级越靠前，然后就只需要输入`scrapy crawl yourname`就可以运行和保存了

- 调试  
  我用万能 vscode：新建调试配置文件，输入

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Scrapy",
      "type": "python",
      "request": "launch",
      "module": "scrapy",
      "args": ["crawl", "yourname"]
    }
  ]
}
```

- 搞定！

---

_版权声明：_
_除非注明，本博文章均为原创，转载请以链接形式标明本文地址。_

---
