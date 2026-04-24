<script setup lang="ts">
defineProps<{
  variant?: "default" | "blog"
}>()

const { language } = useSiteLanguage()
const { items } = usePrimaryNav()

const brandSubtitle = computed(() =>
  language.value === "zh" ? "Nuxt 迁移骨架" : "Nuxt Migration Scaffold",
)
</script>

<template>
  <header class="site-topbar" :data-variant="variant ?? 'default'">
    <div class="site-topbar__inner">
      <NuxtLink to="/" class="site-topbar__brand">
        <span class="site-topbar__eyebrow">Mitch</span>
        <strong class="site-topbar__title">{{ brandSubtitle }}</strong>
      </NuxtLink>

      <nav class="site-topbar__nav" aria-label="Primary">
        <NuxtLink
          v-for="item in items"
          :key="item.key"
          :to="item.href"
          class="site-topbar__link"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="site-topbar__controls">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.site-topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: blur(16px);
  background:
    linear-gradient(180deg, rgba(2, 2, 2, 0.9), rgba(2, 2, 2, 0.72)),
    var(--surface);
  border-bottom: 1px solid var(--line);
}

.site-topbar[data-variant="blog"] {
  background:
    linear-gradient(180deg, rgba(6, 8, 20, 0.92), rgba(6, 8, 20, 0.74)),
    var(--surface);
}

.site-topbar__inner {
  width: min(var(--max-width), calc(100% - 1.5rem));
  margin: 0 auto;
  min-height: 4.5rem;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  align-items: center;
}

.site-topbar__brand {
  display: inline-flex;
  flex-direction: column;
  gap: 0.08rem;
  text-decoration: none;
  color: inherit;
}

.site-topbar__eyebrow {
  font-size: 0.72rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

.site-topbar__title {
  font-size: 0.98rem;
  letter-spacing: 0.08em;
}

.site-topbar__nav {
  display: inline-flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.site-topbar__link {
  padding: 0.55rem 0.8rem;
  border: 1px solid transparent;
  border-radius: 999px;
  text-decoration: none;
  color: var(--ink-muted);
  transition:
    border-color 160ms ease,
    background-color 160ms ease,
    color 160ms ease;
}

.site-topbar__link:hover {
  border-color: var(--topbar-link-hover-border);
  background: var(--topbar-link-hover-bg);
  color: var(--ink);
}

.site-topbar__controls {
  display: inline-flex;
  gap: 0.65rem;
}

@media (max-width: 820px) {
  .site-topbar__inner {
    grid-template-columns: 1fr;
    padding-block: 0.85rem;
  }

  .site-topbar__nav {
    justify-content: flex-start;
  }

  .site-topbar__controls {
    justify-content: flex-start;
  }
}
</style>
