import type { Trip } from "@/types";
import { isCustomisedPackage } from "@/repositories/productDetailMapper";

/** Private (customised) trips have no fixed batches — cards show this
 *  instead of departure dates. */
export const PRIVATE_DATES_LABEL = "Date of your choice";

export function isPrivateTrip(trip: Pick<Trip, "type">): boolean {
  return isCustomisedPackage(trip.type);
}
