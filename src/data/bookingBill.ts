/**
 * Illustrative bill breakdown shared by the Payments Details tab and the
 * Cancellation screen. In a real integration these values would come from the
 * booking / payment service.
 */
export interface BillItem {
  label: string;
  value: string;
}

export const BILL_ITEMS: BillItem[] = [
  { label: "Hotel - Double Sharing", value: "\u20B92,72,999/- x 2" },
  { label: "Hotel - Single Sharing", value: "\u20B93,52,999/- x 2" },
  { label: "Total Cost", value: "\u20B912,65,996/-" },
  { label: "Deductions", value: "-\u20B913,000/-" },
  { label: "GST @ 5%", value: "\u20B962,650/-" },
  { label: "TCS @ 3%", value: "\u20B939,470/-" },
  { label: "Flight - Round Trip", value: "\u20B960,000/- x 4" },
];

export const TOTAL_TRIP_COST = "15,95,116";
