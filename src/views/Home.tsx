import { useMemo, useState } from "react";
import type { ApiSource, TripGroup } from "@/types";
import HeroSection from "@/components/HeroSection";
import DestinationStrip from "@/components/DestinationStrip";
import UpcomingTrips from "@/components/UpcomingTrips";
import OriginalsSection from "@/components/OriginalsSection";
import TribeStories from "@/components/TribeStories";
import PlotBanner from "@/components/PlotBanner";
import WhyWanderon from "@/components/WhyWanderon";
import QueryBanner from "@/components/QueryBanner";
import EndMark from "@/components/ui/EndMark";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { useProductList } from "@/hooks/useProductList";
import DesktopHome from "@/components/desktop/DesktopHome";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import "./Home.css";

export interface HomeViewProps {
  trips: TripGroup[];
  loading: boolean;
  source: ApiSource | null;
  isDesktop: boolean;
}

/** Pure presentational shell — no data-fetching, no react-router/next
 *  imports — shared as-is between the Vite app (via the default export
 *  below) and Next.js (web-next/app/page.tsx + HomePageClient.tsx), which
 *  fetches `trips` server-side instead of via useProductList. */
export function HomeView({ trips, loading, source, isDesktop }: HomeViewProps) {
  const [activeCategory, setActiveCategory] = useState(0);

  if (isDesktop) {
    return <DesktopHome trips={trips} loading={loading} source={source} />;
  }

  return (
    <>
      <HeroSection
        onSearchClick={() => window.dispatchEvent(new CustomEvent("wanderon:open-search"))}
      />
      <DestinationStrip activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      <UpcomingTrips trips={trips} loading={loading} source={source} activeCategory={activeCategory} />
      <OriginalsSection />
      <TribeStories />
      <PlotBanner />
      <WhyWanderon />
      <QueryBanner />
      <EndMark variant="mobile" />
      <Footer />
      <BottomNav />
    </>
  );
}

// ── Vite / React Router wrapper — unchanged route, unchanged behavior ──────
export default function Home() {
  const isDesktop = useIsDesktop();

  // Homepage's "Upcoming Group trips" grid — one page (6 items) from the same
  // product-list service the listing/destination pages use. Wrapped as a
  // single TripGroup since UpcomingTrips flattens groups immediately anyway.
  const { items, loading } = useProductList({});
  const trips: TripGroup[] = useMemo(
    () => (items.length ? [{ title: "Upcoming", year: "", month: "", tripsArray: items }] : []),
    [items]
  );
  const source: ApiSource | null = loading ? null : items.length ? "live" : "sample";

  return <HomeView trips={trips} loading={loading} source={source} isDesktop={isDesktop} />;
}
