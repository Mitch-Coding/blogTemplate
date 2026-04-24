<script setup lang="ts">
import { HOME_PAGE_CONTENT } from "~/content/site/home.config"

const { language } = useSiteLanguage()
const scrollLabel = computed(() =>
  language.value === "zh" ? HOME_PAGE_CONTENT.hero.scrollLabel.zh : HOME_PAGE_CONTENT.hero.scrollLabel.en,
)
</script>

<template>
  <section class="hero-section" id="hero">
    <div class="hero-stage">
      <div class="hero-spider" aria-hidden="true">
        <img class="hero-spider__full" src="/spider-vector.svg" alt="" decoding="async" />
      </div>

      <div class="hero-poster-shell">
        <div class="hero-imprint" aria-hidden="true"></div>
        <article class="hero-poster">
          <div class="hero-sticker peel" id="hero-peel" :aria-label="HOME_PAGE_CONTENT.hero.stickerAriaLabel">
            <div class="peel-bottom hero-sticker__bottom" aria-hidden="true"></div>
            <div class="peel-back hero-sticker__back" aria-hidden="true"></div>
            <div class="peel-top hero-sticker__top" aria-hidden="true"></div>
          </div>
        </article>
      </div>

      <div class="hero-scroll" aria-hidden="true">
        <span class="hero-scroll__label">{{ scrollLabel }}</span>
        <span class="hero-scroll__line"></span>
      </div>
    </div>
  </section>
</template>
