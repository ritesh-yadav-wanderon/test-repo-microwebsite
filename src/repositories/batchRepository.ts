// Departure batches for a trip. The live PMS feed is not wired up yet, so both
// batch sheets read the same sample departures from here instead of keeping a
// private copy each.

export interface BatchItem {
  startDate: string; // ISO YYYY-MM-DD
  endDate?: string;
  groupSize?: number;
  seatsLeft?: number | null; // null = sold out
  fillingFast?: boolean;
  interested?: number;
  price: string;
}

export type BatchStatus = "available" | "sold-out" | "filling";

/** Sample batches matching Figma 3044:23808. */
export const DEFAULT_BATCHES: BatchItem[] = [
  { startDate: "2026-07-09", groupSize: 50, seatsLeft: 4, interested: 12, price: "169990" },
  { startDate: "2026-07-12", groupSize: 50, seatsLeft: null, interested: 12, price: "169990" },
  { startDate: "2026-07-18", groupSize: 50, seatsLeft: 4, fillingFast: true, interested: 12, price: "169990" },
  { startDate: "2026-07-22", groupSize: 50, seatsLeft: 8, interested: 9, price: "169990" },
  { startDate: "2026-08-06", groupSize: 50, seatsLeft: 4, interested: 15, price: "174990" },
  { startDate: "2026-08-12", groupSize: 50, seatsLeft: null, interested: 20, price: "174990" },
  { startDate: "2026-08-18", groupSize: 50, seatsLeft: 2, fillingFast: true, interested: 18, price: "174990" },
  { startDate: "2026-09-06", groupSize: 50, seatsLeft: 12, interested: 7, price: "164990" },
  { startDate: "2026-09-12", groupSize: 50, seatsLeft: 6, interested: 11, price: "164990" },
  { startDate: "2026-10-06", groupSize: 50, seatsLeft: 10, interested: 5, price: "159990" },
  { startDate: "2026-11-09", groupSize: 50, seatsLeft: 14, interested: 4, price: "154990" },
  { startDate: "2026-12-12", groupSize: 50, seatsLeft: 8, interested: 8, price: "159990" },
];

export function getBatches(): BatchItem[] {
  return DEFAULT_BATCHES;
}

/** Availability of a batch, used for badges and to disable the book CTA. */
export function getBatchStatus(batch: BatchItem): BatchStatus {
  if (batch.seatsLeft === null || batch.seatsLeft === 0) return "sold-out";
  if (batch.fillingFast) return "filling";
  return "available";
}
