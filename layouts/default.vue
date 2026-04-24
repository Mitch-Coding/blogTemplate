<template>
  <div class="site-layout">
    <SiteTopbar />
    <main class="site-layout__main">
      <slot />
    </main>
  </div>
</template>

<style scoped lang="scss">
.site-layout {
  min-height: 100vh;
}

.site-layout__main {
  padding-bottom: 3rem;
}
</style>
