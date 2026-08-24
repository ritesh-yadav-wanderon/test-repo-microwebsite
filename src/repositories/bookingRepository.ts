// Bookings: the traveller's booking list, the bill breakdown, the defaults and
// rates behind the booking form, and cancellation-status persistence.

import { readJSON, STORAGE_KEYS, writeJSON } from "./core/storage";
import { SAMPLE_BOOKINGS, BOOKINGS_TABS } from "./fixtures/bookings";
import { BILL_ITEMS, TOTAL_TRIP_COST } from "./fixtures/bookingBill";

export type { BookingSummary, BookingsTabKey } from "./fixtures/bookings";
export type { BillItem } from "./fixtures/bookingBill";
export { BOOKINGS_TABS, BILL_ITEMS, TOTAL_TRIP_COST };

/** Add-on & tax rates used to build the bill dynamically. */
export const FLEX_CANCEL_PP = 5999; // Flexible cancellation, per traveller
export const WANDERON_DISCOUNT = 500; // Flat WanderOn discount when at least one traveller
export const GST_RATE = 0.05;
export const TCS_RATE = 0.05;

/** Trip details the booking form falls back to when opened without state. */
export const BOOKING_DEFAULTS = {
  tripTitle:
    "11 Days European Pathways Community Trip - France, Netherlands, Germany, Czechia",
  tripName: "Europe Trip",
  dateRange: "23 July 2026 - 3 Aug 2026",
  durationLabel: "10N/11D",
  pickUp: "Paris Airport",
  drop: "Prague Airport",
  cities: ["3N Paris", "3N Amsterdam", "2N Berlin", "2N Prague"],
  perPerson: "1,79,990",
  perPersonStrike: "29,000",
  travelers: 2,
};

export function getBookings() {
  return SAMPLE_BOOKINGS;
}

/** Illustrative bill breakdown for the payments and cancellation screens. */
export function getBillItems() {
  return BILL_ITEMS;
}

// ── Cancellation status ─────────────────────────────────────────────────
/** Lifecycle status of a booking. */
export type BookingStatus = "active" | "cancellation_requested" | "cancelled";

export function readBookingStatuses(): Record<string, BookingStatus> {
  return readJSON<Record<string, BookingStatus>>(STORAGE_KEYS.bookingStatus, {});
}

export function saveBookingStatuses(statuses: Record<string, BookingStatus>): void {
  writeJSON(STORAGE_KEYS.bookingStatus, statuses);
}
