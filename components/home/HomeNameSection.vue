<script setup lang="ts">
import { HOME_PAGE_CONTENT } from "~/content/site/home.config"
</script>

<template>
  <section class="name-section section-shell" id="name">
    <div class="section-heading section-heading--split">
      <div>
        <p class="eyebrow">{{ HOME_PAGE_CONTENT.name.eyebrow }}</p>
        <h2>
          <template v-for="row in HOME_PAGE_CONTENT.name.rows" :key="`heading-${row.letter}`">
            <span v-if="row.letter === 'H'" class="name-heading-h">{{ row.letter }}<img class="name-heading-spider" src="/noun-spider-8112812.svg" alt="" aria-hidden="true" /></span>
            <span v-else>{{ row.letter }}</span>
          </template>
        </h2>
      </div>
      <p class="section-summary">{{ HOME_PAGE_CONTENT.name.summary }}</p>
    </div>

    <div class="name-poster">
      <div class="name-stack" :aria-label="`${HOME_PAGE_CONTENT.name.headingPrefix} breakdown`">
        <span class="name-ghost" aria-hidden="true">
          <span
            v-for="row in HOME_PAGE_CONTENT.name.rows"
            :key="`ghost-${row.letter}`"
            class="name-ghost-letter"
          >
            {{ row.letter }}
          </span>
        </span>
        <div
          v-for="(row, index) in HOME_PAGE_CONTENT.name.rows"
          :key="row.letter"
          class="name-row"
          :data-index="index"
        >
          <span class="name-letter-shell" tabindex="0">
            <span class="name-letter">{{ row.letter }}</span>
            <span class="name-letter-overlay" aria-hidden="true">{{ row.translation }}</span>
          </span>
          <div class="name-copy">
            <em>{{ row.keyword }}</em>
            <small class="name-translation">{{ row.translation }}</small>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
