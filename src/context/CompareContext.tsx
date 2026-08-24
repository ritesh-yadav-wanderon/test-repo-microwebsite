import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { readJSON, STORAGE_KEYS, writeJSON } from "@/repositories";

/** Minimal trip data needed to represent an entry in the compare tray. */
export interface CompareTrip {
  slug: string;
  title: string;
  image: string;
  price: string;
  route?: string;
}

interface CompareCtx {
  items: CompareTrip[];
  count: number;
  isInCompare: (slug: string) => boolean;
  toggle: (trip: CompareTrip) => void;
  remove: (slug: string) => void;
  clear: () => void;
}

const CompareContext = createContext<CompareCtx>({
  items: [],
  count: 0,
  isInCompare: () => false,
  toggle: () => {},
  remove: () => {},
  clear: () => {},
});

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CompareTrip[]>(() =>
    readJSON<CompareTrip[]>(STORAGE_KEYS.compare, [])
  );

  useEffect(() => {
    writeJSON(STORAGE_KEYS.compare, items);
  }, [items]);

  const isInCompare = useCallback(
    (slug: string) => items.some((t) => t.slug === slug),
    [items]
  );

  const toggle = useCallback((trip: CompareTrip) => {
    setItems((prev) =>
      prev.some((t) => t.slug === trip.slug)
        ? prev.filter((t) => t.slug !== trip.slug)
        : [...prev, trip]
    );
  }, []);

  const remove = useCallback((slug: string) => {
    setItems((prev) => prev.filter((t) => t.slug !== slug));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({ items, count: items.length, isInCompare, toggle, remove, clear }),
    [items, isInCompare, toggle, remove, clear]
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  return useContext(CompareContext);
}
