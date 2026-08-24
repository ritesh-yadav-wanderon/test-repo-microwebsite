export interface FaqItemProps {
  index: number;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

/** FAQ accordion row, shared by the mobile and desktop product pages. */
export default function FaqItem({ index, question, answer, isOpen, onToggle }: FaqItemProps) {
  return (
    <div className={`tdp2-faq-item${isOpen ? " open" : ""}`}>
      <button className={`tdp2-faq-row${isOpen ? " open" : ""}`} onClick={onToggle}>
        <span className="tdp2-faq-num">{String(index).padStart(2, "0")}</span>
        <div className="tdp2-faq-content">
          <span className="tdp2-faq-q">{question}</span>
          {isOpen && answer && <p className="tdp2-faq-a">{answer}</p>}
        </div>
        <span className="tdp2-faq-icon" aria-hidden="true">
          {isOpen
            ? <svg width="14" height="2" viewBox="0 0 14 2" fill="none"><line x1="0" y1="1" x2="14" y2="1" stroke="#202020" strokeWidth="2"/></svg>
            : <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 0v12M0 6h12" stroke="#202020" strokeWidth="1.5" strokeLinecap="round"/></svg>
          }
        </span>
      </button>
    </div>
  );
}
