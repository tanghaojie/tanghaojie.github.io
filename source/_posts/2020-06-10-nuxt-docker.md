---
title: jenkins从github拉取nuxt项目部署到docker, windows平台
top: false
cover: false
toc: true
mathjax: false
comment: true
date: 2020-06-10 22:15:05
author:
keywords:
img:
coverImg:
password:
summary:
categories:
tags:
---

## 准备

### 环境

- 开发环境：win10
- 服务器 docker 宿主环境：win10
- docker 环境：linux
- jenkins 部署环境：docker

### 配置

- jenkins 插件：github、git、publish over ssh。  
  _提前要在全局工具配置里面配置 git，系统配置里面配置 github server、publish over SSH。这常用工具网上都有教程，不单独说了。有一个坑是，publish over SSH 连接 OpenSSH for windows，我用 key 始终不行， 点下面高级，用户名密码模式搞定的。_
- 服务器 win10：[OpenSSH for windows](https://github.com/PowerShell/openssh-portable)  
  _这个需要在你的 win10 服务器上配置，网上很多，我也是照着网上做的。_
- docker：node 镜像  
  _我用的 node 官方镜像生产的自己的镜像，你可以用自己习惯的。把 node 容器运行起来，`docker exec -it YourName /bin/bash`进入容器，执行`npm install -g cnpm --registry=https://registry.npm.taobao.org`配置淘宝源，新建 `/app`文件夹，之后代码构建和发布就都放这里了。然后把这个容器打包成镜像，名字随便，就叫`mynode:latest`（仓库：版本）。_

## 开始

- jenkins：  
  1.新建任务。  
  2.勾选 github 项目：填写地址：git@github.com:YourName/YourProject.git。  
  3.源码管理：选择 git，url 和上面一样，设置 Credentials，如果是 public 项目就不用设置。  
  4.轮询 SCM 或者 GitHub hook 自己看着办。  
  5.构建：选择执行 shell，命令写：`tar -zcvf frontend.tar.gz *`，意思是把所有代码打包到`frontend.tar.gz`。  
  6.构建：选择 Send files or execute commands over SSH。  
  6.1 SSH Server 选择之前配置好的。  
  6.2 Source files：`frontend.tar.gz`。  
  6.3 Remote directory：`/`（注意这个根目录是你之前配置好的 SSH Server 连接到的目录，比如你之前配置的`/d:/docker/`，那么这里就会把 frontend.tar.gz 上传到 d:/docker/frontend.tar.gz。windows SSH 连接 D 盘就是这么写的`/D:/`前面有个`/`）
  6.4 Exec command：`frontend.bat`。意思就是执行远端 windows 服务器上的`frontend.bat`文件，所以去远端服务器的`C:\Users\Administrator`下新建这个`frontend.bat`文件，Administrator 是你登录的用户名。连接默认就固定这个目录，我尝试了几个办法想把文件放 D 盘执行的，但一直不行，放弃了，`frontend.bat`里面写什么下面说。  
  7.保存。

- nuxt 项目：  
  1.上传代码的时候忽略`.nuxt node_modules 等等`这些文件，没啥好说的。  
  2.根目录添加`Dockerfile`。写入：

```
FROM mynode:latest
WORKDIR /app
COPY . /app
RUN cnpm install \
    && npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

简单解释一下，用 mynode （上面准备工作弄好了的）构建新镜像，设置工作目录`/app`，把当前所有文件拷贝到`/app`，（在工作目录）执行`cnpm install` 和 `npm run build`， 对外访问端口 3000，容器开始运行后（在工作目录）执行`npm run start`。  
这里构建发布容器，设置依赖，运行就弄好了。之后就是去 windows 服务器上执行脚本，每次构建之前删除旧的，运行新的。

- 服务器脚本（frontend.bat）：
  直接上内容：

```
d:                     # 切换到d盘
cd docker              # 到d:/docker这个文件夹
rd /S /Q frontend      # 删除d:/docker下，frontend这个文件夹
mkdir frontend         # 新建 frontend 文件夹
tar -xvf frontend.tar.gz -C ./frontend  # 解压jenkins打包上传过来的文件到frontend文件夹
cd frontend            # 到d:/docker/frontend这个文件夹
docker stop frontend      # 停止已运行容器
docker rm -v frontend     # 删除已存在容器
docker image rm frontend  # 删除镜像
docker build -t frontend:latest . # 运行Dockerfile打包生成新镜像：frontend:latest，注意最后有一个点，表示用当前目录下的Dockerfile来执行的
docker run -itd --restart=always --name frontend -p 3000:3000 frontend:latest   # 运行容器
```

到这里就全部完成了。去 jenkins 立即构建就 ok 了。

---

_版权声明：_
_除非注明，本博文章均为原创，转载请以链接形式标明本文地址。_

---
