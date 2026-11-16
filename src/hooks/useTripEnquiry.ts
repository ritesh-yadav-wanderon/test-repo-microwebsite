import { useCallback } from "react";
import { usePersistentState } from "./usePersistentState";

/** Slugs of customised (private) trips this visitor has already enquired
 *  about, remembered in localStorage so the CTA stays "Enquiry Submitted"
 *  across reloads. */
const KEY = "wo_trip_enquiries";

export function useTripEnquiry(slug: string) {
  const { value, setValue } = usePersistentState<string[]>(KEY, []);
  const submitted = value.includes(slug);
  const markSubmitted = useCallback(
    () => setValue((prev) => (prev.includes(slug) ? prev : [...prev, slug])),
    [setValue, slug]
  );
  return { submitted, markSubmitted };
}
