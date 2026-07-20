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

function SearchBtnIcon() {
  return (
    <svg width="50" height="40" viewBox="4 0 50 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="4" width="50" height="40" rx="20" fill="black"/>
      <rect x="4.5" y="0.5" width="49" height="39" rx="19.5" stroke="#4D4D4D"/>
      <path d="M29.1131 15.9169C29.313 15.6692 29.679 15.6281 29.8947 15.8623C30.1105 16.0965 30.2981 16.3566 30.4513 16.6375C30.6968 17.0876 30.8517 17.5817 30.9063 18.0914C30.9609 18.6012 30.9137 19.1171 30.7691 19.6089C30.6788 19.9157 30.5516 20.21 30.3903 20.4845C30.229 20.7589 29.8616 20.7961 29.6138 20.5964C29.366 20.3965 29.334 20.0352 29.4778 19.7512C29.5536 19.6018 29.6159 19.445 29.6634 19.2835C29.7653 18.9371 29.7971 18.5737 29.7587 18.2147C29.7202 17.8555 29.6114 17.5062 29.4384 17.1891C29.3579 17.0416 29.2643 16.902 29.1588 16.7722C28.958 16.5251 28.9132 16.1648 29.1131 15.9169Z" fill="white"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M27.0237 12C30.6174 12 33.5307 14.9133 33.5307 18.507C33.5307 19.7999 33.1514 21.0032 32.5013 22.016L37.0054 25.6901C37.5621 26.1446 37.644 26.9647 37.1896 27.5215C36.7352 28.0781 35.9163 28.1612 35.3596 27.707L30.6814 23.8893C29.639 24.599 28.3799 25.014 27.0237 25.014C23.43 25.014 20.5167 22.1007 20.5167 18.507C20.5167 14.9133 23.43 12 27.0237 12ZM27.0237 13.3014C24.0111 13.3014 21.8181 15.4944 21.8181 18.507C21.8181 21.5196 24.0111 23.7126 27.0237 23.7126C30.0363 23.7126 32.2293 21.5196 32.2293 18.507C32.2293 15.4944 30.0363 13.3014 27.0237 13.3014Z" fill="white"/>
    </svg>
  );
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
          <div className="sh2-search-btn-wrap" aria-hidden><SearchBtnIcon /></div>
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
