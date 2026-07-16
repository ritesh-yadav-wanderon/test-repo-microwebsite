import { useEffect, useState } from "react";
import { DEST_REGIONS } from "../../data/destinations";
import "./DestinationSheet.css";

const M = "/figma/menu/";

export interface DestinationSelection {
  label: string;
  slug: string;
}

interface DestinationSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (dest: DestinationSelection) => void;
}

export default function DestinationSheet({ isOpen, onClose, onSelect }: DestinationSheetProps) {
  const [hasOpened, setHasOpened] = useState(false);
  const [expandedRegion, setExpandedRegion] = useState<string>("india");

  useEffect(() => {
    if (isOpen) setHasOpened(true);
    if (!isOpen) setExpandedRegion("india");
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!hasOpened) return null;

  function pick(dest: DestinationSelection) {
    onSelect?.(dest);
    onClose();
  }

  return (
    <div
      className={`dsh-overlay${isOpen ? " dsh-overlay--open" : ""}`}
      aria-hidden={!isOpen}
      onClick={onClose}
    >
      <div
        className={`dsh-sheet${isOpen ? " dsh-sheet--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Select destination"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="dsh-header">
          <span className="dsh-title">Destination</span>
          <button className="dsh-close" type="button" aria-label="Close" onClick={onClose}>
            <img src={`${M}icon-close.svg`} width={30} height={30} alt="" aria-hidden />
          </button>
        </div>

        {/* Destination accordion — same design as the burger menu */}
        <div className="dsh-content">
          {DEST_REGIONS.map((region, i) => (
            <div key={region.slug} className="dsh-region">
              {expandedRegion === region.slug ? (
                <div className="dsh-expanded">
                  <div className="dsh-region-header--expanded">
                    <span className="dsh-region-label">{region.label}</span>
                  </div>
                  <button
                    className="dsh-item"
                    type="button"
                    onClick={() => pick({ label: region.allLabel, slug: region.slug })}
                  >
                    <span className="dsh-item-label">{region.allLabel}</span>
                  </button>
                  {region.items.map((dest) => (
                    <button
                      key={dest.slug}
                      className="dsh-item"
                      type="button"
                      onClick={() => pick({ label: dest.label, slug: dest.slug })}
                    >
                      <span className="dsh-item-label">{dest.label}</span>
                      {dest.trending && (
                        <div className="dsh-trending">
                          <img src={`${M}trending-sparkle-left.png`} width={12} height={8} alt="" aria-hidden />
                          <span className="dsh-trending-text">Trending</span>
                          <img src={`${M}trending-sparkle-right.png`} width={12} height={8} alt="" aria-hidden />
                        </div>
                      )}
                    </button>
                  ))}
                  {region.seeMore && (
                    <button
                      className="dsh-item"
                      type="button"
                      onClick={() => pick({ label: region.allLabel, slug: region.slug })}
                    >
                      <span className="dsh-see-more">see more destinations</span>
                    </button>
                  )}
                </div>
              ) : (
                <button
                  className="dsh-region-collapsed"
                  type="button"
                  onClick={() => setExpandedRegion(region.slug)}
                >
                  <span className="dsh-region-label">{region.label}</span>
                  <img src={`${M}icon-arrow-forward.svg`} width={16} height={16} alt="" aria-hidden />
                </button>
              )}
              {i < DEST_REGIONS.length - 1 && <div className="dsh-sep" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
