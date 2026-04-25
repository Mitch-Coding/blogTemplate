import type { BlogTocItem } from "~/types/blog"

function createHeadingId(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
    .replace(/^-|-$/g, "")
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value)
      return true
    } catch {
      return false
    }
  }

  const textarea = document.createElement("textarea")
  textarea.value = value
  textarea.setAttribute("readonly", "")
  textarea.style.position = "fixed"
  textarea.style.opacity = "0"
  document.body.append(textarea)
  textarea.select()

  let copied = false
  try {
    copied = document.execCommand("copy")
  } catch {
    copied = false
  }

  textarea.remove()
  return copied
}

export function useBlogPostEnhancements(contentRef: Ref<HTMLElement | null>) {
  const tocItems = ref<BlogTocItem[]>([])
  const activeHeadingId = ref("")
  const lightboxImageSrc = ref("")
  const lightboxImageAlt = ref("")
  let observer: IntersectionObserver | null = null

  const closeLightbox = () => {
    lightboxImageSrc.value = ""
    lightboxImageAlt.value = ""
  }

  const enhanceContent = async () => {
    await nextTick()
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
    await nextTick()

    const content = contentRef.value
    if (!content) {
      tocItems.value = []
      activeHeadingId.value = ""
      return
    }

    const headings = [...content.querySelectorAll<HTMLHeadingElement>("h2, h3")]

    headings.forEach((heading) => {
      if (!heading.id) {
        heading.id = createHeadingId(heading.textContent ?? "")
      }

      if (!heading.querySelector(".post-heading-anchor")) {
        const anchor = document.createElement("a")
        anchor.className = "post-heading-anchor"
        anchor.href = `#${heading.id}`
        anchor.setAttribute("aria-label", BLOG_COPY.copyLinkAria)
        anchor.textContent = "#"
        anchor.addEventListener("click", async (event) => {
          event.preventDefault()
          const fullUrl = `${location.origin}${location.pathname}${location.search}#${heading.id}`
          await copyText(fullUrl)
          history.pushState(null, "", `#${heading.id}`)
        })
        heading.append(anchor)
      }
    })

    tocItems.value = headings.map((heading) => ({
      id: heading.id,
      text: (heading.textContent ?? "").replace(/#\s*$/, "").trim(),
      level: heading.tagName === "H3" ? 3 : 2,
    }))

    observer?.disconnect()
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeHeadingId.value = entry.target.id
          }
        })
      },
      { rootMargin: "-20% 0% -70% 0%", threshold: 0 },
    )

    headings.forEach((heading) => observer?.observe(heading))

    content.querySelectorAll<HTMLPreElement>("pre").forEach((pre) => {
      const code = pre.querySelector<HTMLElement>("code")
      if (!code) return

      const langClass = [...code.classList].find((className) => className.startsWith("language-"))
      if (langClass && !pre.querySelector(".code-lang-label")) {
        const label = document.createElement("span")
        label.className = "code-lang-label"
        label.textContent = langClass.replace("language-", "")
        pre.append(label)
      }

      if (!pre.querySelector(".code-copy-btn")) {
        const button = document.createElement("button")
        button.className = "code-copy-btn"
        button.textContent = BLOG_COPY.copy
        button.setAttribute("aria-label", BLOG_COPY.copyAria)
        button.addEventListener("click", async () => {
          const copied = await copyText(code.textContent ?? "")
          if (!copied) return
          button.textContent = BLOG_COPY.copied
          button.classList.add("is-copied")
          window.setTimeout(() => {
            button.textContent = BLOG_COPY.copy
            button.classList.remove("is-copied")
          }, CODE_COPY_RESET_DELAY_MS)
        })
        pre.append(button)
      }
    })

    content.querySelectorAll<HTMLImageElement>("img").forEach((image) => {
      image.classList.add("post-content__zoomable-image")

      if (image.dataset.zoomBound === "true") return

      image.dataset.zoomBound = "true"
      image.addEventListener("click", () => {
        lightboxImageSrc.value = image.currentSrc || image.src
        lightboxImageAlt.value = image.alt || ""
      })
    })
  }

  onMounted(() => {
    void enhanceContent()
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightboxImageSrc.value) {
        closeLightbox()
      }
    })
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
  })

  return {
    activeHeadingId,
    closeLightbox,
    enhanceContent,
    lightboxImageAlt,
    lightboxImageSrc,
    tocItems,
  }
}
