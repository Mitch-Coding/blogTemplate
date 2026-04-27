---
slug: deepseek-api-integration
title: Nuxt 3 中接入 AI 助手的示例实现
excerpt: 使用 Nuxt 3 的服务端 API 封装 AI 助手请求，并在页面中完成一次基础的对话交互。
description: 介绍如何在 Nuxt 3 项目中通过 Nitro API 路由封装 AI 助手调用，包括环境变量、服务端请求和前端交互状态。
category: AI
tags:
  - Nuxt
  - AI
  - API
date: 2026-04-26
readingTime: 5
pinned: false
---

## 背景

在内容型站点中接入 AI 助手时，前端页面不应该直接暴露服务端密钥。更稳妥的方式是让 Nuxt 3 的 Nitro API 路由作为中间层，统一读取环境变量、调用外部接口并返回页面需要的数据。

## 服务端 API

可以在 `server/api/` 下创建一个接口，把请求参数校验、密钥读取和外部服务调用都放在服务端完成。

```typescript
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  return {
    message: `AI response for: ${body.prompt}`,
  }
})
```

## 页面交互

页面侧只需要维护输入内容、加载状态和返回结果。提交时调用自己的 Nuxt API，不直接访问第三方服务。

```typescript
const answer = ref("")
const pending = ref(false)

async function askAssistant(prompt: string) {
  pending.value = true
  try {
    const response = await $fetch<{ message: string }>("/api/assistant", {
      method: "POST",
      body: { prompt },
    })
    answer.value = response.message
  } finally {
    pending.value = false
  }
}
```

## 配置建议

把 API Key 放在 `.env`，并通过 `runtimeConfig` 读取。只允许公开展示的配置放到 `runtimeConfig.public`，服务端密钥保持在私有配置中。

## 总结

这个结构能让 AI 请求逻辑集中在服务端，避免密钥泄漏，也方便后续加入限流、日志和错误处理。
