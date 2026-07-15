import { useState } from "react";
import "./TribeStories.css";
import ReviewsSheet from "../ReviewsSheet/ReviewsSheet";

interface Review {
  name: string;
  date: string;
  text: string;
}

const REVIEWS: Review[] = [
  {
    name: "Shrutika Parab",
    date: "May, 2026",
    text: "Thank you Team Wanderon for the amazing Ladakh Experience. Thank you Team Wanderon for the amazing Ladakh Experience. Right from the point of making the...",
  },
  {
    name: "Priya Sharma",
    date: "Apr, 2026",
    text: "An absolutely incredible trip to Spiti Valley! The team was professional and the experience was beyond expectations. Highly recommend WanderOn to everyone...",
  },
  {
    name: "Rahul Mehta",
    date: "Mar, 2026",
    text: "WanderOn made our Europe trip seamless and memorable. From Paris to Budapest, every detail was taken care of. The community vibe was amazing...",
  },
];

const TABS = [
  "All",
  "Solo Travellers (8)",
  "Women Travellers (12)",
  "Adventure",
  "Wellness",
  "Festival",
  "Luxury",
  "Romantic",
  "Cultural",
];

export default function TribeStories() {
  const [activeTab, setActiveTab] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <section className="tribe">
        {/* ── Rating block ── */}
        <div className="tribe-rating-block">
          <div className="tribe-stars-row">
            <img
              className="tribe-laurel"
              src="/figma/reviews/laurel.png"
              width={54} height={80}
              alt=""
              aria-hidden
            loading="lazy" />
            <span className="tribe-score">4.9</span>
            <img
              className="tribe-laurel tribe-laurel--flip"
              src="/figma/reviews/laurel.png"
              width={54} height={80}
              alt=""
              aria-hidden
            loading="lazy" />
          </div>
          <div className="tribe-review-meta">
            <div className="tribe-google-row">
              <img src="/figma/reviews/google-logo.svg" width={20} height={20} alt="Google" />
              <span className="tribe-review-count">14921 Reviews</span>
            </div>
            <p className="tribe-wanderers">Over 300,000 Wanderers have traveled with us</p>
          </div>
        </div>

        {/* ── Filter tabs + cards + CTA ── */}
        <div className="tribe-body">
          <div className="tribe-tabs" role="tablist">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                role="tab"
                aria-selected={i === activeTab}
                className={`tribe-tab${i === activeTab ? " tribe-tab--active" : ""}`}
                type="button"
                onClick={() => setActiveTab(i)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="tribe-cards">
            {REVIEWS.map((r, idx) => (
              <div key={r.name} className="tribe-card-wrap">
                <div className="tribe-card">
                  <div className="tribe-card-header">
                    <div className="tribe-avatar-stack">
                      <img
                        className="tribe-avatar-outer"
                        src="/figma/reviews/avatar-outer.svg"
                        width={60} height={60}
                        alt=""
                        aria-hidden
                      loading="lazy" />
                      <img
                        className="tribe-avatar-inner"
                        src="/figma/reviews/avatar-inner.png"
                        width={58} height={58}
                        alt={r.name}
                      loading="lazy" />
                    </div>
                    <div className="tribe-card-meta">
                      <p className="tribe-reviewer">{r.name}</p>
                      <div className="tribe-stars-date">
                        <img
                          src="/figma/reviews/stars-5.svg"
                          width={68} height={12}
                          alt="5 stars"
                        loading="lazy" />
                        <span className="tribe-date">{r.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="tribe-text">{r.text}</p>
                  <button className="tribe-read-more" type="button">Read More</button>
                </div>
                {idx < REVIEWS.length - 1 && (
                  <div className="tribe-divider" aria-hidden>
                    <img src="/figma/reviews/divider.png" width={1} alt="" loading="lazy" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            className="tribe-view-all"
            type="button"
            onClick={() => setSheetOpen(true)}
          >
            Show all 42 reviews
          </button>
        </div>
      </section>

      <ReviewsSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  );
}
