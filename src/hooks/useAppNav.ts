import { createContext, useContext } from "react";

/**
 * Framework-agnostic navigation surface — a holdover from this app's Vite +
 * React Router days (now fully migrated to Next.js). Shared chrome
 * components (BottomNav, the desktop account rail/header, etc.) call this
 * instead of importing next/navigation directly, so app/NextNavProvider.tsx
 * (which wraps its useRouter/usePathname) stays the one place that knows
 * about the routing library.
 */
export interface AppNavOptions {
  /** A leftover from the React Router history-state hand-off this app used
   *  before migrating to Next.js (e.g. Home's batch picker priming
   *  TripDetail same-tab, with no round trip). next/navigation has no
   *  equivalent, so NextNavProvider always ignores this — every call site
   *  that still passes it already has a real fallback (a `?query=` param, or
   *  a server-fetched/persisted record) for when it's absent. */
  state?: unknown;
}

export interface AppNav {
  pathname: string;
  push: (to: string, opts?: AppNavOptions) => void;
  replace: (to: string, opts?: AppNavOptions) => void;
  back: () => void;
  /** Move `delta` entries through history (negative = back). Used by
   *  exitToMainPage's history-unwind optimization. */
  go: (delta: number) => void;
}

export const AppNavContext = createContext<AppNav | null>(null);

export function useAppNav(): AppNav {
  const ctx = useContext(AppNavContext);
  if (!ctx) {
    throw new Error("useAppNav() must be used within an AppNavContext.Provider");
  }
  return ctx;
}
