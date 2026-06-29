import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import "./TripDetail.css";

// ── Figma-downloaded assets ──────────────────────────────────────────────────
const FIG = "/trip-detail/";
const HERO_LARGE = `${FIG}hero-large.png`;
const HERO_T1    = `${FIG}hero-thumb-1.png`;
const HERO_T2    = `${FIG}hero-thumb-2.png`;
const HERO_T3    = `${FIG}hero-thumb-3.png`;
const HERO_MAIN  = `${FIG}hero-main.png`;  // fallback / extra thumb
const ITIN_MAP   = `${FIG}itin-map.png`;
const CAPTAIN_PHOTO = `${FIG}captain-photo.jpeg`;
const MOMENTS_F1       = `${FIG}moments-f1.png`;
const MOMENTS_FESTIVAL = `${FIG}moments-festival.png`;
const MOMENTS_CONCERT  = `${FIG}moments-concert.png`;
const MORE_TRIP_1 = `${FIG}more-trip-1.jpeg`;
const MORE_TRIP_2 = `${FIG}more-trip-2.jpeg`;
const REVIEW_AVT1 = `${FIG}review-avatar-1.png`;
const REVIEW_AVT2 = `${FIG}review-avatar-2.png`;

// ── Bottom nav icons (Figma node 4219:5728) ──────────────────────────────────
const NAV_HOME     = `${FIG}nav-home.svg`;
const NAV_COMPARE  = `${FIG}nav-compare.svg`;
const NAV_WISHLIST = `${FIG}nav-wishlist.svg`;
const NAV_EVENTS   = `${FIG}nav-events.svg`;
const NAV_PHONE    = `${FIG}nav-phone.svg`;
const NAV_WHATSAPP = `${FIG}nav-whatsapp.svg`;
const NAV_ARROW    = `${FIG}nav-arrow-down.svg`;
const NAV_THUMB    = `${FIG}nav-trip-thumb.png`;

// ── Itinerary accordion icons (Figma node 3014:14673) ────────────────────────
const ITIN_ARROW    = `${FIG}itin-arrow-down.svg`;
const ITIN_BULLET   = `${FIG}itin-bullet.svg`;
const ICON_HOTEL    = `${FIG}icon-hotel.svg`;
const ICON_MEAL     = `${FIG}icon-meal.svg`;
const ICON_ACTIVITY = `${FIG}icon-activity.svg`;
const ICON_TRANSFER = `${FIG}icon-transfer.svg`;

// ── Inline SVG icons ─────────────────────────────────────────────────────────
const IcoBack = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M19 12H5M12 5l-7 7 7 7"/>
  </svg>
);
const IcoSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>
  </svg>
);
const IcoList = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
);
const IcoLocation = () => (
  <svg width="10" height="12" viewBox="0 0 10 13" fill="none">
    <path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 8 5 8s5-4.25 5-8c0-2.76-2.24-5-5-5zm0 6.5A1.5 1.5 0 1 1 5 3.5a1.5 1.5 0 0 1 0 3z" fill="#287686"/>
  </svg>
);
const IcoCar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#287686">
    <path d="M18.92 5.01A1 1 0 0 0 18 4.5H6a1 1 0 0 0-.93.63L3.16 9H1v2h.73l.62 1.72A2 2 0 0 0 2 13.5V17a1 1 0 0 0 1 1h1v1h2v-1h12v1h2v-1h1a1 1 0 0 0 1-1v-3.5a2 2 0 0 0-.35-1.14L20.27 11H21V9h-2.08L18.92 5.01zM6.85 6.5h10.3l1.13 2.5H5.72L6.85 6.5zM7 14.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm10 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
  </svg>
);
const IcoCalendar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#287686" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="4" width="18" height="16" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/>
  </svg>
);
const IcoHotel = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#287686">
    <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/>
  </svg>
);
const IcoFood = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#287686">
    <path d="M11 9H9V2H7v7H5V2H3v7a4 4 0 0 0 3.85 4L7 21a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1l-.15-8A4 4 0 0 0 11 9V2h-2zm5-3v6h2.5v10a1.5 1.5 0 0 0 3 0V2c-2.76 0-5 2.24-5 4z"/>
  </svg>
);
const IcoActivity = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#287686">
    <path d="M13.49 5.48a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3a7.3 7.3 0 0 0 5.1 1.9v-2c-1.6 0-3-.7-4-1.8l-1-1.4c-.4-.5-1-.8-1.7-.8-.3 0-.5 0-.7.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.5z"/>
  </svg>
);
const IcoBus = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#287686">
    <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h8v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1.78A3 3 0 0 0 20 16V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm9 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM6 6h12v4H6V6z"/>
  </svg>
);
const IcoStar = ({ filled }: { filled: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "#F5A623" : "#E0E0E0"}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);
const IcoHeart = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const IcoArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);
const IcoDownload = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M12 3v14M5 16l7 7 7-7"/><path d="M3 21h18"/>
  </svg>
);
const IcoWomen = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 10c-4.4 0-8 1.8-8 4v1h16v-1c0-2.2-3.6-4-8-4z"/>
  </svg>
);
const IcoCertified = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#287686" strokeWidth="2" strokeLinecap="round">
    <path d="M9 12l2 2 4-4"/><path d="M20.618 5.984A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622C17.176 19.29 21 14.591 21 9a12.02 12.02 0 0 0-.382-3.016z"/>
  </svg>
);
const IcoRoute = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#287686" strokeWidth="2" strokeLinecap="round">
    <path d="M3 3h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3"/><path d="M21 21h-3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>
    <path d="M9 8h4M9 16h4M13 8v8"/>
  </svg>
);
const IcoWomenCaptain = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#287686" strokeWidth="2" strokeLinecap="round">
    <path d="M12 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 10c-4.4 0-8 1.8-8 4v2h16v-2c0-2.2-3.6-4-8-4z"/>
  </svg>
);
const IcoGoogle = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);
const Footprint = ({ filled }: { filled: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#287686" : "#D1E8EC"}>
    <path d="M13.5 8.5c.83 0 1.5-.67 1.5-1.5S14.33 5.5 13.5 5.5 12 6.17 12 7s.67 1.5 1.5 1.5zm1 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9 8c0-.55-.45-1-1-1s-1 .45-1 1 .45 1 1 1 1-.45 1-1zm-1 4c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm5.5 5.5c1.38 0 2.5-1.12 2.5-2.5S14.88 12.5 13.5 12.5 11 13.62 11 15s1.12 2.5 2.5 2.5zm-5-2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
  </svg>
);

// ── Type definitions ──────────────────────────────────────────────────────────
interface DayItinerary {
  days: string;
  city: string;
  photo: string;
  summary?: string[];
  chips?: string[];
  items: string[];
  photos?: string[];
  transferTo?: string;
}
interface ProductData {
  title: string;
  heroImages: string[];
  displayPrice: string;
  batchLabel: string;
  womenPct: string;
  womenBadge: string;
  batchCount: string;
  totalBatches: string;
  groupSize: string;
  bestMonths: string;
  inclusions: string[];
  fitTags: { label: string; rating: number }[];
  effort: string;
  tripTypeLabel: string;
  itinerary: DayItinerary[];
  gallery: string[];
  pickUp: string;
  drop: string;
  duration: string;
  cityStrip: string[];
  mapImage: string;
  captain: { name: string; photo: string; reviews: number; years: number; rating: number };
}

// ── API types & transform ───────────────────────────────────────────────────
const API_BASE = "https://cms-backend-staging-b2yue.ondigitalocean.app/trip";

interface APIDay {
  id?: string;
  number: number;
  title: string;
  details: string[];
  accommodation?: string;
  timeConstraints?: string[];
}
interface TripImage { id?: string; link: string; }
interface TripAPIResponse {
  title: string;
  slug: string;
  duration: { days: number; nights: number; dateLength?: number; };
  startingPrice: number;
  pickupPoint: { title: string };
  dropPoint: { title: string };
  inclusions: string[];
  exclusions?: string[];
  itinerary: { data: APIDay[]; notes?: string[]; skeleton?: unknown };
  destinations?: { title: string; slug?: string; }[];
  tagline?: string;
  type?: string;
  images2?: {
    cover?: TripImage;
    card?: TripImage;
    gallery?: TripImage[];
  };
}

function fmtPrice(n: number): string {
  return n.toLocaleString("en-IN") + "/-";
}

function inferChips(details: string[]): string[] {
  const text = details.join(" ").toLowerCase();
  const chips: string[] = [];
  if (text.includes("hostel") || text.includes("hotel")) chips.push("1N Hotel");
  else if (text.includes("camp") || text.includes("tent") || text.includes("dreamville")) chips.push("1N Camping");
  if (text.includes("breakfast") || text.includes("lunch") || text.includes("dinner") || text.includes("meal")) chips.push("Meals");
  const actCount = details.filter(d => {
    const dl = d.toLowerCase();
    return !dl.includes("overnight") && !dl.includes("transfer") && !dl.includes("airport") && !dl.includes("hostel") && !dl.includes("hotel") && !dl.includes("camp") && !dl.includes("checkout") && !dl.includes("check-in") && !dl.includes("breakfast");
  }).length;
  if (actCount > 0) chips.push(`${Math.min(actCount, 5)} Activities`);
  if (text.includes("transfer") || text.includes("airport")) chips.push("1 Shared Transfer");
  return chips;
}

function deriveCityStripFromAccomm(days: APIDay[]): string[] {
  const groups: { city: string; count: number }[] = [];
  for (const day of days) {
    const city = day.accommodation ?? day.title.split("|")[0].trim();
    if (!city) continue;
    const last = groups[groups.length - 1];
    if (last && last.city.toLowerCase() === city.toLowerCase()) last.count++;
    else groups.push({ city, count: 1 });
  }
  return groups.slice(0, 5).map(g => `${g.count}N ${g.city}`);
}

function transformAPIResponse(api: TripAPIResponse): ProductData {
  const days = api.itinerary?.data ?? [];
  const cityStrip = deriveCityStripFromAccomm(days);
  const itinerary: DayItinerary[] = days.map(day => {
    const parts = day.title.split("|");
    const city = parts.length > 1 ? parts[1].trim() : (day.accommodation ?? parts[0].trim());
    return {
      days: `Day ${day.number}`,
      city,
      photo: HERO_LARGE,
      summary: [parts[0].trim()],
      chips: inferChips(day.details),
      items: day.details,
      photos: [HERO_T1, HERO_T2, HERO_T3],
    };
  });
  const dest = api.destinations?.[0]?.title ?? "";
  const fitTags = dest.toLowerCase().includes("europe")
    ? [{ label: "City and Culture", rating: 5 }, { label: "Nature and Adventure", rating: 3 }, { label: "Party & Night Life", rating: 4 }]
    : [{ label: "Nature and Adventure", rating: 5 }, { label: "City and Culture", rating: 3 }];
  const galleryLinks = api.images2?.gallery?.map(g => g.link).filter(Boolean) ?? [];
  const coverLink = api.images2?.cover?.link ?? HERO_LARGE;
  const heroImages = [
    coverLink,
    galleryLinks[0] ?? HERO_T1,
    galleryLinks[1] ?? HERO_T2,
    galleryLinks[2] ?? HERO_T3,
    galleryLinks[3] ?? HERO_MAIN,
  ];
  return {
    title: api.title,
    heroImages,
    displayPrice: fmtPrice(api.startingPrice),
    batchLabel: "",
    womenPct: "50%+",
    womenBadge: "50+ Women travellers have joined!",
    batchCount: "Upcoming Batches",
    totalBatches: "Multiple Batches",
    groupSize: "25",
    bestMonths: "Year Round",
    pickUp: api.pickupPoint?.title ?? "",
    drop: api.dropPoint?.title ?? "",
    duration: `${api.duration.nights}N · ${api.duration.days}D`,
    cityStrip: cityStrip.length ? cityStrip : [],
    mapImage: ITIN_MAP,
    inclusions: api.inclusions ?? [],
    fitTags,
    effort: "Moderate",
    tripTypeLabel: dest || api.type || "Group Tour",
    itinerary,
    gallery: [HERO_LARGE, HERO_T1, HERO_T2, HERO_T3, HERO_MAIN],
    captain: { name: "WanderOn Captain", photo: CAPTAIN_PHOTO, reviews: 48, years: 5, rating: 4.9 },
  };
}


// ── Small components ──────────────────────────────────────────────────────────
function IncChip({ label }: { label: string }) {
  const icon = label.includes("Accommodation") ? <IcoHotel />
    : label.includes("Meal") ? <IcoFood />
    : label.includes("Transfer") ? <IcoBus />
    : label.includes("Activit") ? <IcoActivity />
    : <IcoWomen />;
  return (
    <span className="tdp2-inc-chip">
      <span className="tdp2-inc-ico">{icon}</span>
      {label}
    </span>
  );
}

function FitTagRow({ label, rating }: { label: string; rating: number }) {
  const icon = label.includes("Party") ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#287686"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7 13.5c-.83 0-1.5-.67-1.5-1.5S6.17 10.5 7 10.5s1.5.67 1.5 1.5S7.83 13.5 7 13.5zM12 18c-1.86 0-3.41-1.28-3.86-3h7.72c-.45 1.72-2 3-3.86 3zm5-4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
  ) : label.includes("Nature") ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#287686"><path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-.9-1.7-.9-.3 0-.5 0-.7.1L6 8.3V13h2V9.6l1.8-.7"/></svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#287686"><path d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z"/></svg>
  );
  return (
    <div className="tdp2-fit-row">
      <span className="tdp2-fit-label">{icon}{label}</span>
      <span className="tdp2-fit-prints">
        {[1,2,3,4,5].map(i => <Footprint key={i} filled={i <= rating} />)}
      </span>
    </div>
  );
}

function DayCard({ day, isOpen, onToggle }: { day: DayItinerary; isOpen: boolean; onToggle: () => void }) {
  const chipIcon = (c: string) => {
    if (c.toLowerCase().includes("hotel") || c.toLowerCase().includes("hostel") || c.toLowerCase().includes("night") || c.toLowerCase().includes("camp")) return ICON_HOTEL;
    if (c.toLowerCase().includes("breakfast") || c.toLowerCase().includes("meal") || c.toLowerCase().includes("food") || c.toLowerCase().includes("lunch") || c.toLowerCase().includes("dinner")) return ICON_MEAL;
    if (c.toLowerCase().includes("activit") || c.toLowerCase().includes("tour") || c.toLowerCase().includes("pass") || c.toLowerCase().includes("entry") || c.toLowerCase().includes("festival")) return ICON_ACTIVITY;
    return ICON_TRANSFER;
  };
  return (
    <div className={`tdp2-day-card${isOpen ? " open" : ""}`}>
      {/* ── Header row (visible in both states) ── */}
      <button className="tdp2-day-hd" onClick={onToggle}>
        <div className="tdp2-day-hd-left">
          <img src={day.photo} alt={day.city} className="tdp2-day-thumb"/>
          <div className="tdp2-day-hd-info">
            <span className="tdp2-day-badge">{day.days}</span>
            <span className="tdp2-day-city">{day.city}</span>
          </div>
        </div>
        <img src={ITIN_ARROW} alt="" className={`tdp2-day-arrow${isOpen ? " open" : ""}`}/>
      </button>

      {/* ── Summary lines (visible in both states) ── */}
      {day.summary && day.summary.length > 0 && (
        <div className="tdp2-day-summary-block">
          {day.summary.map((s, i) => (
            <p key={i} className="tdp2-day-summary-line">{s}</p>
          ))}
        </div>
      )}

      {/* ── Service chips (visible in both states) ── */}
      {day.chips && day.chips.length > 0 && (
        <div className="tdp2-day-chips">
          {day.chips.map(c => (
            <span className="tdp2-day-chip" key={c}>
              <img src={chipIcon(c)} alt="" className="tdp2-chip-icon"/>
              {c}
            </span>
          ))}
        </div>
      )}

      {/* ── Expanded: timeline bullets + photo gallery ── */}
      {isOpen && (
        <div className="tdp2-day-body">
          {day.items.map((item, j) => (
            <div key={j} className="tdp2-timeline-row">
              <div className="tdp2-timeline-track">
                <img src={ITIN_BULLET} alt="" className="tdp2-timeline-bullet"/>
                {j < day.items.length - 1 && <div className="tdp2-timeline-connector"/>}
              </div>
              <p className="tdp2-timeline-text">{item}</p>
            </div>
          ))}
          {day.photos && day.photos.length > 0 && (
            <div className="tdp2-day-photos">
              {day.photos.map((src, i) => (
                <img key={i} src={src} alt="" className="tdp2-day-photo-img" loading="lazy"/>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ReviewCard({ name, date, text, avatar, stars }: { name: string; date: string; text: string; avatar?: string; stars: number }) {
  return (
    <div className="tdp2-review-card">
      <div className="tdp2-review-top">
        <div className="tdp2-review-avatar">
          {avatar ? <img src={avatar} alt={name}/> : <span>{name[0]}</span>}
        </div>
        <div>
          <p className="tdp2-review-name">{name}</p>
          <div className="tdp2-review-stars">
            {[1,2,3,4,5].map(i => <IcoStar key={i} filled={i <= stars}/>)}
            <span className="tdp2-review-date">{date}</span>
          </div>
        </div>
      </div>
      <p className="tdp2-review-text">{text}</p>
      <button className="tdp2-review-more">Read More</button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TripDetail() {
  const { slug = "" } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [openDays, setOpenDays] = useState<Set<number>>(new Set([0]));
  const [activeTab, setActiveTab] = useState(0);
  const [activeDay, setActiveDay] = useState(0);
  const [activeReviewFilter, setActiveReviewFilter] = useState(0);
  const reviewScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setData(null);
    setOpenDays(new Set([0]));
    setActiveTab(0);
    setActiveDay(0);
    fetch(`${API_BASE}/${slug}`)
      .then(r => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then(json => { setData(transformAPIResponse(json as TripAPIResponse)); })
      .catch(() => { setData(null); })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="tdp2-notfound">
      <div className="tdp2-loading-spinner"/>
      <p>Loading trip details…</p>
    </div>
  );

  if (!data) return (
    <div className="tdp2-notfound">
      <p>Trip not found.</p>
      <button onClick={() => navigate("/")}>Back to home</button>
    </div>
  );

  function toggleDay(i: number) {
    setOpenDays(prev => new Set(prev.has(i) ? [] : [i]));
  }

  const tabs = ["Itinerary", "Inclusions", "Exclusions", "Reviews", "Trip Captains"];
  const reviewFilters = ["All", "Solo Travellers (8)", "Women Travellers (12)", "Adventure", "Wellness"];
  const moreTrips = [
    { title: "15-Day Europe Group Trip 2026: Paris to Budape...", route: "3N Paris → 3N Amsterdam → 3N Prague → 2N Vienna → 3N Budapest", features: ["Disneyland Tour with Eiffel Tower Visit", "Cologne City Tour", "Lake Titisee"], price: "₹62999/-", batches: "09 May, 12 May, 18 May, 22 May, 6 Jun, 12 Jun, +10 More", image: MORE_TRIP_1, badge: "Recommended", options: "2 Options Available", womenJoined: "20+ have joined", batchDate: "09 May Batch", duration: "7N/8D" },
    { title: "12 Days Europe Group Tour: Paris to Vienna", route: "3N Paris → 3N Amsterdam → 3N Prague → 2N Vienna", features: ["Disneyland Tour with Eiffel Tower Visit", "Cologne City Tour", "Lake Titisee"], price: "₹62999/-", batches: "09 May, 12 May, 18 May, 22 May, 6 Jun, 12 Jun, +10 More", image: MORE_TRIP_2, badge: "", options: "", womenJoined: "15+ Women have joined", batchDate: "09 May Batch", duration: "7N/8D" },
    { title: "15-Day Europe Group Trip 2026: Paris to Budape...", route: "3N Paris → 3N Amsterdam → 3N Prague → 2N Vienna → 3N Budapest", features: ["Disneyland Tour with Eiffel Tower Visit", "Cologne City Tour", "Lake Titisee"], price: "₹62999/-", batches: "09 May, 12 May, 18 May, 22 May, 6 Jun, 12 Jun, +10 More", image: MORE_TRIP_1, badge: "Recommended", options: "2 Options available", womenJoined: "20+ have joined", batchDate: "09 May Batch", duration: "7N/8D" },
  ];

  return (
    <div className="tdp2-page">

      {/* ── Top Nav ──────────────────────────────────────────────────────── */}
      <div className="tdp2-nav">
        <button className="tdp2-nav-back" onClick={() => navigate(-1)}><IcoBack /></button>
        <div className="tdp2-nav-search">
          <span className="tdp2-nav-search-dest">
            <IcoLocation />
            <span>Vietnam</span>
          </span>
          <span className="tdp2-nav-search-divider"/>
          <span className="tdp2-nav-search-date">
            <IcoCalendar />
            <span>Aug 26</span>
          </span>
        </div>
        <button className="tdp2-nav-search-btn"><IcoSearch /></button>
        <button className="tdp2-nav-compare"><IcoList /></button>
      </div>

      {/* ── Hero Photo Grid ───────────────────────────────────────────────── */}
      <div className="tdp2-hero">
        <div className="tdp2-hero-grid">
          <div className="tdp2-hero-main-wrap">
            <img src={data.heroImages[0]} alt={data.title} className="tdp2-hero-main-img"/>
            <div className="tdp2-hero-women-badge">
              <span>{data.womenBadge}</span>
            </div>
          </div>
          <div className="tdp2-hero-thumbs">
            {[1,2,3].map(i => (
              <div className="tdp2-hero-thumb-wrap" key={i}>
                <img src={data.heroImages[i] ?? data.heroImages[0]} alt="" className="tdp2-hero-thumb-img" loading="lazy"/>
              </div>
            ))}
            <div className="tdp2-hero-thumb-wrap tdp2-hero-thumb-more">
              <img src={data.heroImages[4] ?? data.heroImages[0]} alt="" className="tdp2-hero-thumb-img" loading="lazy"/>
              <div className="tdp2-hero-view-all">
                <span>(10+)</span>
                <span>View All</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Trip Info Card ────────────────────────────────────────────────── */}
      <div className="tdp2-info-card">
        <h1 className="tdp2-title">{data.title}</h1>

        <div className="tdp2-meta-chips">
          <span className="tdp2-meta-chip">
            <IcoCalendar />{data.duration}
          </span>
          <span className="tdp2-meta-chip">{data.totalBatches}</span>
          <span className="tdp2-meta-chip">Group Size: {data.groupSize}</span>
        </div>

        <div className="tdp2-pickup-drop">
          <div className="tdp2-pickup">
            <div className="tdp2-pd-label"><IcoLocation /><span>Pick Up</span></div>
            <p className="tdp2-pd-name">{data.pickUp}</p>
          </div>
          <div className="tdp2-drop">
            <div className="tdp2-pd-label tdp2-pd-label--right"><IcoLocation /><span>Drop</span></div>
            <p className="tdp2-pd-name tdp2-pd-name--right">{data.drop}</p>
          </div>
        </div>

        <div className="tdp2-city-strip">
          {data.cityStrip.map((city, i) => (
            <span key={i} className="tdp2-city-strip-item">
              <span className="tdp2-city-strip-dot"/>
              <span className="tdp2-city-strip-name">{city}</span>
              {i < data.cityStrip.length - 1 && (
                <span className="tdp2-city-strip-arrow">
                  <svg width="12" height="8" viewBox="0 0 16 8" fill="none" stroke="#287686" strokeWidth="1.5">
                    <path d="M0 4h14M10 1l4 3-4 3"/>
                  </svg>
                </span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* ── Tab Bar ──────────────────────────────────────────────────────── */}
      <div className="tdp2-tabs-wrap">
        <div className="tdp2-tabs">
          {tabs.map((t, i) => (
            <button key={t} className={`tdp2-tab${activeTab === i ? " active" : ""}`} onClick={() => setActiveTab(i)}>
              {i === 0 && <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{marginRight:4}}>
                <path d="M3 5h2V3H3v2zm0 8h2v-2H3v2zm0 8h2v-2H3v2zm4-16v2h14V5H7zm0 10h14v-2H7v2zm0 8h14v-2H7v2z"/>
              </svg>}
              {t}
            </button>
          ))}
        </div>
        <div className="tdp2-day-strip">
          {data.itinerary.map((_day, i) => (
            <button key={i} className={`tdp2-day-chip-btn${activeDay === i ? " active" : ""}`} onClick={() => setActiveDay(i)}>
              {`Day-${i + 1}`}
            </button>
          ))}
        </div>
      </div>

      {/* ── Is this trip for me? ──────────────────────────────────────────── */}
      <div className="tdp2-separator"/>
      <section className="tdp2-fit-section">
        <h3 className="tdp2-section-title">Is this trip for me?</h3>
        <div className="tdp2-fit-rows">
          {data.fitTags.map(tag => <FitTagRow key={tag.label} label={tag.label} rating={tag.rating}/>)}
        </div>
      </section>

      {/* ── Inclusions strip ─────────────────────────────────────────────── */}
      <div className="tdp2-separator"/>
      <div className="tdp2-inclusions-strip">
        {data.inclusions.map(inc => <IncChip key={inc} label={inc}/>)}
      </div>

      {/* ── Itinerary ────────────────────────────────────────────────────── */}
      <div className="tdp2-separator"/>
      <section className="tdp2-itin-section">
        <img src={data.mapImage} alt="Route map" className="tdp2-itin-map"/>

        {/* Airport → Hotel transfer */}
        <div className="tdp2-transfer-bar">
          <div className="tdp2-transfer-vline"/>
          <div className="tdp2-transfer-chip">
            <IcoCar />
            <span>Shared transfer from Airport to hotel</span>
          </div>
          <div className="tdp2-transfer-dot"/>
        </div>

        <div className="tdp2-day-list">
          {data.itinerary.map((day, i) => (
            <div key={i}>
              <DayCard day={day} isOpen={openDays.has(i)} onToggle={() => toggleDay(i)}/>
              {day.transferTo && (
                <div className="tdp2-between-transfer">
                  <div className="tdp2-bt-vline"/>
                  <div className="tdp2-bt-chip">
                    <IcoCar />
                    <span>{day.transferTo}</span>
                  </div>
                  <div className="tdp2-bt-vline"/>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="tdp2-journey-end">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#287686" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/>
          </svg>
          <span>End of the Journey</span>
        </div>

        <button className="tdp2-download-btn">
          <IcoDownload />
          Download Itinerary
        </button>
      </section>

      {/* ── Meet Your Captain ─────────────────────────────────────────────── */}
      <div className="tdp2-separator"/>
      <section className="tdp2-captain-section">
        <p className="tdp2-captain-label">MEET YOUR CAPTAIN</p>

        <div className="tdp2-captain-card">
          <img src={data.captain.photo} alt={data.captain.name} className="tdp2-captain-photo"/>
          <p className="tdp2-captain-name">{data.captain.name}</p>
          <div className="tdp2-captain-divider"/>
          <div className="tdp2-captain-stats">
            <div className="tdp2-captain-stat">
              <span className="tdp2-captain-stat-val">{data.captain.reviews}</span>
              <span className="tdp2-captain-stat-lbl">Reviews</span>
            </div>
            <div className="tdp2-captain-stat-sep"/>
            <div className="tdp2-captain-stat">
              <span className="tdp2-captain-stat-val">{data.captain.years}</span>
              <span className="tdp2-captain-stat-lbl">years of travelling</span>
            </div>
            <div className="tdp2-captain-stat-sep"/>
            <div className="tdp2-captain-stat">
              <span className="tdp2-captain-stat-val">{data.captain.rating}</span>
              <span className="tdp2-captain-stat-lbl">Rating</span>
            </div>
          </div>
        </div>

        <div className="tdp2-captain-badges">
          {[
            { icon: <IcoCertified/>, title: "Certified", desc: "Every captain is Wanderon-certified and first-aid trained before they ever lead a batch." },
            { icon: <IcoRoute/>, title: "Knows the route by heart", desc: "Minimum 10 runs on a route before leading solo. They know the shortcuts and the scams." },
            { icon: <IcoWomenCaptain/>, title: "Women captains on request", desc: "Booking a Wander Women batch, or just prefer it? We'll assign a woman captain." },
          ].map(b => (
            <div className="tdp2-captain-badge" key={b.title}>
              <span className="tdp2-captain-badge-ico">{b.icon}</span>
              <div>
                <p className="tdp2-captain-badge-title">{b.title}</p>
                <p className="tdp2-captain-badge-desc">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Reviews ──────────────────────────────────────────────────────── */}
      <div className="tdp2-separator"/>
      <section className="tdp2-reviews-section">
        <div className="tdp2-rating-hero">
          <div className="tdp2-laurel-wrap">
            <svg width="48" height="60" viewBox="0 0 48 60" fill="none">
              <path d="M8 55C8 55 4 45 6 35C8 25 14 18 14 18C14 18 10 28 12 38C14 48 8 55 8 55Z" fill="#C8A84B"/>
              <path d="M4 48C4 48 6 38 10 32C14 26 20 22 20 22C20 22 14 32 12 40C10 48 4 48 4 48Z" fill="#E2C16A"/>
              <path d="M2 40C2 40 6 32 12 28C18 24 24 22 24 22C24 22 16 32 12 38C8 44 2 40 2 40Z" fill="#C8A84B"/>
            </svg>
            <div className="tdp2-rating-val">
              <span className="tdp2-rating-num">4.9</span>
            </div>
            <svg width="48" height="60" viewBox="0 0 48 60" fill="none" style={{transform:"scaleX(-1)"}}>
              <path d="M8 55C8 55 4 45 6 35C8 25 14 18 14 18C14 18 10 28 12 38C14 48 8 55 8 55Z" fill="#C8A84B"/>
              <path d="M4 48C4 48 6 38 10 32C14 26 20 22 20 22C20 22 14 32 12 40C10 48 4 48 4 48Z" fill="#E2C16A"/>
              <path d="M2 40C2 40 6 32 12 28C18 24 24 22 24 22C24 22 16 32 12 38C8 44 2 40 2 40Z" fill="#C8A84B"/>
            </svg>
          </div>
          <div className="tdp2-rating-meta">
            <div className="tdp2-rating-google">
              <IcoGoogle />
              <span>14921 Reviews</span>
            </div>
            <p className="tdp2-rating-sub">Over 300,000 Wanderers have traveled with us</p>
          </div>
        </div>

        <div className="tdp2-review-filters">
          {reviewFilters.map((f, i) => (
            <button key={f} className={`tdp2-review-filter${activeReviewFilter === i ? " active" : ""}`} onClick={() => setActiveReviewFilter(i)}>
              {f}
            </button>
          ))}
        </div>

        <div className="tdp2-review-cards" ref={reviewScrollRef}>
          <ReviewCard name="Shrutika Parab" date="May, 2026" stars={5} avatar={REVIEW_AVT1}
            text="Thank you Team Wanderon for the amazing Ladakh Experience. Thank you Team Wanderon for the amazing Ladakh Experience. Right from the point of making the..."/>
          <ReviewCard name="Priya Sharma" date="Apr, 2026" stars={5} avatar={REVIEW_AVT2}
            text="An absolutely wonderful trip! The organisation was impeccable and the captain Vidhi was fantastic. Every detail was taken care of..."/>
          <ReviewCard name="Ananya Mehta" date="Mar, 2026" stars={5}
            text="The Europe trip exceeded all my expectations. Beautiful cities, great food and an amazing group of people. Would definitely book again!"/>
        </div>

        <button className="tdp2-show-all-reviews">Show all 42 reviews</button>
      </section>

      {/* ── Create Moments ────────────────────────────────────────────────── */}
      <div className="tdp2-separator"/>
      <section className="tdp2-moments-section">
        <h2 className="tdp2-moments-title">Create<br/>moments you<br/>wish existed</h2>
        <div className="tdp2-moments-photos">
          <img src={MOMENTS_F1} alt="F1 race" className="tdp2-moments-img tdp2-moments-img--left" loading="lazy"/>
          <img src={MOMENTS_FESTIVAL} alt="Festival" className="tdp2-moments-img tdp2-moments-img--center" loading="lazy"/>
          <img src={MOMENTS_CONCERT} alt="Concert" className="tdp2-moments-img tdp2-moments-img--right" loading="lazy"/>
        </div>
      </section>

      {/* ── More Trips ───────────────────────────────────────────────────── */}
      <div className="tdp2-separator"/>
      <section className="tdp2-more-section">
        <p className="tdp2-more-label">MORE EUROPE TRIPS</p>
        <div className="tdp2-more-scroll">
          {moreTrips.map((t, i) => (
            <div className="tdp2-more-card" key={i}>
              {t.options && <span className="tdp2-more-options">{t.options}</span>}
              <div className="tdp2-more-img-wrap">
                <img src={t.image} alt={t.title} className="tdp2-more-img" loading="lazy"/>
                <button className="tdp2-more-compare"><IcoHeart /><span>Add to Compare</span></button>
                {t.badge && <span className="tdp2-more-badge">{t.badge}</span>}
                <div className="tdp2-more-batch-strip">
                  <IcoCalendar />
                  <span>{t.duration}</span>
                  <span className="tdp2-more-strip-dot">•</span>
                  <span>{t.womenJoined}</span>
                  <span className="tdp2-more-strip-dot">•</span>
                  <span>{t.batchDate}</span>
                </div>
              </div>
              <div className="tdp2-more-body">
                <p className="tdp2-more-title">{t.title}</p>
                <p className="tdp2-more-route">{t.route}</p>
                <div className="tdp2-more-features">
                  {t.features.map(f => <span key={f} className="tdp2-more-feature">• {f}</span>)}
                </div>
                <p className="tdp2-more-batches">Batches: {t.batches}</p>
                <div className="tdp2-more-footer">
                  <div>
                    <p className="tdp2-more-price">{t.price}</p>
                    <p className="tdp2-more-price-sub">Onwards per person</p>
                    <p className="tdp2-more-price-note">*This price is lower than the average price in June.</p>
                  </div>
                  <button className="tdp2-more-view-btn">View Trip <IcoArrowRight /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="tdp2-more-dots">
          {moreTrips.map((_, i) => <span key={i} className={`tdp2-more-dot${i === 0 ? " active" : ""}`}/>)}
        </div>
        <button className="tdp2-view-more-trips">View More Trips</button>
      </section>

      {/* ── Life's a Trip Banner ──────────────────────────────────────────── */}
      <div className="tdp2-separator"/>
      <section className="tdp2-lifes-section">
        <div className="tdp2-lifes-heart">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#E8D5C0">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>
        <h2 className="tdp2-lifes-title">Life's a Trip,<br/>Let's Make Yours Epic!</h2>
        <div className="tdp2-lifes-illustration">
          <svg viewBox="0 0 350 120" width="100%" fill="#E8D5C0" opacity="0.6">
            <ellipse cx="50" cy="95" rx="30" ry="25"/>
            <circle cx="50" cy="65" r="12"/>
            <ellipse cx="100" cy="95" rx="25" ry="22"/>
            <circle cx="100" cy="68" r="10"/>
            <ellipse cx="150" cy="95" rx="28" ry="24"/>
            <circle cx="150" cy="66" r="11"/>
            <ellipse cx="200" cy="95" rx="26" ry="23"/>
            <circle cx="200" cy="67" r="10"/>
            <ellipse cx="250" cy="95" rx="28" ry="24"/>
            <circle cx="250" cy="66" r="11"/>
            <ellipse cx="300" cy="95" rx="25" ry="22"/>
            <circle cx="300" cy="68" r="10"/>
            <path d="M120 55 Q140 35 160 50" stroke="#E8D5C0" strokeWidth="2" fill="none"/>
            <circle cx="130" cy="40" r="3" fill="#E8D5C0"/>
            <circle cx="180" cy="30" r="2" fill="#E8D5C0"/>
            <circle cx="220" cy="25" r="3" fill="#E8D5C0"/>
          </svg>
        </div>
      </section>

      <Footer/>
      <div style={{ height: 110 }}/>

      {/* ── Bottom Navigation (Figma node 4219:5728) ─────────────────────── */}
      <div className="tdp2-bnav">
        {/* Floating trip card pill */}
        <button className="tdp2-bnav-pill">
          <img src={NAV_THUMB} alt="" className="tdp2-bnav-pill-img" />
          <div className="tdp2-bnav-pill-info">
            <span className="tdp2-bnav-pill-title">{data.title}</span>
            <span className="tdp2-bnav-pill-price">Starting Price &#8377;{data.displayPrice}pp</span>
          </div>
          <div className="tdp2-bnav-pill-btn">
            <span>View Batches</span>
            <img src={NAV_ARROW} alt="" className="tdp2-bnav-pill-arrow" />
          </div>
        </button>

        {/* Nav bar */}
        <div className="tdp2-bnav-bar">
          {/* Left: Home | Compare | Wishlist | Events */}
          <div className="tdp2-bnav-left">
            <a href="/" className="tdp2-bnav-item">
              <img src={NAV_HOME} alt="Home" className="tdp2-bnav-icon" />
              <span>Home</span>
            </a>
            <button className="tdp2-bnav-item">
              <img src={NAV_COMPARE} alt="Compare" className="tdp2-bnav-icon" />
              <span>Compare</span>
            </button>
            <button className="tdp2-bnav-item">
              <img src={NAV_WISHLIST} alt="Wishlist" className="tdp2-bnav-icon" />
              <span>Wishlist</span>
            </button>
            <button className="tdp2-bnav-item">
              <img src={NAV_EVENTS} alt="Events" className="tdp2-bnav-icon" />
              <span>Events</span>
            </button>
          </div>
          {/* Right: Phone + WhatsApp */}
          <div className="tdp2-bnav-right">
            <button className="tdp2-bnav-phone">
              <img src={NAV_PHONE} alt="Call" className="tdp2-bnav-icon" />
            </button>
            <button className="tdp2-bnav-whatsapp">
              <img src={NAV_WHATSAPP} alt="WhatsApp" className="tdp2-bnav-icon" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
