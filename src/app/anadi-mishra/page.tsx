import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { MotionReveal, MotionStagger, MotionStaggerItem } from "@/components/ui/motion-reveal";
import { GrooveBand } from "@/components/ui/groove-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { SignalButton } from "@/components/ui/signal-button";
import { WorkCard } from "@/components/cards/work-card";
import { siteConfig } from "@/data/site";
import { getLatestPublicMusicEntry } from "@/lib/music-entries";
import { listSelectedWorkFeaturedPosts, toHomepageWorkItem } from "@/lib/work-posts";
import { createBreadcrumbSchema, createPageMetadata, createSchemaReference, createWebPageSchema } from "@/lib/seo";
import type { WorkItem } from "@/types/content";

const biographyPageTitle = "Anadi Mishra - Vancouver-Based Systems Builder, Writer, Developer, and Founder";
const biographyTitle = "Anadi Mishra | Vancouver Systems Builder, Writer & Developer";
const biographyDescription =
  "Anadi Mishra is a Vancouver-based systems builder, writer, developer, and creative practitioner working across technology, travel, digital systems, music, and long-form writing.";

export const metadata: Metadata = createPageMetadata({
  title: biographyTitle,
  description: biographyDescription,
  path: "/anadi-mishra",
  keywords: [
    "Anadi Mishra official biography",
    "Vancouver systems builder",
    "Vancouver writer developer",
    "Predictive Analytics BCIT",
    "Globalduniya Canada",
    "Travel Whisky",
    "Zhango",
    "official personal website",
    "writer musician",
    "systems builder",
  ],
  type: "profile",
  twitterCard: "summary",
});

export default async function AnadiMishraPage() {
  const featuredItems: WorkItem[] = [];

  try {
    const [featuredPosts, latestMusicEntry] = await Promise.all([
      listSelectedWorkFeaturedPosts(),
      getLatestPublicMusicEntry(),
    ]);

    const postItems = featuredPosts.slice(0, 3).map(toHomepageWorkItem);
    const musicItem = latestMusicEntry
      ? {
          id: latestMusicEntry.id,
          title: latestMusicEntry.title,
          category: "Music" as const,
          tag: "SoundCloud",
          description: latestMusicEntry.description,
          link: `/music/${latestMusicEntry.slug}`,
          ctaLabel: "Open music",
          isCursed: latestMusicEntry.isCursed,
        }
      : null;

    const dynamicItems = [...postItems, ...(musicItem ? [musicItem] : [])];
    if (dynamicItems.length > 0) {
      featuredItems.splice(0, featuredItems.length, ...dynamicItems);
    }
  } catch {
    // Keep the page stable even if the CMS/database is unavailable.
  }

  const pageStructuredData = createWebPageSchema({
    path: "/anadi-mishra",
    title: biographyTitle,
    description: biographyDescription,
    type: "ProfilePage",
    mainEntity: createSchemaReference("/anadi-mishra#person"),
  });
  const breadcrumbStructuredData = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Anadi Mishra", path: "/anadi-mishra" },
  ]);

  return (
    <div className="pb-16 sm:pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />

      <section className="signal-grid relative overflow-hidden border-b border-edge/80 py-24 sm:py-28">
        <div className="hero-wave-beat absolute inset-0 opacity-45 mix-blend-screen" aria-hidden />
        <div className="hero-wave-chaos absolute inset-0 opacity-24 mix-blend-screen" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-canvas/55 via-canvas/30 to-canvas/85" aria-hidden />
        <Container className="relative z-10">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <MotionReveal className="max-w-4xl" tempo="slow">
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.26em] text-accent-gold">
                Official Biography
              </p>
              <h1 className="mt-5 font-display text-5xl tracking-[0.04em] text-ink sm:text-6xl lg:text-7xl">
                {biographyPageTitle}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-9 text-ink-soft sm:text-xl">
                {biographyDescription}
              </p>
            </MotionReveal>

            <MotionReveal tempo="slow">
              <aside className="surface-card rounded-2xl border border-edge/80 p-6 sm:p-8">
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.26em] text-accent-gold">Quick Facts</p>
                <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="font-mono text-[0.64rem] uppercase tracking-[0.2em] text-ink-soft">Name</dt>
                    <dd className="mt-1 text-sm leading-7 text-ink">{siteConfig.fullName}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.64rem] uppercase tracking-[0.2em] text-ink-soft">Location</dt>
                    <dd className="mt-1 text-sm leading-7 text-ink">{siteConfig.location}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.64rem] uppercase tracking-[0.2em] text-ink-soft">Education</dt>
                    <dd className="mt-1 text-sm leading-7 text-ink">
                      {siteConfig.educationInstitution} / BCIT
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.64rem] uppercase tracking-[0.2em] text-ink-soft">Focus</dt>
                    <dd className="mt-1 text-sm leading-7 text-ink">{siteConfig.educationField}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.64rem] uppercase tracking-[0.2em] text-ink-soft">Work</dt>
                    <dd className="mt-1 text-sm leading-7 text-ink">
                      Systems Builder, Full-Stack Developer, Writer, Musician
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.64rem] uppercase tracking-[0.2em] text-ink-soft">Business</dt>
                    <dd className="mt-1 text-sm leading-7 text-ink">{siteConfig.businessIdentity}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.64rem] uppercase tracking-[0.2em] text-ink-soft">
                      Creative alias
                    </dt>
                    <dd className="mt-1 text-sm leading-7 text-ink">{siteConfig.artistAlias}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.64rem] uppercase tracking-[0.2em] text-ink-soft">Website</dt>
                    <dd className="mt-1 text-sm leading-7 text-ink">{siteConfig.siteUrl.replace("https://", "")}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.64rem] uppercase tracking-[0.2em] text-ink-soft">Email</dt>
                    <dd className="mt-1 text-sm leading-7 text-ink">{siteConfig.entityEmail}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.64rem] uppercase tracking-[0.2em] text-ink-soft">
                      Technical Skills
                    </dt>
                    <dd className="mt-1 text-sm leading-7 text-ink">{siteConfig.technicalSkills.join(", ")}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="font-mono text-[0.64rem] uppercase tracking-[0.2em] text-ink-soft">Related</dt>
                    <dd className="mt-1 text-sm leading-7 text-ink">{siteConfig.relatedVentures.join(" / ")}</dd>
                  </div>
                </dl>
              </aside>
            </MotionReveal>
          </div>
        </Container>
      </section>

      <Container className="space-y-16 pt-16 sm:space-y-20 sm:pt-20">
        <MotionReveal>
          <section className="surface-card rounded-2xl border border-edge/80 p-6 sm:p-8">
            <SectionHeading eyebrow="Overview" title="Who I am" titleId="who-i-am" />
            <div className="mt-6 space-y-4 text-base leading-8 text-ink-soft">
              <p>
                I am based in {siteConfig.location} and work across writing, web systems development, travel business
                development, digital marketing, and creative systems.
              </p>
              <p>
                I am connected to {siteConfig.travelCompanyName} and Travel Whisky, and I also create music and writing
                under or alongside the name {siteConfig.artistAlias}.
              </p>
            </div>
          </section>
        </MotionReveal>

        <MotionReveal>
          <section className="surface-card rounded-2xl border border-edge/80 p-6 sm:p-8">
            <SectionHeading
              eyebrow="Education"
              title="BCIT / Predictive Analytics"
              titleId="vancouver"
            />
            <div className="mt-6 space-y-4 text-base leading-8 text-ink-soft">
              <p>
                I studied Predictive Analytics at {siteConfig.educationInstitution}, and that training still shapes the
                way I think about pattern, structure, and practical systems.
              </p>
              <p>
                The work on this site is shaped from {siteConfig.location}, but it reaches outward through writing,
                sound, structure, and travel.
              </p>
            </div>
          </section>
        </MotionReveal>

        <MotionReveal>
          <section className="surface-card rounded-2xl border border-edge/80 p-6 sm:p-8">
            <SectionHeading eyebrow="Business" title="Founder at Globalduniya Canada" titleId="globalduniya" />
            <div className="mt-6 space-y-4 text-base leading-8 text-ink-soft">
              <p>
                {siteConfig.travelCompanyName} is the travel business I am connected to. It belongs to the same larger
                practice as the essays and music: route-making, attention, and design with a point of view.
              </p>
              <p>
                Travel Whisky sits in the same orbit.
              </p>
              <p>
                The public link lives on the Contact page now.
              </p>
            </div>
          </section>
        </MotionReveal>

        <MotionReveal>
          <section className="surface-card rounded-2xl border border-edge/80 p-6 sm:p-8">
            <SectionHeading
              eyebrow="Creative practice"
              title="Writer / musician / developer / systems builder / Zhango"
              titleId="practice"
            />
            <div className="mt-6 space-y-4 text-base leading-8 text-ink-soft">
              <p>
                Writing gives the work language. Music gives it pulse. Systems give it a shape that other people can
                actually enter.
              </p>
              <p>
                Explore the writing on the{" "}
                <Link href="/writing" className="text-accent-blue hover:text-ink">
                  Writing
                </Link>{" "}
                page and the music on the{" "}
                <Link href="/music" className="text-accent-blue hover:text-ink">
                  Music
                </Link>{" "}
                page, or open the{" "}
                <Link href="/creative-systems" className="text-accent-blue hover:text-ink">
                  Creative Systems
                </Link>{" "}
                page when you want the structured side of the practice.
              </p>
            </div>
          </section>
        </MotionReveal>

        <MotionReveal>
          <section aria-labelledby="featured-works-heading">
            <SectionHeading
              eyebrow="Highlights"
              title="Featured writing, music, and systems"
              titleId="featured-works-heading"
              description="A small selection of public writing, music, and related work."
            />
            <MotionStagger className="mt-8 grid gap-4 lg:grid-cols-3" tempo="base">
              {featuredItems.map((item) => (
                <MotionStaggerItem key={item.id} tempo="base">
                  <WorkCard item={item} />
                </MotionStaggerItem>
              ))}
            </MotionStagger>
          </section>
        </MotionReveal>

        <MotionReveal>
          <div className="flex flex-wrap gap-3">
            <SignalButton href="/about" variant="ghost">
              Read About
            </SignalButton>
            <SignalButton href="/writing" variant="ghost">
              Browse Writing
            </SignalButton>
            <SignalButton href="/creative-systems" variant="ghost">
              Browse Systems
            </SignalButton>
            <SignalButton href="/music" variant="ghost">
              Hear Music
            </SignalButton>
            <SignalButton href="/contact">Contact</SignalButton>
          </div>
        </MotionReveal>

        <GrooveBand className="opacity-95" />
      </Container>
    </div>
  );
}
