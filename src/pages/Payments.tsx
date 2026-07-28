import { useNavigate } from "react-router-dom";
import FooterMessage from "../components/FooterMessage/FooterMessage";
import { getLastMainPage } from "../utils/lastMainPage";
import "./Payments.css";

const PAY = "/figma/payments/";
const P = "/figma/profile/";
const TRIP_THUMB = "/figma/my-booking/trip-thumb.png";

interface Transaction {
  amount: string;
  meta: string;
}

interface LedgerEntry {
  id: string;
  tripTitle: string;
  tripDates: string;
  transactions: Transaction[];
  /** Present when a balance is still due — renders the Pay Due CTA. */
  due?: { amount: string; date: string };
}

const LEDGER: LedgerEntry[] = [
  {
    id: "europe-due",
    tripTitle: "15 Days Europe Group trip 2026: Paris, Amsterdam & Switzerland",
    tripDates: "23 July 2026 - 3 Aug 2026",
    transactions: [
      { amount: "\u20B9100000", meta: "Date: 13 July 2026 | Paid via: UPI" },
      { amount: "\u20B924550", meta: "Date: 13 July 2026 | Paid via: UPI" },
    ],
    due: { amount: "\u20B911000", date: "18 Jul 2026" },
  },
  {
    id: "europe-paid",
    tripTitle: "15 Days Europe Group trip 2026: Paris, Amsterdam & Switzerland",
    tripDates: "23 July 2026 - 3 Aug 2026",
    transactions: [
      { amount: "\u20B9100000", meta: "Date: 13 July 2026 | Paid via: UPI" },
      { amount: "\u20B924550", meta: "Date: 13 July 2026 | Paid via: UPI" },
    ],
  },
];

/** Mobile Payments ledger — profile segment (Figma 6750:15655). */
export default function Payments() {
  const navigate = useNavigate();

  return (
    <div className="pay-page">
      <header className="pay-nav">
        <div className="pay-nav-left">
          <button
            className="pay-back"
            type="button"
            aria-label="Back"
            onClick={() => navigate("/profile")}
          >
            <img src={`${P}icon-arrow-back.svg`} width={24} height={24} alt="" aria-hidden />
          </button>
          <span className="pay-title">Payments</span>
        </div>
        <button
          className="pay-close"
          type="button"
          aria-label="Back to website"
          onClick={() => navigate(getLastMainPage())}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M6 6l12 12M18 6 6 18" stroke="#202020" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      <div className="pay-body">
        {/* ── Summary (Figma 6750:16344) ── */}
        <section className="pay-total">
          <div className="pay-total-img" aria-hidden>
            <img src={`${P}stat-wallet.png`} alt="" loading="lazy" />
          </div>
          <div className="pay-total-texts">
            <p className="pay-total-amount">&#8377;740000</p>
            <p className="pay-total-label">Total Paid</p>
          </div>
        </section>

        <div className="pay-dues">
          <div className="pay-due-card">
            <p className="pay-due-amount">&#8377;250000</p>
            <p className="pay-due-label">Total payment due</p>
          </div>
          <div className="pay-due-card">
            <p className="pay-due-amount">&#8377;1000</p>
            <p className="pay-due-label">Next payment due</p>
          </div>
        </div>

        {/* ── Per-trip ledger cards (Figma 6763:16874) ── */}
        {LEDGER.map((entry) => (
          <section className="pay-card" key={entry.id}>
            <div className="pay-trip">
              <img className="pay-trip-thumb" src={TRIP_THUMB} alt="" loading="lazy" />
              <p className="pay-trip-title">{entry.tripTitle}</p>
            </div>

            <div className="pay-dates">
              <span className="pay-dates-tag">
                <img src={`${PAY}icon-calendar.svg`} width={16} height={16} alt="" aria-hidden />
                Trip Dates:
              </span>
              <span className="pay-dates-value">{entry.tripDates}</span>
            </div>

            <div className="pay-rule" aria-hidden />

            {entry.transactions.map((t, i) => (
              <div className="pay-txn-group" key={i}>
                <div className="pay-txn">
                  <div className="pay-txn-top">
                    <span className="pay-txn-amount">{t.amount}</span>
                    <button className="pay-receipt-btn" type="button">
                      View Receipt
                    </button>
                  </div>
                  <p className="pay-txn-meta">{t.meta}</p>
                </div>
                <div className="pay-rule" aria-hidden />
              </div>
            ))}

            {entry.due ? (
              <>
                <div className="pay-balance">
                  <div className="pay-balance-top">
                    <span>{entry.due.amount}</span>
                    <span>{entry.due.date}</span>
                  </div>
                  <div className="pay-balance-labels">
                    <span>Balance Pending</span>
                    <span>Due Date</span>
                  </div>
                </div>
                <button className="pay-cta" type="button">
                  Pay Due
                </button>
              </>
            ) : (
              <button className="pay-cta" type="button">
                Invoice
                <img src={`${PAY}icon-invoice.svg`} width={20} height={20} alt="" aria-hidden />
              </button>
            )}
          </section>
        ))}

        <FooterMessage />
      </div>
    </div>
  );
}
