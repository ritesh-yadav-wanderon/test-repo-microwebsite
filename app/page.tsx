import { getProductListServer } from "./_lib/productListServer";
import HomePageClient from "./HomePageClient";
import type { ApiSource, TripGroup } from "../src/types";

// Live product data (server-fetched from Mongo on every request) — must not
// be statically prerendered once at build time.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { items } = await getProductListServer({});
  const trips: TripGroup[] = items.length
    ? [{ title: "Upcoming", year: "", month: "", tripsArray: items }]
    : [];
  const source: ApiSource | null = items.length ? "live" : "sample";

  return <HomePageClient trips={trips} source={source} />;
}
