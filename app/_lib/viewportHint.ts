import { cookies, headers } from "next/headers";
import { VIEWPORT_COOKIE } from "../../src/utils/cookies";

/** Server guess of whether this request will render the desktop layout.
 *  1. the `wo_vp` cookie written by the client from the real viewport;
 *  2. Client Hint `Sec-CH-UA-Mobile` (Chromium sends it by default);
 *  3. user-agent: phones/tablets → mobile, anything else → desktop. */
export async function getViewportHint(): Promise<boolean> {
  const saved = (await cookies()).get(VIEWPORT_COOKIE)?.value;
  if (saved === "d") return true;
  if (saved === "m") return false;

  const h = await headers();
  const chMobile = h.get("sec-ch-ua-mobile");
  if (chMobile === "?1") return false;
  if (chMobile === "?0") return true;

  const ua = h.get("user-agent") ?? "";
  return !/Mobi|Android|iPhone|iPad|iPod|Tablet|Silk|Kindle/i.test(ua);
}
