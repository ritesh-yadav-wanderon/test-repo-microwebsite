import { describe, expect, it } from "vitest";
import { isCustomisedPackage } from "./productDetailMapper";

describe("isCustomisedPackage", () => {
  it("treats private trips (Customised/Customized) as customised", () => {
    expect(isCustomisedPackage("Customised")).toBe(true);
    expect(isCustomisedPackage("customized")).toBe(true);
    expect(isCustomisedPackage("Customised Trip")).toBe(true);
  });
  it("treats group trips and missing values as fixed", () => {
    expect(isCustomisedPackage("Fixed Departure")).toBe(false);
    expect(isCustomisedPackage("")).toBe(false);
    expect(isCustomisedPackage(undefined)).toBe(false);
  });
});
