import { PostStatus } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { computeExcerpt, computeReadTime, markdownToSanitizedHtml, slugify } from "@/lib/content-utils";
import { normalizeOptionalHttpUrl, normalizeOptionalImageUrl } from "@/lib/media";
import { saveUploadedImageFile } from "@/lib/media-upload";
import type {
  FieldNote,
  WorkCategory,
  WorkItem,
  WorkPostDateSource,
  WorkPostRecord,
} from "@/types/content";

const WORK_POST_DATE_SOURCES: WorkPostDateSource[] = ["publishedAt", "createdAt", "updatedAt"];

type UpsertPostInput = {
  title: string;
  slug?: string;
  excerpt?: string;
  imageUrl?: string;
  imageAlt?: string;
  imageFile?: File | null;
  youtubeUrl?: string;
  contentMarkdown: string;
  tags: string[];
  readTime?: string;
  archetype?: string;
  isHomepageFeatured: boolean;
  isSelectedWorkFeatured: boolean;
  isCursed: boolean;
  status: "draft" | "published";
  displayDateSource: WorkPostDateSource;
};

function toRecord(post: {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string | null;
  imageAlt: string | null;
  youtubeUrl: string | null;
  contentMarkdown: string;
  contentHtml: string;
  tags: string[];
  readTime: string;
  archetype: string | null;
  isHomepageFeatured: boolean;
  isSelectedWorkFeatured: boolean;
  isCursed: boolean;
  status: PostStatus;
  displayDateSource: WorkPostDateSource;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): WorkPostRecord {
  const displayDate = resolveWorkPostDisplayDate(post);

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    imageUrl: post.imageUrl ?? undefined,
    imageAlt: post.imageAlt ?? undefined,
    youtubeUrl: post.youtubeUrl ?? undefined,
    contentMarkdown: post.contentMarkdown,
    contentHtml: post.contentHtml,
    tags: post.tags,
    readTime: post.readTime,
    archetype: post.archetype ?? undefined,
    isHomepageFeatured: post.isHomepageFeatured,
    isSelectedWorkFeatured: post.isSelectedWorkFeatured,
    isCursed: post.isCursed,
    status: post.status,
    displayDateSource: post.displayDateSource,
    displayDate: displayDate.toISOString(),
    publishedAt: post.publishedAt?.toISOString(),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };
}

export function toFieldNoteView(post: WorkPostRecord): FieldNote {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.displayDate,
    imageUrl: post.imageUrl ?? undefined,
    imageAlt: post.imageAlt ?? undefined,
    tags: post.tags,
    readTime: post.readTime,
    archetype: post.archetype,
    isCursed: post.isCursed,
  };
}

export function normalizeWorkPostDateSource(value: string | null | undefined): WorkPostDateSource {
  if (WORK_POST_DATE_SOURCES.includes(value as WorkPostDateSource)) {
    return value as WorkPostDateSource;
  }

  return "publishedAt";
}

function resolveWorkPostDisplayDate(post: {
  displayDateSource: WorkPostDateSource;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  switch (post.displayDateSource) {
    case "createdAt":
      return post.createdAt;
    case "updatedAt":
      return post.updatedAt;
    default:
      return post.publishedAt ?? post.createdAt;
  }
}

export function normalizeTags(tags: string[]) {
  return tags
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean)
    .filter((tag, index, arr) => arr.indexOf(tag) === index);
}

async function shapePostInput(input: UpsertPostInput) {
  const markdown = input.contentMarkdown.trim();
  const excerpt = input.excerpt?.trim() || computeExcerpt(markdown);
  const readTime = input.readTime?.trim() || computeReadTime(markdown);
  const slug = slugify(input.slug?.trim() || input.title);
  const imageAlt = input.imageAlt?.trim() || input.title.trim();
  const uploadedImageUrl = input.imageFile ? await saveUploadedImageFile(input.imageFile, "works") : null;
  const imageUrl = uploadedImageUrl ?? normalizeOptionalImageUrl(input.imageUrl, "Image URL");
  const youtubeUrl = normalizeOptionalHttpUrl(input.youtubeUrl, "YouTube URL");

  if (!slug) {
    throw new Error("Slug is required.");
  }
  if (!input.title.trim()) {
    throw new Error("Title is required.");
  }
  if (!markdown) {
    throw new Error("Content is required.");
  }

  return {
    title: input.title.trim(),
    slug,
    excerpt,
    imageUrl,
    imageAlt: imageUrl ? imageAlt : null,
    youtubeUrl,
    contentMarkdown: markdown,
    contentHtml: markdownToSanitizedHtml(markdown),
    tags: normalizeTags(input.tags),
    readTime,
    archetype: input.archetype?.trim() || null,
    isHomepageFeatured: input.isHomepageFeatured,
    isSelectedWorkFeatured: input.isSelectedWorkFeatured,
    isCursed: input.isCursed,
    status: input.status,
    displayDateSource: input.displayDateSource,
  };
}

function deriveCategory(tags: string[]): WorkCategory {
  const normalizedTags = tags.map((tag) => tag.toLowerCase());

  if (normalizedTags.some((tag) => ["music", "song", "sound", "track", "album"].includes(tag))) {
    return "Music";
  }
  if (normalizedTags.some((tag) => ["systems", "system", "workflow", "framework", "process", "practice"].includes(tag))) {
    return "Systems";
  }
  if (normalizedTags.some((tag) => ["project", "projects", "design", "travel", "mythos", "philosophy"].includes(tag))) {
    return "Projects";
  }

  return "Writing";
}

function toTagLabel(tags: string[]) {
  const [firstTag] = tags;
  if (!firstTag) {
    return "Work";
  }

  return firstTag
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function toHomepageWorkItem(post: WorkPostRecord): WorkItem {
  return {
    id: post.id,
    title: post.title,
    category: deriveCategory(post.tags),
    description: post.excerpt,
    tag: toTagLabel(post.tags),
    link: `/writing/${post.slug}`,
    isCursed: post.isCursed,
  };
}

export async function listPublishedPosts() {
  const prisma = getPrisma();
  const posts = await prisma.workPost.findMany({
    where: { status: "published" },
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
  });
  return posts.map(toRecord);
}

export async function listHomepageFeaturedPosts() {
  const prisma = getPrisma();
  const featuredPosts = await prisma.workPost.findMany({
    where: { status: "published", isHomepageFeatured: true },
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
    take: 3,
  });

  if (featuredPosts.length > 0) {
    return featuredPosts.map(toRecord);
  }

  const fallbackPosts = await prisma.workPost.findMany({
    where: { status: "published" },
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
    take: 3,
  });

  return fallbackPosts.map(toRecord);
}

export async function listSelectedWorkFeaturedPosts() {
  const prisma = getPrisma();
  const featuredPosts = await prisma.workPost.findMany({
    where: { status: "published", isSelectedWorkFeatured: true },
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
    take: 3,
  });

  return featuredPosts.map(toRecord);
}

export async function getPublishedPostBySlug(slug: string) {
  const prisma = getPrisma();
  const post = await prisma.workPost.findFirst({
    where: { slug, status: "published" },
  });
  return post ? toRecord(post) : null;
}

export async function listAllPosts(query?: string, status?: "draft" | "published" | "all") {
  const prisma = getPrisma();
  const posts = await prisma.workPost.findMany({
    where: {
      status: status && status !== "all" ? status : undefined,
      OR: query
        ? [
            { title: { contains: query, mode: "insensitive" } },
            { slug: { contains: query, mode: "insensitive" } },
          ]
        : undefined,
    },
    orderBy: [{ updatedAt: "desc" }],
  });
  return posts.map(toRecord);
}

export async function getPostById(id: string) {
  const prisma = getPrisma();
  const post = await prisma.workPost.findUnique({ where: { id } });
  return post ? toRecord(post) : null;
}

export async function createPost(input: UpsertPostInput) {
  const prisma = getPrisma();
  const data = await shapePostInput(input);
  const post = await prisma.workPost.create({
    data: {
      ...data,
      publishedAt: input.status === "published" ? new Date() : null,
    },
  });
  return toRecord(post);
}

export async function updatePost(id: string, input: UpsertPostInput) {
  const prisma = getPrisma();
  const data = await shapePostInput(input);
  const existing = await prisma.workPost.findUnique({
    where: { id },
    select: { publishedAt: true },
  });
  const post = await prisma.workPost.update({
    where: { id },
    data: {
      ...data,
      publishedAt: existing?.publishedAt ?? (input.status === "published" ? new Date() : null),
    },
  });
  return toRecord(post);
}

export async function setStatus(id: string, status: "draft" | "published") {
  const prisma = getPrisma();
  const existing = await prisma.workPost.findUnique({
    where: { id },
    select: { publishedAt: true },
  });
  const post = await prisma.workPost.update({
    where: { id },
    data: {
      status,
      publishedAt: existing?.publishedAt ?? (status === "published" ? new Date() : null),
    },
  });
  return toRecord(post);
}

export async function deletePost(id: string) {
  const prisma = getPrisma();
  await prisma.workPost.delete({ where: { id } });
}
