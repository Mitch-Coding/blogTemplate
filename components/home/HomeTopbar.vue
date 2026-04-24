<script setup lang="ts">
import { HOME_PAGE_CONTENT } from "~/content/site/home.config"

const isOpen = ref(false)
const topbarRef = ref<HTMLElement | null>(null)
const { theme, toggleTheme } = useTheme()
const { language, toggleLanguage } = useSiteLanguage()

const themeIcon = computed(() => (theme.value === "light" ? "◑" : "☀"))
const themeAria = computed(() =>
  theme.value === "light" ? "Switch to dark theme" : "Switch to light theme",
)
const languageButtonLabel = computed(() => (language.value === "zh" ? "CH" : "EN"))
const languageButtonAria = computed(() =>
  language.value === "zh" ? "Switch to English" : "Switch to Chinese",
)

const closeMenu = () => {
  isOpen.value = false
}

const handleDocumentClick = (event: MouseEvent) => {
  if (!isOpen.value) return
  if (event.target instanceof Node && topbarRef.value?.contains(event.target)) return
  closeMenu()
}

onMounted(() => {
  document.addEventListener("click", handleDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener("click", handleDocumentClick)
})
</script>

<template>
  <header ref="topbarRef" class="topbar" :class="{ 'is-open': isOpen }">
    <a class="brand" href="#hero" aria-label="Go to top">{{ HOME_PAGE_CONTENT.topbar.brand }}</a>
    <div class="topbar-menu">
      <button
        class="topbar-theme"
        id="theme-toggle"
        type="button"
        :aria-label="themeAria"
        @click="toggleTheme"
      >
        {{ themeIcon }}
      </button>
      <button
        class="topbar-language"
        id="language-toggle"
        type="button"
        :aria-label="languageButtonAria"
        @click="toggleLanguage"
      >
        {{ languageButtonLabel }}
      </button>
      <button
        class="topbar-toggle"
        id="topbar-toggle"
        type="button"
        :aria-expanded="isOpen"
        aria-controls="topbar-nav"
        @click="isOpen = !isOpen"
      >
        {{ HOME_PAGE_CONTENT.topbar.issuesLabel }}
      </button>
      <a :href="HOME_PAGE_CONTENT.topbar.blogHref">{{ HOME_PAGE_CONTENT.topbar.blogLabel }}</a>
      <nav class="topbar-nav" id="topbar-nav" aria-label="Primary">
        <a
          v-for="item in HOME_PAGE_CONTENT.topbar.navItems"
          :key="item.href"
          :href="item.href"
          @click="closeMenu"
        >
          {{ item.label }}
        </a>
      </nav>
    </div>
  </header>
</template>
