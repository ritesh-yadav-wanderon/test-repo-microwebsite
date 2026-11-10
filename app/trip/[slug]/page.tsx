import { getProductDataServer } from "../../_lib/productDetailServer";
import TripDetailPageClient from "./TripDetailPageClient";

// Live product data (by `?id=`, falling back to the [slug] segment) — must
// not be statically prerendered.
export const dynamic = "force-dynamic";

export default async function TripDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const idParam = sp.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  const initialData = await getProductDataServer(id ?? null, slug);

  return <TripDetailPageClient slug={slug} initialData={initialData} />;
}
