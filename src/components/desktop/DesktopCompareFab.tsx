import { useAppNav } from "@/hooks/useAppNav";
import { useCompare } from "@/context/CompareContext";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import "./DesktopCompareFab.css";

/** Vertical "Compare selected trips (N)" tab pinned to the right edge of the
 *  viewport (Figma 6487:27730). Shown on every desktop page while the compare
 *  tray has trips in it, except on the compare page itself. */
export default function DesktopCompareFab() {
  const nav = useAppNav();
  const { count } = useCompare();
  const isDesktop = useIsDesktop();

  if (!isDesktop || count === 0 || nav.pathname === "/compare") return null;

  return (
    <button className="dcfab" type="button" onClick={() => nav.push("/compare")}>
      <span className="dcfab__label">Compare selected trips ({count})</span>
    </button>
  );
}
