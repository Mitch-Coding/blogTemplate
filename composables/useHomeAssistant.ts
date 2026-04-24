export function useHomeAssistant(defaultAnswer: Ref<string>, assistantCopy: Ref<{
  defaultStatus: string
  emptyQuestion: string
  loadingStatus: string
  followUpStatus: string
  requestError: string
  placeholder: string
}>, questionAnswers: Ref<string[]>) {
  const activeQuestionIndex = ref<number | null>(null)
  const answer = ref(defaultAnswer.value)
  const status = ref(assistantCopy.value.defaultStatus)
  const question = ref("")
  const isLoading = ref(false)
  let requestId = 0

  watch(defaultAnswer, (value) => {
    if (!question.value && activeQuestionIndex.value === null && !isLoading.value) {
      answer.value = value
    }
  })

  watch(
    assistantCopy,
    (value) => {
      if (isLoading.value) {
        status.value = value.loadingStatus
        return
      }

      if (activeQuestionIndex.value !== null) {
        answer.value = questionAnswers.value[activeQuestionIndex.value] ?? defaultAnswer.value
        status.value = value.defaultStatus
        return
      }

      if (!question.value.trim()) {
        answer.value = defaultAnswer.value
      }

      status.value = value.defaultStatus
    },
    { deep: true },
  )

  const selectQuestion = (index: number, value: string) => {
    activeQuestionIndex.value = index
    answer.value = value
    status.value = assistantCopy.value.defaultStatus
  }

  const clearActiveQuestion = () => {
    activeQuestionIndex.value = null
  }

  const submitQuestion = async () => {
    const trimmedQuestion = question.value.trim()
    if (!trimmedQuestion) {
      answer.value = defaultAnswer.value
      status.value = assistantCopy.value.emptyQuestion
      return
    }

    clearActiveQuestion()
    const currentRequestId = ++requestId
    isLoading.value = true
    answer.value =
      assistantCopy.value.placeholder === trimmedQuestion
        ? defaultAnswer.value
        : `...`
    status.value = assistantCopy.value.loadingStatus

    try {
      const response = await fetch(ASSISTANT_API_PATH, {
        method: HTTP_POST_METHOD,
        headers: {
          "Content-Type": JSON_CONTENT_TYPE,
        },
        body: JSON.stringify({
          question: trimmedQuestion,
          language: useSiteLanguage().language.value,
        }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(typeof data.error === "string" ? data.error : assistantCopy.value.requestError)
      }

      if (currentRequestId !== requestId) {
        return
      }

      answer.value =
        typeof data.answer === "string" && data.answer.trim()
          ? data.answer
          : defaultAnswer.value
      status.value = assistantCopy.value.followUpStatus
    } catch {
      if (currentRequestId !== requestId) {
        return
      }

      answer.value = defaultAnswer.value
      status.value = assistantCopy.value.requestError
    } finally {
      if (currentRequestId === requestId) {
        isLoading.value = false
      }
    }
  }

  return {
    activeQuestionIndex,
    answer,
    clearActiveQuestion,
    isLoading,
    question,
    selectQuestion,
    status,
    submitQuestion,
  }
}
