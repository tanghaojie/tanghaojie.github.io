<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useLang } from '../i18n/useLang';

const { isZh } = useLang();
const progress = ref(0);
const isLightMode = ref(false);

function updateScrollProgress() {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (docHeight <= 0) {
    progress.value = 0;
    return;
  }
  progress.value = Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100));
}

function toggleReaderTheme() {
  isLightMode.value = !isLightMode.value;
  const next = isLightMode.value ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  window.localStorage.setItem('jt-reader-theme', next);
}

onMounted(() => {
  const saved = window.localStorage.getItem('jt-reader-theme');
  if (saved === 'light') {
    isLightMode.value = true;
    document.documentElement.setAttribute('data-theme', 'light');
  }
  updateScrollProgress();
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', updateScrollProgress);
    document.documentElement.removeAttribute('data-theme');
  }
});
</script>

<template>
  <div>
    <!-- Top Hairline Reading Progress Bar -->
    <div class="fixed top-0 inset-x-0 h-[2.5px] z-[60] bg-transparent pointer-events-none">
      <div
        class="h-full bg-gradient-to-r from-[#a87c38] via-[#e5b66a] to-[#fff9ec] transition-[width] duration-75"
        :style="{ width: `${progress}%` }"
      ></div>
    </div>

    <!-- Reader Utility Strip -->
    <div class="flex flex-wrap items-center justify-between gap-3 pb-6 mb-8 border-b border-[var(--jt-border)] font-mono-tech text-xs">
      <div class="flex items-center gap-2 text-[var(--jt-text-sand)]">
        <a href="/posts" class="text-[var(--jt-gold-primary)] hover:underline font-semibold">
          ← {{ isZh ? '返回文章归档' : 'All Writings' }}
        </a>
        <span class="opacity-35">/</span>
        <a href="/" class="hover:text-[var(--jt-text-ivory)] transition-colors">
          {{ isZh ? '个人主场' : 'Home Stage' }}
        </a>
      </div>

      <!-- Dark / Xuan-Paper Light Reading Mode Switcher -->
      <button
        type="button"
        @click="toggleReaderTheme"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--jt-border-gold)] bg-[var(--jt-surface-sub)] text-[var(--jt-gold-primary)] font-semibold cursor-pointer transition-all hover:opacity-90"
      >
        <span>{{ isLightMode ? '🌙' : '☀️' }}</span>
        <span>
          {{
            isLightMode
              ? isZh
                ? '切换黑曜暗色模式'
                : 'Obsidian Dark Mode'
              : isZh
                ? '切换宣纸亮色阅读'
                : 'Xuan-Paper Light Mode'
          }}
        </span>
      </button>
    </div>
  </div>
</template>
