import type { BilingualText } from './resume';

export interface FlagshipProject {
  id: string;
  code: string;
  name: BilingualText;
  badge: BilingualText;
  tagline: BilingualText;
  description: BilingualText;
  icon: string;
  accent: string;
  stars?: string;
  metrics: BilingualText;
  stack: string[];
  liveUrl?: string;
  repoUrl: string;
}

export const flagshipProjects: FlagshipProject[] = [
  {
    id: 'cesium-workbench',
    code: 'OSS_01 // 3D_EARTH_WORKBENCH',
    name: {
      zh: 'Cesium-Workbench',
      en: 'Cesium-Workbench',
    },
    badge: { zh: '旗舰开源 · 95+ Stars', en: 'Flagship OSS · 95+ Stars' },
    tagline: {
      zh: 'AI 友好的开源三维地球工作台',
      en: 'AI-Friendly Open-Source 3D Geospatial Workbench',
    },
    description: {
      zh: '基于 Vue 3 + TypeScript + CesiumJS 打造的生产级三维地理空间工作台，原生集成 3D Tiles、glTF、GeoJSON 加载管线、空间测量分析工具与高精度镜头状态输出。',
      en: 'Production-grade 3D Earth workbench built with Vue 3, TypeScript, and CesiumJS — featuring 3D Tiles, glTF, GeoJSON pipelines, spatial analysis tools, and camera telemetry export.',
    },
    icon: '/brand/product_cesium_gis.svg',
    accent: '#338AAF',
    stars: '95+',
    metrics: { zh: '28+ Forks · 持续迭代', en: '28+ Forks · Active R&D' },
    stack: ['Vue 3', 'TypeScript', 'CesiumJS', '3D Tiles', 'glTF', 'Vite'],
    liveUrl: 'https://cesium-workbench.github.io/',
    repoUrl: 'https://github.com/tanghaojie/Cesium-Workbench',
  },
  {
    id: 'cyber-ai-forge',
    code: 'OSS_02 // ENTERPRISE_AI_SCAFFOLD',
    name: {
      zh: 'Cyber-AI-Forge',
      en: 'Cyber-AI-Forge',
    },
    badge: { zh: '开源工程底座 · 22+ Stars', en: 'AI-Native Scaffold · 22+ Stars' },
    tagline: {
      zh: 'AI 驱动的企业级应用智能构建平台',
      en: 'AI-Native Enterprise Application Scaffold',
    },
    description: {
      zh: '面向企业级复杂业务场景的 AI-Native 应用研发底座，统一上下文架构规约、模块化领域边界与全栈自动化交付工作流。',
      en: 'Enterprise-grade AI-Native application scaffold integrating structured context rules, modular domain boundaries, and full-stack delivery workflows.',
    },
    icon: '/brand/master_09.svg',
    accent: '#E5B66A',
    stars: '22+',
    metrics: { zh: 'TypeScript 开源架构', en: 'Open-Source Architecture' },
    stack: ['AI-Native', 'TypeScript', 'Clean Architecture', 'Full-Stack'],
    liveUrl: 'https://tanghaojie.github.io/Cyber-AI-Forge/',
    repoUrl: 'https://github.com/tanghaojie/Cyber-AI-Forge',
  },
  {
    id: 'coaiforge',
    code: 'OSS_03 // HUMAN_AGENT_CLI',
    name: {
      zh: 'CoAIForge (create-coaiforge)',
      en: 'CoAIForge (create-coaiforge)',
    },
    badge: { zh: 'NPM 开源 CLI', en: 'Published NPM CLI' },
    tagline: {
      zh: '面向人类工程师与 AI Agent 协同的软件工程套件',
      en: 'AI-Native Software Engineering for Humans & Agents',
    },
    description: {
      zh: '支持通过 npx create-coaiforge 一键初始化人机协同工程目录，让大模型智能体与研发团队在标准化契约下协同编码与演进。',
      en: 'One-command CLI (npx create-coaiforge) bootstrapping human-agent collaborative repositories with standardized engineering contracts.',
    },
    icon: '/brand/product_finance.svg',
    accent: '#F2C97E',
    metrics: { zh: 'NPM 官方源可一键安装', en: 'Available via npx on NPM' },
    stack: ['AI Agent', 'Node.js', 'CLI', 'Software Engineering', 'NPM'],
    liveUrl: 'https://www.npmjs.com/package/create-coaiforge',
    repoUrl: 'https://github.com/tanghaojie/CoAIForge',
  },
  {
    id: 'wechat-editor',
    code: 'OSS_04 // MARKDOWN_TYPESETTER',
    name: {
      zh: 'JLabWeChatEditor',
      en: 'JLabWeChatEditor',
    },
    badge: { zh: '开源创作工具', en: 'Open-Source Tooling' },
    tagline: {
      zh: 'Markdown 转微信公众号在线实时排版编辑器',
      en: 'Online Markdown-to-WeChat Real-Time Typesetting Editor',
    },
    description: {
      zh: '专为技术内容创作者打造的开源双栏实时排版工具，支持代码语法高亮、数学公式、自定义样式主题与一键无损复制到公众号后台。',
      en: 'Split-pane real-time Markdown typesetting engine for technical writers with syntax highlighting, theme customization, and one-click WeChat copy.',
    },
    icon: '/brand/product_markdown.svg',
    accent: '#2263EC',
    metrics: { zh: '在线即开即用', en: 'Zero-Install Web App' },
    stack: ['TypeScript', 'Vue 3', 'Markdown AST', 'CSS Themes'],
    liveUrl: 'https://wechateditor.github.io/',
    repoUrl: 'https://github.com/tanghaojie/JLabWeChatEditor',
  },
  {
    id: 'brief-history-of-ai',
    code: 'OSS_05 // OPEN_PUBLICATION',
    name: {
      zh: 'A Brief History of AI · AI 简史',
      en: 'A Brief History of AI',
    },
    badge: { zh: '精选开源著作', en: 'Open-Source Book' },
    tagline: {
      zh: '系统梳理从早期人工智能范式到 LLM、RAG 与自主 Agent 的演进脉络',
      en: 'Systematic Evolution from Early AI Paradigms to LLM, RAG & Autonomous Agents',
    },
    description: {
      zh: '以工程师视角抽丝剥茧，厘清人工智能历次范式转移的技术本质，贯通大模型预训练、检索增强生成、工具调用与多智能体自主工作流。',
      en: 'An engineer-first open chronicle dissecting paradigm shifts in Artificial Intelligence — bridging foundational neural nets to modern RAG and Agent workflows.',
    },
    icon: '/brand/product_ip_site.svg',
    accent: '#63CFA1',
    metrics: { zh: '体系化开源知识库', en: 'Systematic Knowledge Repo' },
    stack: ['AI Evolution', 'LLM', 'RAG', 'AI Agent', 'Workflows'],
    repoUrl: 'https://github.com/tanghaojie/A-Brief-History-of-Al',
  },
  {
    id: 'interactive-oss-labs',
    code: 'OSS_06 // GRAPHICS_&_COLLAB',
    name: {
      zh: 'Neural Playground & Pinia Collab',
      en: 'Neural Playground & Pinia Collab',
    },
    badge: { zh: '算法与协同开源集', en: 'WebGL & State Sync OSS' },
    tagline: {
      zh: '浏览器端神经网络可视化游乐场与 Vue 实时协同状态库',
      en: 'Interactive Neural Network Playground & Real-Time Pinia Sync',
    },
    description: {
      zh: '融合底层算法直觉与前端交互工程的开源实验项目：包含可交互调参的浏览器端神经网络决策边界推演，以及跨客户端实时状态同步插件。',
      en: 'Open-source experiments uniting algorithm visualization and frontend state architecture — browser neural net decision boundaries and real-time Pinia sync.',
    },
    icon: '/brand/product_chrome_ext.svg',
    accent: '#338AAF',
    metrics: { zh: '含在线交互演示', en: 'Interactive Live Demo' },
    stack: ['TypeScript', 'Vue 3', 'Pinia', 'Neural Network', 'WebGL'],
    liveUrl: 'https://neural-network-playground.vercel.app/',
    repoUrl: 'https://github.com/tanghaojie/neural-network-playground',
  },
];
