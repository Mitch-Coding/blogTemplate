<script setup lang="ts">
definePageMeta({
  layout: false,
  alias: ["/post.html"],
})

const route = useRoute()
const slug = typeof route.query.slug === "string" ? route.query.slug.trim() : ""

if (slug) {
  await navigateTo(`/blog/${encodeURIComponent(slug)}`, { redirectCode: 301, replace: true })
} else {
  await navigateTo("/blog", { redirectCode: 302, replace: true })
}
</script>

<template>
  <div></div>
</template>
