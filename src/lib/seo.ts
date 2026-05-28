import type { Metadata } from "next";
import defaultPortraitImage from "@/assets/anadi_portrait.png";
import { siteConfig } from "@/data/site";

type MetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  imageAlt?: string;
  type?: "website" | "profile" | "article";
  twitterCard?: "summary" | "summary_large_image";
};

type BreadcrumbItem = {
  name: string;
  path: string;
};

type SchemaEntityValue = string | { [key: string]: unknown };

type PersonInput = {
  name?: string;
  url?: string;
  sameAs?: Array<string | null | undefined>;
  jobTitle?: string;
  image?: string;
  alternateName?: string | string[];
  email?: string;
  alumniOf?: SchemaEntityValue;
  address?: SchemaEntityValue;
  knowsAbout?: string[];
};

type PersonEntityInput = {
  name?: string;
  url?: string;
  image?: string;
  alternateName?: string | string[];
  email?: string;
  alumniOf?: SchemaEntityValue;
  address?: SchemaEntityValue;
  knowsAbout?: string[];
};

type CreativeWorkAuthorInput = {
  name: string;
  url: string;
};

type ArticleSchemaInput = {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  author: CreativeWorkAuthorInput;
  image?: string;
  keywords?: string[];
};

type VideoObjectSchemaInput = {
  title: string;
  description: string;
  url: string;
  contentUrl?: string;
  embedUrl?: string;
  thumbnailUrl?: string;
  uploadDate: string;
  author: CreativeWorkAuthorInput;
};

type AudioObjectSchemaInput = {
  title: string;
  description: string;
  url: string;
  embedUrl?: string;
  contentUrl?: string;
  thumbnailUrl?: string;
  datePublished?: string;
  author: CreativeWorkAuthorInput;
};

type MusicRecordingSchemaInput = {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  byArtist: CreativeWorkAuthorInput;
  video?: {
    [key: string]: unknown;
  };
};

const baseKeywords = [
  siteConfig.fullName,
  siteConfig.brandName,
  siteConfig.legacyName,
  "Anadi Mishra",
  siteConfig.artistAlias,
  "Zhango Mishra",
  "Vancouver, British Columbia, Canada",
  "British Columbia Institute of Technology",
  "BCIT",
  "Predictive Analytics",
  "PHP",
  "Laravel",
  "JavaScript",
  "HTML/CSS",
  "web systems development",
  "digital systems architecture",
  "digital marketing",
  "creative systems",
  "official website",
  "writer",
  "musician",
  "developer",
  "philosopher",
  "entrepreneur",
  "systems builder",
  "Globalduniya Canada",
  "Travel Whisky",
  siteConfig.travelCompanyName,
].filter(Boolean) as string[];

export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.siteUrl).toString();
}

const websiteId = absoluteUrl("/#website");
const personId = absoluteUrl("/anadi-mishra#person");

function resolveSchemaUrl(url: string) {
  return url.startsWith("/") ? absoluteUrl(url) : url;
}

export function createSchemaReference(id: string) {
  return {
    "@id": id,
  };
}

function dedupeUrls(urls: Array<string | null | undefined>) {
  return [...new Set(urls.map((url) => url?.trim()).filter((url): url is string => Boolean(url)))];
}

export function createPersonEntity(input: PersonEntityInput = {}) {
  const person = {
    "@type": "Person",
    "@id": personId,
    name: input.name ?? siteConfig.fullName,
    url: resolveSchemaUrl(input.url ?? "/anadi-mishra"),
    ...(input.alternateName ? { alternateName: input.alternateName } : {}),
    ...(input.email ? { email: input.email } : {}),
    ...(input.alumniOf ? { alumniOf: input.alumniOf } : {}),
    ...(input.address ? { address: input.address } : {}),
    ...(input.knowsAbout && input.knowsAbout.length > 0 ? { knowsAbout: input.knowsAbout } : {}),
  };

  return {
    ...person,
    ...(input.image ? { image: resolveSchemaUrl(input.image) } : {}),
  };
}

export function createPersonSchema(input: PersonInput = {}) {
  const sameAs = dedupeUrls(input.sameAs ?? []);

  return {
    "@context": "https://schema.org",
    ...createPersonEntity(input),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    jobTitle: input.jobTitle ?? siteConfig.position,
    ...(input.image ? { image: resolveSchemaUrl(input.image) } : {}),
  };
}

export function createArticleSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
  author,
  image,
  keywords,
}: ArticleSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${resolveSchemaUrl(url)}#article`,
    name: title,
    headline: title,
    description,
    url: resolveSchemaUrl(url),
    datePublished,
    ...(dateModified ? { dateModified } : {}),
    author: createPersonEntity(author),
    publisher: createPersonEntity(author),
    mainEntityOfPage: createSchemaReference(`${resolveSchemaUrl(url)}#webpage`),
    ...(image ? { image: resolveSchemaUrl(image) } : {}),
    ...(keywords && keywords.length > 0 ? { keywords: keywords.join(", ") } : {}),
  };
}

export function createVideoObjectSchema({
  title,
  description,
  url,
  contentUrl,
  embedUrl,
  thumbnailUrl,
  uploadDate,
  author,
}: VideoObjectSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "@id": `${resolveSchemaUrl(url)}#video`,
    name: title,
    description,
    url: resolveSchemaUrl(url),
    uploadDate,
    contentUrl: contentUrl ? resolveSchemaUrl(contentUrl) : resolveSchemaUrl(url),
    ...(embedUrl ? { embedUrl: resolveSchemaUrl(embedUrl) } : {}),
    ...(thumbnailUrl ? { thumbnailUrl: resolveSchemaUrl(thumbnailUrl) } : {}),
    author: createPersonEntity(author),
    publisher: createPersonEntity(author),
    mainEntityOfPage: createSchemaReference(`${resolveSchemaUrl(url)}#webpage`),
  };
}

export function createAudioObjectSchema({
  title,
  description,
  url,
  embedUrl,
  contentUrl,
  thumbnailUrl,
  datePublished,
  author,
}: AudioObjectSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "AudioObject",
    "@id": `${resolveSchemaUrl(url)}#audio`,
    name: title,
    description,
    url: resolveSchemaUrl(url),
    ...(datePublished ? { datePublished } : {}),
    contentUrl: contentUrl ? resolveSchemaUrl(contentUrl) : resolveSchemaUrl(url),
    ...(embedUrl ? { embedUrl: resolveSchemaUrl(embedUrl) } : {}),
    ...(thumbnailUrl ? { thumbnailUrl: resolveSchemaUrl(thumbnailUrl) } : {}),
    author: createPersonEntity(author),
    publisher: createPersonEntity(author),
    mainEntityOfPage: createSchemaReference(`${resolveSchemaUrl(url)}#webpage`),
  };
}

export function createMusicRecordingSchema({
  title,
  description,
  url,
  image,
  datePublished,
  byArtist,
  video,
}: MusicRecordingSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    "@id": `${resolveSchemaUrl(url)}#music-recording`,
    name: title,
    description,
    ...(datePublished ? { datePublished } : {}),
    url: resolveSchemaUrl(url),
    ...(image ? { image: resolveSchemaUrl(image) } : {}),
    byArtist: createPersonEntity(byArtist),
    publisher: createPersonEntity(byArtist),
    mainEntityOfPage: createSchemaReference(`${resolveSchemaUrl(url)}#webpage`),
    ...(video ? { video } : {}),
  };
}

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
  image,
  imageAlt,
  type = "website",
  twitterCard = "summary_large_image",
}: MetadataInput): Metadata {
  const url = absoluteUrl(path);
  const mergedKeywords = [...new Set([...baseKeywords, ...keywords])];
  const resolvedImage = absoluteUrl(image ?? defaultPortraitImage.src);
  const resolvedImageAlt = imageAlt ?? `${siteConfig.fullName} official website`;

  return {
    title,
    description,
    keywords: mergedKeywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type,
      siteName: siteConfig.brandName,
      locale: "en_CA",
      images: [
        {
          url: resolvedImage,
          width: 1200,
          height: 630,
          alt: resolvedImageAlt,
        },
      ],
    },
    twitter: {
      card: twitterCard,
      title,
      description,
      images: [resolvedImage],
    },
  };
}

export function createWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    name: siteConfig.fullName,
    alternateName: [siteConfig.brandName, siteConfig.legacyName, siteConfig.artistAlias].filter(Boolean),
    url: siteConfig.siteUrl,
    description: "The personal site of Anadi Mishra, a Vancouver-based systems builder, writer, developer, and creative practitioner.",
    about: createSchemaReference(personId),
    publisher: createSchemaReference(personId),
  };
}

export function createWebPageSchema(input: {
  path: string;
  title: string;
  description: string;
  type?: string;
  mainEntity?: {
    [key: string]: unknown;
  };
}) {
  const pageId = `${absoluteUrl(input.path)}#webpage`;
  return {
    "@context": "https://schema.org",
    "@type": input.type ?? "WebPage",
    "@id": pageId,
    name: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    ...(input.mainEntity ? { mainEntity: input.mainEntity } : {}),
    isPartOf: createSchemaReference(websiteId),
    about: createSchemaReference(personId),
  };
}

export function createBreadcrumbSchema(items: BreadcrumbItem[]) {
  const breadcrumbId = `${absoluteUrl(items[items.length - 1]?.path ?? "/")}#breadcrumb`;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": breadcrumbId,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
