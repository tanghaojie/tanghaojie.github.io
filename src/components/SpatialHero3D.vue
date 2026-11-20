<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import gsap from 'gsap';
import { useLang } from '../i18n/useLang';
import TechEvolutionCinema from './TechEvolutionCinema.vue';

const { isZh } = useLang();

const canvasWrapRef = ref<HTMLElement | null>(null);
const heroContentRef = ref<HTMLElement | null>(null);

const isBooting = ref(true);
const bootProgress = ref(0);
const bootPhaseLabel = ref('INITIALIZING 09 SILICON TOPOLOGY...');
const isOrbitMode = ref(false);
const showOrbitalLayer = ref(true);
const showQrModal = ref(false);
const showCinema = ref(false);
const pointerCoords = ref({ x: '116.397°E', y: '39.908°N' });

let lastCinemaCloseAt = 0;
let touchStartY = 0;

let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let controls: OrbitControls | null = null;
let pmremGenerator: THREE.PMREMGenerator | null = null;
let envRT: THREE.WebGLRenderTarget | null = null;

let masterStageGroup: THREE.Group | null = null;
let logoGroup: THREE.Group | null = null;
let orbitalGroup: THREE.Group | null = null;
let satellitePivot: THREE.Group | null = null;
let starfield: THREE.Points | null = null;
let spatialGrid: THREE.GridHelper | null = null;
let singularityLight: THREE.PointLight | null = null;
let keyLight: THREE.DirectionalLight | null = null;
let haloRingOuter: THREE.Mesh | null = null;

let blocks: THREE.Mesh[] = [];
let busSegments: THREE.Mesh[] = [];
let rafId = 0;
let bootTimeline: gsap.core.Timeline | null = null;

const targetMouse = { x: 0, y: 0 };
const currentMouse = { x: 0, y: 0 };

// 09 Silicon Matrix Mathematical Proportions (1.8 : 1.0, 1.8 : 0.9)
const SCALE_U = 74;
const W_LEFT = 1.8 * SCALE_U;
const W_RIGHT = 1.0 * SCALE_U;
const H_TOP = 1.8 * SCALE_U;
const H_BOTTOM = 0.9 * SCALE_U;
const DEPTH = 17;
const BEVEL = 3.4;

const TARGETS = [
  { x: -44, y: 40, z: 0, w: W_LEFT, h: H_TOP, r: 12 },
  { x: 74, y: 40, z: 0, w: W_RIGHT, h: H_TOP, r: 10 },
  { x: -44, y: -74, z: 0, w: W_LEFT, h: H_BOTTOM, r: 10 },
  { x: 74, y: -74, z: 0, w: W_RIGHT, h: H_BOTTOM, r: 10 },
];

const INITIAL_SPAWNS = [
  { x: -240, y: 185, z: 1120, rx: -1.15, ry: 0.75, rz: -0.55 },
  { x: 250, y: 170, z: 1080, rx: 0.95, ry: -1.05, rz: 0.45 },
  { x: -230, y: -185, z: 1020, rx: 0.65, ry: 1.15, rz: -0.5 },
  { x: 230, y: -175, z: 1180, rx: -1.05, ry: -0.75, rz: 0.75 },
];

const COLOR_WAFER_SILVER = new THREE.Color(0xd8dde6);
const COLOR_TITANIUM_GOLD = new THREE.Color(0xf2c97e);
const COLOR_STRUCT_GOLD = new THREE.Color(0xc28e3a);
const EMISSIVE_COLD = new THREE.Color(0x0d121c);
const EMISSIVE_WARM = new THREE.Color(0x3b270a);

function getHeroStageAnchor() {
  const w = typeof window !== 'undefined' ? window.innerWidth : 1280;
  if (w >= 1280) return { x: 156, y: 8, scale: 0.92 };
  if (w >= 1024) return { x: 128, y: 8, scale: 0.82 };
  return { x: 0, y: 98, scale: 0.60 };
}

function createRoundedRectShape(w: number, h: number, r: number) {
  const shape = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  return shape;
}

function createSoftParticleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 249, 236, 1)');
  grad.addColorStop(0.35, 'rgba(229, 182, 106, 0.85)');
  grad.addColorStop(1, 'rgba(229, 182, 106, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

function buildScene() {
  const container = canvasWrapRef.value;
  if (!container) return;

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x07090d, 0.00075);

  camera = new THREE.PerspectiveCamera(44, width / height, 1, 3000);
  camera.position.set(0, 0, 490);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  container.appendChild(renderer.domElement);

  pmremGenerator = new THREE.PMREMGenerator(renderer);
  envRT = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = true;
  controls.minDistance = 240;
  controls.maxDistance = 850;
  controls.enabled = false;

  const ambient = new THREE.AmbientLight(0x282015, 0.9);
  scene.add(ambient);

  keyLight = new THREE.DirectionalLight(0xfff9ec, 2.2);
  keyLight.position.set(220, 320, 420);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xe5b66a, 1.35);
  rimLight.position.set(-320, -190, 220);
  scene.add(rimLight);

  const gisRimLight = new THREE.DirectionalLight(0x338aaf, 0.65);
  gisRimLight.position.set(260, -240, -180);
  scene.add(gisRimLight);

  masterStageGroup = new THREE.Group();
  scene.add(masterStageGroup);

  logoGroup = new THREE.Group();
  masterStageGroup.add(logoGroup);

  singularityLight = new THREE.PointLight(0xfff4dc, 0, 420);
  singularityLight.position.set(74, -74, 34);
  logoGroup.add(singularityLight);

  const frontZ = DEPTH / 2 + BEVEL;
  blocks = [];
  busSegments = [];

  TARGETS.forEach((t, idx) => {
    const shape = createRoundedRectShape(t.w, t.h, t.r);
    const geo = new THREE.ExtrudeGeometry(shape, {
      steps: 1,
      depth: DEPTH,
      bevelEnabled: true,
      bevelThickness: BEVEL,
      bevelSize: BEVEL,
      bevelSegments: 4,
    });
    geo.center();

    const mat = new THREE.MeshPhysicalMaterial({
      color: COLOR_WAFER_SILVER.clone(),
      metalness: 0.88,
      roughness: 0.23,
      clearcoat: 0.55,
      clearcoatRoughness: 0.16,
      envMapIntensity: 0.95,
      emissive: EMISSIVE_COLD.clone(),
      emissiveIntensity: 0.25,
    });

    const mesh = new THREE.Mesh(geo, mat);

    if (idx === 1) {
      const segGeo = new THREE.BoxGeometry(3.8, 9.5, 1.5);
      [-34, -17, 0, 17, 34].forEach((py) => {
        const segMat = new THREE.MeshBasicMaterial({
          color: 0xfff8e8,
          transparent: true,
          opacity: 0.25,
        });
        const seg = new THREE.Mesh(segGeo, segMat);
        seg.position.set(0, py, frontZ + 0.65);
        mesh.add(seg);
        busSegments.push(seg);
      });
    }

    if (idx === 2) {
      const segGeo = new THREE.BoxGeometry(9.5, 3.8, 1.5);
      [-34, -17, 0, 17, 34].forEach((px) => {
        const segMat = new THREE.MeshBasicMaterial({
          color: 0xfff8e8,
          transparent: true,
          opacity: 0.25,
        });
        const seg = new THREE.Mesh(segGeo, segMat);
        seg.position.set(px, 0, frontZ + 0.65);
        mesh.add(seg);
        busSegments.push(seg);
      });
    }

    if (idx === 3) {
      const sparkMesh = new THREE.Mesh(
        new THREE.SphereGeometry(4.2, 24, 24),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      sparkMesh.position.set(0, 0, frontZ + 1.5);
      mesh.add(sparkMesh);

      haloRingOuter = new THREE.Mesh(
        new THREE.TorusGeometry(10.5, 0.85, 16, 48),
        new THREE.MeshBasicMaterial({
          color: 0xfff8e8,
          transparent: true,
          opacity: 0.55,
        })
      );
      haloRingOuter.position.set(0, 0, frontZ + 0.8);
      mesh.add(haloRingOuter);
    }

    logoGroup!.add(mesh);
    blocks.push(mesh);
  });

  // -24° 3D GIS Geodesic Orbital System
  orbitalGroup = new THREE.Group();
  orbitalGroup.rotation.z = (-24 * Math.PI) / 180;
  orbitalGroup.rotation.x = (66 * Math.PI) / 180;
  logoGroup.add(orbitalGroup);

  const primaryOrbit = new THREE.Mesh(
    new THREE.TorusGeometry(176, 0.95, 16, 128),
    new THREE.MeshStandardMaterial({
      color: 0xf2c97e,
      emissive: 0x8a5f19,
      emissiveIntensity: 0.55,
      metalness: 0.9,
      roughness: 0.2,
      transparent: true,
      opacity: 0.72,
    })
  );
  orbitalGroup.add(primaryOrbit);

  const secondaryOrbit = new THREE.Mesh(
    new THREE.TorusGeometry(196, 0.55, 12, 128),
    new THREE.MeshBasicMaterial({
      color: 0x338aaf,
      transparent: true,
      opacity: 0.36,
    })
  );
  secondaryOrbit.rotation.y = (32 * Math.PI) / 180;
  orbitalGroup.add(secondaryOrbit);

  satellitePivot = new THREE.Group();
  orbitalGroup.add(satellitePivot);

  const satCore = new THREE.Mesh(
    new THREE.SphereGeometry(3.8, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  satCore.position.set(176, 0, 0);
  satellitePivot.add(satCore);

  const satHalo = new THREE.Mesh(
    new THREE.RingGeometry(5.5, 8.2, 24),
    new THREE.MeshBasicMaterial({
      color: 0x338aaf,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    })
  );
  satHalo.position.set(176, 0, 0);
  satellitePivot.add(satHalo);

  spatialGrid = new THREE.GridHelper(1800, 44, 0xe5b66a, 0x182030);
  spatialGrid.position.y = -225;
  const gridMat = spatialGrid.material as THREE.Material;
  gridMat.transparent = true;
  gridMat.opacity = 0.22;
  scene.add(spatialGrid);

  const count = window.innerWidth < 768 ? 280 : 560;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 1800;
    positions[i + 1] = (Math.random() - 0.5) * 1100;
    positions[i + 2] = (Math.random() - 0.5) * 1400;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  starfield = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({
      map: createSoftParticleTexture(),
      size: 5.2,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  scene.add(starfield);
}

function setNavbarVisible(visible: boolean) {
  const nav = document.getElementById('jt-global-navbar');
  if (!nav) return;
  nav.style.opacity = visible ? '1' : '0';
  nav.style.transform = visible ? 'translateY(0)' : 'translateY(-12px)';
}

function playFastSplash(forceFullSplash = false) {
  if (!logoGroup || !orbitalGroup || !singularityLight || !camera) return;

  if (isOrbitMode.value) {
    toggleOrbitMode();
  }

  bootTimeline?.kill();

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const alreadySeen =
    !forceFullSplash &&
    typeof window !== 'undefined' &&
    window.sessionStorage.getItem('jt_splash_v2') === '1';

  const anchor = getHeroStageAnchor();

  if (prefersReduced || alreadySeen) {
    isBooting.value = false;
    bootProgress.value = 100;
    setNavbarVisible(true);

    blocks.forEach((mesh, i) => {
      const t = TARGETS[i];
      const mat = mesh.material as THREE.MeshPhysicalMaterial;
      mesh.position.set(t.x, t.y, t.z);
      mesh.rotation.set(0, 0, 0);
      mat.color.copy(i === 0 || i === 3 ? COLOR_TITANIUM_GOLD : COLOR_STRUCT_GOLD);
      mat.emissive.copy(EMISSIVE_WARM);
      mat.emissiveIntensity = 0.55;
    });
    singularityLight.intensity = 2.2;
    orbitalGroup.scale.set(1, 1, 1);

    logoGroup.position.set(anchor.x, anchor.y, 0);
    logoGroup.scale.setScalar(anchor.scale * 0.92);
    logoGroup.rotation.set(-0.08, -0.22, 0);

    gsap.to(logoGroup.scale, {
      x: anchor.scale,
      y: anchor.scale,
      z: anchor.scale,
      duration: 0.6,
      ease: 'power2.out',
    });
    if (heroContentRef.value) {
      gsap.fromTo(
        heroContentRef.value,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
    return;
  }

  // Full 1.5s Break-Through Splash Choreography
  isBooting.value = true;
  bootProgress.value = 0;
  bootPhaseLabel.value = isZh.value
    ? 'PHASE 01 // 硅基模块破空聚合'
    : 'PHASE 01 // SILICON DIE BREAK-THROUGH';

  setNavbarVisible(false);

  if (heroContentRef.value) {
    gsap.set(heroContentRef.value, { opacity: 0, y: 24 });
  }

  logoGroup.position.set(0, 12, 0);
  logoGroup.scale.set(1, 1, 1);
  logoGroup.rotation.set(0, 0, 0);
  orbitalGroup.scale.set(0.01, 0.01, 0.01);
  singularityLight.intensity = 0;
  camera.position.set(0, 0, 490);
  camera.lookAt(0, 0, 0);

  blocks.forEach((mesh, i) => {
    const sp = INITIAL_SPAWNS[i];
    const mat = mesh.material as THREE.MeshPhysicalMaterial;
    mesh.position.set(sp.x, sp.y, sp.z);
    mesh.rotation.set(sp.rx, sp.ry, sp.rz);
    mat.color.copy(COLOR_WAFER_SILVER);
    mat.emissive.copy(EMISSIVE_COLD);
    mat.emissiveIntensity = 0.15;
  });

  const progProxy = { val: 0 };
  bootTimeline = gsap.timeline({
    onComplete: () => {
      isBooting.value = false;
      setNavbarVisible(true);
      window.sessionStorage.setItem('jt_splash_v2', '1');
    },
  });

  bootTimeline.to(
    progProxy,
    {
      val: 100,
      duration: 1.48,
      ease: 'power2.inOut',
      onUpdate: () => {
        bootProgress.value = Math.round(progProxy.val);
      },
    },
    0
  );

  blocks.forEach((mesh, i) => {
    const tgt = TARGETS[i];
    const mat = mesh.material as THREE.MeshPhysicalMaterial;
    const finalCol = i === 0 || i === 3 ? COLOR_TITANIUM_GOLD : COLOR_STRUCT_GOLD;
    const delay = i * 0.055;

    bootTimeline!.to(
      mesh.position,
      { x: tgt.x, y: tgt.y, z: tgt.z, duration: 0.52, ease: 'expo.out' },
      delay
    );
    bootTimeline!.to(
      mesh.rotation,
      { x: 0, y: 0, z: 0, duration: 0.52, ease: 'expo.out' },
      delay
    );
    bootTimeline!.to(
      mat.color,
      { r: finalCol.r, g: finalCol.g, b: finalCol.b, duration: 0.48, ease: 'power2.inOut' },
      delay + 0.08
    );
    bootTimeline!.to(
      mat.emissive,
      { r: EMISSIVE_WARM.r, g: EMISSIVE_WARM.g, b: EMISSIVE_WARM.b, duration: 0.45 },
      delay + 0.12
    );
  });

  bootTimeline.call(
    () => {
      bootPhaseLabel.value = isZh.value
        ? 'PHASE 02 // 奇点充能与测地轨道展开'
        : 'PHASE 02 // SINGULARITY & GEODESIC ORBIT SYNC';
    },
    [],
    0.52
  );

  bootTimeline.to(
    singularityLight,
    { intensity: 2.4, duration: 0.42, ease: 'power2.out' },
    0.50
  );

  bootTimeline.to(
    orbitalGroup.scale,
    { x: 1, y: 1, z: 1, duration: 0.55, ease: 'back.out(1.35)' },
    0.52
  );

  bootTimeline.to(
    logoGroup.rotation,
    { x: -0.16, y: -0.32, duration: 0.45, ease: 'sine.inOut' },
    0.50
  );

  bootTimeline.call(
    () => {
      bootPhaseLabel.value = isZh.value
        ? 'PHASE 03 // 空间舞台就绪'
        : 'PHASE 03 // SPATIAL STAGE LOCKED';
      setNavbarVisible(true);
    },
    [],
    0.96
  );

  bootTimeline.to(
    logoGroup.position,
    { x: anchor.x, y: anchor.y, z: 0, duration: 0.56, ease: 'power3.inOut' },
    0.95
  );

  bootTimeline.to(
    logoGroup.scale,
    {
      x: anchor.scale,
      y: anchor.scale,
      z: anchor.scale,
      duration: 0.56,
      ease: 'power3.inOut',
    },
    0.95
  );

  bootTimeline.to(
    logoGroup.rotation,
    { x: -0.08, y: -0.22, z: 0, duration: 0.56, ease: 'power2.out' },
    0.95
  );

  if (heroContentRef.value) {
    bootTimeline.to(
      heroContentRef.value,
      { opacity: 1, y: 0, duration: 0.52, ease: 'power3.out' },
      1.02
    );
  }
}

function skipBoot() {
  bootTimeline?.progress(1);
}

function toggleOrbitMode() {
  if (!controls || !camera) return;
  isOrbitMode.value = !isOrbitMode.value;
  controls.enabled = isOrbitMode.value;
  if (!isOrbitMode.value) {
    gsap.to(camera.position, {
      x: 0,
      y: 0,
      z: 490,
      duration: 0.65,
      ease: 'power2.out',
      onUpdate: () => camera?.lookAt(0, 0, 0),
    });
  }
}

function toggleOrbitalRing() {
  showOrbitalLayer.value = !showOrbitalLayer.value;
  if (orbitalGroup) {
    gsap.to(orbitalGroup.scale, {
      x: showOrbitalLayer.value ? 1 : 0.001,
      y: showOrbitalLayer.value ? 1 : 0.001,
      z: showOrbitalLayer.value ? 1 : 0.001,
      duration: 0.45,
      ease: 'power2.inOut',
    });
  }
}

function onPointerMove(e: PointerEvent) {
  const nx = (e.clientX / window.innerWidth) * 2 - 1;
  const ny = -(e.clientY / window.innerHeight) * 2 + 1;
  targetMouse.x = nx;
  targetMouse.y = ny;

  const lon = (116.397 + nx * 0.42).toFixed(3);
  const lat = (39.908 + ny * 0.28).toFixed(3);
  pointerCoords.value = { x: `${lon}°E`, y: `${lat}°N` };
}

function onResize() {
  if (!canvasWrapRef.value || !camera || !renderer) return;
  const w = canvasWrapRef.value.clientWidth || window.innerWidth;
  const h = canvasWrapRef.value.clientHeight || window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);

  if (!isBooting.value && logoGroup) {
    const anchor = getHeroStageAnchor();
    gsap.to(logoGroup.position, { x: anchor.x, y: anchor.y, duration: 0.35 });
    gsap.to(logoGroup.scale, {
      x: anchor.scale,
      y: anchor.scale,
      z: anchor.scale,
      duration: 0.35,
    });
  }
}

function openCinema() {
  if (showCinema.value) return;
  showQrModal.value = false;
  showCinema.value = true;
  if (camera && !isOrbitMode.value) {
    gsap.to(camera.position, { z: 290, duration: 0.48, ease: 'power3.in' });
  }
}

function closeCinema() {
  showCinema.value = false;
  lastCinemaCloseAt = performance.now();
  if (camera && !isOrbitMode.value) {
    gsap.to(camera.position, { z: 490, duration: 0.65, ease: 'power3.out' });
  }
}

function onWheel(e: WheelEvent) {
  if (isBooting.value || isOrbitMode.value || showQrModal.value || showCinema.value) return;
  if (performance.now() - lastCinemaCloseAt < 750) return;
  if (e.deltaY > 28) {
    openCinema();
  }
}

function onTouchStart(e: TouchEvent) {
  touchStartY = e.touches[0]?.clientY ?? 0;
}

function onTouchEnd(e: TouchEvent) {
  if (isBooting.value || isOrbitMode.value || showQrModal.value || showCinema.value) return;
  if (performance.now() - lastCinemaCloseAt < 750) return;
  const endY = e.changedTouches[0]?.clientY ?? touchStartY;
  if (touchStartY - endY > 65) {
    openCinema();
  }
}

function renderLoop(now: number) {
  rafId = requestAnimationFrame(renderLoop);
  if (showCinema.value) return;
  const t = now * 0.001;

  if (!isBooting.value && !isOrbitMode.value && logoGroup && keyLight) {
    currentMouse.x += (targetMouse.x - currentMouse.x) * 0.06;
    currentMouse.y += (targetMouse.y - currentMouse.y) * 0.06;

    logoGroup.rotation.y = -0.22 + currentMouse.x * 0.24 + Math.sin(t * 0.7) * 0.03;
    logoGroup.rotation.x = -0.08 - currentMouse.y * 0.18 + Math.cos(t * 0.6) * 0.02;

    keyLight.position.x = 220 + currentMouse.x * 190;
    keyLight.position.y = 320 + currentMouse.y * 140;
  }

  if (satellitePivot) {
    satellitePivot.rotation.z = t * 0.65;
  }
  if (haloRingOuter) {
    const pulse = 1 + Math.sin(t * 3.2) * 0.08;
    haloRingOuter.scale.set(pulse, pulse, 1);
  }
  if (busSegments.length > 0) {
    busSegments.forEach((seg, idx) => {
      const mat = seg.material as THREE.MeshBasicMaterial;
      const wave = 0.25 + 0.55 * Math.max(0, Math.sin(t * 4.2 - idx * 0.55));
      mat.opacity = wave;
    });
  }
  if (starfield) {
    starfield.rotation.y = t * 0.025;
  }
  if (controls && controls.enabled) {
    controls.update();
  }
  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

const heroBadges = computed(() =>
  isZh.value
    ? ['AI_AGENT 工程化', '全栈端到端交付', '3D GIS 空间科技', '开源构建者']
    : ['AI_AGENT SYSTEMS', 'FULL-STACK SHIP', '3D GIS SPATIAL', 'OPEN-SOURCE BUILDER']
);

onMounted(() => {
  buildScene();
  playFastSplash(false);

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('resize', onResize);
  window.addEventListener('wheel', onWheel, { passive: true });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchend', onTouchEnd, { passive: true });
  rafId = requestAnimationFrame(renderLoop);
});

onUnmounted(() => {
  cancelAnimationFrame(rafId);
  bootTimeline?.kill();
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('resize', onResize);
  window.removeEventListener('wheel', onWheel);
  window.removeEventListener('touchstart', onTouchStart);
  window.removeEventListener('touchend', onTouchEnd);
  controls?.dispose();
  envRT?.dispose();
  pmremGenerator?.dispose();
  renderer?.dispose();
});
</script>

<template>
  <section class="relative min-h-[100svh] w-full flex items-center overflow-hidden select-none">
    <!-- Ambient Volumetric Horizon Glow -->
    <div
      class="pointer-events-none absolute -top-44 left-1/2 -translate-x-1/2 w-[980px] h-[460px] rounded-full opacity-25 blur-[130px]"
      style="background: radial-gradient(ellipse at center, #f2c97e 0%, #a87c38 45%, transparent 75%);"
    ></div>

    <!-- 3D WebGL Spatial Canvas -->
    <div
      ref="canvasWrapRef"
      class="absolute inset-0 z-10"
      :class="isOrbitMode ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none lg:pointer-events-auto'"
    ></div>

    <!-- 1.5s Fast-Boot Splash Telemetry HUD -->
    <transition
      leave-active-class="transition duration-300 ease-out"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isBooting"
        class="fixed inset-x-0 bottom-10 z-40 flex flex-col items-center gap-3 px-6 pointer-events-auto"
      >
        <div class="px-4 py-2 rounded-2xl bg-[#0b0e15]/90 border border-[#e5b66a]/35 backdrop-blur-xl shadow-2xl flex items-center gap-4">
          <span class="w-2 h-2 rounded-full bg-[#f2c97e] animate-ping"></span>
          <span class="font-mono-tech text-xs tracking-wider text-[#f4ecdb]">
            {{ bootPhaseLabel }}
          </span>
          <span class="font-mono-tech text-xs font-bold text-[#e5b66a] w-10 text-right">
            {{ bootProgress }}%
          </span>
          <button
            type="button"
            @click="skipBoot"
            class="ml-1 px-2 py-0.5 rounded-md bg-white/8 hover:bg-white/15 text-[11px] font-mono-tech text-[#a69d8b] hover:text-white transition-colors cursor-pointer"
          >
            {{ isZh ? '跳过 ↵' : 'SKIP ↵' }}
          </button>
        </div>
        <div class="w-56 h-1 rounded-full bg-white/10 overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-[#a87c38] via-[#e5b66a] to-[#fff9ec] transition-all duration-75"
            :style="{ width: `${bootProgress}%` }"
          ></div>
        </div>
      </div>
    </transition>

    <!-- Main Hero Typography & Multi-Page Portals -->
    <div
      ref="heroContentRef"
      class="relative z-20 max-w-7xl mx-auto w-full px-5 sm:px-8 pt-64 sm:pt-68 lg:pt-20 pb-24 pointer-events-none"
    >
      <div class="max-w-2xl space-y-6 pointer-events-auto">
        <!-- Engineering Telemetry Header -->
        <div class="inline-flex flex-wrap items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0f131b]/85 border border-[#e5b66a]/30 backdrop-blur-md">
          <span class="w-2 h-2 rounded-full bg-[#e5b66a] shadow-[0_0_10px_#e5b66a]"></span>
          <span class="font-mono-tech text-[11px] font-semibold tracking-widest text-[#e5b66a] uppercase">
            JIESHI LAB // SPATIAL STAGE
          </span>
          <span class="text-white/20">|</span>
          <span class="font-mono-tech text-[11px] text-[#a69d8b]">
            {{ pointerCoords.x }} · {{ pointerCoords.y }}
          </span>
        </div>

        <!-- Primary Headline -->
        <div class="space-y-2.5">
          <p class="font-mono-tech text-xs sm:text-sm tracking-[0.25em] text-[#a69d8b] uppercase">
            {{ isZh ? 'HI, I AM 桀士 · JACKIE TANG (唐浩桀)' : 'HI, I AM JACKIE TANG · 桀士' }}
          </p>
          <h1 class="text-4xl sm:text-6xl font-black tracking-tight leading-[1.12]">
            <span class="block text-[#f4ecdb]">
              {{ isZh ? '构建智能应用与' : 'Architecting AI &' }}
            </span>
            <span class="block jt-gold-text drop-shadow-[0_0_32px_rgba(229,182,106,0.28)]">
              {{ isZh ? '三维空间数字系统' : '3D Spatial Systems' }}
            </span>
          </h1>
        </div>

        <!-- Subtitle Manifesto -->
        <p class="text-base sm:text-lg text-[#a69d8b] leading-relaxed max-w-xl">
          {{
            isZh
              ? '全栈研发工程师 · AI Agent 与大模型应用探索者 · 3D GIS 数字城市架构师。以顶层架构推演耦合端到端工程闭环，用代码与数据交付真实可用的生产级应用。'
              : 'Full-Stack Engineer, AI Agent Builder & 3D GIS Spatial Architect. Uniting clean architectural systems with end-to-end engineering rigor to ship verifiable production software.'
          }}
        </p>

        <!-- Industrial Capability Pills -->
        <div class="flex flex-wrap gap-2">
          <span v-for="badge in heroBadges" :key="badge" class="jt-badge">
            {{ badge }}
          </span>
        </div>

        <!-- Dedicated Page Portal Buttons -->
        <div class="flex flex-wrap items-center gap-3.5 pt-2">
          <a
            href="/resume"
            class="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#f2c97e] via-[#e5b66a] to-[#c9923b] text-[#07090d] font-bold text-sm shadow-[0_8px_30px_rgba(229,182,106,0.32)] hover:shadow-[0_10px_38px_rgba(242,201,126,0.5)] hover:-translate-y-0.5 transition-all"
          >
            <span>{{ isZh ? '查看在线履历' : 'Online Resume' }}</span>
            <svg class="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" stroke-width="2.4" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>

          <a
            href="/works"
            class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0f131b]/90 hover:bg-[#151a24] text-[#f4ecdb] border border-[#e5b66a]/30 hover:border-[#e5b66a]/65 font-semibold text-sm backdrop-blur-md transition-all"
          >
            <span>{{ isZh ? '个人开源代表作品' : 'Open-Source Works' }}</span>
          </a>

          <a
            href="/posts"
            class="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl text-[#a69d8b] hover:text-[#f2c97e] font-mono-tech text-xs transition-colors"
          >
            <span>{{ isZh ? '历史文章 (64) →' : '64 Writings →' }}</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Bottom Interactive Stage HUD, Cinema Portal & Social Channels -->
    <div
      v-show="!isBooting"
      class="absolute bottom-4 sm:bottom-5 inset-x-0 z-20 max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto_1fr] items-end gap-3 pointer-events-none"
    >
      <!-- Left: Social Channels -->
      <div class="hidden lg:flex items-center gap-2.5 pb-1.5 font-mono-tech text-[11px] text-[#a69d8b] pointer-events-auto justify-self-start">
        <a
          href="https://github.com/tanghaojie"
          target="_blank"
          rel="noopener noreferrer"
          class="text-[#e5b66a] hover:text-[#f2c97e] transition-colors"
        >
          @tanghaojie ↗
        </a>
        <span class="text-white/20">·</span>
        <button
          type="button"
          @click="showQrModal = true"
          class="text-[#a69d8b] hover:text-[#f4ecdb] transition-colors cursor-pointer"
        >
          {{ isZh ? '公众号：桀士AI实验室 [QR]' : 'WeChat: JieShi AI Lab [QR]' }}
        </button>
      </div>

      <!-- Center: Immersive 30s Three.js Continuous Evolution Film Portal & Scroll Guide -->
      <div class="flex flex-col items-center gap-1.5 pointer-events-auto justify-self-center">
        <button
          type="button"
          @click="openCinema"
          class="group relative inline-flex items-center gap-3 px-4 sm:px-5 py-2.5 rounded-full bg-[#0a101c]/90 hover:bg-[#11192b] border border-[#e5b66a]/45 hover:border-[#f2c97e] shadow-[0_0_28px_rgba(229,182,106,0.18)] hover:shadow-[0_0_40px_rgba(242,201,126,0.36)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
        >
          <span class="w-5 h-5 rounded-full bg-[#e5b66a]/20 border border-[#f2c97e]/60 flex items-center justify-center text-[10px] text-[#f2c97e] pl-0.5">
            ▶
          </span>

          <span class="font-mono-tech text-xs font-bold tracking-wide text-[#f4ecdb] group-hover:text-[#f2c97e] transition-colors">
            {{ isZh ? '播放技术进化史 · 30s 三维一镜到底' : 'Watch Tech Evolution · 30s 3D Film' }}
          </span>

          <span class="px-1.5 py-0.5 rounded-md bg-[#38bdf8]/15 text-[#7dd3fc] font-mono-tech text-[10px] font-semibold border border-[#38bdf8]/30 hidden sm:inline">
            THREE.JS
          </span>

          <svg
            class="w-4 h-4 text-[#f2c97e] opacity-80 group-hover:translate-y-0.5 transition-transform"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <span class="font-mono-tech text-[10px] tracking-wider text-[#a69d8b]/85 hidden sm:inline">
          {{
            isOrbitMode
              ? isZh
                ? '360° 视角模式中 · 点击上方按钮观看三维演进短片'
                : '360° Orbit Active · Click above for 3D Evolution Film'
              : isZh
                ? '↓ 向下滚动或点击开启 · 从 2D GIS 升维 3D 城市迈向智能时代'
                : '↓ Scroll Down or Click · Continuous 2D GIS → 3D City → Intelligent Era'
          }}
        </span>
      </div>

      <!-- Right: 3D Interactive Controls -->
      <div class="hidden md:flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-[#0f131b]/88 border border-white/10 backdrop-blur-xl shadow-xl pointer-events-auto justify-self-end">
        <button
          type="button"
          @click="toggleOrbitMode"
          class="px-2.5 py-1.5 rounded-xl font-mono-tech text-[11px] transition-all cursor-pointer"
          :class="
            isOrbitMode
              ? 'bg-[#e5b66a] text-[#07090d] font-bold shadow'
              : 'text-[#a69d8b] hover:text-[#f4ecdb] hover:bg-white/5'
          "
        >
          {{ isOrbitMode ? (isZh ? '✓ 360°' : '✓ Orbit') : (isZh ? '🎥 360°视角' : '🎥 Orbit') }}
        </button>

        <button
          type="button"
          @click="toggleOrbitalRing"
          class="px-2.5 py-1.5 rounded-xl font-mono-tech text-[11px] transition-all cursor-pointer"
          :class="
            showOrbitalLayer
              ? 'text-[#f2c97e] bg-[#e5b66a]/12 border border-[#e5b66a]/25'
              : 'text-[#a69d8b] hover:text-[#f4ecdb] hover:bg-white/5'
          "
        >
          {{ isZh ? '🌐 轨道' : '🌐 Ring' }}
        </button>

        <button
          type="button"
          @click="playFastSplash(true)"
          class="px-2.5 py-1.5 rounded-xl font-mono-tech text-[11px] text-[#a69d8b] hover:text-[#f2c97e] hover:bg-white/5 transition-all cursor-pointer flex items-center gap-1"
          :title="isZh ? '重播破空开屏' : 'Replay 1.5s Boot'"
        >
          <span>⟳</span>
          <span>{{ isZh ? '重播' : 'Boot' }}</span>
        </button>
      </div>
    </div>

    <!-- Immersive Tech Evolution Motion Cinema Overlay -->
    <transition
      enter-active-class="transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      enter-from-class="opacity-0 scale-105 blur-md"
      enter-to-class="opacity-100 scale-100 blur-0"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <TechEvolutionCinema v-if="showCinema" @close="closeCinema" />
    </transition>

    <!-- WeChat QR Modal on Spatial Stage -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="showQrModal"
        @click.self="showQrModal = false"
        class="fixed inset-0 z-[70] bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
      >
        <div class="max-w-xs w-full rounded-2xl bg-[#0f131b] border border-[#e5b66a]/45 p-6 text-center space-y-4 shadow-2xl">
          <div class="font-mono-tech text-xs text-[#e5b66a] tracking-widest uppercase">
            WECHAT OFFICIAL ACCOUNT
          </div>
          <h4 class="text-lg font-bold text-[#f4ecdb]">
            {{ isZh ? '公众号：桀士AI实验室' : 'WeChat: JieShi AI Lab' }}
          </h4>
          <div class="p-3 rounded-xl bg-white mx-auto w-48 h-48 flex items-center justify-center">
            <img
              src="/pic_cloud/WeChat/qrcode2_compress.png"
              alt="桀士AI实验室二维码"
              class="w-full h-full object-contain"
            />
          </div>
          <p class="text-xs text-[#a69d8b]">
            {{ isZh ? '微信扫码关注，获取 AI 智能体、全栈工程与空间计算最新实践' : 'Scan with WeChat to follow AI Agent & Full-Stack insights' }}
          </p>
          <button
            type="button"
            @click="showQrModal = false"
            class="w-full py-2 rounded-xl bg-[#e5b66a] text-[#07090d] font-mono-tech text-xs font-bold cursor-pointer"
          >
            {{ isZh ? '关闭窗口' : 'Close' }}
          </button>
        </div>
      </div>
    </transition>
  </section>
</template>
