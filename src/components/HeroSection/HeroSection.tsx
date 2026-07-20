import "./HeroSection.css";

interface Props {
  onSearchClick: () => void;
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
      <path fill="#4285F4" d="M45.52 24.56c0-1.56-.14-3.06-.4-4.5H24v8.51h12.09c-.52 2.76-2.1 5.1-4.47 6.67v5.54h7.24c4.24-3.9 6.66-9.65 6.66-16.22z"/>
      <path fill="#34A853" d="M24 46c6.09 0 11.2-2.02 14.93-5.47l-7.24-5.54C29.75 36.48 27.02 37.3 24 37.3c-5.88 0-10.86-3.97-12.64-9.31H3.88v5.72C7.6 41.38 15.27 46 24 46z"/>
      <path fill="#FBBC05" d="M11.36 27.99A13.27 13.27 0 0 1 10.7 24c0-1.38.24-2.72.66-3.99v-5.72H3.88A22.01 22.01 0 0 0 2 24c0 3.55.85 6.91 2.35 9.9l7.01-5.91z"/>
      <path fill="#EA4335" d="M24 10.7c3.32 0 6.3 1.14 8.65 3.38l6.48-6.48C35.17 3.95 30.07 2 24 2 15.27 2 7.6 6.62 3.88 14.29l7.48 5.72C13.14 14.67 18.12 10.7 24 10.7z"/>
    </svg>
  );
}


function SearchBtnIcon() {
  return (
    <svg width="58" height="48" viewBox="0 0 58 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <filter id="sb-shadow" x="0" y="0" width="58" height="48" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="4"/>
          <feGaussianBlur stdDeviation="2"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
        </filter>
      </defs>
      <g filter="url(#sb-shadow)">
        <rect x="4" width="50" height="40" rx="20" fill="black"/>
        <rect x="4.5" y="0.5" width="49" height="39" rx="19.5" stroke="#4D4D4D"/>
        <path d="M29.1131 15.9169C29.313 15.6692 29.679 15.6281 29.8947 15.8623C30.1105 16.0965 30.2981 16.3566 30.4513 16.6375C30.6968 17.0876 30.8517 17.5817 30.9063 18.0914C30.9609 18.6012 30.9137 19.1171 30.7691 19.6089C30.6788 19.9157 30.5516 20.21 30.3903 20.4845C30.229 20.7589 29.8616 20.7961 29.6138 20.5964C29.366 20.3965 29.334 20.0352 29.4778 19.7512C29.5536 19.6018 29.6159 19.445 29.6634 19.2835C29.7653 18.9371 29.7971 18.5737 29.7587 18.2147C29.7202 17.8555 29.6114 17.5062 29.4384 17.1891C29.3579 17.0416 29.2643 16.902 29.1588 16.7722C28.958 16.5251 28.9132 16.1648 29.1131 15.9169Z" fill="white"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M27.0237 12C30.6174 12 33.5307 14.9133 33.5307 18.507C33.5307 19.7999 33.1514 21.0032 32.5013 22.016L37.0054 25.6901C37.5621 26.1446 37.644 26.9647 37.1896 27.5215C36.7352 28.0781 35.9163 28.1612 35.3596 27.707L30.6814 23.8893C29.639 24.599 28.3799 25.014 27.0237 25.014C23.43 25.014 20.5167 22.1007 20.5167 18.507C20.5167 14.9133 23.43 12 27.0237 12ZM27.0237 13.3014C24.0111 13.3014 21.8181 15.4944 21.8181 18.507C21.8181 21.5196 24.0111 23.7126 27.0237 23.7126C30.0363 23.7126 32.2293 21.5196 32.2293 18.507C32.2293 15.4944 30.0363 13.3014 27.0237 13.3014Z" fill="white"/>
      </g>
    </svg>
  );
}

export default function HeroSection({ onSearchClick }: Props) {
  return (
    <section className="hero" aria-label="Home hero">
      {/* Background image — text baked into photo */}
      <img
        className="hero-bg-img"
        src="/figma/hero-bg-v2.png"
        alt="Built for the ones who wander together"
        fetchPriority="high"
      />

      {/* Bottom content stack */}
      <div className="hero-body">
        {/* Rating badge */}
        <div className="hero-rating" aria-label="4.9 rating from 14,921 Google reviews">
          <GoogleIcon />
          <div className="hero-rating-wreath">
            <img className="hero-laurel hero-laurel--l" src="/figma/hero/laurel.png" alt="" aria-hidden />
            <span className="hero-rating-score">4.9</span>
            <img className="hero-laurel hero-laurel--r" src="/figma/hero/laurel.png" alt="" aria-hidden />
          </div>
          <span className="hero-rating-label">from 14,921 Reviews</span>
        </div>

        {/* Search bar — Figma 4492:14931 */}
        <button
          className="hero-search"
          type="button"
          aria-label="Open trip search"
          data-hero-search
          onClick={onSearchClick}
        >
          <div className="hero-search-pane">
            <img src="/figma/hero/icon-location-w.svg" width={16} height={16} alt="" aria-hidden />
            <span className="hero-search-placeholder">Where to</span>
          </div>
          <div className="hero-search-sep" aria-hidden />
          <div className="hero-search-pane">
            <img src="/figma/hero/icon-calendar-w.svg" width={16} height={16} alt="" aria-hidden />
            <span className="hero-search-placeholder">Any date</span>
          </div>
          <div className="hero-search-btn-wrap" aria-hidden>
            <SearchBtnIcon />
          </div>
        </button>


      </div>
    </section>
  );
}
