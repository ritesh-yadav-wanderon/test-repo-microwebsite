import { cookies } from "next/headers";
import { TRIP_MODE_COOKIE } from "../../src/utils/cookies";

/** Whether this request is in private-trip mode (see TripModeContext). */
export async function getIsPrivateMode(): Promise<boolean> {
  return (await cookies()).get(TRIP_MODE_COOKIE)?.value === "private";
}
