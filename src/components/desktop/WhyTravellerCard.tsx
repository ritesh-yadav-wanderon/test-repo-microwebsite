import "./WhyTravellerCard.css";

const BASE = "/figma/desktop";

export interface WhyTravellerCardProps {
  title: string;
  sub: string;
  /** Filename under /figma/desktop, e.g. "why-safety.png" */
  img: string;
  /** Dark text for cards whose photo is light at the top (Figma variants) */
  darkText?: boolean;
  onMore?: () => void;
}

/** Value-prop photo card from "Why travellers choose WanderOn"
 *  (Figma component instance 5224:12932, 268x350). */
export default function WhyTravellerCard({ title, sub, img, darkText, onMore }: WhyTravellerCardProps) {
  return (
    <div className={`wtcard${darkText ? " wtcard--dark-text" : ""}`}>
      <img className="wtcard__img" src={`${BASE}/${img}`} alt="" loading="lazy" />
      <div className="wtcard__text">
        <p className="wtcard__title">{title}</p>
        <p className="wtcard__sub">{sub}</p>
      </div>
      <button className="wtcard__plus" aria-label={`More about ${title}`} onClick={onMore}>
        <img src={`${BASE}/why-plus.svg`} alt="" />
      </button>
    </div>
  );
}
