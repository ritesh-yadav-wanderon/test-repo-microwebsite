import { getProductListServer } from "../../_lib/productListServer";
import DestinationPageClient from "./DestinationPageClient";

// Live per-destination trip data — must not be statically prerendered.
export const dynamic = "force-dynamic";

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { items } = await getProductListServer({ destination: slug });

  return <DestinationPageClient slug={slug} destTrips={items} />;
}
