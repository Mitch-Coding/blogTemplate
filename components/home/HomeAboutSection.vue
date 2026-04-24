<script setup lang="ts">
import { HOME_PAGE_CONTENT } from "~/content/site/home.config"

const { language } = useSiteLanguage()

const assistantCopy = computed(() => {
  const source = HOME_PAGE_CONTENT.about.assistant
  return {
    label: language.value === "zh" ? source.label.zh : source.label.en,
    askLabel: language.value === "zh" ? source.askLabel.zh : source.askLabel.en,
    askSubmit: language.value === "zh" ? source.askSubmit.zh : source.askSubmit.en,
    defaultAnswer: language.value === "zh" ? source.defaultAnswer.zh : source.defaultAnswer.en,
    defaultStatus: language.value === "zh" ? source.defaultStatus.zh : source.defaultStatus.en,
    emptyQuestion: language.value === "zh" ? source.emptyQuestion.zh : source.emptyQuestion.en,
    loadingStatus: language.value === "zh" ? source.loadingStatus.zh : source.loadingStatus.en,
    followUpStatus: language.value === "zh" ? source.followUpStatus.zh : source.followUpStatus.en,
    requestError: language.value === "zh" ? source.requestError.zh : source.requestError.en,
    placeholder: language.value === "zh" ? source.placeholder.zh : source.placeholder.en,
    questions: source.questions.map((question) => ({
      label: language.value === "zh" ? question.label.zh : question.label.en,
      answer: language.value === "zh" ? question.answer.zh : question.answer.en,
    })),
  }
})

const {
  activeQuestionIndex,
  answer,
  isLoading,
  question,
  selectQuestion,
  status,
  submitQuestion,
} = useHomeAssistant(
  computed(() => assistantCopy.value.defaultAnswer),
  computed(() => ({
    defaultStatus: assistantCopy.value.defaultStatus,
    emptyQuestion: assistantCopy.value.emptyQuestion,
    loadingStatus: assistantCopy.value.loadingStatus,
    followUpStatus: assistantCopy.value.followUpStatus,
    requestError: assistantCopy.value.requestError,
    placeholder: assistantCopy.value.placeholder,
  })),
  computed(() => assistantCopy.value.questions.map((item) => item.answer)),
)
</script>

<template>
  <section class="about-section section-shell issue-section issue-section--about" id="about" data-issue="03">
    <div class="section-bridge" aria-hidden="true">
      <span class="section-bridge__thread"></span>
    </div>
    <div class="section-heading section-heading--split">
      <div>
        <p class="eyebrow">{{ HOME_PAGE_CONTENT.about.eyebrow }}</p>
        <h2>{{ HOME_PAGE_CONTENT.about.title }}</h2>
      </div>
    </div>

    <div class="about-layout">
      <div class="about-visual">
        <div class="about-spider-scene" aria-hidden="true">
          <div class="about-burst">
            <img class="about-burst__art" src="/about-scene-bg.svg" alt="" loading="lazy" decoding="async" />
          </div>

          <div class="about-spider-prompt">
            <img
              class="about-spider-prompt__art"
              src="/about-spider-prompt.png"
              alt=""
              loading="lazy"
              decoding="async"
            />
            <span class="about-spider-prompt__text">
              <span
                v-for="line in HOME_PAGE_CONTENT.about.promptLines"
                :key="line"
                class="about-spider-prompt__line"
              >
                {{ line }}
              </span>
            </span>
          </div>

          <div class="about-spider-shell">
            <img class="about-spider" src="/about-spider.svg" alt="" loading="lazy" decoding="async" />
          </div>
        </div>
        <p class="about-ghost" aria-hidden="true">
          <span class="about-ghost-line">
            <span class="about-ghost-letter">A</span>
            <span class="about-ghost-letter">B</span>
            <span class="about-ghost-letter">O</span>
            <span class="about-ghost-letter">U</span>
            <span class="about-ghost-letter">T</span>
          </span>
          <span class="about-ghost-line">
            <span class="about-ghost-letter">M</span>
            <span class="about-ghost-letter">E</span>
          </span>
        </p>
      </div>

      <div class="about-panel">
        <div class="assistant-console">
          <p class="assistant-console__label">{{ assistantCopy.label }}</p>
          <div class="assistant-answer" id="assistant-answer" :class="{ 'is-loading': isLoading }">
            {{ answer }}
          </div>
          <div class="question-grid" role="list">
            <button
              v-for="(item, index) in assistantCopy.questions"
              :key="item.label"
              type="button"
              class="question-chip"
              :class="{ 'is-active': activeQuestionIndex === index }"
              @click="selectQuestion(index, item.answer)"
            >
              {{ item.label }}
            </button>
          </div>
          <form class="assistant-ask" id="assistant-ask-form" @submit.prevent="submitQuestion">
            <label class="assistant-ask__label" for="assistant-question">{{ assistantCopy.askLabel }}</label>
            <div class="assistant-ask__controls">
              <input
                id="assistant-question"
                v-model="question"
                class="assistant-ask__input"
                name="question"
                type="text"
                maxlength="180"
                autocomplete="off"
                :placeholder="assistantCopy.placeholder"
              />
              <button class="assistant-ask__submit" id="assistant-ask-submit" type="submit" :disabled="isLoading">
                {{ assistantCopy.askSubmit }}
              </button>
            </div>
            <p class="assistant-ask__status" id="assistant-status">{{ status }}</p>
          </form>
        </div>

        <div class="about-facts">
          <article v-for="fact in HOME_PAGE_CONTENT.about.facts" :key="fact.label">
            <p class="fact-label">{{ fact.label }}</p>
            <p>{{ language === 'zh' ? fact.body.zh : fact.body.en }}</p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>
