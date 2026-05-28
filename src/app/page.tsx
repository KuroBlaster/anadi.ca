import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { MotionReveal, MotionStagger, MotionStaggerItem } from "@/components/ui/motion-reveal";
import { DriftSection } from "@/components/ui/groove-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { SignalButton } from "@/components/ui/signal-button";
import defaultPortraitImage from "@/assets/anadi_portrait.png";
import { siteConfig } from "@/data/site";
import { createBreadcrumbSchema, createPageMetadata, createSchemaReference, createWebPageSchema } from "@/lib/seo";

const homeTitle = "Anadi Mishra | Music, Writing, Systems, and Travel";
const homeDescription = `${siteConfig.fullName} is a Vancouver-based writer, musician, systems builder, and founder of ${siteConfig.travelCompanyName}. This is the official home for writing, music, creative systems, and travel work.`;

export const metadata: Metadata = createPageMetadata({
  title: homeTitle,
  description: homeDescription,
  path: "/",
  keywords: [
    "Anadi Mishra official website",
    "Vancouver writer musician",
    "entrepreneur",
    "creative systems",
    "travel projects",
    "Globalduniya founder",
  ],
});

export default async function Home() {
  const homeStructuredData = createWebPageSchema({
    path: "/",
    title: homeTitle,
    description: homeDescription,
    mainEntity: createSchemaReference("/anadi-mishra#person"),
  });
  const breadcrumbStructuredData = createBreadcrumbSchema([{ name: "Home", path: "/" }]);

  return (
    <div className="pb-16 sm:pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <section className="signal-grid relative flex min-h-[calc(100svh-4rem)] overflow-hidden border-b border-edge/80">
        <div className="hero-wave-beat absolute inset-0 hidden opacity-45 mix-blend-screen md:block" aria-hidden />
        <div className="hero-wave-chaos absolute inset-0 hidden opacity-28 mix-blend-screen md:block" aria-hidden />
        <div className="hero-chaos-field hero-chaos-field--a absolute inset-0 hidden md:block" aria-hidden />
        <div className="hero-chaos-field hero-chaos-field--b absolute inset-0 hidden md:block" aria-hidden />
        <div className="hero-chaos-streaks absolute inset-0 hidden md:block" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-b from-canvas/52 via-canvas/28 to-canvas/82"
          aria-hidden
        />
        <div className="relative z-10 flex w-full items-center px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <Container className="w-full max-w-none">
            <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
              <DriftSection intensity="medium">
                <MotionReveal className="w-full" tempo="slow">
                  <div className="w-full max-w-none">
                    <h1 className="mt-5 font-display text-5xl tracking-[0.04em] text-ink sm:text-7xl">
                      {siteConfig.fullName}
                    </h1>
                    <p className="mt-6 max-w-3xl text-lg leading-9 text-ink-soft sm:text-xl">
                      {siteConfig.signalStatement}
                    </p>
                    <p className="mt-4 max-w-2xl whitespace-pre-line text-base leading-8 text-ink-soft sm:text-lg">
                      {siteConfig.intro}
                    </p>
                  </div>
                </MotionReveal>
              </DriftSection>
              <MotionReveal className="lg:justify-self-end" tempo="slow">
                <figure className="surface-card relative h-[420px] overflow-hidden rounded-3xl border border-edge/80 shadow-[0_20px_60px_rgba(0,0,0,0.22)] sm:h-[520px] lg:h-[640px] lg:w-[420px]">
                  <Image
                    src={defaultPortraitImage}
                    alt="Anadi Mishra portrait"
                    fill
                    priority
                    sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-center"
                  />
                </figure>
              </MotionReveal>
            </div>
          </Container>
        </div>
      </section>

      <Container className="pt-8 sm:pt-10">
        <MotionReveal>
          <section className="surface-card rounded-2xl px-6 py-10 text-center sm:px-10">
            <p className="whitespace-pre-line font-display text-xl tracking-[0.02em] text-ink sm:text-2xl">
              {siteConfig.manifesto}
            </p>
          </section>
        </MotionReveal>
      </Container>

      <Container className="space-y-20 pt-16 sm:space-y-24 sm:pt-20">
        <section id="start-here" aria-labelledby="start-here-heading">
          <MotionReveal tempo="base">
            <SectionHeading
              eyebrow="Welcome"
              title="Explore the site"
              titleId="start-here-heading"
              as="h2"
              description="Start here."
              className="[&_h2]:scroll-mt-24"
            />
          </MotionReveal>
          <MotionReveal className="mt-8" tempo="base">
            <div className="surface-card rounded-2xl border border-edge/80 p-6 sm:p-8">
              <p className="max-w-4xl text-base leading-8 text-ink-soft sm:text-lg">
                Start here for the main pages: About Anadi Mishra, Biography, Writing, Creative Systems, Music, and
                Contact.
              </p>
              <MotionStagger className="mt-6 flex flex-wrap gap-3" tempo="fast">
                <MotionStaggerItem tempo="fast">
                  <SignalButton href="/about" variant="ghost">
                    About Anadi Mishra
                  </SignalButton>
                </MotionStaggerItem>
                <MotionStaggerItem tempo="fast">
                  <SignalButton href="/anadi-mishra" variant="ghost">
                    Biography
                  </SignalButton>
                </MotionStaggerItem>
                <MotionStaggerItem tempo="fast">
                  <SignalButton href="/writing" variant="ghost">
                    Writing
                  </SignalButton>
                </MotionStaggerItem>
                <MotionStaggerItem tempo="fast">
                  <SignalButton href="/creative-systems" variant="ghost">
                    Creative Systems
                  </SignalButton>
                </MotionStaggerItem>
                <MotionStaggerItem tempo="fast">
                  <SignalButton href="/music" variant="ghost">
                    Music
                  </SignalButton>
                </MotionStaggerItem>
                <MotionStaggerItem tempo="fast">
                  <SignalButton href="/contact" variant="primary">
                    Contact
                  </SignalButton>
                </MotionStaggerItem>
              </MotionStagger>
            </div>
          </MotionReveal>
        </section>

        <MotionReveal>
          <section className="surface-card rounded-2xl border border-edge/80 p-6 sm:p-8">
            <p className="max-w-3xl text-base leading-8 text-ink-soft">
              Looking for the public links and direct contact? I keep the visible trail on the{" "}
              <Link href="/contact" className="text-accent-blue hover:text-ink">
                Contact
              </Link>{" "}
              page.
            </p>
            <div className="mt-5">
              <SignalButton href="/contact" variant="ghost">
                Open Contact
              </SignalButton>
            </div>
          </section>
        </MotionReveal>

        <MotionReveal>
          <section className="rounded-2xl border border-edge px-6 py-10 sm:px-8">
            <h2 className="font-display text-3xl tracking-[0.02em] text-ink">If this resonates, reach out.</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-ink-soft">
              I am open to collaborations in writing, music, systems, travel, and web work that need both clarity and
              execution.
            </p>
            <div className="mt-8">
              <SignalButton href="/contact">Contact Anadi</SignalButton>
            </div>
          </section>
        </MotionReveal>
      </Container>
    </div>
  );
}
