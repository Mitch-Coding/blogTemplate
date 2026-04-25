<script setup lang="ts">
import type { BlogTocItem } from "~/types/blog"

const props = defineProps<{
  activeId: string
  items: BlogTocItem[]
}>()

const isOpen = ref(false)
const activeItem = computed(() => props.items.find((item) => item.id === props.activeId) ?? props.items[0])

const closeToc = () => {
  isOpen.value = false
}
</script>

<template>
  <aside
    v-if="items.length > 0"
    class="post-toc"
    :class="{ 'is-open': isOpen }"
    id="post-toc"
    aria-label="文章目录"
  >
    <div class="post-toc__desktop">
      <p class="post-toc__heading">{{ BLOG_COPY.tocHeading }}</p>
      <nav class="post-toc__nav">
        <a
          v-for="item in items"
          :key="item.id"
          :href="`#${item.id}`"
          class="post-toc__link"
          :class="{
            'post-toc__link--sub': item.level === 3,
            'is-active': activeId === item.id,
          }"
          :data-id="item.id"
        >
          {{ item.text }}
        </a>
      </nav>
    </div>

    <button
      class="post-toc__mobile-trigger"
      type="button"
      :aria-expanded="isOpen"
      aria-controls="post-toc-sheet"
      @click="isOpen = true"
    >
      <span class="post-toc__mobile-kicker">目录</span>
      <span class="post-toc__mobile-title">{{ activeItem?.text }}</span>
    </button>

    <button
      class="post-toc__scrim"
      type="button"
      aria-label="关闭文章目录"
      @click="closeToc"
    ></button>

    <section
      class="post-toc__sheet"
      id="post-toc-sheet"
      aria-label="文章目录"
      :aria-hidden="isOpen ? 'false' : 'true'"
    >
      <div class="post-toc__sheet-header">
        <p class="post-toc__sheet-title">{{ BLOG_COPY.tocHeading }}</p>
        <button class="post-toc__sheet-close" type="button" aria-label="关闭文章目录" @click="closeToc">
          关闭
        </button>
      </div>

      <nav class="post-toc__nav post-toc__nav--sheet">
        <a
          v-for="item in items"
          :key="item.id"
          :href="`#${item.id}`"
          class="post-toc__link"
          :class="{
            'post-toc__link--sub': item.level === 3,
            'is-active': activeId === item.id,
          }"
          :data-id="item.id"
          @click="closeToc"
        >
          {{ item.text }}
        </a>
      </nav>
    </section>
  </aside>
</template>
