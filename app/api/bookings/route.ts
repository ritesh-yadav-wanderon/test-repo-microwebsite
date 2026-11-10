// /api/bookings — booking persistence keyed by `orderId` (the reference a
// booking shares with its payments). Request/response plumbing only; the
// logic lives in api/_lib/bookings.ts.
//
//   POST   /api/bookings              { orderId, ...fields }  create draft (idempotent)
//   PATCH  /api/bookings?orderId=…    { ...fields, status? }  merge fields
//   GET    /api/bookings?orderId=…                            read one
//   DELETE /api/bookings?orderId=…                            e2e cleanup only

import { getBookingsCollection } from "../../../api/_lib/mongo";
import {
  createBooking,
  updateBooking,
  getBooking,
  deleteBooking,
  BookingValidationError,
  type BookingDoc,
} from "../../../api/_lib/bookings";

async function readBody(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await request.json();
    return body && typeof body === "object" && !Array.isArray(body) ? body : null;
  } catch {
    return null;
  }
}

function orderIdParam(request: Request): string | null {
  return new URL(request.url).searchParams.get("orderId");
}

function failure(label: string, err: unknown, message: string) {
  if (err instanceof BookingValidationError) {
    return Response.json({ error: err.message }, { status: 400 });
  }
  console.error(`[app/api/bookings ${label}]`, err);
  return Response.json({ error: message }, { status: 500 });
}

export async function POST(request: Request) {
  try {
    const body = await readBody(request);
    if (!body) return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    const { orderId, ...fields } = body;
    if (!orderId || typeof orderId !== "string") {
      return Response.json({ error: "Missing orderId" }, { status: 400 });
    }
    const collection = await getBookingsCollection<BookingDoc>();
    await createBooking(collection, orderId, fields);
    return new Response(null, { status: 204 });
  } catch (err) {
    return failure("POST", err, "Failed to create booking");
  }
}

export async function PATCH(request: Request) {
  try {
    const orderId = orderIdParam(request);
    if (!orderId) return Response.json({ error: "Missing orderId query param" }, { status: 400 });
    const body = await readBody(request);
    if (!body) return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    const collection = await getBookingsCollection<BookingDoc>();
    await updateBooking(collection, orderId, body);
    return new Response(null, { status: 204 });
  } catch (err) {
    return failure("PATCH", err, "Failed to update booking");
  }
}

export async function GET(request: Request) {
  try {
    const orderId = orderIdParam(request);
    if (!orderId) return Response.json({ error: "Missing orderId query param" }, { status: 400 });
    const collection = await getBookingsCollection<BookingDoc>();
    const doc = await getBooking(collection, orderId);
    if (!doc) return Response.json({ error: "Booking not found" }, { status: 404 });
    const { _id, ...rest } = doc;
    return Response.json(rest, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    return failure("GET", err, "Failed to load booking");
  }
}

// e2e test cleanup only — nothing in the app itself calls this.
export async function DELETE(request: Request) {
  try {
    const orderId = orderIdParam(request);
    if (!orderId) return Response.json({ error: "Missing orderId query param" }, { status: 400 });
    const collection = await getBookingsCollection<BookingDoc>();
    await deleteBooking(collection, orderId);
    return new Response(null, { status: 204 });
  } catch (err) {
    return failure("DELETE", err, "Failed to delete booking");
  }
}
