import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SAMPLE_UPCOMING_TRIPS } from "../api/sampleData";
import TripCard from "../components/TripCard";
import FooterMessage from "../components/FooterMessage/FooterMessage";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";
import "./Destination.css";

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

const EXP_TABS = ["First Timer", "Some Experience", "Seasoned Trekker"];

const TESTIMONIALS = [
  {
    name: "Shrutika Parab",
    rating: 5.0,
    text: "Thank you Team Wanderon for the amazing experience. Right from the point of making the booking to the end of the trip, everything was well organized and perfectly executed.",
    date: "May, 2023",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80&auto=format&fit=crop&facepad=2",
  },
  {
    name: "Rahul Sharma",
    rating: 5.0,
    text: "The itinerary was perfectly planned. WanderOn team was very supportive throughout the journey. Highly recommend to everyone who loves group travel.",
    date: "Jun, 2023",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&auto=format&fit=crop&facepad=2",
  },
  {
    name: "Priya Nair",
    rating: 5.0,
    text: "An absolutely wonderful trip! The group was amazing, the experiences were unique, and the WanderOn team took care of every little detail.",
    date: "Jul, 2023",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80&auto=format&fit=crop&facepad=2",
  },
];

export default function Destination() {
  const { slug = "Europe" } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [activeCity, setActiveCity] = useState(0);

  const data = DEST_DATA[slug] ?? DEFAULT_DATA;
  const heroTitle = slug in DEST_DATA ? data.heroTitle : `Group trips to ${slug}`;

  const allTrips = SAMPLE_UPCOMING_TRIPS.flatMap((g) => g.tripsArray);
  const destTrips = allTrips.filter((t) =>
    t.slug.toLowerCase().includes(slug.toLowerCase())
  );
  const trips = destTrips.length > 0 ? destTrips : allTrips.slice(0, 2);

  return (
    <div className="dp-page">

      {/* ── Hero ── */}
      <section className="dp-hero">
        <img src={data.heroImage} alt={heroTitle} className="dp-hero-img" />
        <div className="dp-hero-grad" />
        <div className="dp-hero-bottom">
          <div className="dp-hero-body">
            <h1 className="dp-hero-title">{heroTitle}</h1>
            <div className="dp-hero-line" />
          </div>
          <div className="dp-city-bar">
            <div className="dp-city-scroll">
              <div className="dp-city-label">
                <svg viewBox="0 0 12 16" width="10" height="13" fill="currentColor">
                  <path d="M6 0C2.69 0 0 2.69 0 6c0 4.5 6 10 6 10s6-5.5 6-10c0-3.31-2.69-6-6-6zm0 8.5A2.5 2.5 0 1 1 6 3.5a2.5 2.5 0 0 1 0 5z"/>
                </svg>
                <span>Destinations Covered</span>
              </div>
              {data.cities.map((city, i) => (
                <button
                  key={city}
                  className={`dp-city-tab${activeCity === i ? " dp-city-tab--active" : ""}`}
                  onClick={() => setActiveCity(i)}
                >
                  {city}
                </button>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── Is this destination for me? ── */}
      <section className="dp-info">
        <h2 className="dp-info-heading">Is this destination for me?</h2>
        <p className="dp-info-tags">{data.tags.join(" | ")}</p>
        <div className="dp-info-sep" />
        <div className="dp-attrs">
          <div className="dp-attr-row">
            <span className="dp-attr-label">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#666" strokeWidth="1.8" strokeLinecap="round">
                <path d="M12 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM5 22c0-4.4 3.1-7 7-7s7 2.6 7 7" />
              </svg>
              Physical Efforts
            </span>
            <span className="dp-attr-val">{data.physicalEffort}</span>
          </div>
          <div className="dp-attr-row">
            <span className="dp-attr-label">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#666" strokeWidth="1.8" strokeLinecap="round">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="16" y1="2" x2="16" y2="6" />
              </svg>
              Trip Type
            </span>
            <span className="dp-attr-val">{data.tripType}</span>
          </div>
        </div>
        <div className="dp-price-row">
          <span className="dp-price-label">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#01afd1" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v10M9 9h5a2 2 0 0 1 0 4H9" />
            </svg>
            Starting Price (per person):
          </span>
          <span className="dp-price-val">{data.startingPrice}</span>
        </div>
      </section>

      {/* ── Upcoming trips ── */}
      <section className="dp-trips">
        <div className="dp-trips-head">
          <h2 className="dp-trips-title">{slug} Upcoming Group trips</h2>
          <p className="dp-trips-sub">{data.tripCount}</p>
        </div>
        <div className="dp-exp-tabs">
          {EXP_TABS.map((tab, i) => (
            <button
              key={tab}
              className={`dp-exp-tab${i === activeTab ? " dp-exp-tab--active" : ""}`}
              onClick={() => setActiveTab(i)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="dp-trips-list">
          {trips.map((trip) => (
            <TripCard key={trip.slug} trip={trip} theme="teal" fullWidth />
          ))}
        </div>
        <button className="dp-view-all">View All Trips</button>
      </section>

      {/* ── Customise CTA ── */}
      <section className="dp-customise">
        <span className="dp-cust-eyebrow">CUSTOMISE {slug.toUpperCase()} TRIPS</span>
        <h2 className="dp-cust-title">Book travel month and<br />date of your choice</h2>
        <button className="dp-cust-btn">Contact For Price Details</button>
      </section>

      {/* ── Stats + related ── */}
      <section className="dp-stats">
        <div className="dp-stats-row">
          <div className="dp-stat">
            <span className="dp-stat-women">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="#c06428">
                <path d="M12 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM5 22c0-4.4 3.1-7 7-7s7 2.6 7 7" />
              </svg>
              {data.womenPct} Women travellers
            </span>
          </div>
          <div className="dp-stat-divider" />
          <div className="dp-stat">
            <p className="dp-stat-batch">{data.upcomingBatches}</p>
            <p className="dp-stat-month">Best month to travel: {data.bestMonth}</p>
          </div>
        </div>
        <div className="dp-related">
          <span className="dp-related-label">You may also like</span>
          <button
            className="dp-related-card"
            onClick={() => navigate(`/destination/${data.relatedDest}`)}
          >
            <div className="dp-related-thumb" />
            <div className="dp-related-info">
              <span className="dp-related-name">{data.relatedDest}</span>
              <span className="dp-related-date">From {data.relatedDate}</span>
            </div>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="dp-testimonials">
        <div className="dp-test-head">
          <span className="dp-test-diamond">◆</span>
          <span className="dp-test-label">TESTIMONIALS</span>
          <span className="dp-test-diamond">◆</span>
        </div>
        <div className="dp-rating">
          <svg viewBox="0 0 488 512" width="18" height="18">
            <path fill="#4285F4" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
          </svg>
          <svg viewBox="0 0 20 20" width="16" height="16" fill="#f5a623">
            <path d="M10 1l2.4 7.4H20l-6.2 4.5 2.4 7.4L10 16l-6.2 4.3 2.4-7.4L0 8.4h7.6z" />
          </svg>
          <span className="dp-rating-score">4.9 (6626 reviews)</span>
        </div>
        <p className="dp-test-sub">Stories of our travellers</p>
        <div className="dp-test-scroll">
          {TESTIMONIALS.map((t) => (
            <div className="dp-test-card" key={t.name}>
              <div className="dp-test-card-head">
                <img src={t.avatar} alt={t.name} className="dp-test-avatar" />
                <div>
                  <p className="dp-test-name">{t.name}</p>
                  <div className="dp-test-stars">
                    {Array.from({ length: Math.floor(t.rating) }).map((_, i) => (
                      <svg key={i} viewBox="0 0 20 20" width="13" height="13" fill="#f5a623">
                        <path d="M10 1l2.4 7.4H20l-6.2 4.5 2.4 7.4L10 16l-6.2 4.3 2.4-7.4L0 8.4h7.6z" />
                      </svg>
                    ))}
                    <span className="dp-test-rating">{t.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <p className="dp-test-text">{t.text}</p>
              <div className="dp-test-footer">
                <span className="dp-test-date">{t.date}</span>
                <button className="dp-test-read">Read More</button>
              </div>
            </div>
          ))}
        </div>
        <div className="dp-test-dots">
          {TESTIMONIALS.map((_, i) => (
            <span key={i} className={`dp-test-dot${i === 0 ? " dp-test-dot--active" : ""}`} />
          ))}
        </div>
      </section>

      {/* ── Culture & Local Voices ── */}
      <section className="dp-culture">
        <h2 className="dp-culture-title">Culture and Local Voices</h2>
        <div className="dp-culture-photos">
          <div className="dp-polaroid">
            <div
              className="dp-polaroid-img"
              style={{ backgroundImage: `url(${data.heroImage.replace("w=900", "w=400")})` }}
            />
            <p className="dp-polaroid-caption">
              For millions of travellers, {slug} is the doorway to a world-class travel experience.
            </p>
          </div>
          <div className="dp-polaroid dp-polaroid--tilt">
            <div
              className="dp-polaroid-img"
              style={{ backgroundImage: `url(https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=400&q=70&auto=format&fit=crop)` }}
            />
            <p className="dp-polaroid-caption">
              Travellers from across the globe discover hidden gems and local culture here.
            </p>
          </div>
        </div>
      </section>

      <FooterMessage />
      <Footer />
      <BottomNav />
    </div>
  );
}
