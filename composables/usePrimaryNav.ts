import type { SiteNavItem } from "~/types/site"

const NAV_LABELS = {
  home: { zh: "首页", en: "Home" },
  blog: { zh: "写作", en: "Writing" },
} as const

export function usePrimaryNav() {
  const { language } = useSiteLanguage()

  const items = computed<SiteNavItem[]>(() => [
    {
      key: "home",
      href: "/",
      label: NAV_LABELS.home[language.value],
    },
    {
      key: "blog",
      href: "/blog",
      label: NAV_LABELS.blog[language.value],
    },
  ])

  return {
    items,
  }
}
