// Server-only booking fetch (by orderId) for the booking, PaymentSuccess and
// MyBooking RSC pages — calls Mongo directly instead of going through HTTP.
// Lives under app/_lib (not src/) because it pulls in the `mongodb` driver,
// which must never reach the client bundle.

import "server-only";

import { getBookingsCollection } from "../../api/_lib/mongo";
import { getBooking, type BookingDoc } from "../../api/_lib/bookings";
import type { BookingDraft } from "../../src/repositories";

/** Never throws: on a DB failure the page renders without server data and
 *  the client hook retries the fetch itself. */
export async function getBookingDraftServer(orderId: string): Promise<BookingDraft | null> {
  try {
    const collection = await getBookingsCollection<BookingDoc>();
    const doc = await getBooking(collection, orderId);
    if (!doc) return null;
    // Mongo's ObjectId isn't a plain object (it has a toJSON method), which
    // React's RSC serialization boundary rejects when this is passed down to
    // a Client Component as a prop — strip it, since no client code reads it.
    const { _id, ...rest } = doc;
    return rest as BookingDraft;
  } catch (err) {
    console.error("[bookingDraftServer] booking unavailable:", err);
    return null;
  }
}
