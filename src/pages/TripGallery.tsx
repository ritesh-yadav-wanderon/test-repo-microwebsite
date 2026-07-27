import { Navigate, useParams } from "react-router-dom";
import { useIsDesktop } from "../hooks/useIsDesktop";
import DesktopGallery from "../components/desktop/DesktopGallery";

/** Trip image gallery page — desktop only (Figma 6584:30629). On mobile the
 *  trip page opens the full-screen GallerySheet instead, so fall back there. */
export default function TripGallery() {
  const { slug } = useParams<{ slug: string }>();
  const isDesktop = useIsDesktop();

  if (!isDesktop) return <Navigate to={`/trip/${slug}`} replace />;

  return <DesktopGallery />;
}
