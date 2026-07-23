import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useCompare } from "../context/CompareContext";
import "./TripDetail.css";
import SiteHeader2 from "../components/SiteHeader2";
import TribeStories from "../components/TribeStories/TribeStories";
import QueryBanner from "../components/QueryBanner";
import GallerySheet from "../components/GallerySheet/GallerySheet";
import ShareSheet from "../components/ShareSheet/ShareSheet";
import BatchesSheet from "../components/BatchesSheet/BatchesSheet";
import LoginSheet from "../components/LoginSheet/LoginSheet";
import { useAuth } from "../context/AuthContext";
import FooterMessage from "../components/FooterMessage/FooterMessage";
import Footer from "../components/Footer";
import { SAMPLE_UPCOMING_TRIPS } from "../api/sampleData";
import { TripCardItem, ViewMoreCard } from "../components/UpcomingTrips/TripCardItem";

// ── Figma-downloaded assets ──────────────────────────────────────────────────
const FIG = "/trip-detail/";
const HERO_LARGE = "/figma/trip-hero/hero-bg.png";
const HERO_T1    = `${FIG}hero-thumb-1.png`;
const HERO_T2    = `${FIG}hero-thumb-2.png`;
const HERO_T3    = `${FIG}hero-thumb-3.png`;
const HERO_MAIN  = `${FIG}hero-main.png`;  // fallback / extra thumb
const ITIN_MAP   = `${FIG}itin-map.png`;
const CAPTAIN_PHOTO = `${FIG}captain-photo.jpeg`;


// moments gallery carousel
const MG = "/figma/itin-section/";
const MOMENTS_SLOTS = [
  { img: `${MG}moments-g2.jpg`, w: 159, h: 205 },
  { img: `${MG}moments-g3.jpg`, w: 159, h: 132 },
  { img: `${MG}moments-g4.jpg`, w: 159, h: 205 },
  { img: `${MG}moments-g5.jpg`, w: 213, h: 166 },
  { img: `${MG}moments-g6.jpg`, w: 159, h: 205 },
  { img: `${MG}moments-g7.jpg`, w: 159, h: 142 },
  { img: `${MG}moments-g8.jpg`, w: 180, h: 179 },
  { img: `${MG}moments-g9.jpg`, w: 159, h: 205 },
  { img: `${MG}moments-g10.jpg`, w: 159, h: 134 },
] as const;

// gallery image sets
const HERO_GALLERY = [
  "/figma/trip-hero/hero-bg.png",
  "/figma/trip-hero/thumb-1.png",
  "/figma/trip-hero/thumb-2.png",
  "/figma/trip-hero/thumb-3.png",
  "/figma/trip-hero/thumb-4.png",
  "/figma/trip-hero/thumb-5.png",
];
const MOMENTS_IMGS = MOMENTS_SLOTS.map(s => s.img);

// more trips images (fallback thumbnails for the View More card)
const MORE_TRIP_A = `${MG}more-trip-a.jpg`;
const MORE_TRIP_B = `${MG}more-trip-b.jpg`;

// captain assets
const CAP_AV_A = `${MG}captain-av-a.jpg`;
const CAP_AV_B = `${MG}captain-av-b.jpg`;
const CAP_AV_C = `${MG}captain-av-c.jpg`;
const CAP_ICO_CERT  = `${MG}captain-icon-certified.svg`;
const CAP_ICO_ROUTE = `${MG}captain-icon-route.svg`;
const CAP_ICO_WOMEN = `${MG}captain-icon-women.svg`;





const TI = "/figma/trip-info/";
const FOOT_FILLED = [`${TI}foot-1.svg`,`${TI}foot-2.svg`,`${TI}foot-3.svg`,`${TI}foot-4.svg`,`${TI}foot-5.svg`];
const FOOT_EMPTY  = `${TI}foot-empty.svg`;
const FIT_ICONS: Record<string, string> = {
  "Party & Night Life":   `${TI}icon-party.svg`,
  "Nature and Adventure": `${TI}icon-nature.svg`,
  "City and Culture":     `${TI}icon-culture.svg`,
};

// ── Type definitions ──────────────────────────────────────────────────────────
interface DayActivity {
  title: string;
  ticketsIncluded?: boolean;
  photos?: string[];
  isLeisure?: boolean;
  leisureDesc?: string;
  leisureDescBold?: string;
  leisurePhotos?: string[];
}
interface DayItinerary {
  days: string;
  city: string;
  photo: string;
  summary?: string[];
  chips?: string[];
  items: string[];
  description?: string;
  stayName?: string;
  stayNights?: number;
  stayCheckIn?: string;
  stayCheckOut?: string;
  stayPhotos?: string[];
  stayNote?: string;
  stayMeals?: string[];
  activities?: DayActivity[];
  photos?: string[];
  transferFrom?: string;
  transferTo?: string;
  isStaticCard?: boolean;
}
interface ProductData {
  title: string;
  heroImages: string[];
  displayPrice: string;
  batchLabel: string;
  breadcrumbs: string[];
  batchCount: string;
  totalBatches: string;
  groupSize: string;
  bestMonths: string;
  inclusions: string[];
  exclusions: string[];
  effort: string;
  tripTypeLabel: string;
  itinerary: DayItinerary[];
  gallery: string[];
  pickUp: string;
  drop: string;
  duration: string;
  cityStrip: string[];
  womenBadge: string;
  fitTags: { label: string; rating: number }[];
  mapImage: string;
  captain: { name: string; photo: string; reviews: number; years: number; rating: number };
}

// ── Static page data (Figma) ─────────────────────────────────────────────────
const STATIC_DATA: ProductData = {
  title: "15 Days Europe Group Trip 2026: Paris, Amsterdam & Switzerland",
  heroImages: [HERO_LARGE, HERO_T1, HERO_T2, HERO_T3, HERO_MAIN],
  displayPrice: "62,999/-",
  batchLabel: "09 May Batch",
  breadcrumbs: ["Wellness", "Europe"],
  batchCount: "Upcoming Batches",
  totalBatches: "12 Batches",
  groupSize: "25",
  bestMonths: "May – September",
  pickUp: "Paris Charles de Gaulle Airport",
  drop: "Budapest Ferenc Liszt International Airport",
  duration: "7N · 8D",
  cityStrip: ["3N Paris", "1N Amsterdam", "3N Switzerland"],
  womenBadge: "60% Women travellers have joined!",
  fitTags: [
    { label: "Party & Night Life",   rating: 3 },
    { label: "Nature and Adventure", rating: 4 },
    { label: "City and Culture",     rating: 5 },
  ],
  mapImage: ITIN_MAP,
  inclusions: [
    "9 Nights accommodation in 3-star hotels",
    "Daily breakfast at hotel",
    "All intercity coach transfers",
    "Eiffel Tower (2nd floor) entry ticket",
    "Palace of Versailles entry ticket",
    "Seine River Cruise",
    "Amsterdam city canal cruise",
    "Jungfrau Top of Europe excursion",
    "Lucerne city tour with Chapel Bridge visit",
    "WanderOn Trip Captain throughout the journey",
    "Travel insurance",
  ],
  exclusions: [
    "Water sports or any activity not mentioned in the itinerary.",
    "Any food or beverage not included in the package (alcoholic drinks, mineral water, meals on the highway).",
    "Any cost arising due to natural calamities like landslides, roadblocks etc. (to be borne by the customer).",
    "Anything not mentioned in the inclusions.",
    "Cost arising due to change or delay in flight timings.",
    "International flights and airport taxes (unless specified).",
    "Visa fees and travel documentation charges.",
    "GST (5%) applicable extra.",
    "TCS (5%) applicable extra.",
    "Any expenses of personal nature.",
    "Any additional activities during the tours.",
    "Travel insurance not listed under inclusions.",
  ],
  effort: "Moderate",
  tripTypeLabel: "Europe Group Tour",
  gallery: [HERO_LARGE, HERO_T1, HERO_T2, HERO_T3, HERO_MAIN],
  captain: { name: "WanderOn Captain", photo: CAPTAIN_PHOTO, reviews: 48, years: 5, rating: 4.9 },
  itinerary: [
    {
      days: "Day 1",
      city: "Paris",
      photo: HERO_T1,
      summary: ["Arrival in Paris"],
      chips: ["1N Hotel", "Breakfast"],
      items: ["Day at Leisure"],
      description: "Welcome to Paris! Upon your arrival at the airport, get driven to the hotel. After you check in, relax for some time. Later, you can explore the city on your own. You may visit Le Manoir De Paris, a haunted house where you can engage yourself in various Parisian legends & terrifying stories. Alternatively, you can visit Place des Vosges, one of Paris' oldest and most beautiful squares, which often hosts cultural events, among others. Later, return to the hotel on your own for an overnight stay.",
      stayName: "Millennium Hotel Paris Charles De-Gaulle",
      stayNights: 3,
      stayCheckIn: "2:00 PM",
      stayCheckOut: "11:00 AM",
      stayPhotos: [
        "/figma/itin-section/d1-hotel-1.jpg",
        "/figma/itin-section/d1-hotel-2.jpg",
        "/figma/itin-section/d1-hotel-3.jpg",
        "/figma/itin-section/d1-hotel-4.jpg",
      ],
      stayNote: "Stays will be allocated based on availability or similar category.",
      stayMeals: ["Breakfast", "Dinner"],
      activities: [
        {
          title: "Enjoy your time at Leisure",
          isLeisure: true,
          leisureDesc: "If you're up for it, you can join an optional welcome dinner around the Canal de l'Ourcq / La Villette area, a more local, less touristy side of Paris, or go for a relaxed evening walk along the Seine to kick things off properly.",
          leisureDescBold: "relaxed evening walk along the Seine",
          leisurePhotos: ["/figma/itin-section/d1-leisure.jpg"],
        },
      ],
    },
    {
      days: "Day 2",
      city: "Paris",
      photo: HERO_T2,
      summary: ["Paris Sightseeing Tour"],
      chips: ["1N Hotel", "Breakfast", "5 Activities"],
      items: [
        "Visit to Eiffel Tower & Palace of Versailles",
        "Siene River Cruise",
        "Paris Night Tour",
      ],
      description: "Experience the magic of Paris on this unforgettable tour. Begin by exploring iconic landmarks like Place Vendôme, Opéra Garnier, Champs-Élysées, Arc de Triomphe, & Les Invalides. Next, ascend to the Eiffel Tower\'s 3rd level for stunning city views, then visit the opulent Palace of Versailles, a 17th-century French art & architecture. Later, enjoy a cruise on the Seine River past Notre Dame, the Louvre, and Musée d\'Orsay, and end with a Paris Night Tour, where illuminated monuments truly sparkle.",
      stayName: "Same Accommodation as of Day-1",
      stayMeals: ["Breakfast"],
      activities: [
        {
          title: "1- Paris City Sightseeing Tour - Paris City Tour On A Shared Basis",
          photos: ["/figma/itin-section/d2-a1-1.jpg", "/figma/itin-section/d2-a1-2.jpg", "/figma/itin-section/d2-a1-3.jpg"],
        },
        {
          title: "2- Eiffel Tower Guided Tour With Summit Access",
          ticketsIncluded: true,
          photos: ["/figma/itin-section/d2-a2-1.jpg", "/figma/itin-section/d2-a2-2.jpg", "/figma/itin-section/d2-a2-3.jpg"],
        },
        {
          title: "3- Palace of Versailles",
          ticketsIncluded: true,
          photos: ["/figma/itin-section/d2-a3-1.jpg", "/figma/itin-section/d2-a3-2.jpg", "/figma/itin-section/d2-a3-3.jpg"],
        },
        {
          title: "4- 1 Hour Seine River Cruise",
          ticketsIncluded: true,
          photos: ["/figma/itin-section/d2-a4-1.jpg", "/figma/itin-section/d2-a4-2.jpg", "/figma/itin-section/d2-a4-3.jpg"],
        },
        {
          title: "5- Paris Night Tour On A Shared Basis",
          photos: ["/figma/itin-section/d2-a5-1.jpg", "/figma/itin-section/d2-a5-2.jpg", "/figma/itin-section/d2-a5-3.jpg"],
        },
      ],
    },
    {
      days: "Day 3",
      city: "Paris",
      photo: HERO_T3,
      summary: ["Day Trip to Disneyland Paris"],
      chips: ["1N Hotel", "Breakfast", "1 Activities"],
      items: ["Disneyland Paris"],
      description: "Embark on a magical day trip to Disneyland Paris, where fairy tales come to life. Board your transfer, and once you reach, enjoy thrilling rides, dazzling parades, and live shows across Disneyland Park and Walt Disney Studios Park. Also, meet beloved Disney characters, explore themed lands like Adventureland and Fantasyland, and experience iconic attractions like Pirates of the Caribbean and Space Mountain—making it the perfect escape for all ages. After an amazing time, get driven to the hotel.",
      stayName: "Same Accommodation as of Day-1",
      stayMeals: ["Breakfast"],
      activities: [
        {
          title: "1- Disneyland Paris Visit",
          ticketsIncluded: true,
          photos: [
            "/figma/itin-section/d3-a1-1.jpg",
            "/figma/itin-section/d3-a1-2.jpg",
            "/figma/itin-section/d3-a1-3.jpg",
          ],
        },
      ],
      transferFrom: "Paris Hotel",
      transferTo: "Amsterdam Hotel",
    },
    {
      days: "Day 4",
      city: "Amsterdam",
      photo: HERO_MAIN,
      summary: ["Arrive in Amsterdam"],
      chips: ["1N Hotel", "Dinner", "2 Activities"],
      items: [
        "Brussels Sightseeing Tour",
        "Visit to Mini Europe",
      ],
      description: "Post check-out, get driven to Amsterdam with a stop in Brussels. Once there, enjoy a sightseeing tour to discover Grand Place, Europe's most ornate square, renowned for its stunning architecture, and see the stunning Manneken Pis statue. Then, explore Mini-Europe, a one-of-a-kind park featuring over 350 detailed miniature replicas of Europe's top landmarks. After the tour, continue your scenic journey to Amsterdam, and upon arrival, check in to your hotel for an overnight stay.",
      stayName: "Van Der Valk, Amsterdam",
      stayCheckIn: "2:00 PM",
      stayCheckOut: "11:00 AM",
      stayPhotos: [
        "/figma/itin-section/d4-hotel-1.jpg",
        "/figma/itin-section/d4-hotel-2.jpg",
        "/figma/itin-section/d4-hotel-3.jpg",
        "/figma/itin-section/d4-hotel-4.jpg",
      ],
      stayNote: "Stays will be allocated based on availability or similar category.",
      stayMeals: ["Breakfast", "Dinner"],
      activities: [
        {
          title: "1- Brussels City Tour On A Shared Basis",
          photos: [
            "/figma/itin-section/d4-a1-1.jpg",
            "/figma/itin-section/d4-a1-2.jpg",
            "/figma/itin-section/d4-a1-3.jpg",
          ],
        },
        {
          title: "2- Mini Europe Brussels Tour",
          ticketsIncluded: true,
          photos: [
            "/figma/itin-section/d4-a2-1.jpg",
            "/figma/itin-section/d4-a2-2.jpg",
            "/figma/itin-section/d4-a2-3.jpg",
          ],
        },
      ],
      transferFrom: "Paris Hotel",
      transferTo: "Amsterdam Hotel",
    },
    {
      days: "Day 5",
      city: "Frankfurt",
      photo: HERO_T1,
      summary: ["Arrive in Frankfurt"],
      chips: ["1N Hotel", "Breakfast", "2 Activities"],
      items: [
        "Keukenhof Gardens",
        "Amsterdam Canal Cruise",
      ],
      description: "After check-out, get driven to visit the famous Keukenhof Gardens, a world-famous floral paradise with vibrant tulips, daffodils, and stunning themed pavilions. Once there, stroll through expansive landscapes and capture picture-perfect blooms. Later, get driven to Amsterdam for a scenic canal cruise, gliding past historic houses and charming bridges—a quintessential Dutch experience. Later, continue your scenic journey to Frankfurt, & upon arrival, check in at your hotel for an overnight stay.",
      stayName: "The Rilano Hotel Munchen",
      stayCheckIn: "2:00 PM",
      stayCheckOut: "11:00 AM",
      stayPhotos: ["/figma/itin-section/d5-hotel-1.jpg", "/figma/itin-section/d5-hotel-2.jpg", "/figma/itin-section/d5-hotel-3.jpg", "/figma/itin-section/d5-hotel-4.jpg"],
      stayNote: "Stays will be allocated based on availability or similar category.",
      stayMeals: ["Breakfast", "Dinner"],
      activities: [
        { title: "1- Keukenhof Tour, Amsterdam On A Shared Basis", ticketsIncluded: true, photos: ["/figma/itin-section/d5-a1-1.jpg", "/figma/itin-section/d5-a1-2.jpg", "/figma/itin-section/d5-a1-3.jpg"] },
        { title: "2- Amsterdam Canal Cruise On A Shared Basis", ticketsIncluded: true, photos: ["/figma/itin-section/d5-a2-1.jpg", "/figma/itin-section/d5-a2-2.jpg", "/figma/itin-section/d5-a2-3.jpg"] },
      ],
      transferFrom: "Paris Hotel",
      transferTo: "Amsterdam Hotel",
    },
    {
      days: "Day 6",
      city: "Switzerland",
      photo: HERO_T2,
      summary: ["Arrive in Switzerland"],
      chips: ["1N Hotel", "Breakfast", "2 Activities"],
      items: [
        "Rhine Falls Boat Tour",
      ],
      description: "After check-out, get driven to Central Switzerland with a stop in Heidelberg. Once in Heidelberg, explore its charming Old Town on a walking tour, visiting Market Square and the medieval Church of the Holy Spirit. Continue through the lush Black Forest to Schaffhausen for a thrilling boat tour of Rhine Falls, Europe's largest waterfall, and feel its powerful cascade up close. Later, continue your scenic journey to Switzerland and upon arrival, check in at your hotel for an overnight stay.",
      stayName: "La Maison Suisse Dattingen",
      stayCheckIn: "2:00 PM",
      stayCheckOut: "11:00 AM",
      stayPhotos: ["/figma/itin-section/d6-hotel-1.jpg", "/figma/itin-section/d6-hotel-2.jpg", "/figma/itin-section/d6-hotel-3.jpg", "/figma/itin-section/d6-hotel-4.jpg"],
      stayNote: "Stays will be allocated based on availability or similar category.",
      stayMeals: ["Breakfast", "Dinner"],
      activities: [
        { title: "1- Walking Tour In Heidelberg", photos: ["/figma/itin-section/d6-a1-1.jpg", "/figma/itin-section/d6-a1-2.jpg", "/figma/itin-section/d6-a1-3.jpg"] },
        { title: "2- Rhine Falls Boat Tour, Switzerland On A Shared Basis", ticketsIncluded: true, photos: ["/figma/itin-section/d6-a2-1.jpg", "/figma/itin-section/d6-a2-2.jpg", "/figma/itin-section/d6-a2-3.jpg"] },
      ],
    },
    {
      days: "Day 7",
      city: "Switzerland",
      photo: HERO_T3,
      summary: ["Excursion to Jungfraujoch"],
      chips: ["1N Hotel", "Breakfast", "1 Activities"],
      items: [
        "Day Trip to Jungfraujoch",
      ],
      description: "Get transferred to Grindelwald Terminal and board the Eiger Express, a state-of-the-art cableway offering stunning mountain views. Continue on a cogwheel train to Jungfraujoch, the highest railway station in Europe. At the top, explore the Ice Palace with its intricate ice sculptures and visit the Sphinx Observatory for breathtaking views of the Aletsch Glacier. After this unforgettable experience, get driven to your hotel in Switzerland for a comfortable overnight stay.",
      stayName: "Same Accommodation as of Day-1",
      stayMeals: ["Breakfast"],
      activities: [
        { title: "1- Day Trip To Jungfraujoch On A Shared Basis", ticketsIncluded: true, photos: ["/figma/itin-section/d7-a1-1.jpg", "/figma/itin-section/d7-a1-2.jpg", "/figma/itin-section/d7-a1-3.jpg"] },
      ],
    },
    {
      days: "Day 8",
      city: "Departure",
      photo: HERO_MAIN,
      summary: ["Departure Day"],
      chips: ["Breakfast"],
      items: [],
      description: "In the morning, check out from your hotel and get transferred to Zurich airport for your flight back home. This marks the end of your trip.",
      stayName: "Check Out from your hotel",
      isStaticCard: true,
      transferFrom: "Paris Hotel",
      transferTo: "Amsterdam Hotel",
    },
  ],
};


// ── Small components ──────────────────────────────────────────────────────────

function SharedTransfer({ from: fromCity, to: toCity }: { from: string; to: string }) {
  return (
    <div className="tdp2-st">
      <div className="tdp2-st-inner">
        <p className="tdp2-st-title">Shared Transfer</p>
        <div className="tdp2-st-row">
          {/* From pill */}
          <div className="tdp2-st-pill">
            <img src="/figma/itin-section/st-apartment.svg" alt="" className="tdp2-st-pill-icon" aria-hidden loading="lazy" />
            <div className="tdp2-st-pill-divider" />
            <div className="tdp2-st-pill-info">
              <span className="tdp2-st-pill-label">From</span>
              <span className="tdp2-st-pill-city">{fromCity}</span>
            </div>
          </div>
          {/* Car icon between pills */}
          <div className="tdp2-st-car">
            <img src="/figma/itin-section/st-car.svg" alt="" className="tdp2-st-car-icon" aria-hidden loading="lazy" />
          </div>
          {/* To pill */}
          <div className="tdp2-st-pill">
            <img src="/figma/itin-section/st-apartment.svg" alt="" className="tdp2-st-pill-icon" aria-hidden loading="lazy" />
            <div className="tdp2-st-pill-divider" />
            <div className="tdp2-st-pill-info">
              <span className="tdp2-st-pill-label">To</span>
              <span className="tdp2-st-pill-city">{toCity}</span>
            </div>
          </div>
        </div>
      </div>
      <img src="/figma/itin-section/st-dots.svg" alt="" className="tdp2-st-dots" aria-hidden loading="lazy" />
    </div>
  );
}

function parseCityStrip(entry: string): { nights: string; city: string } {
  const m = entry.match(/^(\d+)N\s+(.+)$/i);
  if (m) return { nights: `${m[1]} Night${Number(m[1]) > 1 ? "s" : ""}`, city: m[2] };
  return { nights: "", city: entry };
}

function CityCard({ entry, photo }: { entry: string; photo: string }) {
  const { nights, city } = parseCityStrip(entry);
  return (
    <div className="tdp2-city-card">
      <img src={photo} alt={city} className="tdp2-city-card-photo" loading="lazy" />
      <div className="tdp2-city-card-gradient" aria-hidden />
      <div className="tdp2-city-card-text">
        {nights && <span className="tdp2-city-card-nights">{nights}</span>}
        <span className="tdp2-city-card-name">{city}</span>
      </div>
    </div>
  );
}


function FaqItem({ index, question, answer, isOpen, onToggle }: {
  index: number; question: string; answer: string; isOpen: boolean; onToggle: () => void;
}) {
  return (
    <div className={`tdp2-faq-item${isOpen ? " open" : ""}`}>
      <button className={`tdp2-faq-row${isOpen ? " open" : ""}`} onClick={onToggle}>
        <span className="tdp2-faq-num">{String(index).padStart(2, "0")}</span>
        <div className="tdp2-faq-content">
          <span className="tdp2-faq-q">{question}</span>
          {isOpen && answer && <p className="tdp2-faq-a">{answer}</p>}
        </div>
        <span className="tdp2-faq-icon" aria-hidden="true">
          {isOpen
            ? <svg width="14" height="2" viewBox="0 0 14 2" fill="none"><line x1="0" y1="1" x2="14" y2="1" stroke="#202020" strokeWidth="2"/></svg>
            : <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 0v12M0 6h12" stroke="#202020" strokeWidth="1.5" strokeLinecap="round"/></svg>
          }
        </span>
      </button>
    </div>
  );
}


function TiFitRow({ label, rating }: { label: string; rating: number }) {
  const icon = FIT_ICONS[label] ?? `${TI}icon-culture.svg`;
  return (
    <div className="tdp2-ti-fit-row">
      <div className="tdp2-ti-fit-label">
        <img src={icon} alt="" className="tdp2-ti-fit-icon" aria-hidden loading="lazy" />
        <span className="tdp2-ti-fit-text">{label}</span>
      </div>
      <div className="tdp2-ti-fit-prints">
        {[0,1,2,3,4].map(i => (
          <div key={i} className="tdp2-ti-fit-wrap">
            <div className="tdp2-ti-fit-inner">
              <img src={i < rating ? FOOT_FILLED[i] : FOOT_EMPTY} alt="" className="tdp2-ti-fit-foot" aria-hidden loading="lazy" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function chipIcon(label: string): string {
  const l = label.toLowerCase();
  if (l.includes("hotel") || l.includes("camp") || l.includes("hostel")) return "/figma/itin-section/day-icon-hotel.svg";
  if (l.includes("meal") || l.includes("breakfast") || l.includes("dinner") || l.includes("lunch")) return "/figma/itin-section/day-icon-meal.svg";
  if (l.includes("activit") || l.includes("tour")) return "/figma/itin-section/day-icon-hiking.svg";
  return "/figma/itin-section/icon-transfer.svg";
}

function DayCard({ day, index, isOpen, onToggle }: {
  day: DayItinerary;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const title = day.summary?.[0] ?? day.city;
  const chips = day.chips ?? [];
  const hasStay = Boolean(day.stayName);
  const hasActivities = Boolean(day.activities?.length);

  const isStatic = Boolean(day.isStaticCard);

  return (
    <div id={`day-${index}`} className={`tdp2-day-card${(isStatic || isOpen) ? " open" : ""}`} style={{ scrollMarginTop: "186px" }}>
      {/* Header */}
      {isStatic ? (
        <div className="tdp2-day-card-header tdp2-day-card-header--static">
          <div className="tdp2-day-card-header-left">
            <span className="tdp2-day-badge">{`Day ${index + 1}`}</span>
            <span className="tdp2-day-card-title">{title}</span>
          </div>
        </div>
      ) : (
        <button className="tdp2-day-card-header" onClick={onToggle}>
          <div className="tdp2-day-card-header-left">
            <span className="tdp2-day-badge">{`Day ${index + 1}`}</span>
            <span className="tdp2-day-card-title">{title}</span>
          </div>
          <img
            src="/figma/itin-section/day-chevron-dropdown.svg"
            alt=""
            className={`tdp2-day-card-chevron${isOpen ? " open" : ""}`}
            aria-hidden
          loading="lazy" />
        </button>
      )}

      {/* Collapsed: subtitle lines + chips */}
      <div className="tdp2-day-card-summary">
        {day.items.length > 0 && (
          <div className="tdp2-day-card-subtitle-block">
            {day.items.map((item, ii) => (
              <p key={ii} className="tdp2-day-card-subtitle">{item}</p>
            ))}
          </div>
        )}
        {chips.length > 0 && (
          <div className="tdp2-day-card-chips">
            {chips.map((chip, ci) => (
              <div key={ci} className="tdp2-day-chip">
                <img src={chipIcon(chip)} alt="" className="tdp2-day-chip-icon" aria-hidden loading="lazy" />
                <span className="tdp2-day-chip-label">{chip}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expanded detail */}
      {(isStatic || isOpen) && (
        <div className="tdp2-day-card-expanded">
          {/* Full description */}
          {day.description && (
            <p className="tdp2-day-exp-desc">{day.description}</p>
          )}

          {/* Stay timeline section */}
          {hasStay && (
            <div className="tdp2-day-tl-item">
              <div className="tdp2-day-tl-left">
                <img src="/figma/itin-section/day-timeline-pin.svg" alt="" className="tdp2-day-tl-pin" aria-hidden loading="lazy" />
                {hasActivities && <div className="tdp2-day-tl-line" />}
              </div>
              <div className="tdp2-day-tl-content">
                <div className="tdp2-day-tl-section-hd">
                  <img src="/figma/itin-section/day-apt.svg" alt="" className="tdp2-day-tl-sec-icon" aria-hidden loading="lazy" />
                  <span className="tdp2-day-tl-sec-label">Stay</span>
                  {day.stayNights && (
                    <>
                      <div className="tdp2-day-tl-sec-divider" />
                      <span className="tdp2-day-tl-sec-label">{day.stayNights} Night{day.stayNights > 1 ? "s" : ""}</span>
                    </>
                  )}
                </div>
                <p className="tdp2-day-stay-name">{day.stayName}</p>
                {day.stayCheckIn && day.stayCheckOut && (
                  <div className="tdp2-day-stay-checkinout">
                    <div className="tdp2-day-stay-ci-col">
                      <span className="tdp2-day-stay-ci-label">Check In</span>
                      <span className="tdp2-day-stay-ci-time">{day.stayCheckIn}</span>
                    </div>
                    <img src="/figma/itin-section/day-exchange.svg" alt="" className="tdp2-day-stay-exchange" aria-hidden loading="lazy" />
                    <div className="tdp2-day-stay-co-col">
                      <span className="tdp2-day-stay-co-label">Check Out</span>
                      <span className="tdp2-day-stay-co-time">{day.stayCheckOut}</span>
                    </div>
                  </div>
                )}
                {day.stayNote && (
                  <div className="tdp2-day-stay-note">
                    <img src="/figma/itin-section/day-info.svg" alt="" className="tdp2-day-stay-note-icon" aria-hidden loading="lazy" />
                    <span className="tdp2-day-stay-note-text">{day.stayNote}</span>
                  </div>
                )}
                {day.stayPhotos && day.stayPhotos.length > 0 && (
                  <div className="tdp2-day-stay-photos">
                    <img src={day.stayPhotos[0]} alt="" className="tdp2-day-stay-photos-main" loading="lazy" />
                    {day.stayPhotos.length > 1 && (
                      <div className="tdp2-day-stay-photos-row">
                        {day.stayPhotos.slice(1).map((ph, pi) => (
                          <img key={pi} src={ph} alt="" className="tdp2-day-stay-photos-thumb" loading="lazy" />
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {day.stayMeals && day.stayMeals.length > 0 && (
                  <div className="tdp2-day-meals-bar">
                    <span className="tdp2-day-meals-incl">Included:</span>
                    <div className="tdp2-day-meals-list">
                      {day.stayMeals.map((meal, mi) => (
                        <React.Fragment key={mi}>
                          {mi > 0 && <div className="tdp2-day-meal-sep" />}
                          <div className="tdp2-day-meal-item">
                            <img src="/figma/itin-section/day-icon-meal.svg" alt="" className="tdp2-day-meal-icon" aria-hidden loading="lazy" />
                            <span className="tdp2-day-meal-label">{meal}</span>
                            <img src="/figma/itin-section/day-done.svg" alt="" className="tdp2-day-meal-done" aria-hidden loading="lazy" />
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Activity timeline section */}
          {hasActivities && (
            <div className="tdp2-day-tl-item">
              <div className="tdp2-day-tl-left">
                <img src="/figma/itin-section/day-timeline-pin.svg" alt="" className="tdp2-day-tl-pin" aria-hidden loading="lazy" />
              </div>
              <div className="tdp2-day-tl-content">
                <div className="tdp2-day-tl-section-hd">
                  <img src="/figma/itin-section/day-icon-nature.svg" alt="" className="tdp2-day-tl-sec-icon" aria-hidden loading="lazy" />
                  <span className="tdp2-day-tl-sec-label">Activity</span>
                </div>
                {day.activities!.map((act, ai) => (
                  <div key={ai} className="tdp2-day-activity-item">
                    {ai > 0 && <div className="tdp2-day-act-divider" />}
                    {act.isLeisure ? (
                      <div className="tdp2-day-leisure-card">
                        <img src="/figma/itin-section/day-leisure.svg" alt="" className="tdp2-day-leisure-icon" aria-hidden loading="lazy" />
                        <span className="tdp2-day-leisure-label">{act.title}</span>
                      </div>
                    ) : (
                      <p className="tdp2-day-act-title">{act.title}</p>
                    )}
                    {act.ticketsIncluded && (
                      <div className="tdp2-day-ticket-badge">
                        <span>Tickets Included</span>
                        <img src="/figma/itin-section/day-done-white.svg" alt="" className="tdp2-day-ticket-done" aria-hidden loading="lazy" />
                      </div>
                    )}
                    {act.leisureDesc && (
                      <p className="tdp2-day-leisure-desc">
                        {act.leisureDescBold ? (
                          <>
                            {act.leisureDesc.split(act.leisureDescBold)[0]}
                            <strong>{act.leisureDescBold}</strong>
                            {act.leisureDesc.split(act.leisureDescBold)[1]}
                          </>
                        ) : act.leisureDesc}
                      </p>
                    )}
                    {act.photos && act.photos.length > 0 && (
                      <div className="tdp2-day-act-photos">
                        {act.photos.map((ph, pi) => (
                          <img key={pi} src={ph} alt="" className="tdp2-day-act-photo" loading="lazy" />
                        ))}
                      </div>
                    )}
                    {act.leisurePhotos && act.leisurePhotos.length > 0 && (
                      <div className="tdp2-day-leisure-photos">
                        {act.leisurePhotos.map((ph, pi) => (
                          <img key={pi} src={ph} alt="" className="tdp2-day-leisure-photo" loading="lazy" />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fallback simple timeline for days without rich data */}
          {!hasStay && !hasActivities && day.items.length > 0 && (
            <div className="tdp2-day-timeline">
              {day.items.map((item, ti) => (
                <div key={ti} className="tdp2-day-tl-item">
                  <div className="tdp2-day-tl-left">
                    <img src="/figma/itin-section/day-timeline-pin.svg" alt="" className="tdp2-day-tl-pin" aria-hidden loading="lazy" />
                    {ti < day.items.length - 1 && <div className="tdp2-day-tl-line" />}
                  </div>
                  <p className="tdp2-day-tl-text">{item}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Embedded transfer to next city — shown for last day of each city group */}
      {day.transferFrom && day.transferTo && (
        <div className="tdp2-day-transfer-wrap">
          <SharedTransfer from={day.transferFrom} to={day.transferTo} />
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TripDetail() {
  const data = STATIC_DATA;
  const navigate = useNavigate();
  const location = useLocation();
  const { slug: routeSlug } = useParams();
  const stickyTitle = data.breadcrumbs?.[1] ? `${data.breadcrumbs[1]} Trip` : data.tripTypeLabel;
  const navState = location.state as
    | { from?: string; selectedBatch?: { dateRange: string; price: string } }
    | null;
  const [selectedBatch, setSelectedBatch] = useState<{ dateRange: string; price: string } | null>(
    navState?.from === "batches" ? navState.selectedBatch ?? null : null
  );
  const { isLoggedIn } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);

  const buildBookingState = () => ({
    tripTitle: stickyTitle,
    tripName: stickyTitle,
    dateRange: selectedBatch?.dateRange ?? "",
    durationLabel: "7N/8D",
    perPerson: (selectedBatch?.price ?? "").replace("/-", ""),
    travelers: 2,
  });
  const handleContinueBook = () => {
    if (isLoggedIn) {
      navigate("/booking", { state: buildBookingState() });
    } else {
      setLoginOpen(true);
    }
  };
  const handleLoginSuccess = () => {
    setLoginOpen(false);
    navigate("/booking", { state: buildBookingState() });
  };
  const compareSlug = routeSlug ?? "current-trip";
  const { isInCompare, toggle: toggleCompareTrip } = useCompare();
  const inCompare = isInCompare(compareSlug);
  const toggleCompare = () =>
    toggleCompareTrip({
      slug: compareSlug,
      title: data.title,
      image: data.heroImages[0],
      price: String(data.displayPrice ?? ""),
    });

  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [activeDay, setActiveDay] = useState(0);
  const [openFaqs, setOpenFaqs] = useState<Set<number>>(new Set([0]));
  const [openDays, setOpenDays] = useState<Set<number>>(new Set());
  const [inclOpen, setInclOpen] = useState(false);
  const [exclOpen, setExclOpen] = useState(false);

  // Gallery sheet
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Batches sheet
  const [batchesOpen, setBatchesOpen] = useState(false);

  // Share sheet
  const [shareOpen, setShareOpen] = useState(false);

  // WhatsApp FAB — appears once the user scrolls past the first fold (hero).
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowWhatsApp(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openGallery = (imgs: string[], idx = 0) => {
    setGalleryImages(imgs);
    setGalleryIndex(idx);
    setGalleryOpen(true);
  };



  const tabs = ["Itinerary", "Inclusions", "Exclusions", "Reviews", "Trip Captains"];
  const TAB_SECTIONS = ["section-itin", "section-incl", "section-excl", "section-reviews", "section-captains"];

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function scrollToDay(i: number) {
    setActiveDay(i);
    document.getElementById(`day-${i}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }


  // Related trips filtered by this product's destination (last breadcrumb).
  const productDest = data.breadcrumbs[data.breadcrumbs.length - 1] ?? "";
  const relatedTrips = (() => {
    const d = productDest.trim().toLowerCase();
    const pool = SAMPLE_UPCOMING_TRIPS.flatMap((g) => g.tripsArray).filter((t) => t.slug !== routeSlug);
    const matched = pool.filter((t) =>
      t.slug.toLowerCase().includes(d) ||
      t.title.toLowerCase().includes(d) ||
      (t.skeletonItinerary ?? []).some((c) => c.toLowerCase().includes(d)) ||
      (t.destinations ?? []).some((x) =>
        x.title.toLowerCase().includes(d) || x.slug.toLowerCase().includes(d)
      )
    );
    return (matched.length ? matched : pool).slice(0, 6);
  })();
  const moreVmA = relatedTrips[0]?.image ?? MORE_TRIP_A;
  const moreVmB = relatedTrips[1]?.image ?? MORE_TRIP_B;
  const moreHref = `/search?destination=${encodeURIComponent(productDest)}`;

  const faqs = [
    {
      q: "How early should I book Europe trip packages from India?",
      a: "Three to six months ahead is the right window. It gets you better flight prices, more hotel options, and enough time to sort the Schengen visa without any last-minute panic, especially if you're travelling in summer.",
    },
    {
      q: "Are flights included in Europe trip packages from India?",
      a: "Most WanderOn Europe packages do not include international flights, which keeps the base price transparent and lets you book from your preferred city. Our travel experts can help you find the best flight options to match your batch dates if needed.",
    },
    {
      q: "Do Europe tour packages include Schengen visa assistance?",
      a: "Yes, we provide complete Schengen visa assistance — from preparing your documentation checklist to advising on the right consulate to apply through. Visa approval is subject to the consulate's decision, but we make sure your application is as strong as possible.",
    },
    {
      q: "What visa and travel documents are required for Europe tours from India?",
      a: "You will need a valid Schengen visa, a passport with at least six months of validity beyond your return date, travel insurance with a minimum €30,000 medical coverage, confirmed hotel bookings, flight itineraries, and proof of sufficient funds. Our team will share a complete checklist once your booking is confirmed.",
    },
  ];

  return (
    <div className="tdp2-page">
      <SiteHeader2 destination={data.breadcrumbs[data.breadcrumbs.length - 1]} showBack onBack={() => navigate(-1)} />
      {/* ── Hero (Figma 4518:31778) ─────────────────────────────────────── */}
      <div className="tdp2-hero">
        {/* Background image + gradient */}
        <img
          src={data.heroImages[0] || "/figma/trip-hero/hero-bg.png"}
          alt={data.title}
          className="tdp2-hero-img"
          onClick={() => openGallery(HERO_GALLERY, 0)}
          style={{ cursor: "pointer" }}
        />
        <div className="tdp2-hero-gradient" aria-hidden />

        {/* Thumbnail strip — top right (Figma 4544:31836) */}
        <div className="tdp2-hero-thumb-strip">
          {[
            "/figma/trip-hero/thumb-1.png",
            "/figma/trip-hero/thumb-2.png",
            "/figma/trip-hero/thumb-3.png",
            "/figma/trip-hero/thumb-4.png",
          ].map((src, i) => (
            <div key={i} className="tdp2-hero-thumb" onClick={() => openGallery(HERO_GALLERY, i + 1)} style={{ cursor: "pointer" }}>
              <img src={src} alt="" className="tdp2-hero-thumb-img" loading="lazy" />
            </div>
          ))}
          <div className="tdp2-hero-thumb tdp2-hero-thumb--more" onClick={() => openGallery(HERO_GALLERY, 4)} style={{ cursor: "pointer" }}>
            <img src="/figma/trip-hero/thumb-5.png" alt="" className="tdp2-hero-thumb-img" loading="lazy" />
            <div className="tdp2-hero-thumb-overlay" aria-hidden />
            <span className="tdp2-hero-thumb-count">(10+)</span>
          </div>
        </div>

        {/* Bottom action bar (Figma 4518:31828) */}
        <div className="tdp2-hero-bar">
          <button
            className={`tdp2-hero-btn-wish${wishlisted ? " tdp2-hero-btn-wish--saved" : ""}`}
            type="button"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wishlisted}
            onClick={() => setWishlisted((w) => !w)}
          >
            {wishlisted ? (
              <svg viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="#FFFFFF"
                />
              </svg>
            ) : (
              <img src="/figma/trip-hero/icon-heart.svg" alt="" aria-hidden loading="lazy" />
            )}
          </button>
          <button
            className="tdp2-hero-btn-pill"
            type="button"
            aria-pressed={inCompare}
            onClick={toggleCompare}
          >
            {inCompare ? (
              <svg width={14} height={14} viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M3 3L11 11M11 3L3 11" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            ) : (
              <img src="/figma/trip-hero/icon-compare.svg" alt="" width={14} height={14} aria-hidden loading="lazy" />
            )}
            {inCompare ? "Remove from Compare" : "Add to Compare"}
          </button>
          <button className="tdp2-hero-btn-pill" type="button" onClick={() => setShareOpen(true)}>
            <img src="/figma/trip-hero/icon-share.svg" alt="" width={14} height={14} loading="lazy" />
            Share
          </button>
        </div>
      </div>

      {/* ── Trip Info Section (Figma 4931:7397) ─────────────────────────── */}
      <div className="tdp2-trip-info">

        {/* Breadcrumb + title + meta chips */}
        <div className="tdp2-ti-card">
          <div className="tdp2-ti-crumb">
            <img src={`${TI}home-icon.svg`} alt="" className="tdp2-ti-home" aria-hidden loading="lazy" />
            <span className="tdp2-ti-sep">{">"}</span>
            {data.breadcrumbs.map((crumb, i) => (
              <span key={i} className="tdp2-ti-crumb-link">
                {crumb}
                {i < data.breadcrumbs.length - 1 && <span className="tdp2-ti-sep"> {">"} </span>}
              </span>
            ))}
          </div>
          <h1 className="tdp2-ti-title">{data.title}</h1>
          <div className="tdp2-ti-chips">
            <span className="tdp2-ti-chip">{data.duration}</span>
            <span className="tdp2-ti-chip">{data.totalBatches}</span>
            <span className="tdp2-ti-chip">Group Size: {data.groupSize}</span>
          </div>

          {/* Pick Up / Drop */}
          <div className="tdp2-ti-pd">
            <div className="tdp2-ti-pd-header">
              <div className="tdp2-ti-pd-label">
                <img src={`${TI}location-icon.svg`} alt="" className="tdp2-ti-loc" aria-hidden loading="lazy" />
                <span>Pick Up</span>
              </div>
              <img src={`${TI}dashed-line.svg`} alt="" className="tdp2-ti-dashed" aria-hidden loading="lazy" />
              <div className="tdp2-ti-pd-label">
                <img src={`${TI}location-icon.svg`} alt="" className="tdp2-ti-loc" aria-hidden loading="lazy" />
                <span>Drop</span>
              </div>
            </div>
            <div className="tdp2-ti-pd-cities">
              <p className="tdp2-ti-pd-city">{data.pickUp}</p>
              <p className="tdp2-ti-pd-city tdp2-ti-pd-city--right">{data.drop}</p>
            </div>
          </div>
        </div>

        {/* City skeleton */}
        {data.cityStrip.length > 0 && (
          <div className="tdp2-ti-skeleton">
            {data.cityStrip.map((city, i) => (
              <React.Fragment key={i}>
                {i > 0 && <img src={`${TI}arrow.svg`} alt="" className="tdp2-ti-sk-arrow" aria-hidden loading="lazy" />}
                <span className="tdp2-ti-sk-city">{city}</span>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Women tag */}
        <div className="tdp2-ti-women">
          <img src={`${TI}women-icon.svg`} alt="" className="tdp2-ti-women-icon" aria-hidden loading="lazy" />
          <span className="tdp2-ti-women-text">{data.womenBadge}</span>
        </div>

        {/* Is this trip for me? */}
        <div className="tdp2-ti-fit">
          <p className="tdp2-ti-fit-title">Is this trip for me?</p>
          <div className="tdp2-ti-fit-rows">
            {data.fitTags.map(tag => <TiFitRow key={tag.label} label={tag.label} rating={tag.rating} />)}
          </div>
        </div>

      </div>

      {/* ── Itinerary highlights (Figma 4077:8358) ─────────────────── */}
      <div className="tdp2-separator"/>
      <div className="tdp2-services-strip">
        <div className="tdp2-inc-chip">
          <img src="/figma/itin-highlights/icon-accommodation.svg" alt="" className="tdp2-inc-chip-icon" aria-hidden loading="lazy" />
          <span className="tdp2-inc-chip-text">9N Accommodation</span>
        </div>
        <div className="tdp2-inc-chip">
          <img src="/figma/itin-highlights/icon-meals.svg" alt="" className="tdp2-inc-chip-icon" aria-hidden loading="lazy" />
          <span className="tdp2-inc-chip-text">12 Meals</span>
        </div>
        <div className="tdp2-inc-chip">
          <img src="/figma/itin-highlights/icon-transfers.svg" alt="" className="tdp2-inc-chip-icon" aria-hidden loading="lazy" />
          <span className="tdp2-inc-chip-text">10 Shared Transfers</span>
        </div>
        <div className="tdp2-inc-chip">
          <img src="/figma/itin-highlights/icon-activities.svg" alt="" className="tdp2-inc-chip-icon" aria-hidden loading="lazy" />
          <span className="tdp2-inc-chip-text">12 Activities</span>
        </div>
        <div className="tdp2-inc-chip">
          <img src="/figma/itin-highlights/icon-guides.svg" alt="" className="tdp2-inc-chip-icon" aria-hidden loading="lazy" />
          <span className="tdp2-inc-chip-text">Trip Captains, Local Guides</span>
        </div>
      </div>

      {/* ── Tab Bar + Day Chips (Figma 4049:22964) ─────────────────── */}
      <div className="tdp2-separator"/>
      <div className="tdp2-tabs-wrap">
        <div className="tdp2-tabs">
          {tabs.map((t, i) => (
            <button
              key={t}
              className={`tdp2-tab${activeTab === i ? " active" : ""}`}
              onClick={() => { setActiveTab(i); scrollToSection(TAB_SECTIONS[i]); }}
            >
              {i === 0 && (
                <img src="/figma/itin-highlights/icon-overview-key.svg" alt="" className="tdp2-tab-icon" aria-hidden loading="lazy" />
              )}
              {t}
            </button>
          ))}
        </div>
        <div className="tdp2-day-strip">
          {data.itinerary.map((_day, i) => (
            <button
              key={i}
              className={`tdp2-day-chip-btn${activeDay === i ? " active" : ""}`}
              onClick={() => scrollToDay(i)}
            >
              {`Day-${i + 1}`}
            </button>
          ))}
        </div>
      </div>


      {/* ── Itinerary placeholder anchor ─────────────────────────────── */}
      <div className="tdp2-separator"/>
      <section id="section-itin" className="tdp2-itin-section">
        {/* ── Route map (Figma 4049:23182) ─────────────────────────── */}
        <div className="tdp2-itin-map-wrap">
          <img
            src="/figma/itin-section/route-map.png"
            alt="Trip route map"
            className="tdp2-itin-map"
          loading="lazy" />
        </div>

        {/* ── City cards + Shared Transfers (Figma 3014:13852 / 4554:6067) ── */}
        {/* First transfer: pickup → first city */}
        {data.cityStrip.length > 0 && (
          <SharedTransfer
            from={data.pickUp || "Airport"}
            to={`${parseCityStrip(data.cityStrip[0]).city} Hotel`}
          />
        )}
        {(() => {
          const nodes: React.ReactNode[] = [];
          const lastDayIdx = data.itinerary.length - 1;
          let dayOffset = 0;
          data.cityStrip.forEach((entry, i) => {
            const nightCount = parseInt(entry.match(/^(\d+)N/i)?.[1] ?? "1");
            const startDay = dayOffset;
            dayOffset += nightCount;
            const cityDays = data.itinerary.slice(startDay, startDay + nightCount);
            nodes.push(
              <CityCard key={`city-${i}`} entry={entry} photo={data.heroImages[i + 1] ?? data.heroImages[0]} />
            );
            nodes.push(
              <div key={i} className="tdp2-itin-city-group">
                {cityDays.map((day, di) => {
                  const gIdx = startDay + di;
                  return (
                    <React.Fragment key={gIdx}>
                      <DayCard
                        day={day}
                        index={gIdx}
                        isOpen={openDays.has(gIdx)}
                        onToggle={() => setOpenDays(prev => {
                          const s = new Set(prev);
                          s.has(gIdx) ? s.delete(gIdx) : s.add(gIdx);
                          return s;
                        })}
                      />
                      {gIdx !== lastDayIdx && <div className="tdp2-itin-day-divider"/>}
                    </React.Fragment>
                  );
                })}
              </div>
            );
          });
          // Remaining days that exceed the city night counts (e.g. departure day)
          data.itinerary.slice(dayOffset).forEach((day, di) => {
            const gIdx = dayOffset + di;
            nodes.push(
              <DayCard
                key={`tail-${gIdx}`}
                day={day}
                index={gIdx}
                isOpen={openDays.has(gIdx)}
                onToggle={() => setOpenDays(prev => {
                  const s = new Set(prev);
                  s.has(gIdx) ? s.delete(gIdx) : s.add(gIdx);
                  return s;
                })}
              />
            );
            if (gIdx !== lastDayIdx) {
              nodes.push(<div key={`tail-div-${gIdx}`} className="tdp2-itin-day-divider"/>);
            }
          });
          return nodes;
        })()}

        {/* ── End of the Journey (Figma 3097:2065) ───────────────── */}
        <p className="tdp2-end-journey">End of the Journey</p>
      </section>

      {/* ── Download Itinerary (Figma 3014:13922) ───────────────── */}
      <div className="tdp2-dl-itin-wrap">
        <button className="tdp2-dl-itin-btn">
          <span className="tdp2-dl-itin-label">Download Itinerary</span>
          <img src="/figma/itin-section/download-icon.svg" alt="" className="tdp2-dl-itin-icon" aria-hidden loading="lazy" />
        </button>
      </div>

      {/* ── Inclusions (Figma 3268:10174) ───────────────────────────── */}
      <div className="tdp2-separator"/>
      <section id="section-incl" className="tdp2-incl-section">
        <button className="tdp2-incl-header" onClick={() => setInclOpen(o => !o)}>
          <img src="/figma/itin-highlights/icon-overview-key.svg" alt="" className="tdp2-incl-hd-icon" aria-hidden loading="lazy" />
          <span className="tdp2-incl-hd-label">Inclusions</span>
          <img
            src="/figma/itin-section/day-chevron-dropdown.svg"
            alt=""
            className={`tdp2-incl-hd-chevron${inclOpen ? " open" : ""}`}
            aria-hidden
          loading="lazy" />
        </button>
        {inclOpen && (
          <>
            <div className="tdp2-incl-inner-divider" />
            <div className="tdp2-incl-body">
              <ul className="tdp2-incl-list">
                {data.inclusions.map((inc, i) => (
                  <li key={i} className="tdp2-incl-item">
                    <div className="tdp2-incl-item-icon-wrap">
                      <img src="/figma/itin-section/incl-check.png" alt="" className="tdp2-incl-item-icon" aria-hidden loading="lazy" />
                    </div>
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
              <div className="tdp2-incl-insurance">
                <p className="tdp2-incl-ins-title">Medical and Baggage Insurance included</p>
                <p className="tdp2-incl-ins-body">The price includes Medical and Baggage Insurance which covers all services included in the WanderOn trip. International flights and any arrangements booked independently outside of the WeRoad trip are excluded. Any pre-existing medical condition is also excluded.</p>
              </div>
            </div>
          </>
        )}
        <div className="tdp2-incl-divider" />
      </section>


      {/* ── Exclusions (Figma 3268:10067 / 3268:10077) ─────────────── */}
      <div className="tdp2-separator"/>
      <section id="section-excl" className="tdp2-excl-section">
        <button className="tdp2-incl-header" onClick={() => setExclOpen(o => !o)}>
          <img src="/figma/itin-highlights/icon-overview-key.svg" alt="" className="tdp2-incl-hd-icon" aria-hidden loading="lazy" />
          <span className="tdp2-incl-hd-label">Exclusions</span>
          <img
            src="/figma/itin-section/day-chevron-dropdown.svg"
            alt=""
            className={`tdp2-incl-hd-chevron${exclOpen ? " open" : ""}`}
            aria-hidden
          loading="lazy" />
        </button>
        {exclOpen && (
          <>
            <div className="tdp2-incl-inner-divider" />
            <div className="tdp2-excl-body">
              <ul className="tdp2-incl-list">
                {data.exclusions.map((exc, i) => (
                  <li key={i} className="tdp2-incl-item">
                    <div className="tdp2-incl-item-icon-wrap">
                      <img src="/figma/itin-section/excl-x.png" alt="" className="tdp2-incl-item-icon" aria-hidden loading="lazy" />
                    </div>
                    <span>{exc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
        <div className="tdp2-incl-divider" />
      </section>

      {/* ── Reviews (TribeStories — same as homepage) ─────────────── */}
      <div className="tdp2-separator"/>
      <div id="section-reviews">
        <TribeStories />
      </div>

      {/* ── Meet The Captains (Figma 3724:9265) ──────────────────────── */}
      <div className="tdp2-separator"/>
      <section id="section-captains" className="tdp2-captain-section">
        <p className="tdp2-captain-title">Meet The Captains</p>
        <div className="tdp2-captain-avstack">
          <div className="tdp2-captain-av">
            <div className="tdp2-captain-av-inner">
              <img src={CAP_AV_A} alt="" loading="lazy"/>
            </div>
          </div>
          <div className="tdp2-captain-av tdp2-captain-av--2">
            <div className="tdp2-captain-av-inner">
              <img src={CAP_AV_B} alt="" loading="lazy"/>
            </div>
          </div>
          <div className="tdp2-captain-av tdp2-captain-av--3">
            <div className="tdp2-captain-av-inner">
              <img src={CAP_AV_C} alt="" loading="lazy"/>
            </div>
          </div>
        </div>
        <p className="tdp2-captain-desc">Our Group Leaders are chosen because they&#39;re people just like you: passionate travellers who share the experience authentically, while having the skills to take care of the organisation, and help you get the most out of every moment of the trip.</p>
        <div className="tdp2-captain-bullets">
          <div className="tdp2-captain-bullet">
            <img src={CAP_ICO_CERT} alt="" className="tdp2-captain-bullet-icon" aria-hidden="true" loading="lazy" />
            <div className="tdp2-captain-bullet-text">
              <p className="tdp2-captain-bullet-title">Certified</p>
              <p className="tdp2-captain-bullet-body">Every captain is Wanderon-certified and first-aid trained before they ever lead a batch.</p>
            </div>
          </div>
          <div className="tdp2-captain-bullet">
            <img src={CAP_ICO_ROUTE} alt="" className="tdp2-captain-bullet-icon" aria-hidden="true" loading="lazy" />
            <div className="tdp2-captain-bullet-text">
              <p className="tdp2-captain-bullet-title">Knows the route by heart</p>
              <p className="tdp2-captain-bullet-body">Minimum 10 runs on a route before leading it solo. They know the shortcuts and the scams.</p>
            </div>
          </div>
          <div className="tdp2-captain-bullet">
            <img src={CAP_ICO_WOMEN} alt="" className="tdp2-captain-bullet-icon" aria-hidden="true" loading="lazy" />
            <div className="tdp2-captain-bullet-text">
              <p className="tdp2-captain-bullet-title">Women captains on request</p>
              <p className="tdp2-captain-bullet-body">Booking a Wander Women batch, or just prefer it? We&#39;ll assign a woman captain.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Create Moments carousel (Figma 3014:14121) ─────────────── */}
      <div className="tdp2-separator"/>
      <section className="tdp2-moments-section">
        <p className="tdp2-moments-title">Create<br/>moments you<br/>wish existed</p>
        <div className="tdp2-moments-track-wrap">
          <div className="tdp2-moments-track">
            {([0, 1] as number[]).flatMap((_, rep) =>
              MOMENTS_SLOTS.map((slot, i) => (
                <div
                  key={`${rep}-${i}`}
                  className="tdp2-moments-slot"
                  style={{ width: slot.w, height: slot.h, cursor: "pointer" }}
                  onClick={() => openGallery(MOMENTS_IMGS, i)}
                  role="button"
                  tabIndex={rep === 0 ? 0 : -1}
                >
                  <img src={slot.img} alt="" loading="lazy"/>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── FAQs (Figma 4518:7651) ────────────────────────────────────── */}
      <div className="tdp2-separator"/>
      <section className="tdp2-faq-section">
        <p className="tdp2-faq-title">Frequently Asked Questions</p>
        <div className="tdp2-faq-list">
          {faqs.map((faq, i) => (
            <FaqItem key={i} index={i+1} question={faq.q} answer={faq.a} isOpen={openFaqs.has(i)} onToggle={() => {
              setOpenFaqs(prev => prev.has(i) ? new Set<number>() : new Set<number>([i]));
            }}/>
          ))}
        </div>
      </section>

      {/* ── More Trips (Figma 3014:14166) ────────────────────────────── */}
      <div className="tdp2-separator"/>
      <section className="tdp2-more-section">
        <p className="tdp2-more-label">More {productDest} Trips</p>
        <div className="tdp2-more-scroll">
          {relatedTrips.map((t) => (
            <TripCardItem key={t.slug} trip={t} />
          ))}
          <ViewMoreCard a={moreVmA} b={moreVmB} to={moreHref} />
        </div>
      </section>

      {/* ── Enquire Now (QueryBanner — same as homepage) ───────────── */}
      <div className="tdp2-separator"/>
      <QueryBanner />

      <FooterMessage />
      <Footer />

      {/* ── Sticky Bottom Nav (Figma 4518:15125 / 5406:15308) ───────── */}
      <div className="tdp2-sticky-nav">
        {/* WhatsApp FAB — floats above the nav, appears past the first fold */}
        {showWhatsApp && (
          <a
            className="tdp2-wa-fab"
            href="https://api.whatsapp.com/send?phone=918130288566&text=Hi+WanderOn%2C+I+have+a+query%21"
            target="_blank"
            rel="noreferrer"
            aria-label="Chat on WhatsApp"
          >
            <img src="/figma/nav/whatsapp-btn.svg" alt="" aria-hidden className="tdp2-wa-fab-img" />
          </a>
        )}

        {/* Compare Trips bar — appears when this trip is added to compare */}
        {inCompare && (
          <button
            className="tdp2-compare-bar"
            type="button"
            onClick={() => navigate("/compare")}
          >
            <img
              src="/figma/nav2/icon-compare.svg"
              alt=""
              aria-hidden
              className="tdp2-compare-bar-icon"
            />
            <span>Compare Trips</span>
          </button>
        )}

        {selectedBatch && (
          <div className="tdp2-sticky-tag">
            <div className="tdp2-sticky-tag-left">
              <img
                className="tdp2-sticky-tag-icon"
                src="/figma/batches/icon-your-trips.svg"
                alt=""
                aria-hidden
              />
              <span className="tdp2-sticky-tag-title">{stickyTitle}</span>
              <span className="tdp2-sticky-tag-dot" aria-hidden />
              <span className="tdp2-sticky-tag-date">{selectedBatch.dateRange}</span>
            </div>
            <button
              className="tdp2-sticky-tag-change"
              type="button"
              onClick={() => setBatchesOpen(true)}
            >
              Change Batch
            </button>
          </div>
        )}
        <div className="tdp2-sticky-main">
          <div className="tdp2-sticky-price-col">
            <div className="tdp2-sticky-top-row">
              <span className="tdp2-sticky-amount">
                &#8377;{selectedBatch ? selectedBatch.price : data.displayPrice}
              </span>
              <div className="tdp2-sticky-discount">-10%</div>
            </div>
            <span className="tdp2-sticky-label">Starting price per person</span>
          </div>
          <button
            className="tdp2-sticky-btn"
            type="button"
            onClick={selectedBatch ? handleContinueBook : () => setBatchesOpen(true)}
          >
            <span className="tdp2-sticky-btn-label">
              {selectedBatch ? "Continue to Book" : "View Batches"}
            </span>
          </button>
        </div>
      </div>

      <GallerySheet
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        images={galleryImages}
        startIndex={galleryIndex}
        title="Europe: Paris to Berlin, between cities, canals & culture"
        tags={["Bali", "Ubud", "Kintamani Waterfalls", "Nusa Penida", "Kuta", "Uluwatu Temple"]}
      />

      <ShareSheet
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        title={data.title}
        image={data.heroImages[0]}
        duration={data.duration}
        price={data.displayPrice}
      />

      <BatchesSheet
        isOpen={batchesOpen}
        onClose={() => setBatchesOpen(false)}
        tripTitle={data.title}
        nights={7}
        ctaLabel={selectedBatch ? "Select Batch" : "Book Trip"}
        onSelectBatch={
          selectedBatch
            ? (batch, start, end) => {
                const fmt = (d: Date, withYear: boolean) =>
                  d.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    ...(withYear ? { year: "numeric" } : {}),
                  });
                const price = Number(String(batch.price).replace(/,/g, "")).toLocaleString("en-IN");
                setSelectedBatch({
                  dateRange: `${fmt(start, false)} - ${fmt(end, true)}`,
                  price: `${price}/-`,
                });
                setBatchesOpen(false);
              }
            : undefined
        }
      />

      <LoginSheet
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}