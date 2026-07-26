/**
 * The app scrolls inside `.app-shell` (not the document body) so that mobile
 * browsers never collapse their URL bar — which used to flash a white strip over
 * the fixed bottom nav on the first scroll. These helpers give components a
 * single place to read/observe the real scroll position instead of `window`.
 */

/** The element that actually scrolls. Falls back to null before mount. */
export function getScrollEl(): HTMLElement | null {
  return document.querySelector<HTMLElement>(".app-shell");
}

/** Current vertical scroll offset of the app (app-shell, or window fallback). */
export function getScrollTop(): number {
  const el = getScrollEl();
  return el ? el.scrollTop : window.scrollY;
}

/**
 * Subscribe to scroll on the app's scroll container. Returns an unsubscribe fn.
 * Falls back to `window` if the shell isn't in the DOM yet.
 */
export function onAppScroll(handler: () => void): () => void {
  const el = getScrollEl();
  const target: HTMLElement | Window = el ?? window;
  target.addEventListener("scroll", handler, { passive: true });
  return () => target.removeEventListener("scroll", handler);
}

/** Scroll the app back to the top. */
export function scrollAppToTop(behavior: ScrollBehavior = "auto"): void {
  const el = getScrollEl();
  if (el) el.scrollTo({ top: 0, left: 0, behavior });
  else window.scrollTo({ top: 0, left: 0, behavior });
}

/**
 * Lock/unlock background scrolling while a full-screen sheet/modal is open.
 * The body no longer scrolls, so the lock has to target `.app-shell` (with a
 * `<body>` fallback for safety).
 */
export function setAppScrollLocked(locked: boolean): void {
  const el = getScrollEl();
  if (el) el.style.overflow = locked ? "hidden" : "";
  else document.body.style.overflow = locked ? "hidden" : "";
}
