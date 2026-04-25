<script setup lang="ts">
import { SITE_CONFIG } from "~/content/site/site.config"
import type { BlogCategoryItem, BlogPostMeta } from "~/types/blog"
import { withSiteUrl } from "~/utils/site"

definePageMeta({
  layout: "blog",
  alias: ["/blog.html"],
})

const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const allPosts = (await queryCollection("blog")
  .select(
    "slug",
    "title",
    "excerpt",
    "description",
    "category",
    "tags",
    "date",
    "readingTime",
    "pinned",
  )
  .order("date", "DESC")
  .all()) as BlogPostMeta[]

const currentPage = computed(() => {
  const rawValue = Number(route.query.page ?? BLOG_LIST_INITIAL_PAGE)
  return Number.isFinite(rawValue) && rawValue > 0 ? rawValue : BLOG_LIST_INITIAL_PAGE
})

const activeCategory = computed(() => {
  const value = route.query.category
  return typeof value === "string" ? value.trim() : ""
})

const activeTag = computed(() => {
  const value = route.query.tag
  return typeof value === "string" ? value.trim() : ""
})

const filteredPosts = computed(() =>
  allPosts.filter((post) => {
    const matchesCategory = activeCategory.value ? post.category === activeCategory.value : true
    const matchesTag = activeTag.value ? post.tags.includes(activeTag.value) : true
    return matchesCategory && matchesTag
  }),
)

const totalPages = computed(() => Math.max(1, Math.ceil(filteredPosts.value.length / BLOG_LIST_PAGE_SIZE)))

const pagedPosts = computed(() => {
  const safePage = Math.min(currentPage.value, totalPages.value)
  const start = (safePage - 1) * BLOG_LIST_PAGE_SIZE
  return filteredPosts.value.slice(start, start + BLOG_LIST_PAGE_SIZE)
})

const categories = computed<BlogCategoryItem[]>(() => {
  const counts = new Map<string, number>()
  allPosts.forEach((post) => {
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1)
  })

  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name))
})

const tags = computed(() => {
  const counts = new Map<string, number>()
  allPosts.forEach((post) => {
    post.tags.forEach((tag) => {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    })
  })

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([tag]) => tag)
})

const canonicalPath = computed(() => {
  const params = new URLSearchParams()
  if (currentPage.value > BLOG_LIST_INITIAL_PAGE) params.set("page", String(currentPage.value))
  if (activeCategory.value) params.set("category", activeCategory.value)
  if (activeTag.value) params.set("tag", activeTag.value)

  const query = params.toString()
  return query ? `/blog?${query}` : "/blog"
})

const blogUrl = computed(() => withSiteUrl(runtimeConfig.public.siteUrl, canonicalPath.value))

useSeoMeta({
  title: SITE_CONFIG.blogTitle,
  description: SITE_CONFIG.blogDescription,
  ogTitle: SITE_CONFIG.blogTitle,
  ogDescription: SITE_CONFIG.blogDescription,
  ogType: "website",
  ogUrl: blogUrl.value,
  keywords: SITE_CONFIG.keywords.join(", "),
})

useHead({
  link: [
    { rel: "canonical", href: blogUrl.value },
    { rel: "alternate", type: "application/rss+xml", title: `${SITE_CONFIG.name} RSS`, href: "/rss.xml" },
  ],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Blog",
        name: SITE_CONFIG.blogTitle,
        description: SITE_CONFIG.blogDescription,
        url: blogUrl.value,
      }),
    },
  ],
})
</script>

<template>
  <main class="blog-main" id="blog-main">
    <section class="blog-hero">
      <div class="blog-hero__inner">
        <div class="blog-hero__title-row">
          <h1 class="blog-hero__title">WRITING</h1>
          <img class="blog-hero__spiderman" src="/spiderman.svg" alt="" aria-hidden="true" decoding="async" />
        </div>
        <hr class="blog-hero__rule" />
        <p class="blog-hero__desc">
          欢迎来到Mitch的博客！在这里，我分享关于编程、技术和个人成长的见解和经验。
        </p>
      </div>
    </section>

    <div class="blog-body">
      <div class="blog-body__inner">
        <section class="blog-list" id="blog-list" aria-label="文章列表">
          <template v-if="pagedPosts.length > 0">
            <BlogPostCard v-for="post in pagedPosts" :key="post.slug" :post="post" />
            <BlogPagination
              :current-page="Math.min(currentPage, totalPages)"
              :total-pages="totalPages"
              :category="activeCategory"
              :tag="activeTag"
            />
          </template>
          <p v-else class="blog-list__error">{{ BLOG_COPY.listError }}</p>
        </section>

        <BlogSidebar
          :categories="categories"
          :tags="tags"
          :recent-posts="allPosts"
        />
      </div>
    </div>
  </main>
</template>
