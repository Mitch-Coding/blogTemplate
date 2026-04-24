import { readdirSync, readFileSync } from "node:fs";
import { extname, resolve } from "node:path";

const BLOG_CONTENT_DIR = resolve(process.cwd(), "content/blog");

const toBoolean = (value) => value === "true";
const toNumber = (value) => Number(value);

const normalizeValue = (key, value) => {
  if (key === "pinned") return toBoolean(value);
  if (key === "readingTime") return toNumber(value);
  return value;
};

const parseFrontmatter = (content) => {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  const lines = match[1].split(/\r?\n/);
  const data = {};
  let currentArrayKey = "";

  for (const line of lines) {
    const arrayItemMatch = line.match(/^\s*-\s+(.*)$/);
    if (arrayItemMatch && currentArrayKey) {
      data[currentArrayKey].push(arrayItemMatch[1].trim());
      continue;
    }

    const pairMatch = line.match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/);
    if (!pairMatch) {
      currentArrayKey = "";
      continue;
    }

    const [, key, rawValue] = pairMatch;
    const value = rawValue.trim();
    if (!value) {
      data[key] = [];
      currentArrayKey = key;
      continue;
    }

    data[key] = normalizeValue(key, value);
    currentArrayKey = "";
  }

  return data;
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
