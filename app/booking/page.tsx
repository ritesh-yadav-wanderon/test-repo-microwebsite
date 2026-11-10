import { getBookingDraftServer } from "../_lib/bookingDraftServer";
import BookingPageClient from "./BookingPageClient";

// Reads the `?orderId=` query param (the draft-fallback path for a reload or a
// hard nav back from personal-details) — must not be statically prerendered.
export const dynamic = "force-dynamic";

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const orderId = Array.isArray(sp.orderId) ? sp.orderId[0] : sp.orderId;
  const initialDraftData = orderId ? await getBookingDraftServer(orderId) : null;

  return <BookingPageClient initialDraftData={initialDraftData} />;
}
