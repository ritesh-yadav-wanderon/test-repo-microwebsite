import { useSyncExternalStore, type MouseEvent, type ReactNode } from "react";
import { useAppNav } from "@/hooks/useAppNav";
import { useTripMode } from "@/context/TripModeContext";
import "./BottomNav.css";

interface BottomNavProps {
  /** "dark" renders the dark pill used on the Events page (Figma 4601:5455). */
  variant?: "light" | "dark";
}

/** WhatsApp chat deep-link — shared with the desktop floating chat button
 *  (DesktopFloatingActions) and this nav's own floating FAB. */
export const WHATSAPP_URL =
  "https://api.whatsapp.com/send?phone=918130288566&text=Hi+WanderOn%2C+I+have+a+query%21";

/** Same active-match rule as react-router's <NavLink>: exact match when
 *  `end`, otherwise the current path or any of its sub-paths. A `to` that
 *  carries a query string (the category tabs) instead matches the current
 *  URL's own query params for those same keys — read straight off
 *  `window.location` since this nav is mounted on pages that don't all wrap
 *  useAppSearchParams()'s provider. */
function isActivePath(pathname: string, search: string | null, to: string, end?: boolean): boolean {
  const [toPath, toQuery] = to.split("?");
  if (toQuery) {
    if (search === null || pathname !== toPath) return false;
    const current = new URLSearchParams(search);
    const wanted = new URLSearchParams(toQuery);
    for (const [key, value] of wanted.entries()) {
      if (current.get(key) !== value) return false;
    }
    return true;
  }
  if (end) return pathname === to;
  return pathname === to || pathname.startsWith(`${to}/`);
}

// Navigation re-renders NavItem via useAppNav(), so no subscription is needed.
const subscribeNoop = () => () => {};

/** Drop-in replacement for react-router's <NavLink> — same active-state
 *  styling and client-side navigation, routed through useAppNav() so this
 *  works identically under Next.js (no <BrowserRouter> ancestor there). */
function NavItem({
  to, end, className, ariaLabel, children, isActive, onNavigate,
}: {
  to: string; end?: boolean; className: string; ariaLabel: string; children: ReactNode;
  /** Overrides the path-based active match (trip-mode tabs share "/"). */
  isActive?: boolean;
  /** Runs before navigating (e.g. switching trip mode). */
  onNavigate?: () => void;
}) {
  const nav = useAppNav();
  // Server snapshot is null (no window.location) so the first client render
  // matches the SSR markup; the query-param match applies right after hydration.
  const search = useSyncExternalStore(subscribeNoop, () => window.location.search, () => null);
  const active = isActive ?? isActivePath(nav.pathname, search, to, end);

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    onNavigate?.();
    nav.push(to);
  }

  return (
    <a
      href={to}
      className={`${className}${active ? " bn-item--active" : ""}`}
      aria-label={ariaLabel}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}

/** Trip-type switcher (Figma 8264:7794) — replaces the previous Events/
 *  Compare/Trips/Account/Chat tab set. Account moved into BurgerMenu's
 *  "My Account" CTA; Compare moved into BurgerMenu's nav list; Chat is now
 *  a floating WhatsApp button over the pill instead of a tab. */
export default function BottomNav({ variant = "light" }: BottomNavProps) {
  const dark = variant === "dark";
  const P = "/figma/nav2/";
  const nav = useAppNav();
  const { isPrivate, setPrivate } = useTripMode();
  // Private and Group trips both open the home page, in their own trip mode.
  const onHome = nav.pathname === "/";

  return (
    <nav className={`bottom-nav${dark ? " bottom-nav--dark" : ""}`} aria-label="Primary">
      <a
        className="bn-wa-fab"
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <img src="/figma/nav/whatsapp-btn.svg" alt="" className="bn-wa-fab-img" aria-hidden />
      </a>

      <div className={`bn-pill${dark ? " bn-pill--dark" : ""}`}>

        <NavItem
          to="/"
          className="bn-item"
          ariaLabel="Private trips"
          isActive={onHome && isPrivate}
          onNavigate={() => setPrivate(true)}
        >
          <span className="bn-ico">
            <img src={`${P}icon-private-trips.svg`} width={20} height={20} alt="" aria-hidden loading="eager" />
          </span>
          <span className="bn-label">Private trips</span>
        </NavItem>

        <NavItem
          to="/search?category=weekend-trips"
          className="bn-item bn-item--weekend"
          ariaLabel="Weekend trips"
          onNavigate={() => setPrivate(false)}
        >
          <span className="bn-ico">
            <img src={`${P}icon-weekend-trips.svg`} width={20} height={20} alt="" aria-hidden loading="eager" />
          </span>
          <span className="bn-label">Weekend trips</span>
        </NavItem>

        <NavItem
          to="/"
          end
          className="bn-item"
          ariaLabel="Group trips"
          isActive={onHome && !isPrivate}
          onNavigate={() => setPrivate(false)}
        >
          <span className="bn-ico">
            <img src={`${P}icon-group-trips.svg`} width={20} height={20} alt="" aria-hidden loading="eager" />
          </span>
          <span className="bn-label">Group trips</span>
        </NavItem>

        <NavItem to="/events" className="bn-item" ariaLabel="Events">
          <span className="bn-ico">
            <img src={`${P}icon-events.svg`} width={20} height={20} alt="" aria-hidden loading="eager" />
          </span>
          <span className="bn-label">Events</span>
        </NavItem>

        <div className="bn-promo" aria-hidden>
          <img src={`${P}promo-japan-f1.png`} alt="" loading="lazy" />
        </div>

      </div>
    </nav>
  );
}
