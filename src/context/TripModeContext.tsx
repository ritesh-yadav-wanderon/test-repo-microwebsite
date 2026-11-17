"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

import { TRIP_MODE_COOKIE } from "@/utils/cookies";

// The mode lives in a cookie (not localStorage) so server-rendered pages
// (home, search) fetch the right trips on the first paint.

interface TripModeValue {
  isPrivate: boolean;
  setPrivate: (on: boolean) => void;
}

const TripModeContext = createContext<TripModeValue>({ isPrivate: false, setPrivate: () => {} });

/** Private-trip mode: entered from the bottom nav / desktop header "Private
 *  trips", left via "Group trips" or by removing the search chip. */
export function useTripMode(): TripModeValue {
  return useContext(TripModeContext);
}

/** `tripType` for /api/products in the current mode. */
export function useTripTypeParam(): "private" | "group" {
  return useTripMode().isPrivate ? "private" : "group";
}

export function TripModeProvider({ initialPrivate, children }: { initialPrivate: boolean; children: React.ReactNode }) {
  const [isPrivate, setIsPrivate] = useState(initialPrivate);
  const setPrivate = useCallback((on: boolean) => {
    document.cookie = on
      ? `${TRIP_MODE_COOKIE}=private; path=/; max-age=31536000; samesite=lax`
      : `${TRIP_MODE_COOKIE}=; path=/; max-age=0; samesite=lax`;
    setIsPrivate(on);
  }, []);
  const value = useMemo(() => ({ isPrivate, setPrivate }), [isPrivate, setPrivate]);
  return <TripModeContext.Provider value={value}>{children}</TripModeContext.Provider>;
}
