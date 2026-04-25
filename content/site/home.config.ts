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
        zh: "问我点真的。",
        en: "Ask something real.",
      },
      emptyQuestion: {
        zh: "先输入一个和 Mitch 相关的问题，我再继续回答。",
        en: "Enter a question about Mitch first, then I can answer it.",
      },
      loadingStatus: {
        zh: "小蜘蛛正在编织回答，只回答和 Mitch 本人、经历、技能、项目、合作方式相关的问题哦。",
        en: "DeepSeek is generating an answer and will stay focused on Mitch, his background, skills, projects, and collaboration style.",
      },
      followUpStatus: {
        zh: "也可以继续换个问法，直接聊我做的项目、技能和合作方式。",
        en: "Try another angle if you want. We can keep talking about projects, skills, or how I work.",
      },
      requestError: {
        zh: "暂时无法连接 DeepSeek，已先切回预设回答。",
        en: "DeepSeek is unavailable right now. Reverted to the default answer.",
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
            zh: "你最想做什么样的项目？",
            en: "What kinds of projects do you most want to build?",
          },
          answer: {
            zh: "我更喜欢做那些有明确个性和记忆点的项目。对我来说，好的产品不是把功能机械拼起来，而是能让人一眼记住、愿意继续用下去。我会更容易被那种有方向感、有表达欲、同时又真的能落地的项目吸引。",
            en: "I'm drawn to projects with a clear identity and a strong memory to them. I don't just want to stack features. I want to build things that people remember quickly and keep using. I'm especially interested in projects that have direction, personality, and real execution behind them.",
          },
        },
        {
          label: {
            zh: "你常用哪些技术和工具？",
            en: "What tools and technologies do you use most?",
          },
          answer: {
            zh: "我更习惯用全栈的方式去做产品，而不是只负责其中一个环节。前端、后端、数据库、AI 接入、部署上线这些部分我都能自己接起来，所以我可以把一个想法从 demo 一路推进到真正可用的版本。比起分得很细，我更擅长把整条链路做完整。",
            en: "I work in a full-stack way instead of owning only one slice of the product. I can connect frontend, backend, databases, AI integration, and deployment myself, which lets me take an idea from demo to something people can actually use. I'm strongest when I can carry the whole chain through.",
          },
        },
        {
          label: {
            zh: "你做产品时最在意什么？",
            en: "What matters most to you when building a product?",
          },
          answer: {
            zh: "我最在意的是一个产品最后能不能成立，而不是只停留在一个好看的想法上。成立意味着逻辑清楚、体验顺畅、细节可靠，也意味着它真的能被用户持续使用。对我来说，完成度和真实可用性比表面的热闹更重要。",
            en: "What matters most to me is whether a product truly holds up in the end, not whether it only starts as an attractive idea. That means the logic is clear, the experience is smooth, the details are reliable, and people can keep using it over time. Real usability and finish matter more to me than surface-level excitement.",
          },
        },
        {
          label: {
            zh: "你想和什么样的人一起做事？",
            en: "What kind of people do you want to work with?",
          },
          answer: {
            zh: "我喜欢和有创造力、有判断力、也有执行力的人一起做事。最好是那种愿意交流、也真的想把事情做成的人，而不是只按部就班地完成任务。像乔布斯说的“the crazy ones”，那种有灵魂、有想法的人会让我很有共鸣。",
            en: "I like working with people who have ideas, judgment, and real execution. Ideally they're willing to communicate and genuinely want to build something meaningful, not just complete a checklist. That crazy-ones energy still matters to me when I choose collaborators.",
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
    resumePath: "/resume/jia-yongshuo-ai-application-developer.pdf",
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
        href: "/resume/jia-yongshuo-ai-application-developer.pdf",
        copyStatus: "",
        ariaLabel: {
          zh: "打开简历 PDF",
          en: "Open resume PDF",
        },
      },
    ],
  },
}
