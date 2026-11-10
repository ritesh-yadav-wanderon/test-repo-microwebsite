// GET /api/products — the paginated product-list service.
//
// Route Handler equivalent of the old Vercel Function at api/products.ts
// (kept alongside during the migration, not yet deleted — see the plan's
// Phase 6). Reuses api/_lib/mongo.ts and api/_lib/products.ts UNCHANGED:
// both are framework-agnostic by design, so only the request/response
// plumbing changes here (Node req/res -> Web Request/Response).

import { getProductsCollection } from "../../../api/_lib/mongo";
import { filterSortPaginate } from "../../../api/_lib/products";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (key: string) => searchParams.get(key);

    const collection = await getProductsCollection();
    const all = await collection.find({}).toArray();

    const result = filterSortPaginate(all, {
      page: q("page"),
      destination: q("destination"),
      category: q("category"),
      months: q("months"),
      from: q("from"),
      to: q("to"),
      bucketList: q("bucketList"),
      sort: q("sort"),
    });

    // No HTTP-level caching — see api/products.ts for why (a browser
    // conditional-GET coming back 304 breaks a plain fetch()-based client).
    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("[app/api/products]", err);
    return Response.json({ error: "Failed to load products" }, { status: 500 });
  }
}
