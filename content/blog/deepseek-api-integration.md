---
slug: deepseek-api-integration
title: DeepSeek API 集成实战：流式响应、并发控制与成本优化
excerpt: 在 Nuxt 3 项目中集成 DeepSeek API 的完整经验，包括流式输出、请求去重、错误处理和 token 成本控制。
description: 在 Nuxt 3 项目中集成 DeepSeek API 的完整经验，包括流式输出、请求去重、错误处理和 token 成本控制。
category: AI
tags:
  - DeepSeek
  - API
  - LLM
  - Nuxt
date: 2026-04-17
readingTime: 10
pinned: false
---

## 问题背景

最近在个人博客上集成了一个 AI 助手，用 DeepSeek API 做后端。需求很简单：用户输入问题，AI 根据博客内容回答。但做下来发现，即使是这么"简单"的需求，也有不少工程细节需要注意。

技术栈：Nuxt 3 + Nitro（服务端），前端直接 fetch 调用。

## API 调用基础

DeepSeek 的 API 兼容 OpenAI 格式，用官方 SDK 即可：

```javascript
import OpenAI from "openai"

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
})

const response = await client.chat.completions.create({
  model: "deepseek-chat",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: userMessage },
  ],
  temperature: 0.7,
  max_tokens: 1024,
})
```

`deepseek-chat` 是通用模型，`deepseek-reasoner` 是推理模型。博客助手场景用 `deepseek-chat` 就够了，reasoner 模型更贵且更慢。

## 流式响应是必须的

LLM 生成一个回答需要 3-10 秒，如果等全部生成完再返回，用户体验极差。必须用流式输出（SSE）：

```typescript
// server/api/ask.post.ts
export default defineEventHandler(async (event) => {
  const { message } = await readBody(event)

  const stream = await client.chat.completions.create({
    model: "deepseek-chat",
    messages: [{ role: "user", content: message }],
    stream: true,
  })

  setResponseHeader(event, "Content-Type", "text/event-stream")
  setResponseHeader(event, "Cache-Control", "no-cache")
  setResponseHeader(event, "Connection", "keep-alive")

  const encoder = new TextEncoder()

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content
        if (content) {
          controller.enqueue(encoder.encode(`data: ${content}\n\n`))
        }
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"))
      controller.close()
    },
  })
})
```

前端用 `EventSource` 或 `fetch` + `ReadableStream` 逐字接收：

```typescript
const response = await fetch("/api/ask", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: userInput }),
})

const reader = response.body.getReader()
const decoder = new TextDecoder()

while (true) {
  const { done, value } = await reader.read()
  if (done) break
  const text = decoder.decode(value)
  // 解析 data: 行，追加到显示区域
  appendToOutput(text)
}
```

## 请求去重：防止重复提交

用户快速点击发送按钮，会导致同一个问题发两次请求。需要在服务端做去重：

```typescript
const activeRequests = new Map<string, AbortController>()

export default defineEventHandler(async (event) => {
  const { message, requestId } = await readBody(event)

  // 如果同一个 requestId 还在处理中，中止之前的
  if (activeRequests.has(requestId)) {
    activeRequests.get(requestId).abort()
  }

  const controller = new AbortController()
  activeRequests.set(requestId, controller)

  try {
    const stream = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: message }],
      stream: true,
    }, { signal: controller.signal })

    // ... 流式处理
  } finally {
    activeRequests.delete(requestId)
  }
})
```

前端生成一个 `requestId`（UUID 即可），每次发送时带上。服务端用 `Map` 跟踪活跃请求，新请求进来时中止旧的。

## 错误处理

DeepSeek API 常见错误：

- **429 Rate Limit**：请求太频繁，需要退避重试
- **401 Unauthorized**：API Key 无效或过期
- **500 Server Error**：DeepSeek 服务端问题

```typescript
async function callWithRetry(fn: () => Promise<any>, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error: any) {
      if (error.status === 429 && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000 // 指数退避
        await new Promise(r => setTimeout(r, delay))
        continue
      }
      throw error
    }
  }
}
```

## Token 成本控制

DeepSeek 的定价已经很便宜了，但如果用户滥用（比如每次发一大段文本），成本还是会飙升。几个控制手段：

1. **限制输入长度**：前端限制输入框字数，后端截断超长文本
2. **设置 `max_tokens`**：控制每次生成的最大 token 数
3. **System Prompt 精简**：System Prompt 每次请求都会发送，精简它能节省大量 token

```typescript
const MAX_INPUT_LENGTH = 500
const MAX_OUTPUT_TOKENS = 1024

const truncatedMessage = userMessage.slice(0, MAX_INPUT_LENGTH)

const response = await client.chat.completions.create({
  model: "deepseek-chat",
  messages: [
    { role: "system", content: conciseSystemPrompt }, // 控制在 200 token 以内
    { role: "user", content: truncatedMessage },
  ],
  max_tokens: MAX_OUTPUT_TOKENS,
})
```

## 踩坑记录

**坑 1：Nuxt 3 的 `setResponseHeader` 和流式响应冲突**

在某些 Nuxt 版本中，`setResponseHeader` 设置的 header 不会生效，因为 Nitro 可能已经发送了响应头。解决方案是直接操作 `event.node.res`：

```typescript
event.node.res.setHeader("Content-Type", "text/event-stream")
event.node.res.setHeader("Cache-Control", "no-cache")
event.node.res.flushHeaders()
```

**坑 2：DeepSeek 的 `finish_reason` 不总是 `stop`**

当输出被 `max_tokens` 截断时，`finish_reason` 是 `length` 而不是 `stop`。前端需要判断这个状态，给用户一个"回答可能不完整"的提示。

## 总结

- 流式输出是 LLM 应用的标配，不流式等于没做
- 用 `requestId` 做请求去重，防止重复提交
- 429 错误要指数退避重试，不要立即重试
- 控制输入长度和 `max_tokens`，成本可控
- System Prompt 是隐形成本大户，精简它

DeepSeek API 本身不难集成，真正的挑战在于工程层面的细节处理。这些细节不处理好，上线后就是无穷无尽的 bug。
