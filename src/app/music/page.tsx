import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { GrooveBand } from "@/components/ui/groove-motion";
import { MotionReveal, MotionStagger, MotionStaggerItem } from "@/components/ui/motion-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { MusicArtwork } from "@/components/content/music-artwork";
import { siteConfig } from "@/data/site";
import { listPublicMusicEntries } from "@/lib/music-entries";
import { toYouTubeEmbedUrl, toYouTubeThumbnailUrl } from "@/lib/media";
import {
  absoluteUrl,
  createBreadcrumbSchema,
  createPageMetadata,
  createMusicRecordingSchema,
  createSchemaReference,
  createVideoObjectSchema,
  createWebPageSchema,
} from "@/lib/seo";
import type { MusicEntryRecord } from "@/types/content";

const musicPageTitle = "Music by Anadi Mishra (Zhango) - Tracks & Lyrics";
const musicHeadingTitle = "Music by Anadi Mishra (Zhango)";
const musicDescription =
  "Listen to original tracks, experimental rap, and ambient music by Anadi Mishra (Zhango). Stream Walk Walk Walk Walk, Grand Blue, and more - with lyrics and liner notes.";

export const metadata: Metadata = createPageMetadata({
  title: musicPageTitle,
  description: musicDescription,
  path: "/music",
  keywords: [
    "Anadi Mishra music",
    "SoundCloud tracks",
    "latest music releases",
    "track pages",
    "experimental music",
    "experimental rap Vancouver",
    "underground hip hop Canada",
    "indie music with lyrics",
    "ambient music",
    "lyrics and liner notes",
  ],
});

export default async function MusicPage() {
  let musicEntries: MusicEntryRecord[] = [];

  try {
    musicEntries = await listPublicMusicEntries();
  } catch {
    musicEntries = [];
  }
  const regularEntries = musicEntries.filter((entry) => !entry.isCursed);
  const cursedEntries = musicEntries.filter((entry) => entry.isCursed);
  const musicItemListStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": absoluteUrl("/music#itemlist"),
    name: musicHeadingTitle,
    description: musicDescription,
    numberOfItems: musicEntries.length,
    itemListOrder: "https://schema.org/ItemListUnordered",
    itemListElement: musicEntries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.title,
      url: absoluteUrl(`/music/${entry.slug}`),
      item: createSchemaReference(`/music/${entry.slug}#webpage`),
    })),
  };

  const musicEntryStructuredData = musicEntries.map((entry) =>
    createMusicRecordingSchema({
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
    }),
  );

  const musicVideoStructuredData = musicEntries.flatMap((entry) => {
    if (!entry.youtubeUrl) {
      return [];
    }

    const youtubeEmbedUrl = toYouTubeEmbedUrl(entry.youtubeUrl);
    const youtubeThumbnailUrl = toYouTubeThumbnailUrl(entry.youtubeUrl);

    return [
      createVideoObjectSchema({
        url: `/music/${entry.slug}`,
        title: entry.title,
        description: entry.description,
        contentUrl: entry.youtubeUrl,
        embedUrl: youtubeEmbedUrl ?? undefined,
        thumbnailUrl: youtubeThumbnailUrl ?? (entry.imageUrl ? absoluteUrl(entry.imageUrl) : undefined),
        uploadDate: entry.publishedAt ? new Date(entry.publishedAt).toISOString() : new Date(entry.updatedAt).toISOString(),
        author: {
          name: siteConfig.fullName,
          url: "/anadi-mishra",
        },
      }),
    ];
  });

  const musicStructuredData = createWebPageSchema({
    path: "/music",
    title: musicPageTitle,
    description: musicDescription,
    type: "CollectionPage",
    mainEntity: createSchemaReference("/music#itemlist"),
  });

  const breadcrumbStructuredData = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Music", path: "/music" },
  ]);

  return (
    <Container className="py-16 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(musicStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(musicItemListStructuredData) }}
      />
      {musicVideoStructuredData.length > 0 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(musicVideoStructuredData) }}
        />
      ) : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      {musicEntryStructuredData.length > 0 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(musicEntryStructuredData) }}
        />
      ) : null}

      <MotionReveal tempo="slow">
        <SectionHeading
          eyebrow="Music"
          title={musicHeadingTitle}
          titleId="music-heading"
          as="h1"
          description="Original tracks, experimental rap, and ambient music by Anadi Mishra (Zhango), with lyrics and liner notes."
        />
      </MotionReveal>

      <p className="mt-4 max-w-3xl text-base leading-8 text-ink-soft">
        Experimental rap, ambient pieces, and original tracks from Anadi Mishra (Zhango), with lyrics and liner notes
        for each release.
      </p>

      <GrooveBand className="mt-8 opacity-95" />

      <div className="mt-10">
        {regularEntries.length > 0 ? (
          <MotionStagger className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" tempo="base">
            {regularEntries.map((entry) => (
              <MotionStaggerItem key={entry.id} tempo="base">
                <Link href={`/music/${entry.slug}`} className="group block h-full">
                  <article className="surface-card flex h-full flex-col overflow-hidden rounded-2xl border border-edge/80 transition-transform duration-300 group-hover:-translate-y-1 group-hover:border-accent-blue/40">
                    <MusicArtwork
                      imageUrl={entry.imageUrl}
                      alt={entry.imageAlt ?? `${entry.title} cover image`}
                      title={entry.title}
                      variant="thumb"
                      framed={false}
                    />
                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-accent-gold">Song</p>
                      </div>
                      <h2 className="mt-3 font-display text-2xl tracking-[0.02em] text-ink">{entry.title}</h2>
                      <p className="mt-4 text-sm leading-7 text-ink-soft">{entry.description}</p>
                      <span className="mt-6 inline-flex items-center text-sm font-medium text-accent-blue transition group-hover:text-ink">
                        Open track
                      </span>
                    </div>
                  </article>
                </Link>
              </MotionStaggerItem>
            ))}
          </MotionStagger>
        ) : musicEntries.length === 0 ? (
          <MotionReveal tempo="base">
            <div className="surface-card rounded-2xl p-6 text-sm leading-7 text-ink-soft">
              Music entries are being prepared. Please check back in a moment or visit SoundCloud directly.
            </div>
          </MotionReveal>
        ) : null}

        {cursedEntries.length > 0 ? (
          <section
            className="mt-16 rounded-3xl border border-accent-crimson/18 bg-[linear-gradient(180deg,rgba(23,25,29,0.98),rgba(15,16,18,0.98))] p-5 shadow-[0_24px_54px_rgba(0,0,0,0.38)] sm:p-6"
            aria-labelledby="cursed-music-heading"
          >
            <SectionHeading
              eyebrow="Content warning"
              title="Cursed Series"
              titleId="cursed-music-heading"
              description="These tracks can be darker, heavier, or more unsettling. Please open them with care."
            />
            <MotionStagger className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3" tempo="base">
              {cursedEntries.map((entry) => (
                <MotionStaggerItem key={entry.id} tempo="base">
                  <Link href={`/music/${entry.slug}`} className="group block h-full">
                    <article className="surface-card flex h-full flex-col overflow-hidden rounded-2xl border border-edge/80 transition-transform duration-300 group-hover:-translate-y-1 group-hover:border-accent-blue/40">
                      <MusicArtwork
                        imageUrl={entry.imageUrl}
                        alt={entry.imageAlt ?? `${entry.title} cover image`}
                        title={entry.title}
                        variant="thumb"
                        framed={false}
                      />
                      <div className="flex flex-1 flex-col p-5 sm:p-6">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-accent-gold">
                            Song
                          </p>
                          <span className="rounded-full border border-[#5f2732]/70 bg-[#3a1017] px-3 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                            Cursed Series
                          </span>
                        </div>
                        <h2 className="mt-3 font-display text-2xl tracking-[0.02em] text-ink">{entry.title}</h2>
                        <p className="mt-4 text-sm leading-7 text-ink-soft">{entry.description}</p>
                        <span className="mt-6 inline-flex items-center text-sm font-medium text-accent-blue transition group-hover:text-ink">
                          Open track
                        </span>
                      </div>
                    </article>
                  </Link>
                </MotionStaggerItem>
              ))}
            </MotionStagger>
          </section>
        ) : null}
      </div>

      {siteConfig.soundcloudProfileUrl ? (
        <p className="mt-8 text-sm leading-7 text-ink-soft">
          For the full streaming catalog, visit{" "}
          <a
            href={siteConfig.soundcloudProfileUrl}
            target="_blank"
            rel="noreferrer"
            className="text-accent-blue hover:text-ink"
          >
            SoundCloud
          </a>
          .
        </p>
      ) : null}
    </Container>
  );
}
