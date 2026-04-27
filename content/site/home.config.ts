import type { HomeContentConfig } from "~/types/home"

export const HOME_PAGE_CONTENT: HomeContentConfig = {
  meta: {
    title: "Mitch",
    description:
      "A comic-inspired personal portfolio for Mitch, a Java backend and AI application developer.",
  },
  topbar: {
    brand: "MITCH",
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
    stickerAriaLabel: "HELLO my name is Mitch",
    scrollLabel: {
      zh: "向下滑动",
      en: "Scroll Down",
    },
  },
  name: {
    eyebrow: "Issue 02 / Name Deconstruction",
    headingPrefix: "MITC",
    summary:
      "AI FULL-STACK DEVELOPER. I bring product taste, interaction design, full-stack engineering, and AI workflows into one universe.",
    rows: [
      { letter: "M", keyword: "Microservices", translation: "微服务架构" },
      { letter: "I", keyword: "Intelligence", translation: "AI 智能应用" },
      { letter: "T", keyword: "Technology", translation: "工程技术实践" },
      { letter: "C", keyword: "Cloud", translation: "云端交付部署" },
      { letter: "H", keyword: "High-performance", translation: "高性能后端" },
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
        zh: "快来问问小蜘蛛有关Mitch的问题吧！",
        en: "Ask the spider something about me!",
      },
      defaultStatus: {
        zh: "问我点技术活儿的吧，兄弟",
        en: "Bro, ask me some technical questions.",
      },
      emptyQuestion: {
        zh: "先输入一个和 Mitch 相关的问题，小蜘蛛我再继续回答",
        en: "Enter a question about Mitch first, then I can answer it.",
      },
      loadingStatus: {
        zh: "小蜘蛛正在编织回答，只回答和 Mitch 本人、经历、技能、项目、合作方式相关的问题哦",
        en: "DeepSeek is generating an answer and will stay focused on Mitch, his background, skills, projects, and collaboration style.",
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
            zh: "我主要关注 AI 应用落地，实践过、智能客服、文档解析、Agent 工具调用、业务系统 AI 集成 等方向。我更关注的不只是“调模型接口”，而是如何把 AI 能力和真实业务流程结合起来，形成稳定、可用、可维护的产品能力。",
            en: "I focus on AI application implementation and have experience in intelligent customer service, document parsing, Agent tool calls, and business system AI integration. I'm more concerned with how to combine AI capabilities with real business processes to create stable, usable, and maintainable product features, rather than just 'calling model APIs.'",
          },
        },
        {
          label: {
            zh: "你常用哪些技术和工具？",
            en: "What tools and technologies do you use most?",
          },
          answer: {
            zh: "我主要用 Java 技术栈做后端服务，用大模型技术做 AI 应用落地。后端熟悉 Spring Boot、Redis、MySQL；AI 方向熟悉 OpenAI API、Spring AI、LangChain、向量数据库和 RAG，能把大模型能力接入实际业务场景，比如知识库问答、智能客服和自动化助手。",
            en: "I mainly use the Java technology stack for the backend services and employ large model technology for the implementation of AI applications. I am familiar with Spring Boot, Redis, MySQL, etc. in the backend; in the AI direction, I am proficient in OpenAI API, Spring AI, LangChain, vector databases, and RAG, and can integrate the capabilities of large models into actual business scenarios, such as knowledge base question answering, intelligent customer service, and automated assistants.",
          },
        },
        {
          label: {
            zh: "你想和什么团队一起开发？",
            en: "What kinds of teams do you work best with?",
          },
          answer: {
            zh: "我想我适合需要 后端开发能力、AI 应用集成能力和产品落地意识 的团队。我能参与从需求分析、接口设计、功能开发到部署优化的完整过程，也愿意和产品、前端、算法或业务团队一起推进结果。我关注的不只是完成任务，而是把事情做稳定、做清楚、做得长期可维护。",
            en: "I like working with people who have ideas, judgment, and real execution. Ideally they're willing to communicate and genuinely want to build something meaningful, not just complete a checklist. That crazy-ones energy still matters to me when I choose collaborators.",
          },
        },
        {
          label: {
            zh: "你如何保证项目稳定落地？",
            en: "How do you ensure projects are delivered reliably?",
          },
          answer: {
            zh: "我会先把核心业务流程和边界梳理清楚，再做接口设计、数据结构设计和模块拆分。开发过程中会关注 异常处理、日志、性能、权限、监控、可扩展性和可维护性。对 AI 应用来说，我也会特别关注回答质量、知识库更新、召回效果、失败兜底和人工可干预机制，避免只做一个 Demo。",
            en: "I will first clarify the core business processes and boundaries, then proceed with interface design, data structure design, and module decomposition. During development, I will pay attention to exception handling, logging, performance, permissions, monitoring, scalability, and maintainability. For AI applications, I will also particularly focus on answer quality, knowledge base updates, recall effectiveness, failure fallbacks, and manual intervention mechanisms to avoid creating just a demo.",
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
      zh: "如果你在寻找一个能做稳健 Java 后端、也能把 AI 能力真正落地到产品里的开发者，欢迎联系我。",
      en: "If you want someone who can actually ship the work and still care about interface quality and product feel, we should talk.",
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
    email: "mitch-coding@foxmail.com",
    githubUrl: "https://github.com/Mitch-Coding",
    githubLabel: "github.com/Mitch-Coding",
    wechatId: "xiaomaizhi_Lee",
    resumePath: "/resume/LIJIN_resume.pdf",
    links: [
      {
        type: "copy",
        key: "mail",
        label: "email",
        value: "mitch-coding@foxmail.com",
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
        label: "github.com/Mitch-Coding",
        value: "",
        href: "https://github.com/Mitch-Coding",
        copyStatus: "",
        ariaLabel: {
          zh: "打开 GitHub",
          en: "Open GitHub",
        },
      },
      {
        type: "copy",
        key: "wechat",
        label: "WeChat / xiaomaizhi_Lee",
        value: "xiaomaizhi_Lee",
        href: "",
        copyStatus: "COPIED",
        ariaLabel: {
          zh: "复制微信号",
          en: "Copy WeChat ID",
        },
      },
      {
        type: "link",
        key: "resume",
        label: "Resume / PDF",
        value: "",
        href: "/resume/LIJIN_resume.pdf",
        copyStatus: "",
        ariaLabel: {
          zh: "打开简历 PDF",
          en: "Open resume PDF",
        },
      },
    ],
  },
}
