import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { readJSON, STORAGE_KEYS, writeJSON } from "@/repositories";

/** Minimal trip data stored for a wishlisted trip. */
export interface WishlistTrip {
  slug: string;
  title: string;
  image: string;
  price: string;
  /** Duration label, e.g. "7N/8D". */
  duration?: string;
  /** Pick-up / drop line, e.g. "New Delhi - Kenya". */
  route?: string;
}

interface WishlistCtx {
  items: WishlistTrip[];
  count: number;
  isWishlisted: (slug: string) => boolean;
  toggle: (trip: WishlistTrip) => void;
  remove: (slug: string) => void;
  clear: () => void;
}

const WishlistContext = createContext<WishlistCtx>({
  items: [],
  count: 0,
  isWishlisted: () => false,
  toggle: () => {},
  remove: () => {},
  clear: () => {},
});

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistTrip[]>(() =>
    readJSON<WishlistTrip[]>(STORAGE_KEYS.wishlist, [])
  );

  useEffect(() => {
    writeJSON(STORAGE_KEYS.wishlist, items);
  }, [items]);

  const isWishlisted = useCallback(
    (slug: string) => items.some((t) => t.slug === slug),
    [items]
  );

  const toggle = useCallback((trip: WishlistTrip) => {
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
    () => ({ items, count: items.length, isWishlisted, toggle, remove, clear }),
    [items, isWishlisted, toggle, remove, clear]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  return useContext(WishlistContext);
}
