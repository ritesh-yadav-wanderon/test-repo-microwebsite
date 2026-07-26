import { Fragment, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { DEST_REGIONS } from "../../data/destinations";
import { setAppScrollLocked } from "../../utils/scroll";
import "./DesktopReviewsModal.css";

const R = "/figma/reviews/";

/* Same data as the mobile ReviewsSheet. */
const TABS = ["All", "Solo Travellers (8)", "Women Travellers (12)", "Adventure", "Wellness", "Festival", "Luxury", "Romantic", "Cultural"];

const RATING_BARS = [
  { label: 5, fill: 60 },
  { label: 4, fill: 20 },
  { label: 3, fill: 6 },
  { label: 2, fill: 0 },
  { label: 1, fill: 0 },
];

const CATEGORIES = [
  { label: "Experience", rating: "4.8", icon: `${R}icon-experience.svg` },
  { label: "Trip Captain", rating: "4.9", icon: `${R}icon-captain.svg` },
  { label: "Accommodation", rating: "5", icon: `${R}icon-accommodation.svg` },
  { label: "Transport", rating: "5", icon: `${R}icon-transport.svg` },
  { label: "On Trip Support", rating: "5", icon: `${R}icon-support.svg` },
];

const DEST_TAGS = ["Bali", "Ubud", "Kintamani Waterfalls", "Nusa Penida", "Kuta", "Uluwatu Temple"];

const REVIEW_TEXT =
  "It was an amazing trip. I recently went to Bhutan with WanderOn (7N/8D with Phobjikha valley) and it was a beautiful place to visit. The immigration experience was smooth. We got to visit clean and peaceful cities, cool and serene valleys and truly magnificent monasteries...";

/* Full-size photos for the desktop strip (Figma 5635:12031) — the mobile
   review-photo-*.jpg thumbnails are only 80×80 and look blurry at this size. */
const REVIEW_PHOTOS = [
  `${R}modal-photo-1.png`,
  `${R}modal-photo-2.png`,
  `${R}modal-photo-3.png`,
  `${R}modal-photo-4.png`,
];

const REVIEWS = [
  { name: "Shrutika Parab", date: "May, 2026" },
  { name: "Priya Sharma", date: "Apr, 2026" },
  { name: "Rahul Mehta", date: "Mar, 2026" },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

/** Desktop "Reviews mention" pop-up modal (Figma 5633:21592). */
export default function DesktopReviewsModal({ isOpen, onClose }: Props) {
  const [hasOpened, setHasOpened] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [destOpen, setDestOpen] = useState(false);
  const [selectedDest, setSelectedDest] = useState<string | null>(null);
  const destRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setHasOpened(true);
      setActiveTab(0);
      setDestOpen(false);
    }
    setAppScrollLocked(isOpen);
    return () => setAppScrollLocked(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // Close the destinations dropdown first; a second Escape closes the modal.
      setDestOpen((open) => {
        if (!open) onClose();
        return false;
      });
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!destOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!destRef.current?.contains(e.target as Node)) setDestOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [destOpen]);

  const pickDest = (label: string | null) => {
    setSelectedDest(label);
    setDestOpen(false);
  };

  if (!hasOpened) return null;

  return createPortal(
    <div className={`drm${isOpen ? " drm--open" : ""}`} onClick={onClose}>
      <div className="drm__box" onClick={(e) => e.stopPropagation()}>
        <button className="drm__close" aria-label="Close reviews" onClick={onClose}>
          <img src={`${R}icon-close.svg`} alt="" />
        </button>

        <div className="drm__modal" role="dialog" aria-modal="true" aria-label="Reviews">
        {/* ── Cream summary header ── */}
        <div className="drm__summary">
          <h2 className="drm__title">Reviews mention</h2>

          <div className="drm__breakdown">
            <div className="drm__bars-col">
              <p className="drm__col-label">Overall ratings</p>
              <div className="drm__bars">
                {RATING_BARS.map((r) => (
                  <div key={r.label} className="drm__bar-row">
                    <span className="drm__bar-num">{r.label}</span>
                    <img src={`${R}star-bar.svg`} alt="" aria-hidden />
                    <span className="drm__bar-track">
                      <span className="drm__bar-fill" style={{ width: `${r.fill}px` }} />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {CATEGORIES.map((cat) => (
              <Fragment key={cat.label}>
                <span className="drm__vdiv" aria-hidden />
                <div className="drm__cat">
                  <div className="drm__cat-top">
                    <p className="drm__col-label">{cat.label}</p>
                    <p className="drm__cat-rating">
                      {cat.rating}
                      <img src={`${R}star-cat.svg`} alt="" aria-hidden />
                    </p>
                  </div>
                  <img className="drm__cat-icon" src={cat.icon} alt="" aria-hidden />
                </div>
              </Fragment>
            ))}
          </div>

          <div className="drm__dest-wrap" ref={destRef}>
            <button
              className={`drm__dest-btn${selectedDest ? " drm__dest-btn--selected" : ""}${destOpen ? " drm__dest-btn--open" : ""}`}
              type="button"
              aria-haspopup="menu"
              aria-expanded={destOpen}
              onClick={() => setDestOpen((v) => !v)}
            >
              {selectedDest ?? "Destination"}
              <img src={`${R}icon-dropdown.svg`} alt="" aria-hidden />
            </button>

            {destOpen && (
              <div className="drm__dest-menu" role="menu">
                <button
                  className={`drm__dest-item${selectedDest === null ? " drm__dest-item--active" : ""}`}
                  role="menuitem"
                  onClick={() => pickDest(null)}
                >
                  All destinations
                </button>
                {DEST_REGIONS.map((region) => (
                  <div key={region.slug} className="drm__dest-group">
                    <p className="drm__dest-group-label">{region.label}</p>
                    {region.items.map((item) => (
                      <button
                        key={item.slug}
                        className={`drm__dest-item${selectedDest === item.label ? " drm__dest-item--active" : ""}`}
                        role="menuitem"
                        onClick={() => pickDest(item.label)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Body: filter pills + reviews ── */}
        <div className="drm__body">
          <div className="drm__tabs">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                className={`drm__tab${i === activeTab ? " drm__tab--active" : ""}`}
                onClick={() => setActiveTab(i)}
              >
                {tab}
              </button>
            ))}
          </div>

          {REVIEWS.map((review, idx) => (
            <Fragment key={review.name}>
              {idx > 0 && <div className="drm__divider" aria-hidden />}
              <article className="drm__review">
                <header className="drm__review-head">
                  <img className="drm__avatar" src={`${R}reviewer-avatar.jpg`} alt="" loading="lazy" />
                  <div className="drm__review-meta">
                    <p className="drm__review-name">{review.name}</p>
                    <div className="drm__review-sub">
                      <span>{review.date}</span>
                      <span className="drm__review-stars">
                        {Array.from({ length: 5 }, (_, i) => (
                          <img key={i} src={`${R}star-filled.svg`} alt="" aria-hidden />
                        ))}
                      </span>
                    </div>
                  </div>
                </header>

                <div className="drm__tags">
                  <span className="drm__tags-label">Review for: </span>
                  {DEST_TAGS.map((t) => (
                    <span key={t} className="drm__tag">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="drm__text-wrap">
                  <p className="drm__text">{REVIEW_TEXT}</p>
                  <button className="drm__read-more" type="button">
                    Read More
                  </button>
                </div>

                <div className="drm__photos">
                  {REVIEW_PHOTOS.map((src, i) => (
                    <img key={i} src={src} alt="" loading="lazy" />
                  ))}
                </div>

                <footer className="drm__review-foot">
                  <div className="drm__helpful">
                    Was this helpful?
                    <button type="button" aria-label="Helpful">
                      <img src={`${R}icon-thumb-up.svg`} alt="" />
                    </button>
                  </div>
                  <div className="drm__arrows">
                    <button className="drm__arrow" aria-label="Previous photos">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M15 4 7 12l8 8" stroke="#3d3d3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button className="drm__arrow" aria-label="Next photos">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="m9 4 8 8-8 8" stroke="#3d3d3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </footer>
              </article>
            </Fragment>
          ))}
        </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
