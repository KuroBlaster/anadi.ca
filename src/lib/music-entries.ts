import { PostStatus } from "@prisma/client";
import { siteConfig } from "@/data/site";
import { getPrisma } from "@/lib/prisma";
import { markdownToSanitizedHtml, slugify } from "@/lib/content-utils";
import { normalizeOptionalHttpUrl, normalizeOptionalImageUrl, normalizeRequiredHttpUrl } from "@/lib/media";
import { saveUploadedImageFile } from "@/lib/media-upload";
import { toEmbedUrl } from "@/lib/soundcloud";
import type { MusicEntryRecord } from "@/types/content";

type UpsertMusicEntryInput = {
  title: string;
  slug?: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
  imageFile?: File | null;
  soundcloudUrl: string;
  soundcloudEmbedUrl?: string;
  youtubeUrl?: string;
  lyricsMarkdown: string;
  analysisMarkdown: string;
  relatedNotes: string[];
  isCursed: boolean;
  status: "draft" | "published";
};

function toRecord(entry: {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string | null;
  imageAlt: string | null;
  soundcloudUrl: string;
  soundcloudEmbedUrl: string;
  youtubeUrl: string | null;
  lyricsMarkdown: string;
  lyricsHtml: string;
  analysisMarkdown: string;
  analysisHtml: string;
  relatedNotes: string[];
  isCursed: boolean;
  status: PostStatus;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): MusicEntryRecord {
  return {
    id: entry.id,
    slug: entry.slug,
    title: entry.title,
    description: entry.description,
    imageUrl: entry.imageUrl ?? undefined,
    imageAlt: entry.imageAlt ?? undefined,
    soundcloudUrl: entry.soundcloudUrl,
    soundcloudEmbedUrl: entry.soundcloudEmbedUrl,
    youtubeUrl: entry.youtubeUrl ?? undefined,
    lyricsMarkdown: entry.lyricsMarkdown,
    lyricsHtml: entry.lyricsHtml,
    analysisMarkdown: entry.analysisMarkdown,
    analysisHtml: entry.analysisHtml,
    relatedNotes: entry.relatedNotes,
    isCursed: entry.isCursed,
    status: entry.status,
    publishedAt: entry.publishedAt?.toISOString(),
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  };
}

export function normalizeRelatedNotes(notes: string[]) {
  return notes
    .map((note) => note.trim())
    .filter(Boolean)
    .filter((note, index, arr) => arr.indexOf(note) === index);
}

export function buildFallbackMusicEntries(): MusicEntryRecord[] {
  return (siteConfig.soundcloudTracks ?? []).slice(0, 3).map((track, index) => ({
    id: `fallback-${index}`,
    slug: track.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
    title: track.title,
    description:
      track.title === "The Velvet Swarm"
        ? "A dirty groove about pressure, swarm-thinking, panic, and self-recovery through motion."
        : "A working track from the current cycle, held here until the full song entry is published from the admin backend.",
    soundcloudUrl: track.url,
    soundcloudEmbedUrl: track.embedUrl || toEmbedUrl(track.url),
    youtubeUrl: track.youtubeUrl,
    imageUrl: track.imageUrl,
    imageAlt: track.imageAlt ?? `${track.title} cover image`,
    lyricsMarkdown: "Lyrics will appear here once this song entry is fully published.",
    lyricsHtml: "<p>Lyrics will appear here once this song entry is fully published.</p>",
    analysisMarkdown: "This song entry is using the fallback music source while the full backend entry is being prepared.",
    analysisHtml:
      "<p>This song entry is using the fallback music source while the full backend entry is being prepared.</p>",
    relatedNotes:
      track.title === "The Velvet Swarm" ? ["Mud Groove Drumming", "Kinetic", "Fire Brain"] : [],
    isCursed: false,
    status: "published",
    publishedAt: undefined,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  }));
}

async function shapeMusicEntryInput(input: UpsertMusicEntryInput) {
  const slug = slugify(input.slug?.trim() || input.title);
  const title = input.title.trim();
  const description = input.description.trim();
  const imageAlt = input.imageAlt?.trim() || title;
  const uploadedImageUrl = input.imageFile ? await saveUploadedImageFile(input.imageFile, "music") : null;
  const imageUrl = uploadedImageUrl ?? normalizeOptionalImageUrl(input.imageUrl, "Image URL");
  const soundcloudUrl = normalizeRequiredHttpUrl(input.soundcloudUrl, "SoundCloud URL");
  const lyricsMarkdown = input.lyricsMarkdown.trim();
  const analysisMarkdown = input.analysisMarkdown.trim();

  if (!slug) {
    throw new Error("Slug is required.");
  }
  if (!title) {
    throw new Error("Title is required.");
  }
  if (!description) {
    throw new Error("Description is required.");
  }
  if (!lyricsMarkdown) {
    throw new Error("Lyrics are required.");
  }
  if (!analysisMarkdown) {
    throw new Error("Analysis is required.");
  }

  return {
    slug,
    title,
    description,
    soundcloudUrl,
    imageUrl,
    imageAlt: imageUrl ? imageAlt : null,
    soundcloudEmbedUrl:
      normalizeOptionalHttpUrl(input.soundcloudEmbedUrl, "SoundCloud embed URL") || toEmbedUrl(soundcloudUrl),
    youtubeUrl: normalizeOptionalHttpUrl(input.youtubeUrl, "YouTube URL"),
    lyricsMarkdown,
    lyricsHtml: markdownToSanitizedHtml(lyricsMarkdown),
    analysisMarkdown,
    analysisHtml: markdownToSanitizedHtml(analysisMarkdown),
    relatedNotes: normalizeRelatedNotes(input.relatedNotes),
    isCursed: input.isCursed,
    status: input.status,
    publishedAt: input.status === "published" ? new Date() : null,
  };
}

export async function listPublishedMusicEntries() {
  const prisma = getPrisma();
  const entries = await prisma.musicEntry.findMany({
    where: { status: "published" },
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
  });
  return entries.map(toRecord);
}

export async function listPublicMusicEntries() {
  try {
    const publishedEntries = await listPublishedMusicEntries();
    if (publishedEntries.length > 0) {
      return publishedEntries;
    }
  } catch {
    // fall back to static SoundCloud-backed entries
  }

  return buildFallbackMusicEntries();
}

export async function getPublicMusicEntryBySlug(slug: string) {
  try {
    const publishedEntries = await listPublishedMusicEntries();
    if (publishedEntries.length > 0) {
      return publishedEntries.find((entry: MusicEntryRecord) => entry.slug === slug) ?? null;
    }
  } catch {
    // fall back to static SoundCloud-backed entries
  }

  return buildFallbackMusicEntries().find((entry: MusicEntryRecord) => entry.slug === slug) ?? null;
}

export async function getLatestPublicMusicEntry() {
  const entries = await listPublicMusicEntries();
  return entries[0] ?? null;
}

export async function listAllMusicEntries(query?: string, status?: "draft" | "published" | "all") {
  const prisma = getPrisma();
  const entries = await prisma.musicEntry.findMany({
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
  return entries.map(toRecord);
}

export async function getMusicEntryById(id: string) {
  const prisma = getPrisma();
  const entry = await prisma.musicEntry.findUnique({ where: { id } });
  return entry ? toRecord(entry) : null;
}

export async function createMusicEntry(input: UpsertMusicEntryInput) {
  const prisma = getPrisma();
  const data = await shapeMusicEntryInput(input);
  const entry = await prisma.musicEntry.create({ data });
  return toRecord(entry);
}

export async function updateMusicEntry(id: string, input: UpsertMusicEntryInput) {
  const prisma = getPrisma();
  const data = await shapeMusicEntryInput(input);
  const entry = await prisma.musicEntry.update({
    where: { id },
    data,
  });
  return toRecord(entry);
}

export async function setMusicEntryStatus(id: string, status: "draft" | "published") {
  const prisma = getPrisma();
  const entry = await prisma.musicEntry.update({
    where: { id },
    data: {
      status,
      publishedAt: status === "published" ? new Date() : null,
    },
  });
  return toRecord(entry);
}

export async function deleteMusicEntry(id: string) {
  const prisma = getPrisma();
  await prisma.musicEntry.delete({ where: { id } });
}
