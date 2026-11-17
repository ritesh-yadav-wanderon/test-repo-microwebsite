import { getProductListServer } from "./_lib/productListServer";
import { getIsPrivateMode } from "./_lib/tripMode";
import HomePageClient from "./HomePageClient";

// Live product data (server-fetched from Mongo on every request) — must not
// be statically prerendered once at build time.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Private-trip mode lists customised trips ("Top picked choices"); group
  // mode lists fixed departures ("Upcoming Group trips").
  const isPrivate = await getIsPrivateMode();
  const initialData = await getProductListServer({ tripType: isPrivate ? "private" : "group" });

  return <HomePageClient initialData={initialData} />;
}
