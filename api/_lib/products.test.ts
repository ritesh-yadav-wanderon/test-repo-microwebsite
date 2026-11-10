import { describe, expect, it } from "vitest";
import { filterSortPaginate, redactProduct, PAGE_SIZE, type ProductDoc } from "./products";

function makeProduct(overrides: Partial<ProductDoc> = {}): ProductDoc {
  return {
    productId: "p1",
    title: "Test Trip",
    slug: "test-trip",
    startingPrice: 20000,
    durationNights: 5,
    durationDays: 6,
    destination: { title: "Vietnam", slug: "vietnam" },
    subDestinations: ["Hanoi", "Da Nang"],
    themeTags: [],
    tripTypeTags: [],
    category: "Customised Trip",
    visibility: true,
    batches: [],
    costing: { category: "Room Sharing", prices: [{ cost: 20000, title: "doubleSharing", costToUs: 15000 }] },
    ...overrides,
  };
}

describe("redactProduct", () => {
  it("strips costToUs from top-level costing.prices", () => {
    const doc = makeProduct();
    const out = redactProduct(doc);
    expect(out.costing.prices[0]).not.toHaveProperty("costToUs");
    expect(out.costing.prices[0]).toMatchObject({ cost: 20000, title: "doubleSharing" });
  });

  it("strips costToUs from every batch's nested costing.prices", () => {
    const doc = makeProduct({
      batches: [
        { date: "2026-01-01", costing: { prices: [{ cost: 100, costToUs: 80 }] } },
        { date: "2026-02-01", costing: { prices: [{ cost: 200, costToUs: 160 }] } },
      ],
    });
    const out = redactProduct(doc);
    for (const batch of out.batches) {
      for (const price of batch.costing.prices) {
        expect(price).not.toHaveProperty("costToUs");
      }
    }
    expect(out.batches[0].costing.prices[0].cost).toBe(100);
    expect(out.batches[1].costing.prices[0].cost).toBe(200);
  });

  it("drops the Mongo _id field", () => {
    const doc = makeProduct({ _id: "mongo-object-id" });
    const out = redactProduct(doc);
    expect(out).not.toHaveProperty("_id");
  });

  it("passes through documents with no costing/batches untouched", () => {
    const doc = { productId: "p2", title: "Bare doc" };
    const out = redactProduct(doc);
    expect(out).toEqual(doc);
  });
});

describe("filterSortPaginate — pagination", () => {
  const all = Array.from({ length: 14 }, (_, i) => makeProduct({ productId: `p${i}`, title: `Trip ${i}` }));

  it("returns PAGE_SIZE items on page 1 with correct total/hasMore", () => {
    const result = filterSortPaginate(all, {});
    expect(result.items).toHaveLength(PAGE_SIZE);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(PAGE_SIZE);
    expect(result.total).toBe(14);
    expect(result.hasMore).toBe(true);
  });

  it("returns the remaining items on the last page with hasMore false", () => {
    const lastPage = Math.ceil(14 / PAGE_SIZE);
    const result = filterSortPaginate(all, { page: String(lastPage) });
    expect(result.items).toHaveLength(14 - PAGE_SIZE * (lastPage - 1));
    expect(result.hasMore).toBe(false);
  });

  it("page 1 and page 2 never overlap", () => {
    const page1 = filterSortPaginate(all, { page: "1" }).items.map((i) => i.productId);
    const page2 = filterSortPaginate(all, { page: "2" }).items.map((i) => i.productId);
    expect(page1.some((id) => page2.includes(id))).toBe(false);
  });

  it("clamps a page number below 1 up to page 1", () => {
    const result = filterSortPaginate(all, { page: "0" });
    expect(result.page).toBe(1);
  });

  it("excludes documents with visibility: false", () => {
    const withHidden = [...all, makeProduct({ productId: "hidden", visibility: false })];
    const result = filterSortPaginate(withHidden, { page: "3" });
    const allIds = [result, filterSortPaginate(withHidden, { page: "1" }), filterSortPaginate(withHidden, { page: "2" })]
      .flatMap((r) => r.items.map((i) => i.productId));
    expect(allIds).not.toContain("hidden");
    expect(filterSortPaginate(withHidden, {}).total).toBe(14); // hidden doc not counted
  });
});

describe("filterSortPaginate — filters", () => {
  const OTHER_DEST = { title: "Thailand", slug: "thailand" };
  const docs = [
    makeProduct({ productId: "vn1", title: "Vietnam Trip", destination: { title: "Vietnam", slug: "vietnam" } }),
    makeProduct({ productId: "th1", title: "Thailand Trip", destination: OTHER_DEST }),
    makeProduct({ productId: "adv1", themeTags: ["adventure"], destination: { title: "Ladakh", slug: "ladakh" } }),
    makeProduct({ productId: "lux1", themeTags: ["luxury"], startingPrice: 5000, destination: OTHER_DEST }),
    makeProduct({ productId: "budget1", startingPrice: 10000, destination: OTHER_DEST }),
    makeProduct({ productId: "expensive1", startingPrice: 500000, destination: OTHER_DEST }),
    makeProduct({ productId: "fest1", themeTags: ["festival"], destination: OTHER_DEST }),
    makeProduct({ productId: "batch1", batches: [{ date: "2026-06-15" }], destination: OTHER_DEST }),
    makeProduct({ productId: "batch2", batches: [{ date: "2026-09-01" }], destination: OTHER_DEST }),
  ];

  it("filters by destination (case-insensitive substring)", () => {
    const result = filterSortPaginate(docs, { destination: "vietnam" });
    expect(result.items.map((i) => i.productId)).toEqual(["vn1"]);
  });

  it("filters by category=Adventure using themeTags", () => {
    const result = filterSortPaginate(docs, { category: "Adventure" });
    expect(result.items.map((i) => i.productId)).toContain("adv1");
  });

  it("filters by category=Luxury using either themeTag or price threshold", () => {
    const result = filterSortPaginate(docs, { category: "Luxury" });
    const ids = result.items.map((i) => i.productId);
    expect(ids).toContain("lux1"); // themeTags: ["luxury"]
    expect(ids).toContain("expensive1"); // price > 100000
    expect(ids).not.toContain("budget1");
  });

  it("filters by category=Budget Trips using price < 25000", () => {
    const result = filterSortPaginate(docs, { category: "Budget Trips" });
    expect(result.items.map((i) => i.productId)).toContain("budget1");
    expect(result.items.map((i) => i.productId)).not.toContain("expensive1");
  });

  it("filters by months against batches[].date", () => {
    const result = filterSortPaginate(docs, { months: "2026-06" });
    expect(result.items.map((i) => i.productId)).toEqual(["batch1"]);
  });

  it("filters by date range against batches[].date", () => {
    const result = filterSortPaginate(docs, { from: "2026-08-01", to: "2026-12-31" });
    expect(result.items.map((i) => i.productId)).toEqual(["batch2"]);
  });

  it("combines multiple filters with AND semantics", () => {
    const result = filterSortPaginate(docs, { destination: "vietnam", category: "Adventure" });
    expect(result.items).toHaveLength(0);
  });
});

describe("filterSortPaginate — sort", () => {
  const docs = [
    makeProduct({ productId: "mid", startingPrice: 50000 }),
    makeProduct({ productId: "cheap", startingPrice: 10000 }),
    makeProduct({ productId: "pricey", startingPrice: 90000 }),
  ];

  it("sorts price-asc", () => {
    const result = filterSortPaginate(docs, { sort: "price-asc" });
    expect(result.items.map((i) => i.productId)).toEqual(["cheap", "mid", "pricey"]);
  });

  it("sorts price-desc", () => {
    const result = filterSortPaginate(docs, { sort: "price-desc" });
    expect(result.items.map((i) => i.productId)).toEqual(["pricey", "mid", "cheap"]);
  });

  it("sorts by duration ascending", () => {
    const byDuration = [
      makeProduct({ productId: "long", durationNights: 10 }),
      makeProduct({ productId: "short", durationNights: 2 }),
    ];
    const result = filterSortPaginate(byDuration, { sort: "duration" });
    expect(result.items.map((i) => i.productId)).toEqual(["short", "long"]);
  });
});
