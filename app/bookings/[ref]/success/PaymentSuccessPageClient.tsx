"use client";

import { PaymentSuccessView } from "../../../../src/views/PaymentSuccess";
import type { BookingDraft } from "../../../../src/repositories";

export default function PaymentSuccessPageClient({
  refParam,
  initialData,
}: {
  refParam: string;
  initialData: BookingDraft | null;
}) {
  return <PaymentSuccessView refParam={refParam} initialData={initialData} />;
}
