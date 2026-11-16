import { Fragment, useEffect, useMemo, useState } from "react";
import { useAppNav } from "@/hooks/useAppNav";
import type { Trip } from "@/types";
import { useCompare } from "@/context/CompareContext";
import { useCompareTrips, type DiffField } from "@/hooks/useCompareTrips";
import { useProductList } from "@/hooks/useProductList";
import { fmtBatchDate, IMAGE_WIDTHS, sizedImageUrl } from "@/repositories";
import { tripHref } from "@/utils/tripUrl";
import AppLink from "@/components/ui/AppLink";
import CompareColumn from "@/components/CompareColumn/CompareColumn";
import DesktopFooter from "./DesktopFooter";
import "./DesktopCompare.css";

const I = "/figma/compare/v2/";
const NONE = new Set<DiffField>();

/** "₹62,999" → "62999". The design shows a struck-through MRP beside the
 *  price; products have no MRP yet, so both show the starting price. */
function plainPrice(p: string): string {
  return p.replace(/[^\d]/g, "");
}

/** Suggested trip card in the add-a-trip column (Figma 6513:31299). */
function SuggestionCard({ trip }: { trip: Trip }) {
  const { isInCompare, toggle } = useCompare();
  const added = isInCompare(trip.slug);
  const dates = (trip.batches ?? []).slice(0, 2).map(fmtBatchDate);
  const more = Math.max(0, (trip.batches?.length ?? 0) - 2);
  const price = plainPrice(trip.startingPrice);
  return (
    <div className="dcmp-sug">
      <div className="dcmp-sug-img">
        <AppLink to={tripHref(trip)} aria-label={trip.title}>
          {trip.image && <img src={sizedImageUrl(trip.image, IMAGE_WIDTHS.card)} alt="" loading="lazy" />}
        </AppLink>
        <button
          type="button"
          className="dcmp-sug-add"
          aria-pressed={added}
          onClick={() => toggle({ slug: trip.slug, title: trip.title, image: trip.image, price: trip.startingPrice })}
        >
          <img src="/figma/trip-hero/icon-compare.svg" width={14} height={14} alt="" aria-hidden />
          {added ? "Added" : "Add to Compare"}
        </button>
      </div>
      <AppLink to={tripHref(trip)} className="dcmp-sug-body">
        <p className="dcmp-sug-title">{trip.title}</p>
        {trip.pickDropPoint && (
          <span className="dcmp-sug-loc">
            <img src="/figma/desktop-pdp/icon-location.svg" width={10} height={12} alt="" aria-hidden />
            {trip.pickDropPoint}
          </span>
        )}
        {trip.duration && (
          <span className="dcmp-sug-dur">
            <img src="/figma/trips/icon-calendar-clock.svg" width={17} height={17} alt="" aria-hidden />
            {`${trip.duration.nights}N/${trip.duration.days}D`}
          </span>
        )}
        {dates.length > 0 && (
          <span className="dcmp-sug-dates">
            {dates.join(", ")}
            {more > 0 && <strong>{`, +${more} More...`}</strong>}
          </span>
        )}
        {price && (
          <span className="dcmp-sug-price-row">
            <span className="dcmp-sug-strike">{`₹${price}/-`}</span>
            <span className="dcmp-sug-price">{`₹${price}/-`}</span>
          </span>
        )}
        <span className="dcmp-sug-sub">Onwards per person</span>
      </AppLink>
    </div>
  );
}

/** Desktop Compare Trips page (Figma 6509:30416). */
export default function DesktopCompare() {
  const nav = useAppNav();
  const { remove, isInCompare } = useCompare();
  const { columns } = useCompareTrips();
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  // Search runs against the live product API (destination/title match).
  const { items: found, loading } = useProductList({ destination: debounced || undefined });
  const results = useMemo(
    () => found.filter((t) => !isInCompare(t.slug)).slice(0, debounced ? 4 : 1),
    [found, isInCompare, debounced]
  );
  const stack = found.filter((t) => t.image).slice(0, 2).map((t) => sizedImageUrl(t.image, IMAGE_WIDTHS.mini));

  return (
    <div className="dcmp">
      {/* Slim page header (Figma 6674:26125) */}
      <header className="dcmp-header">
        <button className="dcmp-back" type="button" aria-label="Go back" onClick={() => nav.go(-1)}>
          <img src={`${I}d-arrow-back.svg`} alt="" width={19} height={38} />
        </button>
        <h1 className="dcmp-header-title">Compare Trips</h1>
      </header>

      <main className="dcmp-body">
        <div className="dcmp-cols">
          {columns.map((trip, i) => (
            <Fragment key={trip.slug}>
              {i > 0 && <span className="dcmp-col-divider" aria-hidden />}
              <CompareColumn trip={trip} highlight={NONE} onRemove={() => remove(trip.slug)} />
            </Fragment>
          ))}
        </div>

        {/* Add-another-trip column (Figma 6513:31287) */}
        <aside className="dcmp-add">
          <div className="dcmp-add-top">
            <label className="dcmp-add-search">
              <img src={`${I}d-search.svg`} alt="" width={15} height={14} aria-hidden />
              <input
                type="search"
                placeholder="Search trips"
                aria-label="Search trips to add to comparison"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <p className="dcmp-add-hint">To add another trip, you can use the search to find what you are interested in!</p>
          </div>

          <p className="dcmp-add-label">{debounced ? "Search Results" : "Suggested Trips"}</p>
          {results.map((trip) => <SuggestionCard key={trip.slug} trip={trip} />)}
          {debounced && !loading && results.length === 0 && (
            <p className="dcmp-add-none">{`No trips found for “${debounced}”.`}</p>
          )}

          <AppLink to={debounced ? `/search?destination=${encodeURIComponent(debounced)}` : "/search"} className="dcmp-more">
            <span className="dcmp-more-stack" aria-hidden>
              {stack.map((src, i) => <img key={i} src={src} alt="" loading="lazy" />)}
            </span>
            View More Trips
          </AppLink>
        </aside>
      </main>

      <DesktopFooter />
    </div>
  );
}
