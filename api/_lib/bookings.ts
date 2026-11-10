// Booking persistence — framework-agnostic (no req/res), reused by the
// /api/bookings and /api/payments Route Handlers and the RSC pages, same
// pattern as api/_lib/products.ts.
//
// A booking is keyed by `orderId`, the one reference shared with every
// payment made against it (see api/_lib/payments.ts). It's created as a
// draft on checkout start and filled in at each checkpoint (trip selection,
// traveller details, payment) so a refresh or a direct link to
// /bookings/:orderId re-fetches the real record.
//
// A user is identified by mobile number + email: a booking can't move to
// "paid" without both.

import type { Collection, Document } from "mongodb";
import { normalizeEmail, normalizePhone, isValidEmail, isValidPhone } from "../../src/utils/contact";

export type BookingStatus = "draft" | "paid";

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

export interface BookingDoc extends Document {
  orderId: string;
  status: BookingStatus;
  /** Normalized 10-digit mobile number — half of the user identifier. */
  phone?: string;
  /** Normalized (lower-cased) email — the other half of the user identifier. */
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
  /** Razorpay payment ids recorded against this order (api/_lib/payments.ts). */
  paymentIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export type BookingInput = Partial<
  Omit<BookingDoc, "orderId" | "status" | "paymentIds" | "createdAt" | "updatedAt">
>;

/** Thrown for a request the client can fix (bad contact, missing contact on
 *  a paid booking) — route handlers map it to a 400 instead of a 500. */
export class BookingValidationError extends Error {}

/** Whitelist + normalize client-supplied fields so a request body can't
 *  overwrite `orderId`, `paymentIds`, timestamps, or anything unknown. */
function sanitize(fields: Record<string, unknown>): BookingInput {
  const allowed: (keyof BookingInput)[] = [
    "traveller", "tripTitle", "tripName", "dateRange", "durationLabel", "pickUp", "drop",
    "pickUpDate", "dropDate", "cities", "perPerson", "perPersonStrike", "travelers",
    "flexibleCancel", "appliedVoucher", "travellerName", "amountPaid", "dueBalance",
    "paymentMethod", "paidAt",
  ];
  const out: Record<string, unknown> = {};
  for (const key of allowed) {
    if (fields[key] !== undefined) out[key] = fields[key];
  }
  if (fields.phone !== undefined && fields.phone !== "") {
    const phone = normalizePhone(fields.phone);
    if (!isValidPhone(phone)) throw new BookingValidationError("Invalid mobile number");
    out.phone = phone;
  }
  if (fields.email !== undefined && fields.email !== "") {
    const email = normalizeEmail(fields.email);
    if (!isValidEmail(email)) throw new BookingValidationError("Invalid email");
    out.email = email;
  }
  return out as BookingInput;
}

/** Create the draft on first checkout, or no-op if `orderId` already exists
 *  (React effects can fire more than once in dev/StrictMode — this must be
 *  idempotent, never overwrite an existing booking's progress). */
export async function createBooking(
  collection: Collection<BookingDoc>,
  orderId: string,
  fields: Record<string, unknown>
): Promise<void> {
  const now = new Date().toISOString();
  await collection.updateOne(
    { orderId },
    {
      $setOnInsert: {
        orderId,
        status: "draft",
        createdAt: now,
        ...sanitize(fields),
      },
      $set: { updatedAt: now },
    },
    { upsert: true }
  );
}

/** Merge fields into an existing booking (e.g. traveller details, the
 *  payment result). Creates it if it somehow doesn't exist yet, so this is
 *  safe to call even if the initial createBooking() call is still in
 *  flight/failed. */
export async function updateBooking(
  collection: Collection<BookingDoc>,
  orderId: string,
  fields: Record<string, unknown> & { status?: BookingStatus }
): Promise<void> {
  const now = new Date().toISOString();
  const clean = sanitize(fields);
  const status = fields.status === "paid" || fields.status === "draft" ? fields.status : undefined;

  if (status === "paid") {
    const existing = await collection.findOne({ orderId }, { projection: { phone: 1, email: 1 } });
    if (!(clean.phone ?? existing?.phone) || !(clean.email ?? existing?.email)) {
      throw new BookingValidationError("A paid booking needs the traveller's mobile number and email");
    }
  }

  // MongoDB rejects the same path appearing in both $set and $setOnInsert
  // (e.g. `status` when the caller passes one) — `status` always belongs in
  // $set when provided; $setOnInsert only needs a fallback for the
  // upsert-creates-a-new-doc case where it's absent.
  await collection.updateOne(
    { orderId },
    {
      $set: { ...clean, ...(status ? { status } : {}), updatedAt: now },
      $setOnInsert: {
        orderId,
        createdAt: now,
        ...(status ? {} : { status: "draft" as const }),
      },
    },
    { upsert: true }
  );
}

export async function getBooking(
  collection: Collection<BookingDoc>,
  orderId: string
): Promise<BookingDoc | null> {
  return collection.findOne({ orderId });
}

export async function deleteBooking(collection: Collection<BookingDoc>, orderId: string): Promise<void> {
  await collection.deleteOne({ orderId });
}
