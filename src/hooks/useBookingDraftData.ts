import { useEffect, useRef, useState } from "react";
import { getBookingDraft, type BookingDraft } from "@/repositories";

/**
 * Fetches a persisted booking by orderId — but only when there's no
 * faster source already available (react-router state from a same-tab
 * checkout hand-off, or Next.js's SSR-provided `initialData`). This is the
 * fix for "refresh loses booking data": a hard refresh or a direct link has
 * neither of those, so PaymentSuccess/MyBooking now fetch the real
 * persisted record instead of silently falling back to a hardcoded fixture.
 *
 * `skip` is true whenever the caller already has usable state (e.g.
 * location.state on a same-tab nav) — fetching would just be redundant and
 * risks a race against the record this same navigation just PATCHed.
 */
export function useBookingDraftData(
  orderId: string,
  skip: boolean,
  initialData?: BookingDraft | null
): { draft: BookingDraft | null; loading: boolean } {
  const [draft, setDraft] = useState<BookingDraft | null>(initialData ?? null);
  const [loading, setLoading] = useState(!skip && !initialData);
  const consumedRef = useRef(false);

  useEffect(() => {
    if (skip) {
      setLoading(false);
      return;
    }
    if (initialData !== undefined && !consumedRef.current) {
      // First mount already has server-provided data for this exact orderId.
      consumedRef.current = true;
      return;
    }
    let cancelled = false;
    setLoading(true);
    getBookingDraft(orderId).then((doc) => {
      if (cancelled) return;
      setDraft(doc);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, skip]);

  return { draft, loading };
}

/** Maps the persisted draft's field names onto the shape PaymentSuccess/
 *  MyBooking's own local state objects use (they predate this persistence
 *  layer and use `startDate` where the draft schema uses `dateRange`). */
export function draftToBookingView(draft: BookingDraft | null): Record<string, unknown> {
  if (!draft) return {};
  return {
    ref: draft.orderId,
    phone: draft.phone,
    email: draft.email,
    travellerName: draft.travellerName,
    amountPaid: draft.amountPaid,
    paidAt: draft.paidAt,
    paymentMethod: draft.paymentMethod,
    tripTitle: draft.tripTitle,
    tripName: draft.tripName,
    startDate: draft.dateRange,
    durationLabel: draft.durationLabel,
    travelers: draft.travelers,
    dueBalance: draft.dueBalance,
    pickUp: draft.pickUp,
    drop: draft.drop,
    pickUpDate: draft.pickUpDate,
    dropDate: draft.dropDate,
  };
}
