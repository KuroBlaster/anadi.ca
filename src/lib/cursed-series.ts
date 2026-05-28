export const CURSED_SERIES_COOKIE = "anadi_cursed_series";

export type CursedSeriesContentType = "works" | "music";

export function buildCursedSeriesKey(contentType: CursedSeriesContentType, slug: string) {
  return `${contentType}:${slug}`;
}

export function parseCursedSeriesConsent(value: string | null | undefined) {
  if (!value) {
    return new Set<string>();
  }

  return new Set(
    value
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean),
  );
}

export function serializeCursedSeriesConsent(value: string | null | undefined, key: string) {
  const consent = parseCursedSeriesConsent(value);
  consent.add(key);
  return [...consent].join("|");
}

export function hasCursedSeriesConsent(value: string | null | undefined, key: string) {
  return parseCursedSeriesConsent(value).has(key);
}
