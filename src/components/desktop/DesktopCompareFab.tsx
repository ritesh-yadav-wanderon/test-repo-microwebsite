import { useLocation, useNavigate } from "react-router-dom";
import { useCompare } from "../../context/CompareContext";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import "./DesktopCompareFab.css";

/** Vertical "Compare selected trips (N)" tab pinned to the right edge of the
 *  viewport (Figma 6487:27730). Shown on every desktop page while the compare
 *  tray has trips in it, except on the compare page itself. */
export default function DesktopCompareFab() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { count } = useCompare();
  const isDesktop = useIsDesktop();

  if (!isDesktop || count === 0 || pathname === "/compare") return null;

  return (
    <button className="dcfab" type="button" onClick={() => navigate("/compare")}>
      <span className="dcfab__label">Compare selected trips ({count})</span>
    </button>
  );
}
