---
slug: nuxt3-content-blog
title: Nuxt 3 + Content v3 搭建技术博客：内容驱动的正确姿势
excerpt: 用 Nuxt 3 和 @nuxt/content v3 构建一个内容驱动的技术博客，包括内容集合、Schema 校验、主题切换和 SEO 优化。
description: 用 Nuxt 3 和 @nuxt/content v3 构建一个内容驱动的技术博客，包括内容集合、Schema 校验、主题切换和 SEO 优化。
category: 工程效率
tags:
  - Nuxt
  - Content
  - Vue
  - 博客
date: 2026-04-15
readingTime: 11
pinned: false
---

## 问题背景

用 Nuxt 3 搭建技术博客，很多人第一反应是"用 Nuxt Content 读 Markdown 文件"。这个方向没错，但 @nuxt/content v3 和 v2 的 API 差异很大，文档又不够清晰，踩坑是必然的。

这篇文章记录我用 Nuxt 3 + Content v3 搭建博客的完整过程，重点讲 v3 的新概念和实际踩坑。

## Content v3 的核心变化：Collections

v2 的 `queryContent()` 是"一个方法打天下"，v3 引入了 **Collections** 概念——你需要先在 `content.config.ts` 里定义内容集合，才能查询。

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

`schema` 用 Zod 定义，frontmatter 里的字段必须匹配 schema，否则构建时报错。这是 v3 最大的改进——**内容校验前置到构建阶段**，不会上线后才发现某个文章缺少必要字段。

## 页面查询

定义好 collection 后，在页面里用 `queryCollection` 查询：

```vue
<script setup>
// 查询所有博客文章，按日期倒序
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

单篇文章查询：

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

## 动态路由与 SSG

博客文章是动态路由（`pages/blog/[slug].vue`），要支持 SSG 预渲染，需要在 `nuxt.config.ts` 里配置：

```typescript
export default defineNuxtConfig({
  content: {
    // v3 的 content 配置
  },
  nitro: {
    prerender: {
      routes: ["/sitemap.xml", "/rss.xml"],
    },
  },
})
```

同时需要一个 server 端接口生成所有文章的 slug 列表，供 `generate` 命令预渲染：

```typescript
// server/routes/sitemap.xml.ts
export default defineEventHandler(async () => {
  const posts = await queryCollection("blog").all()
  const urls = posts.map(p =>
    `<url><loc>https://yourdomain.com/blog/${p.slug}</loc></url>`
  )
  return `<?xml version="1.0"?><urlset>${urls.join("")}</urlset>`
})
```

## 主题切换

技术博客的深色模式是标配。实现思路很简单：用 `data-theme` 属性控制 CSS 变量：

```typescript
// composables/useTheme.ts
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

SCSS 里定义两套变量：

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

## 踩坑记录

**坑 1：`queryCollection` 在 SSR 和客户端行为不一致**

v3 的 `queryCollection` 在 SSR 时走服务端查询，客户端 hydration 时走本地缓存。如果查询条件依赖响应式状态（比如用户选择的分类），hydration 会不匹配。解决方案：把查询条件放到 URL 参数里，用 `useRoute().query` 驱动。

**坑 2：Content v3 的 `source` 路径是相对于 `content/` 目录**

`source: "blog/**/*.md"` 实际匹配的是 `content/blog/**/*.md`，不是项目根目录。如果你把 md 文件放在其他地方，需要调整路径。

**坑 3：Zod schema 的 `z.string().date()` 和 `z.string()`**

v3 的 schema 校验很严格。如果你在 frontmatter 里写了 `date: 2026-04-15`（没有引号），YAML 解析器会把它解析为 Date 对象，然后 Zod 的 `z.string()` 校验失败。确保 date 字段在 frontmatter 里是字符串：`date: "2026-04-15"`。

## 总结

- Content v3 的 Collections 是核心概念，必须先定义 schema 才能查询
- Zod schema 校验把内容错误前移到构建阶段，比 v2 安全得多
- `queryCollection` 的 SSR/CSR 双模式需要注意 hydration 一致性
- 主题切换用 CSS 变量 + `data-theme` 属性，简单可靠
- SSG 预渲染需要配合动态路由的 slug 列表生成

Nuxt Content v3 的 API 还在快速迭代，文档也经常滞后。遇到问题优先看源码和 GitHub Issues，比等文档更新更靠谱。
