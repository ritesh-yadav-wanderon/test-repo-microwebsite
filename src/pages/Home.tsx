import { useEffect, useState } from "react";
import type { ApiSource, TripGroup } from "../types";
import HeroSection from "../components/HeroSection";
import DestinationStrip from "../components/DestinationStrip";
import UpcomingTrips from "../components/UpcomingTrips";
import OriginalsSection from "../components/OriginalsSection";
import TribeStories from "../components/TribeStories";
import PlotBanner from "../components/PlotBanner";
import QueryBanner from "../components/QueryBanner";
import FooterMessage from "../components/FooterMessage/FooterMessage";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";
import { getUpcomingTrips } from "../api";
import "./Home.css";

export default function Home() {
  const [trips, setTrips] = useState<TripGroup[]>([]);
  const [source, setSource] = useState<ApiSource | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(0);

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
      <HeroSection
        onSearchClick={() => window.dispatchEvent(new CustomEvent("wanderon:open-search"))}
      />
      <DestinationStrip activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      <UpcomingTrips trips={trips} loading={loading} source={source} activeCategory={activeCategory} />
      <OriginalsSection />
      <TribeStories />
      <PlotBanner />
      <QueryBanner />
      <FooterMessage />
      <Footer />
      <BottomNav />
    </>
  );
}
