---
title: Git修改Commit信息
top: false
cover: false
toc: true
mathjax: false
comment: false
date: 2024-07-03 21:43:23
author:
keywords:
img:
coverImg:
password:
summary:
categories:
tags:
---

## 天天写错 Git Commit, 天天 rebase，得记录标准流程了

> git log  #查看

> git rebase -i HEAD~3   #编辑倒数第3次，最近的为 倒数第1次，直接 git commit --amend 就行

> #vi 把要修改 commit 前面的 pick 修改为 edit ，然后保存

> #这时候使用 git log 可以查看回滚了 commit

> git commit --amend     # 修改提交信息

> git rebase --continue    # 恢复所有提交

---

_版权声明：_
_除非注明，本博文章均为原创，转载请以链接形式标明本文地址。_

---
