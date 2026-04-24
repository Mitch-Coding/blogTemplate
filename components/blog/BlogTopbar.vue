<script setup lang="ts">
const { theme, toggleTheme } = useTheme()
const isOpen = ref(false)
const isScrolled = ref(false)
const rootRef = ref<HTMLElement | null>(null)

const themeIcon = computed(() => (theme.value === "light" ? "◑" : "☀"))
const themeAria = computed(() =>
  theme.value === "light" ? "Switch to dark theme" : "Switch to light theme",
)

const closeMenu = () => {
  isOpen.value = false
}

const updateScrolled = () => {
  isScrolled.value = window.scrollY > 40
}

const handleDocumentClick = (event: MouseEvent) => {
  if (!isOpen.value) return
  if (event.target instanceof Node && rootRef.value?.contains(event.target)) return
  closeMenu()
}

onMounted(() => {
  window.addEventListener("scroll", updateScrolled, { passive: true })
  window.addEventListener("resize", closeMenu)
  document.addEventListener("click", handleDocumentClick)
  updateScrolled()
})

onBeforeUnmount(() => {
  window.removeEventListener("scroll", updateScrolled)
  window.removeEventListener("resize", closeMenu)
  document.removeEventListener("click", handleDocumentClick)
})
</script>

<template>
  <header ref="rootRef" class="blog-topbar topbar" :class="{ 'is-open': isOpen, 'is-scrolled': isScrolled }" id="blog-topbar">
    <NuxtLink class="brand" to="/" aria-label="Go to top">MITCH</NuxtLink>
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
        class="topbar-toggle"
        id="topbar-toggle"
        type="button"
        :aria-expanded="isOpen"
        aria-controls="topbar-nav"
        @click="isOpen = !isOpen"
      >
        Issues
      </button>
      <nav class="topbar-nav" id="topbar-nav" aria-label="Primary">
        <a href="/#about" @click="closeMenu">About</a>
        <a href="/#skills" @click="closeMenu">Skill Universe</a>
        <a href="/#projects" @click="closeMenu">Projects</a>
        <a href="/#contact" @click="closeMenu">Contact</a>
      </nav>
    </div>
  </header>
</template>
