export function normalizeSiteUrl(value: string | undefined | null) {
  const trimmed = `${value ?? ""}`.trim()
  const normalized = trimmed.replace(/\/+$/, "")
  return normalized || "http://localhost:3000"
}

export function withSiteUrl(siteUrl: string | undefined | null, path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return new URL(normalizedPath, `${normalizeSiteUrl(siteUrl)}/`).toString()
}

export function toIsoDate(value: string) {
  const parsed = new Date(value)
  return Number.isNaN(parsed.valueOf()) ? value : parsed.toISOString()
}

export function toRfc822Date(value: string) {
  const parsed = new Date(value)
  return Number.isNaN(parsed.valueOf()) ? value : parsed.toUTCString()
}

export function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}
