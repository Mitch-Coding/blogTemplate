<script setup lang="ts">
import type { BlogTocItem } from "~/types/blog"

defineProps<{
  activeId: string
  items: BlogTocItem[]
}>()
</script>

<template>
  <aside class="post-toc" id="post-toc" aria-label="文章目录">
    <template v-if="items.length > 0">
      <p class="post-toc__heading">{{ BLOG_COPY.tocHeading }}</p>
      <nav class="post-toc__nav">
        <a
          v-for="item in items"
          :key="item.id"
          :href="`#${item.id}`"
          class="post-toc__link"
          :class="{
            'post-toc__link--sub': item.level === 3,
            'is-active': activeId === item.id,
          }"
          :data-id="item.id"
        >
          {{ item.text }}
        </a>
      </nav>
    </template>
  </aside>
</template>
