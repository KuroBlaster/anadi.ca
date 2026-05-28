import Link from "next/link";
import { cn } from "@/lib/cn";

type SignalButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
};

export function SignalButton({
  href,
  children,
  variant = "primary",
  className,
  target,
  rel,
}: SignalButtonProps) {
  const buttonClassName = cn(
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm uppercase tracking-[0.18em] transition-all duration-300",
    variant === "primary"
      ? "bg-accent-gold/90 text-canvas hover:-translate-y-0.5 hover:bg-accent-gold hover:shadow-[0_0_30px_rgba(190,163,104,0.35)]"
      : "border border-edge bg-canvas-soft/40 text-ink hover:-translate-y-0.5 hover:border-accent-blue/80 hover:text-white hover:shadow-[0_0_24px_rgba(71,114,200,0.22)]",
    className,
  );
  const isExternal = /^https?:\/\//.test(href);

  if (isExternal) {
    return (
      <a href={href} target={target} rel={rel} className={buttonClassName}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={buttonClassName}>
      {children}
    </Link>
  );
}
