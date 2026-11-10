import "@testing-library/jest-dom/vitest";

// Repository calls use relative URLs ("/api/...") — fine in a real browser
// (resolved against the page's own origin), but Vitest's jsdom environment
// uses Node's global fetch, which has no page location to resolve a
// relative URL against and throws a URL-parse error. No unit test in this
// suite exercises real network behavior (that's what the e2e suite is
// for), so stub fetch to resolve harmlessly instead of logging noise on
// every render that happens to trigger a fire-and-forget repository call
// (e.g. useBookingForm's booking-draft persistence).
if (typeof globalThis.fetch === "function") {
  const originalFetch = globalThis.fetch.bind(globalThis);
  globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    if (url.startsWith("/")) {
      return Promise.resolve(new Response(null, { status: 204 }));
    }
    return originalFetch(input, init);
  }) as typeof fetch;
}
