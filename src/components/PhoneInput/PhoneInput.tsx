import { useState, useRef, useEffect } from "react";
import "./PhoneInput.css";

const CHEVRON = "/figma/login-sheet/icon-chevron.svg";

interface Country {
  code: string;
  iso: string;
  name: string;
  digits: [number, number];
}

const COUNTRIES: Country[] = [
  { code: "+91",  iso: "IN", name: "India",          digits: [10, 10] },
  { code: "+93",  iso: "AF", name: "Afghanistan",    digits: [9,  9]  },
  { code: "+355", iso: "AL", name: "Albania",        digits: [9,  9]  },
  { code: "+213", iso: "DZ", name: "Algeria",        digits: [9,  9]  },
  { code: "+61",  iso: "AU", name: "Australia",      digits: [9,  9]  },
  { code: "+43",  iso: "AT", name: "Austria",        digits: [10, 11] },
  { code: "+32",  iso: "BE", name: "Belgium",        digits: [9,  9]  },
  { code: "+975", iso: "BT", name: "Bhutan",         digits: [7,  8]  },
  { code: "+55",  iso: "BR", name: "Brazil",         digits: [10, 11] },
  { code: "+1",   iso: "CA", name: "Canada",         digits: [10, 10] },
  { code: "+86",  iso: "CN", name: "China",          digits: [11, 11] },
  { code: "+45",  iso: "DK", name: "Denmark",        digits: [8,  8]  },
  { code: "+20",  iso: "EG", name: "Egypt",          digits: [10, 10] },
  { code: "+33",  iso: "FR", name: "France",         digits: [9,  9]  },
  { code: "+49",  iso: "DE", name: "Germany",        digits: [10, 11] },
  { code: "+30",  iso: "GR", name: "Greece",         digits: [10, 10] },
  { code: "+852", iso: "HK", name: "Hong Kong",      digits: [8,  8]  },
  { code: "+354", iso: "IS", name: "Iceland",        digits: [7,  7]  },
  { code: "+62",  iso: "ID", name: "Indonesia",      digits: [9,  12] },
  { code: "+353", iso: "IE", name: "Ireland",        digits: [9,  9]  },
  { code: "+972", iso: "IL", name: "Israel",         digits: [9,  9]  },
  { code: "+39",  iso: "IT", name: "Italy",          digits: [9,  10] },
  { code: "+81",  iso: "JP", name: "Japan",          digits: [10, 10] },
  { code: "+7",   iso: "KZ", name: "Kazakhstan",     digits: [10, 10] },
  { code: "+254", iso: "KE", name: "Kenya",          digits: [9,  9]  },
  { code: "+60",  iso: "MY", name: "Malaysia",       digits: [9,  10] },
  { code: "+960", iso: "MV", name: "Maldives",       digits: [7,  7]  },
  { code: "+230", iso: "MU", name: "Mauritius",      digits: [7,  8]  },
  { code: "+52",  iso: "MX", name: "Mexico",         digits: [10, 10] },
  { code: "+977", iso: "NP", name: "Nepal",          digits: [10, 10] },
  { code: "+31",  iso: "NL", name: "Netherlands",    digits: [9,  9]  },
  { code: "+64",  iso: "NZ", name: "New Zealand",    digits: [8,  10] },
  { code: "+47",  iso: "NO", name: "Norway",         digits: [8,  8]  },
  { code: "+92",  iso: "PK", name: "Pakistan",       digits: [10, 10] },
  { code: "+63",  iso: "PH", name: "Philippines",    digits: [10, 10] },
  { code: "+48",  iso: "PL", name: "Poland",         digits: [9,  9]  },
  { code: "+351", iso: "PT", name: "Portugal",       digits: [9,  9]  },
  { code: "+7",   iso: "RU", name: "Russia",         digits: [10, 10] },
  { code: "+966", iso: "SA", name: "Saudi Arabia",   digits: [9,  9]  },
  { code: "+65",  iso: "SG", name: "Singapore",      digits: [8,  8]  },
  { code: "+27",  iso: "ZA", name: "South Africa",   digits: [9,  9]  },
  { code: "+82",  iso: "KR", name: "South Korea",    digits: [9,  11] },
  { code: "+34",  iso: "ES", name: "Spain",          digits: [9,  9]  },
  { code: "+94",  iso: "LK", name: "Sri Lanka",      digits: [9,  9]  },
  { code: "+46",  iso: "SE", name: "Sweden",         digits: [9,  9]  },
  { code: "+41",  iso: "CH", name: "Switzerland",    digits: [9,  9]  },
  { code: "+66",  iso: "TH", name: "Thailand",       digits: [9,  9]  },
  { code: "+90",  iso: "TR", name: "Turkey",         digits: [10, 10] },
  { code: "+971", iso: "AE", name: "UAE",            digits: [9,  9]  },
  { code: "+44",  iso: "GB", name: "United Kingdom", digits: [10, 10] },
  { code: "+1",   iso: "US", name: "United States",  digits: [10, 10] },
  { code: "+84",  iso: "VN", name: "Vietnam",        digits: [9,  10] },
];

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
