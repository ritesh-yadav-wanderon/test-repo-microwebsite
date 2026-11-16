import { describe, expect, it } from "vitest";
import { STATIC_DATA, type ProductData } from "@/repositories";
import { anchorForDay, cityAnchors, tripGlance } from "./tripItinerary";

const day = (city: string, extra: Partial<ProductData["itinerary"][number]> = {}) =>
  ({ days: "", city, photo: "", items: [], ...extra });

describe("cityAnchors", () => {
  const days = [day("Leh"), day("Leh"), day("Nubra"), day("Nubra"), day("Pangong"), day("Leh"), day("Departure")];

  it("collapses consecutive same-city days into '<city> <N>N' anchors, skipping the departure day", () => {
    expect(cityAnchors(days).map((a) => `${a.city} ${a.nights}N`)).toEqual([
      "Leh 2N", "Nubra 2N", "Pangong 1N", "Leh 1N",
    ]);
  });

  it("points each anchor at the first day spent in that city", () => {
    expect(cityAnchors(days).map((a) => a.firstDay)).toEqual([0, 2, 4, 5]);
  });

  it("Paris 2N → Amsterdam 2N → Paris 3N: revisit chip jumps to the first Paris day after Amsterdam", () => {
    const trip = [
      day("Paris"), day("Paris"), day("Amsterdam"), day("Amsterdam"),
      day("Paris"), day("Paris"), day("Paris"), day("Departure"),
    ];
    const anchors = cityAnchors(trip);
    expect(anchors.map((a) => `${a.city} ${a.nights}N`)).toEqual(["Paris 2N", "Amsterdam 2N", "Paris 3N"]);
    expect(anchors.map((a) => a.firstDay)).toEqual([0, 2, 4]);
  });

  it("never splits one continuous stay into two chips, even across a day with no city", () => {
    const trip = [day("Paris"), day(""), day("Paris"), day("Rome"), day("Departure")];
    expect(cityAnchors(trip).map((a) => `${a.city} ${a.nights}N`)).toEqual(["Paris 3N", "Rome 1N"]);
  });

  it("maps a day back to its anchor", () => {
    const anchors = cityAnchors(days);
    expect(anchorForDay(anchors, 3)).toBe(1);
    expect(anchorForDay(anchors, 5)).toBe(3);
    expect(anchorForDay(anchors, 6)).toBe(3);
  });
});

describe("tripGlance", () => {
  it("dedupes stays, numbers activities and summarises transfers/community from real fields", () => {
    const data: ProductData = {
      ...STATIC_DATA,
      itinerary: [
        day("Leh", { stayName: "Blue Retreat", activities: [{ title: "Acclimatise", photos: ["a.jpg"] }] }),
        day("Leh", { stayName: "Blue Retreat", activities: [{ title: "Leisure", isLeisure: true }] }),
        day("Nubra", { stayName: "Golden Retreat", activities: [{ title: "Camel safari" }] }),
      ],
      transferLegs: [
        { mode: "Motorbike", from: "Leh", to: "Nubra" },
        { mode: "Motorbike", from: "Nubra", to: "Leh" },
      ],
      socialTags: [
        { type: "womenJoined", text: "17 women joined" },
        { type: "soloTravellers", text: "17 solo travellers joined" },
      ],
    };
    const g = tripGlance(data);
    expect(g.stays.map((st) => st.name)).toEqual(["Blue Retreat", "Golden Retreat"]);
    for (const st of g.stays) expect(st.rating).toBeGreaterThanOrEqual(4.2);
    expect(g.premium).toHaveLength(2);
    expect(g.activities).toEqual([{ title: "Acclimatise", photo: "a.jpg" }, { title: "Camel safari", photo: undefined }]);
    expect(g.transfer).toEqual({ title: "Motorbike", route: "Leh → Nubra → Leh" });
    expect(g.community).toEqual({ title: "17 solo travellers joined", subtitle: "17 women joined" });
  });
});
