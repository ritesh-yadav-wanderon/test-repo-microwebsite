# WanderOn Micro-Website (React)

A React (Vite) implementation of the WanderOn **2026** mobile website, built from
the Figma design `Website - 2026` and wired to the live WanderOn trip/destination
APIs.

> **Status:** Homepage is built end-to-end (pixel-matched to Figma + wired to real
> trip data). Destination Landing, Product, and Booking pages are scaffolded next.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build -> dist/
```

## Data sources (read-only)

All data comes from **GET** endpoints only — no write/mutation endpoints from the
source codebase are used. Endpoints are defined in `src/api/config.js`:

| Purpose | Endpoint | Used on |
|---|---|---|
| Upcoming group trips (cards) | `GET /upcomingTrips` (CMS backend) | Homepage |
| Destinations list | `GET /misc/destinations` (LF api) | Homepage strips (wired) |
| Single trip by slug | `GET /trip/:slug` (CMS backend) | Product page (next) |

Response shapes mirror the original codebase (`WanderOn-Website/src/utilities/`).

### CORS / local development
The live `upcomingTrips` API may block cross-origin requests from `localhost`.
The Vite dev server proxies `/cms-api/*` and `/lf-api/*` to the staging backends
(see `vite.config.js`) to avoid this. If the API is still unreachable, the UI
gracefully falls back to bundled sample data in `src/api/sampleData.js` (a small
"demo data" flag appears next to the Upcoming Group Trips heading).

## Structure

```
src/
  api/            config (endpoints), client with fallback, sample data
  components/     HeroHeader, UpcomingTrips, TripCard, PlotBanner,
                  DestinationStrip, OriginalsSection, TribeStories, TheSeat,
                  CreateMoments, QueryBanner, Footer, BottomNav
  pages/          Home.jsx + Home.css
  styles/         global.css (design tokens from Figma variables)
```

## Design fidelity
Built from the Figma file `Website - 2026` (node `3014-8007`). Layout, section
order, copy, colors, and the Roboto type scale are taken directly from the Figma
metadata, variables, and section renders. Real copy used verbatim, e.g. the hero
headline *"Trip is the destination. Community is the point!"*, the search field
*"Search destination, dates, budget…"*, the category tabs (All Trips, Adventure,
Luxury, Culture, Festival, Wellness, Weekend), and every section heading.

Design tokens live as CSS custom properties in `src/styles/global.css`. The layout
is a mobile-first 420px canvas centered on larger screens, matching the 390px frame.

### Getting the real Figma assets (one command)
The exact Figma raster assets (logo, monument destination icons, category icons,
hero) are pulled straight from Figma by a script. They are **not** committed,
because the authoring environment blocks `figma.com`. Run this once on your
machine (which has network access):

```bash
FIGMA_TOKEN=figd_your_token node scripts/fetch-figma-assets.mjs
```

Get a token at Figma → Settings → Security → Personal access tokens. The script
downloads the real renders into `public/figma/` (logo, `dest-*` monuments,
`cat-*` icons, hero) using the exact node IDs from the design.

The components reference these files automatically (`FigmaImg.jsx`). Until the
script is run, each image **falls back to an inline-SVG recreation** so the UI
never breaks — but the real Figma assets take over as soon as they're present.
To add more assets (section photos, etc.), extend the `ASSETS` map in
`scripts/fetch-figma-assets.mjs` with `name: "nodeId"` pairs.

**Trip-card images come from the live API** (real WanderOn imagery) at runtime.
