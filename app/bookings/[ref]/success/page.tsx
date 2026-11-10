import { getBookingDraftServer } from "../../../_lib/bookingDraftServer";
import PaymentSuccessPageClient from "./PaymentSuccessPageClient";

// Live per-booking data — must not be statically prerendered.
export const dynamic = "force-dynamic";

export default async function PaymentSuccessPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = await params;
  const initialData = await getBookingDraftServer(ref);

  return <PaymentSuccessPageClient refParam={ref} initialData={initialData} />;
}
