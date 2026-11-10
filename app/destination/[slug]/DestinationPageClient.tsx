"use client";

import { DestinationView } from "../../../src/views/Destination";
import type { Trip } from "../../../src/types";

export interface DestinationPageClientProps {
  slug: string;
  destTrips: Trip[];
}

export default function DestinationPageClient({ slug, destTrips }: DestinationPageClientProps) {
  return <DestinationView slug={slug} destTrips={destTrips} loading={false} />;
}
