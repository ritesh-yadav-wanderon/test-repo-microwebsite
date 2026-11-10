// GET /api/product?id=<productId>&slug=<slug> — single-product lookup.
// `id` wins when present and found; otherwise falls back to `slug`, so a
// /trip/<slug> link without `?id=` still resolves.

import { getProductsCollection } from "../../../api/_lib/mongo";
import { findProduct, redactProduct } from "../../../api/_lib/products";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");
    if (!id && !slug) {
      return Response.json({ error: "Missing id or slug query param" }, { status: 400 });
    }

    const collection = await getProductsCollection();
    const doc = await findProduct(collection, { id, slug });
    if (!doc) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json(redactProduct(doc), { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("[app/api/product]", err);
    return Response.json({ error: "Failed to load product" }, { status: 500 });
  }
}
