import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { mythosEntries } from "../src/data/mythos";
import { siteConfig } from "../src/data/site";
import { markdownToSanitizedHtml } from "../src/lib/content-utils";

const prisma = new PrismaClient();

function buildSeedMarkdown(title: string, excerpt: string) {
  return `## ${title}\n\n${excerpt}\n\nThis entry was seeded from the original hardcoded dataset. You can now edit and publish it from the admin CRM.`;
}

async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    return;
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.adminUser.create({
    data: {
      email,
      passwordHash,
      role: "admin",
    },
  });
}

async function seedWorkPosts() {
  for (const entry of mythosEntries) {
    const contentMarkdown = buildSeedMarkdown(entry.title, entry.excerpt);
    const contentHtml = markdownToSanitizedHtml(contentMarkdown);

    await prisma.workPost.upsert({
      where: { slug: entry.slug },
      update: {
        title: entry.title,
        excerpt: entry.excerpt,
        contentMarkdown,
        contentHtml,
        tags: entry.tags,
        readTime: entry.readTime,
        archetype: entry.archetype ?? null,
        displayDateSource: "publishedAt",
      },
      create: {
        slug: entry.slug,
        title: entry.title,
        excerpt: entry.excerpt,
        contentMarkdown,
        contentHtml,
        tags: entry.tags,
        readTime: entry.readTime,
        archetype: entry.archetype ?? null,
        displayDateSource: "publishedAt",
        status: "published",
        publishedAt: new Date(entry.date),
      },
    });
  }
}

async function seedMusicEntries() {
  const velvetSwarm = siteConfig.soundcloudTracks?.find((track) => track.title === "The Velvet Swarm");

  if (!velvetSwarm) {
    return;
  }

  const lyricsMarkdown = `## Lyrics\n\nPressure climbs in circles.\n\nThe room starts moving before the mind can name it.\n\nMotion becomes the way back.`;
  const analysisMarkdown = `## What this song is doing\n\nThis groove stays dirty on purpose. It holds pressure, swarm-thinking, panic, and self-recovery in the same body so the release happens through movement instead of explanation.`;

  await prisma.musicEntry.upsert({
    where: { slug: "the-velvet-swarm" },
    update: {
      title: velvetSwarm.title,
      description: "A dirty groove about pressure, swarm-thinking, panic, and self-recovery through motion.",
      soundcloudUrl: velvetSwarm.url,
      soundcloudEmbedUrl: velvetSwarm.embedUrl,
      lyricsMarkdown,
      lyricsHtml: markdownToSanitizedHtml(lyricsMarkdown),
      analysisMarkdown,
      analysisHtml: markdownToSanitizedHtml(analysisMarkdown),
      relatedNotes: ["Mud Groove Drumming", "Kinetic", "Fire Brain"],
    },
    create: {
      slug: "the-velvet-swarm",
      title: velvetSwarm.title,
      description: "A dirty groove about pressure, swarm-thinking, panic, and self-recovery through motion.",
      soundcloudUrl: velvetSwarm.url,
      soundcloudEmbedUrl: velvetSwarm.embedUrl,
      lyricsMarkdown,
      lyricsHtml: markdownToSanitizedHtml(lyricsMarkdown),
      analysisMarkdown,
      analysisHtml: markdownToSanitizedHtml(analysisMarkdown),
      relatedNotes: ["Mud Groove Drumming", "Kinetic", "Fire Brain"],
      status: "published",
      publishedAt: new Date(),
    },
  });
}

async function main() {
  await seedAdminUser();
  await seedWorkPosts();
  await seedMusicEntries();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
