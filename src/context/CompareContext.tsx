import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { STORAGE_KEYS } from "@/repositories";
import { usePersistentState } from "@/hooks/usePersistentState";

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

export function CompareProvider({ children }: { children: ReactNode }) {
  const { value: items, setValue: setItems } = usePersistentState<CompareTrip[]>(
    STORAGE_KEYS.compare,
    []
  );

  const isInCompare = useCallback(
    (slug: string) => items.some((t) => t.slug === slug),
    [items]
  );

  const toggle = useCallback(
    (trip: CompareTrip) => {
      setItems((prev) =>
        prev.some((t) => t.slug === trip.slug)
          ? prev.filter((t) => t.slug !== trip.slug)
          : [...prev, trip]
      );
    },
    [setItems]
  );

  const remove = useCallback(
    (slug: string) => setItems((prev) => prev.filter((t) => t.slug !== slug)),
    [setItems]
  );

  const clear = useCallback(() => setItems([]), [setItems]);

  const value = useMemo(
    () => ({ items, count: items.length, isInCompare, toggle, remove, clear }),
    [items, isInCompare, toggle, remove, clear]
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  return useContext(CompareContext);
}
