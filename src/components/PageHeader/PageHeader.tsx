import { useState } from "react";
import SearchBottomSheet from "../SearchBottomSheet/SearchBottomSheet";
import BurgerMenu from "../BurgerMenu/BurgerMenu";
import "./PageHeader.css";

interface PageHeaderProps {
  location?: string;
  date?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export default function PageHeader({
  location = "Where to?",
  date = "When?",
  showBack = false,
  onBack,
}: PageHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="ph">
        {showBack && (
          <button className="ph-back-btn" type="button" onClick={onBack} aria-label="Go back">
            <img src="/figma/page-header/icon-arrow-back.svg" alt="" className="ph-back-icon" aria-hidden />
          </button>
        )}

        <button className="ph-pill" type="button" onClick={() => setSearchOpen(true)} aria-label="Open search">
          <div className="ph-pane">
            <img src="/figma/page-header/icon-location.svg" alt="" className="ph-pane-icon" aria-hidden />
            <span className="ph-pane-text">{location}</span>
          </div>
          <div className="ph-divider" aria-hidden />
          <div className="ph-pane">
            <img src="/figma/page-header/icon-calendar.svg" alt="" className="ph-pane-icon" aria-hidden />
            <span className="ph-pane-text">{date}</span>
          </div>
          <img src="/figma/page-header/btn-search.svg" alt="" className="ph-search-btn" aria-hidden />
        </button>

        <button className="ph-menu-btn" type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <img src="/figma/page-header/icon-menu.svg" alt="" className="ph-menu-icon" aria-hidden />
        </button>
      </div>

      <SearchBottomSheet isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <BurgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
