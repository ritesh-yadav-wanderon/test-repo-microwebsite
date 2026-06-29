# Handoff — WanderOn 2026 Homepage (finish in Claude Code locally)

This React/Vite app is a working, structured implementation of the Figma homepage,
built inside a sandbox that **blocked two things** needed for pixel-perfect work:

1. Figma's `get_design_context` (exact-CSS export) **timed out** — frames were
   reconstructed from `get_metadata` + screenshots instead.
2. The network allowlist **blocked `figma.com`**, so real image assets could not
   be downloaded; they're currently inline-SVG / representative photos.

Running this locally with Claude Code removes both limits (your Figma desktop app
+ MCP work, and your network can reach Figma). This doc is the pickup guide.

---

## Figma source
- File: **Website - 2026** — `https://www.figma.com/design/PkJeGSCjOki7vnM9xlyNoD/Website---2026`
- File key: `PkJeGSCjOki7vnM9xlyNoD`
- Homepage root node: `3014:8007` (390px-wide mobile frame, height ~6643)

## First two steps in Claude Code
1. **Pull the real assets** (one command):
   ```bash
   FIGMA_TOKEN=figd_your_token node scripts/fetch-figma-assets.mjs
   ```
   Downloads logo, monuments, and category icons into `public/figma/`.
   Components auto-use them (`src/components/FigmaImg.jsx`); SVG is only a fallback.
2. **Tighten each frame's CSS** using the real code export:
   call `get_design_context(nodeId)` per node below, then reconcile the generated
   CSS against the existing component's `.css` (spacing, font metrics, radii, shadows).

---

## Frame → component → Figma node map

| Section (top → bottom) | Component | Figma node(s) |
|---|---|---|
| Top nav (logo + profile) | `HeroHeader.jsx` | `3014:9085` (logo `3014:9097`, profile `3014:9099`) |
| Hero (headline + search + marquee) | `HeroHeader.jsx` | `3014:9030` (flattened image — headline/search baked in) |
| Category tabs | `CategoryStrip.jsx` | `3014:9055` (icons `9062/9066/9070/9074/9078/9082`) |
| Upcoming Group Trips (header/filters/tabs) | `UpcomingTrips.jsx` | `3014:8009` |
| Trip cards carousel | `TripCard.jsx` | `3014:8032` (card `3113:13947`, image `3113:13951`) |
| The Plot | `PlotBanner.jsx` | `3014:8182` (title `3014:8184`, sub `3014:8186`) |
| Domestic Destinations | `DestinationStrip.jsx` | `3014:8830` (tiles `8835/8840/8845/8850/8855/8860/8865`) |
| International Destinations | `DestinationStrip.jsx` | `3014:8870` |
| WanderOn Originals | `OriginalsSection.jsx` | `3014:8910` |
| The Tribe / Travel Stories | `TribeStories.jsx` | `3014:8918` |
| The Seat / Trip Captain | `TheSeat.jsx` | `3014:8942` |
| Create moments | `CreateMoments.jsx` | `3113:9963` |
| Have a query? banner | `QueryBanner.jsx` | `3113:9934` |
| Footer | `Footer.jsx` | `3014:8983` |
| Bottom nav | `BottomNav.jsx` | `3014:9101` |

### Asset node IDs (already in `scripts/fetch-figma-assets.mjs`)
- Logo `3014:9097` · Hero `3014:9030`
- Monuments: Egypt `3014:8836`, Bali `3014:8841`, Japan `3014:8846`,
  Thailand `3014:8851`, Europe `3014:8856`, Dubai `3014:8861`, Vietnam `3014:8866`
- Category icons: balloon `3014:9062`, diamond `3014:9066`, torii `3014:9070`,
  lantern `3014:9074`, coconut `3014:9078`, car `3014:9082`

---

## Design tokens (from `get_variable_defs`)
- Fonts: **Roboto** (400/500/700/900); **Caveat** for the hand-drawn hero/section titles.
- Text: primary `#202020`, secondary `#3d3d3d`, tertiary `#4e4e4e`.
- Greys: neutral `#fbfbfb`, grey-1 `#f2f2f2`, grey-2 `#e5e5e5`.
- Brand: green `#0f4a3a`, teal (search/footer accent) `#17a2c6`, yellow `#ffd84d`,
  accent/brown `#8a6a4f`, cream `#f5e9dc`.
- Defined as CSS variables in `src/styles/global.css`.

## Data (read-only APIs, no write endpoints used)
- Trips: `GET /upcomingTrips` (CMS backend) → `src/api/index.js`, shape mirrors
  `WanderOn-Website/src/utilities/homepage3-data.js`.
- Destinations: `GET /misc/destinations` (LF api). Trip detail: `GET /trip/:slug`.
- Dev proxy + CORS handled in `vite.config.js`; offline fallback in `src/api/sampleData.js`.

---

## Known gaps to finish locally
1. **Assets** — run the fetch script; extend its `ASSETS` map with photo nodes for
   Originals / Tribe / Seat / Create-moments / Query backgrounds (export those node
   IDs from the matching frames above). Currently those photos are representative.
2. **Exact spacing/typography** — reconcile each component `.css` against
   `get_design_context` output (the sandbox couldn't run it).
3. **Hero** — currently rebuilt as live DOM (functional search). If you want the
   exact baked visual instead, set `public/figma/hero.png` as the background and
   drop the overlay text.
4. **Trip card** — wired to live data; verify against `3014:8032` once the API is
   reachable from your network (also has a women-only batch variant in the design).
5. **Other pages** — Destination Landing, Product, Booking are not built yet
   (routes stubbed in `src/App.jsx`).

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```
