import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Header";
import OnScrollTopNav from "../OnScrollTopNav";
import SearchBottomSheet from "../SearchBottomSheet/SearchBottomSheet";
import BurgerMenu from "../BurgerMenu/BurgerMenu";
import FilterSheet from "../FilterSheet/FilterSheet";
import WishlistSheet from "../WishlistSheet/WishlistSheet";
import LoginSheet from "../LoginSheet/LoginSheet";
import ContactFormSheet from "../ContactFormSheet/ContactFormSheet";
import { useScrollNav } from "../../hooks/useScrollNav";

export default function SiteChrome() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const isSearch = location.pathname.startsWith("/search");
  const { showHeroHeader, showScrollHeader } = useScrollNav(isHome);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [enquireOpen, setEnquireOpen] = useState(false);
  const loginRedirectRef = useRef<string | null>(null);

  useEffect(() => {
    const onSearch = () => setSearchOpen(true);
    const onFilter = () => setFilterOpen(true);
    const onWishlist = () => setWishlistOpen(true);
    const onEnquire = () => setEnquireOpen(true);
    const onLogin = (e: Event) => {
      const detail = (e as CustomEvent<{ redirectTo?: string }>).detail;
      loginRedirectRef.current = detail?.redirectTo ?? null;
      setLoginOpen(true);
    };

    window.addEventListener("wanderon:open-search", onSearch);
    window.addEventListener("wanderon:open-filter", onFilter);
    window.addEventListener("wanderon:open-wishlist", onWishlist);
    window.addEventListener("wanderon:open-enquire", onEnquire);
    window.addEventListener("wanderon:open-login", onLogin);
    return () => {
      window.removeEventListener("wanderon:open-search", onSearch);
      window.removeEventListener("wanderon:open-filter", onFilter);
      window.removeEventListener("wanderon:open-wishlist", onWishlist);
      window.removeEventListener("wanderon:open-enquire", onEnquire);
      window.removeEventListener("wanderon:open-login", onLogin);
    };
  }, []);

  function handleLoginSuccess() {
    const redirect = loginRedirectRef.current;
    loginRedirectRef.current = null;
    if (redirect) navigate(redirect);
  }

  const openSearch = () => setSearchOpen(true);
  const openMenu = () => setMenuOpen(true);

  return (
    <>
      <LoginSheet
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={handleLoginSuccess}
      />
      <SearchBottomSheet isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <BurgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <WishlistSheet isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} />
      <ContactFormSheet isOpen={enquireOpen} onClose={() => setEnquireOpen(false)} />
      {!isSearch && <FilterSheet isOpen={filterOpen} onClose={() => setFilterOpen(false)} />}
      {isHome && <Header visible={showHeroHeader} onSearch={openSearch} onMenu={openMenu} />}
      {isHome && (
        <OnScrollTopNav
          visible={showScrollHeader}
          isHome={isHome}
          onBack={() => navigate(-1)}
          onSearch={openSearch}
          onBurger={openMenu}
        />
      )}
    </>
  );
}
