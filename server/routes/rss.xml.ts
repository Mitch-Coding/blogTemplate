import { SITE_CONFIG } from "~/content/site/site.config"
import { escapeXml, toRfc822Date, withSiteUrl } from "~/utils/site"
import { getBlogFeedEntries } from "../blog-feed.mjs"

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig(event)
  const siteUrl = runtimeConfig.public.siteUrl
  const blogUrl = withSiteUrl(siteUrl, "/blog")
  const feedUrl = withSiteUrl(siteUrl, "/rss.xml")
  const posts = getBlogFeedEntries() as Array<{
    slug: string
    title: string
    excerpt: string
    description: string
    category: string
    tags: string[]
    date: string
  }>

  const items = posts
    .map((post) => {
      const postUrl = withSiteUrl(siteUrl, `/blog/${post.slug}`)
      const categories = [post.category, ...post.tags]
        .filter(Boolean)
        .map((value) => `    <category>${escapeXml(value)}</category>`)
        .join("\n")

      return [
        "  <item>",
        `    <title>${escapeXml(post.title)}</title>`,
        `    <link>${postUrl}</link>`,
        `    <guid>${postUrl}</guid>`,
        `    <description>${escapeXml(post.description || post.excerpt)}</description>`,
        `    <pubDate>${toRfc822Date(post.date)}</pubDate>`,
        categories,
        "  </item>",
      ]
        .filter(Boolean)
        .join("\n")
    })
    .join("\n")

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    "  <channel>",
    `    <title>${escapeXml(SITE_CONFIG.blogTitle)}</title>`,
    `    <link>${blogUrl}</link>`,
    `    <description>${escapeXml(SITE_CONFIG.blogDescription)}</description>`,
    `    <language>${SITE_CONFIG.locale}</language>`,
    `    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${feedUrl}" rel="self" type="application/rss+xml" />`,
    items,
    "  </channel>",
    "</rss>",
  ].join("\n")

  setHeader(event, "Content-Type", "application/rss+xml; charset=utf-8")
  return body
})
