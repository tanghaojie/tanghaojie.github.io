---
title: git速查表
top: false
cover: false
toc: false
mathjax: false
comment: true
date: 2020-05-14 16:20:07
author:
keywords:
img:
coverImg:
password:
summary:
categories:
  - git
  - cheat sheet
tags:
  - git
  - cheat sheet
---

git 从远程拉取代码、推代码的步骤

如果是几个人共同管理项目，并且你的队友在你之前推过代码，那你就需要 git pull 一下，把代码拉到本地，解决一下冲突，再执行以下步骤，将本地代码推到远程仓库。

> git status #git 仓库状态

> git add \* #更新的代码添加到暂存区

> git commit -m "msg" #将暂存区的更新提交到仓库区

> git pull #先 git pull,拉取远程仓库所有分支更新并合并到本地

> git push origin master #将本地分支的更新全部推送到远程仓库

> git reset --mixed \[哈希码\] #回滚到这个哈希码，将本地归档区和缓冲区也进行回滚

> git reset --hard \[哈希码\] #使用强制还原这个哈希码

> git reset --soft \[哈希码\] #回滚到这个哈希码，只将本地归档区回滚

> git revert \[哈希码\] #只是针对这个哈希码版本进行删除回滚操作

> git log #查看日志

> git reflog #查看操作记录，能找到之前的操作记录和哈希码

多分支开发

> git branch -v #查看我们当前有哪些分支？

> git branch \[name\] #创建 name 分支

> git checkout \[name\] #切换到 name 分支

> git checkout -b \[name\] #创建并切换到 name 分支

> git merge \[name\] 将 name 分支合并到 master 分支

查看远端

> git remove -v

添加多个远端

> git remote set-url --add origin http://xxxxx/xxx/adsdsdsdcelery-demo.git

---

_版权声明：_
_除非注明，本博文章均为原创，转载请以链接形式标明本文地址。_

---
