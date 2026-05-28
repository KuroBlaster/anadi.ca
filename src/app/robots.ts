import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";

const SITE_URL = siteConfig.siteUrl;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/*"],
      },
    ],
    sitemap: new URL("/sitemap.xml", SITE_URL).toString(),
    host: new URL(SITE_URL).host,
  };
}
