<script setup lang="ts">
import "~/assets/styles/home/_index.scss"

import { HOME_PAGE_CONTENT } from "~/content/site/home.config"
import { SITE_CONFIG } from "~/content/site/site.config"
import { withSiteUrl } from "~/utils/site"

definePageMeta({
  layout: false,
  alias: ["/index.html"],
})

const { isHidden, isLoaded } = useHomeLoader()
useHomeScene()
const runtimeConfig = useRuntimeConfig()
const homeUrl = withSiteUrl(runtimeConfig.public.siteUrl, "/")

useSeoMeta({
  title: HOME_PAGE_CONTENT.meta.title,
  description: HOME_PAGE_CONTENT.meta.description,
  ogTitle: HOME_PAGE_CONTENT.meta.title,
  ogDescription: HOME_PAGE_CONTENT.meta.description,
  ogType: "website",
  ogUrl: homeUrl,
  twitterCard: "summary_large_image",
  keywords: SITE_CONFIG.keywords.join(", "),
})

useHead({
  link: [
    { rel: "canonical", href: homeUrl },
    { rel: "alternate", type: "application/rss+xml", title: `${SITE_CONFIG.name} RSS`, href: "/rss.xml" },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Bangers&family=Bowlby+One+SC&family=Changa+One&family=Lilita+One&family=Luckiest+Guy&family=Manrope:wght@400;500;700;800&family=Sigmar&display=swap",
    },
    { rel: "stylesheet", href: "/vendor/peel.css" },
  ],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            name: SITE_CONFIG.name,
            url: homeUrl,
            description: HOME_PAGE_CONTENT.meta.description,
          },
          {
            "@type": "Person",
            name: SITE_CONFIG.author,
            url: homeUrl,
            sameAs: [HOME_PAGE_CONTENT.contact.githubUrl],
            jobTitle: "Java Backend and AI Application Developer",
          },
        ],
      }),
    },
    {
      src: "/vendor/peel.js",
      tagPosition: "bodyClose",
    },
  ],
})
</script>

<template>
  <div>
    <HomeLoader :hidden="isHidden" :loaded="isLoaded" />
    <div class="page-noise" aria-hidden="true"></div>
    <HomeTopbar />

    <main>
      <HomeHero />
      <HomeNameSection />
      <HomeAboutSection />
      <HomeSkillsSection />
      <HomeProjectsSection />
      <HomeContactSection />
    </main>

    <HomeProjectModal />
  </div>
</template>
