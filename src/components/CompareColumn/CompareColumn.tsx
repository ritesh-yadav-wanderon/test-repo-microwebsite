import { useState, type ReactNode } from "react";
import AppLink from "@/components/ui/AppLink";
import type { CompareColumnData, DiffField } from "@/hooks/useCompareTrips";
import "./CompareColumn.css";

const I = "/figma/compare/v2/";
const ITIN_PREVIEW = 8;
const EXP_PREVIEW = 5;

function Section({ icon, label, children, tall }: { icon: string; label: string; children: ReactNode; tall?: boolean }) {
  return (
    <div className={`cmpx-sec${tall ? " cmpx-sec--tall" : ""}`}>
      <div className="cmpx-sec-hd">
        <img src={`${I}${icon}`} width={16} height={16} alt="" aria-hidden loading="lazy" />
        <span>{label}</span>
      </div>
      <div className="cmpx-sec-body">{children}</div>
    </div>
  );
}

export interface CompareColumnProps {
  trip: CompareColumnData;
  /** Fields to highlight (Highlights Differences toggle). */
  highlight: Set<DiffField>;
  onRemove?: () => void;
}

/** One trip column of the Compare page — shared by mobile (Figma 3032:20964)
 *  and desktop (Figma 6509:30416); each page sets its own type scale. */
export default function CompareColumn({ trip, highlight, onRemove }: CompareColumnProps) {
  const [allDays, setAllDays] = useState(false);
  const [allExps, setAllExps] = useState(false);
  const hl = (f: DiffField) => (highlight.has(f) ? " cmpx-diff" : "");
  const days = allDays ? trip.itinerary : trip.itinerary.slice(0, ITIN_PREVIEW);
  const exps = allExps ? trip.experiences : trip.experiences.slice(0, EXP_PREVIEW);
  const dash = <span className="cmpx-empty">—</span>;

  return (
    <div className="cmpx-col">
      <div className="cmpx-img">
        {trip.image && <img src={trip.image} alt="" loading="lazy" />}
        {trip.removable && onRemove && (
          <button type="button" className="cmpx-bin" aria-label={`Remove ${trip.title} from compare`} onClick={onRemove}>
            <img src={`${I}icon-bin.svg`} width={12} height={12} alt="" aria-hidden />
          </button>
        )}
      </div>

      <div className="cmpx-head">
        <p className="cmpx-title">{trip.title}</p>
        <div className="cmpx-price-wrap">
          <span className="cmpx-price-label">
            <img src={`${I}icon-discount.svg`} width={14} height={14} alt="" aria-hidden loading="lazy" />
            Starting Price:
          </span>
          <span className={`cmpx-price${hl("price")}`}>{trip.price}</span>
        </div>
      </div>

      <Section icon="icon-calendar.svg" label="Duration">
        <p className={`cmpx-val${hl("duration")}`}>{trip.duration || dash}</p>
      </Section>

      <Section icon="icon-location.svg" label="Places" tall>
        <p className={`cmpx-val${hl("places")}`}>{trip.places || dash}</p>
      </Section>

      <Section icon="icon-itinerary.svg" label="Itinerary">
        <div className="cmpx-itin">
          {days.length ? days.map((d) => (
            <div className="cmpx-itin-row" key={d.day}>
              <span>{`Day ${d.day}:`}</span>
              <span>{d.place}</span>
            </div>
          )) : dash}
          {trip.itinerary.length > ITIN_PREVIEW && (
            <button type="button" className="cmpx-more" onClick={() => setAllDays((v) => !v)}>
              {allDays ? "Show Less" : "Show More"}
            </button>
          )}
        </div>
      </Section>

      <Section icon="icon-villa.svg" label="Accommodation Type" tall>
        {trip.stay ? (
          <div className={`cmpx-stay${hl("stay")}`}>
            <span className="cmpx-stay-name">{trip.stay.name}</span>
            <span className="cmpx-rating">
              <img src="/figma/trip-glance/icon-star.svg" width={12} height={12} alt="" aria-hidden loading="lazy" />
              {`${trip.stay.rating.toFixed(1)} customer ratings`}
            </span>
          </div>
        ) : dash}
      </Section>

      <Section icon="icon-taxi.svg" label="Transfer Options" tall>
        {trip.transfers.length ? (
          <ul className={`cmpx-transfers${hl("transfers")}`}>
            {trip.transfers.map((t) => <li key={t}>{t}</li>)}
          </ul>
        ) : dash}
      </Section>

      <Section icon="icon-experiences.svg" label="Experiences">
        <div className="cmpx-exps">
          {exps.length ? exps.map((e, i) => (
            <div className="cmpx-exp" key={`${i}-${e.label}`}>
              {e.img ? <img src={e.img} alt="" loading="lazy" /> : <span className="cmpx-exp-ph" aria-hidden />}
              <p>{e.label}</p>
            </div>
          )) : dash}
          {trip.experiences.length > EXP_PREVIEW && (
            <button type="button" className="cmpx-more" onClick={() => setAllExps((v) => !v)}>
              {allExps ? "Show Less" : "Show More"}
            </button>
          )}
        </div>
      </Section>

      <AppLink to={trip.href} className="cmpx-cta">View Trip</AppLink>
    </div>
  );
}
