import { Container } from "@/components/ui/container";
import { siteConfig } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-edge">
      <Container className="flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-ink-soft">
          {siteConfig.brandName} | Music, Writing, Systems, and Travel | {new Date().getFullYear()}
        </p>
      </Container>
    </footer>
  );
}
