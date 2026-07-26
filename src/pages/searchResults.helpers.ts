import type { Trip } from "../types";

/* Shared listing helpers used by both the mobile `SearchResults` page and the
   desktop `DesktopSearchResults` component. Kept in their own module so the two
   don't import each other (which created a circular dependency). */

/* Wooden button "tap" synthesized with the Web Audio API (no asset needed).
   A tiny noise impulse excites a few resonant band-pass modes tuned to woody
   frequencies (modal synthesis), giving a warm, hollow "tock". */
let tapAudioCtx: AudioContext | null = null;
export function playTapSound() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    if (!tapAudioCtx) tapAudioCtx = new Ctx();
    if (tapAudioCtx.state === "suspended") void tapAudioCtx.resume();
    const ctx = tapAudioCtx;
    const now = ctx.currentTime;

    // Short noise impulse — the "strike" that excites the wood.
    const dur = 0.007;
    const size = Math.floor(ctx.sampleRate * dur);
    const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < size; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / size);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Keep it warm — roll off the harsh highs.
    const out = ctx.createGain();
    out.gain.value = 0.9;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 3200;
    lp.connect(out).connect(ctx.destination);

    // Resonant woody modes (frequency, Q, level, decay).
    const modes = [
      { f: 210, q: 14, g: 1.0, d: 0.20 },
      { f: 560, q: 11, g: 0.55, d: 0.13 },
      { f: 1150, q: 9, g: 0.28, d: 0.08 },
    ];
    for (const m of modes) {
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = m.f;
      bp.Q.value = m.q;
      const g = ctx.createGain();
      g.gain.setValueAtTime(m.g, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + m.d);
      noise.connect(bp).connect(g).connect(lp);
    }

    noise.start(now);
    noise.stop(now + dur);
  } catch {
    /* ignore audio errors (e.g. autoplay restrictions) */
  }
}

export function fmtDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

export function fmtMonthLabel(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

function closeMatch(needle: string, haystack: string[]): boolean {
  const n = needle.toLowerCase();
  return haystack.some(h => h.toLowerCase().includes(n) || n.includes(h.toLowerCase()));
}

function parsePriceNum(price: string): number {
  return Number(String(price).replace(/[₹,\s/\-]/g, "")) || 0;
}

export type SortKey = "price-asc" | "price-desc" | "duration" | "recent";

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "duration", label: "Duration: Short to Long" },
  { key: "recent", label: "Recent Batch" },
];

/** Nearest upcoming batch timestamp; trips without batches sort last. */
function nearestBatchTime(trip: Trip): number {
  const batches = trip.batches ?? [];
  if (!batches.length) return Infinity;
  const now = Date.now();
  const times = batches
    .map(b => new Date(b + "T00:00:00").getTime())
    .filter(t => !Number.isNaN(t));
  if (!times.length) return Infinity;
  const upcoming = times.filter(t => t >= now);
  return upcoming.length ? Math.min(...upcoming) : Math.min(...times);
}

export function sortTrips(trips: Trip[], sortBy: SortKey | null): Trip[] {
  if (!sortBy) return trips;
  const out = [...trips];
  switch (sortBy) {
    case "price-asc":
      out.sort((a, b) => parsePriceNum(a.startingPrice) - parsePriceNum(b.startingPrice));
      break;
    case "price-desc":
      out.sort((a, b) => parsePriceNum(b.startingPrice) - parsePriceNum(a.startingPrice));
      break;
    case "duration":
      out.sort((a, b) => (a.duration?.nights ?? Infinity) - (b.duration?.nights ?? Infinity));
      break;
    case "recent":
      out.sort((a, b) => nearestBatchTime(a) - nearestBatchTime(b));
      break;
  }
  return out;
}

function matchesCategory(label: string, trip: Trip): boolean {
  const price = parsePriceNum(trip.startingPrice);
  const cats = (trip.categories ?? []).join(" ").toLowerCase();
  switch (label) {
    case "Adventure":
      return cats.includes("adventure") || cats.includes("backpack") ||
             cats.includes("trek") || cats.includes("bike") || cats.includes("hiking");
    case "Luxury":
      return price > 100000 || cats.includes("luxury");
    case "Budget Trips":
      return price < 25000;
    case "Events and Festivals":
      return cats.includes("festival") || cats.includes("event");
    case "Wellness":
      return cats.includes("wellness") || cats.includes("yoga");
    default:
      return false;
  }
}

export function filterTrips(trips: Trip[], params: URLSearchParams): Trip[] {
  const destination   = params.get("destination") ?? "";
  const months        = params.get("months") ?? "";
  const dateFrom      = params.get("from") ?? "";
  const dateTo        = params.get("to") ?? "";
  const category      = params.get("category") ?? "";
  const bucketList    = params.get("bucketList") ?? "";
  // planningWith, addons, fromCity, accommodation stored in URL but not filterable against API
  // — they still show as chips for the user

  const selDests   = destination ? destination.split(",").map(s => s.trim()).filter(Boolean) : [];
  const selMonths  = months ? months.split(",") : [];
  const selCats    = category ? category.split(",").map(s => s.trim()).filter(Boolean) : [];
  const selBucket  = bucketList ? bucketList.split(",").map(s => s.trim()).filter(Boolean) : [];

  return trips.filter(trip => {
    // Destination — match filter slug/keyword against trip title + destination titles + destination slugs
    if (selDests.length) {
      const searchable = [
        trip.title,
        ...(trip.skeletonItinerary ?? []),
        ...(trip.destinations?.map(d => d.title) ?? []),
        ...(trip.destinations?.map(d => d.slug) ?? []),
      ];
      if (!selDests.some(d => closeMatch(d, searchable))) return false;
    }

    // Category label → API category slugs + price
    if (selCats.length) {
      if (!selCats.some(cat => matchesCategory(cat, trip))) return false;
    }

    // Month filter — any batch starts with YYYY-MM
    if (selMonths.length) {
      const batches = trip.batches ?? [];
      if (!selMonths.some(ym => batches.some(b => b.startsWith(ym)))) return false;
    }

    // Date range filter — any batch within from/to window
    if (dateFrom || dateTo) {
      const batches = trip.batches ?? [];
      const from = dateFrom ? new Date(dateFrom + "T00:00:00").getTime() : -Infinity;
      const to   = dateTo   ? new Date(dateTo   + "T00:00:00").getTime() :  Infinity;
      if (!batches.some(b => { const t = new Date(b + "T00:00:00").getTime(); return t >= from && t <= to; })) return false;
    }

    // Bucket list — each entry close-matches destination titles or trip title
    if (selBucket.length) {
      const searchable = [
        trip.title,
        ...(trip.destinations?.map(d => d.title) ?? []),
        ...(trip.skeletonItinerary ?? []),
      ];
      if (!selBucket.some(entry => closeMatch(entry, searchable))) return false;
    }

    return true;
  });
}
