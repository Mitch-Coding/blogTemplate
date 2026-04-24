import { HOME_PAGE_CONTENT } from "~/content/site/home.config"

export function useHomeContent() {
  const { language } = useSiteLanguage()

  const localize = <T extends string>(value: { zh: T; en: T }) =>
    computed(() => (language.value === "zh" ? value.zh : value.en))

  const content = computed(() => HOME_PAGE_CONTENT)

  return {
    language,
    content,
    localize,
  }
}
