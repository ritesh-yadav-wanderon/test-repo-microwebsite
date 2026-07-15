import { useState, useRef, useEffect } from "react";
import { COUNTRIES, type Country } from "../../data/countries";
import "./PhoneInput.css";

const CHEVRON = "/figma/login-sheet/icon-chevron.svg";

export interface PhoneInputProps {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  className?: string;
  onCountryChange?: (country: { code: string; digits: [number, number] }) => void;
}

export default function PhoneInput({
  label = "Contact Number",
  value,
  onChange,
  error,
  className,
  onCountryChange,
}: PhoneInputProps) {
  const [focused, setFocused] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [touched, setTouched] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const [min, max] = country.digits;
  const hasValue = value.length > 0;
  const isLengthValid = hasValue && value.length >= min && value.length <= max;

  const internalError =
    touched && !hasValue
      ? "Enter your mobile number"
      : touched && hasValue && !isLengthValid
      ? min === max
        ? `Enter a valid ${min}-digit number`
        : `Enter ${min}–${max} digits for ${country.name}`
      : undefined;

  const displayError = error || internalError;

  const pillBorder  = countryOpen  ? "#757575" : "#e5e5e5";
  const inputBorder = displayError ? "#bb6262"
                    : focused      ? "#757575"
                    : hasValue     ? "#e6e6e6"
                    :                "#e5e5e5";
  const labelColor  = displayError ? "#bb6262" : "#757575";

  useEffect(() => {
    if (!countryOpen) return;
    function onOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setCountryOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [countryOpen]);

  useEffect(() => {
    if (countryOpen) {
      setSearch("");
      const t = setTimeout(() => searchRef.current?.focus(), 40);
      return () => clearTimeout(t);
    }
  }, [countryOpen]);

  const filtered = search.trim()
    ? COUNTRIES.filter(
        c =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.code.includes(search) ||
          c.iso.toLowerCase().includes(search.toLowerCase())
      )
    : COUNTRIES;

  function selectCountry(c: Country) {
    setCountry(c);
    setCountryOpen(false);
    onCountryChange?.({ code: c.code, digits: c.digits });
    if (value.length > c.digits[1]) onChange(value.slice(0, c.digits[1]));
    inputRef.current?.focus();
  }

  return (
    <div className={`phi-wrap${className ? ` ${className}` : ""}`} ref={wrapRef}>
      <div className="phi-row">
        <button
          type="button"
          className="phi-pill"
          style={{ borderColor: pillBorder }}
          aria-label={`Country: ${country.name} ${country.code}`}
          aria-expanded={countryOpen}
          onClick={() => { setCountryOpen(o => !o); setFocused(false); }}
        >
          <span className="phi-pill-text">{country.code}</span>
          <img
            src={CHEVRON}
            width={8}
            height={6}
            alt=""
            aria-hidden
            className={`phi-chevron${countryOpen ? " phi-chevron--open" : ""}`}
          />
        </button>

        <div className="phi-field-outer">
          <div className="phi-field" style={{ borderColor: inputBorder }}>
            <input
              ref={inputRef}
              className="phi-input"
              type="tel"
              inputMode="numeric"
              maxLength={max}
              value={value}
              placeholder={hasValue ? "" : label}
              onChange={e => onChange(e.target.value.replace(/\D/g, ""))}
              onFocus={() => { setFocused(true); setCountryOpen(false); }}
              onBlur={() => { setFocused(false); setTouched(true); }}
            />
          </div>
          {hasValue && (
            <span className="phi-float-label" style={{ color: labelColor }}>{label}</span>
          )}
        </div>
      </div>

      {displayError && <p className="phi-error">{displayError}</p>}

      {countryOpen && (
        <div className="phi-dropdown" role="listbox" aria-label="Select country code">
          <div className="phi-search-wrap">
            <input
              ref={searchRef}
              className="phi-search"
              type="text"
              placeholder="Search country or code…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search countries"
            />
          </div>
          {filtered.length === 0 ? (
            <p className="phi-no-results">No countries found</p>
          ) : (
            filtered.map(c => (
              <button
                key={`${c.code}-${c.iso}`}
                type="button"
                className={`phi-dropdown-row${c.iso === country.iso && c.code === country.code ? " phi-dropdown-row--selected" : ""}`}
                role="option"
                aria-selected={c.iso === country.iso && c.code === country.code}
                onClick={() => selectCountry(c)}
              >
                <span className="phi-dropdown-code">{c.code} {c.iso}</span>
                <span className="phi-dropdown-name">{c.name}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
