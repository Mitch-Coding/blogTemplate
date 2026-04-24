import { defineCollection, defineContentConfig, z } from "@nuxt/content"

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: "page",
      source: "blog/**/*.md",
      schema: z.object({
        slug: z.string(),
        title: z.string(),
        excerpt: z.string(),
        description: z.string(),
        category: z.string(),
        tags: z.array(z.string()),
        date: z.string(),
        readingTime: z.number(),
        pinned: z.boolean().default(false),
      }),
    }),
    sitePages: defineCollection({
      type: "page",
      source: "site/**/*.md",
    }),
    siteData: defineCollection({
      type: "data",
      source: "site/**/*.yml",
      schema: z.object({
        brand: z.string(),
        phase: z.number(),
        items: z.array(
          z.object({
            key: z.string(),
            href: z.string(),
            label: z.object({
              zh: z.string(),
              en: z.string(),
            }),
          }),
        ),
      }),
    }),
  },
})
