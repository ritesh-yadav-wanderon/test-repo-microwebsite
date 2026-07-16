import { useEffect, useState } from "react";
import "./ShareSheet.css";

interface ShareSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  image: string;
  duration?: string;
  price?: string;
  /** Absolute URL to share. Defaults to the current page URL. */
  url?: string;
}

export default function ShareSheet({ isOpen, onClose, title, image, duration, price, url }: ShareSheetProps) {
  const [hasOpened, setHasOpened] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => { if (isOpen) setHasOpened(true); }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => { if (!isOpen) setCopied(false); }, [isOpen]);

  if (!hasOpened) return null;

  const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");
  const priceText = price ? `Starting ₹${String(price).replace(/^₹/, "")}` : "";
  const message = [
    `Check out this WanderOn trip: ${title}`,
    [duration, priceText].filter(Boolean).join(" · "),
    shareUrl,
  ]
    .filter(Boolean)
    .join("\n");

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(message)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  }

  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: message, url: shareUrl });
        onClose();
      } catch {
        /* user cancelled */
      }
    }
  }

  return (
    <div
      className={`shs-overlay${isOpen ? " shs-overlay--open" : ""}`}
      onClick={onClose}
      aria-hidden={!isOpen}
    >
      <div
        className={`shs-sheet${isOpen ? " shs-sheet--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Share this trip"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shs-handle" aria-hidden />

        <div className="shs-head">
          <span className="shs-title">Share this trip</span>
          <button className="shs-close" type="button" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M1 1L15 15M15 1L1 15" stroke="#4e4e4e" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Preview card (Spotify-style) */}
        <div className="shs-preview">
          <img src={image} alt="" className="shs-preview-img" />
          <div className="shs-preview-info">
            <p className="shs-preview-name">{title}</p>
            <div className="shs-preview-meta">
              {duration && <span className="shs-preview-chip">{duration}</span>}
              {priceText && <span className="shs-preview-price">{priceText}/-</span>}
            </div>
          </div>
        </div>

        {/* Share destinations */}
        <div className="shs-targets">
          <a
            className="shs-target"
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            onClick={onClose}
          >
            <span className="shs-target-ico shs-target-ico--wa">
              <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden>
                <path
                  d="M16.02 4C9.94 4 5 8.94 5 15.02c0 2.12.6 4.1 1.63 5.78L5 28l7.38-1.6a11 11 0 0 0 3.64.62h.01C22.1 27.02 27 22.08 27 16A11 11 0 0 0 16.02 4Z"
                  fill="#25D366"
                />
                <path
                  d="M21.9 18.6c-.32-.16-1.9-.94-2.2-1.05-.29-.11-.5-.16-.72.16-.21.32-.82 1.04-1 1.25-.19.21-.37.24-.68.08-.32-.16-1.35-.5-2.57-1.58-.95-.85-1.59-1.9-1.78-2.22-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.38-.26-.62-.52-.54-.72-.55l-.61-.01c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.66 0 1.57 1.14 3.08 1.3 3.29.16.21 2.25 3.44 5.46 4.82.76.33 1.36.53 1.82.68.77.24 1.46.21 2.01.13.61-.09 1.9-.78 2.17-1.53.27-.75.27-1.39.19-1.53-.08-.13-.29-.21-.61-.37Z"
                  fill="#fff"
                />
              </svg>
            </span>
            <span className="shs-target-label">WhatsApp</span>
          </a>

          <button className="shs-target" type="button" onClick={copyLink}>
            <span className="shs-target-ico shs-target-ico--copy">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M9.5 13.5a4 4 0 0 0 5.66 0l3-3a4 4 0 1 0-5.66-5.66l-1.2 1.2" stroke="#3d3d3d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14.5 10.5a4 4 0 0 0-5.66 0l-3 3a4 4 0 1 0 5.66 5.66l1.2-1.2" stroke="#3d3d3d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="shs-target-label">{copied ? "Copied!" : "Copy link"}</span>
          </button>

          {typeof navigator !== "undefined" && !!navigator.share && (
            <button className="shs-target" type="button" onClick={nativeShare}>
              <span className="shs-target-ico shs-target-ico--more">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="18" cy="5" r="2.4" stroke="#3d3d3d" strokeWidth="1.8" />
                  <circle cx="6" cy="12" r="2.4" stroke="#3d3d3d" strokeWidth="1.8" />
                  <circle cx="18" cy="19" r="2.4" stroke="#3d3d3d" strokeWidth="1.8" />
                  <path d="M8.1 10.9 15.9 6.1M8.1 13.1l7.8 4.8" stroke="#3d3d3d" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
              <span className="shs-target-label">More</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
