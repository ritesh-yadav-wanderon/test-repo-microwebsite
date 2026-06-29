import { useRef, useEffect } from "react";
import Hls from "hls.js";
import logoImg from "../../assets/hero/logo.png";
import locationOnIcon  from "../../assets/hero/location-on.svg";
import calendarIcon    from "../../assets/hero/calendar-month.svg";
import searchBtnIcon   from "../../assets/hero/search-btn.svg";
import diversityIcon from "../../assets/hero/icon-diversity.svg";
import groupIcon from "../../assets/hero/icon-group.svg";
import celebrationIcon from "../../assets/hero/icon-celebration.svg";
import friendsIcon from "../../assets/hero/icon-friends.svg";
import vibesIcon from "../../assets/hero/icon-vibes.svg";
import "./HeroSection.css";

const VIDEO_SRC =
  "https://video.gumlet.io/67fd03cdb6d587c54aff26af/69f057534d5bf5db18cd1e95/main.m3u8";

const MARQUEE_ITEMS = [
  { icon: diversityIcon,   label: "Curated Community Trips" },
  { icon: groupIcon,       label: "Unforgettable Experiences" },
  { icon: celebrationIcon, label: "Wanderon Community Trips" },
  { icon: friendsIcon,     label: "Lifelong Friendships" },
  { icon: vibesIcon,       label: "Great Vibes" },
];

/* Items doubled for seamless infinite scroll */
const TRACK = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

interface Props {
  onSearchClick?: () => void;
}

export default function HeroSection({ onSearchClick }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      /* Native HLS — Safari */
      video.src = VIDEO_SRC;
    } else if (Hls.isSupported()) {
      const hls = new Hls({ startLevel: -1 });
      hls.loadSource(VIDEO_SRC);
      hls.attachMedia(video);
      return () => hls.destroy();
    }
  }, []);

  return (
    <section className="hero" aria-label="Home hero">
      {/* ── Video background ── */}
      <video
        ref={videoRef}
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
      />
      <div className="hero-overlay" aria-hidden />

      {/* ── Foreground ── */}
      <div className="hero-body">

        <div className="hero-content">
          {/* Logo + title */}
          <div className="hero-top">
            <div className="hero-logo">
              <img src={logoImg} alt="community-graphic-icon" />
            </div>

            <div className="hero-title">
              <p className="hero-line1">Trip is the destination.</p>
              <p className="hero-line2">
                <span className="hero-accent">Community</span>
                <span className="hero-suffix">{" is the point!"}</span>
              </p>
            </div>
          </div>

          {/* Search bar — tapping opens the bottom sheet */}
          <button
            className="hero-search"
            type="button"
            aria-label="Open search"
            data-hero-search
            onClick={onSearchClick}
          >
            <div className="hero-search-pane">
              <img src={locationOnIcon} width={16} height={16} alt="" aria-hidden />
              <span className="hero-search-text">Where to?</span>
            </div>
            <div className="hero-search-div" aria-hidden />
            <div className="hero-search-pane">
              <img src={calendarIcon} width={16} height={16} alt="" aria-hidden />
              <span className="hero-search-text">Any date</span>
            </div>
            <span className="hero-search-btn" aria-hidden>
              <img src={searchBtnIcon} width={40} height={40} alt="" />
            </span>
          </button>
        </div>

        {/* Scrolling marquee */}
        <div className="hero-marquee" aria-hidden>
          <div className="hero-mq-track">
            {TRACK.map((item, i) => (
              <div key={i} className="hero-mq-item">
                <img src={item.icon} width={16} height={16} alt="" />
                <span className="hero-mq-text">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
