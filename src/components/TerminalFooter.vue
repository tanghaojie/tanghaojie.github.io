<script setup lang="ts">
import { ref } from 'vue';
import { useLang } from '../i18n/useLang';

const { isZh } = useLang();
const showQrModal = ref(false);
const copiedSite = ref(false);

async function copySiteUrl() {
  try {
    await navigator.clipboard.writeText('https://tanghaojie.github.io');
  } catch {
    // ignore
  }
  copiedSite.value = true;
  setTimeout(() => {
    copiedSite.value = false;
  }, 1800);
}
</script>

<template>
  <footer class="relative border-t border-[var(--jt-border)] bg-[#06080c] text-[#f4ecdb]">
    <div class="max-w-7xl mx-auto px-5 sm:px-8 py-14">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        <!-- Brand Column -->
        <div class="md:col-span-6 space-y-4">
          <div class="flex items-center gap-3">
            <img src="/brand/logo-square.svg" alt="桀士 AI 实验室" class="w-10 h-10 rounded-xl border border-[#e5b66a]/30" />
            <div>
              <div class="font-bold tracking-wider text-base text-[#f4ecdb]">
                {{ isZh ? '桀士 AI 实验室 · JIESHI LAB' : 'JIESHI AI LAB · JACKIE TANG' }}
              </div>
              <div class="font-mono-tech text-[11px] text-[#e5b66a]">
                EXPLORING TECHNOLOGY · BUILDING INTELLIGENT APPLICATIONS
              </div>
            </div>
          </div>

          <p class="text-xs sm:text-sm text-[#a69d8b] max-w-md leading-relaxed">
            {{
              isZh
                ? '我们追逐的绝不是别人的起点，而是每一个未知的明天。专注 AI 智能体工程化、现代全栈架构与 3D GIS 数字城市研发。'
                : 'Exploring LLM Agents, Modern Full-Stack Architecture, and 3D Geospatial Digital Twins — shipping verifiable production software.'
            }}
          </p>
        </div>

        <!-- 4-Page Site Map -->
        <div class="md:col-span-3 space-y-2.5 font-mono-tech text-xs">
          <div class="text-[#e5b66a] font-bold uppercase tracking-wider mb-3">
            {{ isZh ? '站点导航 // PAGES' : 'NAVIGATION // PAGES' }}
          </div>
          <a href="/" class="block text-[#a69d8b] hover:text-[#f2c97e] transition-colors">
            {{ isZh ? '01 空间主场 →' : '01 Spatial Stage →' }}
          </a>
          <a href="/resume" class="block text-[#a69d8b] hover:text-[#f2c97e] transition-colors">
            {{ isZh ? '02 在线履历 →' : '02 Online Resume →' }}
          </a>
          <a href="/works" class="block text-[#a69d8b] hover:text-[#f2c97e] transition-colors">
            {{ isZh ? '03 个人开源代表作品 →' : '03 Open-Source Works →' }}
          </a>
          <a href="/posts" class="block text-[#a69d8b] hover:text-[#f2c97e] transition-colors">
            {{ isZh ? '04 历史文章 (64) →' : '04 Writings (64) →' }}
          </a>
        </div>

        <!-- Connect & WeChat Official Account -->
        <div class="md:col-span-3 space-y-3 font-mono-tech text-xs">
          <div class="text-[#e5b66a] font-bold uppercase tracking-wider mb-3">
            {{ isZh ? '连接与交流 // CONNECT' : 'CONNECT // CHANNELS' }}
          </div>

          <a
            href="https://github.com/tanghaojie"
            target="_blank"
            rel="noopener noreferrer"
            class="w-full px-3.5 py-2 rounded-xl bg-[#0f131b] hover:bg-white/5 border border-white/10 text-left text-[#f4ecdb] hover:text-[#f2c97e] transition-all flex items-center justify-between"
          >
            <span>GitHub @tanghaojie</span>
            <span>↗</span>
          </a>

          <button
            type="button"
            @click="showQrModal = true"
            class="w-full px-3.5 py-2.5 rounded-xl bg-[#151a24] hover:bg-[#e5b66a]/15 border border-[#e5b66a]/30 text-left text-[#f4ecdb] hover:text-[#f2c97e] transition-all flex items-center justify-between cursor-pointer"
          >
            <span>{{ isZh ? '微信公众号「桀士AI实验室」' : 'WeChat: JieShi AI Lab' }}</span>
            <span class="text-[#e5b66a]">QR ⊞</span>
          </button>

          <button
            type="button"
            @click="copySiteUrl"
            class="w-full px-3.5 py-2 rounded-xl bg-[#0f131b] hover:bg-white/5 border border-white/10 text-left text-[#a69d8b] hover:text-[#f4ecdb] transition-all flex items-center justify-between cursor-pointer"
          >
            <span>{{ copiedSite ? (isZh ? '✓ 站点链接已复制' : '✓ URL Copied') : 'tanghaojie.github.io' }}</span>
            <span>⧉</span>
          </button>
        </div>
      </div>

      <!-- Bottom Telemetry Bar -->
      <div class="mt-12 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono-tech text-[11px] text-[#6e6759]">
        <div>
          © 2019–2026 JACKIE TANG (唐浩桀). ALL RIGHTS RESERVED.
        </div>
        <div class="flex items-center gap-3">
          <span>ASTRO 5 × VUE 3 × THREE.JS × GSAP</span>
          <span class="text-[#e5b66a]">● SPATIAL v2</span>
        </div>
      </div>
    </div>

    <!-- WeChat QR Code Modal -->
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
  </footer>
</template>
