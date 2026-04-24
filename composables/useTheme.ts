import type { SiteTheme } from "~/types/site"

const THEME_STORAGE_KEY = "site-theme"
const DEFAULT_THEME: SiteTheme = "dark"

function isSiteTheme(value: string | null): value is SiteTheme {
  return value === "dark" || value === "light"
}

export function useTheme() {
  const theme = useState<SiteTheme>("site-theme", () => DEFAULT_THEME)
  const isInitialized = useState<boolean>("site-theme-initialized", () => false)

  const applyTheme = (nextTheme: SiteTheme) => {
    theme.value = nextTheme
  }

  const toggleTheme = () => {
    applyTheme(theme.value === "dark" ? "light" : "dark")
  }

  if (import.meta.client && !isInitialized.value) {
    isInitialized.value = true

    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    if (isSiteTheme(storedTheme)) {
      theme.value = storedTheme
    }

    watch(
      theme,
      (currentTheme) => {
        document.documentElement.dataset.theme = currentTheme
        localStorage.setItem(THEME_STORAGE_KEY, currentTheme)
      },
      { immediate: true },
    )
  }

  return {
    theme,
    toggleTheme,
    applyTheme,
  }
}
