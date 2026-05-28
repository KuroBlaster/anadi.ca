import { cn } from "@/lib/cn";
import { normalizeOptionalHttpUrl, toYouTubeEmbedUrl } from "@/lib/media";

type YouTubeEmbedProps = {
  className?: string;
  youtubeUrl?: string | null;
  title?: string;
};

export function YouTubeEmbed({ className, youtubeUrl, title = "Watch on YouTube" }: YouTubeEmbedProps) {
  let normalizedYoutubeUrl: string | null = null;

  try {
    normalizedYoutubeUrl = normalizeOptionalHttpUrl(youtubeUrl, "YouTube URL");
  } catch {
    return null;
  }

  if (!normalizedYoutubeUrl) {
    return null;
  }

  const embedUrl = toYouTubeEmbedUrl(normalizedYoutubeUrl);

  return (
    <section className={cn("space-y-4", className)}>
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      {embedUrl ? (
        <div className="overflow-hidden rounded-2xl border border-edge bg-black">
          <div className="aspect-video">
            <iframe
              title={title}
              className="h-full w-full"
              src={embedUrl}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      ) : null}
      <p className="text-sm leading-7 text-ink-soft">
        {embedUrl ? "Watch the full video on " : "Open the video on "}
        <a
          href={normalizedYoutubeUrl}
          target="_blank"
          rel="noreferrer"
          className="text-accent-crimson hover:text-ink"
        >
          YouTube
        </a>
        .
      </p>
    </section>
  );
}
