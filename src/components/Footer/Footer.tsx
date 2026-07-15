import { useState } from "react";
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

export default function Footer() {
  const [activeTab, setActiveTab] = useState(0);

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

        {/* ── Section 3: Company ── */}
        <section className="ft-company">
          <div className="ft-company-top">
            <div className="ft-company-identity">
              <p className="ft-company-name">WANDERON EXPERIENCES PVT LTD</p>
            </div>
            <div className="ft-contact">
              <span>hello@wanderon.in</span>
              <span>www.wanderon.in</span>
              <span>+91-9090403075</span>
            </div>
            <div className="ft-social-pill">
              <img src="/figma/footer/instagram.svg" alt="Instagram" className="ft-social-icon ft-social-icon--sm" />
              <img src="/figma/footer/facebook.svg"  alt="Facebook"  className="ft-social-icon ft-social-icon--sm" />
              <div className="ft-social-icon--linkedin-wrap">
                <img src="/figma/footer/linkedin.svg" alt="LinkedIn" className="ft-social-icon ft-social-icon--xs" />
              </div>
              <img src="/figma/footer/youtube.png"   alt="YouTube"   className="ft-social-icon ft-social-icon--md" />
            </div>
          </div>
          <p className="ft-copy">{`© WANDERON EXPERIENCES PVT LTD,  All rights reserved.`}</p>
        </section>

      </div>
    </footer>
  );
}
