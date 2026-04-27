---
slug: blog-writing-template
title: Blog 文章写作模板：Frontmatter 字段与正文格式说明
excerpt: 说明 content/blog 下每篇 Markdown 文章需要填写哪些字段、每个字段是什么意思，以及推荐的正文写作格式。
description: 说明 content/blog 下每篇 Markdown 文章需要填写哪些字段、每个字段是什么意思，以及推荐的正文写作格式。
category: 写作指南
tags:
  - Blog
  - Markdown
  - Nuxt Content
  - Template
date: 2026-04-27
readingTime: 6
pinned: true
---

## 这篇模板的用途

`content/blog/` 目录下的每一篇文章都是一个 Markdown 文件。文件顶部需要写一段 frontmatter，用来告诉站点这篇文章的标题、摘要、分类、标签、发布时间和阅读时间。

你可以复制下面的模板，新建自己的文章：

```markdown
---
slug: my-first-post
title: 我的第一篇文章标题
excerpt: 文章列表页显示的简短摘要。
description: 用于 SEO、RSS 和 Open Graph 的文章描述。
category: 工程实践
tags:
  - Nuxt
  - Vue
  - Markdown
date: 2026-04-27
readingTime: 5
pinned: false
---

## 文章开头

这里写文章正文。
```

## Frontmatter 字段说明

| 字段 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| `slug` | string | 是 | 文章 URL 标识，只使用小写英文、数字和连字符，例如 `nuxt-content-guide`。文章访问路径会是 `/blog/nuxt-content-guide`。 |
| `title` | string | 是 | 文章标题，会显示在文章详情页、文章列表、SEO 标题和 RSS 中。 |
| `excerpt` | string | 是 | 简短摘要，主要用于文章卡片和列表页。建议 30 到 80 个字。 |
| `description` | string | 是 | 更完整的页面描述，用于 SEO、RSS、Open Graph 等元数据。可以和 `excerpt` 相同，也可以稍微更详细。 |
| `category` | string | 是 | 文章主分类。每篇文章只建议设置一个分类，例如 `工程实践`、`AI`、`部署`、`写作指南`。 |
| `tags` | string[] | 是 | 文章标签，可以有多个。标签用于侧边栏筛选和内容归类。 |
| `date` | string | 是 | 发布日期，使用 `YYYY-MM-DD` 格式，例如 `2026-04-27`。 |
| `readingTime` | number | 是 | 预计阅读分钟数，只写数字，例如 `6`。 |
| `pinned` | boolean | 否 | 是否置顶。写 `true` 或 `false`，不要写成字符串。未填写时默认为 `false`。 |

## 字段填写建议

### slug

`slug` 应该稳定，不要频繁修改。因为它会影响文章 URL。

推荐：

```yaml
slug: nuxt-content-blog-guide
```

避免：

```yaml
slug: 我的文章
slug: Nuxt Content Guide!!!
slug: 2026/04/27/blog
```

### title

`title` 应该清楚说明文章主题。不要只写“总结”“记录”“踩坑”这类过于模糊的标题。

推荐：

```yaml
title: Nuxt Content 博客文章结构设计
```

### excerpt 和 description

`excerpt` 更短，适合列表页快速浏览。`description` 更完整，适合搜索引擎和分享卡片。

```yaml
excerpt: 介绍 Nuxt Content 博客文章的字段设计和 Markdown 写作规范。
description: 介绍如何在 Nuxt 3 项目中使用 Nuxt Content 编写博客文章，包括 frontmatter 字段、正文结构、代码块和图片引用。
```

### category 和 tags

`category` 是主分类，`tags` 是更细的关键词。

```yaml
category: 工程实践
tags:
  - Nuxt
  - Content
  - Markdown
```

不要把太多重复含义的词都塞进 `tags`。标签应该帮助读者筛选内容。

### date

`date` 使用固定格式：

```yaml
date: 2026-04-27
```

不要使用中文日期、斜杠日期或带时间的格式。

### readingTime

`readingTime` 只写数字：

```yaml
readingTime: 8
```

不要写：

```yaml
readingTime: "8 min"
readingTime: 八分钟
```

### pinned

`pinned` 是布尔值：

```yaml
pinned: true
```

不要写成拼错或字符串：

```yaml
pinned: ture
pinned: "true"
```

## 正文格式建议

正文从 frontmatter 后面开始。推荐使用清晰的二级标题组织内容：

```markdown
## 背景

说明为什么写这篇文章。

## 方案

说明核心做法。

## 代码示例

```typescript
export const message = "Hello blog"
```

## 总结

列出结论和后续注意事项。
```

## 常用 Markdown 写法

### 标题

```markdown
## 二级标题
### 三级标题
```

正文中建议从 `##` 开始，因为页面本身已经有文章主标题。

### 列表

```markdown
- 第一项
- 第二项
- 第三项
```

### 代码块

代码块要写语言名，方便高亮：

````markdown
```typescript
const siteName = "Portfolio Blog Starter"
```
````

### 表格

```markdown
| 字段 | 说明 |
| --- | --- |
| `title` | 文章标题 |
| `date` | 发布日期 |
```

### 图片

图片放在 `public/` 下，然后用绝对路径引用：

```markdown
![图片说明](/images/example/screenshot.png)
```

开源项目中不要提交包含个人账号、后台数据、密钥、真实域名或私人信息的截图。

## 发布前检查

发布新文章前建议检查：

- `slug` 是否唯一
- `date` 是否是 `YYYY-MM-DD`
- `pinned` 是否是 `true` 或 `false`
- 图片路径是否存在
- 文章中是否包含不应公开的个人信息、密钥、域名或后台截图
- 本地是否能通过 `npm run typecheck` 和 `npm run build`
