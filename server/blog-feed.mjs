import { readdirSync, readFileSync } from "node:fs";
import { extname, resolve } from "node:path";
import matter from "gray-matter";

const BLOG_CONTENT_DIR = resolve(process.cwd(), "content/blog");

// Blog feed frontmatter is parsed as standard YAML between `---` delimiters.
// Supported values should match content.config.ts: string scalar fields, string
// arrays for tags, numeric readingTime, boolean pinned, and YAML multiline
// strings. YAML syntax rules still apply, so ambiguous values such as strings
// containing `: ` should be quoted.
const toDateString = (value) => {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return `${value}`;
};

const toStringArray = (value) => {
  if (!Array.isArray(value)) return [];
  return value.map((item) => `${item}`);
};

const parseFrontmatter = (content) => {
  const { data } = matter(content);

  return {
    slug: data.slug ? `${data.slug}` : "",
    title: data.title ? `${data.title}` : "",
    excerpt: data.excerpt ? `${data.excerpt}` : "",
    description: data.description ? `${data.description}` : "",
    category: data.category ? `${data.category}` : "",
    tags: toStringArray(data.tags),
    date: data.date ? toDateString(data.date) : "",
    readingTime: Number(data.readingTime),
    pinned: data.pinned === true,
  };
};

export const getBlogFeedEntries = () =>
  readdirSync(BLOG_CONTENT_DIR)
    .filter((filename) => extname(filename) === ".md")
    .map((filename) => {
      const raw = readFileSync(resolve(BLOG_CONTENT_DIR, filename), "utf8");
      return parseFrontmatter(raw);
    })
    .filter((post) => post.slug && post.title && post.date)
    .sort((left, right) => `${right.date}`.localeCompare(`${left.date}`));
