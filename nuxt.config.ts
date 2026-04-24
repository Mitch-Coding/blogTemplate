import { SITE_CONFIG } from "./content/site/site.config"

export default defineNuxtConfig({
  compatibilityDate: "2025-01-01",
  devtools: { enabled: true },
  modules: ["@nuxt/content"],
  css: ["~/assets/styles/tokens.scss", "~/assets/styles/base.scss"],
  runtimeConfig: {
    public: {
      siteUrl: "http://localhost:3000",
    },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: SITE_CONFIG.locale,
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "theme-color", content: "#0e0e10" },
      ],
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/about-spider.svg" },
        { rel: "apple-touch-icon", href: "/about-spider.svg" },
        { rel: "alternate", type: "application/rss+xml", title: `${SITE_CONFIG.name} RSS`, href: "/rss.xml" },
      ],
    },
  },
  nitro: {
    prerender: {
      routes: ["/sitemap.xml", "/rss.xml", "/robots.txt"],
    },
  },
  typescript: {
    strict: true,
  },
})
