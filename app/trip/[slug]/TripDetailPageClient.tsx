"use client";

import { TripDetailView } from "../../../src/views/TripDetail";
import type { ProductData } from "../../../src/repositories";
import NextSearchParamsProvider from "../../NextSearchParamsProvider";

export default function TripDetailPageClient({
  slug,
  initialData,
}: {
  slug: string;
  initialData: ProductData;
}) {
  return (
    <NextSearchParamsProvider>
      <TripDetailView slug={slug} initialData={initialData} />
    </NextSearchParamsProvider>
  );
}
