---
title: git commit规范化，设置Commitizen，符合Angular的规范
top: false
cover: false
toc: true
mathjax: false
comment: true
date: 2020-05-15 20:24:09
author:
keywords:
img:
coverImg:
password:
summary:
categories:
tags:
---
## 安装配置
[commitizen地址](https://github.com/commitizen/cz-cli)
[cz-conventional-changelo地址：规范要求，不同的适配器要求不同](https://github.com/commitizen/cz-conventional-changelog)
[conventional-changelog地址：生成changelog.md](https://github.com/ajoslin/conventional-changelog)
```
npm install -g commitizen
npm install -g cz-conventional-changelog
npm install -g conventional-changelog-cli
commitizen init cz-conventional-changelog --save-dev --save-exact
```
如果已经有其他适配器了，会报错，用  `--force` 替换掉，即：
```
commitizen init cz-conventional-changelog --save-dev --save-exact --force
```
## 使用
以后提交代码就用`git cz -m`替代`git commit -m`就好了，跟着提示走就没问题。  
type值：
|  值  | 描述  |
|  ----  | ----  |
| feat | 新增一个功能 |
| fix  |  修复一个Bug |
| docs  |  文档变更 |
| style  |  代码格式（不影响功能，例如空格、分号等格式修正） |
| refactor  |  代码重构 |
| perf  |  改善性能 |
| test  |  测试 |
| build  |  变更项目构建或外部依赖（例如scopes: webpack、gulp、npm等） |
| ci  |  更改持续集成软件的配置文件和package中的scripts命令，例如scopes: Travis, Circle等 |
| chore  |  变更构建流程或辅助工具 |
| revert  |  代码回退 |

生成changelog：
`conventional-changelog -p angular -i CHANGELOG.md -s`

---
*版权声明：*
*除非注明，本博文章均为原创，转载请以链接形式标明本文地址。*
---