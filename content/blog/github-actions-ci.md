---
slug: github-actions-ci
title: GitHub Actions 为前端项目配置 CI：类型检查、构建与自动预览
excerpt: 用 GitHub Actions 为 Nuxt 3 项目搭建 CI 流水线，包括类型检查、构建验证和 PR 预览环境。
description: 用 GitHub Actions 为 Nuxt 3 项目搭建 CI 流水线，包括类型检查、构建验证和 PR 预览环境。
category: 工程效率
tags:
  - GitHub Actions
  - CI/CD
  - 自动化
date: 2026-04-10
readingTime: 8
pinned: false
---

## 问题背景

本地 `npm run dev` 一切正常，push 到 main 分支部署后却挂了——这种事每个开发者都经历过。CI 的核心价值就是：**在代码合并前发现问题，而不是合并后**。

这篇文章讲如何为一个 Nuxt 3 前端项目配置 GitHub Actions CI，覆盖类型检查、构建验证两个核心环节。

## 基础 CI 配置

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci

      - name: Type Check
        run: npm run typecheck

      - name: Build
        run: npm run build
```

这个配置做了三件事：

1. **每次 push 或 PR 到 main 时触发**
2. **安装依赖**（`npm ci` 比 `npm install` 更快且更确定性）
3. **运行类型检查和构建**

为什么两个都要跑？因为 `typecheck` 只检查 TypeScript 类型，不检查运行时问题（比如缺失的环境变量、错误的导入路径）。`build` 能发现这些问题。

## 缓存加速

CI 最大的痛点是慢。每次运行都重新安装依赖，少则 30 秒，多则 2 分钟。加上缓存：

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: npm  # 自动缓存 node_modules
```

`actions/setup-node` 的 `cache` 参数会自动根据 `package-lock.json` 的 hash 缓存 `node_modules`。依赖没变时直接命中缓存，安装时间从 60 秒降到 5 秒。

## 环境变量处理

有些项目构建时需要环境变量（比如 API 地址）。CI 环境里没有 `.env` 文件，需要在 workflow 里注入：

```yaml
- name: Build
  run: npm run build
  env:
    NUXT_PUBLIC_API_BASE: https://api.example.com
    DEEPSEEK_API_KEY: ${{ secrets.DEEPSEEK_API_KEY }}
```

公开变量直接写值，敏感变量用 GitHub Secrets。`${{ secrets.XXX }}` 从仓库的 Settings → Secrets 里读取，日志里会自动脱敏。

## PR 评论：让构建结果可见

CI 跑完了，但结果只在 Actions 页面能看到，PR 的 reviewer 不一定会去看。加一个步骤，把构建结果贴到 PR 评论里：

```yaml
- name: Comment on PR
  if: github.event_name == 'pull_request'
  uses: actions/github-script@v7
  with:
    script: |
      github.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: '✅ CI passed: type check + build successful'
      })
```

也可以用 `check` 状态代替评论，更轻量：

```yaml
- name: Report Status
  if: always()
  run: |
    if [ "${{ job.status }}" = "success" ]; then
      echo "✅ All checks passed"
    else
      echo "❌ Build failed"
      exit 1
    fi
```

## 分支保护：强制 CI 通过才能合并

配置了 CI 但不强制执行，等于没配置。在 GitHub 仓库的 Settings → Branches → Branch protection rules 里：

1. 选择 `main` 分支
2. 勾选 "Require status checks to pass before merging"
3. 选择 `check` 这个 job

这样，CI 没通过的 PR 无法合并。这是防止"合了就挂"的最有效手段。

## 踩坑记录

**坑 1：`npm ci` 要求 `package-lock.json` 存在**

如果你的项目没有提交 `package-lock.json`，`npm ci` 会报错。确保 lock 文件在 Git 里。

**坑 2：Node 版本不一致**

本地用 Node 21，CI 用 Node 18，构建结果可能不同。在 `package.json` 里指定 engines：

```json
{
  "engines": {
    "node": ">=20"
  }
}
```

CI 里用相同的主版本。

**坑 3：Nuxt 的 `.nuxt` 缓存**

Nuxt 的 `.nuxt` 目录是构建缓存，CI 里每次都是干净环境，没有这个缓存。如果构建很慢，可以加缓存步骤：

```yaml
- uses: actions/cache@v4
  with:
    path: .nuxt
    key: nuxt-${{ hashFiles('**/package-lock.json') }}
```

但要注意：如果 Nuxt 版本或配置变了，旧缓存可能导致构建异常。遇到莫名其妙的构建失败，先清缓存试试。

## 总结

- CI 的核心是类型检查 + 构建验证，在合并前发现问题
- `npm ci` 替代 `npm install`，更快更确定
- 用 `actions/setup-node` 的 `cache` 参数加速依赖安装
- 分支保护规则强制 CI 通过才能合并
- 环境变量区分公开值和 Secrets

CI 配置不复杂，但很多团队就是不愿意花 30 分钟配一下。直到某天有人把一个类型错误合进了 main，导致线上白屏——然后才想起 CI 的好。
