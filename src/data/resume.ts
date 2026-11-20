/**
 * 在线简历数据配置中心 (Modular Online Resume Data Store)
 * --------------------------------------------------------------------------
 * 说明：当前为 v1 精简架构版（基于 GitHub @tanghaojie 与个人 IP 公开资料提炼）。
 * 后续补充完整履历材料时，直接在本文件扩展 experienceTimeline / certifications / highlights 即可，
 * 页面 UI 会自动响应式渲染中英文双语内容。
 */

export interface BilingualText {
  zh: string;
  en: string;
}

export interface CapabilityPillar {
  id: string;
  code: string;
  title: BilingualText;
  subtitle: BilingualText;
  summary: BilingualText;
  skills: string[];
  deliverables: BilingualText[];
  accentColor: string;
}

export interface CareerMilestone {
  period: string;
  role: BilingualText;
  domain: BilingualText;
  highlights: BilingualText[];
  tags: string[];
}

export const resumeProfile = {
  name: {
    zh: '唐浩桀 · 桀士',
    en: 'Jackie Tang (JieShi)',
  },
  title: {
    zh: '全栈研发工程师 · AI 应用探索者 · 3D GIS 空间架构师',
    en: 'Full-Stack Engineer · AI Explorer · 3D GIS Spatial Architect',
  },
  labBrand: {
    zh: '桀士 AI 实验室 (JieShi AI Lab)',
    en: 'JieShi AI Lab · jtlab.space',
  },
  location: {
    zh: '中国 · 端到端全栈独立交付',
    en: 'China · End-to-End Production Delivery',
  },
  manifesto: {
    zh: '热衷于利用现代技术构建智能应用的全栈研发工程师。兼具顶层系统架构推演与脚踏实地的工程落地能力——直来直去、证据校验、用代码与数据说话，只做真实可用的生产级交付。',
    en: 'Full-Stack Engineer passionate about building intelligent applications with modern engineering rigor. Combining top-level architectural design with pragmatic end-to-end execution — shipping verifiable, production-grade software.',
  },
  metrics: [
    {
      value: '2015',
      suffix: '+',
      label: { zh: 'GitHub 开源深耕', en: 'GitHub Engineering Since' },
    },
    {
      value: '60',
      suffix: '+',
      label: { zh: '公开工程仓库', en: 'Public Repositories' },
    },
    {
      value: '64',
      suffix: '+',
      label: { zh: '原创技术沉淀文章', en: 'Technical Articles' },
    },
    {
      value: '4',
      suffix: 'X',
      label: { zh: '跨界技术纵深支柱', en: 'Core Tech Domains' },
    },
  ],
  pillars: [
    {
      id: 'ai-agent',
      code: 'PILLAR_01 // AI_NATIVE',
      title: {
        zh: 'AI 智能体与大模型工程化',
        en: 'AI Agent & LLM Engineering',
      },
      subtitle: {
        zh: 'LLM · RAG · Agent Tool Calling · 自主工作流',
        en: 'LLM Apps · RAG · Autonomous Workflows · Digital Human',
      },
      summary: {
        zh: '深入探索大语言模型应用、RAG 知识检索、AI Agent 工具调用、智能工作流与 AI 数字人，持续构建 AI-Native 企业级应用脚手架与知识体系。',
        en: 'Building LLM applications, Retrieval-Augmented Generation, tool-calling AI Agents, automated workflows, and AI-Native enterprise application scaffolds.',
      },
      skills: ['LLM Application', 'RAG', 'AI Agent', 'Tool Calling', 'AI Workflow', 'AI Digital Human', 'Prompt Engineering'],
      deliverables: [
        { zh: 'Cyber-AI-Forge 企业级 AI 智能构建平台', en: 'Cyber-AI-Forge Enterprise AI Scaffold' },
        { zh: 'CoAIForge 面向人机协同的软件工程套件', en: 'CoAIForge Human-Agent Engineering CLI' },
        { zh: '《A Brief History of AI · AI 简史》系统著作', en: 'Author of "A Brief History of AI"' },
      ],
      accentColor: '#E5B66A',
    },
    {
      id: 'fullstack',
      code: 'PILLAR_02 // FULL_STACK',
      title: {
        zh: '现代全栈开发与端到端交付',
        en: 'Modern Full-Stack & Production Delivery',
      },
      subtitle: {
        zh: 'Java / Node.js / TS / Python × Vue 3 / React',
        en: 'Java / Node.js / TS / Python × Vue 3 / React',
      },
      summary: {
        zh: '覆盖后端微服务、空间/时序数据库与现代前端框架，具备从 0 到 1 架构设计、接口契约、UI 交互到容器化生产部署的完整单兵闭环能力。',
        en: 'End-to-end delivery spanning backend services, spatial/time-series databases, modern reactive frontends, and containerized production deployment.',
      },
      skills: ['Java', 'Node.js', 'TypeScript', 'Python', 'Vue 3', 'React', 'UniApp', 'PostgreSQL', 'IoTDB', 'Docker'],
      deliverables: [
        { zh: 'jtlab.space 理财数据观测站独立上线运营', en: 'jtlab.space Quantitative Data Observatory' },
        { zh: 'JLabWeChatEditor 在线排版引擎与浏览器插件', en: 'JLabWeChatEditor & Browser Extension Suite' },
        { zh: 'vue-pinia-collaborative 实时协同状态方案', en: 'Real-time State Collaboration Architecture' },
      ],
      accentColor: '#63CFA1',
    },
    {
      id: 'gis-3d',
      code: 'PILLAR_03 // SPATIAL_3D',
      title: {
        zh: '3D GIS 与数字城市空间科技',
        en: '3D GIS & Digital City Systems',
      },
      subtitle: {
        zh: 'CesiumJS · 3D Tiles · 数字孪生 · 空间计算',
        en: 'CesiumJS · 3D Tiles · Geospatial Twin · PostGIS',
      },
      summary: {
        zh: '深耕 GIS 平台架构、空间数据拓扑管理、二三维地理信息可视化、室内外楼层空间建模、IoT 物联网融合与智慧城市指挥调度大屏研发。',
        en: 'Architecting 2D/3D geospatial platforms, 3D Tiles/glTF rendering pipelines, IoT-GIS fusion, indoor-outdoor spatial twins, and smart-city command centers.',
      },
      skills: ['CesiumJS', '3D Tiles', 'glTF', 'WebGL / Three.js', 'PostGIS', 'QGIS', 'UAV RTK/PPK', 'Smart City'],
      deliverables: [
        { zh: 'Cesium-Workbench 开源三维地球工作台 (95+ ⭐)', en: 'Cesium-Workbench Open-Source 3D Earth IDE (95+ ⭐)' },
        { zh: '空间几何算法、大地水准面与无人机航测工具链', en: 'Geospatial Algorithms & Photogrammetry Tooling' },
        { zh: '城市级三维数字孪生与物联网可视化大屏体系', en: 'Digital City & IoT Spatial Command Platforms' },
      ],
      accentColor: '#338AAF',
    },
    {
      id: 'web3-writing',
      code: 'PILLAR_04 // WEB3_&_INSIGHT',
      title: {
        zh: '区块链 Web3 与技术内容创作',
        en: 'Blockchain Web3 & Technical Writing',
      },
      subtitle: {
        zh: 'Solidity 智能合约 · NFT · 深度工程写作',
        en: 'Solidity · Smart Contracts · Technical Authorship',
      },
      summary: {
        zh: '具备 Solidity 智能合约、NFT 应用及「AI 数字人 + Web3」融合探索经验；主理公众号「桀士AI实验室」，持续输出硬核工程实践。',
        en: 'Hands-on experience with Solidity smart contracts, NFT dApps, and AI Digital Human + Web3 convergence; creator of "JieShi AI Lab" technical column.',
      },
      skills: ['Solidity', 'Ethereum', 'Smart Contracts', 'NFT App', 'Technical Writing', 'System Design'],
      deliverables: [
        { zh: '智能合约与 AI 数字人链上确权融合探索', en: 'Smart Contracts & AI Digital Human NFT R&D' },
        { zh: '64+ 篇涵盖图形学、GIS、全栈与 AI 的原创长文', en: '64+ In-depth Engineering & Math Articles' },
        { zh: '微信公众号「桀士AI实验室」主理人', en: 'Founder & Writer of "JieShi AI Lab"' },
      ],
      accentColor: '#F2C97E',
    },
  ] satisfies CapabilityPillar[],

  // 预留时间轴槽位：当前以技术演进阶段呈现，后续可直接替换为具体履历条目
  evolutionStages: [
    {
      period: '2025 — PRESENT',
      role: {
        zh: 'AI-Native 全栈架构与智能体产品矩阵构建',
        en: 'AI-Native Full-Stack Architecture & Agent Ecosystem',
      },
      domain: {
        zh: 'LLM / RAG / AI Agent · 独立数字产品矩阵',
        en: 'LLM / RAG / AI Agent · Independent Product Matrix',
      },
      highlights: [
        {
          zh: '设计并开源 Cyber-AI-Forge、CoAIForge 与 AI 友好的三维工作台 Cesium-Workbench，构建人机协同研发工作流。',
          en: 'Architected Cyber-AI-Forge, CoAIForge, and AI-friendly Cesium-Workbench for human-agent collaborative engineering.',
        },
        {
          zh: '推进大模型 RAG、智能体工具调用与多款现代化 Web 全栈数字产品的端到端研发与生产部署。',
          en: 'Delivered LLM RAG pipelines, tool-calling AI Agents, and modern full-stack web applications end-to-end.',
        },
      ],
      tags: ['AI Agent', 'RAG', 'TypeScript', 'Vue 3', 'CesiumJS'],
    },
    {
      period: '2022 — 2024',
      role: {
        zh: '全栈平台工程 · 三维可视化底层与 Web3 探索',
        en: 'Full-Stack Platform Engineering · 3D Graphics & Web3',
      },
      domain: {
        zh: '数字城市平台 · WebGL/图形学 · 智能合约',
        en: 'Digital City Platforms · WebGL Math · Smart Contracts',
      },
      highlights: [
        {
          zh: '深耕三维空间可视化引擎、IoTDB 时序数据与 GIS 融合调度平台，探索实时协同架构与 Solidity 链上应用。',
          en: 'Engineered 3D spatial visualization platforms, IoTDB + GIS data pipelines, real-time collaboration, and Solidity dApps.',
        },
      ],
      tags: ['Java', 'Node.js', 'PostgreSQL', 'IoTDB', 'Solidity'],
    },
    {
      period: '2019 — 2021',
      role: {
        zh: 'GIS 空间平台研发 · 航测几何算法与跨端工程',
        en: 'Geospatial Platform R&D · Photogrammetry & Cross-Platform',
      },
      domain: {
        zh: '3D Tiles / PostGIS / 无人机 RTK-PPK / 跨端应用',
        en: '3D Tiles / PostGIS / UAV RTK-PPK / Flutter & UniApp',
      },
      highlights: [
        {
          zh: '研发空间几何计算、3D Tiles 规范解析、大疆 RTK/PPK 解算与相机标定工具链，沉淀数十篇高口碑 GIS 工程文章。',
          en: 'Built computational geometry, 3D Tiles parsers, UAV RTK/PPK & camera calibration tools, publishing 60+ technical posts.',
        },
      ],
      tags: ['PostGIS', '3D Tiles', 'Python', 'C# / .NET Core', 'Flutter'],
    },
  ] satisfies CareerMilestone[],
};
