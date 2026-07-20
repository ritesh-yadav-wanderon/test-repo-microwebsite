import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import type { Trip } from "../types";
import { getListingTrips } from "../api";
import TripCard from "../components/TripCard";
import Footer from "../components/Footer";
import FooterMessage from "../components/FooterMessage/FooterMessage";
import BottomNav from "../components/BottomNav";
import SearchBottomSheet from "../components/SearchBottomSheet/SearchBottomSheet";
import FilterSheet from "../components/FilterSheet/FilterSheet";
import BurgerMenu from "../components/BurgerMenu/BurgerMenu";
import BatchesSheet from "../components/BatchesSheet/BatchesSheet";
import SiteHeader2 from "../components/SiteHeader2";
import "./SearchResults.css";

const PAGE_SIZE = 10;
const PRESET_CHIPS = ["Trips under 50K", "With Flights", "From Delhi", "From Mumbai"];

function fmtDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function fmtMonthLabel(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

function closeMatch(needle: string, haystack: string[]): boolean {
  const n = needle.toLowerCase();
  return haystack.some(h => h.toLowerCase().includes(n) || n.includes(h.toLowerCase()));
}

function parsePriceNum(price: string): number {
  return Number(String(price).replace(/[₹,\s/\-]/g, "")) || 0;
}

function matchesCategory(label: string, trip: Trip): boolean {
  const price = parsePriceNum(trip.startingPrice);
  const cats = (trip.categories ?? []).join(" ").toLowerCase();
  switch (label) {
    case "Adventure":
      return cats.includes("adventure") || cats.includes("backpack") ||
             cats.includes("trek") || cats.includes("bike") || cats.includes("hiking");
    case "Luxury":
      return price > 100000 || cats.includes("luxury");
    case "Budget Trips":
      return price < 25000;
    case "Events and Festivals":
      return cats.includes("festival") || cats.includes("event");
    case "Wellness":
      return cats.includes("wellness") || cats.includes("yoga");
    default:
      return false;
  }
}

function filterTrips(trips: Trip[], params: URLSearchParams): Trip[] {
  const destination   = params.get("destination") ?? "";
  const months        = params.get("months") ?? "";
  const dateFrom      = params.get("from") ?? "";
  const dateTo        = params.get("to") ?? "";
  const category      = params.get("category") ?? "";
  const bucketList    = params.get("bucketList") ?? "";
  // planningWith, addons, fromCity, accommodation stored in URL but not filterable against API
  // — they still show as chips for the user

  const selDests   = destination ? destination.split(",").map(s => s.trim()).filter(Boolean) : [];
  const selMonths  = months ? months.split(",") : [];
  const selCats    = category ? category.split(",").map(s => s.trim()).filter(Boolean) : [];
  const selBucket  = bucketList ? bucketList.split(",").map(s => s.trim()).filter(Boolean) : [];

  return trips.filter(trip => {
    // Destination — match filter slug/keyword against trip title + destination titles + destination slugs
    if (selDests.length) {
      const searchable = [
        trip.title,
        ...(trip.skeletonItinerary ?? []),
        ...(trip.destinations?.map(d => d.title) ?? []),
        ...(trip.destinations?.map(d => d.slug) ?? []),
      ];
      if (!selDests.some(d => closeMatch(d, searchable))) return false;
    }

    // Category label → API category slugs + price
    if (selCats.length) {
      if (!selCats.some(cat => matchesCategory(cat, trip))) return false;
    }

    // Month filter — any batch starts with YYYY-MM
    if (selMonths.length) {
      const batches = trip.batches ?? [];
      if (!selMonths.some(ym => batches.some(b => b.startsWith(ym)))) return false;
    }

    // Date range filter — any batch within from/to window
    if (dateFrom || dateTo) {
      const batches = trip.batches ?? [];
      const from = dateFrom ? new Date(dateFrom + "T00:00:00").getTime() : -Infinity;
      const to   = dateTo   ? new Date(dateTo   + "T00:00:00").getTime() :  Infinity;
      if (!batches.some(b => { const t = new Date(b + "T00:00:00").getTime(); return t >= from && t <= to; })) return false;
    }

    // Bucket list — each entry close-matches destination titles or trip title
    if (selBucket.length) {
      const searchable = [
        trip.title,
        ...(trip.destinations?.map(d => d.title) ?? []),
        ...(trip.skeletonItinerary ?? []),
      ];
      if (!selBucket.some(entry => closeMatch(entry, searchable))) return false;
    }

    return true;
  });
}

function TripCardShimmer() {
  return (
    <div className="sr-shimmer-card">
      <div className="sr-shimmer-img" />
      <div className="sr-shimmer-body">
        <div className="sr-shimmer-line" style={{ width: "85%", height: 14 }} />
        <div className="sr-shimmer-line" style={{ width: "60%" }} />
        <div className="sr-shimmer-line" style={{ width: "70%" }} />
        <div className="sr-shimmer-line" style={{ width: "45%", height: 18, marginTop: 8 }} />
      </div>
    </div>
  );
}

export default function SearchResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const [allTrips, setAllTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [searchOpen, setSearchOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterTab, setFilterTab] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [batchesTrip, setBatchesTrip] = useState<Trip | null>(null);

  // Fetch trips once on mount
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getListingTrips().then(trips => {
      if (!cancelled) { setAllTrips(trips); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, []);

  // Reset pagination when filters change
  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [searchParams]);

  const filteredTrips = useMemo(
    () => filterTrips(allTrips, searchParams),
    [allTrips, searchParams]
  );

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || loading || visibleCount >= filteredTrips.length) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisibleCount(c => Math.min(c + PAGE_SIZE, filteredTrips.length)); },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visibleCount, filteredTrips.length, loading]);

  // Read active filter params
  const destination   = searchParams.get("destination") ?? "";
  const dateFrom      = searchParams.get("from") ?? "";
  const dateTo        = searchParams.get("to") ?? "";
  const monthsParam   = searchParams.get("months") ?? "";
  const selMonths     = monthsParam ? monthsParam.split(",") : [];
  const category      = searchParams.get("category") ?? "";
  const planningWith  = searchParams.get("planningWith") ?? "";
  const addons        = searchParams.get("addons") ?? "";
  const fromCity      = searchParams.get("fromCity") ?? "";
  const accommodation = searchParams.get("accommodation") ?? "";
  const bucketList    = searchParams.get("bucketList") ?? "";
  const selBucket     = bucketList ? bucketList.split(",").map(s => s.trim()).filter(Boolean) : [];

  const destinationLabel = destination || "Anywhere";
  const dateLabel = (() => {
    if (monthsParam) return selMonths.length === 1 ? fmtMonthLabel(selMonths[0]) : `${selMonths.length} months`;
    if (dateFrom && dateTo) return `${fmtDate(dateFrom)} – ${fmtDate(dateTo)}`;
    if (dateFrom) return fmtDate(dateFrom);
    if (dateTo) return `To ${fmtDate(dateTo)}`;
    return "Any Date";
  })();

  function removeParam(...keys: string[]) {
    const p = new URLSearchParams(searchParams);
    keys.forEach(k => p.delete(k));
    navigate(`/search?${p.toString()}`);
  }

  function removeOneFromParam(key: string, value: string) {
    const cur = searchParams.get(key) ?? "";
    const remaining = cur.split(",").filter(v => v.trim() !== value).join(",");
    const p = new URLSearchParams(searchParams);
    remaining ? p.set(key, remaining) : p.delete(key);
    navigate(`/search?${p.toString()}`);
  }

  const hasActiveFilters = !!(destination || monthsParam ||
    (!monthsParam && (dateFrom || dateTo)) || category ||
    planningWith || addons || fromCity || accommodation || bucketList);

  const visibleTrips = filteredTrips.slice(0, visibleCount);

  return (
    <div className="sr-page">

      <SearchBottomSheet
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        initialDestination={destination}
        initialFrom={dateFrom}
        initialTo={dateTo}
        initialMonths={selMonths}
      />

      <FilterSheet isOpen={filterOpen} onClose={() => setFilterOpen(false)} initialTab={filterTab} />

      <BurgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <BatchesSheet
        isOpen={!!batchesTrip}
        onClose={() => setBatchesTrip(null)}
        tripTitle={batchesTrip?.title}
        nights={batchesTrip?.duration?.nights ?? 7}
        ctaLabel="View Trip"
        onSelectBatch={(batch, start, end) => {
          const slug = batchesTrip?.slug;
          setBatchesTrip(null);
          if (!slug) return;
          const fmt = (d: Date, withYear: boolean) =>
            d.toLocaleDateString("en-GB", { day: "numeric", month: "short", ...(withYear ? { year: "numeric" } : {}) });
          const price = Number(String(batch.price).replace(/,/g, "")).toLocaleString("en-IN");
          navigate(`/trip/${slug}`, {
            state: { from: "batches", selectedBatch: { dateRange: `${fmt(start, false)} - ${fmt(end, true)}`, price: `${price}/-` } },
          });
        }}
      />

      <SiteHeader2 destination={destinationLabel} date={dateLabel} showBack onBack={() => navigate(-1)} />

      <main className="sr-main">

        {/* Sticky filter bar */}
        <div className="sr-filter-wrap">
          <div className="sr-fpills">
            <button className="sr-fpill sr-fpill--ctrl" type="button" onClick={() => setFilterOpen(true)}>
              <span>Filters</span>
              <img src="/figma/listing/filter-icon.svg" alt="" className="sr-fpill-ico" loading="lazy" />
            </button>
            <button className="sr-fpill sr-fpill--ctrl" type="button"
              onClick={() => { setFilterTab(7); setFilterOpen(true); }}>
              <img src="/figma/listing/list-alt-add.svg" alt="" className="sr-fpill-ico" loading="lazy" />
              <span>Bucket List</span>
            </button>
            <button className="sr-fpill sr-fpill--ctrl" type="button">
              <span>Sort By</span>
              <img src="/figma/listing/sort-arrow.svg" alt="" className="sr-fpill-ico" loading="lazy" />
            </button>
            {PRESET_CHIPS.map(chip => (
              <button className="sr-fpill" key={chip} type="button"><span>{chip}</span></button>
            ))}
          </div>

          {hasActiveFilters && (
            <div className="sr-active-row">
              {destination && (
                <div className="sr-active-chip">
                  <span>{destination}</span>
                  <button className="sr-chip-x" aria-label={`Remove ${destination}`}
                    onClick={() => removeParam("destination")}>
                    <img src="/figma/listing/close-icon.svg" alt="" width={16} height={16} loading="lazy" />
                  </button>
                </div>
              )}
              {monthsParam && selMonths.map(ym => (
                <div className="sr-active-chip" key={ym}>
                  <span>{fmtMonthLabel(ym)}</span>
                  <button className="sr-chip-x" aria-label={`Remove ${fmtMonthLabel(ym)}`}
                    onClick={() => removeOneFromParam("months", ym)}>
                    <img src="/figma/listing/close-icon.svg" alt="" width={16} height={16} loading="lazy" />
                  </button>
                </div>
              ))}
              {!monthsParam && (dateFrom || dateTo) && (
                <div className="sr-active-chip">
                  <span>
                    {dateFrom && dateTo ? `${fmtDate(dateFrom)} – ${fmtDate(dateTo)}`
                      : dateFrom ? fmtDate(dateFrom) : fmtDate(dateTo)}
                  </span>
                  <button className="sr-chip-x" aria-label="Remove date filter"
                    onClick={() => removeParam("from", "to")}>
                    <img src="/figma/listing/close-icon.svg" alt="" width={16} height={16} loading="lazy" />
                  </button>
                </div>
              )}
              {category && category.split(",").map(cat => (
                <div className="sr-active-chip" key={cat}>
                  <span>{cat}</span>
                  <button className="sr-chip-x" aria-label={`Remove ${cat}`}
                    onClick={() => removeOneFromParam("category", cat)}>
                    <img src="/figma/listing/close-icon.svg" alt="" width={16} height={16} loading="lazy" />
                  </button>
                </div>
              ))}
              {planningWith && planningWith.split(",").map(pw => (
                <div className="sr-active-chip" key={pw}>
                  <span>{pw}</span>
                  <button className="sr-chip-x" aria-label={`Remove ${pw}`}
                    onClick={() => removeOneFromParam("planningWith", pw)}>
                    <img src="/figma/listing/close-icon.svg" alt="" width={16} height={16} loading="lazy" />
                  </button>
                </div>
              ))}
              {addons && addons.split(",").map(a => (
                <div className="sr-active-chip" key={a}>
                  <span>{a}</span>
                  <button className="sr-chip-x" aria-label={`Remove ${a}`}
                    onClick={() => removeOneFromParam("addons", a)}>
                    <img src="/figma/listing/close-icon.svg" alt="" width={16} height={16} loading="lazy" />
                  </button>
                </div>
              ))}
              {fromCity && fromCity.split(",").map(city => (
                <div className="sr-active-chip" key={city}>
                  <span>From {city}</span>
                  <button className="sr-chip-x" aria-label={`Remove ${city}`}
                    onClick={() => removeOneFromParam("fromCity", city)}>
                    <img src="/figma/listing/close-icon.svg" alt="" width={16} height={16} loading="lazy" />
                  </button>
                </div>
              ))}
              {accommodation && accommodation.split(",").map(acc => (
                <div className="sr-active-chip" key={acc}>
                  <span>{acc}</span>
                  <button className="sr-chip-x" aria-label={`Remove ${acc}`}
                    onClick={() => removeOneFromParam("accommodation", acc)}>
                    <img src="/figma/listing/close-icon.svg" alt="" width={16} height={16} loading="lazy" />
                  </button>
                </div>
              ))}
              {selBucket.map(entry => (
                <div className="sr-active-chip" key={entry}>
                  <span>{entry}</span>
                  <button className="sr-chip-x" aria-label={`Remove ${entry} from bucket list`}
                    onClick={() => removeOneFromParam("bucketList", entry)}>
                    <img src="/figma/listing/close-icon.svg" alt="" width={16} height={16} loading="lazy" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="sr-content">
          {!loading && (
            <p className="sr-count">
              {filteredTrips.length} Trip{filteredTrips.length !== 1 ? "s" : ""} Found
            </p>
          )}

          <div className="sr-cards">
            {loading
              ? Array.from({ length: PAGE_SIZE }, (_, i) => <TripCardShimmer key={i} />)
              : visibleTrips.map((trip, i) => (
                  <TripCard
                    key={trip.slug}
                    trip={trip}
                    theme="teal"
                    fullWidth
                    eager={i === 0}
                    onSeeAllDates={() => setBatchesTrip(trip)}
                  />
                ))
            }
          </div>

          {!loading && visibleCount < filteredTrips.length && (
            <div ref={sentinelRef} className="sr-sentinel" aria-hidden />
          )}

          {!loading && filteredTrips.length === 0 && allTrips.length > 0 && (
            <p className="sr-no-results">No trips match your filters. Try adjusting your search.</p>
          )}
        </div>

        <FooterMessage />
        <Footer />
      </main>

      <BottomNav />
    </div>
  );
}
