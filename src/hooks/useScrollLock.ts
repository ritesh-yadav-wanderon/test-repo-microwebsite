import { useEffect } from "react";
import { lockAppScroll } from "@/utils/scroll";

/** Freeze the page behind an overlay for as long as `active` is true. */
export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    return lockAppScroll();
  }, [active]);
}
