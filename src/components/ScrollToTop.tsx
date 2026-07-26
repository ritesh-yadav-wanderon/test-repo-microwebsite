import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollAppToTop } from "../utils/scroll";

/**
 * Resets the scroll position to the top on every route (path) change, so
 * navigating to any link always starts from the top of the page. The app
 * scrolls inside `.app-shell`, so reset that (falls back to window).
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    scrollAppToTop("auto");
  }, [pathname]);

  return null;
}
