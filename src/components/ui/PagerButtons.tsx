import "./PagerButtons.css";

/**
 * Prev/next buttons for a horizontal rail. Two looks ship in the design:
 * `chevron` (inline SVG arrows, used by the desktop carousels) and `pill` (the
 * round asset-based buttons in the galleries).
 */
export interface PagerButtonsProps {
  onPrev: () => void;
  onNext: () => void;
  /** Grey out and disable Prev when the rail is already at the start. */
  prevActive?: boolean;
  variant?: "chevron" | "pill";
  /** Class for the wrapper, e.g. "dls__pager". */
  className?: string;
  /** Class for each button, e.g. "dls__pager-btn". */
  buttonClassName?: string;
  prevLabel?: string;
  nextLabel?: string;
}

export default function PagerButtons({
  onPrev,
  onNext,
  prevActive = true,
  variant = "chevron",
  className,
  buttonClassName,
  prevLabel = "Previous",
  nextLabel = "Next",
}: PagerButtonsProps) {
  const wrap = variant === "pill" ? `pgr-wrap${className ? ` ${className}` : ""}` : className;
  const btn = variant === "pill" ? "pgr-btn" : buttonClassName;

  return (
    <div className={wrap}>
      <button className={btn} type="button" onClick={onPrev} aria-label={prevLabel} disabled={!prevActive}>
        {variant === "pill" ? (
          <img
            src={prevActive ? "/figma/scroll-btn/chevron-right.svg" : "/figma/scroll-btn/chevron-left.svg"}
            alt=""
            aria-hidden
            className="pgr-icon"
          />
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M15 4 7 12l8 8" stroke="#3d3d3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      <button className={btn} type="button" onClick={onNext} aria-label={nextLabel}>
        {variant === "pill" ? (
          <img src="/figma/scroll-btn/chevron-right.svg" alt="" aria-hidden className="pgr-icon" />
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="m9 4 8 8-8 8" stroke="#3d3d3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </div>
  );
}
