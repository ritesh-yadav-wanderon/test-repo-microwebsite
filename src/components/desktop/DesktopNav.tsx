import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { openLoginSheet } from "../../utils/login";
import { getScrollTop, onAppScroll } from "../../utils/scroll";
import DesktopSearch from "./DesktopSearch";
import "./DesktopNav.css";

const BASE = "/figma/desktop";

type Group = { name: string; trending?: string; dests: string[] };

/* Destination groups for the header dropdown (Figma 6184:24323). */
const GROUPS: Group[] = [
  {
    name: "India",
    trending: "Ladakh",
    dests: [
      "Ladakh",
      "Spiti",
      "Meghalaya",
      "Kashmir",
      "Sikkim",
      "Himachal Pradesh",
      "Uttarakhand",
      "Arunachal Pradesh",
      "Andaman",
      "Rajasthan",
      "Kerala",
      "Nagaland",
    ],
  },
  {
    name: "Europe",
    dests: ["France", "Italy", "Switzerland", "Spain", "Greece", "Iceland", "Norway", "Portugal"],
  },
  {
    name: "Asia",
    dests: ["Japan", "Bhutan", "Nepal", "Sri Lanka", "Kazakhstan", "South Korea"],
  },
  {
    name: "South East Asia",
    dests: ["Bali", "Vietnam", "Thailand", "Singapore", "Malaysia", "Philippines", "Cambodia"],
  },
  {
    name: "Middle East",
    dests: ["Dubai", "Abu Dhabi", "Jordan", "Oman", "Qatar"],
  },
  {
    name: "Africa",
    dests: ["Egypt", "Kenya", "Morocco", "Tanzania", "South Africa"],
  },
  {
    name: "Oceanic",
    dests: ["Australia", "New Zealand", "Fiji"],
  },
];

/* Burger dropdown items (Figma 6467:26761). */
const BURGER_ITEMS = [
  { label: "Find your trip",  icon: "menu-find-trip.svg",  to: "/search" },
  { label: "Community Trips", icon: "menu-community.svg",  to: "/trips" },
  { label: "Bike Trips",      icon: "menu-bike.svg",       to: "/search" },
  { label: "Categories",      icon: "menu-categories.svg", to: "/search" },
  { label: "Wishlist",        icon: "/figma/desktop-profile/icon-wishlist.svg", to: "/wishlist" },
  { label: "Blogs",           icon: "menu-blogs.svg",      to: "/blog" },
];

function ChevronDown() {
  return (
    <svg className="dnav__dest-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="m6 3.5 4.5 4.5L6 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface DesktopNavProps {
  /** Show the search button even before the header turns solid. Used on pages
   *  without a hero search bar (e.g. destination pages). */
  alwaysShowSearch?: boolean;
  /** Render the white header from the start. Used on pages without a dark
   *  hero behind the nav (e.g. trip detail). */
  alwaysSolid?: boolean;
  /** Dark-page variant (events pages): transparent by default, and on scroll
   *  fills with a blurred black backdrop instead of white. */
  dark?: boolean;
}

/** Fixed top navigation (Figma 6447:16452 / 6184:24322 / 6184:24323).
 *  Transparent over the hero on load; fills white once the page scrolls or
 *  the destinations dropdown opens (black blur instead when `dark`). */
export default function DesktopNav({ alwaysShowSearch = false, alwaysSolid = false, dark = false }: DesktopNavProps) {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const rootRef = useRef<HTMLDivElement>(null);

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [burgerOpen, setBurgerOpen] = useState(false);
  const [groupIdx, setGroupIdx] = useState(0);

  useEffect(() => {
    // The app scrolls inside `.app-shell`, not the window.
    const onScroll = () => setScrolled(getScrollTop() > 8);
    onScroll();
    return onAppScroll(onScroll);
  }, []);

  useEffect(() => {
    if (!open && !searchOpen && !burgerOpen) return;
    const closeAll = () => {
      setOpen(false);
      setSearchOpen(false);
      setBurgerOpen(false);
    };
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) closeAll();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAll();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, searchOpen, burgerOpen]);

  const solid = alwaysSolid || scrolled || open || searchOpen || burgerOpen;
  // Dark pages keep the white logo/burger — the solid state is a black blur.
  const lightAssets = dark || !solid;
  const group = GROUPS[groupIdx];

  const goDestination = (name: string) => {
    setOpen(false);
    navigate(`/destination/${encodeURIComponent(name.toLowerCase())}`);
  };

  return (
    <div ref={rootRef} className={`dnav${solid ? " dnav--solid" : ""}${dark ? " dnav--dark" : ""}`}>
      <div className="dnav__bar">
        <button className="dnav__logo" onClick={() => navigate("/")} aria-label="WanderOn home">
          <img src={`${BASE}/${lightAssets ? "nav-logo.png" : "nav-logo-color.png"}`} alt="WanderOn" />
        </button>
        <div className="dnav__right">
          <button className="dnav__link" onClick={() => navigate("/search")}>
            MICE
          </button>
          <button
            className={`dnav__link dnav__link--dest${open ? " dnav__link--dest-open" : ""}`}
            aria-expanded={open}
            aria-haspopup="menu"
            onClick={() => {
              setSearchOpen(false);
              setOpen((v) => !v);
            }}
          >
            Destinations
            <ChevronDown />
          </button>
          {(solid || alwaysShowSearch) && (
            <button
              className="dnav__search"
              aria-label="Search trips"
              aria-expanded={searchOpen}
              onClick={() => {
                setOpen(false);
                setSearchOpen((v) => !v);
              }}
            >
              <img src={`${BASE}/nav-search-fab.svg`} alt="" />
            </button>
          )}
          <button className="dnav__events" onClick={() => navigate("/events")}>
            Events
          </button>
          <button
            className="dnav__login"
            onClick={() => (isLoggedIn ? navigate("/profile") : openLoginSheet("/profile"))}
          >
            <img src={`${BASE}/nav-person.svg`} alt="" />
            {isLoggedIn ? "Profile" : "Log In"}
          </button>
          <button
            className="dnav__burger"
            aria-label="Menu"
            aria-expanded={burgerOpen}
            aria-haspopup="menu"
            onClick={() => {
              setOpen(false);
              setSearchOpen(false);
              setBurgerOpen((v) => !v);
            }}
          >
            <img src={`${BASE}/${lightAssets ? "nav-burger.svg" : "nav-burger-dark.svg"}`} alt="" />
          </button>
        </div>
      </div>

      {/* Expanded header search (Airbnb-style strip) — reuses DesktopSearch
          with its Where / When dropdown panels. */}
      {searchOpen && (
        <div className="dnav__searchbar">
          <DesktopSearch
            variant="light"
            autoOpenWhere
            onSearched={() => setSearchOpen(false)}
            onClose={() => setSearchOpen(false)}
          />
        </div>
      )}

      {/* Burger dropdown (Figma 6467:26761) — below the header, right-aligned
          with the burger button. */}
      {burgerOpen && (
        <div className="dnav__burger-menu" role="menu">
          {BURGER_ITEMS.map((item) => (
            <button
              key={item.label}
              className="dnav__bm-item"
              role="menuitem"
              onClick={() => {
                setBurgerOpen(false);
                navigate(item.to);
              }}
            >
              <img
                src={item.icon.startsWith("/") ? item.icon : `${BASE}/${item.icon}`}
                width={16}
                height={16}
                alt=""
                aria-hidden
              />
              {item.label}
            </button>
          ))}
          <div className="dnav__bm-sep" />
          <button
            className="dnav__bm-item"
            role="menuitem"
            onClick={() => {
              setBurgerOpen(false);
              navigate("/about-us");
            }}
          >
            <img src={`${BASE}/menu-about.svg`} width={16} height={16} alt="" aria-hidden />
            About WanderOn
          </button>
          <button
            className="dnav__bm-item"
            role="menuitem"
            onClick={() => {
              setBurgerOpen(false);
              if (isLoggedIn) logout();
              else openLoginSheet();
            }}
          >
            <img src={`${BASE}/menu-logout.svg`} width={16} height={16} alt="" aria-hidden />
            {isLoggedIn ? "Log out" : "Log In"}
          </button>
        </div>
      )}

      {open && (
        <div className="dnav__menu" role="menu">
          <div className="dnav__menu-rail">
            {GROUPS.map((g, i) => (
              <button
                key={g.name}
                className={`dnav__menu-group${i === groupIdx ? " dnav__menu-group--active" : ""}`}
                onClick={() => setGroupIdx(i)}
                onMouseEnter={() => setGroupIdx(i)}
              >
                {g.name}
                <ChevronRight />
              </button>
            ))}
          </div>

          <div className="dnav__menu-body">
            <p className="dnav__menu-heading">{group.name}</p>
            <div className="dnav__menu-cols">
              {group.dests.map((d) => (
                <button key={d} className="dnav__menu-dest" onClick={() => goDestination(d)}>
                  {d}
                  {group.trending === d && (
                    <span className="dnav__trending">
                      <img src={`${BASE}/trending-sparkle-l.svg`} alt="" />
                      Trending
                      <img src={`${BASE}/trending-sparkle-r.svg`} alt="" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="dnav__menu-photo">
            <img src="/figma/trip-hero/hero-bg.png" alt="" loading="lazy" />
            <button
              className="dnav__menu-all"
              onClick={() => {
                setOpen(false);
                navigate("/search");
              }}
            >
              All trips in {group.name}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
