import { selectionPrice } from "@/components/ItineraryCustomiser/ItineraryCustomiser";
import type { ProductData } from "@/repositories";

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
