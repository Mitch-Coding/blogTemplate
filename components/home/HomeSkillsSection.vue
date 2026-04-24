<script setup lang="ts">
import { HOME_PAGE_CONTENT } from "~/content/site/home.config"

const getSkillBadgeMotionPreset = (badgeNumber: number, order: number, badgeCount: number) => {
  const angle = (order / Math.max(badgeCount, 1)) * Math.PI * 2 - Math.PI * 0.56
  const enterRadius = 14 + (order % 4) * 3.2
  const driftRadius = 3.4 + (order % 3) * 1.45
  const enterX = Math.cos(angle) * enterRadius
  const enterY = Math.sin(angle) * enterRadius + 18
  const enterRotate = (order % 2 === 0 ? -1 : 1) * (4 + (order % 4) * 1.2)
  const driftX = Math.cos(angle + Math.PI / 3) * driftRadius
  const driftY = -5.4 - (order % 4) * 1.15
  const driftRotate = (badgeNumber % 2 === 0 ? 1 : -1) * (0.38 + (order % 3) * 0.12)
  const driftScale = 0.009 + (order % 4) * 0.002
  const floatDuration = 8.6 + (order % 5) * 0.8
  const floatDelay = order * -0.53

  return [
    `--badge-order: ${order}`,
    `--badge-enter-x: ${enterX.toFixed(2)}px`,
    `--badge-enter-y: ${enterY.toFixed(2)}px`,
    `--badge-enter-rotate: ${enterRotate.toFixed(2)}deg`,
    `--badge-drift-x: ${driftX.toFixed(2)}px`,
    `--badge-drift-y: ${driftY.toFixed(2)}px`,
    `--badge-drift-rotate: ${driftRotate.toFixed(2)}deg`,
    `--badge-drift-scale: ${driftScale.toFixed(4)}`,
    `--badge-float-duration: ${floatDuration.toFixed(2)}s`,
    `--badge-float-delay: ${floatDelay.toFixed(2)}s`,
    "--badge-pop: 0",
    "--badge-float: 0",
    "--badge-burst-y: 0px",
    "--badge-burst-scale: 0",
    "--badge-burst-rotate: 0deg",
  ].join("; ")
}

const badges = SKILL_BADGES.map((badgeDefinition, fallbackIndex) => {
  const order = SKILL_BADGE_ORDER.get(badgeDefinition.id) ?? fallbackIndex
  const motionStyle = getSkillBadgeMotionPreset(badgeDefinition.id, order, SKILL_BADGES.length)

  return {
    ...badgeDefinition,
    style: `${badgeDefinition.style} ${motionStyle};`,
  }
})
</script>

<template>
  <section class="skills-section section-shell issue-section issue-section--skills" id="skills" data-issue="04">
    <div class="section-bridge" aria-hidden="true">
      <span class="section-bridge__thread"></span>
    </div>
    <div class="skill-universe">
      <div class="skill-universe__header">
        <div>
          <p class="eyebrow">{{ HOME_PAGE_CONTENT.skills.eyebrow }}</p>
          <h2>{{ HOME_PAGE_CONTENT.skills.title }}</h2>
        </div>
      </div>

      <div class="universe-web" aria-hidden="true">
        <img class="universe-web__image" src="/issue4-user-vector.svg" alt="" loading="lazy" decoding="async" />
      </div>

      <div
        v-for="badge in badges"
        :key="badge.id"
        class="tool-badge"
        :class="[ `tool-badge--${badge.id}`, ...badge.extraClasses ]"
        role="img"
        :aria-label="badge.label"
        :title="badge.label"
        :data-label="badge.label"
        :style="badge.style"
      >
        <span class="tool-badge__icon" aria-hidden="true"></span>
      </div>
    </div>
  </section>
</template>
