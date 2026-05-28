import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { MusicArtwork } from "@/components/content/music-artwork";
import { CursedSeriesGate } from "@/components/content/cursed-series-gate";
import { Container } from "@/components/ui/container";
import { GrooveBand } from "@/components/ui/groove-motion";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { SignalButton } from "@/components/ui/signal-button";
import { ShareWidget } from "@/components/content/share-widget";
import { siteConfig } from "@/data/site";
import { CURSED_SERIES_COOKIE, buildCursedSeriesKey, hasCursedSeriesConsent } from "@/lib/cursed-series";
import { getPublicMusicEntryBySlug, listPublicMusicEntries } from "@/lib/music-entries";
import { toYouTubeEmbedUrl, toYouTubeThumbnailUrl } from "@/lib/media";
import {
  absoluteUrl,
  createArticleSchema,
  createBreadcrumbSchema,
  createPageMetadata,
  createMusicRecordingSchema,
  createSchemaReference,
  createVideoObjectSchema,
  createWebPageSchema,
} from "@/lib/seo";
import type { MusicEntryRecord } from "@/types/content";

type MusicPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const entries = await listPublicMusicEntries();
    return entries.map((entry: MusicEntryRecord) => ({ slug: entry.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: MusicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getPublicMusicEntryBySlug(slug);

  if (!entry) {
    return {
      title: "Track not found",
      description: "The requested music track could not be found.",
    };
  }

  return createPageMetadata({
    title: `${entry.title} - Music by Anadi Mishra`,
    description: entry.description,
    path: `/music/${entry.slug}`,
    keywords: [
      "Anadi Mishra music",
      entry.title,
      "experimental rap Vancouver",
      "underground hip hop Canada",
      "indie music with lyrics",
      "ambient music",
      "SoundCloud",
      "lyrics",
      "analysis",
    ],
    image: entry.imageUrl,
    imageAlt: entry.imageAlt ?? `${entry.title} cover image`,
    type: "article",
  });
}

export default async function MusicTrackPage({ params }: MusicPageProps) {
  const { slug } = await params;
  const entry = await getPublicMusicEntryBySlug(slug);

  if (!entry) {
    notFound();
  }

  const musicStructuredData = createMusicRecordingSchema({
    url: `/music/${entry.slug}`,
    title: entry.title,
    description: entry.description,
    datePublished: entry.publishedAt ? new Date(entry.publishedAt).toISOString() : undefined,
    image: entry.imageUrl ? absoluteUrl(entry.imageUrl) : undefined,
    byArtist: {
      name: siteConfig.fullName,
      url: "/anadi-mishra",
    },
    video: entry.youtubeUrl
      ? createSchemaReference(absoluteUrl(`/music/${entry.slug}#video`))
      : undefined,
  });
  const articleStructuredData = createArticleSchema({
    url: `/music/${entry.slug}`,
    title: entry.title,
    description: entry.description,
    datePublished: entry.publishedAt ? new Date(entry.publishedAt).toISOString() : undefined,
    dateModified: new Date(entry.updatedAt).toISOString(),
    image: entry.imageUrl ? absoluteUrl(entry.imageUrl) : undefined,
    keywords: [
      "Anadi Mishra music",
      "SoundCloud",
      "lyrics",
      "analysis",
      ...(entry.isCursed ? ["cursed series"] : []),
    ],
    author: {
      name: siteConfig.fullName,
      url: "/anadi-mishra",
    },
  });
  const youtubeEmbedUrl = entry.youtubeUrl ? toYouTubeEmbedUrl(entry.youtubeUrl) : null;
  const youtubeThumbnailUrl = entry.youtubeUrl ? toYouTubeThumbnailUrl(entry.youtubeUrl) : null;
  const videoStructuredData = entry.youtubeUrl
    ? createVideoObjectSchema({
        url: `/music/${entry.slug}`,
        title: entry.title,
        description: entry.description,
        contentUrl: entry.youtubeUrl,
        embedUrl: youtubeEmbedUrl ?? undefined,
        uploadDate: entry.publishedAt ? new Date(entry.publishedAt).toISOString() : new Date(entry.updatedAt).toISOString(),
        thumbnailUrl: youtubeThumbnailUrl || (entry.imageUrl ? absoluteUrl(entry.imageUrl) : undefined),
        author: {
          name: siteConfig.fullName,
          url: "/anadi-mishra",
        },
      })
    : null;

  const pageStructuredData = createWebPageSchema({
    path: `/music/${entry.slug}`,
    title: entry.title,
    description: entry.description,
    mainEntity: entry.youtubeUrl
      ? createSchemaReference(absoluteUrl(`/music/${entry.slug}#video`))
      : createSchemaReference(absoluteUrl(`/music/${entry.slug}#article`)),
  });

  const breadcrumbStructuredData = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Music", path: "/music" },
    { name: entry.title, path: `/music/${entry.slug}` },
  ]);
  const cursedKey = buildCursedSeriesKey("music", entry.slug);
  const cookieStore = await cookies();
  const cursedConsent = cookieStore.get(CURSED_SERIES_COOKIE)?.value;
  const hasAccess = !entry.isCursed || hasCursedSeriesConsent(cursedConsent, cursedKey);

  return (
    <Container className="py-16 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(musicStructuredData) }}
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />

      {hasAccess ? (
        <>
          <div className="space-y-4">
            <SignalButton href="/music" variant="ghost">
              Back to music
            </SignalButton>
            <MotionReveal tempo="slow">
              <SectionHeading
                eyebrow="Music"
                title={entry.title}
                titleId="music-track-heading"
                as="h1"
                description={entry.description}
              />
            </MotionReveal>
            {entry.isCursed ? (
              <p className="inline-flex rounded-full border border-[#5f2732]/70 bg-[#3a1017] px-3 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                Cursed Series
              </p>
            ) : null}
            <ShareWidget
              label="Share this track"
              title={entry.title}
              description={entry.description}
              url={absoluteUrl(`/music/${entry.slug}`)}
            />
          </div>

          <GrooveBand className="mt-8 opacity-95" />

          <MotionReveal>
            <article className="mx-auto max-w-3xl">
              <MusicArtwork
                imageUrl={entry.imageUrl}
                alt={entry.imageAlt ?? `${entry.title} cover image`}
                title={entry.title}
                className="mt-10"
                fit="contain"
                sizes="(min-width: 1024px) 768px, 100vw"
              />

          <div className="mt-8 flex flex-wrap gap-3">
            <SignalButton href={entry.soundcloudUrl} target="_blank" rel="noreferrer" variant="ghost">
              Open on SoundCloud
            </SignalButton>
            {entry.youtubeUrl ? (
              <SignalButton href={entry.youtubeUrl} target="_blank" rel="noreferrer" variant="ghost">
                Open on YouTube
              </SignalButton>
            ) : null}
          </div>

          <div className="mt-8">
            <h2 className="font-display text-xl text-ink">Listen</h2>
            <div className="mt-4 overflow-hidden rounded-xl border border-edge">
              <iframe
                title={`${entry.title} on SoundCloud`}
                width="100%"
                height="166"
                scrolling="no"
                frameBorder="0"
                allow="autoplay"
                src={entry.soundcloudEmbedUrl}
              />
            </div>
            {entry.youtubeUrl ? (
              <p className="mt-4 text-sm leading-7 text-ink-soft">
                Also available on{" "}
                <a
                  href={entry.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent-crimson hover:text-ink"
                >
                  YouTube
                </a>
                .
              </p>
            ) : null}
          </div>

          <div className="mt-8">
            <h2 className="font-display text-xl text-ink">Read</h2>
            <ul className="mt-4 space-y-2 text-base leading-8 text-ink-soft">
              <li>
                <a href={`#${entry.slug}-lyrics`} className="text-accent-blue hover:text-ink">
                  Lyrics
                </a>
              </li>
              <li>
                <a href={`#${entry.slug}-analysis`} className="text-accent-blue hover:text-ink">
                  What this song is doing
                </a>
              </li>
              {entry.relatedNotes.length > 0 ? <li>Related notes: {entry.relatedNotes.join(", ")}</li> : null}
            </ul>
          </div>

          <section id={`${entry.slug}-lyrics`} className="mt-10 scroll-mt-24">
            <h2 className="font-display text-2xl text-ink">Lyrics</h2>
            <div className="prose-signal mt-4" dangerouslySetInnerHTML={{ __html: entry.lyricsHtml }} />
          </section>

          <section id={`${entry.slug}-analysis`} className="mt-10 scroll-mt-24">
            <h2 className="font-display text-2xl text-ink">What this song is doing</h2>
            <div className="prose-signal mt-4" dangerouslySetInnerHTML={{ __html: entry.analysisHtml }} />
          </section>
            </article>
          </MotionReveal>
        </>
      ) : (
        <CursedSeriesGate
          contentType="music"
          slug={entry.slug}
          title={entry.title}
          description={entry.description}
          backHref="/music"
          backLabel="Back to music"
        />
      )}
    </Container>
  );
}
