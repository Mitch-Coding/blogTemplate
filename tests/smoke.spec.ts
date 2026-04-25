import { expect, test } from "playwright/test"

const articleSlug = "deepseek-api-integration"
const articleTitle = "DeepSeek API 集成实战：流式响应、并发控制与成本优化"

test("home page opens", async ({ request }) => {
  const response = await request.get("/")

  expect(response.status()).toBe(200)
  await expect(response.text()).resolves.toContain("Mitch")
})

test("blog list opens and shows articles", async ({ request }) => {
  const response = await request.get("/blog")

  expect(response.status()).toBe(200)
  await expect(response.text()).resolves.toContain(articleTitle)
})

test("blog detail opens and shows article title", async ({ request }) => {
  const response = await request.get(`/blog/${articleSlug}`)

  expect(response.status()).toBe(200)
  await expect(response.text()).resolves.toContain(articleTitle)
})

test("rss feed opens", async ({ request }) => {
  const response = await request.get("/rss.xml")

  expect(response.status()).toBe(200)
  await expect(response.text()).resolves.toContain("<rss")
})

test("sitemap opens", async ({ request }) => {
  const response = await request.get("/sitemap.xml")

  expect(response.status()).toBe(200)
  await expect(response.text()).resolves.toContain("<urlset")
})

test("robots opens", async ({ request }) => {
  const response = await request.get("/robots.txt")

  expect(response.status()).toBe(200)
  await expect(response.text()).resolves.toContain("User-agent")
})
