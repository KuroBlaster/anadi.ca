import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { MotionReveal, MotionStagger, MotionStaggerItem } from "@/components/ui/motion-reveal";
import { GrooveBand } from "@/components/ui/groove-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { SignalButton } from "@/components/ui/signal-button";
import { WorkCard } from "@/components/cards/work-card";
import { ShareWidget } from "@/components/content/share-widget";
import { listPublishedPosts, toHomepageWorkItem } from "@/lib/work-posts";
import {
  absoluteUrl,
  createBreadcrumbSchema,
  createPageMetadata,
  createSchemaReference,
  createWebPageSchema,
} from "@/lib/seo";
import type { WorkItem } from "@/types/content";

const creativeSystemsTitle = "Creative Systems | Anadi Mishra";
const creativeSystemsDescription =
  "Frameworks, projects, and practical systems by Anadi Mishra, a Vancouver-based writer, musician, developer, and founder of Globalduniya Canada.";

function hasSystemLabel(tags: string[]) {
  return tags.some((tag) => tag.toLowerCase().includes("system"));
}

export const metadata: Metadata = createPageMetadata({
  title: creativeSystemsTitle,
  description: creativeSystemsDescription,
  path: "/creative-systems",
  keywords: [
    "creative systems",
    "digital systems architecture",
    "web systems development",
    "PHP",
    "Laravel",
    "JavaScript",
    "travel operations",
    "digital marketing",
    "Globalduniya Canada",
    "Zhango",
  ],
  type: "website",
});

export default async function CreativeSystemsPage() {
  let creativeSystemItems: WorkItem[] = [];

  try {
    const posts = await listPublishedPosts();
    creativeSystemItems = posts
      .filter((post) => hasSystemLabel(post.tags))
      .map(toHomepageWorkItem);
  } catch {
    creativeSystemItems = [];
  }

  const creativeSystemsStructuredData = createWebPageSchema({
    path: "/creative-systems",
    title: creativeSystemsTitle,
    description: creativeSystemsDescription,
    type: "CollectionPage",
    mainEntity: createSchemaReference("/creative-systems#overview"),
  });
  const breadcrumbStructuredData = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Creative Systems", path: "/creative-systems" },
  ]);

  return (
    <Container className="py-16 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeSystemsStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />

      <div className="space-y-16">
        <MotionReveal tempo="slow">
          <SectionHeading
            eyebrow="Creative Systems"
            title="Creative Systems"
            titleId="creative-systems-heading"
            as="h1"
            description="Frameworks, projects, and practical systems by Anadi Mishra."
          />
          <p className="mt-4 max-w-3xl text-base leading-8 text-ink-soft">
            This page is where the work turns into things other people can actually use: systems, routes, workflows,
            project-shapes, and the practical architecture around writing, music, and travel. It sits beside the{" "}
            <Link href="/writing" className="text-accent-blue hover:text-ink">
              Writing
            </Link>{" "}
            archive and the{" "}
            <Link href="/about" className="text-accent-blue hover:text-ink">
              About
            </Link>{" "}
            page.
          </p>
        </MotionReveal>

        <MotionReveal>
          <section className="surface-card rounded-2xl border border-edge/80 p-6 sm:p-8" id="overview">
            <div className="space-y-4 text-base leading-8 text-ink-soft">
              <p>
                The practice includes PHP, Laravel, JavaScript, HTML/CSS, web systems development, digital systems
                architecture, travel operations, and digital marketing.
              </p>
              <p>
                I'm interested in making those systems feel legible without stripping out the strange, personal, or
                poetic parts that keep them alive.
              </p>
            </div>
            <ShareWidget
              className="mt-6"
              label="Share this page"
              title={creativeSystemsTitle}
              description={creativeSystemsDescription}
              url={absoluteUrl("/creative-systems")}
            />
          </section>
        </MotionReveal>

        <MotionReveal>
          <div className="flex flex-wrap gap-3">
            <SignalButton href="/writing" variant="ghost">
              Writing
            </SignalButton>
            <SignalButton href="/anadi-mishra" variant="ghost">
              Biography
            </SignalButton>
            <SignalButton href="/about" variant="ghost">
              About Anadi Mishra
            </SignalButton>
            <SignalButton href="/music" variant="ghost">
              Music
            </SignalButton>
          </div>
        </MotionReveal>

        {creativeSystemItems.length > 0 ? (
          <MotionStagger className="grid gap-4 lg:grid-cols-2" tempo="base">
            {creativeSystemItems.map((item: WorkItem) => (
              <MotionStaggerItem key={item.id} tempo="base">
                <WorkCard item={item} />
              </MotionStaggerItem>
            ))}
          </MotionStagger>
        ) : (
          <MotionReveal>
            <div className="surface-card rounded-2xl border border-edge/80 p-6 text-ink-soft">
              Publish a writing entry with a tag that includes system, and it will appear here automatically.
            </div>
          </MotionReveal>
        )}

        <MotionReveal>
          <section className="surface-card rounded-2xl border border-edge/80 p-6 sm:p-8">
            <p className="font-display text-2xl leading-relaxed tracking-[0.02em] text-ink sm:text-3xl">
              Systems are just another way of keeping a song, a trip, or a sentence from disappearing.
            </p>
          </section>
        </MotionReveal>

        <GrooveBand className="opacity-95" />
      </div>
    </Container>
  );
}
