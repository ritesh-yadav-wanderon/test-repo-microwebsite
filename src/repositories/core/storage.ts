// Web-storage gateway. Repositories and contexts persist through this module so
// every key is declared in one place and no caller has to repeat the
// JSON.parse/try-catch dance (storage throws in private mode and on quota).

export const STORAGE_KEYS = {
  user: "wanderon_user",
  wishlist: "wanderon_wishlist",
  compare: "wanderon_compare",
  bookingStatus: "wanderon_booking_status",
  tickets: "wanderon_tickets",
  recentDestinations: "wanderon:recent-destinations",
  lastMainPage: "wanderon_last_main_page",
} as const;

type Scope = "local" | "session";

function store(scope: Scope): Storage | null {
  try {
    return scope === "session" ? window.sessionStorage : window.localStorage;
  } catch {
    return null;
  }
}

/** Read and parse a JSON value, returning `fallback` when absent or corrupt. */
export function readJSON<T>(key: string, fallback: T, scope: Scope = "local"): T {
  try {
    const raw = store(scope)?.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Serialise a value. Passing `null`/`undefined` removes the key. */
export function writeJSON(key: string, value: unknown, scope: Scope = "local"): void {
  try {
    const s = store(scope);
    if (!s) return;
    if (value === null || value === undefined) s.removeItem(key);
    else s.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode / quota — persistence is best-effort */
  }
}

export function removeKey(key: string, scope: Scope = "local"): void {
  try {
    store(scope)?.removeItem(key);
  } catch {
    /* ignore */
  }
}
