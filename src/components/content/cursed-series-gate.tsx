"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ShareWidget } from "@/components/content/share-widget";
import {
  buildCursedSeriesKey,
  CURSED_SERIES_COOKIE,
  serializeCursedSeriesConsent,
  type CursedSeriesContentType,
} from "@/lib/cursed-series";

type CursedSeriesGateProps = {
  contentType: CursedSeriesContentType;
  slug: string;
  title: string;
  description: string;
  backHref: string;
  backLabel: string;
};

function readCookie(name: string) {
  if (typeof document === "undefined") {
    return null;
  }

  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${name}=`));

  if (!cookie) {
    return null;
  }

  return decodeURIComponent(cookie.slice(name.length + 1));
}

export function CursedSeriesGate({
  contentType,
  slug,
  title,
  description,
  backHref,
  backLabel,
}: CursedSeriesGateProps) {
  const router = useRouter();
  const [acknowledged, setAcknowledged] = useState(false);
  const [isPending, startTransition] = useTransition();
  const contentKey = buildCursedSeriesKey(contentType, slug);

  const enterContent = () => {
    const nextValue = serializeCursedSeriesConsent(readCookie(CURSED_SERIES_COOKIE), contentKey);
    document.cookie = `${CURSED_SERIES_COOKIE}=${encodeURIComponent(nextValue)}; path=/; max-age=2592000; samesite=lax`;
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <section className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] border border-edge/80 bg-[linear-gradient(180deg,rgba(23,25,29,0.96),rgba(15,16,18,0.98))] shadow-[0_28px_80px_rgba(0,0,0,0.46),0_0_0_1px_rgba(255,255,255,0.02)_inset]">
      <div className="h-1 bg-gradient-to-r from-accent-crimson via-accent-gold to-accent-blue opacity-90" />

      <div className="space-y-5 p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <p className="inline-flex rounded-full border border-[#5f2732]/70 bg-[#3a1017] px-3 py-1 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            Cursed Series
          </p>
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-ink-soft">
            Content warning
          </span>
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-3xl tracking-[0.02em] text-ink sm:text-4xl">{title}</h2>
          <p className="max-w-2xl text-base leading-8 text-ink-soft">{description}</p>
        </div>

        <div className="rounded-[1.35rem] border border-accent-crimson/20 bg-[linear-gradient(180deg,rgba(95,39,50,0.12),rgba(23,25,29,0.88))] px-5 py-4 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[#e7a8b1]">
            Before you continue
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#ece9e3]">
            This piece belongs to the Cursed Series. It may contain darker, heavier, or more unsettling material than
            the rest of the archive. Continue only if you are comfortable entering that space.
          </p>
        </div>

        <div className="rounded-[1.35rem] border border-edge/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(23,25,29,0.82))] px-5 py-4 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
          <label className="flex cursor-pointer items-start gap-3 text-sm text-[#ece9e3]">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(event) => setAcknowledged(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-edge bg-canvas text-accent-crimson focus:ring-accent-gold"
            />
            <span>I understand and want to continue to {title}.</span>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-edge/70 pt-4">
          <button
            type="button"
            onClick={enterContent}
            disabled={!acknowledged || isPending}
            className="inline-flex rounded-full border border-[#5f2732]/60 bg-[#4a1018] px-5 py-2.5 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-white shadow-[0_10px_30px_rgba(74,16,24,0.34)] transition hover:bg-[#5c121d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Enter Cursed Series
          </button>
          <Link href={backHref} className="text-sm text-accent-blue hover:text-ink">
            {backLabel}
          </Link>
        </div>

        <ShareWidget label="Share this page" title={title} description={description} className="pt-1" />
      </div>
    </section>
  );
}
