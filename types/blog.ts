export interface BlogPostMeta {
  slug: string
  title: string
  excerpt: string
  description: string
  category: string
  tags: string[]
  date: string
  readingTime: number
  pinned: boolean
  path?: string
}

export interface BlogCategoryItem {
  name: string
  count: number
}

export interface BlogTocItem {
  id: string
  text: string
  level: 2 | 3
}
