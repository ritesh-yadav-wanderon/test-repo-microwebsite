import { test, expect } from "@playwright/test";

// Pixel-regression baseline: mobile and desktop designs must not drift from
// these stored snapshots. Originally captured while this repo still ran a
// parallel Vite/React Router app (the pixel-parity bar for the Next.js
// migration) — now that the migration is complete and Vite has been fully
// decommissioned, this is a plain regression suite against the Next.js app's
// own prior renders.
//
// Pages chosen to cover the whole app: static/no-fetch pages (Legal,
// PaymentSuccess, ...) and live-data pages (Home, SearchResults, Destination,
// TripDetail). Live-data pages show REAL Mongo-backed content — masked where
// the exact trips/images returned can legitimately shift between test runs
// as the underlying data changes, so only genuine layout/design regressions
// fail the check.

const VIEWPORTS = {
  mobile: { width: 390, height: 844 },
  desktop: { width: 1440, height: 900 },
} as const;

/** A fixed, fake logged-in user — seeded straight into localStorage before
 *  navigation (bypassing the OTP-login UI) so an auth-gated page's real
 *  content renders instead of the logged-out redirect. Matches the exact
 *  shape AuthContext reads via usePersistentState(STORAGE_KEYS.user, ...). */
const FAKE_USER = JSON.stringify({ phone: "9999999999", countryCode: "+91", name: "E2E Tester" });

const PAGES: {
  name: string;
  path: string;
  maskSelectors?: string[];
  maxDiffPixelRatio?: number;
  waitMs?: number;
  seedLocalStorage?: Record<string, string>;
}[] = [
  // The hero search bar's `backdrop-filter: blur()` panel over a
  // photographic background shows a small GPU-blur-sampling-noise diff
  // between runs even with no real content/layout change (verified at both
  // breakpoints: mobile ~0.01%, desktop ~0.09% of pixels, always the same
  // sliver at the search-bar field divider) — a ratio-based tolerance
  // absorbs just that; a real regression would differ by orders of
  // magnitude more.
  { name: "home", path: "/", maxDiffPixelRatio: 0.005 },
  // Real Mongo-backed results (server-fetched, no `?filters`) — the specific
  // trips/count can shift as the dataset changes, so the card grid and the
  // "N Trips Found" count are masked; everything else (header, filters,
  // layout) still enforces a real regression check.
  {
    name: "search-results",
    path: "/search",
    // Mobile (SearchResultsView) and desktop (DesktopSearchResults) render
    // two separate trees with their own class names (.sr-* vs .dsr-*) — a
    // mask locator that matches nothing in the current tree just silently
    // no-ops rather than erroring, so listing only the mobile classes here
    // left desktop's card grid completely unmasked (caught when it started
    // failing intermittently on live-data timing, not on load).
    maskSelectors: [".sr-cards", ".sr-count", ".dsr-grid", ".dsr-count"],
    waitMs: 1500,
    // Small text-edge anti-aliasing noise outside the masked area (nav/
    // filter-pill labels) after a cold server start — same category as
    // home's documented GPU-rendering noise, not a content regression.
    maxDiffPixelRatio: 0.002,
  },
  // Trip-card photos masked for the same reason (real live trips, whose
  // count/content can shift between runs as the dataset changes) — a wider
  // tolerance absorbs a sliver of an edge card shifting in/out of the masked
  // area at the horizontal-scroll row's right edge.
  {
    name: "destination",
    path: "/destination/Europe",
    maskSelectors: [".tc", ".tdp2-more-vm-card"],
    maxDiffPixelRatio: 0.015,
  },
  // No `?id=` — renders the deterministic STATIC_DATA fixture (real ids are
  // exercised separately, by hand, since a specific product's Mongo _id
  // can't be pinned in a snapshot test).
  { name: "trip-detail", path: "/trip/sample-trip" },
  { name: "booking", path: "/booking" },
  // Not logged in, so this opens straight into the LoginSheet overlay (the
  // page's own direct-link guard) — that overlay is itself part of the
  // deterministic baseline being pinned down here.
  { name: "booking-personal-details", path: "/booking/personal-details" },
  { name: "payment-success", path: "/bookings/WON999999/success" },
  { name: "my-booking", path: "/bookings/WON999999" },
  { name: "my-bookings", path: "/bookings" },
  { name: "legal", path: "/legal" },
  { name: "cancellation", path: "/bookings/WON999999/cancellation" },
  { name: "notifications", path: "/notifications" },
  { name: "payments", path: "/payments" },
  { name: "my-profile", path: "/my-profile" },
  // Both pages' hero <video> genuinely decodes/plays frame-to-frame in this
  // headless browser — under load (full-suite runs, not isolated ones) that
  // fails toHaveScreenshot's built-in screenshot-stability check, not a real
  // bug. Masked instead of relying on timing.
  { name: "events", path: "/events", maskSelectors: [".ev-hero-img"] },
  // EventDetail also shows a skeleton for its first 900ms (deliberate,
  // matching the real page's own settle-in delay) — wait past that too.
  {
    name: "event-detail",
    path: "/event/tomorrowland-belgium-orbyz",
    waitMs: 1300,
    maskSelectors: [".epd-hero-video", ".depd__hero-video"],
  },
  // Auth-gated — seeded logged-in so the real page renders instead of the
  // logged-out redirect.
  { name: "profile", path: "/profile", seedLocalStorage: { wanderon_user: FAKE_USER } },
  { name: "compare", path: "/compare" },
  { name: "wishlist", path: "/wishlist" },
  { name: "support", path: "/support" },
  // Desktop-only — on mobile this redirects straight to the trip page, so
  // the mobile baseline pins down that redirected destination, not a blank
  // gallery render.
  { name: "trip-gallery", path: "/trip/sample-trip/gallery" },
];

for (const viewportName of Object.keys(VIEWPORTS) as (keyof typeof VIEWPORTS)[]) {
  test.describe(`visual baseline — ${viewportName}`, () => {
    // Screenshot comparison + "wait for fonts to load" is sensitive to
    // system load — under several parallel workers it intermittently times
    // out waiting for fonts (not a pixel mismatch, just contention). Forcing
    // this suite to run serially, with a longer expect timeout, trades a
    // little wall-clock time for not needing a manual re-run to tell a real
    // regression from a flake.
    test.describe.configure({ mode: "serial" });
    test.use({ viewport: VIEWPORTS[viewportName] });

    for (const { name, path, maskSelectors, maxDiffPixelRatio, waitMs, seedLocalStorage } of PAGES) {
      test(`${name} matches its baseline`, async ({ page, request }) => {
        test.setTimeout(20_000);
        if (seedLocalStorage) {
          await page.addInitScript((data) => {
            for (const [key, value] of Object.entries(data)) localStorage.setItem(key, value);
          }, seedLocalStorage);
        }

        // Visiting either booking route for real creates a booking-draft
        // record via useBookingForm's mount effect — clean it up so repeat
        // runs don't pile up drafts in the real dev database (same
        // discipline as critical-path.spec.ts's own booking test).
        let createdRef: string | null = null;
        if (name === "booking" || name === "booking-personal-details") {
          page.on("request", (req) => {
            if (req.method() !== "POST" || !req.url().includes("/api/bookings")) return;
            try {
              const body = req.postDataJSON() as { orderId?: string };
              if (body?.orderId) createdRef = body.orderId;
            } catch {
              // non-JSON body — not this request
            }
          });
        }

        await page.goto(path);
        // Let content/fallback state settle (product-list fetch resolution,
        // any mount-time layout shift) before the screenshot.
        await page.waitForTimeout(waitMs ?? 800);
        try {
          await expect(page).toHaveScreenshot(`${name}-${viewportName}.png`, {
            fullPage: true,
            animations: "disabled",
            timeout: 15_000,
            mask: maskSelectors?.map((sel) => page.locator(sel)),
            // A small floor applies even where a page sets no override: sub-
            // pixel font-hinting/anti-aliasing can drift a handful of pixels
            // between runs separated by a real OS/browser update (observed
            // on trip-detail — fully static STATIC_DATA content, so it isn't
            // a live-data artifact), not a genuine rendering regression.
            maxDiffPixelRatio: maxDiffPixelRatio ?? 0.001,
          });
        } finally {
          if (createdRef) {
            await request.delete(`/api/bookings?orderId=${createdRef}`);
          }
        }
      });
    }
  });
}
