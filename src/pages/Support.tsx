import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { ProfileRail, ProfileHeader } from "../components/desktop/DesktopProfile";
import { getLastMainPage } from "../utils/lastMainPage";
import ProfileWatermark from "../components/desktop/ProfileWatermark";
import FooterMessage from "../components/FooterMessage/FooterMessage";
import "../components/desktop/DesktopProfile.css";
import "./Support.css";

const S = "/figma/support/";
const P = "/figma/profile/";

type TabKey = "raise" | "open" | "resolved";

const TABS: { key: TabKey; label: string }[] = [
  { key: "raise", label: "Raise Ticket" },
  { key: "open", label: "Open Ticket" },
  { key: "resolved", label: "Resolved Ticket" },
];

interface Ticket {
  id: string;
  text: string;
  file?: string;
  date: string;
  status: "open" | "resolved";
}

const STORAGE_KEY = "wanderon_tickets";

function loadTickets(): Ticket[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function useTickets() {
  const [tab, setTab] = useState<TabKey>("raise");
  const [tickets, setTickets] = useState<Ticket[]>(loadTickets);
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const raise = () => {
    if (!text.trim()) return;
    const next: Ticket[] = [
      {
        id: `TKT${Date.now()}`,
        text: text.trim(),
        file: fileName ?? undefined,
        date: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        status: "open",
      },
      ...tickets,
    ];
    setTickets(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setText("");
    setFileName(null);
    if (fileRef.current) fileRef.current.value = "";
    setTab("open");
  };

  return { tab, setTab, tickets, text, setText, fileName, setFileName, fileRef, raise };
}

type TicketsState = ReturnType<typeof useTickets>;

/** Ticket form card + submit button (shared by mobile and desktop). */
function TicketPanel({ state }: { state: TicketsState }) {
  const { tab, tickets, text, setText, fileName, setFileName, fileRef, raise } = state;

  if (tab !== "raise") {
    const status = tab === "open" ? "open" : "resolved";
    const list = tickets.filter((t) => t.status === status);
    if (list.length === 0) {
      return <p className="sup-empty">No {status} tickets yet.</p>;
    }
    return (
      <div className="sup-list">
        {list.map((t) => (
          <article className="sup-ticket" key={t.id}>
            <div className="sup-ticket-top">
              <span className="sup-ticket-id">{t.id}</span>
              <span className={`sup-ticket-status sup-ticket-status--${t.status}`}>
                {t.status === "open" ? "Open" : "Resolved"}
              </span>
            </div>
            <p className="sup-ticket-text">{t.text}</p>
            <span className="sup-ticket-date">Raised on {t.date}</span>
          </article>
        ))}
      </div>
    );
  }

  return (
    <>
      <section className="sup-card">
        <div className="sup-card-mail">
          <img src={`${S}icon-mail.svg`} width={20} height={20} alt="" aria-hidden />
          <span>support@wanderon.in</span>
        </div>
        <div className="sup-card-issue">Issue: Customer Support Request</div>
        <div className="sup-card-body">
          <button
            className="sup-attach"
            type="button"
            onClick={() => fileRef.current?.click()}
          >
            <img src={`${S}icon-attachment.svg`} width={20} height={20} alt="" aria-hidden />
            <span>{fileName ?? "Attach a File"}</span>
          </button>
          <input
            ref={fileRef}
            type="file"
            hidden
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
          />
          <textarea
            className="sup-textarea"
            placeholder="Describe Your Issue"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <p className="sup-note">You will receive a response in 1 working day.</p>
        </div>
      </section>

      <button
        className="sup-submit"
        type="button"
        disabled={!text.trim()}
        onClick={raise}
      >
        Raise Ticket
      </button>
    </>
  );
}

function TabBar({ state, className }: { state: TicketsState; className: string }) {
  return (
    <nav className={className} aria-label="Support tickets">
      {TABS.map((t) => (
        <button
          key={t.key}
          type="button"
          className={`sup-tab${state.tab === t.key ? " sup-tab--active" : ""}`}
          onClick={() => state.setTab(t.key)}
        >
          {t.label}
        </button>
      ))}
    </nav>
  );
}

/** Desktop Help & Support — profile shell + tickets panel (Figma 6454:9447). */
function DesktopSupport() {
  const state = useTickets();

  return (
    <div className="dpr sup">
      <ProfileHeader />

      <div className="dpr-body">
        <ProfileRail />

        <div className="sup-panel">
          <TabBar state={state} className="sup-tabs" />
          <TicketPanel state={state} />
        </div>
      </div>

      {/* Grey sign-off — page level, aligned with the content gutter */}
      <ProfileWatermark />

      <footer className="dpr-footer">
        <p>&copy; WANDERON EXPERIENCES PVT LTD, All rights reserved.</p>
      </footer>
    </div>
  );
}

/** Help & Support page — mobile layout with the desktop panel above 1024px. */
export default function Support() {
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const state = useTickets();

  if (isDesktop) return <DesktopSupport />;

  return (
    <div className="sup-m">
      <header className="sup-m-nav">
        <div className="sup-m-nav-left">
          <button
            className="sup-m-back"
            type="button"
            aria-label="Back"
            onClick={() => navigate("/profile")}
          >
            <img src={`${P}icon-arrow-back.svg`} width={24} height={24} alt="" aria-hidden />
          </button>
          <span className="sup-m-title">Help &amp; Support</span>
        </div>
        <button
          className="sup-m-close"
          type="button"
          aria-label="Back to website"
          onClick={() => navigate(getLastMainPage())}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M6 6l12 12M18 6 6 18" stroke="#202020" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      <TabBar state={state} className="sup-m-tabs" />

      <div className="sup-m-body">
        <TicketPanel state={state} />
        <FooterMessage />
      </div>
    </div>
  );
}
