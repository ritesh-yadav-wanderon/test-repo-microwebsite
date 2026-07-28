/** Remembers the last "main website" page (home, listing, destination,
 *  trip details) so account pages can exit back to the site. */

const KEY = "wanderon_last_main_page";

const MAIN_ROUTES = [
  /^\/$/,
  /^\/search$/,
  /^\/destination\/[^/]+$/,
  /^\/trip\/[^/]+$/,
];

/** Call on every route change; stores the URL only for main-site pages. */
export function trackMainPage(pathname: string, search = ""): void {
  if (MAIN_ROUTES.some((r) => r.test(pathname))) {
    try {
      sessionStorage.setItem(KEY, pathname + search);
    } catch {
      /* storage unavailable — exit falls back to home */
    }
  }
}

/** Last visited main-site page, defaulting to the homepage. */
export function getLastMainPage(): string {
  try {
    return sessionStorage.getItem(KEY) || "/";
  } catch {
    return "/";
  }
}
