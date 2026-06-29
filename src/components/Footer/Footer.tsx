import type { ReactNode } from "react";
import "./Footer.css";

const GROUPS = [
  "India Packages",
  "International Packages",
  "WanderOn Special",
  "Company",
] as const;

function Chevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const SOCIALS: Array<{ label: string; bg: string; icon: ReactNode }> = [
  {
    label: "Instagram",
    bg: "linear-gradient(135deg,#f9a84d 0%,#e5386d 50%,#c42ca6 100%)",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="#fff" strokeWidth="2.2" />
        <circle cx="12" cy="12" r="4" stroke="#fff" strokeWidth="2.2" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="#fff" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    bg: "#1877f2",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff" aria-hidden>
        <path d="M14 8.5h2.2V5.3h-2.6C11.3 5.3 10 6.9 10 9v1.5H8v3h2V21h3.2v-7.5h2.3l.4-3H13.2V9c0-.4.2-.5.6-.5z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    bg: "#0a66c2",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff" aria-hidden>
        <path d="M6.5 8.3a1.6 1.6 0 100-3.2 1.6 1.6 0 000 3.2zM5.1 9.6h2.8V19H5.1zM10 9.6h2.7v1.3h.04c.38-.7 1.3-1.5 2.7-1.5 2.9 0 3.4 1.9 3.4 4.3V19h-2.8v-4.2c0-1 0-2.3-1.4-2.3s-1.6 1.1-1.6 2.2V19H10z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    bg: "#ff0000",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff" aria-hidden>
        <path d="M22 12s0-3-.4-4.4a2.5 2.5 0 00-1.8-1.8C18.4 5.4 12 5.4 12 5.4s-6.4 0-7.8.4A2.5 2.5 0 002.4 7.6C2 9 2 12 2 12s0 3 .4 4.4a2.5 2.5 0 001.8 1.8c1.4.4 7.8.4 7.8.4s6.4 0 7.8-.4a2.5 2.5 0 001.8-1.8C22 15 22 12 22 12zm-12 2.8V9.2L15 12z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="ft-accent" aria-hidden />

      <div className="ft-inner">
        <ul className="ft-accordion">
          {GROUPS.map((g) => (
            <li className="ft-row-wrap" key={g}>
              <button className="ft-row" type="button">
                <span>{g}</span>
                <span className="ft-chev">
                  <Chevron />
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="ft-company">
          <h4 className="ft-name">WANDERON EXPERIENCES PVT LTD</h4>
          <p className="ft-address">
            3rd Floor, Building No-436, Phase IV, Udyog Vihar,
            <br />
            Sector-18, Gurugram, Haryana-122015
          </p>
          <div className="ft-contact">
            <a href="mailto:hello@wanderon.in">hello@wanderon.in</a>
            <a href="https://www.wanderon.in">www.wanderon.in</a>
            <a href="tel:+919090403075">+91-9090403075</a>
          </div>

          <div className="ft-socials">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                className="ft-social"
                href="#"
                aria-label={s.label}
                style={{ background: s.bg }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <svg
          className="ft-skyline"
          viewBox="0 0 358 70"
          preserveAspectRatio="none"
          aria-hidden
        >
          <g fill="currentColor">
            <rect x="2" y="40" width="10" height="30" />
            <rect x="14" y="30" width="8" height="40" />
            <rect x="24" y="48" width="14" height="22" />
            <polygon points="46,70 54,34 62,70" />
            <rect x="50" y="20" width="4" height="20" />
            <rect x="68" y="44" width="18" height="26" />
            <rect x="90" y="36" width="10" height="34" />
            <rect x="104" y="50" width="20" height="20" />
            <path d="M132 70 L132 42 Q142 28 152 42 L152 70 Z" />
            <rect x="140" y="20" width="4" height="22" />
            <rect x="160" y="46" width="16" height="24" />
            <circle cx="190" cy="44" r="14" />
            <rect x="188" y="44" width="4" height="26" />
            <rect x="210" y="38" width="12" height="32" />
            <polygon points="226,70 236,30 246,70" />
            <rect x="252" y="48" width="22" height="22" />
            <rect x="278" y="34" width="10" height="36" />
            <rect x="292" y="50" width="16" height="20" />
            <rect x="312" y="42" width="12" height="28" />
            <polygon points="328,70 336,36 344,70" />
            <rect x="348" y="46" width="8" height="24" />
          </g>
        </svg>

        <p className="ft-copy">
          © WANDERON EXPERIENCES PVT LTD, All rights reserved.
        </p>
      </div>
    </footer>
  );
}
