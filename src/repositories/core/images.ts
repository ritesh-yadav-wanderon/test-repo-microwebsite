// Image delivery. CMS images live on Gumlet, an optimisation CDN that resizes
// and re-encodes on the fly from query parameters. Requesting the originals
// costs megabytes per card (a 358px card was pulling a 3.3 MB JPEG), so every
// URL that reaches an <img> should carry the width it will actually render at.
// Format negotiation is automatic — Gumlet answers with AVIF or WebP based on
// the browser's Accept header — so `w` is the only parameter we need.

import { IMAGE_BASE_URL } from "./config";

const CDN_HOST = new URL(IMAGE_BASE_URL).host;

/** The CMS's own origin — Gumlet is configured to pull from this host, so
 *  any URL still pointing at it directly (as raw Mongo product data does)
 *  needs its host swapped to go through the CDN instead. */
const LEGACY_IMAGE_HOST = "images.wanderon.in";

/**
 * Rewrite a legacy `images.wanderon.in` URL onto the Gumlet host (same path/
 * query — Gumlet pulls from the same origin), so every image renders through
 * the CDN. URLs already on Gumlet, and anything else (bundled app assets,
 * sample fixtures), pass through untouched.
 */
export function toGumletUrl(url: string): string {
  if (!url) return url;
  try {
    const parsed = new URL(url);
    if (parsed.host !== LEGACY_IMAGE_HOST) return url;
    parsed.host = CDN_HOST;
    parsed.protocol = "https:";
    return parsed.toString();
  } catch {
    return url; // relative path or malformed — leave it alone
  }
}

/**
 * Render widths in CSS pixels, doubled for retina screens. Named after the
 * surface so the numbers stay tied to the stylesheet that sets them.
 */
export const IMAGE_WIDTHS = {
  /** Listing card — 358px cell (`.dls__cell`), full-bleed on mobile. */
  card: 720,
  /** Desktop carousel card — 198px (`.dtrips__card`). */
  carousel: 400,
  /** Compact "more trips" card — 160px (`.tdp2-more-card-v2`). */
  thumb: 320,
  /** Decorative stacked thumbnails — 40px (`.dtrips__more-mini`). */
  mini: 80,
} as const;

/**
 * Ask the CDN for `url` at `width`, rewriting a legacy `images.wanderon.in`
 * URL onto Gumlet first (see toGumletUrl). Anything still not served by
 * Gumlet after that (sample fixtures, bundled art) is returned untouched,
 * and an existing `w` is replaced so a caller can narrow an already-sized
 * URL.
 */
export function sizedImageUrl(url: string, width: number): string {
  if (!url || !Number.isFinite(width) || width <= 0) return url;
  const gumletUrl = toGumletUrl(url);
  try {
    const parsed = new URL(gumletUrl);
    if (parsed.host !== CDN_HOST) return gumletUrl;
    parsed.searchParams.set("w", String(Math.round(width)));
    return parsed.toString();
  } catch {
    return gumletUrl; // relative path or malformed — leave it alone
  }
}
