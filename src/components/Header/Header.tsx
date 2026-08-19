import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getScrollTop, onAppScroll } from "../../utils/scroll";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

export interface HeaderProps {
  visible: boolean;
  onSearch?: () => void;
  onMenu?: () => void;
}

export default function Header({ visible, onMenu }: HeaderProps) {
  const tab = visible ? 0 : -1;
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  // Add a blurred backdrop to the header once the user starts scrolling.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(getScrollTop() > 4);
    onScroll();
    return onAppScroll(onScroll);
  }, []);

  return (
    <header
      className={`site-header${visible ? " site-header--visible" : " site-header--hidden"}${
        scrolled ? " site-header--scrolled" : ""
      }`}
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
        {isLoggedIn && (
          <button
            className="site-header__account"
            type="button"
            aria-label="Open my account"
            tabIndex={tab}
            onClick={() => navigate("/profile")}
          >
            <img src="/figma/page-header/icon-account.svg" alt="" aria-hidden />
          </button>
        )}
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
