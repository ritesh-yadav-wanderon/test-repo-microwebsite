import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./BurgerMenu.css";

interface BurgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const M = "/figma/menu/";

const NAV_ITEMS = [
  { label: "Find your trip",            icon: `${M}icon-find-trip.svg`,    to: "/search",        subView: null },
  { label: "Destinations",             icon: `${M}icon-destinations.svg`, to: null,             subView: "destinations" as const },
  { label: "Upcoming Community Trips", icon: `${M}icon-community.svg`,    to: "/trips",         subView: null },
  { label: "Bike Trips",               icon: `${M}icon-bike.svg`,         to: null,             subView: "bike-trips" as const },
  { label: "Categories",              icon: `${M}icon-categories.svg`,   to: null,             subView: "categories" as const },
  { label: "Events",                  icon: `${M}icon-events.svg`,       to: "/events",        subView: null },
  { label: "MICE",                    icon: `${M}icon-mice.svg`,         to: "/mice",          subView: null },
  { label: "Blogs",                   icon: `${M}icon-blogs.svg`,        to: "/blog",          subView: null },
];

const BIKE_ITEMS = [
  { label: "Ladakh Bike Trips",   trending: true  },
  { label: "Spiti Bike Trips",    trending: true  },
  { label: "Meghalaya Bike Trip", trending: false },
  { label: "Bhutan Bike Trip",    trending: false },
  { label: "All Bike Trips",      trending: false },
];

const ABOUT_GROUP1 = [
  { label: "About Us",                    to: "/about-us" },
  { label: "How it works",               to: "/how-it-works" },
  { label: "Cancellation Policy",        to: "/cancellation-policy" },
  { label: "Privacy Policy",            to: "/privacy-policy" },
  { label: "Customer Success & Support", to: "/support" },
  { label: "Investor Relations",         to: "/investor-relations" },
];
const ABOUT_GROUP2 = [
  { label: "Careers", to: "/careers" },
];

const CATEGORY_GROUP1 = [
  { label: "Weekend Trips",    slug: "weekend-trips" },
  { label: "Adventure",        slug: "adventure" },
  { label: "Luxury",           slug: "luxury" },
  { label: "Culture",          slug: "culture" },
  { label: "Festivals",        slug: "festivals" },
  { label: "Wellness",         slug: "wellness" },
  { label: "Romantic Escapes", slug: "romantic-escapes" },
];
const CATEGORY_GROUP2 = [
  { label: "Friends", slug: "friends" },
  { label: "Family",  slug: "family" },
  { label: "Solo",    slug: "solo" },
  { label: "Couple",  slug: "couple" },
];

interface DestItem { label: string; slug: string; trending?: boolean; }
interface DestRegion { label: string; slug: string; allLabel: string; items: DestItem[]; seeMore?: boolean; }

const DEST_REGIONS: DestRegion[] = [
  {
    label: "India", slug: "india", allLabel: "All trips in India", seeMore: true,
    items: [
      { label: "Ladakh",            slug: "ladakh",            trending: true  },
      { label: "Spiti",             slug: "spiti",             trending: true  },
      { label: "Meghalaya",         slug: "meghalaya"                          },
      { label: "Kashmir",           slug: "kashmir"                            },
      { label: "Sikkim",            slug: "sikkim"                             },
      { label: "Himachal Pradesh",  slug: "himachal-pradesh"                   },
      { label: "Uttarakhand",       slug: "uttarakhand"                        },
      { label: "Arunachal Pradesh", slug: "arunachal-pradesh"                  },
      { label: "Andaman",           slug: "andaman"                            },
      { label: "Rajasthan",         slug: "rajasthan"                          },
      { label: "Kerala",            slug: "kerala"                             },
      { label: "Nagaland",          slug: "nagaland"                           },
    ],
  },
  {
    label: "Europe", slug: "europe", allLabel: "All trips to Europe (multiple destinations)",
    items: [
      { label: "Iceland",     slug: "iceland",     trending: true },
      { label: "Spain",       slug: "spain",       trending: true },
      { label: "France",      slug: "france"                      },
      { label: "Switzerland", slug: "switzerland"                 },
      { label: "Georgia",     slug: "georgia"                     },
    ],
  },
  {
    label: "Asia", slug: "asia", allLabel: "All trips to Asia",
    items: [
      { label: "Japan",      slug: "japan",      trending: true },
      { label: "Bhutan",     slug: "bhutan",     trending: true },
      { label: "Sri Lanka",  slug: "sri-lanka"                  },
      { label: "Kazakhstan", slug: "kazakhstan"                  },
      { label: "Maldives",   slug: "maldives"                   },
      { label: "Malaysia",   slug: "malaysia"                   },
      { label: "Mauritius",  slug: "mauritius"                  },
    ],
  },
  {
    label: "South East Asia", slug: "south-east-asia", allLabel: "All trips to South East Asia",
    items: [
      { label: "Bali",        slug: "bali",        trending: true },
      { label: "Thailand",    slug: "thailand",    trending: true },
      { label: "Vietnam",     slug: "vietnam",     trending: true },
      { label: "Philippines", slug: "philippines"                 },
    ],
  },
  {
    label: "Middle East", slug: "middle-east", allLabel: "All trips to Middle East",
    items: [
      { label: "Turkey", slug: "turkey", trending: true },
      { label: "Dubai",  slug: "dubai",  trending: true },
    ],
  },
  {
    label: "Africa", slug: "africa", allLabel: "All trips to Africa",
    items: [
      { label: "Kenya",        slug: "kenya",        trending: true },
      { label: "South Africa", slug: "south-africa", trending: true },
    ],
  },
  {
    label: "Oceania", slug: "oceania", allLabel: "All trips to Oceania",
    items: [
      { label: "Australia",    slug: "australia",    trending: true },
      { label: "New Zealand",  slug: "new-zealand",  trending: true },
    ],
  },
];

type SubView = "bike-trips" | "about" | "categories" | "destinations" | null;

export default function BurgerMenu({ isOpen, onClose }: BurgerMenuProps) {
  const navigate = useNavigate();
  const [hasOpened, setHasOpened] = useState(false);
  const [subView, setSubView] = useState<SubView>(null);
  const [expandedRegion, setExpandedRegion] = useState<string>("india");

  useEffect(() => {
    if (isOpen) setHasOpened(true);
    if (!isOpen) {
      setSubView(null);
      setExpandedRegion("india");
    }
  }, [isOpen]);

  if (!hasOpened) return null;

  function go(to: string) {
    onClose();
    navigate(to);
  }

  return (
    <div
      className={`bm-overlay${isOpen ? " bm-overlay--open" : ""}`}
      aria-hidden={!isOpen}
    >
      <div
        className={`bm-panel${isOpen ? " bm-panel--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >

        {/* Header */}
        <div className="bm-header">
          <button className="bm-close" type="button" aria-label="Close menu" onClick={onClose}>
            <img src={`${M}icon-close.svg`} width={30} height={30} alt="" aria-hidden />
          </button>
        </div>

        {/* Nav list */}
        <div className="bm-content">
          <div className="bm-nav-group">
            {NAV_ITEMS.map((item) =>
              item.subView ? (
                <button
                  key={item.label}
                  type="button"
                  className="bm-item"
                  onClick={() => setSubView(item.subView as SubView)}
                >
                  <span className="bm-item-left">
                    <img src={item.icon} width={16} height={16} alt="" aria-hidden />
                    <span className="bm-item-label">{item.label}</span>
                  </span>
                  <img src={`${M}icon-arrow-forward.svg`} width={16} height={16} alt="" aria-hidden />
                </button>
              ) : (
                <button
                  key={item.label}
                  type="button"
                  className="bm-item"
                  onClick={() => go(item.to!)}
                >
                  <span className="bm-item-left">
                    <img src={item.icon} width={16} height={16} alt="" aria-hidden />
                    <span className="bm-item-label">{item.label}</span>
                  </span>
                  <img src={`${M}icon-arrow-forward.svg`} width={16} height={16} alt="" aria-hidden />
                </button>
              )
            )}
          </div>

          <div className="bm-sep" />

          <button
            type="button"
            className="bm-item bm-item--about"
            onClick={() => setSubView("about")}
          >
            <span className="bm-item-left">
              <span className="bm-item-label">About WanderOn</span>
            </span>
            <img src={`${M}icon-arrow-forward.svg`} width={16} height={16} alt="" aria-hidden />
          </button>
        </div>

        {/* CTA */}
        <div className="bm-cta-wrap">
          <button className="bm-cta" type="button" onClick={() => { onClose(); window.dispatchEvent(new Event("wanderon:open-login")); }}>
            <img src={`${M}person.svg`} width={11} height={11} alt="" aria-hidden />
            <span>Log In or Sign Up</span>
          </button>
        </div>

        {/* ── Bike Trips sub-panel ── */}
        <div
          className={`bm-subpanel${subView === "bike-trips" ? " bm-subpanel--open" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Bike Trips"
        >
          <div className="bm-subheader">
            <div className="bm-subheader-left">
              <button className="bm-back" type="button" aria-label="Back" onClick={() => setSubView(null)}>
                <img src={`${M}icon-arrow-back.png`} width={24} height={24} alt="" aria-hidden />
              </button>
              <span className="bm-subheader-title">Bike Trips</span>
            </div>
            <button className="bm-close" type="button" aria-label="Close menu" onClick={onClose}>
              <img src={`${M}icon-close.svg`} width={30} height={30} alt="" aria-hidden />
            </button>
          </div>
          <div className="bm-sub-content">
            {BIKE_ITEMS.map((item) => (
              <div key={item.label} className="bm-sub-item">
                <span className="bm-sub-label">{item.label}</span>
                {item.trending && (
                  <div className="bm-trending">
                    <img src={`${M}trending-sparkle-left.png`} width={12} height={8} alt="" aria-hidden />
                    <span className="bm-trending-text">Trending</span>
                    <img src={`${M}trending-sparkle-right.png`} width={12} height={8} alt="" aria-hidden />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── About WanderOn sub-panel ── */}
        <div
          className={`bm-subpanel${subView === "about" ? " bm-subpanel--open" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="About WanderOn"
        >
          <div className="bm-subheader">
            <div className="bm-subheader-left">
              <button className="bm-back" type="button" aria-label="Back" onClick={() => setSubView(null)}>
                <img src={`${M}icon-arrow-back.png`} width={24} height={24} alt="" aria-hidden />
              </button>
              <span className="bm-subheader-title">About WanderOn</span>
            </div>
            <button className="bm-close" type="button" aria-label="Close menu" onClick={onClose}>
              <img src={`${M}icon-close.svg`} width={30} height={30} alt="" aria-hidden />
            </button>
          </div>
          <div className="bm-sub-content">
            {ABOUT_GROUP1.map((item) => (
              <button key={item.to} type="button" className="bm-sub-item" onClick={() => go(item.to)}>
                <span className="bm-sub-label">{item.label}</span>
              </button>
            ))}
            <div className="bm-sep" />
            {ABOUT_GROUP2.map((item) => (
              <button key={item.to} type="button" className="bm-sub-item" onClick={() => go(item.to)}>
                <span className="bm-sub-label">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── All Categories sub-panel ── */}
        <div
          className={`bm-subpanel${subView === "categories" ? " bm-subpanel--open" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="All Categories"
        >
          <div className="bm-subheader">
            <div className="bm-subheader-left">
              <button className="bm-back" type="button" aria-label="Back" onClick={() => setSubView(null)}>
                <img src={`${M}icon-arrow-back.png`} width={24} height={24} alt="" aria-hidden />
              </button>
              <span className="bm-subheader-title">All Categories</span>
            </div>
            <button className="bm-close" type="button" aria-label="Close menu" onClick={onClose}>
              <img src={`${M}icon-close.svg`} width={30} height={30} alt="" aria-hidden />
            </button>
          </div>
          <div className="bm-sub-content">
            {CATEGORY_GROUP1.map((item) => (
              <button
                key={item.slug}
                type="button"
                className="bm-sub-item"
                onClick={() => go(`/search?category=${item.slug}`)}
              >
                <span className="bm-sub-label">{item.label}</span>
              </button>
            ))}
            <div className="bm-sep" />
            {CATEGORY_GROUP2.map((item) => (
              <button
                key={item.slug}
                type="button"
                className="bm-sub-item"
                onClick={() => go(`/search?category=${item.slug}`)}
              >
                <span className="bm-sub-label">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Destinations sub-panel ── */}
        <div
          className={`bm-subpanel${subView === "destinations" ? " bm-subpanel--open" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Destinations"
        >
          <div className="bm-subheader">
            <div className="bm-subheader-left">
              <button className="bm-back" type="button" aria-label="Back" onClick={() => setSubView(null)}>
                <img src={`${M}icon-arrow-back.png`} width={24} height={24} alt="" aria-hidden />
              </button>
              <span className="bm-subheader-title">Destinations</span>
            </div>
            <button className="bm-close" type="button" aria-label="Close menu" onClick={onClose}>
              <img src={`${M}icon-close.svg`} width={30} height={30} alt="" aria-hidden />
            </button>
          </div>
          <div className="bm-dest-content">
            {DEST_REGIONS.map((region, i) => (
              <div key={region.slug} className="bm-dest-region">
                {expandedRegion === region.slug ? (
                  <div className="bm-dest-expanded">
                    <div className="bm-dest-region-header--expanded">
                      <span className="bm-dest-region-label">{region.label}</span>
                    </div>
                    <button className="bm-sub-item" type="button" onClick={() => go(`/search?destination=${region.slug}`)}>
                      <span className="bm-sub-label">{region.allLabel}</span>
                    </button>
                    {region.items.map((dest) => (
                      <button key={dest.slug} className="bm-sub-item" type="button" onClick={() => go(`/search?destination=${dest.slug}`)}>
                        <span className="bm-sub-label">{dest.label}</span>
                        {dest.trending && (
                          <div className="bm-trending">
                            <img src={`${M}trending-sparkle-left.png`} width={12} height={8} alt="" aria-hidden />
                            <span className="bm-trending-text">Trending</span>
                            <img src={`${M}trending-sparkle-right.png`} width={12} height={8} alt="" aria-hidden />
                          </div>
                        )}
                      </button>
                    ))}
                    {region.seeMore && (
                      <button className="bm-sub-item" type="button" onClick={() => go(`/search?destination=${region.slug}`)}>
                        <span className="bm-dest-see-more">see more destinations</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    className="bm-dest-region-collapsed"
                    type="button"
                    onClick={() => setExpandedRegion(region.slug)}
                  >
                    <span className="bm-dest-region-label">{region.label}</span>
                    <img src={`${M}icon-arrow-forward.svg`} width={16} height={16} alt="" aria-hidden />
                  </button>
                )}
                {i < DEST_REGIONS.length - 1 && <div className="bm-dest-sep" />}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
