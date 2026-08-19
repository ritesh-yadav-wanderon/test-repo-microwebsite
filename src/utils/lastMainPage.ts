/** Remembers the last "main website" page (home, listing, destination,
 *  trip details) so account pages can exit back to the site. */

import type { NavigateFunction } from "react-router-dom";

const KEY = "wanderon_last_main_page";

const MAIN_ROUTES = [
  /^\/$/,
  /^\/search$/,
  /^\/destination\/[^/]+$/,
  /^\/trip\/[^/]+$/,
];

interface MainPage {
  url: string;
  /** History position of that visit, when the router exposes one. */
  idx: number | null;
}

/** React Router numbers every history entry it creates. Knowing the number of
 *  the main page we came from lets us step back to it rather than pushing a
 *  second copy on top — otherwise its own back button returns to the account
 *  page the user just left. */
function historyIndex(): number | null {
  const idx = (window.history.state as { idx?: number } | null)?.idx;
  return typeof idx === "number" ? idx : null;
}

/** Call on every route change; stores the URL only for main-site pages. */
export function trackMainPage(pathname: string, search = ""): void {
  if (!MAIN_ROUTES.some((r) => r.test(pathname))) return;
  const page: MainPage = { url: pathname + search, idx: historyIndex() };
  try {
    sessionStorage.setItem(KEY, JSON.stringify(page));
  } catch {
    /* storage unavailable — exit falls back to home */
  }
}

function readMainPage(): MainPage {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as MainPage;
  } catch {
    /* fall through to the default below */
  }
  return { url: "/", idx: null };
}

/** Last visited main-site page, defaulting to the homepage. */
export function getLastMainPage(): string {
  return readMainPage().url;
}

/** Leave the account section for the site page the user came from, unwinding
 *  the account pages out of the history instead of stacking on top of them. */
export function exitToMainPage(navigate: NavigateFunction): void {
  const { url, idx } = readMainPage();
  const current = historyIndex();
  if (idx !== null && current !== null && current > idx) {
    navigate(idx - current);
    return;
  }
  navigate(url, { replace: true });
}
