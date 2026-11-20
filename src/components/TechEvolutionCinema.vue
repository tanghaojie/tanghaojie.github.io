<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { useLang } from '../i18n/useLang';

const props = withDefaults(
  defineProps<{
    autoStart?: boolean;
  }>(),
  {
    autoStart: true,
  }
);

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const { isZh } = useLang();

const canvasHostRef = ref<HTMLElement | null>(null);
const isPlaying = ref(false);
const isMuted = ref(false);
const audioBlocked = ref(false);
const hasStarted = ref(false);
const currentTime = ref(0);
const isFinished = ref(false);
const activeStageIdx = ref(0);

const DURATION = 30.0; // Continuous 30s single-take Three.js evolution film

interface EvolutionStage {
  id: string;
  num: string;
  era: string;
  start: number;
  end: number;
  shortZh: string;
  shortEn: string;
  accent: string;
  title: { zh: string; en: string };
  subtitle: { zh: string; en: string };
  metricValue: string;
  metricLabel: { zh: string; en: string };
  tags: string[];
}

const stages: EvolutionStage[] = [
  {
    id: 'gis-2d',
    num: '01',
    era: '2018 — 2019',
    start: 0.0,
    end: 4.3,
    shortZh: '2D GIS',
    shortEn: '2D GIS',
    accent: '#38BDF8',
    title: {
      zh: '二维经纬 · 空间坐标的起点',
      en: '2D GIS · Mapping the Flat Earth',
    },
    subtitle: {
      zh: 'WGS84 经纬基准 · PostGIS 矢量拓扑 · 无人机 RTK/PPK 厘米级航测',
      en: 'WGS84 Datum · PostGIS Spatial Topology · UAV RTK/PPK Centimeter Survey',
    },
    metricValue: '±1.0 cm',
    metricLabel: { zh: 'UAV RTK/PPK 空间解算', en: 'UAV RTK/PPK Accuracy' },
    tags: ['WGS84 / EPSG:4326', 'PostGIS', 'QGIS Plugin', 'UAV RTK/PPK'],
  },
  {
    id: 'gis-3d',
    num: '02',
    era: '2020 — 2021',
    start: 4.3,
    end: 8.8,
    shortZh: '3D GIS',
    shortEn: '3D GIS',
    accent: '#60A5FA',
    title: {
      zh: '维度升起 · 从平面到三维数字地球',
      en: '3D GIS · Rising into Digital Earth',
    },
    subtitle: {
      zh: '二维矢量基底拔地而起 · CesiumJS · OGC 3D Tiles / glTF · Cesium-Workbench',
      en: '2D Footprints Extrude Skyward · CesiumJS · OGC 3D Tiles · Cesium-Workbench',
    },
    metricValue: '95+ ★',
    metricLabel: { zh: 'Cesium-Workbench 开源三维工作台', en: 'Cesium-Workbench OSS' },
    tags: ['CesiumJS', 'OGC 3D Tiles', 'glTF 2.0', 'EGM96 Geoid'],
  },
  {
    id: 'systems',
    num: '03',
    era: '2021 — 2022',
    start: 8.8,
    end: 13.0,
    shortZh: '信息化系统',
    shortEn: 'Systems',
    accent: '#E5B66A',
    title: {
      zh: '信息化系统 · 构筑城市数字底座',
      en: 'Information Systems · Urban Digital Backbone',
    },
    subtitle: {
      zh: '全栈工程脉络贯通三维空间 · Java / .NET / TS / Vue 3 · 清晰架构与容器化交付',
      en: 'Full-Stack Arteries Illuminating the 3D City · Clean Architecture & Cloud Delivery',
    },
    metricValue: '0 → 1',
    metricLabel: { zh: '全栈端到端生产交付', en: 'End-to-End Full-Stack Ship' },
    tags: ['Clean Architecture', 'Vue 3 / TS', 'Java / .NET', 'Docker Cluster'],
  },
  {
    id: 'bigdata',
    num: '04',
    era: '2022 — 2023',
    start: 13.0,
    end: 17.2,
    shortZh: '大数据',
    shortEn: 'Big Data',
    accent: '#63CFA1',
    title: {
      zh: '时空大数据 · 万物感知汇流成海',
      en: 'Big Data · Real-Time Spatial Telemetry',
    },
    subtitle: {
      zh: '物理楼宇与传感节点升腾时空数据洪流 · Apache IoTDB · 实时协同状态流',
      en: 'Urban IoT Telemetry Rising into Data Rivers · Apache IoTDB · Real-Time Sync',
    },
    metricValue: '100W+',
    metricLabel: { zh: 'IoTDB 百万级时序测点', en: 'IoTDB Time-Series Nodes' },
    tags: ['Apache IoTDB', '100W+ Nodes', 'Pinia Collab', 'Edge Telemetry'],
  },
  {
    id: 'ai',
    num: '05',
    era: '2023 — 2024',
    start: 17.2,
    end: 21.4,
    shortZh: 'AI 大模型',
    shortEn: 'AI Era',
    accent: '#A78BFA',
    title: {
      zh: 'AI 觉醒 · 凌驾空间之上的认知星云',
      en: 'AI Awakening · Cognitive Constellation Above',
    },
    subtitle: {
      zh: '海量数据凝聚为三维神经网络与大模型语义脑 · 《AI 简史》· RAG 检索引擎',
      en: 'Data Streams Coalesce into a 3D Neural Brain · A Brief History of AI · RAG',
    },
    metricValue: 'LLM · RAG',
    metricLabel: { zh: '《AI 简史》与大模型应用', en: 'A Brief History of AI & RAG' },
    tags: ['Transformer', 'A Brief History of AI', 'Neural Playground', 'RAG Engine'],
  },
  {
    id: 'agent',
    num: '06',
    era: '2024 — 2025',
    start: 21.4,
    end: 25.4,
    shortZh: 'Agent 智能',
    shortEn: 'AI Agents',
    accent: '#F59E0B',
    title: {
      zh: 'Agent 智能 · 自主协同反哺现实世界',
      en: 'AI Agents · Autonomous Orchestration',
    },
    subtitle: {
      zh: '智能体编队从认知大脑降临城市上空 · Cyber-AI-Forge (22★) · CoAIForge CLI',
      en: 'Autonomous Agents Deploying Across the City · Cyber-AI-Forge & CoAIForge CLI',
    },
    metricValue: '22+ ★',
    metricLabel: { zh: 'Cyber-AI-Forge · 人机协同工程', en: 'Cyber-AI-Forge & CoAIForge' },
    tags: ['Cyber-AI-Forge', 'create-coaiforge', 'ReAct Agent', 'Tool Calling'],
  },
  {
    id: 'twin',
    num: '07',
    era: '2025 — 2026+',
    start: 25.4,
    end: 30.0,
    shortZh: 'AI 数字孪生',
    shortEn: 'AI Twin / XR',
    accent: '#F2C97E',
    title: {
      zh: '智能时代 · 虚实共生的 AI 数字孪生',
      en: 'The Intelligent Era · AI Digital Twin & XR',
    },
    subtitle: {
      zh: '2D 基底 × 3D 城市 × 信息系统 × 时空数据 × AI 智能体 — 融为一体，持续演进',
      en: '2D Datum × 3D City × Systems × Data × Cognitive Agents — Unified Living Twin',
    },
    metricValue: 'GIS × AI × XR',
    metricLabel: { zh: '十年技术演进 · 交付未来', en: 'Decade Evolution · Continuum' },
    tags: ['AI Digital Twin', 'Spatial XR', 'AI Digital Human', '2026+ Continuum'],
  },
];

const currentStage = computed(() => stages[activeStageIdx.value] ?? stages[0]);
const progressPercent = computed(() => Math.min(100, (currentTime.value / DURATION) * 100));
const formattedTime = computed(() => {
  const s = Math.floor(currentTime.value);
  const ds = Math.floor((currentTime.value % 1) * 10);
  return `00:${String(s).padStart(2, '0')}.${ds}`;
});

// =========================================================================
// CINEMATIC AMBIENT-ORCHESTRAL SOUNDTRACK (Web Audio API · No EDM Bounce)
// Warm evolving string pads + delicate crystalline piano arpeggio + sub cello
// =========================================================================
let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let delayNode: DelayNode | null = null;
let delayFeedback: GainNode | null = null;
let padFilter: BiquadFilterNode | null = null;
let musicTimer = 0;
let lastNoteIdx = -1;
let lastChordIdx = -1;

// D Major / B Minor uplifting cinematic progression across the 30s journey
const CHORD_SEQUENCE: Array<{ start: number; root: number; notes: number[] }> = [
  { start: 0.0, root: 61.74, notes: [123.47, 185.0, 220.0, 293.66] }, // Bm7 (2D Origin, contemplative)
  { start: 4.3, root: 49.0, notes: [146.83, 196.0, 246.94, 369.99] }, // Gmaj7 (3D Rising wonder)
  { start: 8.8, root: 73.42, notes: [146.83, 220.0, 293.66, 369.99] }, // Dmaj7 (Systems architecture)
  { start: 13.0, root: 55.0, notes: [164.81, 220.0, 277.18, 329.63] }, // Aadd9 (Big Data lifting)
  { start: 17.2, root: 61.74, notes: [146.83, 185.0, 246.94, 369.99, 440.0] }, // Bm9 (AI Cognition)
  { start: 21.4, root: 49.0, notes: [146.83, 196.0, 293.66, 369.99, 493.88] }, // Gmaj9 (Agent expansion)
  { start: 25.4, root: 73.42, notes: [146.83, 220.0, 293.66, 369.99, 440.0, 587.33] }, // Dmaj9 Epic Resolution
];

// Contemplative glass-piano motif (D major pentatonic / cinematic intervals)
const PIANO_MOTIF = [
  293.66, 369.99, 440.0, 587.33, 554.37, 440.0, 369.99, 329.63,
  293.66, 392.0, 493.88, 587.33, 659.25, 587.33, 493.88, 440.0,
];

function ensureAudioContext(): boolean {
  if (typeof window === 'undefined') return false;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return false;
    audioCtx = new AudioContextClass();

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(isMuted.value ? 0 : 0.42, audioCtx.currentTime);

    // Subtle lush stereo-like echo bus for cinematic depth
    delayNode = audioCtx.createDelay(1.2);
    delayNode.delayTime.value = 0.36;
    delayFeedback = audioCtx.createGain();
    delayFeedback.gain.value = 0.34;
    const delayFilter = audioCtx.createBiquadFilter();
    delayFilter.type = 'lowpass';
    delayFilter.frequency.value = 2100;

    delayNode.connect(delayFilter);
    delayFilter.connect(delayFeedback);
    delayFeedback.connect(delayNode);
    delayFilter.connect(masterGain);

    padFilter = audioCtx.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.value = 650;
    padFilter.Q.value = 0.7;
    padFilter.connect(masterGain);

    masterGain.connect(audioCtx.destination);
  }

  if (audioCtx.state === 'suspended') {
    audioCtx
      .resume()
      .then(() => {
        audioBlocked.value = audioCtx?.state !== 'running';
      })
      .catch(() => {
        audioBlocked.value = true;
      });
  }
  audioBlocked.value = audioCtx.state !== 'running';
  return audioCtx.state === 'running';
}

function triggerCinematicChord(chord: { root: number; notes: number[] }, eraProgress: number) {
  if (!audioCtx || !padFilter || !masterGain) return;
  const now = audioCtx.currentTime;
  const dur = 4.6;

  // Gradually open filter brightness across the 30s evolution arc
  const targetCutoff = 480 + eraProgress * 1900;
  padFilter.frequency.cancelScheduledValues(now);
  padFilter.frequency.setTargetAtTime(targetCutoff, now, 1.2);

  // Warm Sub-Cello Bass Foundation
  const bassOsc = audioCtx.createOscillator();
  const bassGain = audioCtx.createGain();
  bassOsc.type = 'triangle';
  bassOsc.frequency.setValueAtTime(chord.root, now);
  bassGain.gain.setValueAtTime(0.001, now);
  bassGain.gain.linearRampToValueAtTime(0.24, now + 0.8);
  bassGain.gain.exponentialRampToValueAtTime(0.001, now + dur);
  bassOsc.connect(bassGain);
  bassGain.connect(padFilter);
  bassOsc.start(now);
  bassOsc.stop(now + dur + 0.05);

  // Lush Detuned String Pad Voices
  chord.notes.forEach((freq, idx) => {
    if (!audioCtx || !padFilter) return;
    const oscA = audioCtx.createOscillator();
    const oscB = audioCtx.createOscillator();
    const g = audioCtx.createGain();

    oscA.type = 'sawtooth';
    oscB.type = 'sine';
    oscA.frequency.setValueAtTime(freq * (1 + (idx % 2 === 0 ? 0.0025 : -0.0025)), now);
    oscB.frequency.setValueAtTime(freq, now);

    const peak = 0.055 / Math.sqrt(chord.notes.length);
    g.gain.setValueAtTime(0.0008, now);
    g.gain.linearRampToValueAtTime(peak, now + 1.1);
    g.gain.exponentialRampToValueAtTime(0.0008, now + dur);

    oscA.connect(g);
    oscB.connect(g);
    g.connect(padFilter);
    oscA.start(now);
    oscB.start(now);
    oscA.stop(now + dur + 0.05);
    oscB.stop(now + dur + 0.05);
  });

  // Soft Ethereal Milestone Bell Shimmer
  const chimeFreq = chord.notes[chord.notes.length - 1] * 2;
  const chime = audioCtx.createOscillator();
  const chimeGain = audioCtx.createGain();
  chime.type = 'sine';
  chime.frequency.setValueAtTime(chimeFreq, now);
  chimeGain.gain.setValueAtTime(0.001, now);
  chimeGain.gain.linearRampToValueAtTime(0.048, now + 0.04);
  chimeGain.gain.exponentialRampToValueAtTime(0.0005, now + 2.4);
  chime.connect(chimeGain);
  chimeGain.connect(masterGain);
  if (delayNode) chimeGain.connect(delayNode);
  chime.start(now);
  chime.stop(now + 2.5);
}

function triggerFeltPianoNote(freq: number, intensity = 1) {
  if (!audioCtx || !masterGain) return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const harmonic = audioCtx.createOscillator();
  const filter = audioCtx.createBiquadFilter();
  const gain = audioCtx.createGain();

  osc.type = 'triangle';
  harmonic.type = 'sine';
  osc.frequency.setValueAtTime(freq, now);
  harmonic.frequency.setValueAtTime(freq * 2, now);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2200, now);
  filter.frequency.exponentialRampToValueAtTime(520, now + 1.3);

  const vol = 0.075 * intensity;
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(vol, now + 0.018);
  gain.gain.exponentialRampToValueAtTime(0.0006, now + 1.65);

  const hGain = audioCtx.createGain();
  hGain.gain.value = 0.25;

  osc.connect(filter);
  harmonic.connect(hGain);
  hGain.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  if (delayNode) gain.connect(delayNode);

  osc.start(now);
  harmonic.start(now);
  osc.stop(now + 1.75);
  harmonic.stop(now + 1.75);
}

function updateAmbientScore(t: number) {
  if (!audioCtx || audioCtx.state !== 'running' || !isPlaying.value || isMuted.value) return;

  // Chord transitions aligned to era timestamps
  let cIdx = 0;
  for (let i = CHORD_SEQUENCE.length - 1; i >= 0; i--) {
    if (t >= CHORD_SEQUENCE[i].start) {
      cIdx = i;
      break;
    }
  }
  if (cIdx !== lastChordIdx) {
    lastChordIdx = cIdx;
    triggerCinematicChord(CHORD_SEQUENCE[cIdx], t / DURATION);
  }

  // Gentle evolving piano arpeggio pulse (~0.42s intervals, accelerating subtly in intelligence eras)
  const noteStep = t > 17.2 ? 0.36 : 0.48;
  const nIdx = Math.floor(t / noteStep);
  if (nIdx !== lastNoteIdx) {
    lastNoteIdx = nIdx;
    const baseFreq = PIANO_MOTIF[nIdx % PIANO_MOTIF.length];
    const oct = t > 21.4 && nIdx % 3 === 0 ? 2 : t < 4.3 ? 0.5 : 1;
    triggerFeltPianoNote(baseFreq * oct, 0.72 + (t / DURATION) * 0.35);
  }
}

// =========================================================================
// CONTINUOUS SINGLE-TAKE THREE.JS 3D EVOLUTION WORLD
// 2D GIS -> 3D GIS Extrusion -> Information Systems -> Big Data -> AI -> Agents -> AI Digital Twin
// =========================================================================
let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let rafId = 0;
let lastTimestamp = 0;

// Smooth pointer parallax for subtle living depth
const mouseNorm = { x: 0, y: 0 };
const smoothMouse = { x: 0, y: 0 };

// Procedural glow texture
let softGlowTex: THREE.CanvasTexture | null = null;

// Layer 1: 2D GIS Datum Plane, Graticule, Footprint Outlines, Contour Rings, UAV Survey Path
let gis2DGroup: THREE.Group | null = null;
let scanSweepLine: THREE.Mesh | null = null;
let uavPathLine: THREE.Line | null = null;
let uavDot: THREE.Mesh | null = null;
let uavCurve: THREE.CatmullRomCurve3 | null = null;
let footprintLines: THREE.LineSegments | null = null;
const rtkCrosshairs: THREE.Mesh[] = [];

// Layer 2: 3D GIS City Extrusion (InstancedMesh Buildings + Roof Beacons + Geodetic Satellite Track)
interface BuildingSpec {
  x: number;
  z: number;
  w: number;
  d: number;
  targetH: number;
  dist: number;
  isLandmark: boolean;
  phase: number;
}
let buildingSpecs: BuildingSpec[] = [];
let buildingsMesh: THREE.InstancedMesh | null = null;
let buildingCapsMesh: THREE.InstancedMesh | null = null;
let buildingWireframes: THREE.LineSegments | null = null;
let cesiumOrbitGroup: THREE.Group | null = null;
let cesiumSatellite: THREE.Mesh | null = null;
const dummyObj = new THREE.Object3D();

// Layer 3: Enterprise Information Systems (Glowing Urban Fiber Arteries + District Command Hubs)
let systemsGroup: THREE.Group | null = null;
const arteryCurves: Array<{
  curve: THREE.CatmullRomCurve3;
  line: THREE.Line;
  totalPoints: number;
  packet: THREE.Mesh;
  speed: number;
  offset: number;
}> = [];
const hubRings: Array<{ mesh: THREE.Mesh; baseScale: number; phase: number }> = [];

// Layer 4: Big Data Time-Series Telemetry (Rising IoT Particles + Vertical Data Filaments + Arc Streams)
let bigDataGroup: THREE.Group | null = null;
let iotParticles: THREE.Points | null = null;
let iotBasePositions: Float32Array | null = null;
let iotVelocities: Float32Array | null = null;
const dataRiverArcs: Array<{
  curve: THREE.CatmullRomCurve3;
  line: THREE.Line;
  totalPoints: number;
  orb: THREE.Mesh;
  offset: number;
}> = [];

// Layer 5: AI Cognitive Neural Constellation (Floating Above the 3D City)
let aiBrainGroup: THREE.Group | null = null;
let aiSynapseLines: THREE.LineSegments | null = null;
let aiNodesMesh: THREE.InstancedMesh | null = null;
const aiNodePositions: THREE.Vector3[] = [];
const aiSynapsePulses: Array<{ a: THREE.Vector3; b: THREE.Vector3; mesh: THREE.Mesh; speed: number; offset: number }> = [];

// Layer 6: Autonomous AI Agents (Faceted Octahedron Fleet + Scan Cones + Collaboration Arcs)
let agentsGroup: THREE.Group | null = null;
interface AgentUnit {
  group: THREE.Group;
  core: THREE.Mesh;
  ring: THREE.Mesh;
  beam: THREE.Mesh;
  orbitRadius: number;
  orbitSpeed: number;
  orbitAngle: number;
  baseY: number;
  targetBuilding: THREE.Vector3;
}
const agentUnits: AgentUnit[] = [];
let agentCollabLines: THREE.LineSegments | null = null;

// Layer 7: AI Digital Twin / Spatial XR Holographic Dome & Continuum Rings
let twinDomeGroup: THREE.Group | null = null;
let twinOuterSphere: THREE.Mesh | null = null;
let twinInnerSphere: THREE.Mesh | null = null;
const twinHorizonRings: THREE.Mesh[] = [];

// Continuous Camera Splines (Position + LookAt) across 0s -> 30s
let camPosCurve: THREE.CatmullRomCurve3 | null = null;
let camTargetCurve: THREE.CatmullRomCurve3 | null = null;

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function easeOutCubic(x: number): number {
  const t = clamp01(x);
  return 1 - Math.pow(1 - t, 3);
}

function createGlowTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.28, 'rgba(255,255,255,0.72)');
  g.addColorStop(0.65, 'rgba(255,255,255,0.16)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function seededRand(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function buildEvolutionWorld() {
  const host = canvasHostRef.value;
  if (!host) return;

  const w = Math.max(320, host.clientWidth);
  const h = Math.max(200, host.clientHeight);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x04070e);
  scene.fog = new THREE.FogExp2(0x04070e, 0.0029);

  camera = new THREE.PerspectiveCamera(42, w / h, 0.5, 900);
  camera.position.set(0, 148, 0.5);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(w, h);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.24;
  host.innerHTML = '';
  host.appendChild(renderer.domElement);

  softGlowTex = createGlowTexture();

  // Studio Architectural Lighting
  const hemi = new THREE.HemisphereLight(0x7cc4fa, 0x0b101d, 0.9);
  scene.add(hemi);

  const dirKey = new THREE.DirectionalLight(0xf6d594, 2.2);
  dirKey.position.set(85, 140, 75);
  scene.add(dirKey);

  const dirRim = new THREE.DirectionalLight(0x38bdf8, 1.35);
  dirRim.position.set(-90, 80, -85);
  scene.add(dirRim);

  const brainGlow = new THREE.PointLight(0xa78bfa, 2.6, 180);
  brainGlow.position.set(0, 52, 0);
  scene.add(brainGlow);

  // Subtle ambient starfield dome in deep background
  const starGeo = new THREE.BufferGeometry();
  const starCount = 700;
  const starPos = new Float32Array(starCount * 3);
  const rand = seededRand(202609);
  for (let i = 0; i < starCount; i++) {
    const r = 210 + rand() * 190;
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPos[i * 3 + 1] = Math.abs(r * Math.cos(phi)) + 15;
    starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({
    color: 0xdbeafe,
    size: 1.5,
    map: softGlowTex,
    transparent: true,
    opacity: 0.45,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  scene.add(new THREE.Points(starGeo, starMat));

  // -----------------------------------------------------------------------
  // BUILD CITY FOOTPRINT LAYOUT (Shared by Layer 1 2D GIS & Layer 2 3D GIS!)
  // -----------------------------------------------------------------------
  buildingSpecs = [];
  const gridHalf = 7;
  const blockSpacing = 11.5;

  for (let gx = -gridHalf; gx <= gridHalf; gx++) {
    for (let gz = -gridHalf; gz <= gridHalf; gz++) {
      // Leave clean arterial avenues along X=0 and Z=0
      if (gx === 0 || gz === 0) continue;
      const dist = Math.hypot(gx, gz);
      if (dist > 7.6) continue;
      // Sparse edge fade for natural urban boundary
      if (dist > 5.8 && rand() > 0.55) continue;

      const cx = gx * blockSpacing + (rand() - 0.5) * 1.4;
      const cz = gz * blockSpacing + (rand() - 0.5) * 1.4;
      const bw = 4.2 + rand() * 3.8;
      const bd = 4.2 + rand() * 3.8;
      const centerFactor = Math.max(0.18, 1 - dist / 8.2);
      const isLandmark = dist < 2.6 && rand() > 0.45;
      const targetH = isLandmark
        ? 24 + rand() * 18
        : 4.5 + centerFactor * centerFactor * 24 + rand() * 7;

      buildingSpecs.push({
        x: cx,
        z: cz,
        w: bw,
        d: bd,
        targetH,
        dist,
        isLandmark,
        phase: rand() * Math.PI * 2,
      });
    }
  }

  // -----------------------------------------------------------------------
  // LAYER 1: 2D GIS DATUM PLANE, GRATICULE, VECTOR FOOTPRINTS & UAV SURVEY
  // -----------------------------------------------------------------------
  gis2DGroup = new THREE.Group();
  scene.add(gis2DGroup);

  // Dark obsidian ground plane
  const groundGeo = new THREE.PlaneGeometry(420, 420);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x060b16,
    roughness: 0.92,
    metalness: 0.12,
  });
  const groundMesh = new THREE.Mesh(groundGeo, groundMat);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.y = -0.15;
  gis2DGroup.add(groundMesh);

  // Fine WGS84 Coordinate Grid
  const fineGrid = new THREE.GridHelper(240, 48, 0x38bdf8, 0x132742);
  (fineGrid.material as THREE.Material).transparent = true;
  (fineGrid.material as THREE.Material).opacity = 0.42;
  gis2DGroup.add(fineGrid);

  // Concentric Geodetic Range / Contour Rings on Y=0.05
  [26, 52, 78, 106].forEach((radius, idx) => {
    const rGeo = new THREE.RingGeometry(radius - 0.18, radius + 0.18, 96);
    const rMat = new THREE.MeshBasicMaterial({
      color: idx % 2 === 0 ? 0x38bdf8 : 0xe5b66a,
      transparent: true,
      opacity: idx === 0 ? 0.42 : 0.22,
      side: THREE.DoubleSide,
    });
    const rMesh = new THREE.Mesh(rGeo, rMat);
    rMesh.rotation.x = -Math.PI / 2;
    rMesh.position.y = 0.04;
    gis2DGroup!.add(rMesh);
  });

  // 2D Building Parcel Footprints (exact footprints from which 3D buildings extrude!)
  const fpVerts: number[] = [];
  buildingSpecs.forEach((b) => {
    const hw = b.w / 2;
    const hd = b.d / 2;
    const y = 0.08;
    const x0 = b.x - hw;
    const x1 = b.x + hw;
    const z0 = b.z - hd;
    const z1 = b.z + hd;
    fpVerts.push(
      x0, y, z0, x1, y, z0,
      x1, y, z0, x1, y, z1,
      x1, y, z1, x0, y, z1,
      x0, y, z1, x0, y, z0
    );
  });
  const fpGeo = new THREE.BufferGeometry();
  fpGeo.setAttribute('position', new THREE.Float32BufferAttribute(fpVerts, 3));
  const fpMat = new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.78,
  });
  footprintLines = new THREE.LineSegments(fpGeo, fpMat);
  gis2DGroup.add(footprintLines);

  // 2D Scanning Laser Sweep Bar moving smoothly across the map in Act I
  const sweepGeo = new THREE.PlaneGeometry(175, 1.4);
  const sweepMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  scanSweepLine = new THREE.Mesh(sweepGeo, sweepMat);
  scanSweepLine.rotation.x = -Math.PI / 2;
  scanSweepLine.position.set(0, 0.25, -80);
  gis2DGroup.add(scanSweepLine);

  // RTK / PPK Geodetic Survey Control Markers
  const rtkCoords = [
    [-46, -46],
    [46, -46],
    [46, 46],
    [-46, 46],
    [0, 0],
  ];
  rtkCrosshairs.length = 0;
  rtkCoords.forEach(([rx, rz]) => {
    const mGeo = new THREE.RingGeometry(1.6, 2.3, 24);
    const mMat = new THREE.MeshBasicMaterial({
      color: 0xf2c97e,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
    });
    const m = new THREE.Mesh(mGeo, mMat);
    m.rotation.x = -Math.PI / 2;
    m.position.set(rx, 0.14, rz);
    gis2DGroup!.add(m);
    rtkCrosshairs.push(m);
  });

  // UAV Photogrammetry Zig-Zag Flight Track on 2D Plane
  const uavPts = [
    new THREE.Vector3(-56, 0.5, -42),
    new THREE.Vector3(56, 0.5, -42),
    new THREE.Vector3(56, 0.5, -14),
    new THREE.Vector3(-56, 0.5, -14),
    new THREE.Vector3(-56, 0.5, 14),
    new THREE.Vector3(56, 0.5, 14),
    new THREE.Vector3(56, 0.5, 42),
    new THREE.Vector3(-56, 0.5, 42),
  ];
  uavCurve = new THREE.CatmullRomCurve3(uavPts, false, 'catmullrom', 0.12);
  const uavSampled = uavCurve.getPoints(180);
  const uavGeo = new THREE.BufferGeometry().setFromPoints(uavSampled);
  const uavMat = new THREE.LineBasicMaterial({
    color: 0xf2c97e,
    transparent: true,
    opacity: 0.72,
  });
  uavPathLine = new THREE.Line(uavGeo, uavMat);
  gis2DGroup.add(uavPathLine);

  const uavDotGeo = new THREE.SphereGeometry(1.1, 14, 14);
  const uavDotMat = new THREE.MeshBasicMaterial({ color: 0xfff8e1 });
  uavDot = new THREE.Mesh(uavDotGeo, uavDotMat);
  gis2DGroup.add(uavDot);

  // -----------------------------------------------------------------------
  // LAYER 2: 3D GIS EXTRUDING CITYSCAPE (InstancedMesh + Cesium Orbit Ring)
  // -----------------------------------------------------------------------
  // Base unit box shifted so bottom rests at Y = 0 -> scaling Y extrudes straight up from 2D footprint!
  const unitBoxGeo = new THREE.BoxGeometry(1, 1, 1);
  unitBoxGeo.translate(0, 0.5, 0);

  const bldgMat = new THREE.MeshStandardMaterial({
    color: 0x16253b,
    metalness: 0.62,
    roughness: 0.34,
    emissive: new THREE.Color(0x091324),
    emissiveIntensity: 0.75,
  });
  buildingsMesh = new THREE.InstancedMesh(unitBoxGeo, bldgMat, buildingSpecs.length);
  const tmpColor = new THREE.Color();
  buildingSpecs.forEach((b, i) => {
    if (b.isLandmark) {
      tmpColor.setHex(0x283e5e);
    } else if (i % 5 === 0) {
      tmpColor.setHex(0x1f3452);
    } else {
      tmpColor.setHex(0x122036);
    }
    buildingsMesh!.setColorAt(i, tmpColor);
  });
  if (buildingsMesh.instanceColor) buildingsMesh.instanceColor.needsUpdate = true;
  scene.add(buildingsMesh);

  // Luminous Titanium-Gold / Cyan Rooftop Cap Plates
  const capGeo = new THREE.BoxGeometry(1.02, 0.28, 1.02);
  const capMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.9,
  });
  buildingCapsMesh = new THREE.InstancedMesh(capGeo, capMat, buildingSpecs.length);
  buildingSpecs.forEach((b, i) => {
    tmpColor.setHex(b.isLandmark ? 0xf2c97e : 0x38bdf8);
    buildingCapsMesh!.setColorAt(i, tmpColor);
  });
  if (buildingCapsMesh.instanceColor) buildingCapsMesh.instanceColor.needsUpdate = true;
  scene.add(buildingCapsMesh);

  // Architectural Vertical Wireframe Edges for Landmarks (3D Tiles b3dm crisp aesthetic)
  const wirePositions: number[] = [];
  buildingSpecs.forEach((b) => {
    if (!b.isLandmark) return;
    const hw = b.w * 0.515;
    const hd = b.d * 0.515;
    const corners = [
      [b.x - hw, b.z - hd],
      [b.x + hw, b.z - hd],
      [b.x + hw, b.z + hd],
      [b.x - hw, b.z + hd],
    ];
    corners.forEach(([cx, cz]) => {
      wirePositions.push(cx, 0, cz, cx, b.targetH, cz);
    });
  });
  const wireGeo = new THREE.BufferGeometry();
  wireGeo.setAttribute('position', new THREE.Float32BufferAttribute(wirePositions, 3));
  const wireMat = new THREE.LineBasicMaterial({
    color: 0xe5b66a,
    transparent: true,
    opacity: 0,
  });
  buildingWireframes = new THREE.LineSegments(wireGeo, wireMat);
  scene.add(buildingWireframes);

  // Tilted -24° Geodetic Cesium Satellite Orbit Ring
  cesiumOrbitGroup = new THREE.Group();
  cesiumOrbitGroup.position.set(0, 14, 0);
  cesiumOrbitGroup.rotation.z = (-24 * Math.PI) / 180;
  cesiumOrbitGroup.rotation.x = 0.28;
  scene.add(cesiumOrbitGroup);

  const orbitRingGeo = new THREE.TorusGeometry(92, 0.28, 12, 128);
  const orbitRingMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0,
  });
  const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
  orbitRing.rotation.x = Math.PI / 2;
  cesiumOrbitGroup.add(orbitRing);

  const satGeo = new THREE.OctahedronGeometry(1.8, 0);
  const satMat = new THREE.MeshBasicMaterial({ color: 0xf2c97e, transparent: true, opacity: 0 });
  cesiumSatellite = new THREE.Mesh(satGeo, satMat);
  cesiumOrbitGroup.add(cesiumSatellite);

  // -----------------------------------------------------------------------
  // LAYER 3: ENTERPRISE INFORMATION SYSTEMS (Arterial Optical Buses + Hubs)
  // -----------------------------------------------------------------------
  systemsGroup = new THREE.Group();
  scene.add(systemsGroup);
  arteryCurves.length = 0;
  hubRings.length = 0;

  // Main cross-city arterial highways + orbital ring connecting district microservices
  const arteryDefs: THREE.Vector3[][] = [
    [new THREE.Vector3(-82, 0.5, 0), new THREE.Vector3(-25, 0.5, 0), new THREE.Vector3(25, 0.5, 0), new THREE.Vector3(82, 0.5, 0)],
    [new THREE.Vector3(0, 0.5, -82), new THREE.Vector3(0, 0.5, -25), new THREE.Vector3(0, 0.5, 25), new THREE.Vector3(0, 0.5, 82)],
    [new THREE.Vector3(-58, 0.7, -58), new THREE.Vector3(-22, 1.2, -18), new THREE.Vector3(0, 1.8, 0), new THREE.Vector3(22, 1.2, 18), new THREE.Vector3(58, 0.7, 58)],
    [new THREE.Vector3(58, 0.7, -58), new THREE.Vector3(22, 1.2, -18), new THREE.Vector3(0, 1.8, 0), new THREE.Vector3(-22, 1.2, 18), new THREE.Vector3(-58, 0.7, 58)],
    // Elevated inter-hub service bridges
    [new THREE.Vector3(-34, 14, -34), new THREE.Vector3(0, 22, -38), new THREE.Vector3(34, 14, -34)],
    [new THREE.Vector3(34, 14, -34), new THREE.Vector3(38, 22, 0), new THREE.Vector3(34, 14, 34)],
    [new THREE.Vector3(34, 14, 34), new THREE.Vector3(0, 22, 38), new THREE.Vector3(-34, 14, 34)],
    [new THREE.Vector3(-34, 14, 34), new THREE.Vector3(-38, 22, 0), new THREE.Vector3(-34, 14, -34)],
  ];

  arteryDefs.forEach((pts, idx) => {
    const curve = new THREE.CatmullRomCurve3(pts);
    const sampled = curve.getPoints(80);
    const geo = new THREE.BufferGeometry().setFromPoints(sampled);
    geo.setDrawRange(0, 0);
    const mat = new THREE.LineBasicMaterial({
      color: idx < 4 ? 0xe5b66a : 0x63cfa1,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const line = new THREE.Line(geo, mat);
    systemsGroup!.add(line);

    const pktGeo = new THREE.SphereGeometry(0.95, 10, 10);
    const pktMat = new THREE.MeshBasicMaterial({
      color: idx < 4 ? 0xfff3c4 : 0x6ee7b7,
      transparent: true,
      opacity: 0,
    });
    const packet = new THREE.Mesh(pktGeo, pktMat);
    systemsGroup!.add(packet);

    arteryCurves.push({
      curve,
      line,
      totalPoints: sampled.length,
      packet,
      speed: 0.28 + (idx % 3) * 0.08,
      offset: idx * 0.17,
    });
  });

  // District Microservice Command Hub Rings hovering cleanly over key city plazas
  const hubCoords = [
    { x: 0, y: 1.4, z: 0, r: 9.5 },
    { x: -34, y: 13.5, z: -34, r: 6.2 },
    { x: 34, y: 13.5, z: -34, r: 6.2 },
    { x: 34, y: 13.5, z: 34, r: 6.2 },
    { x: -34, y: 13.5, z: 34, r: 6.2 },
  ];
  hubCoords.forEach((hc, idx) => {
    const ringGeo = new THREE.RingGeometry(hc.r - 0.35, hc.r, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: idx === 0 ? 0xf2c97e : 0x63cfa1,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const mesh = new THREE.Mesh(ringGeo, ringMat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(hc.x, hc.y, hc.z);
    systemsGroup!.add(mesh);
    hubRings.push({ mesh, baseScale: 1, phase: idx * 1.1 });
  });

  // -----------------------------------------------------------------------
  // LAYER 4: BIG DATA TIME-SERIES TELEMETRY (Rising Aurora Particles & Rivers)
  // -----------------------------------------------------------------------
  bigDataGroup = new THREE.Group();
  scene.add(bigDataGroup);
  dataRiverArcs.length = 0;

  const pCount = 1500;
  const pPos = new Float32Array(pCount * 3);
  const pColors = new Float32Array(pCount * 3);
  iotBasePositions = new Float32Array(pCount * 3);
  iotVelocities = new Float32Array(pCount);

  const cEmerald = new THREE.Color(0x63cfa1);
  const cCyan = new THREE.Color(0x38bdf8);
  const cGold = new THREE.Color(0xf2c97e);

  for (let i = 0; i < pCount; i++) {
    const b = buildingSpecs[i % buildingSpecs.length];
    const px = b.x + (rand() - 0.5) * b.w * 0.9;
    const pz = b.z + (rand() - 0.5) * b.d * 0.9;
    const py = b.targetH * (0.6 + rand() * 0.45);
    iotBasePositions[i * 3] = px;
    iotBasePositions[i * 3 + 1] = py;
    iotBasePositions[i * 3 + 2] = pz;
    iotVelocities[i] = 0.22 + rand() * 0.55;

    pPos[i * 3] = px;
    pPos[i * 3 + 1] = py;
    pPos[i * 3 + 2] = pz;

    const col = i % 5 === 0 ? cGold : i % 2 === 0 ? cEmerald : cCyan;
    pColors[i * 3] = col.r;
    pColors[i * 3 + 1] = col.g;
    pColors[i * 3 + 2] = col.b;
  }

  const iotGeo = new THREE.BufferGeometry();
  iotGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  iotGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));
  const iotMat = new THREE.PointsMaterial({
    size: 2.1,
    map: softGlowTex,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  iotParticles = new THREE.Points(iotGeo, iotMat);
  bigDataGroup.add(iotParticles);

  // Sweeping Data Rivers converging from 8 urban sectors upward to the AI Brain focal height (Y=52)
  for (let i = 0; i < 8; i++) {
    const ang = (i * Math.PI * 2) / 8 + 0.3;
    const rStart = 54;
    const startPt = new THREE.Vector3(Math.cos(ang) * rStart, 10, Math.sin(ang) * rStart);
    const midPt1 = new THREE.Vector3(Math.cos(ang + 0.35) * 34, 30, Math.sin(ang + 0.35) * 34);
    const midPt2 = new THREE.Vector3(Math.cos(ang + 0.65) * 18, 45, Math.sin(ang + 0.65) * 18);
    const endPt = new THREE.Vector3(Math.cos(ang + 0.9) * 10, 52, Math.sin(ang + 0.9) * 10);

    const curve = new THREE.CatmullRomCurve3([startPt, midPt1, midPt2, endPt]);
    const sampled = curve.getPoints(64);
    const geo = new THREE.BufferGeometry().setFromPoints(sampled);
    geo.setDrawRange(0, 0);
    const mat = new THREE.LineBasicMaterial({
      color: i % 2 === 0 ? 0x63cfa1 : 0x38bdf8,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const line = new THREE.Line(geo, mat);
    bigDataGroup.add(line);

    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(0.85, 10, 10),
      new THREE.MeshBasicMaterial({ color: 0x99f6e4, transparent: true, opacity: 0 })
    );
    bigDataGroup.add(orb);

    dataRiverArcs.push({
      curve,
      line,
      totalPoints: sampled.length,
      orb,
      offset: i * 0.125,
    });
  }

  // -----------------------------------------------------------------------
  // LAYER 5: AI COGNITIVE NEURAL CONSTELLATION (Floating Above Skyline Y=54)
  // -----------------------------------------------------------------------
  aiBrainGroup = new THREE.Group();
  aiBrainGroup.position.set(0, 54, 0);
  scene.add(aiBrainGroup);
  aiNodePositions.length = 0;
  aiSynapsePulses.length = 0;

  const nodeCount = 56;
  for (let i = 0; i < nodeCount; i++) {
    // Fibonacci ellipsoid cloud floating gracefully above the metropolis
    const yNorm = 1 - (i / (nodeCount - 1)) * 2;
    const radAtY = Math.sqrt(Math.max(0, 1 - yNorm * yNorm));
    const goldenAngle = i * 2.3999632;
    const shellScale = i % 3 === 0 ? 0.56 : 1.0;
    const rx = Math.cos(goldenAngle) * radAtY * 26 * shellScale;
    const ry = yNorm * 13 * shellScale;
    const rz = Math.sin(goldenAngle) * radAtY * 26 * shellScale;
    aiNodePositions.push(new THREE.Vector3(rx, ry, rz));
  }

  const nodeGeo = new THREE.IcosahedronGeometry(0.95, 1);
  const nodeMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
  });
  aiNodesMesh = new THREE.InstancedMesh(nodeGeo, nodeMat, nodeCount);
  aiNodePositions.forEach((p, idx) => {
    dummyObj.position.copy(p);
    dummyObj.scale.setScalar(idx % 5 === 0 ? 1.45 : 0.9);
    dummyObj.updateMatrix();
    aiNodesMesh!.setMatrixAt(idx, dummyObj.matrix);
    tmpColor.setHex(idx % 4 === 0 ? 0xf2c97e : idx % 2 === 0 ? 0xa78bfa : 0x60a5fa);
    aiNodesMesh!.setColorAt(idx, tmpColor);
  });
  aiNodesMesh.instanceMatrix.needsUpdate = true;
  if (aiNodesMesh.instanceColor) aiNodesMesh.instanceColor.needsUpdate = true;
  aiBrainGroup.add(aiNodesMesh);

  // Synaptic Edges between nearby cognitive nodes
  const synVerts: number[] = [];
  const edgePairs: Array<[THREE.Vector3, THREE.Vector3]> = [];
  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      const d = aiNodePositions[i].distanceTo(aiNodePositions[j]);
      if (d < 15.5) {
        synVerts.push(
          aiNodePositions[i].x, aiNodePositions[i].y, aiNodePositions[i].z,
          aiNodePositions[j].x, aiNodePositions[j].y, aiNodePositions[j].z
        );
        if (edgePairs.length < 22 && rand() > 0.72) {
          edgePairs.push([aiNodePositions[i], aiNodePositions[j]]);
        }
      }
    }
  }
  const synGeo = new THREE.BufferGeometry();
  synGeo.setAttribute('position', new THREE.Float32BufferAttribute(synVerts, 3));
  const synMat = new THREE.LineBasicMaterial({
    color: 0xa78bfa,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
  });
  aiSynapseLines = new THREE.LineSegments(synGeo, synMat);
  aiBrainGroup.add(aiSynapseLines);

  // Travelling Cognitive Attention Pulses inside the AI Constellation
  edgePairs.forEach(([a, b], idx) => {
    const pMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.65, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xfde68a, transparent: true, opacity: 0 })
    );
    aiBrainGroup!.add(pMesh);
    aiSynapsePulses.push({
      a,
      b,
      mesh: pMesh,
      speed: 0.45 + (idx % 4) * 0.14,
      offset: idx * 0.19,
    });
  });

  // -----------------------------------------------------------------------
  // LAYER 6: AUTONOMOUS AI AGENTS (Patrolling Fleet + Scan Beams + Collab Web)
  // -----------------------------------------------------------------------
  agentsGroup = new THREE.Group();
  scene.add(agentsGroup);
  agentUnits.length = 0;

  const landmarks = buildingSpecs.filter((b) => b.isLandmark);
  const agentCount = 6;
  for (let i = 0; i < agentCount; i++) {
    const g = new THREE.Group();
    const core = new THREE.Mesh(
      new THREE.OctahedronGeometry(2.1, 0),
      new THREE.MeshStandardMaterial({
        color: 0xf2c97e,
        emissive: 0xd97706,
        emissiveIntensity: 0.65,
        metalness: 0.85,
        roughness: 0.2,
        transparent: true,
        opacity: 0,
      })
    );
    g.add(core);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.6, 0.16, 10, 40),
      new THREE.MeshBasicMaterial({
        color: 0x63cfa1,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      })
    );
    ring.rotation.x = Math.PI / 2;
    g.add(ring);

    // Translucent volumetric scan cone projecting down onto the 3D city
    const beamGeo = new THREE.ConeGeometry(5.5, 22, 24, 1, true);
    beamGeo.translate(0, -11, 0);
    const beam = new THREE.Mesh(
      beamGeo,
      new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    g.add(beam);

    agentsGroup.add(g);
    const lm = landmarks[i % Math.max(1, landmarks.length)] ?? buildingSpecs[i];
    agentUnits.push({
      group: g,
      core,
      ring,
      beam,
      orbitRadius: 34 + (i % 2) * 16,
      orbitSpeed: 0.34 + (i % 3) * 0.06,
      orbitAngle: (i * Math.PI * 2) / agentCount,
      baseY: 36 + (i % 3) * 5,
      targetBuilding: new THREE.Vector3(lm.x, lm.targetH, lm.z),
    });
  }

  // Dynamic Inter-Agent Collaboration Link Lines
  const collabGeo = new THREE.BufferGeometry();
  const collabVerts = new Float32Array(agentCount * 2 * 3);
  collabGeo.setAttribute('position', new THREE.BufferAttribute(collabVerts, 3));
  const collabMat = new THREE.LineBasicMaterial({
    color: 0xf2c97e,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
  });
  agentCollabLines = new THREE.LineSegments(collabGeo, collabMat);
  agentsGroup.add(agentCollabLines);

  // -----------------------------------------------------------------------
  // LAYER 7: AI DIGITAL TWIN / SPATIAL XR HOLOGRAPHIC DOME
  // -----------------------------------------------------------------------
  twinDomeGroup = new THREE.Group();
  twinDomeGroup.position.set(0, 10, 0);
  scene.add(twinDomeGroup);
  twinHorizonRings.length = 0;

  const outerGeo = new THREE.IcosahedronGeometry(96, 2);
  const outerMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    wireframe: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
  });
  twinOuterSphere = new THREE.Mesh(outerGeo, outerMat);
  twinDomeGroup.add(twinOuterSphere);

  const innerGeo = new THREE.IcosahedronGeometry(74, 1);
  const innerMat = new THREE.MeshBasicMaterial({
    color: 0xf2c97e,
    wireframe: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
  });
  twinInnerSphere = new THREE.Mesh(innerGeo, innerMat);
  twinDomeGroup.add(twinInnerSphere);

  [86, 104, 122].forEach((r, idx) => {
    const hRingGeo = new THREE.TorusGeometry(r, 0.24, 10, 128);
    const hRingMat = new THREE.MeshBasicMaterial({
      color: idx === 1 ? 0xf2c97e : 0x38bdf8,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const hRing = new THREE.Mesh(hRingGeo, hRingMat);
    hRing.rotation.x = Math.PI / 2 + (idx - 1) * 0.14;
    twinDomeGroup!.add(hRing);
    twinHorizonRings.push(hRing);
  });

  // -----------------------------------------------------------------------
  // CONTINUOUS ONE-SHOT CINEMATIC CAMERA SPLINES (0s -> 30s)
  // -----------------------------------------------------------------------
  camPosCurve = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(0, 148, 0.6),     // 0.0s: Pure Top-Down 2D GIS Map
      new THREE.Vector3(4, 126, 22),      // 4.3s: Gentle tilt begins (2D -> 3D)
      new THREE.Vector3(96, 56, 102),     // 8.8s: Sweeping 3D GIS Cityscape
      new THREE.Vector3(104, 34, -36),    // 13.0s: Low-altitude glide over Info Systems
      new THREE.Vector3(52, 54, -108),    // 17.2s: Ascending with IoT Big Data Aurora
      new THREE.Vector3(-92, 74, -56),    // 21.4s: Elevated orbit beside AI Neural Brain
      new THREE.Vector3(-98, 56, 78),     // 25.4s: Autonomous Agent Fleet over City
      new THREE.Vector3(0, 86, 178),      // 30.0s: Grand Panoramic AI Digital Twin Vista
    ],
    false,
    'centripetal'
  );

  camTargetCurve = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(0, 0, 0),    // 2D Plane
      new THREE.Vector3(0, 2, 0),    // Extrusion Base
      new THREE.Vector3(0, 14, 0),   // 3D Skyline
      new THREE.Vector3(0, 14, 0),   // Urban Systems
      new THREE.Vector3(0, 30, 0),   // Rising Big Data
      new THREE.Vector3(0, 48, 0),   // AI Neural Brain
      new THREE.Vector3(0, 34, 0),   // Agents + City
      new THREE.Vector3(0, 24, 0),   // Full Unified Twin
    ],
    false,
    'centripetal'
  );
}

// =========================================================================
// DETERMINISTIC FRAME UPDATE (100% Continuous & Scrubbable Across 0s -> 30s)
// =========================================================================
const tmpPos = new THREE.Vector3();
const tmpTarget = new THREE.Vector3();

function updateEvolutionWorld(t: number) {
  if (!camera || !scene) return;
  const u = clamp01(t / DURATION);

  // 1. Continuous One-Take Camera Flight + Subtle Smooth Mouse Parallax
  smoothMouse.x += (mouseNorm.x - smoothMouse.x) * 0.04;
  smoothMouse.y += (mouseNorm.y - smoothMouse.y) * 0.04;

  if (camPosCurve && camTargetCurve) {
    camPosCurve.getPoint(u, tmpPos);
    camTargetCurve.getPoint(u, tmpTarget);
    // Keep pure vertical alignment during strict 2D opening, unlock subtle parallax after 4s
    const parallaxAmt = smoothstep(3.5, 6.5, t);
    camera.position.set(
      tmpPos.x + smoothMouse.x * 9 * parallaxAmt,
      tmpPos.y + smoothMouse.y * 5 * parallaxAmt,
      tmpPos.z
    );
    camera.lookAt(tmpTarget);
  }

  // 2. LAYER 1: 2D GIS Map Elements (0s -> stays as foundational datum beneath everything!)
  if (scanSweepLine) {
    const scanPhase = smoothstep(0.2, 4.6, t);
    scanSweepLine.position.z = -78 + scanPhase * 156;
    const sweepAlpha = (1 - smoothstep(4.0, 5.8, t)) * 0.58;
    (scanSweepLine.material as THREE.MeshBasicMaterial).opacity = sweepAlpha;
  }

  if (uavPathLine && uavDot && uavCurve) {
    const drawP = smoothstep(0.4, 4.2, t);
    uavPathLine.geometry.setDrawRange(0, Math.floor(drawP * 181));
    const uavFade = 1 - smoothstep(4.8, 7.2, t);
    (uavPathLine.material as THREE.LineBasicMaterial).opacity = 0.72 * uavFade;
    uavDot.visible = uavFade > 0.02;
    if (uavDot.visible) {
      const pt = uavCurve.getPoint(clamp01(drawP));
      uavDot.position.copy(pt);
    }
  }

  if (footprintLines) {
    // Footprints shine bright in 2D era, then gently settle into architectural outlines
    const fpOpacity = 0.85 - smoothstep(5.0, 9.5, t) * 0.52;
    (footprintLines.material as THREE.LineBasicMaterial).opacity = fpOpacity;
  }

  rtkCrosshairs.forEach((m, idx) => {
    const pulse = 1 + Math.sin(t * 2.2 + idx) * 0.14;
    m.scale.setScalar(pulse);
    (m.material as THREE.MeshBasicMaterial).opacity = 0.85 - smoothstep(5.5, 10.0, t) * 0.55;
  });

  // 3. LAYER 2: 3D GIS City Extrusion (Rises organically out of 2D footprints from 3.9s -> 8.6s)
  if (buildingsMesh && buildingCapsMesh) {
    const globalExtrude = smoothstep(3.8, 8.5, t);
    const isVisible3D = globalExtrude > 0.002;
    buildingsMesh.visible = isVisible3D;
    buildingCapsMesh.visible = isVisible3D;

    if (isVisible3D) {
      // Subtle ambient shimmer in systems/twin eras
      const cityGlow = 0.65 + smoothstep(8.8, 13.0, t) * 0.45 + smoothstep(25.4, 29.0, t) * 0.35;
      (buildingsMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = cityGlow;

      for (let i = 0; i < buildingSpecs.length; i++) {
        const b = buildingSpecs[i];
        // Radial ripple extrusion from downtown center outward
        const delay = (b.dist / 8.0) * 0.42;
        const localP = easeOutCubic(clamp01((globalExtrude - delay) / (1 - delay)));
        const hNow = Math.max(0.08, b.targetH * localP);

        dummyObj.position.set(b.x, 0, b.z);
        dummyObj.rotation.set(0, 0, 0);
        dummyObj.scale.set(b.w, hNow, b.d);
        dummyObj.updateMatrix();
        buildingsMesh.setMatrixAt(i, dummyObj.matrix);

        dummyObj.position.set(b.x, hNow + 0.14, b.z);
        dummyObj.scale.set(b.w, 1, b.d);
        dummyObj.updateMatrix();
        buildingCapsMesh.setMatrixAt(i, dummyObj.matrix);
      }
      buildingsMesh.instanceMatrix.needsUpdate = true;
      buildingCapsMesh.instanceMatrix.needsUpdate = true;
    }
  }

  if (buildingWireframes) {
    const wireAlpha = smoothstep(5.2, 8.8, t) * 0.48;
    (buildingWireframes.material as THREE.LineBasicMaterial).opacity = wireAlpha;
  }

  if (cesiumOrbitGroup && cesiumSatellite) {
    const orbitAlpha = smoothstep(5.2, 8.4, t) * (1 - smoothstep(24.5, 27.5, t) * 0.45);
    const ringMesh = cesiumOrbitGroup.children[0] as THREE.Mesh;
    (ringMesh.material as THREE.MeshBasicMaterial).opacity = orbitAlpha * 0.55;
    (cesiumSatellite.material as THREE.MeshBasicMaterial).opacity = orbitAlpha;
    const satAng = t * 0.65;
    cesiumSatellite.position.set(Math.cos(satAng) * 92, 0, Math.sin(satAng) * 92);
    cesiumSatellite.rotation.y = t * 1.4;
  }

  // 4. LAYER 3: Enterprise Information Systems (8.5s -> persists continuously!)
  const sysProgress = smoothstep(8.4, 12.6, t);
  arteryCurves.forEach((a) => {
    const drawCount = Math.floor(easeOutCubic(sysProgress) * a.totalPoints);
    a.line.geometry.setDrawRange(0, drawCount);
    (a.line.material as THREE.LineBasicMaterial).opacity = sysProgress * 0.72;

    a.packet.visible = sysProgress > 0.25;
    if (a.packet.visible) {
      const p = (t * a.speed + a.offset) % 1;
      a.curve.getPoint(p, a.packet.position);
      (a.packet.material as THREE.MeshBasicMaterial).opacity = sysProgress * 0.95;
    }
  });

  hubRings.forEach((hr) => {
    const ringP = smoothstep(9.0, 12.4, t);
    const breathe = 1 + Math.sin(t * 1.6 + hr.phase) * 0.08;
    hr.mesh.scale.setScalar(Math.max(0.01, ringP * breathe));
    (hr.mesh.material as THREE.MeshBasicMaterial).opacity = ringP * 0.62;
  });

  // 5. LAYER 4: Big Data Time-Series Telemetry (12.8s -> rises seamlessly from city into AI brain!)
  const dataProgress = smoothstep(12.6, 16.8, t);
  if (iotParticles && iotBasePositions && iotVelocities) {
    (iotParticles.material as THREE.PointsMaterial).opacity = dataProgress * 0.85;
    if (dataProgress > 0.01) {
      const posAttr = iotParticles.geometry.getAttribute('position') as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      const count = iotVelocities.length;
      const convergeStrength = smoothstep(15.5, 19.5, t) * 0.42;

      for (let i = 0; i < count; i++) {
        const bx = iotBasePositions[i * 3];
        const by = iotBasePositions[i * 3 + 1];
        const bz = iotBasePositions[i * 3 + 2];
        const vel = iotVelocities[i];
        const cycle = ((t * vel * 0.55 + i * 0.013) % 1);
        const liftY = by + cycle * 44 * dataProgress;
        // As particles rise higher in AI era, they spiral gently inward toward the AI brain
        const pull = cycle * convergeStrength;
        const swirl = cycle * 0.8;
        const sx = bx * Math.cos(swirl) - bz * Math.sin(swirl);
        const sz = bx * Math.sin(swirl) + bz * Math.cos(swirl);

        arr[i * 3] = sx * (1 - pull);
        arr[i * 3 + 1] = liftY;
        arr[i * 3 + 2] = sz * (1 - pull);
      }
      posAttr.needsUpdate = true;
    }
  }

  dataRiverArcs.forEach((arc) => {
    const rP = smoothstep(13.2, 17.0, t);
    arc.line.geometry.setDrawRange(0, Math.floor(easeOutCubic(rP) * arc.totalPoints));
    (arc.line.material as THREE.LineBasicMaterial).opacity = rP * 0.52;
    arc.orb.visible = rP > 0.2;
    if (arc.orb.visible) {
      const uOrb = (t * 0.35 + arc.offset) % 1;
      arc.curve.getPoint(uOrb, arc.orb.position);
      (arc.orb.material as THREE.MeshBasicMaterial).opacity = rP * 0.9;
    }
  });

  // 6. LAYER 5: AI Cognitive Neural Constellation (17.0s -> crystallizes smoothly above skyline!)
  const aiProgress = smoothstep(16.8, 21.0, t);
  if (aiBrainGroup && aiNodesMesh && aiSynapseLines) {
    aiBrainGroup.visible = aiProgress > 0.005;
    if (aiBrainGroup.visible) {
      const s = 0.25 + easeOutCubic(aiProgress) * 0.75;
      aiBrainGroup.scale.setScalar(s);
      aiBrainGroup.rotation.y = t * 0.18;
      aiBrainGroup.position.y = 52 + Math.sin(t * 0.8) * 1.4;

      (aiNodesMesh.material as THREE.MeshBasicMaterial).opacity = aiProgress * 0.94;
      (aiSynapseLines.material as THREE.LineBasicMaterial).opacity = aiProgress * 0.36;

      aiSynapsePulses.forEach((p) => {
        const uPulse = (t * p.speed + p.offset) % 1;
        p.mesh.position.lerpVectors(p.a, p.b, uPulse);
        (p.mesh.material as THREE.MeshBasicMaterial).opacity = aiProgress * 0.92;
      });
    }
  }

  // 7. LAYER 6: Autonomous AI Agents (21.2s -> detach from AI brain & orchestrate the city!)
  const agentProgress = smoothstep(21.0, 24.8, t);
  if (agentsGroup && agentCollabLines) {
    agentsGroup.visible = agentProgress > 0.005;
    if (agentsGroup.visible) {
      const collabAttr = agentCollabLines.geometry.getAttribute('position') as THREE.BufferAttribute;
      const collabArr = collabAttr.array as Float32Array;
      const deployEase = easeOutCubic(agentProgress);

      agentUnits.forEach((ag, idx) => {
        const ang = ag.orbitAngle + t * ag.orbitSpeed;
        const targetX = Math.cos(ang) * ag.orbitRadius;
        const targetZ = Math.sin(ang) * ag.orbitRadius;
        const targetY = ag.baseY + Math.sin(t * 1.3 + idx) * 2.5;

        // Smoothly emerge from the AI constellation core (0, 54, 0) outward into patrol orbit!
        ag.group.position.set(
          THREE.MathUtils.lerp(0, targetX, deployEase),
          THREE.MathUtils.lerp(54, targetY, deployEase),
          THREE.MathUtils.lerp(0, targetZ, deployEase)
        );
        ag.core.rotation.y = t * 1.6 + idx;
        ag.core.rotation.x = t * 0.7;
        ag.ring.rotation.z = -t * 1.2;

        (ag.core.material as THREE.MeshStandardMaterial).opacity = agentProgress * 0.95;
        (ag.ring.material as THREE.MeshBasicMaterial).opacity = agentProgress * 0.72;
        (ag.beam.material as THREE.MeshBasicMaterial).opacity =
          smoothstep(22.0, 24.5, t) * (0.14 + Math.sin(t * 2 + idx) * 0.04);
      });

      // Connect each agent to the next in a glowing collaboration loop
      for (let i = 0; i < agentUnits.length; i++) {
        const cur = agentUnits[i].group.position;
        const nxt = agentUnits[(i + 1) % agentUnits.length].group.position;
        collabArr[i * 6] = cur.x;
        collabArr[i * 6 + 1] = cur.y;
        collabArr[i * 6 + 2] = cur.z;
        collabArr[i * 6 + 3] = nxt.x;
        collabArr[i * 6 + 4] = nxt.y;
        collabArr[i * 6 + 5] = nxt.z;
      }
      collabAttr.needsUpdate = true;
      (agentCollabLines.material as THREE.LineBasicMaterial).opacity =
        smoothstep(21.8, 24.8, t) * 0.58;
    }
  }

  // 8. LAYER 7: AI Digital Twin / Spatial XR Holographic Dome (25.2s -> 30.0s Grand Convergence!)
  const twinProgress = smoothstep(25.0, 29.2, t);
  if (twinDomeGroup && twinOuterSphere && twinInnerSphere) {
    twinDomeGroup.visible = twinProgress > 0.005;
    if (twinDomeGroup.visible) {
      const domeScale = 0.65 + easeOutCubic(twinProgress) * 0.35;
      twinDomeGroup.scale.setScalar(domeScale);
      twinOuterSphere.rotation.y = t * 0.07;
      twinInnerSphere.rotation.y = -t * 0.1;

      (twinOuterSphere.material as THREE.MeshBasicMaterial).opacity = twinProgress * 0.14;
      (twinInnerSphere.material as THREE.MeshBasicMaterial).opacity = twinProgress * 0.12;

      twinHorizonRings.forEach((hr, idx) => {
        hr.rotation.z = t * (idx % 2 === 0 ? 0.12 : -0.09);
        (hr.material as THREE.MeshBasicMaterial).opacity = twinProgress * (idx === 1 ? 0.42 : 0.24);
      });
    }
  }
}

function renderLoop(now: number) {
  rafId = requestAnimationFrame(renderLoop);
  if (lastTimestamp === 0) lastTimestamp = now;
  const dt = Math.min(0.05, (now - lastTimestamp) * 0.001);
  lastTimestamp = now;

  if (isPlaying.value) {
    currentTime.value += dt;
    if (currentTime.value >= DURATION) {
      currentTime.value = DURATION;
      isPlaying.value = false;
      isFinished.value = true;
    }
    updateAmbientScore(currentTime.value);
  }

  const found = stages.findIndex((s) => currentTime.value >= s.start && currentTime.value < s.end);
  activeStageIdx.value = found !== -1 ? found : stages.length - 1;

  updateEvolutionWorld(currentTime.value);

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

function handleResize() {
  const host = canvasHostRef.value;
  if (!host || !renderer || !camera) return;
  const w = Math.max(320, host.clientWidth);
  const h = Math.max(200, host.clientHeight);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

function onPointerMove(e: PointerEvent) {
  mouseNorm.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouseNorm.y = -(e.clientY / window.innerHeight) * 2 + 1;
}

function startCinema() {
  ensureAudioContext();
  hasStarted.value = true;
  isPlaying.value = true;
  isFinished.value = false;
  currentTime.value = 0;
  lastChordIdx = -1;
  lastNoteIdx = -1;
}

function unlockAudioNow() {
  ensureAudioContext();
  lastChordIdx = -1;
}

function togglePlayPause() {
  if (!hasStarted.value) {
    startCinema();
    return;
  }
  if (isFinished.value) {
    restartCinema();
    return;
  }
  if (audioBlocked.value && !isMuted.value) {
    unlockAudioNow();
    return;
  }
  isPlaying.value = !isPlaying.value;
  if (isPlaying.value) {
    ensureAudioContext();
  }
}

function restartCinema() {
  ensureAudioContext();
  currentTime.value = 0;
  lastChordIdx = -1;
  lastNoteIdx = -1;
  isFinished.value = false;
  isPlaying.value = true;
  hasStarted.value = true;
}

function toggleMute() {
  ensureAudioContext();
  isMuted.value = !isMuted.value;
  if (masterGain && audioCtx) {
    masterGain.gain.setTargetAtTime(isMuted.value ? 0 : 0.42, audioCtx.currentTime, 0.08);
  }
}

function jumpToStage(stageIdx: number) {
  const st = stages[stageIdx];
  if (!st) return;
  ensureAudioContext();
  currentTime.value = st.start + 0.05;
  lastChordIdx = -1;
  lastNoteIdx = -1;
  isFinished.value = false;
  hasStarted.value = true;
  isPlaying.value = true;
}

function onScrubClick(e: MouseEvent) {
  const target = e.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const ratio = clamp01((e.clientX - rect.left) / rect.width);
  ensureAudioContext();
  currentTime.value = ratio * DURATION;
  lastChordIdx = -1;
  lastNoteIdx = -1;
  isFinished.value = false;
}

function closeCinema() {
  isPlaying.value = false;
  clearTimeout(musicTimer);
  if (audioCtx && audioCtx.state === 'running') {
    audioCtx.suspend();
  }
  emit('close');
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    closeCinema();
  } else if (e.key === ' ' || e.code === 'Space') {
    e.preventDefault();
    togglePlayPause();
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    jumpToStage(Math.min(stages.length - 1, activeStageIdx.value + 1));
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    jumpToStage(Math.max(0, activeStageIdx.value - 1));
  } else if (e.key.toLowerCase() === 'm') {
    toggleMute();
  }
}

onMounted(() => {
  buildEvolutionWorld();
  window.addEventListener('resize', handleResize);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  rafId = requestAnimationFrame(renderLoop);

  if (props.autoStart) {
    startCinema();
  }
});

onUnmounted(() => {
  cancelAnimationFrame(rafId);
  clearTimeout(musicTimer);
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('keydown', onKeyDown);
  window.removeEventListener('pointermove', onPointerMove);

  softGlowTex?.dispose();
  if (scene) {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
      const mat = (obj as THREE.Mesh).material;
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
      else if (mat) mat.dispose();
    });
  }
  renderer?.dispose();
  renderer = null;
  scene = null;
  camera = null;

  if (audioCtx && audioCtx.state !== 'closed') {
    audioCtx.close();
  }
  audioCtx = null;
  masterGain = null;
  delayNode = null;
  delayFeedback = null;
  padFilter = null;
});
</script>

<template>
  <div
    class="fixed inset-0 z-[100] bg-[#04070e] flex flex-col justify-between overflow-hidden select-none"
    role="dialog"
    aria-modal="true"
    :aria-label="isZh ? '技术进化史 · 30秒 Three.js 一镜到底三维演进短片' : 'Tech Evolution · 30s Continuous Three.js Film'"
  >
    <!-- Top Minimalist Cinema Bar -->
    <header class="relative z-30 flex items-center justify-between px-4 sm:px-8 py-3 border-b border-white/8 bg-[#050811]/82 backdrop-blur-xl">
      <div class="flex items-center gap-3 min-w-0">
        <div class="w-8 h-8 rounded-xl overflow-hidden border border-[#e5b66a]/40 bg-[#0b0e15] p-0.5 shrink-0">
          <img src="/brand/logo-square.svg" alt="Jackie Tang" class="w-full h-full object-contain" />
        </div>
        <div class="min-w-0">
          <div class="flex items-center gap-2.5">
            <span class="font-bold text-xs sm:text-sm text-[#f4ecdb] font-mono-tech tracking-wide truncate">
              JACKIE TANG // TECH EVOLUTION
            </span>
            <span class="px-2 py-0.5 rounded-full bg-[#e5b66a]/15 text-[#f2c97e] font-mono-tech text-[10px] font-semibold border border-[#e5b66a]/30 shrink-0">
              THREE.JS · ONE-TAKE 30s
            </span>
          </div>
          <p class="text-[10px] text-[#94a3b8] font-mono-tech hidden md:block truncate">
            {{
              isZh
                ? '一镜到底技术演进 · 2D 经纬基底 → 3D 城市拔起 → 信息化系统 → 时空大数据 → AI 认知星云 → Agent 协同 → 数字孪生'
                : 'Single-Take Continuous 3D Evolution · 2D GIS → 3D City → Info Systems → Big Data → AI Brain → Agents → Digital Twin'
            }}
          </p>
        </div>
      </div>

      <!-- Controls -->
      <div class="flex items-center gap-2 font-mono-tech text-xs shrink-0">
        <span class="hidden sm:inline-block text-[#94a3b8] text-[11px] mr-1.5 tabular-nums">
          {{ formattedTime }} / 00:30.0
        </span>

        <button
          v-if="audioBlocked && !isMuted"
          type="button"
          @click="unlockAudioNow"
          class="px-3 py-1.5 rounded-xl bg-[#f2c97e]/18 border border-[#f2c97e]/70 text-[#f2c97e] font-semibold cursor-pointer flex items-center gap-1.5"
        >
          <span>🔊</span>
          <span>{{ isZh ? '开启配乐' : 'UNMUTE' }}</span>
        </button>

        <button
          type="button"
          @click="togglePlayPause"
          class="px-3 py-1.5 rounded-xl border border-white/10 hover:border-[#e5b66a]/45 bg-white/5 hover:bg-white/10 text-[#f4ecdb] transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>{{ isPlaying ? '⏸' : '▶' }}</span>
          <span class="hidden sm:inline">{{ isPlaying ? (isZh ? '暂停' : 'PAUSE') : (isZh ? '继续' : 'PLAY') }}</span>
        </button>

        <button
          type="button"
          @click="toggleMute"
          class="px-3 py-1.5 rounded-xl border border-white/10 hover:border-[#e5b66a]/45 bg-white/5 hover:bg-white/10 text-[#f4ecdb] transition-all cursor-pointer flex items-center gap-1.5"
          :title="isMuted ? '开启配乐 (M)' : '静音 (M)'"
        >
          <span>{{ isMuted ? '🔇' : '🎵' }}</span>
          <span class="hidden sm:inline">{{ isMuted ? (isZh ? '静音' : 'MUTED') : (isZh ? '氛围原声' : 'SCORE') }}</span>
        </button>

        <button
          type="button"
          @click="restartCinema"
          class="px-3 py-1.5 rounded-xl border border-white/10 hover:border-[#e5b66a]/45 bg-white/5 hover:bg-white/10 text-[#a69d8b] hover:text-[#f2c97e] transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>⟳</span>
          <span class="hidden sm:inline">{{ isZh ? '重播' : 'REPLAY' }}</span>
        </button>

        <button
          type="button"
          @click="closeCinema"
          class="px-3.5 py-1.5 rounded-xl bg-[#e5b66a] hover:bg-[#f2c97e] text-[#07090d] font-bold transition-all cursor-pointer flex items-center gap-1"
        >
          <span>✕</span>
          <span>{{ isZh ? '退出' : 'ESC' }}</span>
        </button>
      </div>
    </header>

    <!-- Main Continuous Three.js Widescreen Stage -->
    <main class="relative flex-1 w-full overflow-hidden bg-[#04070e]">
      <!-- Full-bleed WebGL Canvas Host -->
      <div
        ref="canvasHostRef"
        class="absolute inset-0 w-full h-full cursor-pointer"
        @click="togglePlayPause"
      ></div>

      <!-- Subtle Cinematic Edge Vignette for Readability -->
      <div
        class="pointer-events-none absolute inset-0"
        style="background: radial-gradient(ellipse at center, transparent 48%, rgba(4, 7, 14, 0.72) 100%);"
      ></div>

      <!-- Subtle Audio Unlock Pill if triggered by wheel -->
      <button
        v-if="audioBlocked && isPlaying && !isMuted"
        type="button"
        @click.stop="unlockAudioNow"
        class="absolute top-5 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-full bg-[#070b15]/85 border border-[#f2c97e]/55 text-[#f2c97e] font-mono-tech text-xs backdrop-blur-md hover:bg-[#0e1526] transition-all cursor-pointer flex items-center gap-2"
      >
        <span>🎵</span>
        <span>{{ isZh ? '点击开启原创氛围配乐' : 'Click to Enable Ambient Score' }}</span>
      </button>

      <!-- Top-Left Layer Stack Indicator (Shows Cumulative Evolution Layers Living Simultaneously!) -->
      <div class="pointer-events-none absolute top-5 left-5 sm:left-8 z-20 hidden sm:flex flex-col gap-1.5">
        <div class="font-mono-tech text-[10px] tracking-[0.2em] text-[#94a3b8] uppercase mb-0.5">
          {{ isZh ? '演进图层叠加 · ACTIVE LAYERS' : 'CUMULATIVE EVOLUTION LAYERS' }}
        </div>
        <div
          v-for="(st, idx) in stages"
          :key="st.id"
          class="flex items-center gap-2 font-mono-tech text-[11px] transition-all duration-500"
          :class="
            idx < activeStageIdx
              ? 'text-[#cbd5e1]/80'
              : idx === activeStageIdx
                ? 'text-white font-bold translate-x-1'
                : 'text-white/22'
          "
        >
          <span
            class="w-1.5 h-1.5 rounded-full transition-all duration-500"
            :style="{
              backgroundColor: idx <= activeStageIdx ? st.accent : 'rgba(255,255,255,0.2)',
              boxShadow: idx === activeStageIdx ? `0 0 10px ${st.accent}` : 'none',
            }"
          ></span>
          <span class="opacity-65">{{ st.num }}</span>
          <span>{{ isZh ? st.shortZh : st.shortEn }}</span>
        </div>
      </div>

      <!-- Top-Right Milestone KPI Pill (Smooth Crossfade) -->
      <div class="pointer-events-none absolute top-5 right-5 sm:right-8 z-20 hidden md:block">
        <transition
          mode="out-in"
          enter-active-class="transition duration-500 ease-out"
          enter-from-class="opacity-0 translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-250 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div
            :key="currentStage.id"
            class="px-4 py-3 rounded-2xl bg-[#070c17]/75 border border-white/12 backdrop-blur-xl text-right min-w-[205px] shadow-2xl"
          >
            <div
              class="font-mono-tech text-2xl font-black tracking-tight"
              :style="{ color: currentStage.accent }"
            >
              {{ currentStage.metricValue }}
            </div>
            <div class="text-[11px] text-[#cbd5e1] mt-0.5 font-medium">
              {{ isZh ? currentStage.metricLabel.zh : currentStage.metricLabel.en }}
            </div>
          </div>
        </transition>
      </div>

      <!-- Bottom-Left Editorial Narrative Overlay (Smooth Cinema Crossfade) -->
      <div class="pointer-events-none absolute bottom-6 left-5 sm:left-8 right-5 sm:right-8 z-20 flex items-end justify-between gap-6">
        <transition
          mode="out-in"
          enter-active-class="transition duration-600 ease-out"
          enter-from-class="opacity-0 translate-y-3"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-300 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div :key="currentStage.id" class="max-w-2xl space-y-2">
            <div class="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-[#070c17]/80 border border-white/12 backdrop-blur-md">
              <span
                class="w-2 h-2 rounded-full"
                :style="{ backgroundColor: currentStage.accent, boxShadow: `0 0 10px ${currentStage.accent}` }"
              ></span>
              <span class="font-mono-tech text-[11px] font-bold tracking-widest" :style="{ color: currentStage.accent }">
                ERA {{ currentStage.num }} / 07
              </span>
              <span class="text-white/25">·</span>
              <span class="font-mono-tech text-[11px] text-[#cbd5e1]">
                {{ currentStage.era }}
              </span>
            </div>

            <h2 class="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#f8fafc] drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
              {{ isZh ? currentStage.title.zh : currentStage.title.en }}
            </h2>

            <p class="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              {{ isZh ? currentStage.subtitle.zh : currentStage.subtitle.en }}
            </p>

            <div class="flex flex-wrap gap-1.5 pt-1">
              <span
                v-for="tag in currentStage.tags"
                :key="tag"
                class="px-2.5 py-0.5 rounded-md bg-[#070c17]/75 border border-white/10 font-mono-tech text-[10px] text-[#e2e8f0] backdrop-blur-sm"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </transition>
      </div>

      <!-- Center Play/Pause Overlay if Paused -->
      <div
        v-if="!isPlaying && !isFinished"
        @click="togglePlayPause"
        class="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer z-30"
      >
        <div class="w-18 h-18 rounded-full bg-gradient-to-tr from-[#e5b66a] to-[#fff8e8] text-[#07090d] flex items-center justify-center text-2xl shadow-[0_0_50px_rgba(229,182,106,0.45)] transition-transform hover:scale-105 pl-1">
          ▶
        </div>
        <p class="font-mono-tech text-xs tracking-widest text-[#f4ecdb] mt-4 uppercase">
          {{ isZh ? '点击画面或按空格键继续播放' : 'Click or Press Space to Resume' }}
        </p>
      </div>

      <!-- Graceful Finale Overlay Card -->
      <transition
        enter-active-class="transition duration-500 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
      >
        <div
          v-if="isFinished"
          class="absolute inset-0 z-30 bg-[#04070e]/75 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
        >
          <div class="max-w-lg w-full p-7 sm:p-8 rounded-3xl bg-[#0a101d]/92 border border-[#e5b66a]/40 shadow-2xl space-y-5">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e5b66a]/15 text-[#f2c97e] font-mono-tech text-xs font-semibold border border-[#e5b66a]/30">
              ★ 2015 → 2026+ · EVOLUTION CONTINUUM
            </span>
            <h3 class="text-2xl sm:text-3xl font-extrabold text-[#f4ecdb]">
              {{ isZh ? '从经纬平面到智能时代 · 持续演进' : 'From 2D Datum to The Intelligent Era' }}
            </h3>
            <p class="text-xs sm:text-sm text-[#a69d8b] leading-relaxed">
              {{
                isZh
                  ? '每一代技术都不是推倒重来，而是向上的维度叠加——2D 测绘基底之上长出 3D 城市，城市之中流淌系统与数据，云端凝聚 AI 智能体与虚实共生的数字孪生。'
                  : 'Every technological era builds upward upon the last — 3D cities rising from 2D maps, illuminated by systems and data, crowned by cognitive AI Agents and Digital Twins.'
              }}
            </p>

            <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                @click="restartCinema"
                class="px-5 py-2.5 rounded-xl border border-[#e5b66a]/45 hover:bg-[#e5b66a]/15 text-[#f2c97e] font-mono-tech text-xs font-bold transition-all cursor-pointer"
              >
                ⟳ {{ isZh ? '重看演进短片' : 'Replay Film' }}
              </button>
              <a
                href="/resume"
                class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#f2c97e] to-[#d49a3d] text-[#07090d] font-mono-tech text-xs font-bold shadow hover:opacity-95 transition-all"
              >
                {{ isZh ? '02 在线履历 →' : '02 Online Resume →' }}
              </a>
              <a
                href="/works"
                class="px-5 py-2.5 rounded-xl bg-[#151a24] text-[#f4ecdb] border border-white/10 hover:border-white/30 font-mono-tech text-xs font-semibold transition-all"
              >
                {{ isZh ? '03 个人开源代表作品 →' : '03 Open-Source Works →' }}
              </a>
            </div>
          </div>
        </div>
      </transition>
    </main>

    <!-- Bottom Interactive Timeline Scrubber & 7-Era Continuous Chapters -->
    <footer class="relative z-30 px-4 sm:px-8 pt-2.5 pb-3.5 bg-[#050811]/95 border-t border-white/8 backdrop-blur-xl space-y-2.5">
      <!-- Smooth Clickable Scrubber -->
      <div
        @click="onScrubClick"
        class="relative h-1.5 w-full rounded-full bg-white/10 cursor-pointer overflow-hidden"
        :title="isZh ? '点击跳转演进时间点' : 'Click to scrub timeline'"
      >
        <div
          class="h-full bg-gradient-to-r from-[#38bdf8] via-[#63cfa1] via-[#a78bfa] to-[#f2c97e] transition-[width] duration-75"
          :style="{ width: `${progressPercent}%` }"
        ></div>
      </div>

      <!-- 7 Era Nodes -->
      <div class="grid grid-cols-4 sm:grid-cols-7 gap-1.5 font-mono-tech text-[10px]">
        <button
          v-for="(st, idx) in stages"
          :key="st.id"
          type="button"
          @click="jumpToStage(idx)"
          class="px-2.5 py-1.5 rounded-lg border transition-all text-left truncate cursor-pointer"
          :class="
            activeStageIdx === idx
              ? 'bg-white/10 border-[#e5b66a]/80 text-[#f8fafc] font-bold shadow-[0_0_16px_rgba(229,182,106,0.18)]'
              : idx < activeStageIdx
                ? 'bg-white/[0.04] border-white/10 text-[#cbd5e1] hover:border-white/25'
                : 'bg-[#0b101d]/70 border-white/5 text-[#64748b] hover:text-[#cbd5e1] hover:border-white/15'
          "
        >
          <div class="flex items-center gap-1.5 text-[9px] opacity-75">
            <span class="w-1.5 h-1.5 rounded-full shrink-0" :style="{ backgroundColor: st.accent }"></span>
            <span class="truncate">{{ st.era }}</span>
          </div>
          <div class="truncate mt-0.5">{{ st.num }} · {{ isZh ? st.shortZh : st.shortEn }}</div>
        </button>
      </div>
    </footer>
  </div>
</template>
