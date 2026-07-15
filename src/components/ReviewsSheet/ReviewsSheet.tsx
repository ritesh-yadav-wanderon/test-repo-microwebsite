import React, { useEffect, useState } from "react";
import "./ReviewsSheet.css";
import GallerySheet from "../GallerySheet/GallerySheet";

const R = "/figma/reviews/";

const TABS = ["All","Solo Travellers (8)","Women Travellers (12)","Adventure","Wellness","Festival","Luxury","Romantic","Cultural"];

const RATING_BARS = [
  { label: 5, fill: 60 },
  { label: 4, fill: 20 },
  { label: 3, fill: 6  },
  { label: 2, fill: 0  },
  { label: 1, fill: 0  },
];

const CATEGORIES = [
  { label: "Experience",      rating: "4.8", icon: `${R}icon-experience.svg`    },
  { label: "Trip Captain",    rating: "4.9", icon: `${R}icon-captain.svg`       },
  { label: "Accommodation",   rating: "5",   icon: `${R}icon-accommodation.svg` },
  { label: "Transport",       rating: "5",   icon: `${R}icon-transport.svg`     },
  { label: "On Trip Support", rating: "5",   icon: `${R}icon-support.svg`       },
];

const DEST_TAGS = ["Bali","Ubud","Kintamani Waterfalls","Nusa Penida","Kuta","Uluwatu Temple"];

const REVIEW_TEXT = "It was an amazing trip. I recently went to Bhutan with WanderOn (7N/8D with Phobjikha valley) and it was a beautiful place to visit. The immigration experience was smooth. We got to visit clean and peaceful cities, cool and serene valleys and truly magnificent monasteries...";

const REVIEW_PHOTOS = [
  `${R}review-photo-1.jpg`,
  `${R}review-photo-2.jpg`,
  `${R}review-photo-3.jpg`,
  `${R}review-photo-4.jpg`,
];

const REVIEWS = [
  { name: "Shrutika Parab", date: "May, 2026", rating: "5.0" },
  { name: "Priya Sharma",   date: "Apr, 2026", rating: "5.0" },
  { name: "Rahul Mehta",    date: "Mar, 2026", rating: "4.0" },
  { name: "Anjali Verma",   date: "Feb, 2026", rating: "5.0" },
];

function ReviewCard({ name, date, onPhotoClick }: { name: string; date: string; onPhotoClick: (idx: number) => void }) {
  return (
    <div className="rsh-card">
      <div className="rsh-card-header">
        <img src={`${R}reviewer-avatar.jpg`} alt="" className="rsh-card-avatar" loading="lazy" />
        <div className="rsh-card-meta">
          <p className="rsh-card-name">{name}</p>
          <div className="rsh-card-sub">
            <span className="rsh-card-date">{date}</span>
            <div className="rsh-stars-row">
              {[0,1,2,3,4].map(i => (
                <img key={i} src={`${R}star-filled.svg`} alt="" className="rsh-star" aria-hidden loading="lazy" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rsh-card-tags">
        <span className="rsh-card-tag-label">Review for: </span>
        {DEST_TAGS.map(t => <span key={t} className="rsh-card-tag">{t}</span>)}
      </div>

      <div className="rsh-card-text-wrap">
        <p className="rsh-card-text">{REVIEW_TEXT}</p>
        <button className="rsh-card-read-more" type="button">Read More</button>
      </div>

      <div className="rsh-card-photos">
        {REVIEW_PHOTOS.map((src, i) => (
          <div key={i} className={`rsh-card-photo${i === 3 ? " rsh-card-photo--more" : ""}`}
            onClick={() => onPhotoClick(i)} style={{ cursor: "pointer" }}>
            <img src={src} alt="" loading="lazy" />
            {i === 3 && (
              <div className="rsh-card-photo-overlay">
                <span>(10+)</span>
                <span className="rsh-card-photo-view">View All</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="rsh-card-helpful">
        <span className="rsh-card-helpful-label">Was this helpful?</span>
        <button className="rsh-card-thumb" type="button" aria-label="Helpful">
          <img src={`${R}icon-thumb-up.svg`} alt="" loading="lazy" />
        </button>
      </div>
    </div>
  );
}

export default function ReviewsSheet({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState(0);
  // Lazy-render: don't mount until first opened so it doesn't slow initial page load
  const [hasOpened, setHasOpened] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [galleryReviewer, setGalleryReviewer] = useState<{ name: string; rating: string } | null>(null);

  function openGallery(name: string, rating: string, idx: number) {
    setGalleryReviewer({ name, rating });
    setGalleryIndex(idx);
    setGalleryOpen(true);
  }

  useEffect(() => {
    if (isOpen) setHasOpened(true);
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!hasOpened) return null;

  return (
    <div className={`rsh${isOpen ? " rsh--open" : ""}`} role="dialog" aria-modal="true">

      <div className="rsh-header">
        <button className="rsh-back" onClick={onClose} aria-label="Close reviews">
          <img src={`${R}icon-back.svg`} alt="" loading="lazy" />
        </button>
        <span className="rsh-header-title">Reviews mention from our Community</span>
      </div>

      {/* ── Summary section (Figma 3746:22438) ── */}
      <div className="rsh-summary">

        {/* Laurels + 4.9 score */}
        <div className="rsh-big-rating">
          <img src={`${R}laurel.png`} alt="" className="rsh-laurel" aria-hidden loading="lazy" />
          <span className="rsh-rating-num">4.9</span>
          <img src={`${R}laurel.png`} alt="" className="rsh-laurel rsh-laurel--flip" aria-hidden loading="lazy" />
        </div>

        {/* Google + review count */}
        <div className="rsh-google-row">
          <img src={`${R}google-color.svg`} alt="Google" className="rsh-google-logo" />
          <span className="rsh-review-count">14921 Reviews</span>
        </div>

        {/* Overall bars + vertical sep + 5 category columns */}
        <div className="rsh-breakdown">

          <div className="rsh-bars-col">
            <p className="rsh-bars-label">Overall ratings</p>
            <div className="rsh-bars">
              {RATING_BARS.map(r => (
                <div key={r.label} className="rsh-bar-row">
                  <span className="rsh-bar-num">{r.label}</span>
                  <img src={`${R}star-bar.svg`} alt="" className="rsh-bar-star" aria-hidden loading="lazy" />
                  <div className="rsh-bar-track">
                    <div className="rsh-bar-fill" style={{ width: `${r.fill}px` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vertical separator between overall and categories */}
          <div className="rsh-ver-div" aria-hidden />

          <div className="rsh-cats">
            {CATEGORIES.map((cat, i) => (
              <React.Fragment key={cat.label}>
                {i > 0 && <div className="rsh-cat-sep" />}
                <div className="rsh-cat">
                  <div className="rsh-cat-top">
                    <p className="rsh-cat-label">{cat.label}</p>
                    <div className="rsh-cat-rating">
                      <span>{cat.rating}</span>
                      <img src={`${R}star-cat.svg`} alt="" className="rsh-cat-star" aria-hidden loading="lazy" />
                    </div>
                  </div>
                  <img src={cat.icon} alt="" className="rsh-cat-icon" aria-hidden loading="lazy" />
                </div>
              </React.Fragment>
            ))}
          </div>

        </div>

        {/* Destination filter pill */}
        <div className="rsh-dest-wrap">
          <button className="rsh-dest-btn" type="button">
            <span>Destination</span>
            <img src={`${R}icon-dropdown.svg`} alt="" className="rsh-dest-arrow" aria-hidden loading="lazy" />
          </button>
        </div>

      </div>

      <div className="rsh-tabs">
        {TABS.map((tab, i) => (
          <button key={tab} className={`rsh-tab${i === activeTab ? " rsh-tab--active" : ""}`}
            onClick={() => setActiveTab(i)}>
            {tab}
          </button>
        ))}
      </div>

      <div className="rsh-cards">
        {REVIEWS.map((r, i) => (
          <React.Fragment key={r.name}>
            {i > 0 && <div className="rsh-card-divider" />}
            <ReviewCard name={r.name} date={r.date} onPhotoClick={(idx) => openGallery(r.name, r.rating, idx)} />
          </React.Fragment>
        ))}
      </div>

      <div className="rsh-show-all-wrap">
        <button className="rsh-show-all-btn" type="button">Show all 42 reviews</button>
      </div>

      <div className="rsh-promo">
        <img src={`${R}promo-bg.jpg`} alt="" className="rsh-promo-bg" aria-hidden loading="lazy" />
        <div className="rsh-promo-overlay" aria-hidden />
        <div className="rsh-promo-content">
          <div className="rsh-promo-text">
            <p className="rsh-promo-title">Curated Bali Tour Packages</p>
            <p className="rsh-promo-price">
              <span className="rsh-promo-amount">Rs.80,000/-</span>
              {" "}<span className="rsh-promo-onwards">Onwards</span>
            </p>
          </div>
          <button className="rsh-promo-btn" type="button">View Packages</button>
        </div>
      </div>


      <GallerySheet
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        images={REVIEW_PHOTOS}
        startIndex={galleryIndex}
        title="Europe: Paris to Berlin, between cities, canals & culture"
        tags={["Bali", "Ubud", "Kintamani Waterfalls", "Nusa Penida", "Kuta", "Uluwatu Temple"]}
        reviewerName={galleryReviewer?.name}
        reviewerRating={galleryReviewer?.rating}
      />
    </div>
  );
}
