const LOW_MEMORY_DEVICE_MAX_GB = 8
const PHONE_VIEWPORT_MAX_WIDTH = 560

const SKILLS_ICONS_PROGRESS_WINDOW = Object.freeze({
  phone: Object.freeze({ start: 0.7, duration: 0.22 }),
  desktop: Object.freeze({ start: 0.67, duration: 0.27 }),
})

function setStyleProperties(element: HTMLElement, properties: Record<string, string>) {
  Object.entries(properties).forEach(([propertyName, value]) => {
    element.style.setProperty(propertyName, value)
  })
}

export function useHomeScene() {
  const visibleIssueSections = new Set<Element>()
  const issueIntersectionRatios = new Map<Element, number>()
  let issueObserver: IntersectionObserver | null = null
  let revealObserver: IntersectionObserver | null = null
  let ticking = false
  let heroPeel: any = null
  let heroPeelTime = 0
  let handleResize: (() => void) | null = null
  let peelRetryTimer: ReturnType<typeof window.setTimeout> | null = null
  let peelResizeObserver: ResizeObserver | null = null

  const getSkillBadges = () => [...document.querySelectorAll<HTMLElement>(".issue-section--skills .tool-badge")]

  const getToolBadgeNumber = (badge: HTMLElement) => {
    const badgeClass = [...badge.classList].find((className) => /^tool-badge--\d+$/.test(className))
    return badgeClass ? Number.parseInt(badgeClass.replace("tool-badge--", ""), 10) : null
  }

  const setupHeroPeelPath = () => {
    const heroPeelElement = document.getElementById("hero-peel")
    if (!heroPeel || !heroPeelElement) return

    const width = heroPeelElement.offsetWidth
    const height = heroPeelElement.offsetHeight
    if (width <= 0 || height <= 0) return

    heroPeel.setupDimensions()

    heroPeel.setPeelPath(
      width,
      height,
      width * 0.992,
      height * 0.972,
      width * 0.62,
      height * 0.28,
      width * -0.22,
      height * -0.26,
    )

    heroPeel.setTimeAlongPath(heroPeelTime)
  }

  const setupHeroPeel = () => {
    const peelWindow = window as Window & { Peel?: any }
    const heroPeelElement = document.getElementById("hero-peel")

    if (!heroPeelElement || !peelWindow.Peel || heroPeel) return false

    const width = heroPeelElement.offsetWidth
    const height = heroPeelElement.offsetHeight
    if (width <= 0 || height <= 0) return false

    heroPeel = new peelWindow.Peel(heroPeelElement, {
      corner: peelWindow.Peel.Corners.BOTTOM_RIGHT,
      setPeelOnInit: false,
      topShadowBlur: 8,
      topShadowAlpha: 0.22,
      topShadowOffsetX: 1,
      topShadowOffsetY: 2,
      backReflection: false,
      backShadowAlpha: 0.16,
      backShadowSize: 0.04,
      bottomShadowDarkAlpha: 0.22,
      bottomShadowLightAlpha: 0.06,
    })

    heroPeel.setFadeThreshold(1.01)
    setupHeroPeelPath()
    heroPeel.setTimeAlongPath(0)
    return true
  }

  const clearPeelRetryTimer = () => {
    if (!peelRetryTimer) return
    window.clearTimeout(peelRetryTimer)
    peelRetryTimer = null
  }

  const scheduleHeroPeelSetup = () => {
    let attempts = 0

    const ensurePeel = () => {
      clearPeelRetryTimer()

      if (setupHeroPeel() || attempts > 60) {
        requestSceneUpdate()
        return
      }

      attempts += 1
      peelRetryTimer = window.setTimeout(ensurePeel, 100)
    }

    ensurePeel()
  }

  const initHeroPeelResizeObserver = () => {
    const heroPeelElement = document.getElementById("hero-peel")
    if (!heroPeelElement || typeof ResizeObserver === "undefined") return

    peelResizeObserver = new ResizeObserver(() => {
      if (!heroPeel) {
        setupHeroPeel()
      }

      setupHeroPeelPath()
      requestSceneUpdate()
    })
    peelResizeObserver.observe(heroPeelElement)
  }

  const updateHeroProgress = () => {
    const root = document.documentElement
    const heroSection = document.querySelector<HTMLElement>(".hero-section")
    if (!heroSection) return

    const rect = heroSection.getBoundingClientRect()
    const scrollable = rect.height - window.innerHeight
    const progress = scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 0
    const liftProgress = easeOutCubic(clamp((progress - 0.018) / 0.18, 0, 1))
    const peelIntro = easeOutCubic(clamp(progress / 0.06, 0, 1))
    const peelBuild = easeInOutQuad(clamp(progress / 0.58, 0, 1))
    const travelProgress = easeInOutQuad(clamp((progress - 0.6) / 0.34, 0, 1))
    const peelProgress = Math.min(0.998, 0.03 * peelIntro + 0.968 * peelBuild)

    document.body.classList.toggle("is-hero-active", progress < 0.92)
    root.style.setProperty("--hero-progress", progress.toFixed(3))
    root.style.setProperty("--hero-lift-progress", liftProgress.toFixed(3))
    root.style.setProperty("--hero-detach-progress", travelProgress.toFixed(3))
    root.style.setProperty("--hero-lift-x", `${liftProgress * -18}px`)
    root.style.setProperty("--hero-lift-y", `${liftProgress * -26}px`)
    root.style.setProperty("--hero-lift-rotate", `${liftProgress * -4.2}deg`)
    root.style.setProperty("--hero-tilt-x", `${travelProgress * 8}deg`)
    root.style.setProperty("--hero-tilt-y", `${travelProgress * -18}deg`)
    root.style.setProperty("--hero-residue-opacity", `${Math.max(travelProgress * 0.78, liftProgress * 0.08)}`)
    root.style.setProperty("--hero-residue-size", `${28 + travelProgress * 168}px`)
    root.style.setProperty("--hero-shadow-opacity", `${0.42 + liftProgress * 0.18 + travelProgress * 0.11}`)
    root.style.setProperty("--hero-shift-x", `${travelProgress * window.innerWidth * -0.82}px`)
    root.style.setProperty("--hero-shift-y", `${travelProgress * window.innerHeight * -0.96}px`)
    root.style.setProperty("--hero-rotate", `${travelProgress * -20}deg`)
    root.style.setProperty("--hero-scale", `${1 + liftProgress * 0.012 - travelProgress * 0.098}`)

    if (heroPeel) {
      heroPeelTime = peelProgress
      heroPeel.setTimeAlongPath(peelProgress)
    }
  }

  const updateNameProgress = () => {
    const nameSection = document.querySelector<HTMLElement>(".name-section")
    const nameRows = [...document.querySelectorAll<HTMLElement>(".name-row")]
    if (!nameSection || nameRows.length === 0) return

    const rect = nameSection.getBoundingClientRect()
    const total = rect.height - window.innerHeight * 0.45
    const progress = total > 0 ? clamp((window.innerHeight * 0.2 - rect.top) / total, 0, 1) : 0

    nameRows.forEach((row, index) => {
      const start = index * 0.12
      const end = start + 0.26
      const rowProgress = clamp((progress - start) / (end - start), 0, 1)
      row.style.setProperty("--row-progress", rowProgress.toFixed(3))
    })
  }

  const updateProjectsProgress = () => {
    const projectsSection = document.querySelector<HTMLElement>(".issue-section--projects")
    const projectGrid = document.querySelector<HTMLElement>(".issue-section--projects .project-grid")
    const projectCards = [...document.querySelectorAll<HTMLElement>(".issue-section--projects .project-card")]

    if (!projectsSection || !projectGrid || projectCards.length === 0) return

    const rect = projectGrid.getBoundingClientRect()
    const start = window.innerHeight * 0.92
    const end = window.innerHeight * 0.24
    const distance = start - end
    const sectionProgress = distance > 0 ? clamp((start - rect.top) / distance, 0, 1) : 0
    const cardFlow = clamp((sectionProgress - 0.05) / 0.82, 0, 1)
    const titleEnter = easeOutCubic(clamp((sectionProgress - 0.02) / 0.17, 0, 1))
    const titleHoldEnd = 0.82
    const titleExitWindow = 0.1
    const titleExit = easeOutCubic(clamp((sectionProgress - titleHoldEnd) / titleExitWindow, 0, 1))

    projectsSection.style.setProperty("--projects-progress", sectionProgress.toFixed(3))
    projectsSection.style.setProperty("--projects-title-enter", titleEnter.toFixed(3))
    projectsSection.style.setProperty("--projects-title-exit", titleExit.toFixed(3))

    projectCards.forEach((card, index) => {
      const cardStart = 0.14 + index * 0.06
      const cardEnd = 0.62 + index * 0.075
      const cardRaw = clamp((cardFlow - cardStart) / (cardEnd - cardStart), 0, 1)
      const cardProgress = easeInOutQuad(cardRaw)
      card.style.setProperty("--project-pop", cardProgress.toFixed(3))
    })
  }

  const updateIssueFiveSixTransition = () => {
    const root = document.documentElement
    const projectsSection = document.querySelector<HTMLElement>(".issue-section--projects")
    const contactSection = document.querySelector<HTMLElement>(".issue-section--contact")

    if (!projectsSection || !contactSection) return

    const contactRect = contactSection.getBoundingClientRect()
    const start = window.innerHeight * 0.9
    const end = window.innerHeight * 0.18
    const distance = start - end
    const progress = distance > 0 ? clamp((start - contactRect.top) / distance, 0, 1) : 0

    root.style.setProperty("--issue-56-progress", progress.toFixed(3))
  }

  const updateAboutEntryTransition = () => {
    const root = document.documentElement
    const aboutSection = document.querySelector<HTMLElement>(".issue-section--about")
    const aboutHeading = document.querySelector<HTMLElement>(".issue-section--about .section-heading")
    const aboutPanel = document.querySelector<HTMLElement>(".issue-section--about .about-panel")

    if (!aboutSection || !aboutHeading || !aboutPanel) {
      root.style.setProperty("--about-enter-progress", "0")
      root.style.setProperty("--about-heading-enter", "0")
      root.style.setProperty("--about-panel-enter", "0")
      return
    }

    const sectionRect = aboutSection.getBoundingClientRect()
    const headingRect = aboutHeading.getBoundingClientRect()
    const panelRect = aboutPanel.getBoundingClientRect()

    const sectionStart = window.innerHeight * 0.94
    const sectionEnd = window.innerHeight * 0.44
    const sectionDistance = sectionStart - sectionEnd
    const progress =
      sectionDistance > 0 ? clamp((sectionStart - sectionRect.top) / sectionDistance, 0, 1) : 0

    const headingStart = window.innerHeight * 0.64
    const headingEnd = window.innerHeight * 0.26
    const headingDistance = headingStart - headingEnd
    const headingRaw =
      headingDistance > 0 ? clamp((headingStart - headingRect.top) / headingDistance, 0, 1) : 0

    const panelStart = window.innerHeight * 0.82
    const panelEnd = window.innerHeight * 0.34
    const panelDistance = panelStart - panelEnd
    const panelRaw =
      panelDistance > 0 ? clamp((panelStart - panelRect.top) / panelDistance, 0, 1) : 0

    root.style.setProperty("--about-enter-progress", progress.toFixed(3))
    root.style.setProperty("--about-heading-enter", easeOutCubic(headingRaw).toFixed(3))
    root.style.setProperty("--about-panel-enter", easeOutCubic(panelRaw).toFixed(3))
  }

  const resetSkillsTransition = () => {
    const skillsSection = document.querySelector<HTMLElement>(".issue-section--skills")
    if (skillsSection) {
      setStyleProperties(skillsSection, {
        "--skills-progress": "0",
        "--skills-title-progress": "0",
        "--skills-web-progress": "0",
        "--skills-web-density-progress": "0",
        "--skills-icons-progress": "0",
      })
    }

    getSkillBadges().forEach((badge) => {
      setStyleProperties(badge, {
        "--badge-pop": "0",
        "--badge-float": "0",
        "--badge-burst-y": "0px",
        "--badge-burst-scale": "0",
        "--badge-burst-rotate": "0deg",
      })
    })
  }

  const updateSkillsTransition = () => {
    const skillsSection = document.querySelector<HTMLElement>(".issue-section--skills")
    const aboutSection = document.querySelector<HTMLElement>(".issue-section--about")
    if (!skillsSection) return

    const skillBadges = getSkillBadges()
    if (skillBadges.length === 0) return

    const rect = skillsSection.getBoundingClientRect()
    const isPhoneViewport = window.innerWidth <= PHONE_VIEWPORT_MAX_WIDTH
    const iconsWindow = isPhoneViewport ? SKILLS_ICONS_PROGRESS_WINDOW.phone : SKILLS_ICONS_PROGRESS_WINDOW.desktop
    const start = window.innerHeight * 0.99
    const end = window.innerHeight * -0.12
    const distance = start - end
    const progress = distance > 0 ? clamp((start - rect.top) / distance, 0, 1) : 0

    const titleRaw = clamp((progress - 0.14) / 0.22, 0, 1)
    const webRaw = clamp((progress - (isPhoneViewport ? 0.54 : 0.64)) / (isPhoneViewport ? 0.24 : 0.2), 0, 1)
    const webDensityRaw = clamp(
      (progress - (isPhoneViewport ? 0.62 : 0.74)) / (isPhoneViewport ? 0.18 : 0.14),
      0,
      1,
    )
    const iconsRaw = clamp((progress - iconsWindow.start) / iconsWindow.duration, 0, 1)
    const aboutExitRaw = clamp((progress - 0.28) / 0.46, 0, 1)

    const titleProgress = easeInOutQuad(titleRaw)
    const webProgress = easeInOutQuad(webRaw)
    const webDensityProgress = easeInOutQuad(webDensityRaw)
    const iconsProgress = easeInOutQuad(iconsRaw)
    const aboutExitProgress = easeInOutQuad(aboutExitRaw)

    setStyleProperties(skillsSection, {
      "--skills-progress": progress.toFixed(3),
      "--skills-title-progress": titleProgress.toFixed(3),
      "--skills-web-progress": webProgress.toFixed(3),
      "--skills-web-density-progress": webDensityProgress.toFixed(3),
      "--skills-icons-progress": iconsProgress.toFixed(3),
    })

    if (aboutSection) {
      aboutSection.style.setProperty("--about-exit-progress", aboutExitProgress.toFixed(3))
    }

    skillBadges.forEach((badge) => {
      const badgeNumber = getToolBadgeNumber(badge)
      const order = Number.parseFloat(badge.style.getPropertyValue("--badge-order")) || 0
      const normalizedOrder = skillBadges.length > 1 ? order / (skillBadges.length - 1) : 0
      const badgeSpread = isPhoneViewport ? 0.46 : 0.68
      const badgeWindow = isPhoneViewport ? 0.42 : 0.32
      const badgeStart = Math.max(0, normalizedOrder * badgeSpread)
      const badgeEnd = Math.min(badgeStart + badgeWindow, 1)
      const badgeRaw = clamp((iconsProgress - badgeStart) / (badgeEnd - badgeStart), 0, 1)
      const badgePopBase = easeOutCubic(clamp((badgeRaw - 0.06) / 0.84, 0, 1))
      const badgePop = badgeNumber === 18
        ? Math.max(
            badgePopBase,
            easeOutCubic(clamp((iconsProgress - 0.52) / 0.18, 0, 1)) * 0.82,
          )
        : badgeNumber === 12
          ? Math.max(badgePopBase, iconsProgress * 0.38)
          : badgePopBase
      const badgeFloat = easeInOutQuad(clamp((badgeRaw - 0.82) / 0.18, 0, 1))
      const burstEnvelope = Math.sin(badgeRaw * Math.PI)
      const burstLift = burstEnvelope * (1 - badgeRaw * 0.22) * (isPhoneViewport ? 10 : 18)
      const burstScale = burstEnvelope * (isPhoneViewport ? 0.04 : 0.07)
      const burstRotate = burstEnvelope * (order % 2 === 0 ? -1 : 1) * 1.35

      setStyleProperties(badge, {
        "--badge-pop": badgePop.toFixed(3),
        "--badge-float": badgeFloat.toFixed(3),
        "--badge-burst-y": `${burstLift.toFixed(2)}px`,
        "--badge-burst-scale": burstScale.toFixed(4),
        "--badge-burst-rotate": `${burstRotate.toFixed(2)}deg`,
      })
    })
  }

  const resetIssueProgress = () => {
    const root = document.documentElement
    const issueSections = [...document.querySelectorAll<HTMLElement>(".issue-section[data-issue]")]
    const aboutSection = document.querySelector<HTMLElement>(".issue-section--about")

    issueSections.forEach((section) => section.classList.remove("is-current"))
    document.body.classList.remove("is-skills-active")
    delete document.body.dataset.issue
    root.style.setProperty("--bridge-progress", "0")
    root.style.setProperty("--accent-opacity", "0.16")
    root.style.setProperty("--thread-opacity", "0.24")
    root.style.setProperty("--section-dim", "0.16")
    root.style.setProperty("--issue-56-progress", "0")
    root.style.setProperty("--about-enter-progress", "0")
    root.style.setProperty("--about-heading-enter", "0")
    root.style.setProperty("--about-panel-enter", "0")
    aboutSection?.style.setProperty("--about-exit-progress", "0")
    resetSkillsTransition()
  }

  const getIssueFocus = (rect: DOMRect) => {
    const viewportAnchor = window.innerHeight * 0.48
    const sectionCenter = rect.top + rect.height / 2
    const distance = Math.abs(sectionCenter - viewportAnchor)
    const maxDistance = window.innerHeight * 0.72 + rect.height * 0.16
    return clamp(1 - distance / maxDistance, 0, 1)
  }

  const getIssueProgress = (rect: DOMRect) => {
    const total = rect.height + window.innerHeight * 0.38
    return total > 0 ? clamp((window.innerHeight * 0.22 - rect.top) / total, 0, 1) : 0
  }

  const updateIssueProgress = () => {
    const root = document.documentElement
    const issueSections = [...document.querySelectorAll<HTMLElement>(".issue-section[data-issue]")]
    if (issueSections.length === 0) return

    const candidates = issueSections
      .filter((section) => visibleIssueSections.has(section))
      .map((section) => {
        const rect = section.getBoundingClientRect()
        const focus = getIssueFocus(rect)
        const ratio = issueIntersectionRatios.get(section) ?? 0
        return {
          section,
          rect,
          focus,
          score: focus * 0.72 + ratio * 0.28,
        }
      })

    if (candidates.length === 0) {
      resetIssueProgress()
      return
    }

    const activeCandidate = candidates.reduce((best, candidate) =>
      candidate.score > best.score ? candidate : best,
    )

    const activeIssue = activeCandidate.section.dataset.issue ?? ""
    const progress = getIssueProgress(activeCandidate.rect)
    const stage = clamp((Number(activeIssue) - 3) / 3, 0, 1)
    const accentOpacity = clamp(0.24 - stage * 0.1 + Math.sin(progress * Math.PI) * 0.05, 0.08, 0.26)
    const threadOpacity = clamp(0.34 - stage * 0.1 + (1 - progress) * 0.08, 0.12, 0.4)
    const sectionDim = clamp(0.14 + stage * 0.14 + Math.abs(progress - 0.5) * 0.06, 0.14, 0.34)

    issueSections.forEach((section) => {
      section.classList.toggle("is-current", section === activeCandidate.section)
    })

    document.body.dataset.issue = activeIssue
    document.body.classList.toggle("is-skills-active", activeIssue === "04")
    root.style.setProperty("--bridge-progress", progress.toFixed(3))
    root.style.setProperty("--accent-opacity", accentOpacity.toFixed(3))
    root.style.setProperty("--thread-opacity", threadOpacity.toFixed(3))
    root.style.setProperty("--section-dim", sectionDim.toFixed(3))
  }

  const updateScene = () => {
    ticking = false
    updateHeroProgress()
    updateNameProgress()
    updateIssueProgress()
    updateAboutEntryTransition()
    updateSkillsTransition()
    updateProjectsProgress()
    updateIssueFiveSixTransition()
  }

  const requestSceneUpdate = () => {
    if (ticking) return
    ticking = true
    window.requestAnimationFrame(updateScene)
  }

  const initObservers = () => {
    const issueSections = [...document.querySelectorAll<HTMLElement>(".issue-section[data-issue]")]
    const revealItems = [...document.querySelectorAll<HTMLElement>(".reveal")].filter(
      (item) => !item.classList.contains("project-card"),
    )

    issueObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          issueIntersectionRatios.set(entry.target, entry.intersectionRatio)

          if (entry.isIntersecting) {
            visibleIssueSections.add(entry.target)
            entry.target.classList.add("is-visible")
          } else {
            visibleIssueSections.delete(entry.target)
          }
        })

        requestSceneUpdate()
      },
      {
        threshold: [0, 0.16, 0.32, 0.48, 0.64, 0.8],
        rootMargin: "-16% 0px -16% 0px",
      },
    )

    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
          }
        })
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -10% 0px",
      },
    )

    issueSections.forEach((section) => issueObserver?.observe(section))
    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index * 70, 210)}ms`
      item.style.setProperty("--reveal-index", String(index))
      revealObserver?.observe(item)
    })
  }

  onMounted(async () => {
    await nextTick()

    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean }
      deviceMemory?: number
    }

    const lowMemoryDevice =
      Boolean(nav.connection?.saveData) ||
      (typeof nav.deviceMemory === "number" && nav.deviceMemory <= LOW_MEMORY_DEVICE_MAX_GB)

    document.body.classList.toggle("is-low-memory-device", lowMemoryDevice)

    initHeroPeelResizeObserver()
    scheduleHeroPeelSetup()
    initObservers()
    updateScene()

    window.addEventListener("scroll", requestSceneUpdate, { passive: true })
    handleResize = () => {
      setupHeroPeelPath()
      requestSceneUpdate()
    }
    window.addEventListener("resize", handleResize)
  })

  onBeforeUnmount(() => {
    window.removeEventListener("scroll", requestSceneUpdate)
    if (handleResize) {
      window.removeEventListener("resize", handleResize)
    }
    issueObserver?.disconnect()
    revealObserver?.disconnect()
    peelResizeObserver?.disconnect()
    clearPeelRetryTimer()
    heroPeel?.removeEvents?.()
    document.body.classList.remove("is-low-memory-device", "is-hero-active", "is-skills-active")
    delete document.body.dataset.issue
  })
}
