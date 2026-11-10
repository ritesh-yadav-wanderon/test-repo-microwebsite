// /api/payments — payment transactions, stored next to the booking they pay
// for and linked to it by `orderId`. Logic lives in api/_lib/payments.ts.
//
//   POST /api/payments            { orderId, paymentId, amount, phone, email, ... }
//   GET  /api/payments?orderId=…  every payment recorded against that order

import { getBookingsCollection, getPaymentsCollection } from "../../../api/_lib/mongo";
import { BookingValidationError, type BookingDoc } from "../../../api/_lib/bookings";
import { recordPayment, getPaymentsForOrder, type PaymentDoc } from "../../../api/_lib/payments";

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    if (!body || typeof body !== "object") {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    const [payments, bookings] = await Promise.all([
      getPaymentsCollection<PaymentDoc>(),
      getBookingsCollection<BookingDoc>(),
    ]);
    const doc = await recordPayment(payments, bookings, body);
    return Response.json(doc, { status: 201 });
  } catch (err) {
    if (err instanceof BookingValidationError) {
      return Response.json({ error: err.message }, { status: 400 });
    }
    console.error("[app/api/payments POST]", err);
    return Response.json({ error: "Failed to record payment" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const orderId = new URL(request.url).searchParams.get("orderId");
    if (!orderId) return Response.json({ error: "Missing orderId query param" }, { status: 400 });
    const payments = await getPaymentsCollection<PaymentDoc>();
    const list = await getPaymentsForOrder(payments, orderId);
    return Response.json(list, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("[app/api/payments GET]", err);
    return Response.json({ error: "Failed to load payments" }, { status: 500 });
  }
}
