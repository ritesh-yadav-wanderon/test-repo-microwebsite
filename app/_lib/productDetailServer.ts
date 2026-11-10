// Server-only product-detail fetch for TripDetail's RSC page — calls Mongo
// directly (same id-then-slug lookup the /api/product Route Handler runs)
// instead of going through HTTP, and reuses the same pure mergeProductData()
// mapping the client hook uses so there's exactly one place that mapping
// logic lives. Lives under app/_lib (not src/) because it pulls in the
// `mongodb` driver, which must never reach the client bundle.

import "server-only";

import { getProductsCollection } from "../../api/_lib/mongo";
import { findProduct, redactProduct } from "../../api/_lib/products";
import { mergeProductData } from "../../src/repositories/productDetailMapper";
import { STATIC_DATA, type ProductData } from "../../src/repositories";

/** Never throws: a DB outage degrades to the static fixture rather than a
 *  500 page — same fallback the client hook uses. */
export async function getProductDataServer(id: string | null, slug: string | null): Promise<ProductData> {
  if (!id && !slug) return STATIC_DATA;
  try {
    const collection = await getProductsCollection();
    const doc = await findProduct(collection, { id, slug });
    if (!doc) return STATIC_DATA;
    return mergeProductData(redactProduct(doc));
  } catch (err) {
    console.error("[productDetailServer] falling back to static data:", err);
    return STATIC_DATA;
  }
}
