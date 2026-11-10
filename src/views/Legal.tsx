import type { ReactNode } from "react";
import "./Legal.css";

const L = "/figma/legal/";

const ITEMS = [
  { label: "Privacy Policy",             to: "/legal/privacy-policy" },
  { label: "Terms & Conditions",         to: "/legal/terms" },
  { label: "Customer Success & Support", to: "/legal/support" },
];

export interface LegalViewProps {
  onBack: () => void;
  onNavigate: (to: string) => void;
  /** Rendered at the foot of the page — router-specific (EndMark has none
   *  of its own dependencies, but is injected so this file has zero
   *  framework/router imports and can be shared as-is with web-next). */
  endMark: ReactNode;
}

/** Pure presentational shell — no react-router or next/navigation import —
 *  so the exact same markup/CSS renders under both the Vite app (via the
 *  default export below) and the Next.js app (web-next/app/legal/page.tsx).
 *  See the migration plan's Phase 2 for why this split exists. */
export function LegalView({ onBack, onNavigate, endMark }: LegalViewProps) {
  return (
    <div className="leg-page">
      <header className="leg-header">
        <div className="leg-header-left">
          <button className="leg-back" type="button" onClick={onBack} aria-label="Go back">
            <img src={`${L}icon-arrow-back.svg`} width={24} height={24} alt="" aria-hidden />
          </button>
          <span className="leg-header-title">Legal</span>
        </div>
      </header>

      <div className="leg-content">
        <div className="leg-list">
          {ITEMS.map((item) => (
            <button
              key={item.label}
              type="button"
              className="leg-row"
              onClick={() => onNavigate(item.to)}
            >
              <div className="leg-row-left">
                <img src={`${L}icon-book.svg`} width={16} height={16} alt="" aria-hidden className="leg-row-icon" />
                <span className="leg-row-label">{item.label}</span>
              </div>
              <img src={`${L}icon-arrow-forward.svg`} width={16} height={16} alt="" aria-hidden />
            </button>
          ))}
        </div>
      </div>
      {endMark}
    </div>
  );
}
