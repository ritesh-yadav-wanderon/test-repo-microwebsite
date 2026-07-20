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
      {/* Back button — non-home pages only */}
      {!isHome && (
        <button
          className="ostn-back"
          type="button"
          aria-label="Go back"
          tabIndex={tab}
          onClick={onBack}
        >
          <img src="/figma/ostn/icon-arrow-back.svg" width={24} height={24} alt="" aria-hidden />
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
          <img src="/figma/ostn/icon-location.svg" width={16} height={16} alt="" aria-hidden />
          <span className="ostn-pane-text">Where to?</span>
        </div>

        {/* Divider */}
        <div className="ostn-divider" aria-hidden />

        {/* Date pane */}
        <div className="ostn-pane">
          <img src="/figma/ostn/icon-calendar.svg" width={16} height={16} alt="" aria-hidden />
          <span className="ostn-pane-text">When?</span>
        </div>

        {/* Search button — 50×40 black pill */}
        <div className="ostn-search-btn" aria-hidden>
          <img src="/figma/ostn/icon-search.svg" width={50} height={40} alt="" />
        </div>
      </button>

      {/* Burger */}
      <button
        className="ostn-burger"
        type="button"
        aria-label="Open menu"
        tabIndex={tab}
        onClick={onBurger}
      >
        <img src="/figma/ostn/icon-burger.svg" width={33} height={18} alt="" aria-hidden />
      </button>
    </header>
  );
}
