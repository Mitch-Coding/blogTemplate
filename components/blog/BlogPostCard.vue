<script setup lang="ts">
import type { BlogPostMeta } from "~/types/blog"

defineProps<{
  post: BlogPostMeta
}>()
</script>

<template>
  <article class="blog-post-item">
    <NuxtLink
      :to="`/blog/${encodeURIComponent(post.slug)}`"
      class="blog-post-item__link"
      :aria-label="post.title"
    >
      <div class="blog-post-item__meta">
        <time class="blog-post-item__date" :datetime="post.date">{{ post.date }}</time>
        <span class="blog-post-item__category">{{ post.category }}</span>
        <span
          v-if="post.pinned"
          class="blog-post-item__pin"
          role="img"
          :aria-label="BLOG_COPY.pinnedAria"
        ></span>
      </div>
      <h2 class="blog-post-item__title">{{ post.title }}</h2>
      <p class="blog-post-item__excerpt">{{ post.excerpt }}</p>
      <span class="blog-post-item__reading-time">
        {{ PORTFOLIO_AUTHOR_NAME }} · {{ post.readingTime }} {{ BLOG_COPY.readingTimeLabel }}
      </span>
    </NuxtLink>
  </article>
</template>
