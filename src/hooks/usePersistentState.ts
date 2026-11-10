import { useCallback, useRef, useSyncExternalStore } from "react";
import { readJSON, writeJSON } from "@/repositories";

type Scope = "local" | "session";

function rawStorage(scope: Scope): Storage | null {
  try {
    return scope === "session" ? window.sessionStorage : window.localStorage;
  } catch {
    return null;
  }
}

function readRaw(key: string, scope: Scope): string | null {
  try {
    return rawStorage(scope)?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

// Per-key cache of the last-seen raw string alongside its parsed value.
// `useSyncExternalStore` requires `getSnapshot` to return a referentially
// stable result when nothing changed — JSON.parse allocates a new
// array/object on every call, which without this cache causes an infinite
// render loop (React sees a "new" snapshot every time and re-renders
// forever) for any non-primitive stored value.
const cache = new Map<string, { raw: string | null; value: unknown }>();

function getSnapshot<T>(key: string, fallback: T, scope: Scope): T {
  const raw = readRaw(key, scope);
  const cached = cache.get(key);
  if (cached && cached.raw === raw) return cached.value as T;
  const value = readJSON<T>(key, fallback, scope);
  cache.set(key, { raw, value });
  return value;
}

// Same-tab pub/sub: the native `storage` event only fires in OTHER tabs, but
// two contexts/components reading the same key in this tab still need to
// see each other's writes immediately.
const listeners = new Map<string, Set<() => void>>();

function notify(key: string) {
  listeners.get(key)?.forEach((cb) => cb());
}

function subscribe(key: string) {
  return (onChange: () => void) => {
    let set = listeners.get(key);
    if (!set) {
      set = new Set();
      listeners.set(key, set);
    }
    set.add(onChange);
    return () => set!.delete(onChange);
  };
}

/**
 * SSR-safe localStorage/sessionStorage-backed state, generalizing the
 * `useState(() => readJSON(...))` + `useEffect(() => writeJSON(...))` pattern
 * every context in src/context/ used to duplicate (only AuthContext had an
 * explicit `authReady` flag guarding the mismatch; the other three had none).
 *
 * Built on `useSyncExternalStore`, same as useMediaQuery: the server render
 * and React's first client render pass both use `fallback` (no
 * `window`/storage touched, no hydration-mismatch warning), and the real
 * stored value takes over immediately after, in the same commit — no manual
 * "ready" gate or extra effect needed for that part.
 *
 * `ready` is still exposed (mirrors the old `authReady`) for callers that
 * gate a decision on "are we definitely running client-side yet", not just
 * "do we have the final value" — but it has to go through this SAME
 * `useSyncExternalStore` call (not a plain `typeof window !== "undefined"`
 * check) to stay synchronized with `value`. A plain check resolves `true`
 * on React's hydration-matching render itself, which is the render that
 * still shows `value`'s SSR `fallback` — one commit *before*
 * `useSyncExternalStore`'s own mismatch-correction lands the real stored
 * value. An effect gating on `[ready, value]` (e.g. Profile's login-redirect
 * guard) could then observe that transient "ready, but still the fallback"
 * state and act on it — under Next.js's real SSR/hydrate path this is a
 * genuine (if narrow) race, not just a lint nitpick: it was caught by
 * Profile's auth gate intermittently bouncing an already-logged-in visitor
 * back to the homepage. Deriving `ready` from its own snapshot call keeps it
 * corrected in the exact same commit as `value`, every time.
 */
export function usePersistentState<T>(key: string, fallback: T, scope: Scope = "local") {
  const fallbackRef = useRef(fallback);
  fallbackRef.current = fallback;

  const value = useSyncExternalStore(
    subscribe(key),
    () => getSnapshot(key, fallbackRef.current, scope),
    () => fallbackRef.current
  );

  const ready = useSyncExternalStore(
    subscribe(key),
    () => true,
    () => false
  );

  const setValue = useCallback(
    (updater: T | ((prev: T) => T)) => {
      const prev = getSnapshot(key, fallbackRef.current, scope);
      const next = typeof updater === "function" ? (updater as (p: T) => T)(prev) : updater;
      writeJSON(key, next, scope);
      notify(key);
    },
    [key, scope]
  );

  return { value, setValue, ready } as const;
}
