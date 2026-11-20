import { ref, computed, onMounted, onUnmounted } from 'vue';

export type Lang = 'zh' | 'en';

const STORAGE_KEY = 'jt-lang';
const EVENT_NAME = 'jt-lang-change';

const currentLang = ref<Lang>('zh');

export function getInitialLang(): Lang {
  if (typeof window === 'undefined') return 'zh';
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === 'en' || saved === 'zh') return saved;
  return 'zh';
}

export function setGlobalLang(next: Lang) {
  currentLang.value = next;
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.dataset.lang = next;
    document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en';
    window.dispatchEvent(new CustomEvent<Lang>(EVENT_NAME, { detail: next }));
  }
}

export function toggleGlobalLang() {
  setGlobalLang(currentLang.value === 'zh' ? 'en' : 'zh');
}

export function useLang() {
  const syncFromEvent = (e: Event) => {
    const detail = (e as CustomEvent<Lang>).detail;
    if (detail === 'zh' || detail === 'en') {
      currentLang.value = detail;
    }
  };

  onMounted(() => {
    const init = getInitialLang();
    currentLang.value = init;
    document.documentElement.dataset.lang = init;
    window.addEventListener(EVENT_NAME, syncFromEvent);
  });

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener(EVENT_NAME, syncFromEvent);
    }
  });

  const isZh = computed(() => currentLang.value === 'zh');

  function pick<T>(bilingual: { zh: T; en: T }): T {
    return bilingual[currentLang.value];
  }

  return {
    lang: currentLang,
    isZh,
    setLang: setGlobalLang,
    toggleLang: toggleGlobalLang,
    pick,
  };
}
