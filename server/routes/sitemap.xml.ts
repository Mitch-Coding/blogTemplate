import { getBlogFeedEntries } from "../blog-feed.mjs"
import { withSiteUrl, toIsoDate } from "~/utils/site"

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig(event)
  const posts = getBlogFeedEntries() as Array<{ slug: string; date: string }>

  const items: Array<{ loc: string; lastmod?: string }> = [
    { loc: withSiteUrl(runtimeConfig.public.siteUrl, "/") },
    { loc: withSiteUrl(runtimeConfig.public.siteUrl, "/blog") },
    { loc: withSiteUrl(runtimeConfig.public.siteUrl, "/rss.xml") },
    ...posts.map((post) => ({
      loc: withSiteUrl(runtimeConfig.public.siteUrl, `/blog/${post.slug}`),
      lastmod: toIsoDate(post.date),
    })),
  ]

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...items.map((item) =>
      item.lastmod
        ? `  <url><loc>${item.loc}</loc><lastmod>${item.lastmod}</lastmod></url>`
        : `  <url><loc>${item.loc}</loc></url>`,
    ),
    "</urlset>",
  ].join("\n")

  setHeader(event, "Content-Type", "application/xml; charset=utf-8")
  return body
})
