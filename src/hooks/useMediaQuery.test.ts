import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMediaQuery } from "./useMediaQuery";

/** Minimal MediaQueryList fake with a working addEventListener/removeEventListener
 *  and a way to trigger a "change" from the test. */
function fakeMediaQueryList(initialMatches: boolean) {
  let matches = initialMatches;
  const listeners = new Set<(e: MediaQueryListEvent) => void>();
  const mql = {
    get matches() {
      return matches;
    },
    media: "",
    addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => listeners.add(cb),
    removeEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => listeners.delete(cb),
    // Test-only helper, not part of the real MediaQueryList API.
    __trigger(next: boolean) {
      matches = next;
      listeners.forEach((cb) => cb({ matches: next } as MediaQueryListEvent));
    },
  };
  return mql;
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("useMediaQuery", () => {
  it("returns the real matchMedia value on the client", () => {
    const mql = fakeMediaQueryList(true);
    vi.spyOn(window, "matchMedia").mockReturnValue(mql as unknown as MediaQueryList);

    const { result } = renderHook(() => useMediaQuery("(min-width: 1024px)", false));
    expect(result.current).toBe(true);
  });

  it("updates when the media query's match state changes", () => {
    const mql = fakeMediaQueryList(false);
    vi.spyOn(window, "matchMedia").mockReturnValue(mql as unknown as MediaQueryList);

    const { result } = renderHook(() => useMediaQuery("(min-width: 1024px)", false));
    expect(result.current).toBe(false);

    act(() => mql.__trigger(true));
    expect(result.current).toBe(true);
  });

  // The actual "doesn't crash under SSR" property (no `window` at all) can't
  // be faithfully simulated here — @testing-library/react's renderHook needs
  // a DOM to mount into, so a jsdom unit test can't remove `window` without
  // breaking the test renderer itself. That property is verified for real
  // instead by actually server-rendering this hook inside the Next.js app
  // (see web-next) rather than faked here.
});
