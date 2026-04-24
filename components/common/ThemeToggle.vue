<script setup lang="ts">
const { theme, toggleTheme } = useTheme()

const label = computed(() => (theme.value === "dark" ? "Light" : "Dark"))
</script>

<template>
  <button type="button" class="control-chip" @click="toggleTheme">
    Theme · {{ label }}
  </button>
</template>
