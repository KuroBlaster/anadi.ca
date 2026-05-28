import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { MotionReveal, MotionStagger, MotionStaggerItem } from "@/components/ui/motion-reveal";
import { GrooveBand } from "@/components/ui/groove-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { NoteCard } from "@/components/cards/note-card";
import defaultPortraitImage from "@/assets/anadi_portrait.png";
import { siteConfig } from "@/data/site";
import { listPublishedPosts, toFieldNoteView } from "@/lib/work-posts";
import {
  absoluteUrl,
  createArticleSchema,
  createBreadcrumbSchema,
  createPageMetadata,
  createSchemaReference,
  createWebPageSchema,
} from "@/lib/seo";
import type { FieldNote } from "@/types/content";

const writingTitle = "Writing | Anadi Mishra";
const writingDescription =
  "Essays, Free verse poems, rap based epics and long-form writing by Anadi Mishra.";

export const metadata: Metadata = createPageMetadata({
  title: writingTitle,
  description: writingDescription,
  path: "/writing",
  keywords: [
    "Anadi Mishra writing",
    "field notes",
    "creative nonfiction",
    "philosophical essays",
    "Vancouver writer musician",
    "Zhango",
    "Globalduniya Canada",
    "creative systems",
  ],
  type: "website",
});

export default async function WritingPage() {
  let notes: FieldNote[] = [];

  try {
    const posts = await listPublishedPosts();
    notes = posts.map(toFieldNoteView);
  } catch {
    notes = [];
  }

  const regularNotes = notes.filter((note) => !note.isCursed);
  const cursedNotes = notes.filter((note) => note.isCursed);
  const articleStructuredData = notes.map((note) =>
    createArticleSchema({
      url: `/writing/${note.slug}`,
      title: note.title,
      description: note.excerpt,
      datePublished: new Date(note.date).toISOString(),
      image: note.imageUrl ? absoluteUrl(note.imageUrl) : absoluteUrl(defaultPortraitImage.src),
      keywords: note.tags,
      author: {
        name: siteConfig.fullName,
        url: "/anadi-mishra",
      },
    }),
  );
  const writingItemListStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": absoluteUrl("/writing#itemlist"),
    name: writingTitle,
    description: writingDescription,
    numberOfItems: notes.length,
    itemListOrder: "https://schema.org/ItemListUnordered",
    itemListElement: notes.map((note, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: note.title,
      url: absoluteUrl(`/writing/${note.slug}`),
      item: createSchemaReference(`/writing/${note.slug}#webpage`),
    })),
  };
  const writingStructuredData = createWebPageSchema({
    path: "/writing",
    title: writingTitle,
    description: writingDescription,
    type: "CollectionPage",
    mainEntity: createSchemaReference("/writing#itemlist"),
  });
  const breadcrumbStructuredData = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Writing", path: "/writing" },
  ]);

  return (
    <Container className="py-16 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(writingStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(writingItemListStructuredData) }}
      />
      {articleStructuredData.length > 0 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
        />
      ) : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />

      <MotionReveal tempo="slow">
        <SectionHeading
          eyebrow="Writing"
          title="Writing"
          titleId="writing-heading"
          as="h1"
          description="Essays, Free verse poems, rap based epics and long-form writing by Anadi Mishra."
        />
      </MotionReveal>

      <GrooveBand className="my-8 opacity-95" />

      {regularNotes.length > 0 ? (
        <MotionStagger className="mt-10 space-y-4" tempo="base">
          {regularNotes.map((note) => (
            <MotionStaggerItem key={note.slug} tempo="base">
              <NoteCard note={note} />
            </MotionStaggerItem>
          ))}
        </MotionStagger>
      ) : notes.length === 0 ? (
        <div className="surface-card rounded-2xl border border-edge/80 p-6 text-ink-soft">
          No published writing is available yet.
        </div>
      ) : null}

      {cursedNotes.length > 0 ? (
        <section
          className="mt-16 rounded-3xl border border-accent-crimson/18 bg-[linear-gradient(180deg,rgba(23,25,29,0.98),rgba(15,16,18,0.98))] p-5 shadow-[0_24px_54px_rgba(0,0,0,0.38)] sm:p-6"
          aria-labelledby="cursed-series-heading"
        >
          <SectionHeading
            eyebrow="Content warning"
            title="Cursed Series"
            titleId="cursed-series-heading"
            description="These entries can be darker, heavier, or more unsettling. Please open them with care."
          />
          <MotionStagger className="mt-8 space-y-4" tempo="base">
            {cursedNotes.map((note) => (
              <MotionStaggerItem key={note.slug} tempo="base">
                <NoteCard note={note} />
              </MotionStaggerItem>
            ))}
          </MotionStagger>
        </section>
      ) : null}
    </Container>
  );
}
