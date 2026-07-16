import { Fragment } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SAMPLE_UPCOMING_TRIPS } from "../api/sampleData";
import FooterMessage from "../components/FooterMessage/FooterMessage";
import TribeStories from "../components/TribeStories";
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

export default function Destination() {
  const { slug = "Europe" } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const data = DEST_DATA[slug] ?? DEFAULT_DATA;
  const heroTitle = slug in DEST_DATA ? data.heroTitle : `Group trips to ${slug}`;

  const allTrips = SAMPLE_UPCOMING_TRIPS.flatMap((g) => g.tripsArray);
  const destTrips = allTrips.filter((t) =>
    t.slug.toLowerCase().includes(slug.toLowerCase())
  );
  const stripTrips = (destTrips.length > 0 ? destTrips : allTrips).slice(0, 6);
  const vmImgA = stripTrips[0]?.image ?? "/figma/trips/trip-1.jpg";
  const vmImgB = stripTrips[1]?.image ?? "/figma/trips/trip-2.jpg";

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

      {/* ── Dates-Costing-General (Figma 4620:23655) ── */}
      <section className="dp-info">
        {/* Breadcrumb */}
        <div className="dp-breadcrumb">
          <svg width="12" height="13" viewBox="0 0 12 13" fill="#757575" aria-hidden>
            <path d="M10 11.5H8V7.5H4V11.5H2V5.5L6 2.5L10 5.5V11.5ZM0 13H12V5L6 0L0 5V13Z"/>
          </svg>
          <span className="dp-bc-sep">{">"}</span>
          <span className="dp-bc-dest">{slug}</span>
        </div>

        {/* Tags + best month card */}
        <div className="dp-tags-card">
          <p className="dp-tags-text">{data.tags.join(" | ")}</p>
          <div className="dp-bestmonth-row">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4e4e4e" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
              <rect x="3" y="8" width="18" height="13" rx="2"/>
              <path d="M8 8V5a2 2 0 0 1 4 0v3M12 8V5a2 2 0 0 1 4 0v3"/>
              <line x1="3" y1="13" x2="21" y2="13"/>
            </svg>
            <span className="dp-bestmonth-text">Best month to travel: {data.bestMonth}</span>
          </div>
        </div>

        {/* Price + women row */}
        <div className="dp-info-bottom">
          <div className="dp-info-bottom-left">
            {/* Women pill */}
            <div className="dp-women-pill">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#c458fe" aria-hidden>
                <circle cx="12" cy="6" r="4"/>
                <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#c458fe" strokeWidth="2" fill="none"/>
                <circle cx="16" cy="8" r="3" fill="#faf1ff" stroke="#c458fe" strokeWidth="1.5"/>
                <path d="M14 8l1.5 1.5L18 6" stroke="#c458fe" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              </svg>
              <span className="dp-women-text">{data.womenPct} Women travellers have joined!</span>
            </div>
            {/* Discount + label */}
            <div className="dp-discount-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#575757" aria-hidden>
                <path d="M12.79 2.79 3.5 12.08A2 2 0 0 0 3 13.5V20a2 2 0 0 0 2 2h6.5a2 2 0 0 0 1.42-.59l9.29-9.29a2 2 0 0 0 0-2.83l-6.5-6.5a2 2 0 0 0-2.92 0z"/>
                <circle cx="7.5" cy="16.5" r="1.5" fill="#fff"/>
              </svg>
              <span className="dp-discount-text">Starting Price (per person):</span>
            </div>
          </div>
          <span className="dp-info-price">{data.startingPrice}</span>
        </div>
      </section>

      {/* Section divider */}
      <div className="dp-section-div" aria-hidden />

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
            <a
              key={trip.slug}
              className="up-card"
              href={`/trip/${trip.slug}`}
              style={{ textDecoration: "none" }}
            >
              <div className="up-card-img-wrap">
                {trip.image
                  ? <img className="up-card-img" src={trip.image} alt={trip.title} loading="lazy" />
                  : <div className="up-card-img-placeholder" />
                }
                <button
                  className="up-card-wishlist"
                  type="button"
                  aria-label="Add to wishlist"
                  onClick={(e) => e.preventDefault()}
                >
                  <img src="/figma/trips/wishlist-default.svg" width={30} height={28} alt="" aria-hidden loading="lazy" />
                </button>
              </div>
              <div className="up-card-info">
                <p className="up-card-title">{trip.title}</p>
                {trip.duration && (
                  <div className="up-card-dur-row">
                    <img src="/figma/trips/calendar-clock.svg" width={12} height={12} alt="" aria-hidden loading="lazy" />
                    <span className="up-card-dur">{trip.duration.nights}N/{trip.duration.days}D</span>
                  </div>
                )}
                {trip.batches && trip.batches.length > 0 && (
                  <p className="up-card-batches">
                    {trip.batches.slice(0, 2).map((b: string) => {
                      const d = new Date(b + "T00:00:00");
                      return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
                    }).join(", ")}
                    {trip.batches.length > 2 && <span className="up-card-batches-more">, +{trip.batches.length - 2} More Batches</span>}
                  </p>
                )}
                <p className="up-card-price">₹{Number(trip.startingPrice).toLocaleString("en-IN")}/-</p>
                <p className="up-card-per-person">Onwards per person</p>
              </div>
            </a>
          ))}
          {/* View More Trips card */}
          <a className="up-card up-view-more" href="/search" role="button">
            <div className="up-vm-img-wrap">
              <img className="up-vm-img up-vm-back" src={vmImgB} alt="" aria-hidden loading="lazy" />
              <img className="up-vm-img up-vm-front" src={vmImgA} alt="" aria-hidden loading="lazy" />
            </div>
            <p className="up-vm-label">View More Trips</p>
          </a>
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
          {allTrips.slice(0, 6).map((trip) => (
            <a
              key={trip.slug + "-upcoming"}
              className="up-card"
              href={`/trip/${trip.slug}`}
              style={{ textDecoration: "none" }}
            >
              <div className="up-card-img-wrap">
                {trip.image
                  ? <img className="up-card-img" src={trip.image} alt={trip.title} loading="lazy" />
                  : <div className="up-card-img-placeholder" />
                }
                <button
                  className="up-card-wishlist"
                  type="button"
                  aria-label="Add to wishlist"
                  onClick={(e) => e.preventDefault()}
                >
                  <img src="/figma/trips/wishlist-default.svg" width={30} height={28} alt="" aria-hidden loading="lazy" />
                </button>
              </div>
              <div className="up-card-info">
                <p className="up-card-title">{trip.title}</p>
                {trip.duration && (
                  <div className="up-card-dur-row">
                    <img src="/figma/trips/calendar-clock.svg" width={12} height={12} alt="" aria-hidden loading="lazy" />
                    <span className="up-card-dur">{trip.duration.nights}N/{trip.duration.days}D</span>
                  </div>
                )}
                {trip.batches && trip.batches.length > 0 && (
                  <p className="up-card-batches">
                    {trip.batches.slice(0, 2).map((b: string) => {
                      const d = new Date(b + "T00:00:00");
                      return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
                    }).join(", ")}
                    {trip.batches.length > 2 && <span className="up-card-batches-more">, +{trip.batches.length - 2} More Batches</span>}
                  </p>
                )}
                <p className="up-card-price">₹{Number(trip.startingPrice).toLocaleString("en-IN")}/-</p>
                <p className="up-card-per-person">Onwards per person</p>
              </div>
            </a>
          ))}
          <a className="up-card up-view-more" href="/search" role="button">
            <div className="up-vm-img-wrap">
              <img className="up-vm-img up-vm-back" src={vmImgB} alt="" aria-hidden loading="lazy" />
              <img className="up-vm-img up-vm-front" src={vmImgA} alt="" aria-hidden loading="lazy" />
            </div>
            <p className="up-vm-label">View More Trips</p>
          </a>
        </div>
      </section>

      <div className="dp-section-div" aria-hidden />
      {/* ── Customise Europe Trips ── */}
      <section className="up dp-trip-strip">
        <div className="up-header-row">
          <p className="up-title">Customise {slug} Trips</p>
          <button className="up-header-arrow" type="button" aria-label="View all trips">
            <img src="/figma/trips/arrow-right.svg" width={16} height={16} alt="" aria-hidden loading="lazy" />
          </button>
        </div>
        <div className="up-cards">
          {allTrips.slice(2, 8).map((trip) => (
            <a
              key={trip.slug + "-custom"}
              className="up-card"
              href={`/trip/${trip.slug}`}
              style={{ textDecoration: "none" }}
            >
              <div className="up-card-img-wrap">
                {trip.image
                  ? <img className="up-card-img" src={trip.image} alt={trip.title} loading="lazy" />
                  : <div className="up-card-img-placeholder" />
                }
                <button
                  className="up-card-wishlist"
                  type="button"
                  aria-label="Add to wishlist"
                  onClick={(e) => e.preventDefault()}
                >
                  <img src="/figma/trips/wishlist-default.svg" width={30} height={28} alt="" aria-hidden loading="lazy" />
                </button>
              </div>
              <div className="up-card-info">
                <p className="up-card-title">{trip.title}</p>
                {trip.duration && (
                  <div className="up-card-dur-row">
                    <img src="/figma/trips/calendar-clock.svg" width={12} height={12} alt="" aria-hidden loading="lazy" />
                    <span className="up-card-dur">{trip.duration.nights}N/{trip.duration.days}D</span>
                  </div>
                )}
                {trip.batches && trip.batches.length > 0 && (
                  <p className="up-card-batches">
                    {trip.batches.slice(0, 2).map((b: string) => {
                      const d = new Date(b + "T00:00:00");
                      return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
                    }).join(", ")}
                    {trip.batches.length > 2 && <span className="up-card-batches-more">, +{trip.batches.length - 2} More Batches</span>}
                  </p>
                )}
                <p className="up-card-price">₹{Number(trip.startingPrice).toLocaleString("en-IN")}/-</p>
                <p className="up-card-per-person">Onwards per person</p>
              </div>
            </a>
          ))}
          <a className="up-card up-view-more" href="/search" role="button">
            <div className="up-vm-img-wrap">
              <img className="up-vm-img up-vm-back" src={vmImgB} alt="" aria-hidden loading="lazy" />
              <img className="up-vm-img up-vm-front" src={vmImgA} alt="" aria-hidden loading="lazy" />
            </div>
            <p className="up-vm-label">View More Trips</p>
          </a>
        </div>
      </section>

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
      <FooterMessage />
      <Footer />
      <BottomNav />
    </div>
  );
}
