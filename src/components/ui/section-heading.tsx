import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  titleId?: string;
  description?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  titleId,
  description,
  align = "left",
  as = "h2",
  className,
}: SectionHeadingProps) {
  const HeadingTag = as;

  return (
    <div className={cn(align === "center" ? "text-center" : "text-left", className)}>
      {eyebrow ? (
        <p className="mb-3 font-mono text-[0.72rem] uppercase tracking-[0.26em] text-accent-gold">
          {eyebrow}
        </p>
      ) : null}
      <HeadingTag id={titleId} className="font-display text-2xl leading-tight tracking-[0.02em] text-ink sm:text-3xl">
        {title}
      </HeadingTag>
      {description ? (
        <p className="mt-4 max-w-2xl text-base leading-8 text-ink-soft sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
