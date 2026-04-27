<script setup lang="ts">
import { HOME_PAGE_CONTENT } from "~/content/site/home.config"

const { language } = useSiteLanguage()

const feedback = reactive<Record<string, "" | "is-copied" | "is-copy-failed">>({
  mail: "",
})

const copyText = async (key: "mail", value: string) => {
  let copied = false

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value)
      copied = true
    } catch {
      copied = false
    }
  }

  if (!copied) {
    const textarea = document.createElement("textarea")
    textarea.value = value
    textarea.setAttribute("readonly", "")
    textarea.style.position = "fixed"
    textarea.style.opacity = "0"
    document.body.append(textarea)
    textarea.select()
    try {
      copied = document.execCommand("copy")
    } catch {
      copied = false
    }
    textarea.remove()
  }

  feedback[key] = copied ? "is-copied" : "is-copy-failed"
  window.setTimeout(() => {
    feedback[key] = ""
  }, 1400)
}

const trimContactIconBackground = () => {
  const contactIcon = document.querySelector<HTMLImageElement>(".contact-callout__icon")
  if (!(contactIcon instanceof HTMLImageElement) || contactIcon.dataset.trimmed === "true") return

  const applyTrim = () => {
    if (!contactIcon.naturalWidth || !contactIcon.naturalHeight) return

    const canvas = document.createElement("canvas")
    canvas.width = contactIcon.naturalWidth
    canvas.height = contactIcon.naturalHeight

    const context = canvas.getContext("2d", { willReadFrequently: true })
    if (!context) return

    context.drawImage(contactIcon, 0, 0)
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const { data } = imageData

    for (let index = 0; index < data.length; index += 4) {
      const red = data[index]
      const green = data[index + 1]
      const blue = data[index + 2]
      const brightness = (red + green + blue) / 3
      const saturation = Math.max(red, green, blue) - Math.min(red, green, blue)

      if (brightness > 247 && saturation < 22) {
        data[index + 3] = 0
      } else if (brightness > 232 && saturation < 38) {
        const softness = (247 - brightness) / 15
        data[index + 3] = Math.min(data[index + 3], Math.round(Math.max(softness, 0) * 255))
      }
    }

    context.putImageData(imageData, 0, 0)
    contactIcon.dataset.trimmed = "true"
    contactIcon.src = canvas.toDataURL("image/png")
  }

  if (contactIcon.complete) {
    applyTrim()
  } else {
    contactIcon.addEventListener("load", applyTrim, { once: true })
  }
}

onMounted(() => {
  trimContactIconBackground()
})
</script>

<template>
  <section class="contact-section section-shell issue-section issue-section--contact" id="contact" data-issue="06">
    <div class="section-bridge" aria-hidden="true">
      <span class="section-bridge__thread"></span>
    </div>
    <div class="contact-layout">
      <div class="contact-panel contact-panel--left">
        <p class="eyebrow contact-eyebrow">{{ HOME_PAGE_CONTENT.contact.eyebrow }}</p>

        <div class="contact-intro">
          <h2 class="contact-title">
            <span
              v-for="line in HOME_PAGE_CONTENT.contact.titleLines"
              :key="line"
              class="contact-title__line"
              :data-text="line"
            >
              {{ line }}
            </span>
          </h2>
          <p class="contact-copy">
            {{ language === "zh" ? HOME_PAGE_CONTENT.contact.copy.zh : HOME_PAGE_CONTENT.contact.copy.en }}
          </p>
        </div>
      </div>

      <div class="contact-panel contact-panel--right">
        <div class="contact-cluster">
          <a
            class="contact-callout"
            :href="`mailto:${HOME_PAGE_CONTENT.contact.email}`"
            :aria-label="language === 'zh' ? HOME_PAGE_CONTENT.contact.calloutAria.zh : HOME_PAGE_CONTENT.contact.calloutAria.en"
          >
            <span class="contact-callout__letters" aria-hidden="true">
              <span class="contact-callout__row">
                <span class="contact-callout__piece contact-callout__piece--1">C</span>
                <span class="contact-callout__piece contact-callout__piece--2">O</span>
                <span class="contact-callout__piece contact-callout__piece--3">N</span>
                <span class="contact-callout__piece contact-callout__piece--4">T</span>
                <span class="contact-callout__piece contact-callout__piece--5">A</span>
                <span class="contact-callout__piece contact-callout__piece--6">C</span>
                <span class="contact-callout__piece contact-callout__piece--7">T</span>
              </span>
              <span class="contact-callout__row contact-callout__row--me">
                <span class="contact-callout__piece contact-callout__piece--8">M</span>
                <span class="contact-callout__piece contact-callout__piece--9">E</span>
              </span>
            </span>
          </a>
          <img class="contact-callout__icon" src="/contact-megaphone.jpg" alt="" loading="lazy" decoding="async" />
          <aside class="contact-status" aria-label="Availability">
            <p class="contact-status__label">{{ HOME_PAGE_CONTENT.contact.statusLabel }}</p>
            <p
              v-for="(item, index) in HOME_PAGE_CONTENT.contact.statusItems"
              :key="index"
              class="contact-status__item"
            >
              {{ language === "zh" ? item.zh : item.en }}
            </p>
            <p class="contact-status__item contact-status__item--meta">
              {{ HOME_PAGE_CONTENT.contact.statusMeta }}
            </p>
          </aside>
        </div>

        <div class="contact-links">
          <button
            class="contact-link contact-link--mail contact-link--copy"
            :class="feedback.mail"
            type="button"
            :data-copy-value="HOME_PAGE_CONTENT.contact.email"
            data-copy-status="COPIED"
            :aria-label="language === 'zh' ? '复制邮箱地址' : 'Copy email address'"
            @click="copyText('mail', HOME_PAGE_CONTENT.contact.email)"
          >
            <span class="contact-link__label">{{ HOME_PAGE_CONTENT.contact.email }}</span>
            <span class="contact-link__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="3.25" y="5.75" width="17.5" height="12.5" rx="2.25" stroke="currentColor" stroke-width="1.7" />
                <path d="M4.5 8.1L12 13.35L19.5 8.1" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </button>
          <a class="contact-link contact-link--github" :href="HOME_PAGE_CONTENT.contact.githubUrl" target="_blank" rel="noreferrer">
            <span class="contact-link__label">{{ HOME_PAGE_CONTENT.contact.githubLabel }}</span>
            <span class="contact-link__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.292 9.424 7.861 10.95.575.106.786-.25.786-.557 0-.274-.01-1-.016-1.96-3.197.694-3.873-1.54-3.873-1.54-.523-1.329-1.277-1.683-1.277-1.683-1.044-.714.08-.699.08-.699 1.154.081 1.761 1.186 1.761 1.186 1.026 1.758 2.691 1.25 3.347.956.104-.743.402-1.25.731-1.538-2.552-.29-5.236-1.276-5.236-5.682 0-1.255.449-2.282 1.185-3.087-.119-.29-.514-1.457.113-3.037 0 0 .967-.31 3.17 1.18a11.02 11.02 0 0 1 5.77 0c2.201-1.49 3.166-1.18 3.166-1.18.629 1.58.234 2.747.115 3.037.738.805 1.184 1.832 1.184 3.087 0 4.417-2.688 5.389-5.25 5.673.414.357.783 1.061.783 2.14 0 1.546-.014 2.792-.014 3.172 0 .31.207.669.793.555C20.71 21.42 24 17.099 24 12 24 5.65 18.85.5 12 .5Z" />
              </svg>
            </span>
          </a>
          <a
            class="contact-link contact-link--wechat contact-link--copy"
            :href="HOME_PAGE_CONTENT.contact.linkedinUrl"
            target="_blank"
            rel="noreferrer"
            :aria-label="language === 'zh' ? '打开 LinkedIn' : 'Open LinkedIn'"
          >
            <span class="contact-link__label">LinkedIn / {{ HOME_PAGE_CONTENT.contact.linkedinLabel }}</span>
            <span class="contact-link__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M10 5.1c-4.14 0-7.5 2.7-7.5 6.03c0 1.78.95 3.38 2.46 4.49L4.2 19.3l3.7-1.84c.68.18 1.39.28 2.1.28c4.14 0 7.5-2.7 7.5-6.03S14.14 5.1 10 5.1Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
                <path d="M16.2 9.35c-2.93 0-5.3 1.95-5.3 4.37c0 1.03.45 1.97 1.21 2.71l-.44 2.18l2.26-1.2c.72.19 1.47.29 2.27.29c2.93 0 5.3-1.95 5.3-4.37s-2.37-3.98-5.3-3.98Z" fill="currentColor" />
                <circle cx="7.6" cy="11" r="0.9" fill="currentColor" />
                <circle cx="11.2" cy="11" r="0.9" fill="currentColor" />
                <circle cx="14.6" cy="13.3" r="0.82" fill="#090909" />
                <circle cx="17.7" cy="13.3" r="0.82" fill="#090909" />
              </svg>
            </span>
          </a>
          <a
            class="contact-link contact-link--resume"
            :href="HOME_PAGE_CONTENT.contact.resumePath"
            target="_blank"
            rel="noreferrer"
            :aria-label="language === 'zh' ? '打开简历 PDF' : 'Open resume PDF'"
          >
            <span class="contact-link__label">Resume / PDF</span>
            <span class="contact-link__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 6.2a2.2 2.2 0 1 0 0-4.4a2.2 2.2 0 0 0 0 4.4Z" fill="currentColor" />
                <path d="M12 18.8c2.1 0 3.5-2 3.5-4.5S14.1 9.8 12 9.8s-3.5 2-3.5 4.5s1.4 4.5 3.5 4.5Z" fill="currentColor" />
                <path d="M10.2 6.4L8.6 4.1M13.8 6.4L15.4 4.1M8.8 10.4L5.2 8.8M15.2 10.4L18.8 8.8M8.7 13.1L4.9 13.1M15.3 13.1H19.1M9 15.8L5.8 18.2M15 15.8L18.2 18.2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
