import React from "react";
import type { DayItinerary } from "@/repositories";
import type { TransferLeg } from "@/utils/tripItinerary";

/** Transfer leg shown at the top of an expanded day (Figma 7165:7171). */
export function DayTransfer({ from: fromCity, to: toCity, duration }: TransferLeg) {
  return (
    <div className="tdp2-day-tr-row">
      <span className="tdp2-day-tr-city">{fromCity}</span>
      <span className="tdp2-day-tr-line" aria-hidden />
      <div className="tdp2-day-tr-pill">
        <span className="tdp2-day-tr-car">
          <img src="/figma/itin-section/transfer-car.svg" alt="" aria-hidden loading="lazy" />
        </span>
        {duration && <span className="tdp2-day-tr-dur">{duration}</span>}
      </div>
      <span className="tdp2-day-tr-line tdp2-day-tr-line--arrow" aria-hidden />
      <span className="tdp2-day-tr-city">{toCity}</span>
    </div>
  );
}

export interface DayCardProps {
  day: DayItinerary;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  transfer?: TransferLeg;
}

/** One collapsible day of the itinerary, shared by both product pages. */
export default function DayCard({ day, index, isOpen, onToggle, transfer }: DayCardProps) {
  const title = day.summary?.[0] ?? day.city;
  const hasStay = Boolean(day.stayName);
  const hasActivities = Boolean(day.activities?.length);
  const isSameAccommodation = day.stayName?.startsWith("Same Accommodation");

  return (
    <div id={`day-${index}`} className={`tdp2-day-card${isOpen ? " open" : ""}`} style={{ scrollMarginTop: "186px" }}>
      <button className="tdp2-day-card-header" onClick={onToggle}>
        <div className="tdp2-day-card-header-left">
          <span className="tdp2-day-badge">{`Day ${index + 1}`}</span>
          <span className="tdp2-day-card-title">{title}</span>
        </div>
        <img
          src={isOpen
            ? "/figma/itin-section/itinerary-arrow-up.svg"
            : "/figma/itin-section/itinerary-arrow-down.svg"}
          alt=""
          className="tdp2-day-card-chevron"
          aria-hidden
          loading="lazy"
        />
      </button>

      {isOpen && (
        <div className="tdp2-day-card-expanded">
          {transfer && (
            <div className="tdp2-day-tl-item">
              <div className="tdp2-day-tl-left">
                <img src="/figma/itin-section/itinerary-timeline.svg" alt="" className="tdp2-day-tl-pin" aria-hidden loading="lazy" />
                <div className="tdp2-day-tl-line" />
              </div>
              <div className="tdp2-day-tl-content">
                <div className="tdp2-day-tl-section-hd">
                  <img src="/figma/itin-section/transfer-taxi.svg" alt="" className="tdp2-day-tl-sec-icon" aria-hidden loading="lazy" />
                  <span className="tdp2-day-tl-sec-label">Shared Transfer</span>
                </div>
                <DayTransfer {...transfer} />
              </div>
            </div>
          )}

          {hasStay && (
            <div className="tdp2-day-tl-item">
              <div className="tdp2-day-tl-left">
                <img src="/figma/itin-section/itinerary-timeline.svg" alt="" className="tdp2-day-tl-pin" aria-hidden loading="lazy" />
                <div className="tdp2-day-tl-line" />
              </div>
              <div className="tdp2-day-tl-content">
                <div className="tdp2-day-tl-section-hd">
                  <img src="/figma/itin-section/itinerary-stay.svg" alt="" className="tdp2-day-tl-sec-icon" aria-hidden loading="lazy" />
                  <span className="tdp2-day-tl-sec-label">Stay</span>
                  {day.stayNights && (
                    <>
                      <div className="tdp2-day-tl-sec-divider" />
                      <span className="tdp2-day-tl-sec-label">{day.stayNights} Night{day.stayNights > 1 ? "s" : ""}</span>
                    </>
                  )}
                </div>
                {day.stayNote && (
                  <div className="tdp2-day-stay-note">
                    <img src="/figma/itin-section/itinerary-info.svg" alt="" className="tdp2-day-stay-note-icon" aria-hidden loading="lazy" />
                    <span className="tdp2-day-stay-note-text">{day.stayNote}</span>
                    <img src="/figma/itin-section/itinerary-note-tail.svg" alt="" className="tdp2-day-stay-note-tail" aria-hidden loading="lazy" />
                  </div>
                )}
                {day.stayPhotos && day.stayPhotos.length > 0 && (
                  <div className="tdp2-day-hotel-options">
                    {day.stayPhotos.slice(0, 2).map(photo => (
                      <div className="tdp2-day-hotel-option" key={photo}>
                        <img src={photo} alt={day.stayName ?? ""} className="tdp2-day-hotel-photo" loading="lazy" />
                        <p className="tdp2-day-hotel-name">{day.stayName}</p>
                      </div>
                    ))}
                  </div>
                )}
                {!day.stayPhotos?.length && (
                  isSameAccommodation ? (
                    <div className="tdp2-day-same-stay">
                      <img
                        src="/figma/itin-section/same-accommodation-info.svg"
                        alt=""
                        className="tdp2-day-same-stay-icon"
                        aria-hidden
                      />
                      <span>{day.stayName}</span>
                    </div>
                  ) : (
                    <p className="tdp2-day-stay-name">{day.stayName}</p>
                  )
                )}
                {day.stayMeals && day.stayMeals.length > 0 && (
                  <div className="tdp2-day-meals-bar">
                    <div className="tdp2-day-meals-list">
                      {day.stayMeals.map((meal, mi) => (
                        <React.Fragment key={mi}>
                          {mi > 0 && <div className="tdp2-day-meal-sep" />}
                          <div className="tdp2-day-meal-item">
                            <img src="/figma/itin-section/itinerary-meal.svg" alt="" className="tdp2-day-meal-icon" aria-hidden loading="lazy" />
                            <span className="tdp2-day-meal-label">{meal}</span>
                            <img src="/figma/itin-section/itinerary-done.svg" alt="" className="tdp2-day-meal-done" aria-hidden loading="lazy" />
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Activity timeline section */}
          {hasActivities && (
            <div className="tdp2-day-tl-item">
              <div className="tdp2-day-tl-left">
                <img src="/figma/itin-section/itinerary-timeline.svg" alt="" className="tdp2-day-tl-pin" aria-hidden loading="lazy" />
                <div className="tdp2-day-tl-line" />
              </div>
              <div className="tdp2-day-tl-content tdp2-day-tl-content--act">
                <div className="tdp2-day-tl-section-hd">
                  <img src="/figma/itin-section/itinerary-activity.svg" alt="" className="tdp2-day-tl-sec-icon tdp2-day-tl-sec-icon--act" aria-hidden loading="lazy" />
                  <span className="tdp2-day-tl-sec-label">Activity</span>
                </div>
                {day.activities!.map((act, ai) => (
                  <div key={ai} className="tdp2-day-activity-item">
                    {ai > 0 && <div className="tdp2-day-act-divider" />}
                    {act.isLeisure ? (
                      <div className="tdp2-day-leisure-card">
                        <img src="/figma/itin-section/itinerary-leisure.svg" alt="" className="tdp2-day-leisure-icon" aria-hidden loading="lazy" />
                        <span className="tdp2-day-leisure-label">{act.title}</span>
                      </div>
                    ) : (
                      <div className="tdp2-day-act-row">
                        <div className="tdp2-day-act-text">
                          <p className="tdp2-day-act-title">{act.title}</p>
                        </div>
                        {act.photos?.[0] && (
                          <img src={act.photos[0]} alt="" className="tdp2-day-act-thumb" loading="lazy" />
                        )}
                      </div>
                    )}
                    {act.leisureDesc && (
                      <p className="tdp2-day-leisure-desc">
                        {act.leisureDescBold ? (
                          <>
                            {act.leisureDesc.split(act.leisureDescBold)[0]}
                            <strong>{act.leisureDescBold}</strong>
                            {act.leisureDesc.split(act.leisureDescBold)[1]}
                          </>
                        ) : act.leisureDesc}
                      </p>
                    )}
                    {act.leisurePhotos && act.leisurePhotos.length > 0 && (
                      <div className="tdp2-day-leisure-photos">
                        {act.leisurePhotos.map((ph, pi) => (
                          <img key={pi} src={ph} alt="" className="tdp2-day-leisure-photo" loading="lazy" />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fallback simple timeline for days without rich data */}
          {!hasStay && !hasActivities && day.items.length > 0 && (
            <div className="tdp2-day-timeline">
              {day.items.map((item, ti) => (
                <div key={ti} className="tdp2-day-tl-item">
                  <div className="tdp2-day-tl-left">
                    <img src="/figma/itin-section/itinerary-timeline.svg" alt="" className="tdp2-day-tl-pin" aria-hidden loading="lazy" />
                    <div className="tdp2-day-tl-line" />
                  </div>
                  <p className="tdp2-day-tl-text">{item}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
