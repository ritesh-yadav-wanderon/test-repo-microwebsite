const TI = "/figma/trip-info/";
const FOOT_FILLED = [`${TI}foot-1.svg`, `${TI}foot-2.svg`, `${TI}foot-3.svg`, `${TI}foot-4.svg`, `${TI}foot-5.svg`];
const FOOT_EMPTY = `${TI}foot-empty.svg`;
// Keyed by normalized label (see fitKey) so the product data's
// "Nature & Adventure" matches the fixture's "Nature and Adventure".
const FIT_ICONS: Record<string, string> = {
  partynightlife:     `${TI}icon-party.svg`,
  natureadventure:    `${TI}icon-nature.svg`,
  cityculture:        `${TI}icon-culture.svg`,
};

/** "Nature & Adventure" / "Nature and Adventure" -> "natureadventure". */
function fitKey(label: string): string {
  return label.toLowerCase().replace(/&|\band\b/g, "").replace(/[^a-z]/g, "");
}

export interface TiFitRowProps {
  label: string;
  rating: number;
}

/** "Who is this trip for" footprint rating row. */
export default function TiFitRow({ label, rating }: TiFitRowProps) {
  const icon = FIT_ICONS[fitKey(label)];
  return (
    <div className="tdp2-ti-fit-row">
      <div className="tdp2-ti-fit-label">
        {icon && <img src={icon} alt="" className="tdp2-ti-fit-icon" aria-hidden loading="lazy" />}
        <span className="tdp2-ti-fit-text">{label}</span>
      </div>
      <div className="tdp2-ti-fit-prints">
        {[0,1,2,3,4].map(i => (
          <div key={i} className="tdp2-ti-fit-wrap">
            <div className="tdp2-ti-fit-inner">
              <img src={i < rating ? FOOT_FILLED[i] : FOOT_EMPTY} alt="" className="tdp2-ti-fit-foot" aria-hidden loading="lazy" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
