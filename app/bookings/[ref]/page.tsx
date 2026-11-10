import { getBookingDraftServer } from "../../_lib/bookingDraftServer";
import MyBookingPageClient from "./MyBookingPageClient";

// Live per-booking data — must not be statically prerendered.
export const dynamic = "force-dynamic";

export default async function MyBookingPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = await params;
  const initialData = await getBookingDraftServer(ref);

  return <MyBookingPageClient refParam={ref} initialData={initialData} />;
}
