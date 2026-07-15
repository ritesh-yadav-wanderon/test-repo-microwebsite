import { useNavigate } from "react-router-dom";
import FooterMessage from "../components/FooterMessage/FooterMessage";
import "./Legal.css";

const L = "/figma/legal/";

const ITEMS = [
  { label: "Privacy Policy",             to: "/legal/privacy-policy" },
  { label: "Terms & Conditions",         to: "/legal/terms" },
  { label: "Customer Success & Support", to: "/legal/support" },
];

export default function Legal() {
  const navigate = useNavigate();

  return (
    <div className="leg-page">
      <header className="leg-header">
        <div className="leg-header-left">
          <button className="leg-back" type="button" onClick={() => navigate(-1)} aria-label="Go back">
            <img src={`${L}icon-arrow-back.svg`} width={24} height={24} alt="" aria-hidden />
          </button>
          <span className="leg-header-title">Legal</span>
        </div>
      </header>

      <div className="leg-content">
        <div className="leg-list">
          {ITEMS.map((item) => (
            <button
              key={item.label}
              type="button"
              className="leg-row"
              onClick={() => navigate(item.to)}
            >
              <div className="leg-row-left">
                <img src={`${L}icon-book.svg`} width={16} height={16} alt="" aria-hidden className="leg-row-icon" />
                <span className="leg-row-label">{item.label}</span>
              </div>
              <img src={`${L}icon-arrow-forward.svg`} width={16} height={16} alt="" aria-hidden />
            </button>
          ))}
        </div>
      </div>
      <FooterMessage />
    </div>
  );
}
