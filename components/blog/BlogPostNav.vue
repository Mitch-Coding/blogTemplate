<script setup lang="ts">
import type { BlogPostMeta } from "~/types/blog"

defineProps<{
  nextPost: BlogPostMeta | null
  previousPost: BlogPostMeta | null
}>()
</script>

<template>
  <nav v-if="previousPost || nextPost" class="post-nav" id="post-nav" aria-label="文章导航">
    <div class="post-nav__inner">
      <NuxtLink
        v-if="previousPost"
        :to="`/blog/${encodeURIComponent(previousPost.slug)}`"
        class="post-nav__item post-nav__item--prev"
      >
        <span class="post-nav__dir">{{ BLOG_COPY.previousPost }}</span>
        <span class="post-nav__title">{{ previousPost.title }}</span>
      </NuxtLink>
      <div v-else></div>

      <NuxtLink
        v-if="nextPost"
        :to="`/blog/${encodeURIComponent(nextPost.slug)}`"
        class="post-nav__item post-nav__item--next"
      >
        <span class="post-nav__dir">{{ BLOG_COPY.nextPost }}</span>
        <span class="post-nav__title">{{ nextPost.title }}</span>
      </NuxtLink>
      <div v-else></div>
    </div>
  </nav>
</template>
