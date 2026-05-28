import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { GrooveBand } from "@/components/ui/groove-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { SignalButton } from "@/components/ui/signal-button";
import portrait1 from "@/assets/anadi_portrait.png";
import portrait2 from "@/assets/anadi_portrait_2.webp";
import portrait3 from "@/assets/anadi_portrait_3.webp";
import { siteConfig } from "@/data/site";
import { createBreadcrumbSchema, createPageMetadata, createSchemaReference, createWebPageSchema } from "@/lib/seo";

const aboutTitle = "About Anadi Mishra | Writing, Systems, Travel & Technology";
const aboutDescription =
  "About Anadi Mishra, a Vancouver-based writer, systems builder, developer, and travel business operator working across creative practice, web systems, and digital growth.";
const aboutPhotos = [
  {
    src: portrait1,
    alt: "Anadi Mishra portrait",
  },
  {
    src: portrait2,
    alt: "Anadi Mishra portrait",
  },
  {
    src: portrait3,
    alt: "Anadi Mishra portrait",
  },
];

export const metadata: Metadata = createPageMetadata({
  title: aboutTitle,
  description: aboutDescription,
  path: "/about",
  keywords: [
    "About Anadi Mishra",
    "Anadi Mishra biography",
    "Vancouver writer musician",
    "Vancouver BC",
    "PHP",
    "Laravel",
    "JavaScript",
    "web systems development",
    "digital systems architecture",
    "digital marketing",
    "travel operations",
    "creative systems",
    "Zhango",
    "Globalduniya Canada",
  ],
  type: "profile",
  twitterCard: "summary",
});

export default function AboutPage() {
  const aboutStructuredData = createWebPageSchema({
    path: "/about",
    title: aboutTitle,
    description: aboutDescription,
    type: "AboutPage",
    mainEntity: createSchemaReference("/anadi-mishra#person"),
  });
  const breadcrumbStructuredData = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ]);

  return (
    <Container className="py-16 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <div className="space-y-16">
        <div className="space-y-14">
          <MotionReveal tempo="slow">
            <SectionHeading
              eyebrow="About"
              title="About Anadi Mishra"
              titleId="about-heading"
              as="h1"
              description="Vancouver writer, musician, developer, and founder of Globalduniya Canada."
            />
          </MotionReveal>

          <GrooveBand className="opacity-95" />

          <MotionReveal>
            <section className="surface-card rounded-2xl border border-edge/80 p-6 sm:p-8">
              <div className="prose-signal mt-6 max-w-none">
                <p>This site is the public edge of a private practice.</p>
                <p>
                  I am based in {siteConfig.location}. The work moves through writing, music, travel, web systems,
                  and digital architecture - sometimes through PHP, Laravel, JavaScript, HTML/CSS, and sometimes
                  through stranger materials.
                </p>
                <p>It is technical work, but not only technical work.</p>
                <p>
                  The same practice also includes travel operations, digital marketing, essays, music, and creative
                  systems: different ways of turning thought into something people can actually use.
                </p>
                <p>
                  I am the{" "}
                  <a href={siteConfig.travelCompanyUrl ?? "/contact"} className="text-accent-blue hover:text-ink">
                    founder of Globalduniya Canada
                  </a>
                  , a travel company based in British Columbia. Travel Whisky sits in the same orbit. I also make work
                  under the name <span className="text-ink">Zhango</span>.
                </p>
                <p>
                  If the{" "}
                  <Link href="/anadi-mishra" className="text-accent-blue hover:text-ink">
                    biography page
                  </Link>{" "}
                  is the factual anchor, this page is the warmer one. Visit the{" "}
                  <Link href="/writing" className="text-accent-blue hover:text-ink">
                    Writing Archive
                  </Link>
                  , the{" "}
                  <Link href="/creative-systems" className="text-accent-blue hover:text-ink">
                    Creative Systems
                  </Link>{" "}
                  page, or the{" "}
                  <Link href="/contact" className="text-accent-blue hover:text-ink">
                    Contact
                  </Link>{" "}
                  page for the broader shape of the work.
                </p>
              </div>
            </section>
          </MotionReveal>

          <MotionReveal>
            <section className="surface-card rounded-2xl border border-edge/80 p-6 sm:p-8">
              <SectionHeading
                eyebrow="Quick links"
                title="Where the work lives"
                titleId="about-links"
                description="The main public surfaces of the practice."
              />
              <div className="mt-6 flex flex-wrap gap-3">
                <SignalButton href="/anadi-mishra" variant="ghost">
                  Biography
                </SignalButton>
                <SignalButton href="/writing" variant="ghost">
                  Writing
                </SignalButton>
                <SignalButton href="/creative-systems" variant="ghost">
                  Creative Systems
                </SignalButton>
                <SignalButton href="/music" variant="ghost">
                  Music
                </SignalButton>
                <SignalButton href="/contact" variant="primary">
                  Contact
                </SignalButton>
              </div>
            </section>
          </MotionReveal>

          <MotionReveal>
            <section className="surface-card rounded-2xl border border-edge/80 p-6 sm:p-8">
              <p className="max-w-3xl text-base leading-8 text-ink-soft">
                If you want the public links, the Contact page is the map. That is where the visible trail lives now.
              </p>
              <div className="mt-5">
                <SignalButton href="/contact" variant="ghost">
                  Open Contact
                </SignalButton>
              </div>
            </section>
          </MotionReveal>

          <MotionReveal>
            <section className="surface-card rounded-2xl border border-edge/80 p-6 sm:p-8">
              <p className="font-display text-2xl leading-relaxed tracking-[0.02em] text-ink sm:text-3xl">
                The point is the practice underneath them.
              </p>
            </section>
          </MotionReveal>

          <MotionReveal>
            <div className="flex flex-wrap gap-3">
              <SignalButton href="/anadi-mishra" variant="ghost">
                Read biography
              </SignalButton>
              <SignalButton href="/writing" variant="ghost">
                Browse Writing
              </SignalButton>
              <SignalButton href="/creative-systems" variant="ghost">
                Browse Creative Systems
              </SignalButton>
              <SignalButton href="/contact">Contact</SignalButton>
            </div>
          </MotionReveal>

          <GrooveBand className="opacity-95" />
        </div>

        <MotionReveal>
          <section>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {aboutPhotos.map((photo) => (
                <figure
                  key={photo.src.src}
                  className="surface-card flex h-full flex-col rounded-2xl border border-edge/80 bg-canvas/40 p-4 sm:p-5"
                >
                  <div className="relative overflow-hidden rounded-xl aspect-[4/5]">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover object-center"
                    />
                  </div>
                </figure>
              ))}
            </div>
          </section>
        </MotionReveal>
      </div>
    </Container>
  );
}
