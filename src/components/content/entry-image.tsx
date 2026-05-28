/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { cn } from "@/lib/cn";

type EntryImageProps = {
  alt: string;
  className?: string;
  imageUrl?: string | null;
  aspectClassName?: string;
  fit?: "cover" | "contain";
  priority?: boolean;
  sizes?: string;
};

export function EntryImage({
  alt,
  className,
  imageUrl,
  aspectClassName = "aspect-[16/9]",
  fit = "cover",
  priority = false,
  sizes = "100vw",
}: EntryImageProps) {
  if (!imageUrl) {
    return null;
  }

  const isLocalImage = imageUrl.startsWith("/");

  return (
    <figure className={cn("overflow-hidden rounded-2xl border border-edge/80 bg-canvas-soft", className)}>
      <div className={cn("relative w-full overflow-hidden", aspectClassName)}>
        {isLocalImage ? (
          <Image
            src={imageUrl}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
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
