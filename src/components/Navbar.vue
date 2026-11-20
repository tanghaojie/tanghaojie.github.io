<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useLang } from '../i18n/useLang';

const props = defineProps<{
  currentPath?: string;
  postCount?: number;
}>();

const { lang, isZh, toggleLang, pick } = useLang();
const scrolled = ref(false);
const mobileOpen = ref(false);

function resolveActiveTab(pathname: string): string {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/' || clean === '/index.html') return 'hero';
  if (clean.startsWith('/resume')) return 'resume';
  if (clean.startsWith('/works')) return 'works';
  return 'posts';
}

const activeTab = ref(resolveActiveTab(props.currentPath || '/'));

const navItems = computed(() => [
  { id: 'hero', href: '/', label: { zh: '01 空间主场', en: '01 Spatial Stage' } },
  { id: 'resume', href: '/resume', label: { zh: '02 在线履历', en: '02 Online Resume' } },
  { id: 'works', href: '/works', label: { zh: '03 个人开源代表作品', en: '03 Open-Source Works' } },
  {
    id: 'posts',
    href: '/posts',
    label: {
      zh: `04 历史文章 (${props.postCount ?? 64})`,
      en: `04 Writings (${props.postCount ?? 64})`,
    },
  },
]);

function handleScroll() {
  scrolled.value = window.scrollY > 16;
}

onMounted(() => {
  activeTab.value = resolveActiveTab(window.location.pathname);
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll);
  }
});

function closeMobile() {
  mobileOpen.value = false;
}
</script>

<template>
  <header
    id="jt-global-navbar"
    class="fixed top-0 inset-x-0 z-50 px-3 sm:px-6 pt-3 sm:pt-4 pointer-events-none transition-all duration-500"
  >
    <div
      class="max-w-7xl mx-auto pointer-events-auto rounded-2xl border transition-all duration-300 px-3.5 sm:px-5 py-2.5 flex items-center justify-between gap-3 backdrop-blur-xl"
      :class="
        scrolled
          ? 'bg-[#0b0e15]/90 border-[#e5b66a]/30 shadow-[0_12px_40px_rgba(0,0,0,0.65)]'
          : 'bg-[#0b0e15]/72 border-white/10'
      "
    >
      <!-- Brand Identity Lockup -->
      <a href="/" class="flex items-center gap-2.5 group shrink-0">
        <div class="relative w-9 h-9 rounded-xl overflow-hidden border border-[#e5b66a]/35 shadow-inner group-hover:border-[#f2c97e] transition-colors">
          <img src="/brand/logo-square.svg" alt="桀士 JieShi Logo" class="w-full h-full object-cover" />
        </div>
        <div class="leading-tight">
          <div class="flex items-center gap-1.5">
            <span class="font-bold tracking-wider text-sm text-[#f4ecdb] group-hover:text-[#f2c97e] transition-colors">
              {{ isZh ? '桀士 · JACKIE TANG' : 'JACKIE TANG' }}
            </span>
            <span class="w-1.5 h-1.5 rounded-full bg-[#63cfa1] animate-pulse" title="System Online"></span>
          </div>
          <div class="font-mono-tech text-[10px] tracking-widest text-[#a69d8b] uppercase hidden sm:block">
            {{ isZh ? 'AI 智能体 · 全栈 · 3D GIS' : 'AI AGENT · FULL-STACK · 3D GIS' }}
          </div>
        </div>
      </a>

      <!-- Desktop 4-Page Navigation Links -->
      <nav class="hidden lg:flex items-center gap-1.5 font-mono-tech text-xs">
        <a
          v-for="item in navItems"
          :key="item.id"
          :href="item.href"
          class="px-3.5 py-1.5 rounded-xl transition-all duration-200 whitespace-nowrap border"
          :class="
            activeTab === item.id
              ? 'bg-gradient-to-r from-[#f2c97e] to-[#d49a3d] text-[#07090d] font-bold border-transparent shadow-[0_2px_14px_rgba(229,182,106,0.32)]'
              : 'text-[#a69d8b] border-transparent hover:text-[#f4ecdb] hover:bg-[#e5b66a]/10 hover:border-[#e5b66a]/20'
          "
        >
          {{ pick(item.label) }}
        </a>
      </nav>

      <!-- Right Controls: Bilingual Switcher + GitHub + Mobile Menu -->
      <div class="flex items-center gap-2 shrink-0">
        <!-- Hardware-style Bilingual Switcher -->
        <button
          type="button"
          @click="toggleLang"
          class="relative inline-flex items-center rounded-xl p-0.5 bg-[#151a24] border border-[#e5b66a]/30 hover:border-[#f2c97e]/60 transition-all cursor-pointer font-mono-tech text-[11px]"
          :aria-label="isZh ? 'Switch to English' : '切换为中文'"
        >
          <span
            class="px-2 py-1 rounded-lg transition-all duration-200 font-bold"
            :class="lang === 'zh' ? 'bg-[#e5b66a] text-[#07090d] shadow' : 'text-[#a69d8b] hover:text-[#f4ecdb]'"
          >
            中
          </span>
          <span
            class="px-2 py-1 rounded-lg transition-all duration-200 font-bold"
            :class="lang === 'en' ? 'bg-[#e5b66a] text-[#07090d] shadow' : 'text-[#a69d8b] hover:text-[#f4ecdb]'"
          >
            EN
          </span>
        </button>

        <!-- GitHub Profile Link -->
        <a
          href="https://github.com/tanghaojie"
          target="_blank"
          rel="noopener noreferrer"
          class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#151a24] border border-white/10 hover:border-[#e5b66a]/45 text-[#f4ecdb] hover:text-[#f2c97e] font-mono-tech text-xs transition-all"
        >
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          <span>GitHub</span>
        </a>

        <!-- Mobile Menu Button -->
        <button
          type="button"
          @click="mobileOpen = !mobileOpen"
          class="lg:hidden p-2 rounded-xl bg-[#151a24] border border-white/10 text-[#e5b66a] cursor-pointer"
          aria-label="Toggle Menu"
        >
          <svg v-if="!mobileOpen" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Dropdown Drawer -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="mobileOpen"
        class="lg:hidden max-w-7xl mx-auto mt-2 pointer-events-auto rounded-2xl bg-[#0f131b]/96 border border-[#e5b66a]/30 backdrop-blur-xl p-3 shadow-2xl space-y-1 font-mono-tech text-xs"
      >
        <a
          v-for="item in navItems"
          :key="item.id"
          :href="item.href"
          @click="closeMobile"
          class="block px-3.5 py-2.5 rounded-xl transition-colors"
          :class="
            activeTab === item.id
              ? 'bg-[#e5b66a] text-[#07090d] font-bold'
              : 'text-[#f4ecdb] hover:bg-white/5'
          "
        >
          {{ pick(item.label) }}
        </a>
        <div class="pt-2 mt-2 border-t border-white/10 flex items-center justify-between px-2">
          <a
            href="https://github.com/tanghaojie"
            target="_blank"
            rel="noopener noreferrer"
            class="text-[#e5b66a] hover:underline py-1"
          >
            GitHub @tanghaojie ↗
          </a>
        </div>
      </div>
    </transition>
  </header>
</template>
