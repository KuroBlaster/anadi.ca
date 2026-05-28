"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItem } from "@/types/content";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/data/site";

type SiteHeaderProps = {
  navigation: NavItem[];
};

export function SiteHeader({ navigation }: SiteHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-edge/80 bg-canvas/88 backdrop-blur-sm md:bg-canvas/78 md:backdrop-blur-xl">
      <Container className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between md:gap-6 md:py-0">
        <Link href="/anadi-mishra" className="font-display text-lg tracking-[0.14em] text-ink">
          {siteConfig.brandName.toUpperCase()}
        </Link>
        <nav className="flex flex-wrap items-center gap-1 md:justify-end">
          {navigation.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.18em] text-ink-soft transition-all hover:text-ink",
                  active && "bg-canvas-soft text-ink shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </Container>
    </header>
  );
}
