import { useEffect, useState } from "react";
import { WHATSAPP_URL } from "../BottomNav/BottomNav";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import { getScrollTop, onAppScroll, scrollAppToTop } from "../../utils/scroll";
import "./DesktopFloatingActions.css";

/** Floating WhatsApp chat + scroll-to-top buttons pinned 40px from the
 *  bottom-right corner. They fade in after the page is first scrolled.
 *  Desktop-only — the mobile bottom nav already carries the Chat tab. */
export default function DesktopFloatingActions() {
  const isDesktop = useIsDesktop();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(getScrollTop() > 8);
    onScroll();
    return onAppScroll(onScroll);
  }, []);

  if (!isDesktop) return null;

  return (
    <div className={`dfa${visible ? " dfa--visible" : ""}`} aria-hidden={!visible}>
      <button
        type="button"
        className="dfa__btn dfa__btn--top"
        onClick={() => scrollAppToTop("smooth")}
        aria-label="Scroll to top"
        tabIndex={visible ? 0 : -1}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="m5 12 5-5 5 5" stroke="#202020" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <a
        className="dfa__btn dfa__btn--wa"
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        tabIndex={visible ? 0 : -1}
      >
        <img src="/figma/cancel/icon-whatsapp.svg" alt="" />
      </a>
    </div>
  );
}
