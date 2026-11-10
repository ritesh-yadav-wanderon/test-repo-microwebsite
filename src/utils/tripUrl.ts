import type { Trip } from "@/types";

/**
 * Trip detail URL: /trip/<slug>, plus `?id=<productId>` whenever the trip
 * carries a Mongo `productId`. The detail page resolves by id first and falls
 * back to the slug, so both forms work.
 */
export function tripHref(trip: Pick<Trip, "slug" | "productId">): string {
  const path = `/trip/${encodeURIComponent(trip.slug)}`;
  return trip.productId ? `${path}?id=${encodeURIComponent(trip.productId)}` : path;
}
