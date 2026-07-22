import { useState } from "react";
import { useLocation } from "react-router-dom";
import "./Footer.css";

const DEST_TABS = [
  {
    label: "India trips",
    items: [
      "Ladakh", "Spiti Valley", "Meghalaya",
      "Zanskar", "Kashmir", "Himachal Pradesh",
      "Andaman", "Kerala", "Rajasthan",
      "Nagaland",
    ],
  },
  {
    label: "International trips",
    items: [
      "Iceland", "Japan", "Bhutan",
      "Bali", "Thailand", "Vietnam",
      "Maldives", "Turkey", "Georgia",
      "New Zealand",
    ],
  },
  {
    label: "Wanderon special",
    items: [
      "Bike Trips", "Treks", "Wildlife Safaris",
      "Photography", "Camping", "Heritage Trails",
      "Wellness", "River Rafting",
    ],
  },
];

const QUICK_LINKS = [
  "Terms & conditions",
  "Customer success & support",
  "Investor Relations",
  "Careers",
];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z]+/g, "");

/**
 * Pick the destination tab (India / International / Special) that matches the
 * destination in the current route's path. Falls back to India (0).
 */
function tabFromPath(pathname: string): number {
  const p = norm(pathname);
  for (let i = 0; i < DEST_TABS.length; i++) {
    if (DEST_TABS[i].items.some((item) => p.includes(norm(item)))) return i;
  }
  return 0;
}

export default function Footer() {
  const { pathname } = useLocation();
  const [activeTab, setActiveTab] = useState(() => tabFromPath(pathname));

  return (
    <footer className="ft-root">
      <div className="ft-inner">

        {/* ── Section 1: Inspiration / Destinations ── */}
        <section className="ft-section">
          <h2 className="ft-title-lg">Inspiration for your next escape</h2>
          <div className="ft-dest">
            <div className="ft-tabs-wrap">
              <div className="ft-tabs">
                {DEST_TABS.map((tab, i) => (
                  <button
                    key={tab.label}
                    type="button"
                    className={`ft-tab${activeTab === i ? " ft-tab--active" : ""}`}
                    onClick={() => setActiveTab(i)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="ft-tab-sep" />
            </div>
            <div className="ft-dest-grid">
              {DEST_TABS[activeTab].items.map((d) => (
                <a key={d} href="#" className="ft-dest-cell">{d}</a>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 2: Quick Links ── */}
        <section className="ft-section">
          <div className="ft-section-head">
            <h2 className="ft-title-sm">Quick links</h2>
            <div className="ft-sep" />
          </div>
          <ul className="ft-links">
            {QUICK_LINKS.map((l) => (
              <li key={l}>
                <a href="#" className="ft-link">{l}</a>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Section 3: Company (Figma 5259:5482) ── */}
        <section className="ft-company">
          <div className="ft-company-block">
            <div className="ft-company-identity">
              <p className="ft-company-name">WANDERON EXPERIENCES PVT LTD</p>
              <p className="ft-company-addr">
                3rd Floor, Building No-436, Phase IV, Udyog Vihar,
                <br />
                Sector-18, Gurugram, Haryana-122015
              </p>
              <div className="ft-social">
                <a className="ft-social-link" href="https://www.instagram.com/wanderon.in" target="_blank" rel="noreferrer" aria-label="Instagram">
                  <img src="/figma/footer/ig-black.svg" alt="" className="ft-social-ig" />
                </a>
                <a className="ft-social-link" href="https://www.facebook.com/wanderon.in" target="_blank" rel="noreferrer" aria-label="Facebook">
                  <img src="/figma/footer/fb-black.svg" alt="" className="ft-social-fb" />
                </a>
                <a className="ft-social-link" href="https://www.linkedin.com/company/wanderon" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <img src="/figma/footer/li-black.svg" alt="" className="ft-social-li" />
                </a>
                <a className="ft-social-link" href="https://www.youtube.com/@WanderOn" target="_blank" rel="noreferrer" aria-label="YouTube">
                  <img src="/figma/footer/yt-black.png" alt="" className="ft-social-yt" />
                </a>
              </div>
            </div>
            <div className="ft-contact">
              <a href="mailto:hello@wanderon.in">hello@wanderon.in</a>
              <a href="https://www.wanderon.in" target="_blank" rel="noreferrer">www.wanderon.in</a>
              <a href="tel:+919090403075">+91-9090403075</a>
            </div>
          </div>
          <p className="ft-copy">{`© WANDERON EXPERIENCES PVT LTD,  All rights reserved.`}</p>
        </section>

      </div>
    </footer>
  );
}
