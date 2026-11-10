import { useEffect, useState } from "react";
import { useAppNav } from "@/hooks/useAppNav";
import DesktopGallery from "@/components/desktop/DesktopGallery";

export interface TripGalleryViewProps {
  /** Route :slug param — a prop (not react-router's useParams()) so this
   *  view is shared as-is with Next.js. */
  slug: string;
}

/** Trip image gallery page — desktop only (Figma 6584:30629). On mobile the
 *  trip page opens the full-screen GallerySheet instead, so fall back there.
 *
 *  Checks the real viewport directly on mount rather than useIsDesktop()'s
 *  SSR-safe mobile-default: that default exists so a server render and the
 *  first client paint agree (no hydration warning) for pages that just swap
 *  which tree they show, but it's wrong for a redirect decision — trusting
 *  it here would bounce real desktop visitors away under Next.js, before
 *  hydration ever corrects it. Renders nothing until the check runs, which
 *  is identical (blank) on the server and the first client paint either
 *  way, so there's no mismatch. */
export function TripGalleryView({ slug }: TripGalleryViewProps) {
  const nav = useAppNav();
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    setIsDesktop(desktop);
    if (!desktop) nav.replace(`/trip/${slug}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (!isDesktop) return null;

  return <DesktopGallery />;
}
