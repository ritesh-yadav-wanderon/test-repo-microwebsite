// Desktop product listing. Shared list helpers come from
// `../../pages/searchResults.helpers` (not the page) to avoid a circular import.
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import type { Trip } from "../../types";
import { getListingTrips } from "../../api";
import TripCard from "../TripCard";
import FilterSheet from "../FilterSheet/FilterSheet";
import DesktopBatchesSheet from "./DesktopBatchesSheet";
import DesktopFooter from "./DesktopFooter";
import { useAuth } from "../../context/AuthContext";
import { openLoginSheet } from "../../utils/login";
import {
  filterTrips,
  sortTrips,
  fmtDate,
  fmtMonthLabel,
  playTapSound,
} from "../../pages/searchResults.helpers";
import "./DesktopSearchResults.css";

const PAGE_SIZE = 6; // two rows of three cards
const LI = "/figma/listing/";
const AS = "/figma/desktop-listing/";
const NAV = "/figma/nav2/";
const TRIP = "/figma/desktop-trip/";

type Chip = { key: string; label: string; onRemove: () => void };

function TripCardShimmer() {
  return (
    <div className="dsr-shimmer">
      <div className="dsr-shimmer-img" />
      <div className="dsr-shimmer-body">
        <div className="dsr-shimmer-line" style={{ width: "85%", height: 14 }} />
        <div className="dsr-shimmer-line" style={{ width: "60%" }} />
        <div className="dsr-shimmer-line" style={{ width: "70%" }} />
        <div className="dsr-shimmer-line" style={{ width: "45%", height: 18, marginTop: 8 }} />
      </div>
    </div>
  );
}

/** Desktop product listing page (Figma 5854:24702 "Listing"). Reuses the mobile
 *  TripCard and the shared listing filter/sort helpers. */
export default function DesktopSearchResults() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [searchParams] = useSearchParams();

  const [allTrips, setAllTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [filterOpen, setFilterOpen] = useState(false);
  const [filterTab, setFilterTab] = useState(0);
  const [batchesTrip, setBatchesTrip] = useState<Trip | null>(null);
  const [showFeatures, setShowFeatures] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getListingTrips().then((trips) => {
      if (!cancelled) {
        setAllTrips(trips);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchParams]);

  const filteredTrips = useMemo(
    () => sortTrips(filterTrips(allTrips, searchParams), null),
    [allTrips, searchParams]
  );

  const visibleTrips = filteredTrips.slice(0, visibleCount);

  // ── Active filter params ──────────────────────────────────────────────
  const destination = searchParams.get("destination") ?? "";
  const dateFrom = searchParams.get("from") ?? "";
  const dateTo = searchParams.get("to") ?? "";
  const monthsParam = searchParams.get("months") ?? "";
  const selMonths = monthsParam ? monthsParam.split(",") : [];
  const category = searchParams.get("category") ?? "";
  const planningWith = searchParams.get("planningWith") ?? "";
  const addons = searchParams.get("addons") ?? "";
  const fromCity = searchParams.get("fromCity") ?? "";
  const accommodation = searchParams.get("accommodation") ?? "";
  const bucketList = searchParams.get("bucketList") ?? "";
  const selBucket = bucketList ? bucketList.split(",").map((s) => s.trim()).filter(Boolean) : [];

  function removeParam(...keys: string[]) {
    const p = new URLSearchParams(searchParams);
    keys.forEach((k) => p.delete(k));
    navigate(`/search?${p.toString()}`);
  }

  function removeOneFromParam(key: string, value: string) {
    const cur = searchParams.get(key) ?? "";
    const remaining = cur.split(",").filter((v) => v.trim() !== value).join(",");
    const p = new URLSearchParams(searchParams);
    remaining ? p.set(key, remaining) : p.delete(key);
    navigate(`/search?${p.toString()}`);
  }

  const chips: Chip[] = [];
  if (destination) chips.push({ key: `dest`, label: destination, onRemove: () => removeParam("destination") });
  if (monthsParam) selMonths.forEach((ym) => chips.push({ key: `m-${ym}`, label: fmtMonthLabel(ym), onRemove: () => removeOneFromParam("months", ym) }));
  if (!monthsParam && (dateFrom || dateTo))
    chips.push({
      key: "dates",
      label: dateFrom && dateTo ? `${fmtDate(dateFrom)} – ${fmtDate(dateTo)}` : dateFrom ? fmtDate(dateFrom) : fmtDate(dateTo),
      onRemove: () => removeParam("from", "to"),
    });
  if (category) category.split(",").forEach((c) => chips.push({ key: `c-${c}`, label: c, onRemove: () => removeOneFromParam("category", c) }));
  if (planningWith) planningWith.split(",").forEach((pw) => chips.push({ key: `pw-${pw}`, label: pw, onRemove: () => removeOneFromParam("planningWith", pw) }));
  if (addons) addons.split(",").forEach((a) => chips.push({ key: `a-${a}`, label: a, onRemove: () => removeOneFromParam("addons", a) }));
  if (fromCity) fromCity.split(",").forEach((city) => chips.push({ key: `fc-${city}`, label: `From ${city}`, onRemove: () => removeOneFromParam("fromCity", city) }));
  if (accommodation) accommodation.split(",").forEach((acc) => chips.push({ key: `ac-${acc}`, label: acc, onRemove: () => removeOneFromParam("accommodation", acc) }));
  selBucket.forEach((entry) => chips.push({ key: `b-${entry}`, label: entry, onRemove: () => removeOneFromParam("bucketList", entry) }));

  const openFilter = (tab: number) => {
    setFilterTab(tab);
    setFilterOpen(true);
  };

  return (
    <div className="dsr">
      <FilterSheet isOpen={filterOpen} onClose={() => setFilterOpen(false)} initialTab={filterTab} />

      <DesktopBatchesSheet
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

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="dsr-header">
        <button className="dsr-header-logo" onClick={() => navigate("/")} aria-label="WanderOn home">
          <img src={`${NAV}logo.png`} alt="WanderOn" />
        </button>
        <nav className="dsr-header-right">
          <button className="dsr-header-link" onClick={() => navigate("/")}>
            Destinations
          </button>
          <button className="dsr-header-events" onClick={() => navigate("/events")}>
            Events
          </button>
          <button
            className="dsr-header-profile"
            onClick={() => (isLoggedIn ? navigate("/profile") : openLoginSheet("/profile"))}
            aria-label="Profile"
          >
            <img src={`${TRIP}hd-profile.svg`} alt="" aria-hidden />
          </button>
        </nav>
      </header>

      {/* ── Filter bar ─────────────────────────────────────────────────── */}
      <div className="dsr-filterbar">
        <div className="dsr-fpills">
          <button className="dsr-fpill" type="button" onClick={() => openFilter(0)}>
            <span>Filters</span>
            <img src={`${LI}filter-icon.svg`} alt="" className="dsr-fpill-ico" />
          </button>
          <button className="dsr-fpill" type="button" onClick={() => openFilter(7)}>
            <span>Bucket List</span>
            <img src={`${LI}list-alt-add.svg`} alt="" className="dsr-fpill-ico" />
          </button>
          <button className="dsr-fpill" type="button" onClick={() => openFilter(3)}>
            <span>Budget</span>
            <img src={`${AS}arrow-down.svg`} alt="" className="dsr-fpill-caret" />
          </button>
          <button className="dsr-fpill" type="button" onClick={() => openFilter(2)}>
            <span>Months</span>
            <img src={`${AS}arrow-down.svg`} alt="" className="dsr-fpill-caret" />
          </button>
          <button className="dsr-fpill" type="button" onClick={() => openFilter(3)}>
            <span>Categories</span>
            <img src={`${AS}arrow-down.svg`} alt="" className="dsr-fpill-caret" />
          </button>
          <button className="dsr-fpill" type="button" onClick={() => openFilter(2)}>
            <span>Duration</span>
            <img src={`${AS}arrow-down.svg`} alt="" className="dsr-fpill-caret" />
          </button>
        </div>
      </div>

      {/* ── Results ────────────────────────────────────────────────────── */}
      <main className="dsr-main">
        {chips.length > 0 && (
          <div className="dsr-chips">
            {chips.map((chip) => (
              <div className="dsr-chip" key={chip.key}>
                <span>{chip.label}</span>
                <button className="dsr-chip-x" aria-label={`Remove ${chip.label}`} onClick={chip.onRemove}>
                  <img src={`${LI}close-icon.svg`} alt="" width={16} height={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <div className="dsr-count-row">
            <p className="dsr-count">
              {filteredTrips.length} Trip{filteredTrips.length !== 1 ? "s" : ""} Found
            </p>
            <button
              type="button"
              className="dsr-features-toggle"
              role="switch"
              aria-checked={showFeatures}
              onClick={() => {
                playTapSound();
                setShowFeatures((v) => !v);
              }}
            >
              <span className="dsr-features-toggle-label">Show Features</span>
              <img
                className="dsr-features-toggle-switch"
                src={`${LI}toggle/toggle-${showFeatures ? "on" : "off"}.svg`}
                alt=""
                aria-hidden
              />
            </button>
          </div>
        )}

        <div className="dsr-grid">
          {loading
            ? Array.from({ length: PAGE_SIZE }, (_, i) => <TripCardShimmer key={i} />)
            : visibleTrips.map((trip, i) => (
                <div className="dsr-cell" key={trip.slug}>
                  <TripCard
                    trip={trip}
                    theme="teal"
                    eager={i < 3}
                    showFeatures={showFeatures}
                    onSeeAllDates={() => setBatchesTrip(trip)}
                  />
                </div>
              ))}
        </div>

        {!loading && filteredTrips.length === 0 && allTrips.length > 0 && (
          <p className="dsr-no-results">No trips match your filters. Try adjusting your search.</p>
        )}

        {!loading && visibleCount < filteredTrips.length && (
          <div className="dsr-viewmore-wrap">
            <button
              type="button"
              className="dsr-viewmore"
              onClick={() => setVisibleCount((c) => Math.min(c + PAGE_SIZE, filteredTrips.length))}
            >
              View more trips
            </button>
          </div>
        )}
      </main>

      <DesktopFooter />
    </div>
  );
}
