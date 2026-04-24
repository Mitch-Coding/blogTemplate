<script setup lang="ts">
import "~/assets/styles/blog.scss"

useHead({
  link: [
    { rel: "icon", type: "image/svg+xml", href: "/about-spider.svg" },
    { rel: "apple-touch-icon", href: "/about-spider.svg" },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Bangers&family=Bowlby+One+SC&family=Changa+One&family=JetBrains+Mono:wght@400;500&family=Lilita+One&family=Luckiest+Guy&family=Manrope:wght@400;500;700;800&family=Sigmar&display=swap",
    },
  ],
})
</script>

<template>
  <div class="site-layout site-layout--blog">
    <div class="page-noise" aria-hidden="true"></div>
    <BlogTopbar />
    <main class="site-layout__main">
      <slot />
    </main>
  </div>
</template>

<style scoped lang="scss">
.site-layout--blog .site-layout__main {
  position: relative;
}
</style>
