// Bookings: the traveller's booking list, the bill breakdown, the defaults and
// rates behind the booking form, cancellation-status persistence, and
// booking-draft server persistence (the fix for "refresh loses booking data").

import { readJSON, STORAGE_KEYS, writeJSON } from "./core/storage";
import { SAMPLE_BOOKINGS, BOOKINGS_TABS } from "./fixtures/bookings";
import { BILL_ITEMS, TOTAL_TRIP_COST } from "./fixtures/bookingBill";
import { ENDPOINTS } from "./core/config";
import { getJSON, postJSON, patchJSON, isRecord } from "./core/http";

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

// ── Booking persistence ─────────────────────────────────────────────────
// Every booking is keyed by `orderId` — the one reference it shares with the
// payments made against it (paymentRepository.ts). useBookingForm creates
// the draft as soon as an orderId exists and updates it at each checkpoint
// (trip selection, traveller details, payment), so a refresh or direct link
// to /bookings/:orderId re-fetches the real record.
// Reads/writes go through our own server-side API (/api/bookings) — this is
// the only place that should know that endpoint's shape. Nothing here talks
// to Mongo directly; that lives in api/_lib/bookings.ts on the server.

export interface TravellerDetails {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  gender?: string;
  dob?: string;
  panNumber?: string;
  passportNumber?: string;
  passportValidUpto?: string;
  femaleCount?: number;
  maleCount?: number;
}

export interface BookingDraft {
  orderId: string;
  status: "draft" | "paid";
  /** Mobile number + email identify the user; required once paid. */
  phone?: string;
  email?: string;
  traveller?: TravellerDetails;
  tripTitle?: string;
  tripName?: string;
  dateRange?: string;
  durationLabel?: string;
  pickUp?: string;
  drop?: string;
  pickUpDate?: string;
  dropDate?: string;
  cities?: string[];
  perPerson?: string;
  perPersonStrike?: string;
  travelers?: number;
  flexibleCancel?: boolean;
  appliedVoucher?: { code: string; amount: number } | null;
  travellerName?: string;
  amountPaid?: string;
  dueBalance?: string;
  paymentMethod?: string;
  paidAt?: string;
  paymentIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export type BookingDraftInput = Partial<
  Omit<BookingDraft, "orderId" | "status" | "paymentIds" | "createdAt" | "updatedAt">
>;

/** New order reference for a fresh checkout. */
export function newOrderId(prefix = "WO"): string {
  return `${prefix}-${Date.now()}`;
}

function toBookingDraft(raw: unknown): BookingDraft | null {
  if (!isRecord(raw) || typeof raw.orderId !== "string") return null;
  return raw as unknown as BookingDraft;
}

const errMsg = (err: unknown) => (err instanceof Error ? err.message : String(err));

/** Fire on checkout start — idempotent, safe to call more than once for the
 *  same orderId (an existing booking is never overwritten). Never throws into
 *  the caller's render path; a failure here shouldn't block checkout. */
export async function createBookingDraft(orderId: string, fields: BookingDraftInput): Promise<void> {
  try {
    await postJSON(ENDPOINTS.bookings, { orderId, ...fields });
  } catch (err) {
    console.warn("[bookingRepository] createBookingDraft failed:", errMsg(err));
  }
}

/** Merge fields into an existing booking (traveller details, the payment
 *  result). Same never-throws contract as createBookingDraft. */
export async function updateBookingDraft(
  orderId: string,
  fields: BookingDraftInput & { status?: "draft" | "paid" }
): Promise<void> {
  try {
    await patchJSON(`${ENDPOINTS.bookings}?orderId=${encodeURIComponent(orderId)}`, fields);
  } catch (err) {
    console.warn("[bookingRepository] updateBookingDraft failed:", errMsg(err));
  }
}

/** Fetch a persisted booking by orderId, or null if there isn't one (a fresh
 *  orderId that hasn't reached the server yet, or a stale/bogus link). */
export async function getBookingDraft(orderId: string): Promise<BookingDraft | null> {
  try {
    const raw = await getJSON(`${ENDPOINTS.bookings}?orderId=${encodeURIComponent(orderId)}`);
    return toBookingDraft(raw);
  } catch (err) {
    console.warn("[bookingRepository] getBookingDraft failed:", errMsg(err));
    return null;
  }
}
