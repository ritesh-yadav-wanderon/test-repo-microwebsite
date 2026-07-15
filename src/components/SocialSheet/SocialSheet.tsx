import { useState, useEffect } from "react";
import "./SocialSheet.css";

const P = "/figma/profile/";

const SOCIALS = [
  { label: "Instagram", icon: `${P}social-icon-instagram.svg` },
  { label: "Facebook",  icon: `${P}social-icon-facebook.svg`  },
  { label: "LinkedIn",  icon: `${P}social-icon-linkedin.svg`  },
] as const;

interface SocialSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SocialSheet({ isOpen, onClose }: SocialSheetProps) {
  const [hasOpened, setHasOpened] = useState(false);
  useEffect(() => { if (isOpen) setHasOpened(true); }, [isOpen]);
  if (!hasOpened) return null;
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`ssp-overlay${isOpen ? " ssp-overlay--visible" : ""}`}
        onClick={onClose}
        aria-hidden
      />

      {/* Sheet */}
      <div
        className={`ssp${isOpen ? " ssp--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Add your social profile"
      >
        {/* Close — floats 34px above sheet top */}
        <button
          className="ssp-close"
          type="button"
          onClick={onClose}
          aria-label="Close"
        >
          <img src={`${P}social-icon-close.svg`} alt="" width={18} height={18} aria-hidden />
        </button>

        {/* Inner card */}
        <div className="ssp-card">
          <p className="ssp-title">Add your social profile</p>

          <div className="ssp-socials">
            {SOCIALS.map(({ label, icon }) => (
              <button key={label} type="button" className="ssp-social-btn">
                <img src={icon} alt="" width={20} height={20} aria-hidden />
                <span className="ssp-social-label">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
