import type { SiteLanguage } from "~/types/site"

const LANGUAGE_STORAGE_KEY = "site-language"
const DEFAULT_LANGUAGE: SiteLanguage = "zh"

function isSiteLanguage(value: string | null): value is SiteLanguage {
  return value === "zh" || value === "en"
}

export function useSiteLanguage() {
  const language = useState<SiteLanguage>("site-language", () => DEFAULT_LANGUAGE)
  const isInitialized = useState<boolean>("site-language-initialized", () => false)

  const setLanguage = (nextLanguage: SiteLanguage) => {
    language.value = nextLanguage
  }

  const toggleLanguage = () => {
    language.value = language.value === "zh" ? "en" : "zh"
  }

  if (import.meta.client && !isInitialized.value) {
    isInitialized.value = true

    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (isSiteLanguage(storedLanguage)) {
      language.value = storedLanguage
    }

    watch(
      language,
      (currentLanguage) => {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage)
      },
      { immediate: true },
    )
  }

  return {
    language,
    setLanguage,
    toggleLanguage,
  }
}
