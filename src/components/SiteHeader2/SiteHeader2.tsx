import { useState } from "react";
import SearchBottomSheet from "../SearchBottomSheet/SearchBottomSheet";
import BurgerMenu from "../BurgerMenu/BurgerMenu";
import "./SiteHeader2.css";

interface SiteHeader2Props {
  destination?: string;
  date?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export default function SiteHeader2({ destination, date, showBack = false, onBack }: SiteHeader2Props) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="sh2">
        {showBack && (
          <button className="sh2-back" type="button" onClick={onBack} aria-label="Go back">
            <img src="/figma/page-header/icon-arrow-back.svg" alt="" className="sh2-back-icon" aria-hidden />
          </button>
        )}
        <button className="sh2-pill" type="button" onClick={() => setSearchOpen(true)} aria-label="Open search">
          <div className="sh2-pane">
            <img src="/figma/page-header/icon-location.svg" alt="" className="sh2-pane-icon" aria-hidden />
            <span className={`sh2-pane-text${!destination ? " sh2-pane-text--placeholder" : ""}`}>{destination ?? "Where to?"}</span>
          </div>
          <div className="sh2-divider" aria-hidden />
          <div className="sh2-pane">
            <img src="/figma/page-header/icon-calendar.svg" alt="" className="sh2-pane-icon" aria-hidden />
            <span className={`sh2-pane-text${!date ? " sh2-pane-text--placeholder" : ""}`}>{date ?? "Any date"}</span>
          </div>
          <img src="/figma/page-header/btn-search.svg" alt="" className="sh2-search-btn" aria-hidden />
        </button>
        <button className="sh2-menu" type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <img src="/figma/page-header/icon-menu.svg" alt="" className="sh2-menu-icon" aria-hidden />
        </button>
      </div>
      <SearchBottomSheet isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <BurgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
