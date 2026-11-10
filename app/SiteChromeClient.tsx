"use client";

import SiteChrome from "../src/components/SiteChrome";

/** The app's global chrome, mounted once in the root layout above the route
 *  tree — the search/login/burger/filter sheets, the compare FAB, the
 *  floating WhatsApp/scroll-to-top buttons, and (on the home route) the
 *  hero/scroll header. SiteChrome itself is framework-agnostic (useAppNav()
 *  only — its global FilterSheet instance deliberately doesn't read search
 *  params at all, see FilterSheet's own comment), so this wrapper only
 *  exists for the "use client" boundary. */
export default function SiteChromeClient() {
  return <SiteChrome />;
}
