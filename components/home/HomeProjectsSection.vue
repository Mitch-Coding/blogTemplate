<script setup lang="ts">
import { HOME_PAGE_CONTENT } from "~/content/site/home.config"

const projectButtonClass = (variant: string) => `project-card__button project-card__button--${variant}`
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
      <div class="project-grid">
        <article
          v-for="project in HOME_PAGE_CONTENT.projects.items"
          :key="project.id"
          class="project-card"
        >
          <a
            :class="projectButtonClass(project.variant)"
            :href="project.href"
            target="_blank"
            rel="noreferrer"
          >
            <span class="project-card__impact" aria-hidden="true">{{ project.impact }}</span>
            <span class="project-card__index">{{ project.index }}</span>
            <strong>{{ project.title }}</strong>
            <span class="project-card__type">{{ project.type }}</span>
            <p>{{ project.summary }}</p>
          </a>
        </article>
      </div>
    </div>
  </section>
</template>
