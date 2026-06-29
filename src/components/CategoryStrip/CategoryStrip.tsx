import type { CategoryIconKind } from "../../types";
import { CATEGORY_THEMES } from "../../categoryThemes";
import "./CategoryStrip.css";
import FigmaImg from "../FigmaImg";

const CATEGORIES: Array<{ label: string; icon: CategoryIconKind }> = [
  { label: "All Trips", icon: "grid" },
  { label: "Adventure", icon: "balloon" },
  { label: "Luxury", icon: "diamond" },
  { label: "Culture", icon: "torii" },
  { label: "Festival", icon: "lantern" },
  { label: "Wellness", icon: "coconut" },
  { label: "Weekend", icon: "car" },
];

function Icon({ name, color }: { name: CategoryIconKind; color: string }) {
  const c = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none" };
  switch (name) {
    case "balloon":
      return (
        <svg {...c}>
          <path d="M12 3a6 6 0 0 1 6 6c0 4-4 7-6 7s-6-3-6-7a6 6 0 0 1 6-6z" stroke={color} strokeWidth="1.6" />
          <path d="M10.5 16h3l-.5 3h-2z" fill={color} />
        </svg>
      );
    case "diamond":
      return (
        <svg {...c}>
          <path d="M5 9l3-4h8l3 4-7 10z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
    case "torii":
      return (
        <svg {...c}>
          <path d="M4 7h16M5 9h14M7 9v11M17 9v11" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "lantern":
      return (
        <svg {...c}>
          <rect x="8" y="6" width="8" height="11" rx="4" stroke={color} strokeWidth="1.6" />
          <path d="M12 3v3M12 17v3" stroke={color} strokeWidth="1.6" />
        </svg>
      );
    case "coconut":
      return (
        <svg {...c}>
          <circle cx="12" cy="14" r="6" stroke={color} strokeWidth="1.6" />
          <path d="M12 8c0-3 2-4 5-4-1 3-2 4-5 4z" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      );
    case "car":
      return (
        <svg {...c}>
          <path d="M4 16l1.5-5h13L20 16M4 16h16v3H4zM7 19v1M17 19v1" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg {...c}>
          <rect x="4" y="4" width="6" height="6" rx="1.5" stroke={color} strokeWidth="1.6" />
          <rect x="14" y="4" width="6" height="6" rx="1.5" stroke={color} strokeWidth="1.6" />
          <rect x="4" y="14" width="6" height="6" rx="1.5" stroke={color} strokeWidth="1.6" />
          <rect x="14" y="14" width="6" height="6" rx="1.5" stroke={color} strokeWidth="1.6" />
        </svg>
      );
  }
}

interface Props {
  active: number;
  onChange: (i: number) => void;
}

export default function CategoryStrip({ active, onChange }: Props) {
  const theme = CATEGORY_THEMES[active] ?? CATEGORY_THEMES[0];

  return (
    <nav className="cat-strip" aria-label="Trip categories">
      <div className="cat-row">
        {CATEGORIES.map((c, i) => {
          const isActive = i === active;
          const t = CATEGORY_THEMES[i] ?? CATEGORY_THEMES[0];
          return (
            <button
              key={c.label}
              className={`cat-item${isActive ? " cat-item--active" : ""}`}
              onClick={() => onChange(i)}
              aria-pressed={isActive}
              style={isActive ? { background: theme.stripBg } : undefined}
            >
              <span className="cat-ico">
                <FigmaImg
                  name={`cat-${c.icon}`}
                  alt={c.label}
                  className="cat-img"
                  fallback={<Icon name={c.icon} color={isActive ? t.underline : "#a8957a"} />}
                />
              </span>
              <span className="cat-label">{c.label}</span>
              <span
                className="cat-underline"
                aria-hidden
                style={isActive ? { background: t.underline } : undefined}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
