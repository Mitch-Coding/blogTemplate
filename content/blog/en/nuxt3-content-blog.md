---
slug: nuxt3-content-blog-en
locale: en
translationOf: nuxt3-content-blog
title: "Building a Technical Blog with Nuxt 3 and Content v3"
excerpt: "A practical guide to building a content-driven technical blog with Nuxt 3 and @nuxt/content v3, covering collections, schema validation, theme switching, SEO, and static generation."
description: "A practical guide to building a content-driven technical blog with Nuxt 3 and @nuxt/content v3, covering collections, schema validation, theme switching, SEO, and static generation."
category: "Engineering Productivity"
tags:
  - Nuxt
  - Content
  - Vue
  - Blog
date: "2026-04-15"
readingTime: 11
pinned: false
---

## Background

When people build a technical blog with Nuxt 3, the first idea is often simple: use Nuxt Content to read Markdown files. That direction is correct, but the API changed significantly between @nuxt/content v2 and v3. If you follow older examples, you will quickly run into confusing behavior.

This article records a practical Nuxt 3 + Content v3 blog setup. The focus is not a large framework design, but the parts that matter in production: content collections, schema validation, page queries, static generation, theme switching, and SEO.

## The Core Change in Content v3: Collections

In v2, `queryContent()` could be used almost everywhere. Content v3 introduces **Collections**. Before querying content, you define a collection in `content.config.ts`.

```typescript
// content.config.ts
import { defineCollection, defineContentConfig, z } from "@nuxt/content"

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: "page",
      source: "blog/**/*.md",
      schema: z.object({
        title: z.string(),
        description: z.string(),
        category: z.string(),
        tags: z.array(z.string()),
        date: z.string(),
        pinned: z.boolean().default(false),
      }),
    }),
  },
})
```

The schema is defined with Zod, and every frontmatter field must match it. This is one of the biggest improvements in v3: content errors are caught during the build instead of surfacing after deployment.

## Querying Pages

After defining a collection, query it with `queryCollection`.

```vue
<script setup>
const { data: posts } = await useAsyncData("blog-list", () =>
  queryCollection("blog")
    .order("date", "DESC")
    .all()
)
</script>

<template>
  <div v-for="post in posts" :key="post.slug">
    <NuxtLink :to="`/blog/${post.slug}`">
      <h2>{{ post.title }}</h2>
      <p>{{ post.description }}</p>
    </NuxtLink>
  </div>
</template>
```

For a single article, read the slug from the route and query the matching document.

```vue
<script setup>
const route = useRoute()
const { data: post } = await useAsyncData(`blog-${route.params.slug}`, () =>
  queryCollection("blog")
    .where("slug", "=", route.params.slug)
    .first()
)
</script>

<template>
  <ContentRenderer v-if="post" :value="post" />
</template>
```

## Dynamic Routes and Static Generation

Blog posts usually use a dynamic route such as `pages/blog/[slug].vue`. If the site is deployed as static output, the dynamic pages must be discoverable during prerendering.

At minimum, make sure feed and sitemap routes are prerendered:

```typescript
export default defineNuxtConfig({
  nitro: {
    prerender: {
      routes: ["/sitemap.xml", "/rss.xml"],
    },
  },
})
```

For a full static deployment, add a route generation step that returns every blog URL. Otherwise, the sitemap may list a post that was not actually prerendered.

## Theme Switching

Dark mode is a common requirement for technical blogs. A straightforward implementation is to put the current theme on the root element with a `data-theme` attribute, then let CSS variables do the rest.

```typescript
export function useTheme() {
  const theme = useState("theme", () =>
    process.client ? localStorage.getItem("theme") || "dark" : "dark"
  )

  function toggle() {
    theme.value = theme.value === "dark" ? "light" : "dark"
    if (process.client) {
      localStorage.setItem("theme", theme.value)
      document.documentElement.setAttribute("data-theme", theme.value)
    }
  }

  return { theme, toggle }
}
```

The SCSS layer only needs two sets of variables:

```scss
:root,
[data-theme="dark"] {
  --bg-primary: #0a0a0a;
  --text-primary: #e0e0e0;
}

[data-theme="light"] {
  --bg-primary: #ffffff;
  --text-primary: #1a1a1a;
}
```

## Pitfalls

**Pitfall 1: `queryCollection` can behave differently during SSR and hydration**

In Content v3, server-side rendering queries content on the server, while client hydration may read from generated payload data. If query conditions depend on reactive client-only state, the rendered result can mismatch. A safer pattern is to drive filters from URL query parameters.

**Pitfall 2: The `source` path is relative to `content/`**

`source: "blog/**/*.md"` matches `content/blog/**/*.md`, not a path from the project root. If Markdown files move to another folder, the collection source must be updated.

**Pitfall 3: YAML date parsing can surprise Zod**

If frontmatter uses `date: 2026-04-15` without quotes, YAML may parse it as a Date object. A schema expecting `z.string()` will then fail. Use a quoted string instead:

```yaml
date: "2026-04-15"
```

## Summary

Content v3 is stricter than v2, but that strictness is useful for a production blog. Collections make the content model explicit, Zod validation catches broken frontmatter early, and URL-driven queries keep SSR and hydration aligned.

For a bilingual blog, this model needs only a small extension: each translated article should declare its `locale`, and translated versions should point back to a stable translation group, such as `translationOf` or `translationKey`.
