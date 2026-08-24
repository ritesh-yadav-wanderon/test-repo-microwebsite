const TI = "/figma/trip-info/";
const FOOT_FILLED = [`${TI}foot-1.svg`, `${TI}foot-2.svg`, `${TI}foot-3.svg`, `${TI}foot-4.svg`, `${TI}foot-5.svg`];
const FOOT_EMPTY = `${TI}foot-empty.svg`;
const FIT_ICONS: Record<string, string> = {
  "Party & Night Life":   `${TI}icon-party.svg`,
  "Nature and Adventure": `${TI}icon-nature.svg`,
  "City and Culture":     `${TI}icon-culture.svg`,
};

export interface TiFitRowProps {
  label: string;
  rating: number;
}

/** "Who is this trip for" footprint rating row. */
export default function TiFitRow({ label, rating }: TiFitRowProps) {
  const icon = FIT_ICONS[label] ?? `${TI}icon-culture.svg`;
  return (
    <div className="tdp2-ti-fit-row">
      <div className="tdp2-ti-fit-label">
        <img src={icon} alt="" className="tdp2-ti-fit-icon" aria-hidden loading="lazy" />
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
