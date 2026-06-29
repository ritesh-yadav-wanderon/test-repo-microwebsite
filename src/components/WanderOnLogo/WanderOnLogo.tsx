import FigmaImg from "../FigmaImg";

export interface WanderOnLogoProps {
  height?: number;
  color?: string;
  pin?: string;
}

export default function WanderOnLogo({
  height = 26,
  color = "#ffffff",
  pin = "#ffd84d",
}: WanderOnLogoProps) {
  const svgMark = (
    <svg viewBox="0 0 40 34" width={height * 1.15} height={height} aria-hidden>
      <path
        d="M3 10 L11 30 L20 16 L29 30 L37 10"
        fill="none"
        stroke={color}
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 1.5c-2.6 0-4.6 2-4.6 4.6 0 3.1 4.6 6.4 4.6 6.4s4.6-3.3 4.6-6.4c0-2.6-2-4.6-4.6-4.6z"
        fill={pin}
      />
      <circle cx="20" cy="6" r="1.7" fill={color} />
    </svg>
  );

  return (
    <span
      className="wo-logo"
      style={{ display: "inline-flex", alignItems: "center", gap: 8, height }}
    >
      <FigmaImg
        name="logo"
        alt="WanderOn"
        style={{ height, width: "auto" }}
        fallback={svgMark}
      />
      <span
        className="wo-wordmark"
        style={{
          fontWeight: 900,
          letterSpacing: "1.5px",
          fontSize: height * 0.58,
          color,
          fontFamily: '"Roboto", sans-serif',
        }}
      >
        WANDERON
      </span>
    </span>
  );
}
