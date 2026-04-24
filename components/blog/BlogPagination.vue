<script setup lang="ts">
const props = defineProps<{
  currentPage: number
  totalPages: number
  category?: string
  tag?: string
}>()

const buildLink = (page: number) => ({
  path: "/blog",
  query: {
    ...(props.category ? { category: props.category } : {}),
    ...(props.tag ? { tag: props.tag } : {}),
    ...(page > 1 ? { page: String(page) } : {}),
  },
})
</script>

<template>
  <div v-if="totalPages > 1" class="blog-pagination">
    <NuxtLink
      v-if="currentPage > 1"
      class="blog-pagination__btn"
      :to="buildLink(currentPage - 1)"
    >
      {{ BLOG_COPY.previousPage }}
    </NuxtLink>
    <span v-else class="blog-pagination__btn" aria-disabled="true">{{ BLOG_COPY.previousPage }}</span>

    <span class="blog-pagination__info">{{ BLOG_COPY.pageInfo(currentPage, totalPages) }}</span>

    <NuxtLink
      v-if="currentPage < totalPages"
      class="blog-pagination__btn"
      :to="buildLink(currentPage + 1)"
    >
      {{ BLOG_COPY.nextPage }}
    </NuxtLink>
    <span v-else class="blog-pagination__btn" aria-disabled="true">{{ BLOG_COPY.nextPage }}</span>
  </div>
</template>
