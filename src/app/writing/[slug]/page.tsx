import type { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { EntryImage } from "@/components/content/entry-image";
import { YouTubeEmbed } from "@/components/content/youtube-embed";
import { CursedSeriesGate } from "@/components/content/cursed-series-gate";
import { ShareWidget } from "@/components/content/share-widget";
import defaultPortraitImage from "@/assets/anadi_portrait.png";
import { siteConfig } from "@/data/site";
import { CURSED_SERIES_COOKIE, buildCursedSeriesKey, hasCursedSeriesConsent } from "@/lib/cursed-series";
import { getPublishedPostBySlug, listPublishedPosts } from "@/lib/work-posts";
import { toYouTubeEmbedUrl, toYouTubeThumbnailUrl } from "@/lib/media";
import {
  absoluteUrl,
  createArticleSchema,
  createBreadcrumbSchema,
  createPageMetadata,
  createSchemaReference,
  createVideoObjectSchema,
  createWebPageSchema,
} from "@/lib/seo";
import type { WorkPostRecord } from "@/types/content";

type NotePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const posts = await listPublishedPosts();
    return posts.map((post: WorkPostRecord) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { slug } = await params;
  const dbPost = await getPublishedPostBySlug(slug);

  if (!dbPost) {
    return {
      title: "404 Not Found",
      description: "The requested writing could not be found.",
    };
  }

  const note = {
    slug: dbPost.slug,
    title: dbPost.title,
    excerpt: dbPost.excerpt,
    date: dbPost.displayDate,
    imageUrl: dbPost.imageUrl,
    imageAlt: dbPost.imageAlt,
    youtubeUrl: dbPost.youtubeUrl,
    tags: dbPost.tags,
    readTime: dbPost.readTime,
    archetype: dbPost.archetype,
  };
  const articleImage = note.imageUrl ? absoluteUrl(note.imageUrl) : absoluteUrl(defaultPortraitImage.src);

  return {
    ...createPageMetadata({
      title: `${note.title} - Writing by Anadi Mishra`,
      description: note.excerpt,
      path: `/writing/${note.slug}`,
      keywords: [
        ...new Set([
          ...note.tags,
          "Anadi Mishra essays",
          "creative nonfiction",
          "philosophical prose",
          "personal essay writer",
          "Vancouver writer musician",
        ]),
      ],
      type: "article",
      image: note.imageUrl,
      imageAlt: note.imageAlt ?? note.title,
    }),
    openGraph: {
      title: `${note.title} - Writing by Anadi Mishra`,
      description: note.excerpt,
      url: absoluteUrl(`/writing/${note.slug}`),
      type: "article",
      publishedTime: new Date(note.date).toISOString(),
      tags: note.tags,
      siteName: siteConfig.brandName,
      locale: "en_CA",
      images: [
        {
          url: articleImage,
          width: 1200,
          height: 630,
          alt: note.imageAlt ?? `${note.title} by Anadi Mishra`,
        },
      ],
    },
  };
}

export default async function WritingDetailPage({ params }: NotePageProps) {
  const { slug } = await params;
  const dbPost = await getPublishedPostBySlug(slug);

  if (!dbPost) {
    notFound();
  }

  const note = {
    slug: dbPost.slug,
    title: dbPost.title,
    excerpt: dbPost.excerpt,
    date: dbPost.displayDate,
    imageUrl: dbPost.imageUrl,
    imageAlt: dbPost.imageAlt,
    youtubeUrl: dbPost.youtubeUrl,
    tags: dbPost.tags,
    readTime: dbPost.readTime,
    archetype: dbPost.archetype,
    isCursed: dbPost.isCursed,
  };
  const cursedKey = buildCursedSeriesKey("works", note.slug);
  const cookieStore = await cookies();
  const cursedConsent = cookieStore.get(CURSED_SERIES_COOKIE)?.value;
  const hasAccess = !note.isCursed || hasCursedSeriesConsent(cursedConsent, cursedKey);
  const articleImage = note.imageUrl ? absoluteUrl(note.imageUrl) : absoluteUrl(defaultPortraitImage.src);
  const videoEmbedUrl = note.youtubeUrl ? toYouTubeEmbedUrl(note.youtubeUrl) : null;
  const articleStructuredData = createArticleSchema({
    url: `/writing/${note.slug}`,
    title: note.title,
    description: note.excerpt,
    datePublished: new Date(note.date).toISOString(),
    dateModified: new Date(dbPost.updatedAt).toISOString(),
    image: articleImage,
    keywords: note.tags,
    author: {
      name: siteConfig.fullName,
      url: "/anadi-mishra",
    },
  });
  const videoStructuredData =
    note.slug === "the-wanderers-compass" && note.youtubeUrl && videoEmbedUrl
      ? createVideoObjectSchema({
          url: `/writing/${note.slug}`,
          title: note.title,
          description: note.excerpt,
          contentUrl: note.youtubeUrl,
          embedUrl: videoEmbedUrl,
          uploadDate: new Date(note.date).toISOString(),
          thumbnailUrl: toYouTubeThumbnailUrl(note.youtubeUrl) ?? articleImage,
          author: {
            name: siteConfig.fullName,
            url: "/anadi-mishra",
          },
        })
      : null;
  const pageStructuredData = createWebPageSchema({
    path: `/writing/${note.slug}`,
    title: note.title,
    description: note.excerpt,
    mainEntity: createSchemaReference(absoluteUrl(`/writing/${note.slug}#article`)),
  });
  const breadcrumbStructuredData = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Writing", path: "/writing" },
    { name: note.title, path: `/writing/${note.slug}` },
  ]);

  return (
    <Container className="py-16 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
      />
      {videoStructuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoStructuredData) }}
        />
      ) : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      {hasAccess ? (
        <article className="mx-auto max-w-3xl">
          {note.isCursed ? (
            <p className="mt-3 inline-flex rounded-full border border-[#5f2732]/70 bg-[#3a1017] px-3 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              Cursed Series
            </p>
          ) : null}
          <h1 className="mt-4 font-display text-4xl leading-tight tracking-[0.02em] text-ink sm:text-5xl">{note.title}</h1>
          <p className="mt-4 text-base leading-8 text-ink-soft">{note.excerpt}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-edge px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-accent-gold"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-edge/60 pt-5">
            <div className="flex items-center gap-3">
              <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-edge/70">
                <Image
                  src={defaultPortraitImage}
                  alt="Anadi Mishra portrait"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </span>
              <p className="font-display text-base tracking-[0.02em] text-ink">Anadi Mishra</p>
            </div>
            <span className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-accent-gold">
              {note.readTime}
            </span>
            <span className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-accent-blue">
              {new Date(note.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <ShareWidget
            className="mt-5"
            label="Share this piece"
            title={note.title}
            description={note.excerpt}
            url={absoluteUrl(`/writing/${note.slug}`)}
          />
          <EntryImage
            imageUrl={note.imageUrl}
            alt={note.imageAlt ?? `${note.title} featured image`}
            className="mt-10"
            fit="contain"
            sizes="(min-width: 1024px) 768px, 100vw"
          />
          <YouTubeEmbed youtubeUrl={note.youtubeUrl} className="mt-10" />
          <div className="prose-signal mt-12" dangerouslySetInnerHTML={{ __html: dbPost.contentHtml }} />
        </article>
      ) : (
        <CursedSeriesGate
          contentType="works"
          slug={note.slug}
          title={note.title}
          description={note.excerpt}
          backHref="/writing"
          backLabel="Return to Writing"
        />
      )}
    </Container>
  );
}
