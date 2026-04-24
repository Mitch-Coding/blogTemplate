<script setup lang="ts">
const { language, toggleLanguage } = useSiteLanguage()

const label = computed(() => (language.value === "zh" ? "中文" : "EN"))
</script>

<template>
  <button type="button" class="control-chip" @click="toggleLanguage">
    Lang · {{ label }}
  </button>
</template>
