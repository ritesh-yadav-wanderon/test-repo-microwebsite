import { getBookingDraftServer } from "../../_lib/bookingDraftServer";
import BookingPageClient from "../BookingPageClient";

// Live per-order draft data (`?orderId=`) — must not be statically prerendered.
export const dynamic = "force-dynamic";

export default async function BookingPersonalDetailsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const orderId = Array.isArray(sp.orderId) ? sp.orderId[0] : sp.orderId;
  const initialDraftData = orderId ? await getBookingDraftServer(orderId) : null;

  return <BookingPageClient initialDraftData={initialDraftData} />;
}
