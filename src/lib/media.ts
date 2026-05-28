export function normalizeOptionalHttpUrl(value: string | null | undefined, label = "URL") {
  const trimmed = value?.trim();

  if (!trimmed) {
    return null;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error("Invalid protocol");
    }
    return parsed.toString();
  } catch {
    throw new Error(`${label} must be a valid http(s) URL.`);
  }
}

export function normalizeOptionalImageUrl(value: string | null | undefined, label = "Image URL") {
  const trimmed = value?.trim();

  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  return normalizeOptionalHttpUrl(trimmed, label);
}

export function normalizeRequiredHttpUrl(value: string, label = "URL") {
  const normalized = normalizeOptionalHttpUrl(value, label);
  if (!normalized) {
    throw new Error(`${label} is required.`);
  }
  return normalized;
}

function extractYouTubeVideoId(rawUrl: string) {
  try {
    const parsed = new URL(rawUrl);
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      const [videoId] = parsed.pathname.split("/").filter(Boolean);
      return videoId ?? null;
    }

    if (host === "youtube.com" || host.endsWith(".youtube.com")) {
      const pathParts = parsed.pathname.split("/").filter(Boolean);

      if (pathParts[0] === "watch") {
        return parsed.searchParams.get("v");
      }

      if (pathParts[0] === "embed" || pathParts[0] === "shorts" || pathParts[0] === "live") {
        return pathParts[1] ?? null;
      }
    }

    return null;
  } catch {
    return null;
  }
}

export function toYouTubeEmbedUrl(rawUrl: string | null | undefined) {
  if (!rawUrl) {
    return null;
  }

  const videoId = extractYouTubeVideoId(rawUrl);
  if (!videoId) {
    return null;
  }

  return `https://www.youtube.com/embed/${videoId}`;
}

export function toYouTubeThumbnailUrl(rawUrl: string | null | undefined, quality: "default" | "mqdefault" | "hqdefault" | "sddefault" | "maxresdefault" = "hqdefault") {
  if (!rawUrl) {
    return null;
  }

  const videoId = extractYouTubeVideoId(rawUrl);
  if (!videoId) {
    return null;
  }

  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}
