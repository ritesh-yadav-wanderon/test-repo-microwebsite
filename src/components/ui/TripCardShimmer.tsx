import type { CSSProperties } from "react";
import "./TripCardShimmer.css";

/**
 * Loading placeholder for a trip card. Every surface that lists trips shows one
 * of these variants:
 *
 * - `listing`  — the full listing card (mobile listing rail, destination page,
 *                desktop listing strip)
 * - `compact`  — the small homepage/"more trips" card
 * - `search`   — the mobile search results grid
 * - `search-desktop` — the desktop search results grid
 *
 * Each variant keeps the class names its own stylesheet already targets.
 */
export type TripCardShimmerVariant = "listing" | "compact" | "search" | "search-desktop";

export interface TripCardShimmerProps {
  variant?: TripCardShimmerVariant;
}

function Bone({ className }: { className: string }) {
  return <div className={`tc-sh-bone ${className}`} aria-hidden />;
}

const SEARCH_LINES: CSSProperties[] = [
  { width: "85%", height: 14 },
  { width: "60%" },
  { width: "70%" },
  { width: "45%", height: 18, marginTop: 8 },
];

const COMPACT_LINES: CSSProperties[] = [
  { width: "90%", height: 21 },
  { width: "40%", height: 14 },
  { width: "100%", height: 14 },
  { width: "55%", height: 24 },
];

export default function TripCardShimmer({ variant = "listing" }: TripCardShimmerProps) {
  if (variant === "compact") {
    return (
      <div className="tdp2-more-card-v2" aria-hidden>
        {/* The shimmer sits inside the media frame — the frame's own background
            would otherwise paint over it. */}
        <div className="tdp2-more-cv2-img-wrap">
          <div className="tdp2-more-cv2-sk-img up-shimmer-block" />
        </div>
        <div className="tdp2-more-cv2-info">
          {COMPACT_LINES.map((style, i) => (
            <div key={i} className="up-shimmer-line" style={style} />
          ))}
        </div>
      </div>
    );
  }

  if (variant === "search" || variant === "search-desktop") {
    const p = variant === "search" ? "sr-shimmer" : "dsr-shimmer";
    return (
      <div className={variant === "search" ? "sr-shimmer-card" : "dsr-shimmer"} aria-hidden>
        <div className={`${p}-img`} />
        <div className={`${p}-body`}>
          {SEARCH_LINES.map((style, i) => (
            <div key={i} className={`${p}-line`} style={style} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <article className="tc-shimmer" aria-hidden>
      <Bone className="tc-sh-image" />

      <div className="tc-sh-pill">
        <Bone className="tc-sh-pill-left" />
        <Bone className="tc-sh-pill-right" />
      </div>

      <div className="tc-sh-body">
        <Bone className="tc-sh-title" />
        <Bone className="tc-sh-itin" />

        <div className="tc-sh-features">
          <Bone className="tc-sh-feat" />
          <Bone className="tc-sh-feat" />
          <Bone className="tc-sh-feat tc-sh-feat--short" />
        </div>

        <Bone className="tc-sh-batches" />

        <div className="tc-sh-foot">
          <div className="tc-sh-price">
            <Bone className="tc-sh-price-main" />
            <Bone className="tc-sh-price-sub" />
          </div>
          <Bone className="tc-sh-cta" />
        </div>

        <Bone className="tc-sh-note" />
      </div>
    </article>
  );
}
