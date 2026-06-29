import arrowBackIcon     from "../../assets/on-scroll-nav/arrow-back.svg";
import locationOnIcon    from "../../assets/on-scroll-nav/location-on.svg";
import calendarIcon      from "../../assets/on-scroll-nav/calendar-month.svg";
import searchBtnIcon     from "../../assets/on-scroll-nav/search-btn.svg";
import listAltAddIcon    from "../../assets/on-scroll-nav/list-alt-add.svg";
import "./OnScrollTopNav.css";

export interface OnScrollTopNavProps {
  visible: boolean;
  isHome: boolean;
  onBack?: () => void;
  onSearch?: () => void;
}

export default function OnScrollTopNav({ visible, isHome, onBack, onSearch }: OnScrollTopNavProps) {
  const tab = visible ? 0 : -1;

  return (
    <header
      className={`ostn${visible ? " ostn--visible" : " ostn--hidden"}`}
      aria-hidden={!visible}
    >
      {/* Back button — only on non-home pages */}
      {!isHome && (
        <button
          className="ostn-back"
          type="button"
          aria-label="Go back"
          tabIndex={tab}
          onClick={onBack}
        >
          <img src={arrowBackIcon} width={24} height={24} alt="" aria-hidden />
        </button>
      )}

      {/* Search pill: location pane | date pane | teal search btn */}
      <button
        className="ostn-pill"
        type="button"
        aria-label="Open search"
        tabIndex={tab}
        onClick={onSearch}
      >
        <div className="ostn-pane">
          <img src={locationOnIcon} width={16} height={16} alt="" aria-hidden />
          <span className="ostn-pane-text">Where to?</span>
        </div>

        <div className="ostn-pane">
          <img src={calendarIcon} width={16} height={16} alt="" aria-hidden />
          <span className="ostn-pane-text">When?</span>
        </div>

        <span className="ostn-search-btn">
          <img src={searchBtnIcon} width={40} height={40} alt="" aria-hidden />
        </span>
      </button>

      {/* List-alt-add */}
      <button
        className="ostn-list-btn"
        type="button"
        aria-label="Add to list"
        tabIndex={tab}
      >
        <img src={listAltAddIcon} alt="" aria-hidden />
      </button>
    </header>
  );
}
