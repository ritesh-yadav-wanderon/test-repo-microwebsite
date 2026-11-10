"use client";

import { MyBookingView } from "../../../src/views/MyBooking";
import type { BookingDraft } from "../../../src/repositories";

export default function MyBookingPageClient({
  refParam,
  initialData,
}: {
  refParam: string;
  initialData: BookingDraft | null;
}) {
  return <MyBookingView refParam={refParam} initialData={initialData} />;
}
