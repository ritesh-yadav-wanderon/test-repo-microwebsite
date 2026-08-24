// Payment history shown on the account ledger screen. In a real integration
// these entries would come from the payment service.

export interface Transaction {
  amount: string;
  meta: string;
}

export interface LedgerEntry {
  id: string;
  tripTitle: string;
  tripDates: string;
  transactions: Transaction[];
  /** Present when a balance is still due — renders the Pay Due CTA. */
  due?: { amount: string; date: string };
}

export const PAYMENT_LEDGER: LedgerEntry[] = [
  {
    id: "europe-due",
    tripTitle: "15 Days Europe Group trip 2026: Paris, Amsterdam & Switzerland",
    tripDates: "23 July 2026 - 3 Aug 2026",
    transactions: [
      { amount: "\u20B9100000", meta: "Date: 13 July 2026 | Paid via: UPI" },
      { amount: "\u20B924550", meta: "Date: 13 July 2026 | Paid via: UPI" },
    ],
    due: { amount: "\u20B911000", date: "18 Jul 2026" },
  },
  {
    id: "europe-paid",
    tripTitle: "15 Days Europe Group trip 2026: Paris, Amsterdam & Switzerland",
    tripDates: "23 July 2026 - 3 Aug 2026",
    transactions: [
      { amount: "\u20B9100000", meta: "Date: 13 July 2026 | Paid via: UPI" },
      { amount: "\u20B924550", meta: "Date: 13 July 2026 | Paid via: UPI" },
    ],
  },
];
