export interface LocalizedText {
  zh: string
  en: string
}

export interface NameRow {
  letter: string
  keyword: string
  translation: string
}

export interface AssistantQuestion {
  label: LocalizedText
  answer: LocalizedText
}

export interface AssistantCopy {
  defaultAnswer: LocalizedText
  defaultStatus: LocalizedText
  emptyQuestion: LocalizedText
  loadingStatus: LocalizedText
  followUpStatus: LocalizedText
  requestError: LocalizedText
  placeholder: LocalizedText
  askLabel: LocalizedText
  askSubmit: LocalizedText
  label: LocalizedText
  questions: AssistantQuestion[]
}

export interface HomeFactItem {
  label: string
  body: LocalizedText
}

export interface ContactLinkConfig {
  type: "copy" | "link"
  key: string
  label: string
  value: string
  href: string
  copyStatus: string
  ariaLabel: LocalizedText
}

export interface HomeContentConfig {
  meta: {
    title: string
    description: string
  }
  topbar: {
    brand: string
    blogHref: string
    blogLabel: string
    issuesLabel: string
    navItems: Array<{ href: string; label: string }>
  }
  hero: {
    stickerAriaLabel: string
    scrollLabel: LocalizedText
  }
  name: {
    eyebrow: string
    headingPrefix: string
    summary: string
    rows: NameRow[]
  }
  about: {
    eyebrow: string
    title: string
    promptLines: string[]
    facts: HomeFactItem[]
    assistant: AssistantCopy
  }
  skills: {
    eyebrow: string
    title: string
  }
  projects: {
    eyebrow: string
    title: string
    activeProjectIds: string[]
  }
  contact: {
    eyebrow: string
    titleLines: string[]
    copy: LocalizedText
    statusLabel: string
    statusItems: LocalizedText[]
    statusMeta: string
    calloutAria: LocalizedText
    email: string
    githubUrl: string
    githubLabel: string
    linkedinUrl: string
    linkedinLabel: string
    resumePath: string
    links: ContactLinkConfig[]
  }
}
