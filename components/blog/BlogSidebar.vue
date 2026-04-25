<script setup lang="ts">
import type { BlogCategoryItem, BlogPostMeta } from "~/types/blog"

const props = defineProps<{
  categories: BlogCategoryItem[]
  tags: string[]
  recentPosts: BlogPostMeta[]
}>()

const truncateTitle = (title: string, maxLength = BLOG_SIDEBAR_TITLE_MAX_LENGTH) => {
  if (title.length <= maxLength) return title
  return `${title.slice(0, maxLength)}...`
}

const pinnedPosts = computed(() => props.recentPosts.filter((post) => post.pinned))
</script>

<template>
  <aside class="blog-sidebar" id="blog-sidebar" aria-label="博客侧边栏">
    <section class="blog-sidebar__section">
      <h2 class="blog-sidebar__heading">{{ BLOG_COPY.sidebarAboutHeading }}</h2>
      <p class="blog-sidebar__about">{{ BLOG_COPY.sidebarAbout }}</p>
    </section>

    <section v-if="pinnedPosts.length > 0" class="blog-sidebar__section">
      <h2 class="blog-sidebar__heading">{{ BLOG_COPY.sidebarStartHereHeading }}</h2>
      <ul class="blog-sidebar__recent">
        <li
          v-for="post in pinnedPosts"
          :key="post.slug"
          class="blog-sidebar__recent-item"
        >
          <NuxtLink class="blog-sidebar__recent-link" :to="`/blog/${encodeURIComponent(post.slug)}`">
            <span class="blog-sidebar__recent-title">{{ truncateTitle(post.title) }}</span>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <section class="blog-sidebar__section">
      <h2 class="blog-sidebar__heading">{{ BLOG_COPY.sidebarCategoriesHeading }}</h2>
      <ul class="blog-sidebar__categories">
        <li v-for="category in categories" :key="category.name">
          <NuxtLink
            class="blog-sidebar__category-item"
            :to="{ path: '/blog', query: { category: category.name } }"
          >
            <span>{{ category.name }}</span>
            <span class="blog-sidebar__category-count">{{ category.count }}</span>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <section class="blog-sidebar__section">
      <h2 class="blog-sidebar__heading">{{ BLOG_COPY.sidebarTagsHeading }}</h2>
      <div class="blog-sidebar__tags">
        <NuxtLink
          v-for="tag in tags"
          :key="tag"
          class="blog-sidebar__tag"
          :to="{ path: '/blog', query: { tag } }"
        >
          {{ tag }}
        </NuxtLink>
      </div>
    </section>

    <section class="blog-sidebar__section">
      <h2 class="blog-sidebar__heading">{{ BLOG_COPY.sidebarRecentHeading }}</h2>
      <ul class="blog-sidebar__recent">
        <li
          v-for="post in recentPosts.slice(0, BLOG_SIDEBAR_RECENT_POSTS_LIMIT)"
          :key="post.slug"
          class="blog-sidebar__recent-item"
        >
          <NuxtLink class="blog-sidebar__recent-link" :to="`/blog/${encodeURIComponent(post.slug)}`">
            <time class="blog-sidebar__recent-date" :datetime="post.date">{{ post.date }}</time>
            <span class="blog-sidebar__recent-title">{{ truncateTitle(post.title) }}</span>
          </NuxtLink>
        </li>
      </ul>
    </section>
  </aside>
</template>
