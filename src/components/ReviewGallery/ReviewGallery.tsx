import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./ReviewGallery.css";

const R = "/figma/reviews/";
const B = "/figma/booking/";

const CATEGORIES = ["Destination", "Activities", "Accommodation", "Transfer"];

interface ReviewGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  reviewerName: string;
  rating: string;
  tripTitle: string;
  tags: string[];
  photos: string[];
  initialIndex?: number;
}

export default function ReviewGallery({
  isOpen,
  onClose,
  reviewerName,
  rating,
  tripTitle,
  tags,
  photos,
  initialIndex = 0,
}: ReviewGalleryProps) {
  const [hasOpened, setHasOpened] = useState(false);
  const [activeCat, setActiveCat] = useState(0);
  const [index, setIndex] = useState(initialIndex);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setHasOpened(true);
      setIndex(initialIndex);
      setActiveCat(0);
    }
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, initialIndex]);

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const first = el.querySelector<HTMLElement>(".rgal-slide");
    const slideW = first ? first.offsetWidth + 16 : el.clientWidth;
    const i = Math.round(el.scrollLeft / slideW);
    setIndex(Math.max(0, Math.min(photos.length - 1, i)));
  };

  if (!hasOpened) return null;

  return createPortal(
    <div
      className={`rgal${isOpen ? " rgal--open" : ""}`}
      role="dialog"
      aria-modal="true"
    >
      <div className="rgal-panel">
        {/* Header */}
        <div className="rgal-header">
          <div className="rgal-header-left">
            <button className="rgal-back" type="button" onClick={onClose} aria-label="Back">
              <img src={`${R}icon-back.svg`} alt="" aria-hidden />
            </button>
            <span className="rgal-title">Gallery</span>
          </div>
          <button className="rgal-close" type="button" onClick={onClose} aria-label="Close">
            <img src={`${B}icon-close.svg`} alt="" aria-hidden />
          </button>
        </div>

        <div className="rgal-body">
          {/* Reviewer + trip + tags */}
          <div className="rgal-meta">
            <div className="rgal-meta-head">
              <span className="rgal-name">{reviewerName}</span>
              <span className="rgal-rating">
                <span>{rating}</span>
                <img src={`${R}star-filled.svg`} alt="" className="rgal-star" aria-hidden />
              </span>
            </div>
            <p className="rgal-trip">{tripTitle}</p>
            <div className="rgal-tags">
              {tags.map((t) => (
                <span key={t} className="rgal-tag">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Category tabs */}
          <div className="rgal-cats">
            {CATEGORIES.map((c, i) => (
              <button
                key={c}
                type="button"
                className={`rgal-cat${i === activeCat ? " rgal-cat--active" : ""}`}
                onClick={() => setActiveCat(i)}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Image carousel */}
          <div className="rgal-carousel" ref={trackRef} onScroll={onScroll}>
            {photos.map((src, i) => (
              <div className="rgal-slide" key={i}>
                <img src={src} alt="" loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        {/* Counter */}
        <div className="rgal-counter">
          {index + 1}/{photos.length}
        </div>
      </div>
    </div>,
    document.body
  );
}
