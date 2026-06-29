import { useNavigate } from "react-router-dom";
import type { Destination, MonumentKind } from "../../types";
import "./DestinationStrip.css";
import FigmaImg from "../FigmaImg";

const FILL = "#c2b29a";
const SHADE = "#a8957a";

function Monument({ kind }: { kind: MonumentKind | string }) {
  const p = { fill: FILL, stroke: SHADE, strokeWidth: 0.6, strokeLinejoin: "round" as const };
  switch (kind) {
    case "pyramid":
      return (
        <svg viewBox="0 0 48 48" width="32" height="32">
          <path d="M24 8 41 40H7z" {...p} />
          <path d="M24 8 24 40H7z" fill={SHADE} opacity=".45" />
        </svg>
      );
    case "tower-tiered":
      return (
        <svg viewBox="0 0 48 48" width="32" height="32">
          <path d="M24 6l6 8h-12zM18 16h12l-2 6H20zM20 24h8l-2 7h-4zM22 33h4l-1 7h-2z" {...p} />
        </svg>
      );
    case "torii":
      return (
        <svg viewBox="0 0 48 48" width="32" height="32">
          <path d="M9 14h30l-3 4H12zM12 19h24v3H12z" {...p} />
          <rect x="15" y="22" width="4" height="18" {...p} />
          <rect x="29" y="22" width="4" height="18" {...p} />
        </svg>
      );
    case "stupa":
      return (
        <svg viewBox="0 0 48 48" width="32" height="32">
          <path d="M24 6c2 5 1 7 0 9-1-2-2-4 0-9zM21 16h6l3 8H18zM16 24h16l3 16H13z" {...p} />
        </svg>
      );
    case "arch":
      return (
        <svg viewBox="0 0 48 48" width="32" height="32">
          <path d="M10 16h28v24H10z" {...p} />
          <path d="M19 40V28a5 5 0 0 1 10 0v12z" fill="#fff" />
          <path d="M10 12h28v4H10z" {...p} />
        </svg>
      );
    case "skyscraper":
      return (
        <svg viewBox="0 0 48 48" width="32" height="32">
          <path d="M24 4l3 10 6 4 4 22H11l4-22 6-4z" {...p} />
          <path d="M24 4v40h13l-4-22-6-4-3-10z" fill={SHADE} opacity=".4" />
        </svg>
      );
    case "pagoda":
      return (
        <svg viewBox="0 0 48 48" width="32" height="32">
          <path d="M14 12h20l-3 4H17zM17 17h14l-2 4H19zM20 22h8v18h-8z" {...p} />
          <rect x="22" y="6" width="4" height="6" {...p} />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 48 48" width="32" height="32">
          <circle cx="24" cy="24" r="14" {...p} />
        </svg>
      );
  }
}

export interface DestinationStripProps {
  title: string;
  items: Destination[];
  destIcoBg?: string;
}

export default function DestinationStrip({ title, items, destIcoBg }: DestinationStripProps) {
  const navigate = useNavigate();
  return (
    <section
      className="dest-strip"
      style={destIcoBg ? { "--dest-ico-bg": destIcoBg } as React.CSSProperties : undefined}
    >
      <div className="dest-head">
        <span className="dest-head-title">{title}</span>
        <span className="dest-head-rule" />
      </div>
      <div className="dest-grid">
        {items.map((d) => (
          <button className="dest-item" key={d.name} type="button" onClick={() => navigate(`/destination/${d.slug}`)}>
            <span className="dest-ico" aria-hidden>
              <FigmaImg
                name={`dest-${d.kind}`}
                alt={d.name}
                className="dest-img"
                fallback={<Monument kind={d.kind} />}
              />
            </span>
            <span className="dest-name">{d.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
