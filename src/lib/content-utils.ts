import sanitizeHtml from "sanitize-html";
import { marked } from "marked";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function stripMarkdown(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/[#>*_~\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function computeReadTime(markdown: string) {
  const wordCount = stripMarkdown(markdown).split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} min`;
}

export function computeExcerpt(markdown: string) {
  const plain = stripMarkdown(markdown);
  if (plain.length <= 180) {
    return plain;
  }
  return `${plain.slice(0, 177).trimEnd()}...`;
}

export function markdownToSanitizedHtml(markdown: string) {
  const rawHtml = marked.parse(markdown, { breaks: true }) as string;
  return sanitizeHtml(rawHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["h1", "h2", "h3", "img"]),
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt"],
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });
}
