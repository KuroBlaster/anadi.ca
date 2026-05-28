"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type ShareWidgetProps = {
  title: string;
  description: string;
  url?: string;
  label?: string;
  className?: string;
};

type ShareItem = {
  icon: string;
  label: string;
  href?: string;
  onClick?: () => Promise<void> | void;
  separatorAfter?: boolean;
};

async function copyText(value: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // Fall through to the legacy fallback below.
    }
  }

  if (typeof document === "undefined") {
    return false;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, value.length);

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }

  document.body.removeChild(textarea);
  return copied;
}

function buildShareText(title: string, description: string) {
  const summary = description.trim().replace(/\s+/g, " ");
  const baseText = summary ? `${title} - ${summary}` : title;
  return baseText.length > 180 ? `${baseText.slice(0, 177).trimEnd()}...` : baseText;
}

function ShareGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
      <path
        d="M12.5 4.5H15.5V7.5M15.5 4.5L8.5 11.5M8 4.5H5.5C4.395 4.5 3.5 5.395 3.5 6.5V14.5C3.5 15.605 4.395 16.5 5.5 16.5H13.5C14.605 16.5 15.5 15.605 15.5 14.5V12"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function PlatformBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-edge/70 bg-canvas-soft/70 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-ink-soft">
      {children}
    </span>
  );
}

export function ShareWidget({ title, description, url, label = "Share this", className }: ShareWidgetProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [resolvedUrl, setResolvedUrl] = useState(url ?? "");
  const shareUrl = resolvedUrl || (typeof window !== "undefined" ? window.location.href : "");

  useEffect(() => {
    if (!url) {
      setResolvedUrl(window.location.href);
    }
  }, [url]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showStatus = (message: string) => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    setStatus(message);
    timeoutRef.current = window.setTimeout(() => {
      setStatus(null);
      timeoutRef.current = null;
    }, 2400);
  };

  const shareText = useMemo(() => buildShareText(title, description), [description, title]);
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedShareText = encodeURIComponent(shareText);
  const encodedShareWithLink = encodeURIComponent(`${shareText}\n${shareUrl}`);

  const items: ShareItem[] = [
    {
      icon: "CL",
      label: "Copy link",
      onClick: async () => {
        setIsPending(true);
        try {
          const copied = await copyText(shareUrl);
          showStatus(copied ? "Link copied" : "Copy failed");
          setIsOpen(false);
        } finally {
          setIsPending(false);
        }
      },
      separatorAfter: true,
    },
    {
      icon: "b",
      label: "Share on Bluesky",
      href: `https://bsky.app/intent/compose?text=${encodedShareWithLink}`,
    },
    {
      icon: "f",
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      icon: "in",
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      icon: "@",
      label: "Share on Threads",
      href: `https://www.threads.com/intent/post?text=${encodedShareWithLink}`,
    },
    {
      icon: "X",
      label: "Share on X",
      href: `https://x.com/intent/tweet?text=${encodedShareText}&url=${encodedUrl}`,
    },
  ];

  return (
    <div ref={containerRef} className={cn("relative inline-flex flex-col items-start gap-2", className)}>
      <div className="flex items-center gap-2">
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink-soft">{label}</span>
        <button
          type="button"
          aria-label={`${label} options`}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          onClick={() => setIsOpen((next) => !next)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-edge/70 bg-canvas-soft/50 text-ink-soft transition hover:border-accent-blue/70 hover:text-ink"
        >
          <ShareGlyph />
        </button>
      </div>

      {isOpen ? (
        <div className="absolute left-0 top-full z-20 mt-2 w-64 overflow-hidden rounded-2xl border border-edge/80 bg-canvas shadow-[0_18px_40px_rgba(0,0,0,0.24)]">
          {items.map((item) => {
            if (item.onClick) {
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.onClick}
                  disabled={isPending}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-ink-soft transition hover:bg-canvas-soft/70 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50",
                    item.separatorAfter ? "border-b border-edge/70" : null,
                  )}
                >
                  <PlatformBadge>{item.icon}</PlatformBadge>
                  <span>{item.label}</span>
                </button>
              );
            }

            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm text-ink-soft transition hover:bg-canvas-soft/70 hover:text-ink",
                  item.separatorAfter ? "border-b border-edge/70" : null,
                )}
              >
                <PlatformBadge>{item.icon}</PlatformBadge>
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>
      ) : null}

      <span className="min-h-4 text-[0.68rem] text-ink-soft" aria-live="polite">
        {status ?? ""}
      </span>
    </div>
  );
}
