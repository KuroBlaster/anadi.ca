import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { GrooveBand } from "@/components/ui/groove-motion";
import { SignalButton } from "@/components/ui/signal-button";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you requested does not exist or is no longer available.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      "max-image-preview": "none",
      "max-snippet": 0,
      "max-video-preview": 0,
    },
  },
};

export default function NotFoundPage() {
  return (
    <Container className="py-16 sm:py-24">
      <MotionReveal tempo="slow">
        <section className="signal-grid relative overflow-hidden rounded-3xl border border-edge/80 px-6 py-16 sm:px-10 sm:py-20">
          <div className="hero-wave-beat absolute inset-0 opacity-35 mix-blend-screen" aria-hidden />
          <div className="hero-wave-chaos absolute inset-0 opacity-20 mix-blend-screen" aria-hidden />
          <div className="absolute inset-0 bg-gradient-to-b from-canvas/60 via-canvas/30 to-canvas/85" aria-hidden />
          <div className="relative z-10 max-w-3xl">
            <SectionHeading
              eyebrow="404"
              title="Page not found"
              titleId="not-found-heading"
              description="The page you were looking for does not exist or is no longer available."
            />
            <p className="mt-6 text-base leading-8 text-ink-soft sm:text-lg">
              Only published pages are available here. If you were looking for a writing piece or framework, the
              Writing and Creative Systems pages are the best place to start.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <SignalButton href="/">Home</SignalButton>
              <SignalButton href="/writing" variant="ghost">
                Writing
              </SignalButton>
              <SignalButton href="/creative-systems" variant="ghost">
                Creative Systems
              </SignalButton>
              <SignalButton href="/contact" variant="ghost">
                Contact
              </SignalButton>
            </div>
            <div className="mt-8">
              <Link href="/anadi-mishra" className="text-sm uppercase tracking-[0.18em] text-accent-blue hover:text-ink">
                Visit the biography
              </Link>
            </div>
          </div>
        </section>
      </MotionReveal>

      <GrooveBand className="mt-8 opacity-90" />
    </Container>
  );
}
