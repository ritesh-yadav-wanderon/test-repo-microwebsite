import { useState, useEffect } from "react";
import "./ContactFormSheet.css";

interface ContactFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const DESTINATIONS = [
  "Europe",
  "South East Asia",
  "Himalayas",
  "Rajasthan",
  "Goa",
  "Ladakh",
  "Spiti Valley",
  "Northeast India",
];

export default function ContactFormSheet({ isOpen, onClose }: ContactFormSheetProps) {
  const [hasOpened, setHasOpened] = useState(false);
  useEffect(() => { if (isOpen) setHasOpened(true); }, [isOpen]);
  if (!hasOpened) return null;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [destination, setDestination] = useState("");

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`cfs-overlay${isOpen ? " cfs-overlay--visible" : ""}`}
        onClick={onClose}
        aria-hidden
      />

      {/* Sheet */}
      <div
        className={`cfs${isOpen ? " cfs--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Enquire Now"
      >
        {/* Hero image header */}
        <div className="cfs-hero">
          <img src="/figma/enquire/form-hero.jpg" alt="" className="cfs-hero-img" />
          <div className="cfs-hero-overlay" aria-hidden />
          <div className="cfs-hero-bar">
            <img src="/figma/nav-logo.png" alt="WanderOn" className="cfs-logo" />
            <button
              className="cfs-close"
              type="button"
              onClick={onClose}
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M1 1L15 15M15 1L1 15"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="cfs-body">
          <h2 className="cfs-title">
            Live the magic between Ocean waves and emerald Skies!
          </h2>

          <form className="cfs-form" onSubmit={handleSubmit} noValidate>
            <div className="cfs-fields">
              {/* Name */}
              <input
                className="cfs-input"
                type="text"
                placeholder="enter your name"
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="name"
              />

              {/* Phone */}
              <div className="cfs-phone-row">
                <div className="cfs-country-code">
                  <span>+91</span>
                  <img
                    src="/figma/enquire/arrow.svg"
                    alt=""
                    className="cfs-cc-arrow"
                    aria-hidden
                  />
                </div>
                <input
                  className="cfs-input cfs-phone"
                  type="tel"
                  placeholder="enter your phone number"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  autoComplete="tel"
                />
              </div>

              {/* Destination */}
              <div className="cfs-select-wrap">
                <select
                  className="cfs-select"
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                >
                  <option value="" disabled>select destination</option>
                  {DESTINATIONS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <img
                  src="/figma/enquire/arrow.svg"
                  alt=""
                  className="cfs-select-arrow"
                  aria-hidden
                />
              </div>
            </div>

            <button className="cfs-submit" type="submit">
              Request Callback
            </button>
          </form>

          <p className="cfs-disclaimer">
            *No Spams, Our travel expert will reach out to you within 15 minutes.
          </p>
        </div>
      </div>
    </>
  );
}
