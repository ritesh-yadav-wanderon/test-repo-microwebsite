import { describe, expect, it, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { useBookingForm } from "./useBookingForm";
import { AppNavContext, type AppNav } from "./useAppNav";
import { AppSearchParamsContext } from "./useAppSearchParams";
import { AuthProvider } from "@/context/AuthContext";
import { BOOKING_DEFAULTS, FLEX_CANCEL_PP, WANDERON_DISCOUNT, GST_RATE, TCS_RATE } from "@/repositories";
import type { BookingState } from "./useBookingForm";

const noopNav: AppNav = {
  pathname: "/booking",
  push: () => {},
  replace: () => {},
  back: () => {},
  go: () => {},
};

function wrapperWithNav(path = "/booking", search = "") {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <AppNavContext.Provider value={{ ...noopNav, pathname: path }}>
        <AppSearchParamsContext.Provider value={new URLSearchParams(search)}>
          <AuthProvider>{children}</AuthProvider>
        </AppSearchParamsContext.Provider>
      </AppNavContext.Provider>
    );
  };
}

function priceOf(str: string): number {
  return Number(str.replace(/[^\d]/g, ""));
}

beforeEach(() => {
  localStorage.clear();
});

describe("useBookingForm — defaults", () => {
  it("falls back to BOOKING_DEFAULTS when opened with no state", () => {
    const { result } = renderHook(() => useBookingForm(), { wrapper: wrapperWithNav() });
    expect(result.current.data.tripTitle).toBe(BOOKING_DEFAULTS.tripTitle);
    expect(result.current.data.dateRange).toBe(BOOKING_DEFAULTS.dateRange);
  });

  it("generates a WO-<timestamp> orderId when no draft is carried forward", () => {
    const { result } = renderHook(() => useBookingForm(), { wrapper: wrapperWithNav() });
    expect(result.current.orderId).toMatch(/^WO-\d+$/);
  });

  it("reuses the draft's orderId instead of generating a new one", () => {
    const state: BookingState = {
      draft: { travelers: 2, flexibleCancel: false, appliedVoucher: null, orderId: "WO-fixed-123" },
    };
    const { result } = renderHook(() => useBookingForm(state), { wrapper: wrapperWithNav() });
    expect(result.current.orderId).toBe("WO-fixed-123");
  });

  it("prefers a `?orderId=` query param over generating a new orderId when there's no navState", () => {
    const { result } = renderHook(() => useBookingForm(), {
      wrapper: wrapperWithNav("/booking/personal-details", "orderId=WO-from-url"),
    });
    expect(result.current.orderId).toBe("WO-from-url");
  });

  it("flags isPersonalDetails based on the current path", () => {
    const { result: onBooking } = renderHook(() => useBookingForm(), { wrapper: wrapperWithNav("/booking") });
    expect(onBooking.current.isPersonalDetails).toBe(false);

    const { result: onDetails } = renderHook(() => useBookingForm(), {
      wrapper: wrapperWithNav("/booking/personal-details"),
    });
    expect(onDetails.current.isPersonalDetails).toBe(true);
  });
});

describe("useBookingForm — pricing", () => {
  it("prices room subtotal as perPerson × travelers, plus the flat WanderOn discount once travelers > 0", () => {
    const { result } = renderHook(() => useBookingForm(), { wrapper: wrapperWithNav() });
    const perPerson = priceOf(BOOKING_DEFAULTS.perPerson);
    const travelers = result.current.travelers; // default 1

    expect(result.current.pricing.roomSubtotal).toBe(perPerson * travelers);
    expect(result.current.pricing.wanderOnDiscount).toBe(WANDERON_DISCOUNT);
  });

  it("recomputes pricing when travelers changes", () => {
    const { result } = renderHook(() => useBookingForm(), { wrapper: wrapperWithNav() });
    const perPerson = priceOf(BOOKING_DEFAULTS.perPerson);

    act(() => result.current.setTravelers(3));
    expect(result.current.travelers).toBe(3);
    expect(result.current.pricing.roomSubtotal).toBe(perPerson * 3);
  });

  it("adds FLEX_CANCEL_PP per traveller when flexibleCancel is toggled on", () => {
    const { result } = renderHook(() => useBookingForm(), { wrapper: wrapperWithNav() });
    act(() => result.current.setTravelers(2));
    act(() => result.current.setFlexibleCancel(true));
    expect(result.current.pricing.flexTotal).toBe(FLEX_CANCEL_PP * 2);
  });

  it("applies GST and TCS at the configured rates on top of the discounted net", () => {
    const { result } = renderHook(() => useBookingForm(), { wrapper: wrapperWithNav() });
    const { net, gst, tcs, toPay } = (() => {
      const p = result.current.pricing;
      const netVal = Math.max(0, p.gross - p.discountTotal);
      return { net: netVal, gst: Math.round(netVal * GST_RATE), tcs: Math.round(netVal * TCS_RATE), toPay: p.toPay };
    })();
    expect(result.current.pricing.gst).toBe(gst);
    expect(result.current.pricing.tcs).toBe(tcs);
    expect(toPay).toBe(net + gst + tcs);
  });

  it("does not count strike-through savings when the strike price is not actually higher (BOOKING_DEFAULTS shape)", () => {
    // BOOKING_DEFAULTS.perPersonStrike ("29,000") is lower than perPerson
    // ("1,79,990") — a placeholder-data case the hook explicitly guards against.
    const { result } = renderHook(() => useBookingForm(), { wrapper: wrapperWithNav() });
    expect(priceOf(BOOKING_DEFAULTS.perPersonStrike)).toBeLessThan(priceOf(BOOKING_DEFAULTS.perPerson));
    expect(result.current.pricing.strikeSavings).toBe(0);
  });

  it("counts strike-through savings per traveller when the strike price genuinely is higher", () => {
    const state: BookingState = { perPerson: "10,000", perPersonStrike: "15,000" };
    const { result } = renderHook(() => useBookingForm(state), { wrapper: wrapperWithNav() });
    act(() => result.current.setTravelers(2));
    expect(result.current.pricing.strikeSavings).toBe((15000 - 10000) * 2);
  });

  it("applies the voucher discount only once travelers > 0", () => {
    const state: BookingState = { travelers: 0 };
    const { result } = renderHook(() => useBookingForm(state), { wrapper: wrapperWithNav() });
    act(() => result.current.setAppliedVoucher({ code: "SAVE100", amount: 100 } as never));
    act(() => result.current.setTravelers(0));
    expect(result.current.pricing.voucherDiscount).toBe(0);
    act(() => result.current.setTravelers(1));
    expect(result.current.pricing.voucherDiscount).toBe(100);
  });
});
