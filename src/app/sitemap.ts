import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { listPublicMusicEntries } from "@/lib/music-entries";
import { getPublicStaticRoutes } from "@/lib/sitemap";
import { listPublishedPosts } from "@/lib/work-posts";
import type { MusicEntryRecord, WorkPostRecord } from "@/types/content";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function toAbsoluteSiteUrl(pathname: string) {
  return new URL(pathname, siteConfig.siteUrl).toString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = await getPublicStaticRoutes();

  const writingRoutes: MetadataRoute.Sitemap = await listPublishedPosts()
    .then((posts) =>
      posts.map((post: WorkPostRecord): MetadataRoute.Sitemap[number] => ({
        url: toAbsoluteSiteUrl(`/writing/${post.slug}`),
        lastModified: new Date(post.updatedAt),
        changeFrequency: "monthly",
        priority: 0.6,
      })),
    )
    .catch(() => []);

  const musicRoutes: MetadataRoute.Sitemap = await listPublicMusicEntries()
    .then((entries) =>
      entries.map((entry: MusicEntryRecord): MetadataRoute.Sitemap[number] => ({
        url: toAbsoluteSiteUrl(`/music/${entry.slug}`),
        lastModified: new Date(entry.updatedAt),
        changeFrequency: "monthly",
        priority: 0.6,
      })),
    )
    .catch(() => []);

  return [...staticRoutes, ...writingRoutes, ...musicRoutes];
}
