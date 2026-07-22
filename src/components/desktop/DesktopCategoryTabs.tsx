import "./DesktopCategoryTabs.css";

const CATEGORIES = [
  "For you",
  "Adventure",
  "Luxury",
  "Music Fest",
  "Wellness",
  "Culture",
  "Weekend",
  "Romantic Escape",
];

interface Props {
  active: number;
  onChange: (index: number) => void;
}

/** Category tab strip below the hero (Figma 4674:17113). */
export default function DesktopCategoryTabs({ active, onChange }: Props) {
  return (
    <nav className="dtabs" aria-label="Trip categories">
      {CATEGORIES.map((label, i) => (
        <button
          key={label}
          className={`dtabs__tab${i === active ? " dtabs__tab--active" : ""}`}
          onClick={() => onChange(i)}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
