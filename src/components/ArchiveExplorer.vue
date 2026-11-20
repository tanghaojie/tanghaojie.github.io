<script setup lang="ts">
import { ref, computed } from 'vue';
import { useLang } from '../i18n/useLang';

export interface PostSummaryItem {
  title: string;
  dateStr: string;
  year: string;
  href: string;
  tags: string[];
  excerpt: string;
  math?: boolean;
}

const props = defineProps<{
  posts: PostSummaryItem[];
}>();

const { isZh, pick } = useLang();

const query = ref('');
const activeDomain = ref('all');

const domainFilters = [
  { id: 'all', label: { zh: '全部文章', en: 'All Writings' }, keywords: [] as string[] },
  {
    id: 'gis',
    label: { zh: 'GIS / 3D Tiles / 测绘', en: 'GIS & 3D Spatial' },
    keywords: ['gis', 'cesium', '3d', 'tiles', 'gltf', 'qgis', '大疆', 'rtk', 'ppk', '水准面', '空间', '相机', '航线', 'postgis', '地图'],
  },
  {
    id: 'devops',
    label: { zh: 'Docker / Git / 运维', en: 'Docker & DevOps' },
    keywords: ['docker', 'git', 'nginx', 'ssl', 'nextcloud', 'postgres', 'onlyoffice'],
  },
  {
    id: 'frontend',
    label: { zh: 'Vue / Flutter / 前端', en: 'Frontend & Cross-App' },
    keywords: ['vue', 'flutter', 'uniapp', 'nuxt', 'web', '设计模式', 'website'],
  },
  {
    id: 'math-py',
    label: { zh: '数学 / Python / 综合', en: 'Math & Python' },
    keywords: ['线性代数', 'latex', 'python', 'scrapy', 'net', 'entity', 'office'],
  },
];

const filteredPosts = computed(() => {
  const q = query.value.trim().toLowerCase();
  const domainObj = domainFilters.find((d) => d.id === activeDomain.value);

  return props.posts.filter((p) => {
    const hay = `${p.title} ${p.tags.join(' ')} ${p.excerpt}`.toLowerCase();
    if (q && !hay.includes(q)) return false;
    if (domainObj && domainObj.keywords.length > 0) {
      return domainObj.keywords.some((kw) => hay.includes(kw));
    }
    return true;
  });
});

const groupedByYear = computed(() => {
  const map = new Map<string, PostSummaryItem[]>();
  for (const p of filteredPosts.value) {
    const list = map.get(p.year) ?? [];
    list.push(p);
    map.set(p.year, list);
  }
  return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
});
</script>

<template>
  <div class="relative max-w-5xl mx-auto px-5 sm:px-8 pt-28 sm:pt-32 pb-24 overflow-hidden">
    <!-- Subtle Top Ambient Aura -->
    <div
      class="pointer-events-none absolute -top-36 left-1/2 -translate-x-1/2 w-[720px] h-[280px] rounded-full opacity-16 blur-[120px]"
      style="background: radial-gradient(ellipse at center, #e5b66a 0%, transparent 72%);"
    ></div>

    <!-- Vault Header -->
    <div class="space-y-3 mb-10">
      <div class="inline-flex items-center gap-2 font-mono-tech text-xs tracking-widest text-[#e5b66a] uppercase">
        <span>// PAGE 04</span>
        <span class="w-8 h-px bg-[#e5b66a]/40"></span>
        <span>HISTORICAL WRITINGS ARCHIVE</span>
      </div>

      <h1 class="text-3xl sm:text-5xl font-black tracking-tight text-[#f4ecdb]">
        <span v-if="isZh">历史<span class="jt-gold-text">技术文章</span></span>
        <span v-else>Historical <span class="jt-gold-text">Technical Writings</span></span>
      </h1>

      <p class="text-sm sm:text-base text-[#a69d8b] max-w-2xl">
        {{
          isZh
            ? `完整保留自 2019 年以来的 ${posts.length} 篇原创工程实践、GIS 空间几何推导、3D Tiles 规范解析与全栈运维笔记。`
            : `Preserving all ${posts.length} original engineering notes, computational geometry derivations, 3D Tiles specs, and full-stack guides since 2019.`
        }}
      </p>
    </div>

    <!-- Search & Domain Filter Bar -->
    <div class="jt-spotlight-card p-4 sm:p-5 mb-10 space-y-4">
      <div class="relative">
        <svg
          class="w-4 h-4 text-[#e5b66a] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="query"
          type="text"
          :placeholder="isZh ? '输入关键词检索标题、摘要或技术标签（如 3D Tiles、线性代数、Docker）...' : 'Search titles, excerpts, or tags (e.g. 3D Tiles, PostGIS, Docker)...'"
          class="w-full pl-11 pr-10 py-3 rounded-xl bg-[#07090d]/90 border border-white/10 focus:border-[#e5b66a]/65 focus:outline-none text-sm text-[#f4ecdb] placeholder-[#6e6759] font-sans transition-colors"
        />
        <button
          v-if="query"
          type="button"
          @click="query = ''"
          class="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded text-xs font-mono-tech text-[#a69d8b] hover:text-white cursor-pointer"
        >
          ESC
        </button>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="f in domainFilters"
            :key="f.id"
            type="button"
            @click="activeDomain = f.id"
            class="px-3 py-1.5 rounded-lg font-mono-tech text-xs transition-all cursor-pointer border"
            :class="
              activeDomain === f.id
                ? 'bg-[#e5b66a] text-[#07090d] font-bold border-transparent'
                : 'bg-[#151a24] text-[#a69d8b] border-white/8 hover:text-[#f4ecdb] hover:border-[#e5b66a]/30'
            "
          >
            {{ pick(f.label) }}
          </button>
        </div>

        <span class="font-mono-tech text-xs text-[#a69d8b]">
          {{ isZh ? `匹配 ${filteredPosts.length} / ${posts.length} 篇` : `Showing ${filteredPosts.length} of ${posts.length}` }}
        </span>
      </div>
    </div>

    <!-- Year-Grouped Clean Timeline Stream -->
    <div v-if="groupedByYear.length > 0" class="space-y-12">
      <section v-for="[year, yearPosts] in groupedByYear" :key="year" class="space-y-3">
        <div class="flex items-baseline gap-3 pb-2 border-b border-white/10">
          <h2 class="text-2xl sm:text-3xl font-black font-mono-tech jt-gold-text">
            {{ year }}
          </h2>
          <span class="font-mono-tech text-xs text-[#a69d8b]">
            // {{ yearPosts.length }} {{ isZh ? '篇归档' : 'ARTICLES' }}
          </span>
        </div>

        <div class="divide-y divide-white/6">
          <a
            v-for="post in yearPosts"
            :key="post.href"
            :href="post.href"
            class="py-4 px-3 -mx-3 rounded-xl hover:bg-[#151a24]/75 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 group"
          >
            <div class="space-y-1 min-w-0">
              <div class="flex items-center gap-2.5">
                <span class="font-mono-tech text-xs text-[#a69d8b] shrink-0 w-24">
                  {{ post.dateStr }}
                </span>
                <h3 class="text-sm sm:text-base font-semibold text-[#f4ecdb] group-hover:text-[#f2c97e] transition-colors truncate">
                  {{ post.title }}
                </h3>
              </div>
              <p class="text-xs text-[#a69d8b]/80 line-clamp-1 sm:pl-[106px]">
                {{ post.excerpt }}
              </p>
            </div>

            <div class="flex items-center gap-1.5 shrink-0 sm:pl-4 pl-[106px]">
              <span
                v-if="post.math"
                class="px-1.5 py-0.5 rounded bg-[#e5b66a]/12 text-[#e5b66a] font-mono-tech text-[10px]"
              >
                Math
              </span>
              <span
                v-for="t in post.tags.slice(0, 2)"
                :key="t"
                class="px-2 py-0.5 rounded bg-[#0f131b] border border-white/8 font-mono-tech text-[10px] text-[#a69d8b]"
              >
                {{ t }}
              </span>
              <span class="font-mono-tech text-xs text-[#e5b66a] opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                →
              </span>
            </div>
          </a>
        </div>
      </section>
    </div>

    <!-- Empty State -->
    <div v-else class="jt-spotlight-card p-12 text-center space-y-3">
      <div class="font-mono-tech text-sm text-[#e5b66a]">NO_MATCHING_RECORDS</div>
      <p class="text-sm text-[#a69d8b]">
        {{ isZh ? '未找到匹配该关键词的历史文章，请尝试清空筛选条件。' : 'No articles matched your filter. Try clearing the search query.' }}
      </p>
      <button
        type="button"
        @click="query = ''; activeDomain = 'all'"
        class="px-4 py-2 rounded-xl bg-[#e5b66a] text-[#07090d] font-mono-tech text-xs font-bold cursor-pointer"
      >
        {{ isZh ? '重置筛选' : 'Reset Filters' }}
      </button>
    </div>
  </div>
</template>
