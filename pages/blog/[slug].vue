<script setup lang="ts">
import { SITE_CONFIG } from "~/content/site/site.config"
import type { BlogPostMeta } from "~/types/blog"
import { toIsoDate, withSiteUrl } from "~/utils/site"

definePageMeta({
  layout: "blog",
})

const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const slug = String(route.params.slug ?? "")
const post = await queryCollection("blog").where("slug", "=", slug).first()

if (!post) {
  throw createError({
    statusCode: 404,
    statusMessage: BLOG_COPY.postLoadError,
  })
}

const postMeta = post as typeof post & BlogPostMeta
const contentRef = ref<HTMLElement | null>(null)

const postList = (await queryCollection("blog")
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

const currentIndex = postList.findIndex((item) => item.slug === slug)
const previousPost = currentIndex >= 0 ? postList[currentIndex + 1] ?? null : null
const nextPost = currentIndex > 0 ? postList[currentIndex - 1] ?? null : null
const postUrl = withSiteUrl(runtimeConfig.public.siteUrl, `/blog/${postMeta.slug}`)

const {
  activeHeadingId,
  closeLightbox,
  enhanceContent,
  lightboxImageAlt,
  lightboxImageSrc,
  tocItems,
} = useBlogPostEnhancements(contentRef)

useSeoMeta({
  title: `${postMeta.title} | Mitch`,
  description: postMeta.description || postMeta.excerpt,
  ogTitle: postMeta.title,
  ogDescription: postMeta.description || postMeta.excerpt,
  ogType: "article",
  ogUrl: postUrl,
  twitterCard: "summary_large_image",
  keywords: [...SITE_CONFIG.keywords, postMeta.category, ...postMeta.tags].join(", "),
})

useHead({
  link: [{ rel: "canonical", href: postUrl }],
  meta: [
    { name: "author", content: PORTFOLIO_AUTHOR_NAME },
    { property: "article:published_time", content: postMeta.date },
    ...postMeta.tags.map((tag) => ({
      property: "article:tag",
      content: tag,
    })),
  ],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: postMeta.title,
        description: postMeta.description || postMeta.excerpt,
        url: postUrl,
        datePublished: toIsoDate(postMeta.date),
        author: {
          "@type": "Person",
          name: SITE_CONFIG.author,
        },
        publisher: {
          "@type": "Person",
          name: SITE_CONFIG.author,
        },
        articleSection: postMeta.category,
        keywords: postMeta.tags.join(", "),
      }),
    },
  ],
})

onMounted(() => {
  void enhanceContent()
})
</script>

<template>
  <main class="post-main" id="post-main">
    <div class="post-layout">
      <article class="post-article" id="post-article">
        <NuxtLink to="/blog" class="post-back">← Blog</NuxtLink>

        <header class="post-header" id="post-header">
          <span class="post-header__category" id="post-category">{{ postMeta.category }}</span>
          <h1 class="post-header__title" id="post-title">{{ postMeta.title }}</h1>
          <p class="post-header__meta" id="post-meta">
            {{ PORTFOLIO_AUTHOR_NAME }} · {{ postMeta.date }} · {{ postMeta.readingTime }} {{ BLOG_COPY.readingTimeLabel }}
          </p>
          <hr class="post-header__rule" />
        </header>

        <div id="post-content" ref="contentRef" class="post-content">
          <ContentRenderer :value="postMeta" />
        </div>

        <BlogPostNav :previous-post="previousPost" :next-post="nextPost" />

        <section class="post-contact" aria-label="联系 Mitch">
          <p class="post-contact__heading">{{ BLOG_COPY.contactHeading }}</p>
          <p class="post-contact__copy">{{ BLOG_COPY.contactCopy }}</p>
          <div class="post-contact__links">
            <a class="post-contact__link" :href="`mailto:${CONTACT_EMAIL}`">
              {{ BLOG_COPY.contactEmailLabel }}
            </a>
            <a class="post-contact__link" :href="CONTACT_GITHUB_URL" target="_blank" rel="noreferrer">
              {{ BLOG_COPY.contactGithubLabel }}
            </a>
          </div>
        </section>
      </article>

      <BlogPostToc :active-id="activeHeadingId" :items="tocItems" />
    </div>

    <div
      class="post-lightbox"
      :class="{ 'is-open': Boolean(lightboxImageSrc) }"
      :aria-hidden="lightboxImageSrc ? 'false' : 'true'"
      @click="closeLightbox"
    >
      <img
        v-if="lightboxImageSrc"
        class="post-lightbox__image"
        :src="lightboxImageSrc"
        :alt="lightboxImageAlt"
      />
    </div>
  </main>
</template>
