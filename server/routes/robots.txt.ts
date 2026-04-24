import { withSiteUrl } from "~/utils/site"

export default defineEventHandler((event) => {
  const runtimeConfig = useRuntimeConfig(event)
  const sitemapUrl = withSiteUrl(runtimeConfig.public.siteUrl, "/sitemap.xml")

  setHeader(event, "Content-Type", "text/plain; charset=utf-8")

  return `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`
})
