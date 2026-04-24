import { ASSISTANT_SERVER_MESSAGES } from "~/utils/constants"
import { createAssistantReply } from "~/server/utils/assistant-core.js"

type AssistantRequestBody = {
  question?: string
  language?: string
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<AssistantRequestBody>(event)
    return await createAssistantReply(body?.question, body?.language)
  } catch (error) {
    const failure = error as { isAssistantFailure?: boolean; status?: number; message?: string }
    if (failure?.isAssistantFailure) {
      setResponseStatus(event, failure.status ?? 500)
      return { error: failure.message ?? ASSISTANT_SERVER_MESSAGES.unavailable }
    }

    console.error(ASSISTANT_SERVER_MESSAGES.logPrefix, error)
    setResponseStatus(event, 500)
    return { error: ASSISTANT_SERVER_MESSAGES.unavailable }
  }
})
