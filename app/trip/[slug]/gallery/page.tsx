import GalleryPageClient from "./GalleryPageClient";

// Reads the `?i=` query param via useAppSearchParams() — must not be
// statically prerendered (see NextSearchParamsProvider's comment).
export const dynamic = "force-dynamic";

export default async function TripGalleryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <GalleryPageClient slug={slug} />;
}
