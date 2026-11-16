import React, { useState } from "react";
import type { ProductData } from "@/repositories";
import type { TripGlance as TripGlanceData } from "@/utils/tripItinerary";
import HotelRating from "./HotelRating";

const G = "/figma/trip-glance/";
/** Activities listed before the "+N more Activities" link (Figma 8779:9155). */
const VISIBLE_ACTIVITIES = 3;

export interface TripGlanceProps {
  glance: TripGlanceData;
  captain: ProductData["captain"];
  /** Premium package selected — premium-only activities show as included. */
  premiumSelected?: boolean;
}

function GlanceHeading({ icon, label, iconSize = 16 }: { icon: string; label: string; iconSize?: number }) {
  return (
    <h3 className="tdp2-glance-hd">
      <img src={`${G}${icon}`} width={iconSize} height={iconSize} alt="" aria-hidden loading="lazy" />
      {label}
    </h3>
  );
}

/** Illustration + two-line summary row used by Transfers / Trip Captain /
 *  Community (Figma 8779:9179, 10456:20926, 10456:20932). */
function GlanceFeature({ art, artClass, title, subtitle }: {
  art: string; artClass: string; title: string; subtitle?: string;
}) {
  return (
    <div className="tdp2-glance-feature">
      <span className={`tdp2-glance-art ${artClass}`} aria-hidden>
        <img src={`${G}${art}`} alt="" loading="lazy" />
      </span>
      <div className="tdp2-glance-feature-text">
        <p className="tdp2-glance-feature-title">{title}</p>
        {subtitle && <p className="tdp2-glance-feature-sub">{subtitle}</p>}
      </div>
    </div>
  );
}

/** "Trip at a Glance" — the product page's default tab (Figma 8779:9081). */
export default function TripGlance({ glance, captain, premiumSelected = false }: TripGlanceProps) {
  const [showAll, setShowAll] = useState(false);
  const { stays, activities, premium, transfer, community } = glance;
  const hidden = Math.max(0, activities.length - VISIBLE_ACTIVITIES);
  const shown = showAll ? activities : activities.slice(0, VISIBLE_ACTIVITIES);

  const blocks: React.ReactNode[] = [];

  if (stays.length) {
    blocks.push(
      <div className="tdp2-glance-block tdp2-glance-block--stay" key="stay">
        <GlanceHeading icon="icon-villa.svg" label="Stay" />
        <ul className="tdp2-glance-stays">
          {stays.map((s) => (
            <li key={s.name}>
              <span className="tdp2-glance-stay-name">{s.name}</span>
              <HotelRating hotel={s.name} rating={s.rating} />
            </li>
          ))}
        </ul>
        <div className="tdp2-glance-note">
          <img src={`${G}icon-info.svg`} width={16} height={16} alt="" aria-hidden loading="lazy" />
          <p>Stays will be allocated based on availability or similar category.</p>
        </div>
      </div>
    );
  }

  if (activities.length) {
    blocks.push(
      <div className="tdp2-glance-block" key="activity">
        <GlanceHeading icon="icon-nature-people.svg" label="Activity" iconSize={18} />
        <ol className="tdp2-glance-acts">
          {shown.map((a, i) => (
            <li className="tdp2-glance-act" key={`${i}-${a.title}`}>
              <p className="tdp2-glance-act-text">{`${i + 1}- ${a.title}`}</p>
              {a.photo && <img className="tdp2-glance-act-img" src={a.photo} alt="" loading="lazy" />}
            </li>
          ))}
        </ol>
        {hidden > 0 && (
          <button
            type="button"
            className="tdp2-glance-more"
            aria-expanded={showAll}
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll ? "Show fewer Activities" : `+${hidden} more Activities`}
          </button>
        )}
        {premium.length > 0 && (
          <ul className="tdp2-glance-acts tdp2-glance-acts--premium">
            {premium.map((a) => (
              <li className={`tdp2-glance-act${premiumSelected ? "" : " tdp2-glance-act--locked"}`} key={a.title}>
                <p className="tdp2-glance-act-text">
                  {a.title}
                  {!premiumSelected && <span className="tdp2-glance-premium-note">(Available for Premium Package)</span>}
                </p>
                {a.photo && <img className="tdp2-glance-act-img" src={a.photo} alt="" loading="lazy" />}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (transfer) {
    blocks.push(
      <div className="tdp2-glance-block tdp2-glance-block--row" key="transfer">
        <GlanceHeading icon="icon-local-taxi.svg" label="Transfers" />
        <GlanceFeature art="transfer-coach.png" artClass="tdp2-glance-art--coach" title={transfer.title} subtitle={transfer.route} />
      </div>
    );
  }

  blocks.push(
    <div className="tdp2-glance-block tdp2-glance-block--row" key="captain">
      <GlanceHeading icon="icon-captain.svg" label="Trip Captain" />
      <GlanceFeature
        art="captain-badge.png"
        artClass="tdp2-glance-art--badge"
        title={`${captain.name} rides with you`}
        subtitle={`24×7 on ground · ${captain.years}+ years leading trips`}
      />
    </div>
  );

  if (community) {
    blocks.push(
      <div className="tdp2-glance-block tdp2-glance-block--row" key="community">
        <GlanceHeading icon="icon-community.svg" label="Community" />
        <GlanceFeature art="community.png" artClass="tdp2-glance-art--community" title={community.title} subtitle={community.subtitle} />
      </div>
    );
  }

  return (
    <div className="tdp2-glance">
      {blocks.map((b, i) => (
        <React.Fragment key={i}>
          {i > 0 && <hr className="tdp2-glance-divider" />}
          {b}
        </React.Fragment>
      ))}
    </div>
  );
}
