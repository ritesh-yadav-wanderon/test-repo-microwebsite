// Payment transactions — framework-agnostic, used by /api/payments.
//
// Every Razorpay payment is stored in the `payments` collection alongside
// the booking it pays for, linked by the shared `orderId`. Recording a
// payment also marks that booking paid and stamps it with the payer's
// mobile number + email (the user identifier), so the two records always
// agree on who the order belongs to.

import type { Collection } from "mongodb";
import { toUserContact } from "../../src/utils/contact";
import { BookingValidationError, type BookingDoc } from "./bookings";

export interface PaymentDoc {
  orderId: string;
  /** Razorpay payment id (`pay_…`) — unique per transaction. */
  paymentId: string;
  /** Razorpay order id, when Checkout was opened against a server order. */
  razorpayOrderId?: string;
  /** Amount in rupees. */
  amount: number;
  currency: string;
  status: "captured";
  /** Paid with an rzp_test_* key — no real money moved. */
  test: boolean;
  phone: string;
  email: string;
  name?: string;
  createdAt: string;
}

export interface RecordPaymentInput {
  orderId?: unknown;
  paymentId?: unknown;
  razorpayOrderId?: unknown;
  amount?: unknown;
  currency?: unknown;
  test?: unknown;
  phone?: unknown;
  email?: unknown;
  name?: unknown;
}

/** Validate, store the payment (idempotent on `paymentId`), and mark the
 *  booking it belongs to as paid. */
export async function recordPayment(
  payments: Collection<PaymentDoc>,
  bookings: Collection<BookingDoc>,
  input: RecordPaymentInput
): Promise<PaymentDoc> {
  const orderId = typeof input.orderId === "string" ? input.orderId.trim() : "";
  const paymentId = typeof input.paymentId === "string" ? input.paymentId.trim() : "";
  const amount = Number(input.amount);
  if (!orderId) throw new BookingValidationError("Missing orderId");
  if (!paymentId) throw new BookingValidationError("Missing paymentId");
  if (!Number.isFinite(amount) || amount <= 0) throw new BookingValidationError("Invalid amount");

  const contact = toUserContact(input.phone, input.email);
  if (!contact) {
    throw new BookingValidationError("A payment needs the payer's mobile number and email");
  }

  const now = new Date().toISOString();
  const doc: PaymentDoc = {
    orderId,
    paymentId,
    ...(typeof input.razorpayOrderId === "string" && input.razorpayOrderId
      ? { razorpayOrderId: input.razorpayOrderId }
      : {}),
    amount,
    currency: typeof input.currency === "string" && input.currency ? input.currency : "INR",
    status: "captured",
    test: input.test === true,
    ...contact,
    ...(typeof input.name === "string" && input.name.trim() ? { name: input.name.trim() } : {}),
    createdAt: now,
  };

  // A retried request for the same Razorpay payment must not double-count.
  await payments.updateOne({ paymentId }, { $setOnInsert: doc }, { upsert: true });

  await bookings.updateOne(
    { orderId },
    {
      $set: { status: "paid", ...contact, updatedAt: now },
      $addToSet: { paymentIds: paymentId },
      $setOnInsert: { orderId, createdAt: now },
    },
    { upsert: true }
  );

  return doc;
}

export async function getPaymentsForOrder(
  payments: Collection<PaymentDoc>,
  orderId: string
): Promise<PaymentDoc[]> {
  return payments.find({ orderId }, { projection: { _id: 0 } }).sort({ createdAt: 1 }).toArray();
}
