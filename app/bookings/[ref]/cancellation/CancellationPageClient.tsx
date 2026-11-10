"use client";

import { useParams, useRouter } from "next/navigation";
import { CancellationView } from "../../../../src/views/Cancellation";

export default function CancellationPageClient() {
  const router = useRouter();
  const params = useParams<{ ref: string }>();
  const ref = params.ref || "WON457896";

  return (
    <CancellationView
      bookingRef={ref}
      onBack={() => router.back()}
      onClose={() => router.push(`/bookings/${ref}`)}
      onWithdrawn={() => router.replace(`/bookings/${ref}`)}
    />
  );
}
