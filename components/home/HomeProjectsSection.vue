<script setup lang="ts">
import { HOME_PAGE_CONTENT } from "~/content/site/home.config"
</script>

<template>
  <section
    class="projects-section section-shell issue-section issue-section--projects"
    id="projects"
    data-issue="05"
  >
    <div class="section-bridge" aria-hidden="true">
      <span class="section-bridge__thread"></span>
    </div>
    <div class="section-heading">
      <div class="projects-stage projects-stage--left">
        <div class="projects-heading-copy">
          <p class="eyebrow">{{ HOME_PAGE_CONTENT.projects.eyebrow }}</p>
          <h2>{{ HOME_PAGE_CONTENT.projects.title }}</h2>
        </div>
      </div>
    </div>

    <div class="projects-stage projects-stage--right">
      <div class="project-grid"></div>
    </div>
  </section>
</template>
