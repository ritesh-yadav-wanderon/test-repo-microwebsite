import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  TABS,
  PLANNING_WITH,
  CATEGORIES,
  ADDONS,
  DEPARTURE_CITIES,
  ACCOMMODATION_TYPES,
  DestinationsPanel,
  FilterListPanel,
  DateDurationPanel,
  BucketListPanel,
  buildSearchParams,
  seedFromParams,
} from "../FilterSheet/FilterSheet";
import "../FilterSheet/FilterSheet.css";
import "./DesktopFilterSheet.css";

interface DesktopFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: number;
}

/** Desktop filters popover (Figma 6595:32717) — anchored beside the Filters
 *  button. Options and interactions are shared with the mobile FilterSheet. */
export default function DesktopFilterSheet({ isOpen, onClose, initialTab = 0 }: DesktopFilterSheetProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [selections, setSelections] = useState<Record<string, Set<string>>>(() =>
    Object.fromEntries(TABS.map((t) => [t, new Set<string>()]))
  );
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Re-seed from the URL each time the popover opens.
  useEffect(() => {
    if (!isOpen) return;
    setActiveTab(initialTab);
    setSelections(seedFromParams(searchParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialTab]);

  // Close on outside click / Escape (toggling buttons must stopPropagation).
  useEffect(() => {
    if (!isOpen) return;
    const onDocClick = () => onClose();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function toggle(tab: string, value: string) {
    setSelections((prev) => {
      const set = new Set(prev[tab] ?? []);
      set.has(value) ? set.delete(value) : set.add(value);
      return { ...prev, [tab]: set };
    });
  }

  function clearTab() {
    setSelections((prev) => ({ ...prev, [TABS[activeTab]]: new Set<string>() }));
  }

  function handleShowResults() {
    const qs = buildSearchParams(selections);
    onClose();
    navigate(`/search${qs ? `?${qs}` : ""}`);
  }

  const activeTabName = TABS[activeTab];
  const activeSel = selections[activeTabName] ?? new Set<string>();

  function renderPanel() {
    switch (activeTabName) {
      case "Destinations":       return <DestinationsPanel sel={activeSel} onToggle={(v) => toggle(activeTabName, v)} />;
      case "Planning With":      return <FilterListPanel items={PLANNING_WITH} sel={activeSel} onToggle={(v) => toggle(activeTabName, v)} />;
      case "Date & Duration":    return <DateDurationPanel sel={activeSel} onToggle={(v) => toggle(activeTabName, v)} />;
      case "Category":           return <FilterListPanel items={CATEGORIES} sel={activeSel} onToggle={(v) => toggle(activeTabName, v)} />;
      case "Add-Ons":            return <FilterListPanel items={ADDONS} sel={activeSel} onToggle={(v) => toggle(activeTabName, v)} />;
      case "Departure City":     return <FilterListPanel items={DEPARTURE_CITIES} sel={activeSel} onToggle={(v) => toggle(activeTabName, v)} />;
      case "Accommodation Type": return <FilterListPanel items={ACCOMMODATION_TYPES} sel={activeSel} onToggle={(v) => toggle(activeTabName, v)} />;
      case "Bucket List":        return <BucketListPanel sel={activeSel} onAdd={(v) => toggle(activeTabName, v)} onRemove={(v) => toggle(activeTabName, v)} />;
      default: return null;
    }
  }

  return (
    <div className="dfs" role="dialog" aria-label="Filters" onClick={(e) => e.stopPropagation()}>
      {/* Header (Figma 6595:36776) */}
      <div className="dfs__head">
        <span className="dfs__title">Filters</span>
        <button className="dfs__close" type="button" aria-label="Close filters" onClick={onClose}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M1 1l10 10M11 1L1 11" stroke="#3d3d3d" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Body — left tab rail + scrollable option pane (mobile fs-* styles) */}
      <div className="dfs__card">
        <nav className="fs-tabs" aria-label="Filter categories">
          {TABS.map((tab, i) => {
            const count = selections[tab]?.size ?? 0;
            return (
              <button
                key={tab}
                type="button"
                className={`fs-tab${activeTab === i ? " fs-tab--active" : ""}`}
                onClick={() => setActiveTab(i)}
                aria-selected={activeTab === i}
              >
                <span className="fs-tab-label">{tab}</span>
                {count > 0 && <span className="fs-tab-count">{count}</span>}
              </button>
            );
          })}
        </nav>
        <div className="fs-content">{renderPanel()}</div>
      </div>

      {/* Footer (Figma 6595:36650) */}
      <div className="dfs__foot">
        <button className="dfs__clear" type="button" onClick={clearTab}>
          Clear selection
        </button>
        <button className="dfs__show" type="button" onClick={handleShowResults}>
          Show Results
        </button>
      </div>
    </div>
  );
}
