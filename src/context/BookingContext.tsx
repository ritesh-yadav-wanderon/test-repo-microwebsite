import { createContext, useCallback, useContext, useEffect, useState } from "react";

/** Lifecycle status of a booking. */
export type BookingStatus = "active" | "cancellation_requested" | "cancelled";

interface BookingCtx {
  /** Current status for a booking reference (defaults to "active"). */
  statusOf: (ref: string) => BookingStatus;
  /** Mark a booking as having a pending cancellation request. */
  requestCancellation: (ref: string) => void;
  /** Roll a pending cancellation request back to active. */
  withdrawCancellation: (ref: string) => void;
  /** Set an explicit status for a booking. */
  setStatus: (ref: string, status: BookingStatus) => void;
}

const STORAGE_KEY = "wanderon_booking_status";

function readStore(): Record<string, BookingStatus> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, BookingStatus>) : {};
  } catch {
    return {};
  }
}

const BookingContext = createContext<BookingCtx>({
  statusOf: () => "active",
  requestCancellation: () => {},
  withdrawCancellation: () => {},
  setStatus: () => {},
});

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [statuses, setStatuses] = useState<Record<string, BookingStatus>>(() =>
    readStore()
  );

  // Keep the persisted copy in sync with in-memory state.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses));
    } catch {
      /* ignore quota / private-mode errors */
    }
  }, [statuses]);

  const setStatus = useCallback((ref: string, status: BookingStatus) => {
    setStatuses((prev) => ({ ...prev, [ref]: status }));
  }, []);

  const statusOf = useCallback(
    (ref: string): BookingStatus => statuses[ref] ?? "active",
    [statuses]
  );

  const requestCancellation = useCallback(
    (ref: string) => setStatus(ref, "cancellation_requested"),
    [setStatus]
  );

  const withdrawCancellation = useCallback(
    (ref: string) => setStatus(ref, "active"),
    [setStatus]
  );

  return (
    <BookingContext.Provider
      value={{ statusOf, requestCancellation, withdrawCancellation, setStatus }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  return useContext(BookingContext);
}
