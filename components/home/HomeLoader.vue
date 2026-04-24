<script setup lang="ts">
defineProps<{
  hidden: boolean
  loaded: boolean
}>()
</script>

<template>
  <div v-if="!hidden" class="site-loader" id="site-loader" :class="{ 'is-loaded': loaded }" aria-hidden="true">
    <p class="site-loader__label">LOADING</p>
  </div>
</template>
