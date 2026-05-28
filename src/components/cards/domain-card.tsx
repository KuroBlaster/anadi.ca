import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type DomainCardProps = {
  title: string;
  description: ReactNode;
  cue?: string;
  className?: string;
};

export function DomainCard({ title, description, cue, className }: DomainCardProps) {
  return (
    <article
      className={cn(
        "surface-card group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-blue/50",
        className,
      )}
    >
      {cue ? <p className="mb-4 font-mono text-xs uppercase tracking-[0.24em] text-accent-blue">{cue}</p> : null}
      <h3 className="font-display text-xl tracking-[0.02em] text-ink">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-ink-soft">{description}</p>
    </article>
  );
}
