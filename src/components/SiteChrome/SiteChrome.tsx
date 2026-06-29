import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Header";
import OnScrollTopNav from "../OnScrollTopNav";
import SearchBottomSheet from "../SearchBottomSheet/SearchBottomSheet";
import { useScrollNav } from "../../hooks/useScrollNav";

export default function SiteChrome() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const isTripDetail = location.pathname.startsWith("/trip/");
  const { showHeroHeader, showScrollHeader } = useScrollNav(isHome);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handler = () => setSearchOpen(true);
    window.addEventListener("wanderon:open-search", handler);
    return () => window.removeEventListener("wanderon:open-search", handler);
  }, []);

  const openSearch = () => setSearchOpen(true);

  return (
    <>
      <SearchBottomSheet isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      {!isTripDetail && <Header visible={showHeroHeader} onSearch={openSearch} />}
      {!isTripDetail && (
        <OnScrollTopNav
          visible={showScrollHeader}
          isHome={isHome}
          onBack={() => navigate(-1)}
          onSearch={openSearch}
        />
      )}
    </>
  );
}
