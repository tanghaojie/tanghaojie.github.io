<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import gsap from 'gsap';
import { flagshipProjects } from '../data/projects';
import { useLang } from '../i18n/useLang';

const { isZh, pick } = useLang();

const rootRef = ref<HTMLElement | null>(null);
const tiltMap = reactive<Record<string, string>>({});

function handleCardMove(e: MouseEvent, id: string) {
  const el = e.currentTarget as HTMLElement;
  const rect = el.getBoundingClientRect();
  const px = (e.clientX - rect.left) / rect.width - 0.5;
  const py = (e.clientY - rect.top) / rect.height - 0.5;
  const rx = (-py * 6).toFixed(2);
  const ry = (px * 6).toFixed(2);
  tiltMap[id] = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
}

function resetCardTilt(id: string) {
  tiltMap[id] = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)';
}

onMounted(() => {
  if (!rootRef.value) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const items = rootRef.value.querySelectorAll('.jt-work-reveal');
  gsap.fromTo(
    items,
    { opacity: 0, y: 22 },
    { opacity: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'power3.out' }
  );
});
</script>

<template>
  <section ref="rootRef" class="relative pt-28 sm:pt-32 pb-24 px-5 sm:px-8 max-w-7xl mx-auto overflow-hidden">
    <!-- Subtle Top Ambient Aura -->
    <div
      class="pointer-events-none absolute -top-36 left-1/2 -translate-x-1/2 w-[760px] h-[300px] rounded-full opacity-18 blur-[120px]"
      style="background: radial-gradient(ellipse at center, #e5b66a 0%, transparent 72%);"
    ></div>

    <!-- Page Header -->
    <div class="jt-work-reveal flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <div class="space-y-3">
        <div class="inline-flex items-center gap-2 font-mono-tech text-xs tracking-widest text-[#e5b66a] uppercase">
          <span>// PAGE 03</span>
          <span class="w-8 h-px bg-[#e5b66a]/40"></span>
          <span>PERSONAL OPEN-SOURCE WORKS</span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-black tracking-tight text-[#f4ecdb]">
          <span v-if="isZh">个人<span class="jt-gold-text">开源代表作品</span></span>
          <span v-else>Personal <span class="jt-gold-text">Open-Source Works</span></span>
        </h1>
      </div>

      <a
        href="https://github.com/tanghaojie?tab=repositories"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#151a24] border border-[#e5b66a]/30 font-mono-tech text-xs text-[#e5b66a] hover:text-[#f2c97e] hover:border-[#e5b66a]/60 transition-all self-start md:self-auto"
      >
        <span>{{ isZh ? '访问 GitHub 查看全部 60+ 开源仓库' : 'View All 60+ Repos on GitHub' }}</span>
        <span>↗</span>
      </a>
    </div>

    <!-- 3D Tilt Spotlight Open-Source Project Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
      <article
        v-for="proj in flagshipProjects"
        :key="proj.id"
        @mousemove="(e) => handleCardMove(e, proj.id)"
        @mouseleave="resetCardTilt(proj.id)"
        :style="{ transform: tiltMap[proj.id] || 'none' }"
        class="jt-work-reveal jt-spotlight-card p-6 flex flex-col justify-between gap-6 will-change-transform group"
      >
        <div class="space-y-4">
          <!-- Top Icon & Telemetry Row -->
          <div class="flex items-start justify-between gap-3">
            <div class="w-14 h-14 rounded-2xl overflow-hidden border border-white/12 bg-[#0b0f17] p-0.5 shadow-lg shrink-0 group-hover:border-[#e5b66a]/50 transition-colors">
              <img :src="proj.icon" :alt="pick(proj.name)" class="w-full h-full object-contain" loading="lazy" />
            </div>
            <div class="flex flex-col items-end gap-1.5">
              <span
                class="px-2.5 py-0.5 rounded-full font-mono-tech text-[10px] font-semibold border"
                :style="{
                  color: proj.accent === '#FFFFFF' ? '#F2C97E' : proj.accent,
                  borderColor: `${proj.accent}44`,
                  backgroundColor: `${proj.accent}14`,
                }"
              >
                {{ pick(proj.badge) }}
              </span>
              <span class="font-mono-tech text-[10px] text-[#a69d8b]">
                {{ pick(proj.metrics) }}
              </span>
            </div>
          </div>

          <!-- Title & Tagline -->
          <div>
            <div class="font-mono-tech text-[10px] tracking-wider text-[#a69d8b] mb-1">
              {{ proj.code }}
            </div>
            <h2 class="text-lg font-bold text-[#f4ecdb] group-hover:text-[#f2c97e] transition-colors">
              {{ pick(proj.name) }}
            </h2>
            <p class="text-xs font-medium text-[#e5b66a]/90 mt-1">
              {{ pick(proj.tagline) }}
            </p>
          </div>

          <!-- Description -->
          <p class="text-sm text-[#a69d8b] leading-relaxed">
            {{ pick(proj.description) }}
          </p>
        </div>

        <!-- Footer: Stack + Action Links -->
        <div class="space-y-4 pt-3 border-t border-white/8">
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="tech in proj.stack"
              :key="tech"
              class="px-2 py-0.5 rounded bg-[#151a24] font-mono-tech text-[10px] text-[#a69d8b]"
            >
              {{ tech }}
            </span>
          </div>

          <div class="flex items-center gap-3 font-mono-tech text-xs">
            <a
              :href="proj.repoUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#e5b66a]/15 hover:bg-[#e5b66a] text-[#f2c97e] hover:text-[#07090d] font-semibold border border-[#e5b66a]/35 transition-all"
            >
              <span>{{ isZh ? '开源仓库' : 'GitHub Repo' }}</span>
              <span>↗</span>
            </a>
            <a
              v-if="proj.liveUrl"
              :href="proj.liveUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#151a24] hover:bg-white/10 text-[#f4ecdb] border border-white/10 transition-all"
            >
              <span>{{ isZh ? '在线演示' : 'Live Demo' }}</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      </article>
    </div>

    <!-- Next Page Portal Bar -->
    <div class="jt-work-reveal flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-[#0f131b]/85 border border-[#e5b66a]/22">
      <div class="text-xs sm:text-sm text-[#a69d8b]">
        {{ isZh ? '继续阅读自 2019 年以来沉淀的 64 篇原创技术文章与几何算法笔记' : 'Continue to read all 64 historical technical articles & geometry notes' }}
      </div>
      <a
        href="/posts"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#f2c97e] to-[#d49a3d] text-[#07090d] font-mono-tech text-xs font-bold shadow hover:opacity-95 transition-all"
      >
        <span>{{ isZh ? '04 历史文章归档' : '04 Historical Writings' }}</span>
        <span>→</span>
      </a>
    </div>
  </section>
</template>
