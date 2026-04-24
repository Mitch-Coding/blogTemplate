<template>
  <div class="project-modal" id="project-modal" hidden>
    <div class="project-modal__backdrop" data-close="true"></div>
    <div
      class="project-modal__panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <button class="project-modal__close" type="button" aria-label="Close" data-close="true">
        Close
      </button>
      <div class="project-modal__inner">
        <div class="project-modal__face project-modal__face--front" id="project-modal-front"></div>
        <div class="project-modal__face project-modal__face--back">
          <div class="project-modal__mirror" id="project-modal-mirror" aria-hidden="true"></div>
          <div class="project-modal__back-scroll">
            <div class="project-modal__signals" id="project-modal-signals" aria-label="Project signals"></div>
            <div class="project-modal__body">
              <div class="project-modal__copy">
                <p class="eyebrow" id="project-modal-type">Project Type</p>
                <h3 id="project-modal-title">Project</h3>
                <p class="project-modal__description" id="project-modal-description"></p>
              </div>
              <div class="project-modal__media">
                <div class="project-modal__preview" id="project-modal-preview"></div>
              </div>
            </div>
            <div class="project-modal__meta">
              <a href="#" id="project-modal-domain" target="_blank" rel="noreferrer"></a>
              <a href="#" id="project-modal-github" target="_blank" rel="noreferrer"></a>
              <p class="project-modal__meta-note" id="project-modal-github-note"></p>
              <p id="project-modal-meta"></p>
            </div>
            <div class="project-modal__support">
              <button class="project-modal__proof-trigger" type="button" id="project-modal-proof-trigger" hidden>
                查看上线证明
              </button>
            </div>
          </div>
          <div class="project-modal__proof-sheet" id="project-modal-proof-sheet" hidden>
            <div class="project-modal__proof-sheet-backdrop" data-proof-close="true"></div>
            <div class="project-modal__proof-sheet-card">
              <button class="project-modal__proof-dismiss" type="button" data-proof-close="true">
                Back
              </button>
              <p class="eyebrow">Live Signals</p>
              <h4 class="project-modal__proof-heading">上线证明与用户反馈</h4>
              <p class="project-modal__proof-note">补充证据放在这里，不占主预览位置。</p>
              <div class="project-modal__proofs" id="project-modal-proofs"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
