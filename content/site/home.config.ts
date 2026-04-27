import type { HomeContentConfig } from "~/types/home"

export const HOME_PAGE_CONTENT: HomeContentConfig = {
  meta: {
    title: "Example Author",
    description:
      "A comic-inspired portfolio and technical blog starter for a full-stack developer.",
  },
  topbar: {
    brand: "AUTHOR",
    blogHref: "/blog.html",
    blogLabel: "Writing",
    issuesLabel: "Issues",
    navItems: [
      { href: "#about", label: "About" },
      { href: "#skills", label: "Skill Universe" },
      { href: "#projects", label: "Projects" },
      { href: "#contact", label: "Contact" },
    ],
  },
  hero: {
    stickerAriaLabel: "HELLO my name is Example Author",
    scrollLabel: {
      zh: "向下滑动",
      en: "Scroll Down",
    },
  },
  name: {
    eyebrow: "Issue 02 / Name Deconstruction",
    headingPrefix: "AUTHOR",
    summary:
      "FULL-STACK DEVELOPER TEMPLATE. Replace this section with your own positioning, skills, and story.",
    rows: [
      { letter: "A", keyword: "Architecture", translation: "系统架构" },
      { letter: "U", keyword: "Usability", translation: "用户体验" },
      { letter: "T", keyword: "TypeScript", translation: "类型安全" },
      { letter: "H", keyword: "Human-centered", translation: "以人为本" },
      { letter: "O", keyword: "Operations", translation: "稳定运维" },
      { letter: "R", keyword: "Reliability", translation: "可靠交付" },
    ],
  },
  about: {
    eyebrow: "Issue 03 / About Me",
    title: "ABOUT ME",
    promptLines: ["ASK ME", "SOMETHING"],
    facts: [
      {
        label: "What I do",
        body: {
          zh: "Java 后端开发与 AI 应用集成，从接口设计到生产部署全链路参与。",
          en: "Java backend development and AI application integration, end-to-end from API design to production deployment.",
        },
      },
      {
        label: "How I work",
        body: {
          zh: "先稳定核心服务，再做 AI 能力接入，最后优化性能和可观测性。",
          en: "Stabilize core services first, integrate AI capabilities next, then optimize performance and observability.",
        },
      },
      {
        label: "What I care about",
        body: {
          zh: "在意系统稳定性、接口规范、AI 模型落地效果和长期可维护性。",
          en: "I care about system reliability, API standards, AI model effectiveness in production, and long-term maintainability.",
        },
      },
    ],
    assistant: {
      defaultAnswer: {
        zh: "你可以向示例助手询问这个作品集模板的内容。",
        en: "Ask the assistant something about this example portfolio.",
      },
      defaultStatus: {
        zh: "问我点技术活儿的吧，兄弟",
        en: "Bro, ask me some technical questions.",
      },
      emptyQuestion: {
        zh: "先输入一个和示例作品集相关的问题。",
        en: "Enter a question about the example portfolio first.",
      },
      loadingStatus: {
        zh: "助手正在生成回答，只回答和示例资料、技能、项目、合作方式相关的问题。",
        en: "DeepSeek is generating an answer and will stay focused on the example profile, skills, projects, and collaboration style.",
      },
      followUpStatus: {
        zh: "也可以继续换个问法，直接聊我做的项目、技能和合作方式",
        en: "Try another angle if you want. We can keep talking about projects, skills, or how I work.",
      },
      requestError: {
        zh: "小蜘蛛宕机了，已先切回预设回答，过会儿再试试吧",
        en: "The little spider crashed. I've switched back to the preset replies. Try again later, dude.",
      },
      placeholder: {
        zh: "比如：如果我想和你一起做 AI 产品，你会先从哪里开始？",
        en: "For example: if we built an AI product together, where would you start first?",
      },
      askLabel: {
        zh: "Ask something specific",
        en: "Ask something specific",
      },
      askSubmit: {
        zh: "Ask",
        en: "Ask",
      },
      label: {
        zh: "Ask the spider",
        en: "Ask the spider",
      },
      questions: [
        {
          label: {
            zh: "你做过哪些 AI 应用项目？",
            en: "What AI application projects have you worked on?",
          },
          answer: {
            zh: "这是模板示例回答。你可以把这里替换为自己的 AI 应用、内容系统、自动化工具或其他项目经验。",
            en: "This is a sample answer. Replace it with your own AI apps, content systems, automation tools, or other project experience.",
          },
        },
        {
          label: {
            zh: "你常用哪些技术和工具？",
            en: "What tools and technologies do you use most?",
          },
          answer: {
            zh: "示例技术栈包括 Nuxt 3、Vue、TypeScript、Node.js、Spring Boot、MySQL、Redis 和 LLM API。请根据自己的真实技术栈调整。",
            en: "The sample stack includes Nuxt 3, Vue, TypeScript, Node.js, Spring Boot, MySQL, Redis, and LLM APIs. Update this to match your real stack.",
          },
        },
        {
          label: {
            zh: "你想和什么团队一起开发？",
            en: "What kinds of teams do you work best with?",
          },
          answer: {
            zh: "示例作者适合目标清晰、重视工程质量和沟通效率的团队。这里应替换为你真实偏好的协作方式。",
            en: "The example author works best with teams that value clear goals, engineering quality, and practical communication. Replace this with your real collaboration preferences.",
          },
        },
        {
          label: {
            zh: "你如何保证项目稳定落地？",
            en: "How do you ensure projects are delivered reliably?",
          },
          answer: {
            zh: "示例流程是先明确目标和边界，再实现核心路径，最后补齐错误处理、性能、权限、监控和部署验证。",
            en: "The sample process is to clarify goals and boundaries first, implement the core path, then add error handling, performance work, permissions, monitoring, and deployment checks.",
          },
        },
      ],
    },
  },
  skills: {
    eyebrow: "Issue 04 / Skill Universe",
    title: "SKILL UNIVERSE",
  },
  projects: {
    eyebrow: "Issue 05 / Selected Projects",
    title: "SELECTED PROJECTS",
    activeProjectIds: [],
  },
  contact: {
    eyebrow: "Issue 06 / Contact",
    titleLines: ["LET’S", "BUILD", "SOMETHING", "SHARP,", "STRANGE,", "AND", "USEFUL."],
    copy: {
      zh: "这是开源模板的示例联系区域。发布前请替换为你的公开邮箱和社交链接。",
      en: "This is a sample contact area for the open-source starter. Replace it with your public email and social links before publishing your site.",
    },
    statusLabel: "Open To",
    statusItems: [
      {
        zh: "Selective freelance and contract work",
        en: "Selective freelance and contract work",
      },
      {
        zh: "AI product builds and creative web systems",
        en: "AI product builds and creative web systems",
      },
    ],
    statusMeta: "Usually replies within 24 hours",
    calloutAria: {
      zh: "通过邮箱联系我",
      en: "Contact me by email",
    },
    email: "hello@example.com",
    githubUrl: "https://github.com/your-name",
    githubLabel: "github.com/your-name",
    linkedinUrl: "https://www.linkedin.com/in/your-name",
    linkedinLabel: "linkedin.com/in/your-name",
    resumePath: "https://example.com/resume.pdf",
    links: [
      {
        type: "copy",
        key: "mail",
        label: "email",
        value: "hello@example.com",
        href: "",
        copyStatus: "COPIED",
        ariaLabel: {
          zh: "复制邮箱地址",
          en: "Copy email address",
        },
      },
      {
        type: "link",
        key: "github",
        label: "github.com/your-name",
        value: "",
        href: "https://github.com/your-name",
        copyStatus: "",
        ariaLabel: {
          zh: "打开 GitHub",
          en: "Open GitHub",
        },
      },
      {
        type: "copy",
        key: "linkedin",
        label: "LinkedIn / your-name",
        value: "",
        href: "https://www.linkedin.com/in/your-name",
        copyStatus: "COPIED",
        ariaLabel: {
          zh: "打开 LinkedIn",
          en: "Open LinkedIn",
        },
      },
      {
        type: "link",
        key: "resume",
        label: "Resume / PDF",
        value: "",
        href: "https://example.com/resume.pdf",
        copyStatus: "",
        ariaLabel: {
          zh: "打开简历 PDF",
          en: "Open resume PDF",
        },
      },
    ],
  },
}
