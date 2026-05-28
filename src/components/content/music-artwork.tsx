/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { cn } from "@/lib/cn";

type MusicArtworkProps = {
  alt: string;
  className?: string;
  framed?: boolean;
  imageUrl?: string | null;
  fit?: "cover" | "contain";
  title: string;
  variant?: "hero" | "thumb";
  priority?: boolean;
  sizes?: string;
};

const aspectClasses = {
  hero: "aspect-[16/9]",
  thumb: "aspect-[4/3]",
};

export function MusicArtwork({
  alt,
  className,
  framed = true,
  imageUrl,
  fit = "cover",
  title,
  variant = "hero",
  priority = false,
  sizes,
}: MusicArtworkProps) {
  const aspectClassName = aspectClasses[variant];
  const defaultSizes =
    sizes ??
    (variant === "hero"
      ? "(min-width: 1024px) 420px, (min-width: 640px) 60vw, 100vw"
      : "(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw");

  if (imageUrl) {
    const isLocalImage = imageUrl.startsWith("/");

    return (
      <figure
        className={cn(
          framed ? "overflow-hidden rounded-2xl border border-edge/80 bg-canvas-soft" : "overflow-hidden",
          className,
        )}
      >
        <div className={cn("relative w-full overflow-hidden", aspectClassName)}>
          {isLocalImage ? (
            <Image
              src={imageUrl}
              alt={alt}
              fill
              priority={priority}
              sizes={defaultSizes}
              className={cn(
                "absolute inset-0 h-full w-full",
                fit === "contain" ? "object-contain bg-canvas-soft" : "object-cover",
              )}
            />
          ) : (
            // Remote image URLs are intentionally rendered without Next image optimization.
            <img
              src={imageUrl}
              alt={alt}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              className={cn(
                "absolute inset-0 h-full w-full",
                fit === "contain" ? "object-contain bg-canvas-soft" : "object-cover",
              )}
            />
          )}
        </div>
      </figure>
    );
  }

  return (
    <figure
      className={cn(
        framed
          ? "overflow-hidden rounded-2xl border border-edge/80 bg-gradient-to-br from-accent-blue/15 via-canvas-soft to-accent-gold/15"
          : "overflow-hidden bg-gradient-to-br from-accent-blue/15 via-canvas-soft to-accent-gold/15",
        className,
      )}
    >
      <div className={cn("relative w-full overflow-hidden", aspectClassName)}>
        <div className="absolute inset-0 flex items-end p-5">
          <div>
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-ink-soft">Music</p>
            <p className="mt-2 max-w-[18ch] font-display text-2xl leading-tight text-ink">{title}</p>
          </div>
        </div>
      </div>
    </figure>
  );
}
