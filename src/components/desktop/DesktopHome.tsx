import { useState } from "react";
import type { ApiSource, TripGroup } from "../../types";
import DesktopNav from "./DesktopNav";
import DesktopHero from "./DesktopHero";
import DesktopCategoryTabs from "./DesktopCategoryTabs";
import DesktopDestinations from "./DesktopDestinations";
import DesktopTrips from "./DesktopTrips";
import DesktopWhyChooseUs from "./DesktopWhyChooseUs";
import DesktopDestBanner from "./DesktopDestBanner";
import DesktopPlot from "./DesktopPlot";
import DesktopWhyTravellers from "./DesktopWhyTravellers";
import DesktopOriginals from "./DesktopOriginals";
import DesktopQuery from "./DesktopQuery";
import DesktopFooterMsg from "./DesktopFooterMsg";
import "./DesktopHome.css";

interface Props {
  trips: TripGroup[];
  loading: boolean;
  source: ApiSource | null;
}

/** Desktop (≥1024px) homepage — Figma frame 3394:11762. Rendered by Home
 *  instead of the mobile tree; the mobile layout is untouched. */
export default function DesktopHome({ trips, loading }: Props) {
  const [category, setCategory] = useState(1);

  return (
    <div className="dhome">
      <DesktopNav />
      <DesktopHero />
      <DesktopCategoryTabs active={category} onChange={setCategory} />
      <DesktopDestinations />
      <DesktopTrips trips={trips} loading={loading} />
      <DesktopWhyChooseUs />
      <DesktopDestBanner />
      <DesktopPlot />
      <DesktopWhyTravellers />
      <DesktopOriginals />
      <DesktopQuery />
      <DesktopFooterMsg />
    </div>
  );
}
