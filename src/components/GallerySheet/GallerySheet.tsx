import { useState, useEffect, useRef, useCallback } from "react";
import "./GallerySheet.css";
import ScrollButtons from "../ScrollButtons/ScrollButtons";

const TABS = ["Destination", "Activities", "Accommodation", "Transfer"];

interface GallerySheetProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  startIndex?: number;
  title?: string;
  tags?: string[];
  reviewerName?: string;
  reviewerRating?: string;
}

export default function GallerySheet({
  isOpen,
  onClose,
  images,
  startIndex = 0,
  title,
  tags,
  reviewerName,
  reviewerRating,
}: GallerySheetProps) {
  const [hasOpened, setHasOpened] = useState(false);
  const [activeIdx, setActiveIdx] = useState(startIndex);
  const [activeTab, setActiveTab] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (isOpen) setHasOpened(true); }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setActiveIdx(startIndex);
      if (scrollRef.current) {
        scrollRef.current.scrollLeft = startIndex * (300 + 16);
      }
    }
  }, [isOpen, startIndex]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const idx = Math.round(scrollRef.current.scrollLeft / (300 + 16));
    setActiveIdx(Math.max(0, Math.min(idx, images.length - 1)));
  }, [images.length]);

  const scrollPrev = useCallback(() => {
    if (!scrollRef.current) return;
    const newIdx = Math.max(0, activeIdx - 1);
    scrollRef.current.scrollTo({ left: newIdx * (300 + 16), behavior: "smooth" });
  }, [activeIdx]);

  const scrollNext = useCallback(() => {
    if (!scrollRef.current) return;
    const newIdx = Math.min(images.length - 1, activeIdx + 1);
    scrollRef.current.scrollTo({ left: newIdx * (300 + 16), behavior: "smooth" });
  }, [activeIdx, images.length]);

  if (!hasOpened) return null;

  return (
    <div className={`gsh${isOpen ? " gsh--open" : ""}`} role="dialog" aria-modal="true" aria-label="Gallery">

      {/* Header */}
      <div className="gsh-header">
        <div className="gsh-header-left">
          <button className="gsh-back" type="button" onClick={onClose} aria-label="Back">
            <img src="/figma/gallery/icon-arrow-back.svg" alt="" aria-hidden />
          </button>
          <p className="gsh-title">Gallery</p>
        </div>
        <button className="gsh-close" type="button" onClick={onClose} aria-label="Close gallery">
          <img src="/figma/gallery/icon-close.svg" alt="" aria-hidden loading="lazy" />
        </button>
      </div>

      {/* Info + tabs + scroll wrapper */}
      <div className="gsh-body">

        {/* Info section */}
        {(title || (tags && tags.length > 0)) && (
          <div className="gsh-info">
            {(reviewerName || reviewerRating) && (
              <div className="gsh-reviewer-row">
                {reviewerName && <span className="gsh-reviewer-name">{reviewerName}</span>}
                {reviewerRating && (
                  <div className="gsh-reviewer-rating">
                    <span className="gsh-reviewer-score">{reviewerRating}</span>
                    <img src="/figma/gallery/icon-star.svg" alt="" aria-hidden className="gsh-reviewer-star" />
                  </div>
                )}
              </div>
            )}
            {title && <p className="gsh-info-title">{title}</p>}
            {tags && tags.length > 0 && (
              <div className="gsh-info-tags">
                {tags.map(t => <span key={t} className="gsh-info-tag">{t}</span>)}
              </div>
            )}
          </div>
        )}

        {(title || (tags && tags.length > 0)) && <div className="gsh-separator" />}

        {/* Filter tabs */}
        <div className="gsh-tabs">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            type="button"
            className={`gsh-tab${i === activeTab ? " gsh-tab--active" : ""}`}
            onClick={() => setActiveTab(i)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Photo scroll */}
      <div className="gsh-scroll" ref={scrollRef} onScroll={handleScroll}>
        {images.map((src, i) => (
          <div key={i} className="gsh-img-wrap">
            <img src={src} alt={`Photo ${i + 1}`} className="gsh-img" loading="lazy" />
          </div>
        ))}
      </div>

      {/* Counter */}
      <p className="gsh-counter">{activeIdx + 1}/{images.length}</p>

        <div className="gsh-scroll-btns">
          <ScrollButtons onPrev={scrollPrev} onNext={scrollNext} prevActive={activeIdx > 0} />
        </div>

      </div>{/* /gsh-body */}

    </div>
  );
}
