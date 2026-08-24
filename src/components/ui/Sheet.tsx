import { useEffect, useState, type CSSProperties, type ReactNode, type Ref } from "react";
import { createPortal } from "react-dom";
import { useScrollLock } from "@/hooks/useScrollLock";

/**
 * Overlay chrome shared by every bottom sheet, drawer and modal: the page
 * scroll lock, the dialog semantics, closing on a backdrop click, and the
 * open-class gate that keeps the slide-in animation from playing on mount.
 *
 * Styling stays with each consumer — pass the class names it already uses and
 * the markup is unchanged.
 */
export interface SheetProps {
  isOpen: boolean;
  onClose?: () => void;
  /**
   * Class for a wrapper around the backdrop and panel, for sheets whose open
   * state cascades to both children (e.g. `.sr-sort--open .sr-sort-panel`).
   * When set, the wrapper carries the open modifier.
   */
  wrapperClassName?: string;
  /** Backdrop class, e.g. "bsh-overlay". Omit for sheets that are panel-only. */
  overlayClassName?: string;
  /** Panel class, e.g. "bsh-sheet". */
  panelClassName?: string;
  /** Suffix added to the panel class while open; "" for sheets that unmount instead. */
  openModifier?: OpenModifier;
  /** Suffix added to the overlay class while open. Defaults to `openModifier`. */
  overlayOpenModifier?: OpenModifier;
  /**
   * Render the backdrop next to the panel instead of around it, for sheets whose
   * CSS fades the backdrop on its own (a nested panel would fade with it).
   */
  overlayAsSibling?: boolean;
  /** Render into `document.body` rather than in place. */
  portal?: boolean;
  /** Render the panel before it has ever been opened. */
  mountClosed?: boolean;
  /** Drop the panel from the tree while closed, for sheets with no exit animation. */
  unmountWhenClosed?: boolean;
  /** Close when the backdrop itself (not its content) is clicked. */
  closeOnOverlayClick?: boolean;
  /** Freeze page scroll while open. */
  lockScroll?: boolean;
  /** Which element carries the dialog semantics. */
  dialogOn?: "panel" | "overlay" | "none";
  ariaLabel?: string;
  ariaModal?: boolean;
  overlayStyle?: CSSProperties;
  panelStyle?: CSSProperties;
  panelRef?: Ref<HTMLDivElement>;
  children: ReactNode;
}

type OpenModifier = "--open" | "--visible" | "";

/** Scroll lock + "has ever been open" gate, for sheets with bespoke markup. */
export function useSheetState(isOpen: boolean, lockScroll = true): { hasOpened: boolean } {
  const [hasOpened, setHasOpened] = useState(false);

  useEffect(() => {
    if (isOpen) setHasOpened(true);
  }, [isOpen]);

  useScrollLock(isOpen && lockScroll);

  return { hasOpened };
}

export default function Sheet({
  isOpen,
  onClose,
  wrapperClassName,
  overlayClassName,
  panelClassName,
  openModifier = "--open",
  overlayOpenModifier,
  overlayAsSibling = false,
  portal = false,
  mountClosed = false,
  unmountWhenClosed = false,
  closeOnOverlayClick = true,
  lockScroll = true,
  dialogOn = "panel",
  ariaLabel,
  ariaModal = true,
  overlayStyle,
  panelStyle,
  panelRef,
  children,
}: SheetProps) {
  const { hasOpened } = useSheetState(isOpen, lockScroll);

  if (unmountWhenClosed ? !isOpen : !hasOpened && !mountClosed) return null;

  const openClass = (base: string, modifier: OpenModifier) =>
    `${base}${isOpen && modifier ? ` ${base}${modifier}` : ""}`;
  const dialogProps = (on: SheetProps["dialogOn"]) =>
    dialogOn === on
      ? { role: "dialog", "aria-modal": ariaModal || undefined, "aria-label": ariaLabel }
      : {};

  const panel = (
    <div
      ref={panelRef}
      className={panelClassName ? openClass(panelClassName, openModifier) : undefined}
      style={panelStyle}
      aria-hidden={!isOpen || undefined}
      {...dialogProps("panel")}
    >
      {children}
    </div>
  );

  const overlay = overlayClassName ? (
    <div
      className={openClass(overlayClassName, overlayOpenModifier ?? openModifier)}
      style={overlayStyle}
      aria-hidden={!isOpen || undefined}
      onClick={(e) => {
        // Only a click on the backdrop itself closes; clicks inside a nested
        // panel bubble through here untouched.
        if (closeOnOverlayClick && e.target === e.currentTarget) onClose?.();
      }}
      {...dialogProps("overlay")}
    >
      {!overlayAsSibling && panel}
    </div>
  ) : null;

  const pair = !overlay ? (
    panel
  ) : overlayAsSibling ? (
    <>
      {overlay}
      {panel}
    </>
  ) : (
    overlay
  );

  const tree = wrapperClassName ? (
    <div className={openClass(wrapperClassName, "--open")} aria-hidden={!isOpen || undefined}>
      {pair}
    </div>
  ) : (
    pair
  );

  if (!portal) return tree;
  return typeof document === "undefined" ? null : createPortal(tree, document.body);
}
