#!/usr/bin/env node
/**
 * Downloads exports from the Figma Desktop MCP asset server into public/figma/.
 *
 * Prerequisites:
 * - Figma Desktop open with the Design System file
 * - Cursor / MCP connected so assets are served (default http://127.0.0.1:3845/assets)
 *
 * Usage: node scripts/download-figma-assets.mjs
 * Optional: FIGMA_ASSET_BASE=http://127.0.0.1:3845/assets
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "public", "figma");
const BASE = (
  process.env.FIGMA_ASSET_BASE ?? "http://127.0.0.1:3845/assets"
).replace(/\/$/, "");

/** All asset hashes referenced by src/components/about (About-us 1280px). */
const FILES = [
  "6e27ab3204ede1f9de413c4c0774df4b0269b433.png",
  "5db605581f3bea4a33a0e64b17437646cdc40e94.png",
  "bfb0e0abf390abe7b064c4b28afd2cc7ed16cec0.png",
  "17b7a941ce24fc89fefabbb73c43ee37815f75e0.png",
  "51c641e5c316a8facde208b44ecaa0a2e0499d1c.png",
  "178aea7b3a18a094e6d3da0ee55c27e5565c9ae2.png",
  "51870abfb258805eedc6c793acd976bd9b6e1b1d.png",
  "7bcd3c3a477128d2a30d44f34635a4b98e15aa50.png",
  "03b112e2860cd20770049db9aeb3125eaeff4c6b.png",
  "55a63ab143217b6b97190367e97bdc99930d1deb.png",
  "b0e0d08ea2d5be4dc759342298718cb2502060bc.png",
  "ca6baddaa148432fb8082fb30e78e683900970fa.png",
  "f05cfc9ca4cd313477dc7c29ec65643f7b66e3f9.png",
  "9e3eb5110d6f84e6c283ac7bc385409044093691.png",
  "d3c8ae12f43d4529bb774702bce11efd312ef2ac.svg",
  "52c996e9ec7c76bb208b60455f65a258dd7ba7bd.png",
  "5b886c4c2a85d2bb96ab39fee969a4c87196209f.svg",
  "ec582a688ee351e19cba880166073cc0cfdca956.svg",
  "d3eac281564c2d3ab69c3a76add7858ec0b494e5.png",
  "f85f70d5dc020db322a014933351964c8213cb69.svg",
  "bcbaf615c6ec61cf9c2b353dcf1ad197c65fd0ec.svg",
  "0dd038c0f142786b68a22ba1c673ea39046bb605.svg",
  "0b9f0036b254472c8ce3b97b6927f9c1dc77be29.svg",
  /* navigation-bar + team social + value chevron (from get_design_context) */
  "0871521a347fe0ac4ff77e35f60d43b735f83423.svg",
  "6c632e9bb06c70b22b62abdab70d2a6be8d6ed06.svg",
  "875ee872dc9eeea268782b92f80372419313bffa.svg",
  "86e35d1e7a0bcbf9efaa1f099c4196dc85e39e3f.svg",
  "0dfcd344a6ce667e7965febb0c4c75513addfe11.svg",
  "d2a746c642168032d16b79e0f0803484a697a1e0.svg",
  "48dc7db5deb1d83a287718fbc13caf48686a1375.svg",
  "85ee3c73e37c4f1f980ed41b6aa570de832616e3.svg",
  /* section-footer (230:1965) — web / mail / phone + skyline strip */
  "4b074ab72af3fd49fc1f3e2492579f81a853829f.png",
  "c8bef2f0a85985f7e63aa43b87eaa44c99127295.svg",
  "35508e4a9e13d853a35ee86614576bc224551c1a.svg",
  "4da4cae07c4a318997e4aaa3174c2791aca67bfb.svg",
  /* international trips (223:5159) */
  "c22586e5f476cbbc2f6222a894c573f200b4d381.svg",
  "63aa3f8b931038d3483157ef9ef02bdd5ee96b7a.svg",
  "303eb01bc37f9ca145ce22e485986609128f9692.png",
  "852ea8424ba94796bc1fb90dc993145be35781e2.png",
  "39c540dc43433d5d8bd67ea619b049a398ca5c28.png",
  "4671c90389ee89d8d2d92339a776fc912dd06171.png",
  "11456deabf8c3df8305266e3db3ecd4893278355.png",
  "65806b52dedc310bf3a5bdca3128f38df81770e1.svg",
];

async function main() {
  await mkdir(OUT, { recursive: true });
  let ok = 0;
  let fail = 0;
  for (const name of FILES) {
    const url = `${BASE}/${name}`;
    const dest = join(OUT, name);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`FAIL ${res.status} ${url}`);
        fail++;
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      await writeFile(dest, buf);
      console.log(`OK ${name}`);
      ok++;
    } catch (e) {
      console.error(`FAIL ${url}`, e.message);
      fail++;
    }
  }
  console.log(`\nDone: ${ok} saved, ${fail} failed → ${OUT}`);
  if (fail > 0) {
    process.exitCode = 1;
  }
}

main();
