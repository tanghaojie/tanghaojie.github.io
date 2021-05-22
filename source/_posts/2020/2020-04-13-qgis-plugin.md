---
title: QGIS plugin开发使用
top: false
cover: false
toc: false
mathjax: false
comment: true
date: 2020-04-12 10:17:00
author:
keywords:
img:
coverImg:
password:
summary:
categories:
  - QGIS
  - python
tags:
  - QGIS
  - python
---

## 起步

1.刚来就不建议看文档手动创建 plugin 了，python 很熟悉的人可以看文档试试，否则还是别手动创建了，几乎所有的开发者都是通过`Plugin Builder`这个 Plugin 来创建的 Plugin，安装好了以后，打开 Plugin Builder，根据提示输入内容，一直下一步就创建好了。 2.用 `pyrcc5 -o resources.py resources.qrc`命令，把 resources.qrc 资源文件转换成 py 文件，主程序 test.py 文件中已经自动引入了。如果没有`pyrcc5`命令，执行`pip install PyQt5`安装 PyQt。 3.把整个生成的文件夹，拷贝到，`~\AppData\Roaming\QGIS\QGIS3\profiles\default\python\plugins` 下面，所有的 plugin 其实都在这里。 4.打开 qgis 插件--已安装，勾选 test 插件，就可以看到菜单上多了按钮，点击就能打开了。

#### 以上最原始的 demo 就能够看见了，下面说说怎么自己写代码

5.插件有一个 test*dialog.py 文件，里面最关键的一句代码应该是`FORM_CLASS, * = uic.loadUiType(os.path.join(os.path.dirname(**file**), 'Test_dialog_base.ui'))`，这就是加载转换.ui文件给pyqt用的。 6.生成的插件文件，包含了Test_dialog_base.ui，就是界面文件。安装QGIS的时候自带了Qt Designer，用Designer就可以打开就能看到和编辑了，这里从左边拖一个Push Button进去，后面用。编辑完成界面，去QGIS里面，取消勾选，在重新选中，就重新加载插件了，能够看出来结果。这里推荐一个插件 `Plugin Reloader`，不用每次去取消重勾选，它可以帮我们重加载插件。 7.点击事件，在.ui文件对应的.py文件的构造函数，`**init**`中，加上`self.pushButton.clicked.connect(self.pushButtonClicked)`，文件头导入`from PyQt5.QtWidgets import QMessageBox`然后定义方法：

```python
def pushButtonClicked(self):
    QMessageBox.warning(None, 'info', '测试')
```

8.去 QGIS 里面 reload 插件，点击按钮就能看到结果了。 9.更多的东西就自己尝试咯，你已经入门了。

---

_版权声明：_
_除非注明，本博文章均为原创，转载请以链接形式标明本文地址。_

---
