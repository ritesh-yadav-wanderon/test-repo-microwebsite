import { useNavigate } from "react-router-dom";
import "./DesktopFooter.css";

/** Desktop site footer (Figma 6439:15473 "footer"). Shared across the desktop
 *  home, product, listing and account pages. */

type Column = { heading: React.ReactNode; links: string[] };

const COLUMNS: Column[] = [
  {
    heading: "India trips",
    links: [
      "Ladakh",
      "Spiti Valley",
      "Meghalaya",
      "Zanskar",
      "Kashmir",
      "Himachal Pradesh",
      "Andaman",
      "Kerala",
      "Rajasthan",
      "Nagaland",
    ],
  },
  {
    heading: "International trips",
    links: [
      "Europe",
      "Bali",
      "Vietnam",
      "Thailand",
      "Kazakhstan",
      "Iceland",
      "Singapore",
      "Bhutan",
      "Maldives",
      "Dubai",
      "Malaysia",
    ],
  },
  {
    heading: (
      <>
        WanderOn <span className="dft-col-head--light">Special</span>
      </>
    ),
    links: ["Community trips", "Honeymoon trips", "MICE", "Weekend Getaways"],
  },
  {
    heading: (
      <>
        <span className="dft-col-head--light">Quick</span> links
      </>
    ),
    links: ["Terms & conditions", "Customer success & support", "Investor Relations", "Careers"],
  },
];

export default function DesktopFooter() {
  const navigate = useNavigate();

  return (
    <footer className="dft">
      <div className="dft-inner">
        <div className="dft-top">
          <p className="dft-title">Inspiration for your next escape</p>

          <div className="dft-cols">
            {COLUMNS.map((col, i) => (
              <div className="dft-col" key={i}>
                <p className="dft-col-head">{col.heading}</p>
                <ul className="dft-col-list">
                  {col.links.map((link) => (
                    <li key={link}>
                      <button
                        type="button"
                        className="dft-link"
                        onClick={() => navigate("/search")}
                      >
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="dft-divider" />

        <div className="dft-bottom">
          <div className="dft-company">
            <p className="dft-company-name">WANDERON EXPERIENCES PVT LTD</p>
            <p className="dft-company-addr">
              3rd Floor, Building No-436, Phase IV, Udyog Vihar,
              <br />
              Sector-18, Gurugram, Haryana-122015
            </p>
            <div className="dft-contact">
              <a className="dft-contact-item" href="mailto:hello@wanderon.in">
                hello@wanderon.in
              </a>
              <a className="dft-contact-item" href="https://www.wanderon.in" target="_blank" rel="noreferrer">
                www.wanderon.in
              </a>
              <a className="dft-contact-item" href="tel:+919090403075">
                +91-9090403075
              </a>
            </div>
          </div>

          <div className="dft-legal">
            <p className="dft-copy">© WANDERON EXPERIENCES PVT LTD, All rights reserved.</p>
            <div className="dft-social">
              <a className="dft-social-link" href="https://www.instagram.com/wanderon.in" target="_blank" rel="noreferrer" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <rect x="2" y="2" width="20" height="20" rx="5.5" stroke="#4d4d4d" strokeWidth="1.8" />
                  <circle cx="12" cy="12" r="4.5" stroke="#4d4d4d" strokeWidth="1.8" />
                  <circle cx="17.5" cy="6.5" r="1.3" fill="#4d4d4d" />
                </svg>
              </a>
              <a className="dft-social-link" href="https://www.facebook.com/wanderon.in" target="_blank" rel="noreferrer" aria-label="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#4d4d4d" aria-hidden>
                  <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.5-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.9h-2.34V22c4.78-.79 8.43-4.94 8.43-9.94Z" />
                </svg>
              </a>
              <a className="dft-social-link" href="https://www.linkedin.com/company/wanderon" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#4d4d4d" aria-hidden>
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
                </svg>
              </a>
              <a className="dft-social-link" href="https://www.youtube.com/@WanderOn" target="_blank" rel="noreferrer" aria-label="YouTube">
                <svg width="20" height="16" viewBox="0 0 28 20" fill="none" aria-hidden>
                  <rect x="0.9" y="0.9" width="26.2" height="18.2" rx="5" fill="#4d4d4d" />
                  <path d="M11.2 6.2v7.6l6.6-3.8-6.6-3.8Z" fill="#fff" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
