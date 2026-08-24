// Image delivery. CMS images live on Gumlet, an optimisation CDN that resizes
// and re-encodes on the fly from query parameters. Requesting the originals
// costs megabytes per card (a 358px card was pulling a 3.3 MB JPEG), so every
// URL that reaches an <img> should carry the width it will actually render at.
// Format negotiation is automatic — Gumlet answers with AVIF or WebP based on
// the browser's Accept header — so `w` is the only parameter we need.

import { IMAGE_BASE_URL } from "./config";

const CDN_HOST = new URL(IMAGE_BASE_URL).host;

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
 * Ask the CDN for `url` at `width`. Anything not served by Gumlet (sample
 * fixtures, bundled art) is returned untouched, and an existing `w` is
 * replaced so a caller can narrow an already-sized URL.
 */
export function sizedImageUrl(url: string, width: number): string {
  if (!url || !Number.isFinite(width) || width <= 0) return url;
  try {
    const parsed = new URL(url);
    if (parsed.host !== CDN_HOST) return url;
    parsed.searchParams.set("w", String(Math.round(width)));
    return parsed.toString();
  } catch {
    return url; // relative path or malformed — leave it alone
  }
}
