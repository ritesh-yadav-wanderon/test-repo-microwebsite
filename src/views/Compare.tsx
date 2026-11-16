import { Fragment, useState } from "react";
import { useAppNav } from "@/hooks/useAppNav";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { useCompare } from "@/context/CompareContext";
import { useCompareTrips, type DiffField } from "@/hooks/useCompareTrips";
import DesktopCompare from "@/components/desktop/DesktopCompare";
import CompareColumn from "@/components/CompareColumn/CompareColumn";
import "./Compare.css";

const I = "/figma/compare/v2/";
const NONE = new Set<DiffField>();

/** Mobile Compare trips page (Figma 3032:20964): header, Highlights
 *  Differences toggle, and the compared trips side by side. */
export default function Compare() {
  const nav = useAppNav();
  const isDesktop = useIsDesktop();
  const { remove } = useCompare();
  const { columns, differing } = useCompareTrips();
  const [showDiff, setShowDiff] = useState(false);

  if (isDesktop) return <DesktopCompare />;

  return (
    <div className="cpt-page">
      <header className="cpt-header">
        <div className="cpt-header-left">
          <button className="cpt-icon-btn" type="button" onClick={() => nav.go(-1)} aria-label="Go back">
            <img src={`${I}icon-arrow-back.svg`} alt="" width={24} height={24} />
          </button>
          <h1 className="cpt-header-title">Compare trips</h1>
        </div>
        <button className="cpt-icon-btn" type="button" onClick={() => nav.go(-1)} aria-label="Close">
          <img src={`${I}icon-close.svg`} alt="" width={30} height={30} />
        </button>
      </header>

      <div className="cpt-diff-row">
        <button
          type="button"
          role="switch"
          aria-checked={showDiff}
          className="cpt-diff-toggle"
          onClick={() => setShowDiff((v) => !v)}
        >
          <span className="cpt-diff-label">Highlights Differences</span>
          <img
            className="cpt-diff-toggle-switch"
            src={`/figma/listing/toggle/toggle-${showDiff ? "on" : "off"}.svg`}
            alt=""
            aria-hidden
          />
        </button>
      </div>

      <div className={`cpt-cols${columns.length > 2 ? " cpt-cols--scroll" : ""}`}>
        {columns.map((trip, i) => (
          <Fragment key={trip.slug}>
            {i > 0 && <span className="cpt-col-divider" aria-hidden />}
            <CompareColumn
              trip={trip}
              highlight={showDiff ? differing : NONE}
              onRemove={() => remove(trip.slug)}
            />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
