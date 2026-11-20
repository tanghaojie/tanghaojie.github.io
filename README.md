# tanghaojie.github.io · 桀士 (Jackie Tang) 个人旗舰主页

> **四页独立信息架构**：`01 空间主场 (/)` · `02 在线履历 (/resume)` · `03 个人开源代表作品 (/works)` · `04 历史文章 (/posts)`

## 技术栈 (Tech Stack)

- **核心框架**：[Astro 5](https://astro.build/) + [Vue 3](https://vuejs.org/) + TypeScript
- **视觉与样式**：Tailwind CSS v4 + 钛金极客 Design Tokens (`src/styles/global.css`)
- **三维与动效**：Three.js (`MeshPhysicalMaterial` + `RoomEnvironment` PBR) + GSAP + Lenis 平滑滚动
- **内容与公式**：Astro Content Collections + Shiki 双主题代码高亮 + KaTeX 数学公式渲染
- **国际化**：中 / EN 一键无刷新响应式切换 (`src/i18n/useLang.ts`)

## 本地开发与构建

```bash
# 安装依赖
npm install

# 启动本地开发服务器 (http://localhost:4321)
npm run dev

# 编译生产静态站点至 dist/
npm run build

# 本地预览生产构建产物
npm run preview
```

## 日常内容维护指南

1. **完善/修改在线简历 (`/resume`)**：编辑 [`src/data/resume.ts`](./src/data/resume.ts)（模块化预留了个人信息、四大能力支柱与演进时间轴，支持中英双语字段）。
2. **增删个人开源代表作品 (`/works`)**：编辑 [`src/data/projects.ts`](./src/data/projects.ts)。
3. **新增/编辑历史文章 (`/posts`)**：在 `src/content/posts/` 对应年份目录下新增 `.md` 文件即可，历史文章保留原 `:year/:month/:day/:slug/` 永久链接兼容。

## GitHub Pages 自动部署说明

仓库已内置 [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml)：
1. 在 GitHub 仓库页面进入 **Settings → Pages**；
2. 将 **Build and deployment → Source** 切换为 **GitHub Actions**；
3. 此后每次推送代码至 `main` / `master` 分支，GitHub Actions 将自动执行 `npm run build` 并发布至 `https://tanghaojie.github.io/`。
- 注：重构前的旧版 Hexo 静态产物已完整备份在本地分支 `backup/legacy-hexo-2024`，原始 Hexo 源码仍保留于远程 `origin/hexo` 分支。
