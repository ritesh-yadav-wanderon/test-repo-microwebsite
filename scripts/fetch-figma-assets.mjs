#!/usr/bin/env node
/**
 * Downloads the EXACT image assets from the Figma file into public/figma/.
 *
 * Why a script? The build sandbox blocks figma.com, so assets can't be pulled
 * during authoring. Run this once on a machine with network access; the
 * components automatically use the downloaded files (and fall back to inline
 * SVG only if a file is missing).
 *
 * Usage:
 *   FIGMA_TOKEN=figd_xxx node scripts/fetch-figma-assets.mjs
 *
 * Get a token at: Figma → Settings → Security → Personal access tokens.
 */
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const FILE_KEY = "PkJeGSCjOki7vnM9xlyNoD";
const SCALE = 3;

// key (output filename, no ext) -> Figma node id
const ASSETS = {
  // brand
  logo: "3014:9097",
  hero: "3014:9030",
  // destination monuments (3014:8830 / 3014:8870 tiles)
  "dest-pyramid": "3014:8836", // Egypt
  "dest-tower-tiered": "3014:8841", // Bali
  "dest-torii": "3014:8846", // Japan
  "dest-stupa": "3014:8851", // Thailand
  "dest-arch": "3014:8856", // Europe
  "dest-skyscraper": "3014:8861", // Dubai
  "dest-pagoda": "3014:8866", // Vietnam
  // category-strip icons (3014:9055)
  "cat-balloon": "3014:9062",
  "cat-diamond": "3014:9066",
  "cat-torii": "3014:9070",
  "cat-lantern": "3014:9074",
  "cat-coconut": "3014:9078",
  "cat-car": "3014:9082",
};

const token = process.env.FIGMA_TOKEN;
if (!token) {
  console.error("ERROR: set FIGMA_TOKEN (Figma personal access token).");
  process.exit(1);
}

const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "figma");

async function main() {
  await mkdir(outDir, { recursive: true });
  const ids = Object.values(ASSETS).join(",");
  const api = `https://api.figma.com/v1/images/${FILE_KEY}?ids=${encodeURIComponent(
    ids
  )}&format=png&scale=${SCALE}`;

  const res = await fetch(api, { headers: { "X-Figma-Token": token } });
  if (!res.ok) throw new Error(`Figma API ${res.status}: ${await res.text()}`);
  const { images, err } = await res.json();
  if (err) throw new Error(`Figma API error: ${err}`);

  let ok = 0;
  for (const [key, nodeId] of Object.entries(ASSETS)) {
    const url = images[nodeId];
    if (!url) {
      console.warn(`! no render for ${key} (${nodeId})`);
      continue;
    }
    const img = await fetch(url);
    if (!img.ok) {
      console.warn(`! failed to download ${key}: HTTP ${img.status}`);
      continue;
    }
    const buf = Buffer.from(await img.arrayBuffer());
    await writeFile(join(outDir, `${key}.png`), buf);
    console.log(`✓ ${key}.png (${(buf.length / 1024).toFixed(1)} KB)`);
    ok++;
  }
  console.log(`\nDone: ${ok}/${Object.keys(ASSETS).length} assets → public/figma/`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
