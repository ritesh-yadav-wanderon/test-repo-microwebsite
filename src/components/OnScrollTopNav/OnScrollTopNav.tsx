import "./OnScrollTopNav.css";

export interface OnScrollTopNavProps {
  visible: boolean;
  isHome: boolean;
  onBack?: () => void;
  onSearch?: () => void;
  onBurger?: () => void;
}

export default function OnScrollTopNav({ visible, isHome, onBack, onSearch, onBurger }: OnScrollTopNavProps) {
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
          <img src="/figma/nav/arrow-back.svg" width={24} height={24} alt="" aria-hidden />
        </button>
      )}

      {/* Search pill */}
      <button
        className="ostn-pill"
        type="button"
        aria-label="Open search"
        tabIndex={tab}
        onClick={onSearch}
      >
        {/* Location pane */}
        <div className="ostn-pane">
          <img src="/figma/listing/location-on.svg" width={16} height={16} alt="" aria-hidden />
          <span className="ostn-pane-text">Where to?</span>
        </div>

        {/* Vertical divider */}
        <div className="ostn-divider" aria-hidden />

        {/* Date pane */}
        <div className="ostn-pane">
          <img src="/figma/listing/calendar-month.svg" width={16} height={16} alt="" aria-hidden />
          <span className="ostn-pane-text">When?</span>
        </div>

        {/* Teal search circle */}
        <div className="ostn-search-circle" aria-hidden>
          <img src="/figma/nav/search-teal.svg" width={40} height={40} alt="" />
        </div>
      </button>

      {/* Burger menu */}
      <button
        className="ostn-burger"
        type="button"
        aria-label="Open menu"
        tabIndex={tab}
        onClick={onBurger}
      >
        <img src="/figma/nav/burger-menu.svg" width={24} height={12} alt="" aria-hidden />
      </button>
    </header>
  );
}
