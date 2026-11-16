import { selectionPrice } from "@/components/ItineraryCustomiser/ItineraryCustomiser";
import type { ProductData } from "@/repositories";
import { placeholderHotelRating, placeholderPremiumActivities } from "./placeholders";

/** The trip a product page is currently describing: the customiser's applied
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

export interface TransferLeg {
  from: string;
  to: string;
  duration?: string;
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

/** One itinerary anchor chip: a run of consecutive days in the same city. */
export interface CityAnchor {
  city: string;
  nights: number;
  /** Index into `data.itinerary` of the first day spent in this city. */
  firstDay: number;
  /** Index of the last day of the run (inclusive). */
  lastDay: number;
}

/** Itinerary anchors labelled "<City> <N>N", in visit order (Figma 8173:11249).
 *
 *  - One continuous stay in a city = one chip, however many nights it lasts
 *    (2N Paris is one "Paris 2N" chip, never two).
 *  - A city revisited after a break gets a chip for that visit:
 *    Paris 2N → Amsterdam 2N → Paris 3N yields three chips, and the second
 *    Paris chip points at the first day *after* Amsterdam, not day 1.
 *  - `firstDay` is always the first day of that particular visit.
 *  - Every day except the closing departure day is a night; a day with no
 *    city recorded is treated as part of the stay it falls in. */
export function cityAnchors(days: ProductData["itinerary"]): CityAnchor[] {
  const anchors: CityAnchor[] = [];
  const lastIndex = days.length - 1;
  days.forEach((day, i) => {
    if (i === lastIndex) return;
    const city = day.city?.trim();
    const prev = anchors[anchors.length - 1];
    if (!city) {
      if (prev && prev.lastDay === i - 1) { prev.nights += 1; prev.lastDay = i; }
      return;
    }
    if (prev && prev.city === city && prev.lastDay === i - 1) {
      prev.nights += 1;
      prev.lastDay = i;
    } else {
      anchors.push({ city, nights: 1, firstDay: i, lastDay: i });
    }
  });
  return anchors;
}

/** Index of the anchor covering `dayIndex` (or the closest one before it). */
export function anchorForDay(anchors: CityAnchor[], dayIndex: number): number {
  let found = 0;
  anchors.forEach((a, i) => { if (a.firstDay <= dayIndex) found = i; });
  return found;
}

export interface GlanceActivity {
  title: string;
  photo?: string;
}

/** Everything the "Trip at a Glance" tab shows. Real product fields, except
 *  hotel ratings and premium activities, which come from placeholders.ts
 *  until the schema has them (SCHEMA_TODO.md #1, #2). */
export interface TripGlance {
  stays: { name: string; rating: number }[];
  activities: GlanceActivity[];
  /** Activities only included in the Premium package. */
  premium: GlanceActivity[];
  transfer: { title: string; route: string } | null;
  community: { title: string; subtitle?: string } | null;
}

export function tripGlance(data: ProductData): TripGlance {
  const stays = [...new Set(
    data.itinerary
      .map((d) => d.stayName?.trim())
      .filter((n): n is string => Boolean(n) && !n!.startsWith("Same Accommodation"))
  )].map((name) => ({ name, rating: placeholderHotelRating(name) }));

  const activities: GlanceActivity[] = data.itinerary.flatMap((d) =>
    d.activities?.length
      ? d.activities.filter((a) => a.title && !a.isLeisure).map((a) => ({ title: a.title, photo: a.photos?.[0] }))
      : []
  );

  const legs = data.transferLegs ?? [];
  const modes = [...new Set(legs.map((l) => l.mode))];
  const route = legs.length ? [legs[0].from, ...legs.map((l) => l.to)].join(" → ") : "";
  const transfer = modes.length ? { title: modes.join(" / "), route } : null;

  const tags = data.socialTags ?? [];
  const lead = tags.find((t) => t.type === "soloTravellers") ?? tags[0];
  const second = tags.find((t) => t.type === "womenJoined" && t !== lead) ?? tags.find((t) => t !== lead);
  const community = lead ? { title: lead.text, subtitle: second?.text } : null;

  const premium = placeholderPremiumActivities(
    cityAnchors(data.itinerary).map((a) => a.city),
    activities.map((a) => a.photo)
  );

  return { stays, activities, premium, transfer, community };
}
