"use client";

import { useMemo, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppNavContext, type AppNavOptions } from "../src/hooks/useAppNav";

/** Next.js's AppNav implementation, mounted once in the root layout so every
 *  shared chrome component (BottomNav, the desktop account rail/header) can
 *  call useAppNav() instead of importing next/navigation directly. `go` uses
 *  the real browser History API since next/navigation's router has no
 *  numeric-delta method; App Router still drives real history entries
 *  underneath, so this works.
 *
 *  Deliberately does NOT read next/navigation's useSearchParams() here: this
 *  provider sits in the ROOT layout (every page, including Next's own
 *  auto-generated /_not-found), and useSearchParams() forces static
 *  prerendering to bail out for its whole subtree unless wrapped in
 *  Suspense — which would turn every otherwise-static page (Legal,
 *  Notifications, ...) into a client-rendered shell. Search-specific query-
 *  param reads go through useAppSearchParams() instead, provided only by the
 *  /search route's own client tree (see app/search). */
export default function NextNavProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const value = useMemo(
    () => ({
      pathname,
      // `opts.state` (react-router-only history state) has no next/navigation
      // equivalent — accepted for interface parity, intentionally a no-op.
      push: (to: string, _opts?: AppNavOptions) => router.push(to),
      replace: (to: string, _opts?: AppNavOptions) => router.replace(to),
      back: () => router.back(),
      go: (delta: number) => window.history.go(delta),
    }),
    [router, pathname]
  );

  return <AppNavContext.Provider value={value}>{children}</AppNavContext.Provider>;
}
