import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useCompare } from "../context/CompareContext";
import "./TripDetail.css";
import SiteHeader2 from "../components/SiteHeader2";
import TribeStories from "../components/TribeStories/TribeStories";
import QueryBanner from "../components/QueryBanner";
import GallerySheet from "../components/GallerySheet/GallerySheet";
import ShareSheet from "../components/ShareSheet/ShareSheet";
import BatchesSheet from "../components/BatchesSheet/BatchesSheet";
import FooterMessage from "../components/FooterMessage/FooterMessage";
import Footer from "../components/Footer";
import { SAMPLE_UPCOMING_TRIPS } from "../api/sampleData";
import { TripCardItem, ViewMoreCard } from "../components/UpcomingTrips/TripCardItem";
import { useIsDesktop } from "../hooks/useIsDesktop";
import DesktopTripDetail from "../components/desktop/DesktopTripDetail";
import ItineraryCustomiser, { selectionPrice } from "../components/ItineraryCustomiser/ItineraryCustomiser";
import { getScrollTop, onAppScroll } from "../utils/scroll";

// ── Figma-downloaded assets ──────────────────────────────────────────────────
const FIG = "/trip-detail/";
/* hero-thumb-2/3, hero-main and itin-map were byte-identical copies of the
 * trip-hero / itin-section assets, so the shared files are reused instead. */
const HERO_LARGE = "/figma/trip-hero/hero-bg.png";
const HERO_T1    = `${FIG}hero-thumb-1.png`;
const HERO_T2    = "/figma/trip-hero/hero-bg.png";
const HERO_T3    = `${FIG}hero-thumb-1.png`;
const HERO_MAIN  = "/figma/trip-hero/hero-bg.png";  // fallback / extra thumb
const ITIN_MAP   = "/figma/itin-section/route-map.png";
/* Same on/off switch art the listing page uses for its "Show Features" toggle. */
const LISTING_TOGGLE = "/figma/listing/toggle/";
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

type PackageType = "hotel" | "hostel";

const HL_ICON = "/figma/itin-highlights/";

/** Meals and activities per night on the full route, used to size those counts
 *  for a shorter selection. Everything else comes from the selection itself. */
const PER_NIGHT = {
  hotel:  { meals: 12 / 18, activities: 12 / 18 },
  hostel: { meals:  8 / 18, activities: 12 / 18 },
};

function packageServices(type: PackageType, trip: SelectedTrip) {
  const per = PER_NIGHT[type];
  const count = (rate: number) => Math.max(1, Math.round(rate * trip.nights));
  const stay = type === "hotel" ? "Hotel" : "Hostel";
  return [
    { icon: `${HL_ICON}icon-accommodation.svg`, label: `${trip.nights}N ${stay} Accommodation` },
    { icon: `${HL_ICON}icon-meals.svg`, label: `${count(per.meals)} Meals` },
    // Hotel packages pick you up and drop you off; hostel packages do not.
    ...(type === "hotel"
      ? [{ icon: `${HL_ICON}icon-transfers.svg`, label: "Airport Transfer" }]
      : []),
    { icon: `${HL_ICON}icon-transfers.svg`, label: `${trip.legs} Shared Transfers` },
    { icon: `${HL_ICON}icon-activities.svg`, label: `${count(per.activities)} Activities` },
    { icon: `${HL_ICON}icon-guides.svg`, label: "Trip Captains, Local Guides" },
  ];
}

/** The trip the page is currently describing: the customiser's applied
 *  selection, or the whole mother itinerary before the traveller narrows it. */
export interface SelectedTrip {
  start: number;
  end: number;
  cities: string[];
  /** Stops covered, and the transfer legs between them. */
  stops: number;
  legs: number;
  nights: number;
  days: number;
  price: number;
  /** Price formatted the way the page prints it, e.g. "14,000/-". */
  priceLabel: string;
  durationLabel: string;
  isFullRoute: boolean;
}

export function selectedTrip(
  data: ProductData,
  selection: { start: number; end: number } | null,
  basePrice: number
): SelectedTrip {
  const lastStation = data.motherItinerary.length - 1;
  const start = selection?.start ?? 0;
  const end = selection?.end ?? lastStation;
  const nights = data.motherNights.slice(start, end + 1).reduce((a, b) => a + b, 0);
  const price = selectionPrice(basePrice, end - start, lastStation);
  return {
    start,
    end,
    cities: data.motherItinerary.slice(start, end + 1),
    stops: end - start + 1,
    legs: Math.max(0, end - start),
    nights,
    days: nights + 1,
    price,
    priceLabel: `${price.toLocaleString("en-IN")}/-`,
    durationLabel: `${nights}N · ${nights + 1}D`,
    isFullRoute: start === 0 && end === lastStation,
  };
}

// ── Type definitions ──────────────────────────────────────────────────────────
export interface DayActivity {
  title: string;
  photos?: string[];
  isLeisure?: boolean;
  leisureDesc?: string;
  leisureDescBold?: string;
  leisurePhotos?: string[];
}
export interface DayItinerary {
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
}
export interface ProductData {
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
  /** Full mother-itinerary stations, in travel order, for the customiser. */
  motherItinerary: string[];
  /** Nights spent at each mother-itinerary station. */
  motherNights: number[];
  womenBadge: string;
  fitTags: { label: string; rating: number }[];
  mapImage: string;
  captain: { name: string; photo: string; reviews: number; years: number; rating: number };
}

// ── Static page data (Figma) ─────────────────────────────────────────────────
export const STATIC_DATA: ProductData = {
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
  motherItinerary: [
    "Paris", "Brussels", "Amsterdam", "Cologne", "Heidelberg",
    "Rhine Falls", "Zurich", "Lucerne", "Vienna", "Budapest",
  ],
  motherNights: [3, 1, 2, 1, 1, 1, 2, 2, 2, 3],
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
          photos: ["/figma/itin-section/d2-a2-1.jpg", "/figma/itin-section/d2-a2-2.jpg", "/figma/itin-section/d2-a2-3.jpg"],
        },
        {
          title: "3- Palace of Versailles",
          photos: ["/figma/itin-section/d2-a3-1.jpg", "/figma/itin-section/d2-a3-2.jpg", "/figma/itin-section/d2-a3-3.jpg"],
        },
        {
          title: "4- 1 Hour Seine River Cruise",
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
          photos: [
            "/figma/itin-section/d3-a1-1.jpg",
            "/figma/itin-section/d3-a1-2.jpg",
            "/figma/itin-section/d3-a1-3.jpg",
          ],
        },
      ],
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
          photos: [
            "/figma/itin-section/d4-a2-1.jpg",
            "/figma/itin-section/d4-a2-2.jpg",
            "/figma/itin-section/d4-a2-3.jpg",
          ],
        },
      ],
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
        { title: "1- Keukenhof Tour, Amsterdam On A Shared Basis", photos: ["/figma/itin-section/d5-a1-1.jpg", "/figma/itin-section/d5-a1-2.jpg", "/figma/itin-section/d5-a1-3.jpg"] },
        { title: "2- Amsterdam Canal Cruise On A Shared Basis", photos: ["/figma/itin-section/d5-a2-1.jpg", "/figma/itin-section/d5-a2-2.jpg", "/figma/itin-section/d5-a2-3.jpg"] },
      ],
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
        { title: "2- Rhine Falls Boat Tour, Switzerland On A Shared Basis", photos: ["/figma/itin-section/d6-a2-1.jpg", "/figma/itin-section/d6-a2-2.jpg", "/figma/itin-section/d6-a2-3.jpg"] },
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
        { title: "1- Day Trip To Jungfraujoch On A Shared Basis", photos: ["/figma/itin-section/d7-a1-1.jpg", "/figma/itin-section/d7-a1-2.jpg", "/figma/itin-section/d7-a1-3.jpg"] },
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
    },
  ],
};


// ── Small components ──────────────────────────────────────────────────────────

export interface TransferLeg {
  from: string;
  to: string;
  duration?: string;
}

/** Transfer leg shown at the top of an expanded day (Figma 7165:7171). */
export function DayTransfer({ from: fromCity, to: toCity, duration }: TransferLeg) {
  return (
    <div className="tdp2-day-tr-row">
      <span className="tdp2-day-tr-city">{fromCity}</span>
      <span className="tdp2-day-tr-line" aria-hidden />
      <div className="tdp2-day-tr-pill">
        <span className="tdp2-day-tr-car">
          <img src="/figma/itin-section/transfer-car.svg" alt="" aria-hidden loading="lazy" />
        </span>
        {duration && <span className="tdp2-day-tr-dur">{duration}</span>}
      </div>
      <span className="tdp2-day-tr-line tdp2-day-tr-line--arrow" aria-hidden />
      <span className="tdp2-day-tr-city">{toCity}</span>
    </div>
  );
}

/** Transfer legs implied by the itinerary skeleton: a day whose city differs
 *  from the day before is a travel day. The closing day is the journey home
 *  rather than a city-to-city leg, so it carries no transfer. */
export function itineraryTransfers(data: ProductData): (TransferLeg | undefined)[] {
  const days = data.itinerary;
  return days.map((day, i) =>
    i === 0 || i === days.length - 1 || days[i - 1].city === day.city
      ? undefined
      : { from: days[i - 1].city, to: day.city }
  );
}

export function parseCityStrip(entry: string): { nights: string; city: string } {
  const m = entry.match(/^(\d+)N\s+(.+)$/i);
  if (m) return { nights: `${m[1]} Night${Number(m[1]) > 1 ? "s" : ""}`, city: m[2] };
  return { nights: "", city: entry };
}

export function CityCard({ entry, photo }: { entry: string; photo: string }) {
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


/** FAQ accordion row, shared with the desktop product page. */
export function FaqItem({ index, question, answer, isOpen, onToggle }: {
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


export function TiFitRow({ label, rating }: { label: string; rating: number }) {
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

export function ItineraryMapToggle({ checked, onChange }: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="tdp2-itin-map-toggle">
      <span>Show Map</span>
      <button
        type="button"
        className="tdp2-itin-switch"
        role="switch"
        aria-checked={checked}
        aria-label={checked ? "Hide trip map" : "Show trip map"}
        onClick={onChange}
      >
        <img
          className="tdp2-itin-switch-img"
          src={`${LISTING_TOGGLE}toggle-${checked ? "on" : "off"}.svg`}
          alt=""
          aria-hidden
        />
      </button>
    </div>
  );
}

export function DayCard({ day, index, isOpen, onToggle, transfer }: {
  day: DayItinerary;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  transfer?: TransferLeg;
}) {
  const title = day.summary?.[0] ?? day.city;
  const hasStay = Boolean(day.stayName);
  const hasActivities = Boolean(day.activities?.length);
  const isSameAccommodation = day.stayName?.startsWith("Same Accommodation");

  return (
    <div id={`day-${index}`} className={`tdp2-day-card${isOpen ? " open" : ""}`} style={{ scrollMarginTop: "186px" }}>
      <button className="tdp2-day-card-header" onClick={onToggle}>
        <div className="tdp2-day-card-header-left">
          <span className="tdp2-day-badge">{`Day ${index + 1}`}</span>
          <span className="tdp2-day-card-title">{title}</span>
        </div>
        <img
          src={isOpen
            ? "/figma/itin-section/itinerary-arrow-up.svg"
            : "/figma/itin-section/itinerary-arrow-down.svg"}
          alt=""
          className="tdp2-day-card-chevron"
          aria-hidden
          loading="lazy"
        />
      </button>

      {isOpen && (
        <div className="tdp2-day-card-expanded">
          {transfer && (
            <div className="tdp2-day-tl-item">
              <div className="tdp2-day-tl-left">
                <img src="/figma/itin-section/itinerary-timeline.svg" alt="" className="tdp2-day-tl-pin" aria-hidden loading="lazy" />
                <div className="tdp2-day-tl-line" />
              </div>
              <div className="tdp2-day-tl-content">
                <div className="tdp2-day-tl-section-hd">
                  <img src="/figma/itin-section/transfer-taxi.svg" alt="" className="tdp2-day-tl-sec-icon" aria-hidden loading="lazy" />
                  <span className="tdp2-day-tl-sec-label">Shared Transfer</span>
                </div>
                <DayTransfer {...transfer} />
              </div>
            </div>
          )}

          {hasStay && (
            <div className="tdp2-day-tl-item">
              <div className="tdp2-day-tl-left">
                <img src="/figma/itin-section/itinerary-timeline.svg" alt="" className="tdp2-day-tl-pin" aria-hidden loading="lazy" />
                <div className="tdp2-day-tl-line" />
              </div>
              <div className="tdp2-day-tl-content">
                <div className="tdp2-day-tl-section-hd">
                  <img src="/figma/itin-section/itinerary-stay.svg" alt="" className="tdp2-day-tl-sec-icon" aria-hidden loading="lazy" />
                  <span className="tdp2-day-tl-sec-label">Stay</span>
                  {day.stayNights && (
                    <>
                      <div className="tdp2-day-tl-sec-divider" />
                      <span className="tdp2-day-tl-sec-label">{day.stayNights} Night{day.stayNights > 1 ? "s" : ""}</span>
                    </>
                  )}
                </div>
                {day.stayNote && (
                  <div className="tdp2-day-stay-note">
                    <img src="/figma/itin-section/itinerary-info.svg" alt="" className="tdp2-day-stay-note-icon" aria-hidden loading="lazy" />
                    <span className="tdp2-day-stay-note-text">{day.stayNote}</span>
                    <img src="/figma/itin-section/itinerary-note-tail.svg" alt="" className="tdp2-day-stay-note-tail" aria-hidden loading="lazy" />
                  </div>
                )}
                {day.stayPhotos && day.stayPhotos.length > 0 && (
                  <div className="tdp2-day-hotel-options">
                    {day.stayPhotos.slice(0, 2).map(photo => (
                      <div className="tdp2-day-hotel-option" key={photo}>
                        <img src={photo} alt={day.stayName ?? ""} className="tdp2-day-hotel-photo" loading="lazy" />
                        <p className="tdp2-day-hotel-name">{day.stayName}</p>
                      </div>
                    ))}
                  </div>
                )}
                {!day.stayPhotos?.length && (
                  isSameAccommodation ? (
                    <div className="tdp2-day-same-stay">
                      <img
                        src="/figma/itin-section/same-accommodation-info.svg"
                        alt=""
                        className="tdp2-day-same-stay-icon"
                        aria-hidden
                      />
                      <span>{day.stayName}</span>
                    </div>
                  ) : (
                    <p className="tdp2-day-stay-name">{day.stayName}</p>
                  )
                )}
                {day.stayMeals && day.stayMeals.length > 0 && (
                  <div className="tdp2-day-meals-bar">
                    <div className="tdp2-day-meals-list">
                      {day.stayMeals.map((meal, mi) => (
                        <React.Fragment key={mi}>
                          {mi > 0 && <div className="tdp2-day-meal-sep" />}
                          <div className="tdp2-day-meal-item">
                            <img src="/figma/itin-section/itinerary-meal.svg" alt="" className="tdp2-day-meal-icon" aria-hidden loading="lazy" />
                            <span className="tdp2-day-meal-label">{meal}</span>
                            <img src="/figma/itin-section/itinerary-done.svg" alt="" className="tdp2-day-meal-done" aria-hidden loading="lazy" />
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
                <img src="/figma/itin-section/itinerary-timeline.svg" alt="" className="tdp2-day-tl-pin" aria-hidden loading="lazy" />
                <div className="tdp2-day-tl-line" />
              </div>
              <div className="tdp2-day-tl-content tdp2-day-tl-content--act">
                <div className="tdp2-day-tl-section-hd">
                  <img src="/figma/itin-section/itinerary-activity.svg" alt="" className="tdp2-day-tl-sec-icon tdp2-day-tl-sec-icon--act" aria-hidden loading="lazy" />
                  <span className="tdp2-day-tl-sec-label">Activity</span>
                </div>
                {day.activities!.map((act, ai) => (
                  <div key={ai} className="tdp2-day-activity-item">
                    {ai > 0 && <div className="tdp2-day-act-divider" />}
                    {act.isLeisure ? (
                      <div className="tdp2-day-leisure-card">
                        <img src="/figma/itin-section/itinerary-leisure.svg" alt="" className="tdp2-day-leisure-icon" aria-hidden loading="lazy" />
                        <span className="tdp2-day-leisure-label">{act.title}</span>
                      </div>
                    ) : (
                      <div className="tdp2-day-act-row">
                        <div className="tdp2-day-act-text">
                          <p className="tdp2-day-act-title">{act.title}</p>
                        </div>
                        {act.photos?.[0] && (
                          <img src={act.photos[0]} alt="" className="tdp2-day-act-thumb" loading="lazy" />
                        )}
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
                    <img src="/figma/itin-section/itinerary-timeline.svg" alt="" className="tdp2-day-tl-pin" aria-hidden loading="lazy" />
                    <div className="tdp2-day-tl-line" />
                  </div>
                  <p className="tdp2-day-tl-text">{item}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Shared FAQ copy (reused by the desktop product page) ──────────────────────
export const TDP_FAQS = [
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

// ── Main component ────────────────────────────────────────────────────────────
export default function TripDetail() {
  const data = STATIC_DATA;
  const isDesktop = useIsDesktop();
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
  // Itinerary customiser sheet (interactive train model). `tripSel` holds
  // the trip start/end chosen in the sheet; null = full mother itinerary.
  const [customiserOpen, setCustomiserOpen] = useState(false);
  const [tripSel, setTripSel] = useState<{ start: number; end: number } | null>(null);

  // Everything the page quotes — price, duration, service counts — describes
  // the applied selection, priced off the chosen batch when there is one.
  const basePrice = Number(String(selectedBatch?.price ?? data.displayPrice).replace(/[^\d]/g, ""));
  const trip = useMemo(() => selectedTrip(data, tripSel, basePrice), [data, tripSel, basePrice]);

  const buildBookingState = () => ({
    tripTitle: stickyTitle,
    tripName: stickyTitle,
    dateRange: selectedBatch?.dateRange ?? "",
    durationLabel: `${trip.nights}N/${trip.days}D`,
    perPerson: trip.priceLabel.replace("/-", ""),
    travelers: 2,
  });
  const handleContinueBook = () => navigate("/booking", { state: buildBookingState() });
  const compareSlug = routeSlug ?? "current-trip";
  const { isInCompare, toggle: toggleCompareTrip } = useCompare();
  const inCompare = isInCompare(compareSlug);
  const toggleCompare = () =>
    toggleCompareTrip({
      slug: compareSlug,
      title: data.title,
      image: data.heroImages[0],
      price: trip.priceLabel,
    });

  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [activeDay, setActiveDay] = useState(0);
  const [openFaqs, setOpenFaqs] = useState<Set<number>>(new Set([0]));
  const [openDays, setOpenDays] = useState<Set<number>>(new Set([0]));
  const [showItineraryMap, setShowItineraryMap] = useState(false);
  const transfers = useMemo(() => itineraryTransfers(data), [data]);
  const [packageType, setPackageType] = useState<PackageType>("hotel");
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
    const onScroll = () => setShowWhatsApp(getScrollTop() > 420);
    onScroll();
    return onAppScroll(onScroll);
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

  const faqs = TDP_FAQS;

  if (isDesktop) {
    return <DesktopTripDetail />;
  }

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

        {/* Fanned gallery stack, above the action bar (Figma 7423:17721) */}
        <button
          className="tdp2-hero-thumb-stack"
          type="button"
          aria-label="Open gallery"
          onClick={() => openGallery(HERO_GALLERY, 1)}
        >
          {["thumb-1", "thumb-2", "thumb-3"].map((name, i) => (
            <span key={name} className={`tdp2-hero-thumb tdp2-hero-thumb--${i + 1}`}>
              <img src={`/figma/trip-hero/${name}.png`} alt="" className="tdp2-hero-thumb-img" loading="lazy" />
              {i === 2 && (
                <>
                  <span className="tdp2-hero-thumb-overlay" aria-hidden />
                  <span className="tdp2-hero-thumb-count">(10+)</span>
                </>
              )}
            </span>
          ))}
        </button>

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
              <img src="/figma/trip-hero/icon-favorite.svg" alt="" aria-hidden loading="lazy" />
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
        </div>

        {/* Trip start/end card (Figma 7743:1620) — opens the itinerary customiser */}
        {data.motherItinerary.length > 0 && (() => {
          const routeName = data.breadcrumbs[data.breadcrumbs.length - 1];
          return (<>

          {/* Skeleton itinerary (Figma 7743:1652) — the selected route, arrow-separated */}
          <div
            className="tdp2-sk-route"
            role="button"
            tabIndex={0}
            onClick={() => setCustomiserOpen(true)}
            onKeyDown={e => { if (e.key === "Enter" || e.key === " ") setCustomiserOpen(true); }}
          >
            {trip.cities.map((city, i) => (
              <span key={city} className="tdp2-sk-item">
                {i > 0 && (
                  <img src="/figma/train/route-arrow.svg" alt="" aria-hidden className="tdp2-sk-arrow" loading="lazy" />
                )}
                <span className="tdp2-sk-city">{city}</span>
              </span>
            ))}
          </div>

          <div className="tdp2-se-wrap">
            <div className="tdp2-se-tag">
              This route cover {trip.stops} of {data.motherItinerary.length} stops on our {routeName} Route
            </div>
            <div
              className="tdp2-se-card"
              role="button"
              tabIndex={0}
              onClick={() => setCustomiserOpen(true)}
              onKeyDown={e => { if (e.key === "Enter" || e.key === " ") setCustomiserOpen(true); }}
            >
              <div className="tdp2-se-rail" aria-hidden>
                <img src="/figma/train/card-rail.png" alt="" className="tdp2-se-rail-img" loading="lazy" />
                <img src="/figma/train/card-train.png" alt="" className="tdp2-se-train-img" loading="lazy" />
              </div>
              <div className="tdp2-se-body">
                <div className="tdp2-se-points">
                  <div className="tdp2-se-point">
                    <span className="tdp2-se-label">Trip Start</span>
                    <span className="tdp2-se-value">{data.motherItinerary[trip.start]}</span>
                  </div>
                  <span className="tdp2-se-connector" aria-hidden />
                  <div className="tdp2-se-point">
                    <span className="tdp2-se-label">Trip End</span>
                    <span className="tdp2-se-value">{data.motherItinerary[trip.end]}</span>
                  </div>
                </div>
                <div className="tdp2-se-cta-col">
                  <span className="tdp2-se-cta">
                    <span className="tdp2-se-cta-tag">{trip.nights}N - {trip.days}D</span>
                    <img src="/figma/train/tap-finger.svg" alt="" className="tdp2-se-cta-icon" aria-hidden loading="lazy" />
                    Explore More Options
                  </span>
                </div>
              </div>
            </div>
          </div>
          </>);
        })()}

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
      <section className="tdp2-package-type" aria-labelledby="tdp2-package-type-title">
        <h2 id="tdp2-package-type-title" className="tdp2-package-type-title">Package Type</h2>
        <div className="tdp2-package-type-options">
          {(["hotel", "hostel"] as PackageType[]).map(type => {
            const selected = packageType === type;
            return (
              <button
                key={type}
                type="button"
                className={`tdp2-package-type-btn${selected ? " active" : ""}`}
                aria-pressed={selected}
                onClick={() => setPackageType(type)}
              >
                {selected && (
                  <img
                    src="/figma/itin-highlights/package-type-check.svg"
                    alt=""
                    className="tdp2-package-type-check"
                    aria-hidden
                  />
                )}
                {type === "hotel" ? "Hotel" : "Hostel"}
              </button>
            );
          })}
        </div>
      </section>
      <div className="tdp2-separator"/>
      <div className="tdp2-services-strip" aria-live="polite">
        {packageServices(packageType, trip).map(service => (
          <div className="tdp2-inc-chip" key={service.label}>
            <img src={service.icon} alt="" className="tdp2-inc-chip-icon" aria-hidden loading="lazy" />
            <span className="tdp2-inc-chip-text">{service.label}</span>
          </div>
        ))}
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
        <ItineraryMapToggle
          checked={showItineraryMap}
          onChange={() => setShowItineraryMap(show => !show)}
        />
        {showItineraryMap && (
          <div className="tdp2-itin-map-wrap">
            <img
              src={data.mapImage}
              alt="Trip route map"
              className="tdp2-itin-map"
              loading="lazy"
            />
          </div>
        )}
        <div className="tdp2-itin-days">
          {data.itinerary.map((day, index) => (
            <React.Fragment key={index}>
              <DayCard
                day={day}
                index={index}
                transfer={transfers[index]}
                isOpen={openDays.has(index)}
                onToggle={() => setOpenDays(prev => {
                  const next = new Set(prev);
                  next.has(index) ? next.delete(index) : next.add(index);
                  return next;
                })}
              />
              {index < data.itinerary.length - 1 && <div className="tdp2-itin-day-divider" />}
            </React.Fragment>
          ))}
        </div>

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
                &#8377;{trip.priceLabel}
              </span>
              <div className="tdp2-sticky-discount">-10%</div>
            </div>
            <span className="tdp2-sticky-label">Starting price per person</span>
          </div>
          <button
            className="wo-cta tdp2-sticky-btn"
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
        duration={trip.durationLabel}
        price={trip.priceLabel}
      />

      <ItineraryCustomiser
        isOpen={customiserOpen}
        onClose={() => setCustomiserOpen(false)}
        title={data.title}
        thumb={data.heroImages[0]}
        stations={data.motherItinerary}
        nights={data.motherNights}
        basePrice={basePrice}
        initialSelection={tripSel}
        onSelectionChange={(start, end) => setTripSel({ start, end })}
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

    </div>
  );
}