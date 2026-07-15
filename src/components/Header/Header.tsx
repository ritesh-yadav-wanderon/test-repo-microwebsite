import "./Header.css";

export interface HeaderProps {
  visible: boolean;
  onSearch?: () => void;
  onMenu?: () => void;
}

export default function Header({ visible, onMenu }: HeaderProps) {
  const tab = visible ? 0 : -1;

  return (
    <header
      className={`site-header${visible ? " site-header--visible" : " site-header--hidden"}`}
      aria-hidden={!visible}
    >
      <a
        className="site-header__logo"
        href="/"
        aria-label="WanderOn home"
        tabIndex={tab}
      >
        <img src="/figma/nav-logo.png" alt="WanderOn" width={50} height={50} />
      </a>

      <div className="site-header__actions">
        <button
          className="site-header__menu"
          type="button"
          aria-label="Open menu"
          tabIndex={tab}
          onClick={onMenu}
        >
          <img src="/figma/nav-menu.svg" width={32} height={16} alt="" aria-hidden />
        </button>
      </div>
    </header>
  );
}
