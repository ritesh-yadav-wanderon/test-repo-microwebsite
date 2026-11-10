import { useAppNav } from "@/hooks/useAppNav";
import { useAppSearchParams } from "@/hooks/useAppSearchParams";
import { fmtDate, fmtMonthLabel, withoutParams, withoutParamValue } from "@/utils/searchResults";

export interface FilterChip {
  key: string;
  label: string;
  onRemove: () => void;
}

/**
 * The listing page's URL-driven filter state — parsing, human-readable
 * labels, and chip removal — shared by SearchResults.tsx (mobile) and
 * DesktopSearchResults.tsx (desktop), which previously each duplicated this
 * logic independently. Pure derivation from useAppSearchParams()/useAppNav(),
 * so it works identically under Vite and Next.js. Only usable within the
 * /search route's own tree (where useAppSearchParams() is provided).
 */
export function useSearchFilters() {
  const nav = useAppNav();
  const searchParams = useAppSearchParams();

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

  const destinationLabel = destination || "Anywhere";
  const dateLabel = (() => {
    if (monthsParam) return selMonths.length === 1 ? fmtMonthLabel(selMonths[0]) : `${selMonths.length} months`;
    if (dateFrom && dateTo) return `${fmtDate(dateFrom)} – ${fmtDate(dateTo)}`;
    if (dateFrom) return fmtDate(dateFrom);
    if (dateTo) return `To ${fmtDate(dateTo)}`;
    return "Any Date";
  })();

  function removeParam(...keys: string[]) {
    nav.push(`/search?${withoutParams(searchParams, ...keys)}`);
  }

  function removeOneFromParam(key: string, value: string) {
    nav.push(`/search?${withoutParamValue(searchParams, key, value)}`);
  }

  const hasActiveFilters = !!(
    destination || monthsParam || (!monthsParam && (dateFrom || dateTo)) ||
    category || planningWith || addons || fromCity || accommodation || bucketList
  );

  const chips: FilterChip[] = [];
  if (destination) chips.push({ key: "dest", label: destination, onRemove: () => removeParam("destination") });
  if (monthsParam) {
    selMonths.forEach((ym) =>
      chips.push({ key: `m-${ym}`, label: fmtMonthLabel(ym), onRemove: () => removeOneFromParam("months", ym) })
    );
  }
  if (!monthsParam && (dateFrom || dateTo)) {
    chips.push({
      key: "dates",
      label: dateFrom && dateTo ? `${fmtDate(dateFrom)} – ${fmtDate(dateTo)}` : dateFrom ? fmtDate(dateFrom) : fmtDate(dateTo),
      onRemove: () => removeParam("from", "to"),
    });
  }
  if (category) {
    category.split(",").forEach((c) => chips.push({ key: `c-${c}`, label: c, onRemove: () => removeOneFromParam("category", c) }));
  }
  if (planningWith) {
    planningWith.split(",").forEach((pw) => chips.push({ key: `pw-${pw}`, label: pw, onRemove: () => removeOneFromParam("planningWith", pw) }));
  }
  if (addons) {
    addons.split(",").forEach((a) => chips.push({ key: `a-${a}`, label: a, onRemove: () => removeOneFromParam("addons", a) }));
  }
  if (fromCity) {
    fromCity.split(",").forEach((city) => chips.push({ key: `fc-${city}`, label: `From ${city}`, onRemove: () => removeOneFromParam("fromCity", city) }));
  }
  if (accommodation) {
    accommodation.split(",").forEach((acc) => chips.push({ key: `ac-${acc}`, label: acc, onRemove: () => removeOneFromParam("accommodation", acc) }));
  }
  selBucket.forEach((entry) => chips.push({ key: `b-${entry}`, label: entry, onRemove: () => removeOneFromParam("bucketList", entry) }));

  return {
    destination,
    dateFrom,
    dateTo,
    monthsParam,
    selMonths,
    category,
    planningWith,
    addons,
    fromCity,
    accommodation,
    bucketList,
    selBucket,
    destinationLabel,
    dateLabel,
    hasActiveFilters,
    chips,
    removeParam,
    removeOneFromParam,
  };
}
