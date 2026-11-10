// Server-only product-list fetch for RSC pages — calls Mongo directly (via
// api/_lib/mongo.ts + api/_lib/products.ts, the same framework-agnostic logic
// the /api/products Route Handler uses) instead of going through HTTP, which
// is the whole point of fetching from a Server Component. Lives under
// app/_lib (not src/) because it pulls in the `mongodb` driver, which must
// never reach the client bundle.

import "server-only";

import { getProductsCollection } from "../../api/_lib/mongo";
import { filterSortPaginate, PAGE_SIZE, type ProductListQuery } from "../../api/_lib/products";
import { toTrip } from "../../src/repositories/productRepository";
import type { Trip } from "../../src/types";

export interface ProductListServerResult {
  items: Trip[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

/** Never throws: a DB outage (missing env var, Atlas network-access miss)
 *  renders the page with an empty list instead of a 500. */
export async function getProductListServer(
  query: ProductListQuery = {}
): Promise<ProductListServerResult> {
  try {
    const collection = await getProductsCollection();
    const all = await collection.find({}).toArray();
    const result = filterSortPaginate(all, query);
    return { ...result, items: result.items.map(toTrip) };
  } catch (err) {
    console.error("[productListServer] falling back to an empty list:", err);
    return { items: [], page: 1, pageSize: PAGE_SIZE, total: 0, hasMore: false };
  }
}
