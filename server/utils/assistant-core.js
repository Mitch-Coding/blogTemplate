import { readFileSync } from "node:fs"

import {
  ASSISTANT_LANGUAGE_COPY,
  ASSISTANT_REQUEST_OPTIONS,
  DEFAULT_LANGUAGE,
  DEEPSEEK_API_KEY_ENV,
  DEEPSEEK_API_URL,
  DEEPSEEK_MODEL,
  ENGLISH_LANGUAGE,
  HTTP_POST_METHOD,
  JSON_CONTENT_TYPE,
  LOCAL_PROMPT_RELATIVE_PATH,
  MAX_QUESTION_LENGTH,
  PORTFOLIO_SYSTEM_PROMPT_ENV,
  PUBLIC_PORTFOLIO_SYSTEM_PROMPT,
} from "~/utils/constants"

const LOCAL_PROMPT_PATH = new URL(LOCAL_PROMPT_RELATIVE_PATH, import.meta.url)

const readLocalPromptOverride = () => {
  try {
    return readFileSync(LOCAL_PROMPT_PATH, "utf8").trim()
  } catch {
    return ""
  }
}

const getPortfolioSystemPrompt = () =>
  process.env[PORTFOLIO_SYSTEM_PROMPT_ENV]?.trim() ||
  readLocalPromptOverride() ||
  PUBLIC_PORTFOLIO_SYSTEM_PROMPT

const normalizeLanguage = (value) => (value === ENGLISH_LANGUAGE ? ENGLISH_LANGUAGE : DEFAULT_LANGUAGE)

const getLanguageInstruction = (language) =>
  ASSISTANT_LANGUAGE_COPY[language]?.languageInstruction ??
  ASSISTANT_LANGUAGE_COPY[DEFAULT_LANGUAGE].languageInstruction

const getUserPrompt = (question, language) =>
  (ASSISTANT_LANGUAGE_COPY[language] ?? ASSISTANT_LANGUAGE_COPY[DEFAULT_LANGUAGE]).userPrompt(question)

const createAssistantFailure = (status, message) => {
  const error = new Error(message)
  error.name = "AssistantError"
  error.status = status
  error.isAssistantFailure = true
  return error
}

const normalizeAnswer = (value) => value.replace(/\n{3,}/g, "\n\n").trim()

const getDefaultStatus = (language) =>
  (ASSISTANT_LANGUAGE_COPY[language] ?? ASSISTANT_LANGUAGE_COPY[DEFAULT_LANGUAGE]).defaultStatus

const getJsonErrorMessage = async (response) => {
  try {
    const payload = await response.json()
    return payload?.error?.message || payload?.message || payload?.error || ""
  } catch {
    return ""
  }
}

const createMessages = (question, language) => [
  {
    role: "system",
    content: `${getPortfolioSystemPrompt()}\n\n${getLanguageInstruction(language)}`,
  },
  {
    role: "user",
    content: getUserPrompt(question, language),
  },
]

export const createAssistantReply = async (question, language = DEFAULT_LANGUAGE) => {
  const apiKey = process.env[DEEPSEEK_API_KEY_ENV]?.trim()
  const normalizedLanguage = normalizeLanguage(language)
  if (!apiKey) {
    const copy = ASSISTANT_LANGUAGE_COPY[normalizedLanguage]
    throw createAssistantFailure(500, copy.missingApiKey)
  }

  const trimmedQuestion = typeof question === "string" ? question.trim() : ""
  if (!trimmedQuestion) {
    const copy = ASSISTANT_LANGUAGE_COPY[normalizedLanguage]
    throw createAssistantFailure(400, copy.emptyQuestion)
  }

  if (trimmedQuestion.length > MAX_QUESTION_LENGTH) {
    const copy = ASSISTANT_LANGUAGE_COPY[normalizedLanguage]
    throw createAssistantFailure(400, copy.questionTooLong(MAX_QUESTION_LENGTH))
  }

  const response = await fetch(DEEPSEEK_API_URL, {
    method: HTTP_POST_METHOD,
    headers: {
      "Content-Type": JSON_CONTENT_TYPE,
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      ...ASSISTANT_REQUEST_OPTIONS,
      messages: createMessages(trimmedQuestion, normalizedLanguage),
    }),
  })

  if (!response.ok) {
    const copy = ASSISTANT_LANGUAGE_COPY[normalizedLanguage]
    const message = await getJsonErrorMessage(response)
    const normalizedMessage =
      typeof message === "string" && message.trim()
        ? copy.deepSeekUnavailableWithMessage(message.trim())
        : copy.deepSeekUnavailable
    throw createAssistantFailure(502, normalizedMessage)
  }

  const payload = await response.json()
  const answer = normalizeAnswer(payload?.choices?.[0]?.message?.content ?? "")

  if (!answer) {
    const copy = ASSISTANT_LANGUAGE_COPY[normalizedLanguage]
    throw createAssistantFailure(502, copy.invalidContent)
  }

  return {
    answer,
    status: getDefaultStatus(normalizedLanguage),
  }
}
