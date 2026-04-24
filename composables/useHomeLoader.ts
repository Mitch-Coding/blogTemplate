export function useHomeLoader() {
  const isLoaded = ref(false)
  const isHidden = ref(false)

  onMounted(() => {
    document.body.classList.add("is-site-loading")
    const startedAt = performance.now()

    const completeLoad = () => {
      const elapsed = performance.now() - startedAt
      const remaining = Math.max(0, LOADER_MIN_VISIBLE_MS - elapsed)

      window.setTimeout(() => {
        document.body.classList.remove("is-site-loading")
        isLoaded.value = true

        window.setTimeout(() => {
          isHidden.value = true
        }, LOADER_DISMISS_ANIMATION_MS)
      }, remaining)
    }

    if (document.readyState === "complete") {
      completeLoad()
    } else {
      window.addEventListener("load", completeLoad, { once: true })
    }
  })

  onBeforeUnmount(() => {
    document.body.classList.remove("is-site-loading")
  })

  return {
    isLoaded,
    isHidden,
  }
}
