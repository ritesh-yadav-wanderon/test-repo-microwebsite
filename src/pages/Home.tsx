import { useEffect, useState } from "react";
import type { ApiSource, TripGroup } from "../types";
import HeroSection from "../components/HeroSection";
import CategoryStrip from "../components/CategoryStrip";
import DestinationStrip from "../components/DestinationStrip";
import UpcomingTrips from "../components/UpcomingTrips";
import OriginalsSection from "../components/OriginalsSection";
import PlotBanner from "../components/PlotBanner";
import TribeStories from "../components/TribeStories";
import TheSeat from "../components/TheSeat";
import CreateMoments from "../components/CreateMoments";
import QueryBanner from "../components/QueryBanner";
import FooterMessage from "../components/FooterMessage/FooterMessage";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";
import { CATEGORY_THEMES } from "../categoryThemes";
import {
  getUpcomingTrips,
  getSampleDomestic,
  getSampleInternational,
} from "../api";
import "./Home.css";

export default function Home() {
  const [trips, setTrips] = useState<TripGroup[]>([]);
  const [source, setSource] = useState<ApiSource | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(0);

  const domestic = getSampleDomestic();
  const international = getSampleInternational();

  const categoryName = CATEGORY_THEMES[activeCategory]?.name ?? "All Trips";
  const theme = CATEGORY_THEMES[activeCategory] ?? CATEGORY_THEMES[0];

  const filteredDomestic = activeCategory === 0
    ? domestic
    : domestic.filter((d) => d.categories?.includes(categoryName));

  const filteredInternational = activeCategory === 0
    ? international
    : international.filter((d) => d.categories?.includes(categoryName));

  useEffect(() => {
    let alive = true;
    getUpcomingTrips().then(({ data, source }) => {
      if (!alive) return;
      setTrips(data);
      setSource(source);
      setLoading(false);
    });
    return () => { alive = false; };
  }, []);

  return (
    <>
      <HeroSection onSearchClick={() => window.dispatchEvent(new CustomEvent("wanderon:open-search"))} />
      <CategoryStrip active={activeCategory} onChange={setActiveCategory} />
      <DestinationStrip
        title="Domestic Destinations"
        items={filteredDomestic}
        destIcoBg={theme.destIcoBg}
      />
      <DestinationStrip
        title="International Destinations"
        items={filteredInternational}
        destIcoBg={theme.destIcoBg}
      />
      <UpcomingTrips trips={trips} loading={loading} source={source} activeCategory={activeCategory} />
      <OriginalsSection />
      <PlotBanner />
      <TribeStories />
      <TheSeat />
      <CreateMoments />
      <QueryBanner />
      <FooterMessage />
      <Footer />
      <BottomNav />
    </>
  );
}
