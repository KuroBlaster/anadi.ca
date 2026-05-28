import Link from "next/link";
import { WorkItem } from "@/types/content";

type WorkCardProps = {
  item: WorkItem;
};

export function WorkCard({ item }: WorkCardProps) {
  const defaultCtaByCategory = {
    Writing: "Read essay",
    Music: "Hear track",
    Systems: "View framework",
    Projects: "Open project",
  } as const;

  const ctaLabel = item.ctaLabel ?? defaultCtaByCategory[item.category];

  return (
    <article className="surface-card group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-gold/55">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {item.isCursed ? (
            <span className="rounded-full border border-[#5f2732]/70 bg-[#3a1017] px-3 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              Cursed Series
            </span>
          ) : null}
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-accent-gold">{item.tag}</span>
        </div>
        <span className="rounded-full border border-edge px-3 py-1 font-mono text-[0.63rem] uppercase tracking-[0.18em] text-ink-soft">
          {item.category}
        </span>
      </div>
      <h3 className="font-display text-xl tracking-[0.015em] text-ink">{item.title}</h3>
      <p className="mt-3 text-sm leading-7 text-ink-soft">{item.description}</p>
      {item.link ? (
        <Link
          href={item.link}
          className="mt-5 inline-flex items-center text-sm uppercase tracking-[0.18em] text-accent-blue transition-colors hover:text-ink"
        >
          {ctaLabel}
        </Link>
      ) : null}
    </article>
  );
}
