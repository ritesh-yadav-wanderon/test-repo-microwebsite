import { Fragment, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getListingTrips } from "../api";
import type { Trip } from "../types";
import { TripCardItem, TripCardShimmer, ViewMoreCard } from "../components/UpcomingTrips/TripCardItem";
import FooterMessage from "../components/FooterMessage/FooterMessage";
import TribeStories from "../components/TribeStories";
import QueryBanner from "../components/QueryBanner";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";
import PlotBanner from "../components/PlotBanner";
import PhotoStack from "../components/PhotoStack/PhotoStack";
import "./Destination.css";
import SiteHeader2 from "../components/SiteHeader2";
import "../components/UpcomingTrips/UpcomingTrips.css";

interface DestData {
  heroImage: string;
  heroTitle: string;
  travelScore: number;
  tags: string[];
  physicalEffort: string;
  tripType: string;
  startingPrice: string;
  tripCount: string;
  womenPct: string;
  upcomingBatches: string;
  bestMonth: string;
  relatedDest: string;
  relatedDate: string;
  cities: string[];
}

const DEST_DATA: Record<string, DestData> = {
  Europe: {
    heroImage: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=900&q=80&auto=format&fit=crop",
    heroTitle: "Group trips to Europe",
    travelScore: 4.5,
    tags: ["Scenic Rail Journeys", "Party Circuits", "Slow Travel Escapes"],
    physicalEffort: "Moderate",
    tripType: "Active, Party",
    startingPrice: "₹98,990/-",
    tripCount: "4 Trips covering your bucket list",
    womenPct: "60%+",
    upcomingBatches: "38 Upcoming Batches",
    bestMonth: "Apr-Oct",
    relatedDest: "Vietnam",
    relatedDate: "Aug 26",
    cities: ["Paris", "Amsterdam", "Prague", "Vienna", "Budapest"],
  },
  Ladakh: {
    heroImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900&q=80&auto=format&fit=crop",
    heroTitle: "Group trips to Ladakh",
    travelScore: 4.8,
    tags: ["High Altitude Treks", "Bike Expeditions", "Mountain Escapes"],
    physicalEffort: "Strenuous",
    tripType: "Adventure, Trek",
    startingPrice: "₹32,999/-",
    tripCount: "6 Trips in season",
    womenPct: "45%+",
    upcomingBatches: "24 Upcoming Batches",
    bestMonth: "Jun-Sep",
    relatedDest: "Manali",
    relatedDate: "Jul 26",
    cities: ["Leh", "Nubra", "Pangong", "Khardung La", "Zanskar"],
  },
  Bali: {
    heroImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&q=80&auto=format&fit=crop",
    heroTitle: "Group trips to Bali",
    travelScore: 4.7,
    tags: ["Beach Escapes", "Temple Tours", "Wellness Retreats"],
    physicalEffort: "Easy",
    tripType: "Leisure, Wellness",
    startingPrice: "₹38,999/-",
    tripCount: "5 Trips covering your bucket list",
    womenPct: "55%+",
    upcomingBatches: "18 Upcoming Batches",
    bestMonth: "Mar-Nov",
    relatedDest: "Thailand",
    relatedDate: "Sep 26",
    cities: ["Kuta", "Ubud", "Nusa Penida", "Seminyak", "Uluwatu"],
  },
  Manali: {
    heroImage: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=900&q=80&auto=format&fit=crop",
    heroTitle: "Group trips to Manali",
    travelScore: 4.6,
    tags: ["Snow Treks", "Adventure Sports", "Mountain Camping"],
    physicalEffort: "Moderate",
    tripType: "Adventure, Weekend",
    startingPrice: "₹12,999/-",
    tripCount: "8 Trips in season",
    womenPct: "50%+",
    upcomingBatches: "32 Upcoming Batches",
    bestMonth: "Dec-Feb, Jun-Sep",
    relatedDest: "Ladakh",
    relatedDate: "Jul 26",
    cities: ["Manali", "Solang", "Sissu", "Kasol", "Kheerganga"],
  },
  Rajasthan: {
    heroImage: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=900&q=80&auto=format&fit=crop",
    heroTitle: "Group trips to Rajasthan",
    travelScore: 4.6,
    tags: ["Heritage Forts", "Desert Safaris", "Royal Palaces"],
    physicalEffort: "Easy",
    tripType: "Culture, Luxury",
    startingPrice: "₹14,999/-",
    tripCount: "6 Trips covering your bucket list",
    womenPct: "52%+",
    upcomingBatches: "20 Upcoming Batches",
    bestMonth: "Oct-Mar",
    relatedDest: "Kerala",
    relatedDate: "Nov 26",
    cities: ["Jaipur", "Jodhpur", "Jaisalmer", "Udaipur", "Bikaner"],
  },
  Kerala: {
    heroImage: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=900&q=80&auto=format&fit=crop",
    heroTitle: "Group trips to Kerala",
    travelScore: 4.7,
    tags: ["Backwater Cruises", "Ayurveda Retreats", "Spice Trails"],
    physicalEffort: "Easy",
    tripType: "Wellness, Culture",
    startingPrice: "₹16,999/-",
    tripCount: "5 Trips covering your bucket list",
    womenPct: "58%+",
    upcomingBatches: "15 Upcoming Batches",
    bestMonth: "Sep-Mar",
    relatedDest: "Goa",
    relatedDate: "Oct 26",
    cities: ["Kochi", "Alleppey", "Munnar", "Wayanad", "Kovalam"],
  },
  Japan: {
    heroImage: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=900&q=80&auto=format&fit=crop",
    heroTitle: "Group trips to Japan",
    travelScore: 4.8,
    tags: ["Cherry Blossoms", "Anime Culture", "Ancient Temples"],
    physicalEffort: "Moderate",
    tripType: "Culture, Festival",
    startingPrice: "₹1,29,990/-",
    tripCount: "4 Trips covering your bucket list",
    womenPct: "62%+",
    upcomingBatches: "12 Upcoming Batches",
    bestMonth: "Mar-May, Oct-Nov",
    relatedDest: "Thailand",
    relatedDate: "Aug 26",
    cities: ["Tokyo", "Osaka", "Kyoto", "Hiroshima", "Nikko"],
  },
  Thailand: {
    heroImage: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=900&q=80&auto=format&fit=crop",
    heroTitle: "Group trips to Thailand",
    travelScore: 4.6,
    tags: ["Temple Circuits", "Island Hopping", "Street Food Tours"],
    physicalEffort: "Easy",
    tripType: "Wellness, Festival",
    startingPrice: "₹49,990/-",
    tripCount: "6 Trips covering your bucket list",
    womenPct: "57%+",
    upcomingBatches: "22 Upcoming Batches",
    bestMonth: "Nov-Feb",
    relatedDest: "Bali",
    relatedDate: "Sep 26",
    cities: ["Bangkok", "Phuket", "Chiang Mai", "Koh Samui", "Krabi"],
  },
  Egypt: {
    heroImage: "https://images.unsplash.com/photo-1539768942893-daf525e43028?w=900&q=80&auto=format&fit=crop",
    heroTitle: "Group trips to Egypt",
    travelScore: 4.5,
    tags: ["Pyramid Tours", "Nile Cruises", "Desert Adventures"],
    physicalEffort: "Moderate",
    tripType: "Culture, Adventure",
    startingPrice: "₹89,990/-",
    tripCount: "4 Trips covering your bucket list",
    womenPct: "48%+",
    upcomingBatches: "10 Upcoming Batches",
    bestMonth: "Oct-Apr",
    relatedDest: "Dubai",
    relatedDate: "Oct 26",
    cities: ["Cairo", "Luxor", "Aswan", "Alexandria", "Hurghada"],
  },
  Dubai: {
    heroImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&q=80&auto=format&fit=crop",
    heroTitle: "Group trips to Dubai",
    travelScore: 4.5,
    tags: ["Luxury Experiences", "Desert Safaris", "Skyscraper Views"],
    physicalEffort: "Easy",
    tripType: "Luxury, Weekend",
    startingPrice: "₹59,990/-",
    tripCount: "5 Trips covering your bucket list",
    womenPct: "50%+",
    upcomingBatches: "16 Upcoming Batches",
    bestMonth: "Nov-Mar",
    relatedDest: "Egypt",
    relatedDate: "Oct 26",
    cities: ["Dubai", "Abu Dhabi", "Sharjah", "Fujairah"],
  },
  Vietnam: {
    heroImage: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=900&q=80&auto=format&fit=crop",
    heroTitle: "Group trips to Vietnam",
    travelScore: 4.7,
    tags: ["Ha Long Bay", "Ancient Towns", "Street Food"],
    physicalEffort: "Moderate",
    tripType: "Culture, Adventure",
    startingPrice: "₹44,990/-",
    tripCount: "5 Trips covering your bucket list",
    womenPct: "55%+",
    upcomingBatches: "14 Upcoming Batches",
    bestMonth: "Feb-Apr, Aug-Oct",
    relatedDest: "Thailand",
    relatedDate: "Oct 26",
    cities: ["Hanoi", "Ho Chi Minh", "Hoi An", "Da Nang", "Ha Long"],
  },
  Rishikesh: {
    heroImage: "https://images.unsplash.com/photo-1544825996-e0cc2d74df49?w=900&q=80&auto=format&fit=crop",
    heroTitle: "Group trips to Rishikesh",
    travelScore: 4.6,
    tags: ["River Rafting", "Yoga Retreats", "Bungee Jumping"],
    physicalEffort: "Moderate",
    tripType: "Adventure, Wellness",
    startingPrice: "₹8,999/-",
    tripCount: "8 Weekend trips",
    womenPct: "54%+",
    upcomingBatches: "28 Upcoming Batches",
    bestMonth: "Feb-Jun, Sep-Nov",
    relatedDest: "Manali",
    relatedDate: "Aug 26",
    cities: ["Rishikesh", "Haridwar", "Mussoorie", "Tehri", "Chopta"],
  },
  Goa: {
    heroImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900&q=80&auto=format&fit=crop",
    heroTitle: "Group trips to Goa",
    travelScore: 4.5,
    tags: ["Beach Parties", "Portuguese Heritage", "Water Sports"],
    physicalEffort: "Easy",
    tripType: "Weekend, Wellness",
    startingPrice: "₹9,999/-",
    tripCount: "6 Weekend trips",
    womenPct: "56%+",
    upcomingBatches: "24 Upcoming Batches",
    bestMonth: "Nov-Feb",
    relatedDest: "Kerala",
    relatedDate: "Nov 26",
    cities: ["North Goa", "South Goa", "Palolem", "Dudhsagar"],
  },
  Sikkim: {
    heroImage: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=900&q=80&auto=format&fit=crop",
    heroTitle: "Group trips to Sikkim",
    travelScore: 4.7,
    tags: ["Himalayan Views", "Buddhist Monasteries", "Tea Gardens"],
    physicalEffort: "Moderate",
    tripType: "Adventure, Festival",
    startingPrice: "₹14,999/-",
    tripCount: "4 Trips in season",
    womenPct: "51%+",
    upcomingBatches: "12 Upcoming Batches",
    bestMonth: "Mar-May, Oct-Dec",
    relatedDest: "Ladakh",
    relatedDate: "Jul 26",
    cities: ["Gangtok", "Lachung", "Pelling", "Darjeeling", "Tsomgo"],
  },
};

const DEFAULT_DATA: DestData = {
  heroImage: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=900&q=80&auto=format&fit=crop",
  heroTitle: "Group trips",
  travelScore: 4.5,
  tags: ["Adventure Trips", "Cultural Tours", "Weekend Escapes"],
  physicalEffort: "Moderate",
  tripType: "Mixed",
  startingPrice: "₹14,999/-",
  tripCount: "Multiple trips available",
  womenPct: "50%+",
  upcomingBatches: "12 Upcoming Batches",
  bestMonth: "Year-round",
  relatedDest: "Bali",
  relatedDate: "Aug 26",
  cities: ["Adventure", "Wellness", "Culture", "Nature"],
};



/** Fixed anchor-bar cities matching the Figma hero (node 4518:26804). */
const HERO_CITIES = ["Paris", "Amsterdam", "Prague", "Vienna", "Portugal", "Spain", "Italy"];

/** Build destination-branded "customise" cards for destinations that have no
 * scheduled trips, so we never fall back to showing other destinations' trips. */
function buildCustomiseTrips(slug: string, data: DestData): Trip[] {
  const cities = data.cities ?? [];
  const durations = [
    { nights: 4, days: 5 },
    { nights: 5, days: 6 },
    { nights: 6, days: 7 },
  ];
  return durations.map((duration, i) => ({
    slug,
    title: cities[i]
      ? `Customise your ${slug} Trip: ${cities[i]} & more`
      : `Customise your ${slug} Trip`,
    image: data.heroImage,
    startingPrice: data.startingPrice,
    duration,
    batches: [],
  }));
}

/** Whether a trip belongs to the given destination (matches slug, title,
 * itinerary cities or the destinations array). */
function tripMatchesDestination(t: Trip, dest: string): boolean {
  const d = dest.trim().toLowerCase();
  if (!d) return true;
  if (t.slug.toLowerCase().includes(d)) return true;
  if (t.title.toLowerCase().includes(d)) return true;
  if ((t.skeletonItinerary ?? []).some((c) => c.toLowerCase().includes(d))) return true;
  if ((t.destinations ?? []).some((x) =>
    x.title.toLowerCase().includes(d) || x.slug.toLowerCase().includes(d)
  )) return true;
  return false;
}

export default function Destination() {
  const { slug = "Europe" } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const data = DEST_DATA[slug] ?? DEFAULT_DATA;
  const heroTitle = slug in DEST_DATA ? data.heroTitle : `Group trips to ${slug}`;

  // Trips come from the same source as the listing page (real API, with a
  // built-in sample fallback) so destination pages and the listing agree.
  const [allTrips, setAllTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getListingTrips().then((trips) => {
      if (!cancelled) { setAllTrips(trips); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, []);

  const destTrips = allTrips.filter((t) => tripMatchesDestination(t, slug));
  // Destinations with no scheduled trips only show the "Customise" section.
  const hasUpcoming = destTrips.length > 0;
  const stripTrips = destTrips.slice(0, 6);
  // Customise strip: real destination trips when available, otherwise
  // destination-branded synthetic cards (never other destinations' trips).
  const moreHref = `/search?destination=${encodeURIComponent(slug)}`;
  const customiseTrips = hasUpcoming ? destTrips.slice(0, 6) : buildCustomiseTrips(slug, data);
  const customiseHref = hasUpcoming ? undefined : moreHref;
  const vmSource = hasUpcoming ? stripTrips : customiseTrips;
  const vmImgA = vmSource[0]?.image ?? "/figma/trips/trip-1.jpg";
  const vmImgB = vmSource[1]?.image ?? "/figma/trips/trip-2.jpg";

  return (
    <div className="dp-page">
      <SiteHeader2 destination={slug} date={data.relatedDate} showBack onBack={() => navigate(-1)} />
      {/* ── Hero (Figma 4518:26793) ── */}
      <section className="dp-hero">
        <img src="/figma/destination/hero.jpg" alt={heroTitle} className="dp-hero-img" loading="lazy" />
        <div className="dp-hero-grad" />
        <div className="dp-hero-bottom">
          <div className="dp-hero-body">
            <h1 className="dp-hero-title">{heroTitle}</h1>
            <div className="dp-hero-line" />
          </div>
          {/* Scrollable city dots bar (Figma 4518:26804) */}
          <div className="dp-city-bar">
            <div className="dp-city-scroll">
              {HERO_CITIES.map((city, i) => (
                <Fragment key={city}>
                  {i > 0 && <span className="dp-city-dot" aria-hidden />}
                  <span className="dp-city-name">{city}</span>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Dates-Costing-General (Figma 4620:23656) ── */}
      <section className="dp-info">
        {/* Breadcrumb */}
        <div className="dp-breadcrumb">
          <img src="/figma/destination/icon-home.svg" alt="" className="dp-bc-home" aria-hidden />
          <span className="dp-bc-sep">{">"}</span>
          <span className="dp-bc-dest">{slug}</span>
        </div>

        {/* Info card + women strip */}
        <div className="dp-info-card-wrap">
          <div className="dp-info-card">
            <p className="dp-tags-text">{data.tags.join(" | ")}</p>
            <div className="dp-bestmonth-row">
              <img src="/figma/destination/icon-bestmonth.svg" alt="" className="dp-info-ico" aria-hidden />
              <span className="dp-bestmonth-text">Best month to travel: {data.bestMonth}</span>
            </div>
            <div className="dp-price-row">
              <div className="dp-price-left">
                <img src="/figma/destination/icon-price.svg" alt="" className="dp-info-ico" aria-hidden />
                <span className="dp-discount-text">Starting Price (per person):</span>
              </div>
              <span className="dp-info-price">{data.startingPrice}</span>
            </div>
          </div>
          <div className="dp-women-strip">
            <img src="/figma/destination/icon-women.svg" alt="" className="dp-women-ico" aria-hidden />
            <span className="dp-women-text">{data.womenPct} Women travellers have joined!</span>
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div className="dp-section-div" aria-hidden />

      {loading ? (
        <section className="up dp-trip-strip">
          <div className="up-header-row">
            <p className="up-title">Upcoming Group Trips</p>
          </div>
          <div className="up-cards">
            {[0, 1, 2].map((i) => <TripCardShimmer key={i} />)}
          </div>
        </section>
      ) : (
      <>
      {hasUpcoming && (
        <>
          {/* ── Best Summer Deals — horizontal trip strip (Figma 4518:27539) ── */}
          <section className="up dp-trip-strip">
            <div className="up-header-row">
              <p className="up-title">Best Summer Deals</p>
              <button className="up-header-arrow" type="button" aria-label="View all trips">
                <img src="/figma/trips/arrow-right.svg" width={16} height={16} alt="" aria-hidden loading="lazy" />
              </button>
            </div>
            <div className="up-cards">
              {stripTrips.map((trip) => (
                <TripCardItem key={trip.slug} trip={trip} />
              ))}
              <ViewMoreCard a={vmImgA} b={vmImgB} to={moreHref} />
            </div>
          </section>

          <div className="dp-section-div" aria-hidden />
          {/* ── Upcoming Group Trips ── */}
          <section className="up dp-trip-strip">
            <div className="up-header-row">
              <p className="up-title">Upcoming Group Trips</p>
              <button className="up-header-arrow" type="button" aria-label="View all trips">
                <img src="/figma/trips/arrow-right.svg" width={16} height={16} alt="" aria-hidden loading="lazy" />
              </button>
            </div>
            <div className="up-cards">
              {stripTrips.map((trip) => (
                <TripCardItem key={trip.slug + "-upcoming"} trip={trip} />
              ))}
              <ViewMoreCard a={vmImgA} b={vmImgB} to={moreHref} />
            </div>
          </section>

          <div className="dp-section-div" aria-hidden />
        </>
      )}
      {/* ── Customise Europe Trips ── */}
      <section className="up dp-trip-strip">
        <div className="up-header-row">
          <p className="up-title">Customise {slug} Trips</p>
          <button className="up-header-arrow" type="button" aria-label="View all trips">
            <img src="/figma/trips/arrow-right.svg" width={16} height={16} alt="" aria-hidden loading="lazy" />
          </button>
        </div>
        <div className="up-cards">
          {customiseTrips.map((trip, i) => (
            <TripCardItem key={trip.slug + "-custom-" + i} trip={trip} batchesText="Date of your choice" href={customiseHref} />
          ))}
          <ViewMoreCard a={vmImgA} b={vmImgB} to={moreHref} />
        </div>
      </section>
      </>
      )}

      <div className="dp-section-div" aria-hidden />
      <TribeStories />

      <div className="dp-section-div" aria-hidden />
      {/* ── Cultural and Local Voices (Figma 5390:5939) ── */}
      <section className="dp-culture">
        <div className="dp-culture-head">
          <h2 className="dp-culture-title">Cultural and Local Voices</h2>
          <p className="dp-culture-sub">Every city a new rhythm, every night a new reason to celebrate.</p>
        </div>

        {/* Top row: two polaroids — left straight, right tilted with stamp */}
        <div className="dp-culture-row">
          <figure className="dp-pol dp-pol--left">
            <img
              className="dp-pol-flat"
              src="/figma/culture/image-1.png"
              alt="Germany — raise your stein with a thousand strangers like old friends"
              loading="lazy"
            />
          </figure>

          <figure className="dp-pol dp-pol--right">
            <img
              className="dp-pol-flat"
              src="/figma/culture/image-2.png"
              alt="Amsterdam — canals, bicycles, and golden-hour gables"
              loading="lazy"
            />
          </figure>
        </div>

        {/* Center: La Tomatina polaroid */}
        <figure className="dp-pol dp-pol--center">
          <img
            className="dp-pol-flat"
            src="/figma/culture/image-3.png"
            alt="La Tomatina — one town, forty tons of tomatoes, zero rules"
            loading="lazy"
          />
        </figure>

        {/* Quote */}
        <p className="dp-culture-quote">Europe isn&apos;t meant to be watched from the sidelines. From Munich&apos;s beer halls to Amsterdam&apos;s canals to a tomato-soaked street in Buñol, this is a continent best lived out loud.</p>

        {/* Interactive photo stack (kept — Figma 4518:26092) */}
        <div className="dp-culture-stack">
          <PhotoStack />
        </div>
      </section>

      <PlotBanner />

      {/* ── Enquire Now (QueryBanner — same as homepage) ── */}
      <div className="dp-section-div" aria-hidden />
      <QueryBanner />

      <FooterMessage />
      <Footer />
      <BottomNav />
    </div>
  );
}
