import searchBtnIcon from "../../assets/on-scroll-nav/search-btn.svg";
import "./Header.css";

export interface HeaderProps {
  visible: boolean;
  onSearch?: () => void;
}

export default function Header({ visible, onSearch }: HeaderProps) {
  const tab = visible ? 0 : -1;

  return (
    <header
      className={`site-header${visible ? " site-header--visible" : " site-header--hidden"}`}
      aria-hidden={!visible}
    >
      <a className="site-header__logo" href="/" aria-label="WanderOn home" tabIndex={tab}>
        <img src="/figma/logo.png" alt="WanderOn" width="50" height="50" />
      </a>

      <div className="site-header__actions">
        <button
          className="site-header__search"
          type="button"
          aria-label="Search"
          tabIndex={tab}
          onClick={onSearch}
        >
          <img src={searchBtnIcon} width={36} height={36} alt="" aria-hidden />
        </button>

        <button
          className="site-header__avatar"
          type="button"
          aria-label="Account"
          tabIndex={tab}
        >
          <svg viewBox="0 0 36 36" width="36" height="36" aria-hidden>
            <circle cx="18" cy="18" r="18" fill="rgba(255,255,255,0.92)" />
            <circle cx="18" cy="14.6" r="4.4" fill="#3d3d3d" />
            <path d="M9.8 27c0-4.4 3.9-6.6 8.2-6.6s8.2 2.2 8.2 6.6z" fill="#3d3d3d" />
          </svg>
        </button>
      </div>

      <img
        src="/figma/header-bg-graphic.png"
        alt=""
        className="site-header__graphic"
        aria-hidden
      />
    </header>
  );
}
