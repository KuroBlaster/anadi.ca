import fs from "node:fs/promises";
import path from "node:path";
import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";

const SITE_URL = siteConfig.siteUrl;
const APP_DIR = path.join(process.cwd(), "src", "app");

const STATIC_ROUTE_META: Record<
  string,
  {
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }
> = {
  "/": { changeFrequency: "weekly", priority: 1 },
  "/about": { changeFrequency: "monthly", priority: 0.9 },
  "/anadi-mishra": { changeFrequency: "monthly", priority: 1 },
  "/creative-systems": { changeFrequency: "monthly", priority: 0.95 },
  "/music": { changeFrequency: "weekly", priority: 0.9 },
  "/writing": { changeFrequency: "weekly", priority: 0.9 },
  "/contact": { changeFrequency: "monthly", priority: 0.7 },
};

function shouldSkipSegment(segment: string) {
  return (
    segment === "admin" ||
    segment === "works" ||
    segment === "selected-work" ||
    segment.startsWith("[") ||
    segment.startsWith("(") ||
    segment.startsWith("@")
  );
}

function toRoutePath(segments: string[]) {
  return segments.length > 0 ? `/${segments.join("/")}` : "/";
}

async function walkPublicPages(dir: string, segments: string[] = []): Promise<MetadataRoute.Sitemap> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const routes: MetadataRoute.Sitemap = [];

  for (const entry of entries) {
    const nextSegments = [...segments, entry.name];

    if (entry.isDirectory()) {
      if (nextSegments.some(shouldSkipSegment)) {
        continue;
      }

      routes.push(...(await walkPublicPages(path.join(dir, entry.name), nextSegments)));
      continue;
    }

    if (entry.isFile() && entry.name === "page.tsx") {
      const routePath = toRoutePath(segments);
      const meta = STATIC_ROUTE_META[routePath];
      const fullPath = path.join(dir, entry.name);
      const stats = await fs.stat(fullPath);

      routes.push({
        url: `${SITE_URL}${routePath}`,
        lastModified: stats.mtime,
        changeFrequency: meta?.changeFrequency ?? "monthly",
        priority: meta?.priority ?? 0.5,
      });
    }
  }

  return routes;
}

export async function getPublicStaticRoutes(): Promise<MetadataRoute.Sitemap> {
  try {
    const routes = await walkPublicPages(APP_DIR);
    return routes.sort((left, right) => left.url.localeCompare(right.url));
  } catch {
    return [];
  }
}
