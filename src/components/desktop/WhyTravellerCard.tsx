import "./WhyTravellerCard.css";

const BASE = "/figma/desktop";

export interface WhyTravellerCardProps {
  title: string;
  sub: string;
  /** Filename under /figma/desktop, e.g. "why-safety.png" */
  img: string;
  /** Dark text for cards whose photo is light at the top (Figma variants) */
  darkText?: boolean;
  /** Expanded (open) state content */
  expandedTitle: string;
  expandedBody: string;
  open?: boolean;
  onToggle?: () => void;
}

/** Value-prop photo card from "Why travellers choose WanderOn"
 *  (Figma component instance 5224:12932, 268x350). Mirrors the mobile
 *  WhyWanderon card's two modes: collapsed photo / expanded text. */
export default function WhyTravellerCard({
  title,
  sub,
  img,
  darkText,
  expandedTitle,
  expandedBody,
  open = false,
  onToggle,
}: WhyTravellerCardProps) {
  const cls = [
    "wtcard",
    open ? "wtcard--open" : "",
    darkText && !open ? "wtcard--dark-text" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cls}>
      {!open && <img className="wtcard__img" src={`${BASE}/${img}`} alt="" loading="lazy" />}
      <div className="wtcard__text">
        <p className="wtcard__title">{open ? expandedTitle : title}</p>
        <p className="wtcard__sub">{open ? expandedBody : sub}</p>
      </div>
      <button
        className="wtcard__plus"
        aria-label={open ? `Collapse ${title}` : `More about ${title}`}
        aria-expanded={open}
        onClick={onToggle}
      >
        <img src={`${BASE}/why-plus.svg`} alt="" />
      </button>
    </div>
  );
}
