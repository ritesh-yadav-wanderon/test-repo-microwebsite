import { useState, useEffect, useRef } from "react";
import { DEST_REGIONS } from "../../data/destinations";
import { COUNTRIES, type Country } from "../../data/countries";
import "./ContactFormSheet.css";

const M = "/figma/menu/";

interface ContactFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactFormSheet({ isOpen, onClose }: ContactFormSheetProps) {
  const [hasOpened, setHasOpened] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [destination, setDestination] = useState("");
  const [destOpen, setDestOpen] = useState(false);
  const [expandedRegion, setExpandedRegion] = useState("india");
  const [country, setCountry] = useState<Country>(COUNTRIES[0]);
  const [countryOpen, setCountryOpen] = useState(false);
  const countryRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (isOpen) setHasOpened(true); }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Pin the sheet to the visual viewport so it hugs the on-screen keyboard
  // (avoids the gap/overlap left by position:fixed when the keyboard opens).
  useEffect(() => {
    const vv = window.visualViewport;
    if (!isOpen || !vv) return;
    const update = () => {
      const overlap = window.innerHeight - vv.height - vv.offsetTop;
      if (sheetRef.current) {
        sheetRef.current.style.bottom = `${Math.max(0, overlap)}px`;
        sheetRef.current.style.maxHeight = `${vv.height}px`;
      }
    };
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
      if (sheetRef.current) {
        sheetRef.current.style.bottom = "";
        sheetRef.current.style.maxHeight = "";
      }
    };
  }, [isOpen]);

  // Collapse dropdowns whenever the sheet closes.
  useEffect(() => {
    if (!isOpen) {
      setDestOpen(false);
      setCountryOpen(false);
    }
  }, [isOpen]);

  // Close the country dropdown on outside click.
  useEffect(() => {
    if (!countryOpen) return;
    function onOutside(e: MouseEvent) {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
        setCountryOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [countryOpen]);

  if (!hasOpened) return null;

  const selectDestination = (label: string) => {
    setDestination(label);
    setDestOpen(false);
  };

  const selectCountry = (c: Country) => {
    setCountry(c);
    setCountryOpen(false);
  };

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
        ref={sheetRef}
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
                ref={nameRef}
                className="cfs-input"
                type="text"
                placeholder="enter your name"
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="name"
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    phoneRef.current?.focus();
                  }
                }}
              />

              {/* Phone */}
              <div className="cfs-phone-section" ref={countryRef}>
                <div className="cfs-phone-row">
                  <button
                    type="button"
                    className="cfs-country-code"
                    onClick={() => setCountryOpen(v => !v)}
                    aria-haspopup="listbox"
                    aria-expanded={countryOpen}
                    aria-label={`Country code: ${country.name} ${country.code}`}
                  >
                    <span>{country.code}</span>
                    <img
                      src="/figma/enquire/arrow.svg"
                      alt=""
                      className={`cfs-cc-arrow${countryOpen ? " cfs-cc-arrow--open" : ""}`}
                      aria-hidden
                    />
                  </button>
                  <input
                    ref={phoneRef}
                    className="cfs-input cfs-phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={country.digits[1]}
                    placeholder="enter your phone number"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
                    onFocus={() => setCountryOpen(false)}
                    autoComplete="tel"
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        // Next field (destination) is a dropdown, not a plain
                        // input, so just dismiss the keyboard.
                        phoneRef.current?.blur();
                      }
                    }}
                  />
                </div>

                {countryOpen && (
                  <div className="cfs-country-box" role="listbox" aria-label="Select country code">
                    {COUNTRIES.map(c => (
                      <button
                        key={`${c.code}-${c.iso}`}
                        type="button"
                        className={`cfs-country-row${c.iso === country.iso && c.code === country.code ? " cfs-country-row--selected" : ""}`}
                        role="option"
                        aria-selected={c.iso === country.iso && c.code === country.code}
                        onClick={() => selectCountry(c)}
                      >
                        <span className="cfs-country-code-text">{c.code} {c.iso}</span>
                        <span className="cfs-country-name">{c.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Destination */}
              <div className="cfs-dest">
                <button
                  type="button"
                  className={`cfs-dest-trigger${destination ? " cfs-dest-trigger--filled" : ""}`}
                  onClick={() => setDestOpen(v => !v)}
                  aria-haspopup="listbox"
                  aria-expanded={destOpen}
                >
                  <span>{destination || "select destination"}</span>
                  <img
                    src="/figma/enquire/arrow.svg"
                    alt=""
                    className={`cfs-dest-arrow${destOpen ? " cfs-dest-arrow--open" : ""}`}
                    aria-hidden
                  />
                </button>

                {destOpen && (
                  <div className="cfs-dest-box" role="listbox">
                    {DEST_REGIONS.map((region, i) => (
                      <div key={region.slug} className="cfs-dest-region">
                        {expandedRegion === region.slug ? (
                          <div className="cfs-dest-expanded">
                            <div className="cfs-dest-region-header">
                              <span className="cfs-dest-region-label">
                                {region.label}
                              </span>
                            </div>
                            {region.items.map(dest => (
                              <button
                                key={dest.slug}
                                type="button"
                                className="cfs-dest-item"
                                role="option"
                                aria-selected={destination === dest.label}
                                onClick={() => selectDestination(dest.label)}
                              >
                                <span className="cfs-dest-item-label">
                                  {dest.label}
                                </span>
                                {dest.trending && (
                                  <span className="cfs-dest-trending">
                                    <img
                                      src={`${M}trending-sparkle-left.png`}
                                      width={12}
                                      height={8}
                                      alt=""
                                      aria-hidden
                                    />
                                    <span className="cfs-dest-trending-text">
                                      Trending
                                    </span>
                                    <img
                                      src={`${M}trending-sparkle-right.png`}
                                      width={12}
                                      height={8}
                                      alt=""
                                      aria-hidden
                                    />
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="cfs-dest-region-collapsed"
                            onClick={() => setExpandedRegion(region.slug)}
                          >
                            <span className="cfs-dest-region-label">
                              {region.label}
                            </span>
                            <img
                              src={`${M}icon-arrow-forward.svg`}
                              width={16}
                              height={16}
                              alt=""
                              aria-hidden
                            />
                          </button>
                        )}
                        {i < DEST_REGIONS.length - 1 && (
                          <div className="cfs-dest-sep" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
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
