// 勋章编号仍然对应 DOM 输出上的 `.tool-badge--N`。
// 这些编号不能随意改动，因为 CSS 定位、特例样式和动画逻辑都依赖它们。
export const SKILL_BADGE_IDS: Record<string, number> = Object.freeze({
  SPRING: 1,
  MAVEN: 2,
  APACHE_JMETER: 3,
  UBUNTU: 4,
  CLAUDE_CODE: 5,
  REDIS: 6,
  INTELLIJ_IDEA: 7,
  GIT: 8,
  NODE_JS: 9,
  CODEX: 10,
  OPENAI: 11,
  CLOUDFLARE: 12,
  LINUX: 13,
  GITHUB: 14,
  CURSOR: 15,
  MYSQL: 16,
  LANGCHAIN: 17,
  KEIL5: 18,
})

interface SkillBadgeDefinition {
  id: number
  label: string
  style: string
  extraClasses: readonly string[]
}

const OPEN_SOURCE_SKILL_ICONS = [
  "/skill-icons/git.svg",
  "/skill-icons/github.svg",
  "/skill-icons/simpleicons.svg",
] as const

const OPEN_SOURCE_SKILL_LABELS = [
  "Git",
  "GitHub",
  "Simple Icons",
] as const

const getOpenSourceSkillIndex = (badgeId: number) => (badgeId - 1) % OPEN_SOURCE_SKILL_ICONS.length

const getOpenSourceSkillIconStyle = (badgeId: number) =>
  `--icon: url('${OPEN_SOURCE_SKILL_ICONS[getOpenSourceSkillIndex(badgeId)]}'); --icon-hover: #050505; --icon-size: calc(100% - 0.7rem);`

const getOpenSourceSkillLabel = (badgeId: number) =>
  OPEN_SOURCE_SKILL_LABELS[getOpenSourceSkillIndex(badgeId)]

const createSkillBadgeDefinition = ({
  id,
  label,
  style,
}: {
  id: number
  label: string
  style: string
  extraClasses?: string[]
}): SkillBadgeDefinition =>
  Object.freeze({
    id,
    label: getOpenSourceSkillLabel(id),
    style: `${style} ${getOpenSourceSkillIconStyle(id)}`,
    extraClasses: Object.freeze([]),
  })

// 这里收敛每个 badge 的静态数据入口：
// - 名称文案：同时用于 aria-label / title / data-label
// - 特例 class：继续兼容现有 CSS
// - 内联 style：保持与旧版 HTML 输出一致，避免视觉差异
// 数组顺序刻意保持与旧版 index.html 中节点顺序一致，避免隐含依赖变化。
export const SKILL_BADGES = Object.freeze([
  createSkillBadgeDefinition({
    id: SKILL_BADGE_IDS.SPRING,
    label: "Spring",
    style: "--icon: url('/skill-icons/spring.svg'); --icon-hover: #6db33f; --icon-size: calc(100% - 0.55rem); --badge-hover-bg: rgba(109, 179, 63, 0.1); --badge-hover-border: rgba(109, 179, 63, 0.28);",
  }),
  createSkillBadgeDefinition({
    id: SKILL_BADGE_IDS.KEIL5,
    label: "Keil5",
    style: "--icon: url('/skill-icons/iconKeil5.svg'); --icon-hover: #469456; --badge-hover-bg: rgba(70, 148, 86, 0.1); --badge-hover-border: rgba(70, 148, 86, 0.28);",
  }),
  createSkillBadgeDefinition({
    id: SKILL_BADGE_IDS.MAVEN,
    label: "Maven",
    extraClasses: ["tool-badge--maven-image"],
    style: "--icon: url('/skill-icons/maven.svg'); --icon-hover: #c71a36; --badge-hover-bg: rgba(199, 26, 54, 0.1); --badge-hover-border: rgba(199, 26, 54, 0.28);",
  }),
  createSkillBadgeDefinition({
    id: SKILL_BADGE_IDS.APACHE_JMETER,
    label: "Apache JMeter",
    extraClasses: ["tool-badge--apachejmeter-image"],
    style: "--icon: url('/skill-icons/apachejmeter.svg'); --icon-hover: #d22128;",
  }),
  createSkillBadgeDefinition({
    id: SKILL_BADGE_IDS.UBUNTU,
    label: "Ubuntu",
    style: "--icon: url('/skill-icons/ubuntu1.svg'); --icon-hover: #e95420; --badge-hover-bg: rgba(233, 84, 32, 0.1); --badge-hover-border: rgba(233, 84, 32, 0.28);",
  }),
  createSkillBadgeDefinition({
    id: SKILL_BADGE_IDS.CLAUDE_CODE,
    label: "Claude Code",
    style: "--icon: url('/skill-icons/claude.svg'); --icon-hover: #d97757; --icon-size: calc(100% - 0.5rem); --badge-hover-bg: rgba(217, 119, 87, 0.1); --badge-hover-border: rgba(217, 119, 87, 0.28);",
  }),
  createSkillBadgeDefinition({
    id: SKILL_BADGE_IDS.REDIS,
    label: "redis",
    style: "--icon: url('/skill-icons/redis.svg'); --icon-hover: #eb5444; --badge-hover-bg: rgba(220, 56, 45, 0.1); --badge-hover-border: rgba(220, 56, 45, 0.28);",
  }),
  createSkillBadgeDefinition({
    id: SKILL_BADGE_IDS.INTELLIJ_IDEA,
    label: "IntelliJ IDEA",
    extraClasses: ["tool-badge--label-left"],
    style: "--icon: url('/skill-icons/intellijidea.svg'); --icon-hover: linear-gradient(135deg, #fe315d 0 28%, #f97a12 28% 52%, #fedb00 52% 72%, #21d789 72% 86%, #00aefe 86% 100%); --badge-hover-bg: rgba(79, 32, 137, 0.12); --badge-hover-border: rgba(254, 49, 93, 0.28);",
  }),
  createSkillBadgeDefinition({
    id: SKILL_BADGE_IDS.GIT,
    label: "Git",
    style: "--icon: url('/skill-icons/git.svg'); --icon-hover: #f05032; --badge-hover-bg: rgba(240, 80, 50, 0.1); --badge-hover-border: rgba(240, 80, 50, 0.28);",
  }),
  createSkillBadgeDefinition({
    id: SKILL_BADGE_IDS.NODE_JS,
    label: "Node.js",
    extraClasses: ["tool-badge--label-left"],
    style: "--icon: url('/skill-icons/nodejs.svg'); --icon-hover: #5fa04e; --badge-hover-bg: rgba(95, 160, 78, 0.1); --badge-hover-border: rgba(95, 160, 78, 0.28);",
  }),
  createSkillBadgeDefinition({
    id: SKILL_BADGE_IDS.CODEX,
    label: "Codex",
    extraClasses: ["tool-badge--codex-image"],
    style: "--icon-size: calc(100% - 0.8rem); --badge-hover-bg: rgba(133, 143, 255, 0.12); --badge-hover-border: rgba(158, 164, 255, 0.3);",
  }),
  createSkillBadgeDefinition({
    id: SKILL_BADGE_IDS.OPENAI,
    label: "OpenAI",
    style: "--icon: url('/skill-icons/openai.svg'); --icon-hover: #050505; --badge-hover-bg: #f5f1e8; --badge-hover-border: rgba(245, 241, 232, 0.78);",
  }),
  createSkillBadgeDefinition({
    id: SKILL_BADGE_IDS.CLOUDFLARE,
    label: "Cloudflare",
    extraClasses: ["tool-badge--cloudflare-image"],
    style: "--icon: url('/skill-icons/cloudflare1.svg'); --icon-hover: linear-gradient(180deg, #f38020 0 62%, #faae40 62% 100%); --icon-size: calc(100% - 0.9rem); --badge-hover-bg: linear-gradient(180deg, rgba(243, 128, 32, 0.12) 0%, rgba(250, 174, 64, 0.1) 100%); --badge-hover-border: rgba(243, 128, 32, 0.32);",
  }),
  createSkillBadgeDefinition({
    id: SKILL_BADGE_IDS.LINUX,
    label: "Linux",
    extraClasses: ["tool-badge--linux-image"],
    style: "--icon: url('/skill-icons/linux1.svg'); --badge-hover-bg: rgba(252, 198, 36, 0.1); --badge-hover-border: rgba(252, 198, 36, 0.28);",
  }),
  createSkillBadgeDefinition({
    id: SKILL_BADGE_IDS.LANGCHAIN,
    label: "LangChain",
    style: "--icon: url('/skill-icons/langchain.svg'); --icon-hover: #91c8fa; --badge-hover-bg: rgba(145, 200, 250, 0.1); --badge-hover-border: rgba(145, 200, 250, 0.28);",
  }),
  createSkillBadgeDefinition({
    id: SKILL_BADGE_IDS.GITHUB,
    label: "GitHub",
    extraClasses: ["tool-badge--label-left"],
    style: "--icon: url('/skill-icons/github.svg'); --icon-hover: #050505; --badge-hover-bg: #f5f1e8; --badge-hover-border: rgba(245, 241, 232, 0.78);",
  }),
  createSkillBadgeDefinition({
    id: SKILL_BADGE_IDS.CURSOR,
    label: "Cursor",
    style: "--icon: url('/skill-icons/cursor.svg'); --icon-hover: linear-gradient(180deg, #ffffff 0%, #9ea4ff 100%); --badge-hover-bg: rgba(124, 132, 255, 0.11); --badge-hover-border: rgba(158, 164, 255, 0.3);",
  }),
  createSkillBadgeDefinition({
    id: SKILL_BADGE_IDS.MYSQL,
    label: "MySQL",
    style: "--icon: url('/skill-icons/mysql.svg'); --icon-hover: linear-gradient(135deg, #00758f 0 64%, #f29111 64% 100%); --badge-hover-bg: rgba(0, 117, 143, 0.1); --badge-hover-border: rgba(242, 145, 17, 0.34);",
  }),
])

// 出场顺序使用语义化 key，而不是直接维护难读的数字数组。
// 解析结果仍然保持为原来的编号序列，供现有动画逻辑直接复用。
const SKILL_BADGE_SEQUENCE_KEYS = [
  "UBUNTU",
  "GIT",
  "MAVEN",
  "MYSQL",
  "CLOUDFLARE",
  "CODEX",
  "SPRING",
  "LINUX",
  "LANGCHAIN",
  "GITHUB",
  "REDIS",
  "CURSOR",
  "CLAUDE_CODE",
  "OPENAI",
  "APACHE_JMETER",
  "KEIL5",
  "NODE_JS",
  "INTELLIJ_IDEA",
] as const

export const SKILL_BADGE_SEQUENCE = SKILL_BADGE_SEQUENCE_KEYS.map(
  (badgeKey) => SKILL_BADGE_IDS[badgeKey as keyof typeof SKILL_BADGE_IDS],
)

// 运行时直接按 badge 编号查 reveal 顺位，避免模块内重复构造映射关系。
export const SKILL_BADGE_ORDER = new Map(
  SKILL_BADGE_SEQUENCE.map((badgeNumber, index) => [badgeNumber, index]),
)

// 这里只收敛 reveal 动画中的少量特例参数；
// 图标、hover 色、标签方向、图片类名等静态表现仍由 SKILL_BADGES 输出。
export const SKILL_BADGE_REVEAL_OVERRIDES = Object.freeze({
  [SKILL_BADGE_IDS.CLOUDFLARE]: Object.freeze({
    // Cloudflare 在当前实现里 reveal 更早介入，窗口也更宽。
    lead: Object.freeze({
      desktop: 0.18,
      phone: 0.16,
    }),
    extraWindow: 0.08,
    minimumPopFromIconsProgress: 0.38,
  }),
  [SKILL_BADGE_IDS.KEIL5]: Object.freeze({
    // Keil5 仍保留现有的 pop floor 逻辑，避免滚动过程中过晚显现。
    popFloor: Object.freeze({
      start: 0.52,
      duration: 0.18,
      max: 0.82,
    }),
  }),
})
