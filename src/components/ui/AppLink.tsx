import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { useAppNav } from "@/hooks/useAppNav";

export interface AppLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
}

/** Drop-in replacement for react-router's <Link> that works under both the
 *  Vite app and Next.js (routed through useAppNav() instead of importing
 *  react-router-dom directly, which crashes with no <BrowserRouter> ancestor
 *  under Next). Same real <a href> semantics — modifier/middle-click still
 *  falls through to the browser's own new-tab handling. */
export default function AppLink({ to, onClick, children, ...rest }: AppLinkProps) {
  const nav = useAppNav();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    nav.push(to);
  }

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
