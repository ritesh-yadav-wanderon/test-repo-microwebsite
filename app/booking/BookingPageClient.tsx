"use client";

import { BookingView } from "../../src/views/Booking";
import type { BookingDraft } from "../../src/repositories";
import NextSearchParamsProvider from "../NextSearchParamsProvider";

export default function BookingPageClient({
  initialDraftData,
}: {
  initialDraftData: BookingDraft | null;
}) {
  return (
    <NextSearchParamsProvider>
      <BookingView initialDraftData={initialDraftData} />
    </NextSearchParamsProvider>
  );
}
