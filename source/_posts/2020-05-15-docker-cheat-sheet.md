---
title: docker速查表
top: false
cover: false
toc: true
mathjax: false
comment: true
date: 2020-05-15 21:50:41
author:
keywords:
img:
coverImg:
password:
summary:
categories:
tags:
---

## 容器（Container）

### 生命周期  

* [`docker create`](https://docs.docker.com/engine/reference/commandline/create) 创建容器但不启动它。
* [`docker rename`](https://docs.docker.com/engine/reference/commandline/rename/) 用于重命名容器。
* [`docker run`](https://docs.docker.com/engine/reference/commandline/run) 一键创建并同时启动该容器。
* [`docker rm`](https://docs.docker.com/engine/reference/commandline/rm) 删除容器。
* [`docker update`](https://docs.docker.com/engine/reference/commandline/update/) 调整容器的资源限制。

#### 常用参数

`docker run --rm` 临时容器，容器停止之后删除它。  
`docker run -d container_id`，`-d` 表示自动将容器与终端分离（也就是说在后台运行容器，并输出容器 ID）


### 启动和停止

* [`docker start`](https://docs.docker.com/engine/reference/commandline/start) 启动已存在的容器。
* [`docker stop`](https://docs.docker.com/engine/reference/commandline/stop) 停止运行中的容器。
* [`docker restart`](https://docs.docker.com/engine/reference/commandline/restart) 重启容器。
* [`docker pause`](https://docs.docker.com/engine/reference/commandline/pause/) 暂停运行中的容器，将其「冻结」在当前状态。
* [`docker unpause`](https://docs.docker.com/engine/reference/commandline/unpause/) 结束容器暂停状态。
* [`docker wait`](https://docs.docker.com/engine/reference/commandline/wait) 阻塞地等待某个运行中的容器直到停止。
* [`docker kill`](https://docs.docker.com/engine/reference/commandline/kill) 向运行中的容器发送 SIGKILL 指令。
* [`docker attach`](https://docs.docker.com/engine/reference/commandline/attach) 连接到运行中的容器。


### 信息

* [`docker ps`](https://docs.docker.com/engine/reference/commandline/ps) 查看运行中的所有容器。
* [`docker logs`](https://docs.docker.com/engine/reference/commandline/logs) 从容器中读取日志。（你也可以使用自定义日志驱动，不过在 1.10 中，它只支持 `json-file` 和 `journald`）。
* [`docker inspect`](https://docs.docker.com/engine/reference/commandline/inspect) 查看某个容器的所有信息（包括 IP 地址）。
* [`docker events`](https://docs.docker.com/engine/reference/commandline/events) 从容器中获取事件 (events)。
* [`docker port`](https://docs.docker.com/engine/reference/commandline/port) 查看容器的公开端口。
* [`docker top`](https://docs.docker.com/engine/reference/commandline/top) 查看容器中活动进程。
* [`docker stats`](https://docs.docker.com/engine/reference/commandline/stats) 查看容器的资源使用量统计信息。
* [`docker diff`](https://docs.docker.com/engine/reference/commandline/diff) 查看容器文件系统中存在改动的文件。

#### 常用参数

`docker ps -a` 显示所有容器，包括运行中和已停止的。
`docker stats --all` 同样将显示所有容器，默认仅显示运行中的容器。


### 导入 / 导出

* [`docker cp`](https://docs.docker.com/engine/reference/commandline/cp) 在容器和本地文件系统之间复制文件或目录。
* [`docker export`](https://docs.docker.com/engine/reference/commandline/export) 将容器的文件系统打包为归档文件流 (tarball archive stream) 并输出至标准输出 (STDOUT)。

### 执行命令

* [`docker exec`](https://docs.docker.com/engine/reference/commandline/exec) 在容器内执行命令。

例如，进入正在运行的 `foo` 容器，并连接 (attach) 到一个新的 Shell 进程：`docker exec -it foo /bin/bash`。




## 镜像(Images)

### 生命周期

* [`docker images`](https://docs.docker.com/engine/reference/commandline/images) 查看所有镜像。
* [`docker import`](https://docs.docker.com/engine/reference/commandline/import) 从归档文件创建镜像。
* [`docker build`](https://docs.docker.com/engine/reference/commandline/build) 从 Dockerfile 创建镜像。
* [`docker commit`](https://docs.docker.com/engine/reference/commandline/commit) 为容器创建镜像，如果容器正在运行则会临时暂停。
* [`docker rmi`](https://docs.docker.com/engine/reference/commandline/rmi) 删除镜像。
* [`docker load`](https://docs.docker.com/engine/reference/commandline/load) 从标准输入 (STDIN) 加载归档包 (tar archive) 作为镜像，包括镜像本身和标签 (tags, 0.7 起)。
* [`docker save`](https://docs.docker.com/engine/reference/commandline/save) 将镜像打包为归档包，并输出至标准输出 (STDOUT)，包括所有的父层、标签和版本 (parent layers, tags, versions, 0.7 起)。

### 其它信息

* [`docker history`](https://docs.docker.com/engine/reference/commandline/history) 查看镜像的历史记录。
* [`docker tag`](https://docs.docker.com/engine/reference/commandline/tag) 给镜像打标签命名（本地或者仓库均可）。




## 网络(Networks)

### 生命周期

* [`docker network create`](https://docs.docker.com/engine/reference/commandline/network_create/)
* [`docker network rm`](https://docs.docker.com/engine/reference/commandline/network_rm/)

### 其它信息

* [`docker network ls`](https://docs.docker.com/engine/reference/commandline/network_ls/)
* [`docker network inspect`](https://docs.docker.com/engine/reference/commandline/network_inspect/)

### 建立连接

* [`docker network connect`](https://docs.docker.com/engine/reference/commandline/network_connect/)
* [`docker network disconnect`](https://docs.docker.com/engine/reference/commandline/network_disconnect/)


## 仓库(Repository)

* [`docker login`](https://docs.docker.com/engine/reference/commandline/login) 登入仓管中心。
* [`docker logout`](https://docs.docker.com/engine/reference/commandline/logout) 登出仓管中心。
* [`docker search`](https://docs.docker.com/engine/reference/commandline/search) 从仓管中心检索镜像。
* [`docker pull`](https://docs.docker.com/engine/reference/commandline/pull) 从仓管中心拉取镜像到本地。
* [`docker push`](https://docs.docker.com/engine/reference/commandline/push) 从本地推送镜像到仓管中心。

---
*版权声明：*
*除非注明，本博文章均为原创，转载请以链接形式标明本文地址。*
---