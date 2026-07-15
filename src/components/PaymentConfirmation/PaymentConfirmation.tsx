import "./PaymentConfirmation.css";

const C = "/figma/payment-confirmation/";

interface PaymentConfirmationProps {
  reference: string;
  travelers: number;
  tripTitle: string;
  tripDate: string;
  thumb?: string;
  /** Play the "pull the ticket out of the slot" animation on mount. */
  animate?: boolean;
}

// Confetti scatter around the success badge (Figma ml/mt within the success group).
const CONFETTI = [
  { src: `${C}confetti-0.svg`, left: 134, top: 2, w: 12, h: 6 },
  { src: `${C}confetti-1.svg`, left: 177, top: 27, w: 9, h: 7 },
  { src: `${C}confetti-2.svg`, left: 12, top: 7, w: 7, h: 7 },
  { src: `${C}confetti-3.svg`, left: 20, top: 37, w: 7, h: 8 },
  { src: `${C}confetti-4.svg`, left: 210, top: 19, w: 10, h: 9 },
  { src: `${C}confetti-5.svg`, left: 70, top: 13, w: 9, h: 5 },
  { src: `${C}confetti-6.svg`, left: 205, top: 81, w: 10, h: 6 },
  { src: `${C}confetti-7.svg`, left: 0, top: 65, w: 12, h: 5 },
];

export default function PaymentConfirmation({
  reference,
  travelers,
  tripTitle,
  tripDate,
  thumb = "/figma/trip-hero/hero-bg.png",
  animate = false,
}: PaymentConfirmationProps) {
  return (
    <div className={`pcf${animate ? " pcf--animate" : ""}`}>
      {/* Green pull-tab / slot */}
      <div className="pcf-slot" aria-hidden />

      {/* Ticket that slides down out of the slot */}
      <div className="pcf-ticket">
        <img className="pcf-ticket-bg" src={`${C}ticket.svg`} alt="" aria-hidden />
        <div className="pcf-ticket-inner">
          <div className="pcf-confetti" aria-hidden>
            {CONFETTI.map((c, i) => (
              <img
                key={i}
                src={c.src}
                alt=""
                style={{
                  left: `${c.left}px`,
                  top: `${c.top}px`,
                  width: `${c.w}px`,
                  height: `${c.h}px`,
                  animationDelay: `${0.5 + i * 0.05}s`,
                }}
              />
            ))}
          </div>

          <img className="pcf-success" src={`${C}success.svg`} width={30} height={30} alt="" aria-hidden />
          <p className="pcf-congrats">Congratulations!</p>
          <p className="pcf-sub">Payment Successful!</p>

          <div className="pcf-card">
            <img className="pcf-card-bg" src={`${C}card.svg`} alt="" aria-hidden />
            <div className="pcf-card-inner">
              <div className="pcf-card-row">
                <span>Reference ID: {reference}</span>
                <span>Travellers: {travelers}</span>
              </div>
              <img className="pcf-card-divider" src={`${C}divider.svg`} alt="" aria-hidden />
              <div className="pcf-trip">
                <img className="pcf-trip-thumb" src={thumb} alt="" loading="lazy" />
                <div className="pcf-trip-text">
                  <p className="pcf-trip-name">{tripTitle}</p>
                  <p className="pcf-trip-date">{tripDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
