<script setup lang="ts">
import { ref, onMounted } from 'vue';
import gsap from 'gsap';
import { resumeProfile } from '../data/resume';
import { useLang } from '../i18n/useLang';

const { isZh, pick } = useLang();
const rootRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (!rootRef.value) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const items = rootRef.value.querySelectorAll('.jt-reveal-item');
  gsap.fromTo(
    items,
    { opacity: 0, y: 22 },
    { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power3.out' }
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
    <div class="jt-reveal-item flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
      <div class="space-y-3">
        <div class="inline-flex items-center gap-2 font-mono-tech text-xs tracking-widest text-[#e5b66a] uppercase">
          <span>// PAGE 02</span>
          <span class="w-8 h-px bg-[#e5b66a]/40"></span>
          <span>ONLINE RESUME & CAPABILITY MATRIX</span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-black tracking-tight text-[#f4ecdb]">
          {{ isZh ? '个人在线履历与' : 'Online Resume &' }}
          <span class="jt-gold-text">{{ isZh ? '全栈能力矩阵' : 'Capability Matrix' }}</span>
        </h1>
      </div>
      <p class="text-sm text-[#a69d8b] max-w-md font-mono-tech">
        {{
          isZh
            ? 'AI 智能体 × 现代全栈工程 × 3D GIS 空间数字化 — 端到端独立闭环交付'
            : 'AI Agent × Modern Full-Stack × 3D GIS — End-to-End Production Shipping'
        }}
      </p>
    </div>

    <!-- Top Architect Summary Bento Card -->
    <div class="jt-reveal-item jt-spotlight-card jt-reticle-tl p-6 sm:p-8 mb-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <!-- Profile Bio -->
        <div class="lg:col-span-7 space-y-4">
          <div class="flex flex-wrap items-center gap-3">
            <div class="w-12 h-12 rounded-2xl overflow-hidden border border-[#e5b66a]/40 shrink-0">
              <img src="/brand/logo-square.svg" alt="Jackie Tang" class="w-full h-full object-cover" />
            </div>
            <div>
              <h2 class="text-xl sm:text-2xl font-bold text-[#f4ecdb]">
                {{ pick(resumeProfile.name) }}
              </h2>
              <p class="text-xs sm:text-sm font-mono-tech text-[#e5b66a]">
                {{ pick(resumeProfile.title) }}
              </p>
            </div>
          </div>

          <p class="text-sm sm:text-base text-[#a69d8b] leading-relaxed">
            {{ pick(resumeProfile.manifesto) }}
          </p>

          <div class="flex flex-wrap items-center gap-3 pt-1 font-mono-tech text-xs">
            <span class="px-3 py-1 rounded-lg bg-[#151a24] border border-white/8 text-[#f4ecdb]">
              📍 {{ pick(resumeProfile.location) }}
            </span>
            <a
              href="https://github.com/tanghaojie"
              target="_blank"
              rel="noopener noreferrer"
              class="px-3 py-1 rounded-lg bg-[#e5b66a]/12 border border-[#e5b66a]/30 text-[#f2c97e] hover:bg-[#e5b66a]/20 transition-colors"
            >
              github.com/tanghaojie ↗
            </a>
            <span class="px-3 py-1 rounded-lg bg-[#63cfa1]/10 border border-[#63cfa1]/25 text-[#63cfa1]">
              ● {{ isZh ? '持续探索与交付中' : 'Open to Technical Exchange' }}
            </span>
          </div>
        </div>

        <!-- 4 Core Quantitative Metrics -->
        <div class="lg:col-span-5 grid grid-cols-2 gap-3">
          <div
            v-for="m in resumeProfile.metrics"
            :key="m.value + m.suffix"
            class="p-4 rounded-2xl bg-[#151a24]/85 border border-white/8 flex flex-col justify-between"
          >
            <div class="text-2xl sm:text-3xl font-black font-mono-tech jt-gold-text">
              {{ m.value }}<span class="text-lg text-[#e5b66a]">{{ m.suffix }}</span>
            </div>
            <div class="text-xs text-[#a69d8b] mt-1.5">
              {{ pick(m.label) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 4 Capability Pillars Bento Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
      <div
        v-for="pillar in resumeProfile.pillars"
        :key="pillar.id"
        class="jt-reveal-item jt-spotlight-card p-6 sm:p-7 flex flex-col justify-between gap-5 group"
      >
        <div class="space-y-3.5">
          <div class="flex items-center justify-between gap-2">
            <span class="font-mono-tech text-[11px] tracking-wider text-[#a69d8b]">
              {{ pillar.code }}
            </span>
            <span
              class="w-2.5 h-2.5 rounded-full transition-transform duration-300 group-hover:scale-125"
              :style="{ backgroundColor: pillar.accentColor, boxShadow: `0 0 12px ${pillar.accentColor}` }"
            ></span>
          </div>

          <div>
            <h3 class="text-xl font-bold text-[#f4ecdb] group-hover:text-[#f2c97e] transition-colors">
              {{ pick(pillar.title) }}
            </h3>
            <p class="font-mono-tech text-xs text-[#e5b66a]/90 mt-0.5">
              {{ pick(pillar.subtitle) }}
            </p>
          </div>

          <p class="text-sm text-[#a69d8b] leading-relaxed">
            {{ pick(pillar.summary) }}
          </p>

          <!-- Key Deliverables -->
          <ul class="space-y-1.5 pt-1">
            <li
              v-for="(item, idx) in pillar.deliverables"
              :key="idx"
              class="flex items-start gap-2 text-xs sm:text-sm text-[#f4ecdb]/90"
            >
              <span class="text-[#e5b66a] font-mono-tech mt-0.5">▹</span>
              <span>{{ pick(item) }}</span>
            </li>
          </ul>
        </div>

        <!-- Tech Stack Chips -->
        <div class="flex flex-wrap gap-1.5 pt-3 border-t border-white/8">
          <span
            v-for="skill in pillar.skills"
            :key="skill"
            class="px-2.5 py-1 rounded-md bg-[#151a24] border border-white/8 font-mono-tech text-[11px] text-[#a69d8b] group-hover:border-[#e5b66a]/25 group-hover:text-[#f4ecdb] transition-colors"
          >
            {{ skill }}
          </span>
        </div>
      </div>
    </div>

    <!-- Engineering Evolution Timeline -->
    <div class="jt-reveal-item jt-spotlight-card p-6 sm:p-8 mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-7">
        <div>
          <span class="font-mono-tech text-[11px] text-[#e5b66a] uppercase tracking-widest">
            CHRONOLOGY // TECH EVOLUTION
          </span>
          <h3 class="text-lg sm:text-xl font-bold text-[#f4ecdb] mt-0.5">
            {{ isZh ? '技术演进与工程沉淀脉络' : 'Engineering Evolution & Focus Timeline' }}
          </h3>
        </div>
        <span class="font-mono-tech text-[11px] text-[#a69d8b] px-2.5 py-1 rounded-lg bg-[#151a24] border border-white/8 self-start sm:self-auto">
          {{ isZh ? '模块化履历槽位 · v1' : 'Modular Resume Schema · v1' }}
        </span>
      </div>

      <div class="relative pl-6 sm:pl-8 border-l border-[#e5b66a]/25 space-y-8">
        <div
          v-for="stage in resumeProfile.evolutionStages"
          :key="stage.period"
          class="relative group"
        >
          <span
            class="absolute -left-[30px] sm:-left-[38px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#07090d] border-2 border-[#e5b66a] group-hover:bg-[#f2c97e] group-hover:shadow-[0_0_12px_#f2c97e] transition-all"
          ></span>

          <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
            <h4 class="text-base sm:text-lg font-bold text-[#f4ecdb]">
              {{ pick(stage.role) }}
            </h4>
            <span class="font-mono-tech text-xs font-semibold text-[#e5b66a] shrink-0">
              {{ stage.period }}
            </span>
          </div>

          <p class="font-mono-tech text-xs text-[#a69d8b] mb-2.5">
            {{ pick(stage.domain) }}
          </p>

          <ul class="space-y-1.5 mb-3">
            <li
              v-for="(hl, i) in stage.highlights"
              :key="i"
              class="text-sm text-[#a69d8b] leading-relaxed flex items-start gap-2"
            >
              <span class="text-[#e5b66a] mt-1 text-xs">•</span>
              <span>{{ pick(hl) }}</span>
            </li>
          </ul>

          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="tag in stage.tags"
              :key="tag"
              class="px-2 py-0.5 rounded bg-[#151a24] text-[11px] font-mono-tech text-[#e5b66a]/85 border border-[#e5b66a]/18"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Next Page Portal Bar -->
    <div class="jt-reveal-item flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-[#0f131b]/85 border border-[#e5b66a]/22">
      <div class="text-xs sm:text-sm text-[#a69d8b]">
        {{ isZh ? '进一步查看真实可验证的开源代码仓库与在线演示项目' : 'Explore verifiable open-source repositories and live engineering demos' }}
      </div>
      <a
        href="/works"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#f2c97e] to-[#d49a3d] text-[#07090d] font-mono-tech text-xs font-bold shadow hover:opacity-95 transition-all"
      >
        <span>{{ isZh ? '03 个人开源代表作品' : '03 Open-Source Works' }}</span>
        <span>→</span>
      </a>
    </div>
  </section>
</template>
