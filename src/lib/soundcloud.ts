type SoundcloudTrack = {
  title: string;
  url: string;
  embedUrl: string;
};

const EXCLUDED_PATH_SUFFIXES = new Set(["likes", "sets", "tracks", "comments"]);

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

export function toEmbedUrl(trackUrl: string, colorHex = "3f66b4") {
  return `https://w.soundcloud.com/player/?url=${encodeURIComponent(
    trackUrl,
  )}&color=%23${colorHex}&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=true&visual=false`;
}

export async function getLatestSoundcloudTracks(
  profileUrl: string,
  options?: {
    limit?: number;
    fallbackTracks?: SoundcloudTrack[];
  },
): Promise<SoundcloudTrack[]> {
  const limit = options?.limit ?? 3;
  const fallbackTracks = options?.fallbackTracks ?? [];

  try {
    const profile = new URL(profileUrl);
    const pathname = profile.pathname.replace(/\/$/, "");
    const response = await fetch(profileUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return fallbackTracks.slice(0, limit);
    }

    const html = await response.text();
    const regex =
      /<h2[^>]*itemprop="name"[^>]*>\s*<a[^>]*itemprop="url"[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/gim;

    const tracks: SoundcloudTrack[] = [];
    const seen = new Set<string>();
    const colors = ["3f66b4", "b19358", "5f2732"];
    let match: RegExpExecArray | null;

    while ((match = regex.exec(html)) !== null && tracks.length < limit) {
      const href = match[1]?.trim();
      const rawTitle = match[2]?.trim();
      if (!href || !rawTitle) {
        continue;
      }

      const url = new URL(href, "https://soundcloud.com").toString();
      const trackPath = new URL(url).pathname.replace(/\/$/, "");
      const pathParts = trackPath.split("/").filter(Boolean);

      const isProfileTrackPath = trackPath.startsWith(`${pathname}/`);
      const lastPart = pathParts[pathParts.length - 1];
      const isUtilityPath = EXCLUDED_PATH_SUFFIXES.has(lastPart ?? "");

      if (!isProfileTrackPath || isUtilityPath || seen.has(url)) {
        continue;
      }

      seen.add(url);
      tracks.push({
        title: decodeHtml(rawTitle),
        url,
        embedUrl: toEmbedUrl(url, colors[tracks.length % colors.length]),
      });
    }

    if (tracks.length > 0) {
      return tracks;
    }

    return fallbackTracks.slice(0, limit);
  } catch {
    return fallbackTracks.slice(0, limit);
  }
}
