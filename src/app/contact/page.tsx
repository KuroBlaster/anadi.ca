import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { GrooveBand } from "@/components/ui/groove-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { ElsewhereSection } from "@/components/layout/elsewhere-section";
import { siteConfig } from "@/data/site";
import { createBreadcrumbSchema, createPageMetadata, createSchemaReference, createWebPageSchema } from "@/lib/seo";

const contactTitle = "Contact Anadi Mishra - Collaborations & Inquiries";
const contactDescription =
  "Contact Anadi Mishra for writing, music, systems, travel, and web collaborations. This page has direct email and public links.";

export const metadata: Metadata = createPageMetadata({
  title: contactTitle,
  description: contactDescription,
  path: "/contact",
  keywords: [
    "contact Anadi Mishra",
    "Anadi Mishra email",
    "creative collaborations",
    "Globalduniya contact",
  ],
  twitterCard: "summary",
});

export default function ContactPage() {
  const contactStructuredData = createWebPageSchema({
    path: "/contact",
    title: contactTitle,
    description: contactDescription,
    type: "ContactPage",
    mainEntity: createSchemaReference("/anadi-mishra#person"),
  });
  const breadcrumbStructuredData = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ]);

  return (
    <Container className="py-16 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <div className="mx-auto max-w-3xl space-y-10">
        <MotionReveal tempo="slow">
          <SectionHeading
            eyebrow="Contact"
            title="Contact"
            titleId="contact-heading"
            as="h1"
            description="Use this page for direct inquiries, collaboration requests, and the public links I keep visible."
          />
        </MotionReveal>

        <GrooveBand className="opacity-95" />

        <MotionReveal>
          <section className="surface-card rounded-2xl border border-edge/80 p-6 sm:p-8">
            <h2 className="font-display text-2xl text-ink">Work with me if you need</h2>
            <ol className="mt-6 space-y-6">
              <li className="grid gap-2 sm:grid-cols-[auto_1fr] sm:gap-4">
                <span className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-accent-gold">1.</span>
                <div>
                  <h3 className="font-display text-xl text-ink">Writing / editorial translation</h3>
                  <p className="mt-2 text-base leading-8 text-ink-soft">
                    You have dense ideas and need them shaped into language.
                  </p>
                </div>
              </li>
              <li className="grid gap-2 sm:grid-cols-[auto_1fr] sm:gap-4">
                <span className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-accent-gold">2.</span>
                <div>
                  <h3 className="font-display text-xl text-ink">Creative systems</h3>
                  <p className="mt-2 text-base leading-8 text-ink-soft">
                    You need rituals, frameworks, or workflows that turn chaos into output.
                  </p>
                </div>
              </li>
              <li className="grid gap-2 sm:grid-cols-[auto_1fr] sm:gap-4">
                <span className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-accent-gold">3.</span>
                <div>
                  <h3 className="font-display text-xl text-ink">Music / sound collaboration</h3>
                  <p className="mt-2 text-base leading-8 text-ink-soft">
                    You want groove, lyrics, atmosphere, or conceptual direction.
                  </p>
                </div>
              </li>
              <li className="grid gap-2 sm:grid-cols-[auto_1fr] sm:gap-4">
                <span className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-accent-gold">4.</span>
                <div>
                  <h3 className="font-display text-xl text-ink">Travel experience design</h3>
                  <p className="mt-2 text-base leading-8 text-ink-soft">
                    You want a trip, route, or concept built with meaning and precision.
                  </p>
                </div>
              </li>
            </ol>
          </section>
        </MotionReveal>

        <MotionReveal>
          <ElsewhereSection titleId="contact-elsewhere" />
        </MotionReveal>

      </div>
    </Container>
  );
}
