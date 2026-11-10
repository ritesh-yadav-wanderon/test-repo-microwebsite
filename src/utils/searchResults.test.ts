import { describe, expect, it } from "vitest";
import { withoutParams, withoutParamValue } from "./searchResults";

// Shared by SearchResults.tsx and DesktopSearchResults.tsx — this is the
// spec both pages' filter-chip removal is held to. It should keep passing
// unmodified once Phase 4 extracts any further shared listing-page logic.

describe("withoutParams", () => {
  it("removes a single key, leaving the rest of the query string intact", () => {
    const params = new URLSearchParams("destination=Vietnam&category=Adventure");
    expect(withoutParams(params, "destination")).toBe("category=Adventure");
  });

  it("removes multiple keys at once", () => {
    const params = new URLSearchParams("destination=Vietnam&category=Adventure&months=2026-06");
    expect(withoutParams(params, "destination", "category")).toBe("months=2026-06");
  });

  it("is a no-op when the key isn't present", () => {
    const params = new URLSearchParams("category=Adventure");
    expect(withoutParams(params, "destination")).toBe("category=Adventure");
  });

  it("does not mutate the input URLSearchParams", () => {
    const params = new URLSearchParams("destination=Vietnam&category=Adventure");
    withoutParams(params, "destination");
    expect(params.get("destination")).toBe("Vietnam");
  });

  it("returns an empty string when every key is removed", () => {
    const params = new URLSearchParams("destination=Vietnam");
    expect(withoutParams(params, "destination")).toBe("");
  });
});

describe("withoutParamValue", () => {
  it("removes one value from a comma-separated param, keeping the rest", () => {
    const params = new URLSearchParams("category=Adventure,Luxury,Wellness");
    expect(withoutParamValue(params, "category", "Luxury")).toBe("category=Adventure%2CWellness");
  });

  it("drops the param entirely once its last value is removed", () => {
    const params = new URLSearchParams("category=Adventure");
    expect(withoutParamValue(params, "category", "Adventure")).toBe("");
  });

  it("trims whitespace around comma-separated values before matching", () => {
    const params = new URLSearchParams();
    params.set("category", "Adventure, Luxury");
    expect(withoutParamValue(params, "category", "Luxury")).toBe("category=Adventure");
  });

  it("is a no-op when the value isn't present in the param", () => {
    const params = new URLSearchParams("category=Adventure,Luxury");
    expect(withoutParamValue(params, "category", "Wellness")).toBe(params.toString());
  });

  it("leaves other params untouched", () => {
    const params = new URLSearchParams("destination=Vietnam&category=Adventure,Luxury");
    expect(withoutParamValue(params, "category", "Luxury")).toBe("destination=Vietnam&category=Adventure");
  });

  it("does not mutate the input URLSearchParams", () => {
    const params = new URLSearchParams("category=Adventure,Luxury");
    withoutParamValue(params, "category", "Luxury");
    expect(params.get("category")).toBe("Adventure,Luxury");
  });
});
