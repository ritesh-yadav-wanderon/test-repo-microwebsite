import puppeteer from "puppeteer";

const BASE = "http://localhost:5199";
const MOBILE = { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
const DESKTOP = { width: 1440, height: 900 };

const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const errors = [];

async function page(viewport) {
  const p = await browser.newPage();
  await p.setViewport(viewport);
  p.on("pageerror", (e) => errors.push(String(e)));
  p.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  return p;
}

const results = [];
async function check(name, fn) {
  try {
    const r = await fn();
    results.push(`${r ? "PASS" : "FAIL"}  ${name}${r && r !== true ? ` — ${r}` : ""}`);
  } catch (e) {
    results.push(`ERR   ${name} — ${e.message.split("\n")[0]}`);
  }
}

const visible = (p, sel) =>
  p.$eval(sel, (el) => {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return s.visibility !== "hidden" && Number(s.opacity) > 0.01 && r.height > 50 && r.top < window.innerHeight;
  });

/** The app locks `.app-shell`, falling back to <body>. */
const locked = (p) =>
  p.evaluate(() => {
    const el = document.querySelector(".app-shell");
    return (el ? el.style.overflow : document.body.style.overflow) === "hidden";
  });

await check("mobile burger menu opens + locks scroll", async () => {
  const p = await page(MOBILE);
  await p.goto(BASE, { waitUntil: "networkidle2" });
  await p.click("[aria-label='Open menu'], .h2-burger, .hs-burger, .hdr-burger");
  await p.waitForSelector(".bm-panel--open", { timeout: 5000 });
  const ok = (await visible(p, ".bm-panel")) && (await locked(p));
  await p.close();
  return ok;
});

await check("mobile search sheet opens", async () => {
  const p = await page(MOBILE);
  await p.goto(BASE, { waitUntil: "networkidle2" });
  await p.click("[data-hero-search] input, [data-hero-search]");
  await p.waitForSelector(".sbs-sheet", { timeout: 5000 });
  await new Promise((r) => setTimeout(r, 500)); // let the slide-up finish
  const ok = await visible(p, ".sbs-sheet");
  await p.close();
  return ok;
});

await check("mobile batches sheet opens, sold-out CTA disabled", async () => {
  const p = await page(MOBILE);
  await p.goto(`${BASE}/trip/15-days-europe-group-trip`, { waitUntil: "networkidle2" });
  await p.waitForSelector(".wo-cta", { timeout: 8000 });
  const opened = await p.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].find((b) => /batches/i.test(b.textContent || ""));
    if (!btn) return false;
    btn.click();
    return true;
  });
  if (!opened) return false;
  await p.waitForSelector(".bsh-sheet--open", { timeout: 5000 });
  const vis = await visible(p, ".bsh-sheet");
  const soldOutDisabled = await p.$$eval(".bsh-card-cta", (btns) =>
    btns.filter((b) => /sold out/i.test(b.textContent || "")).every((b) => b.disabled)
  );
  await p.close();
  return vis && soldOutDisabled ? "sold-out CTAs disabled" : false;
});

await check("mobile itinerary customiser opens + applies", async () => {
  const p = await page(MOBILE);
  await p.goto(`${BASE}/trip/15-days-europe-group-trip`, { waitUntil: "networkidle2" });
  await p.waitForSelector(".tdp2-se-card, .tdp2-ti-skeleton", { timeout: 8000 });
  await p.evaluate(() => document.querySelector(".tdp2-se-card, .tdp2-ti-skeleton")?.scrollIntoView({ block: "center" }));
  await p.click(".tdp2-se-card, .tdp2-ti-skeleton");
  await p.waitForSelector(".itc-sheet", { timeout: 5000 });
  const vis = await visible(p, ".itc-sheet");
  const wasLocked = await locked(p);
  await p.click(".itc-cta-btn");
  await p.waitForFunction(() => !document.querySelector(".itc-sheet"), { timeout: 5000 });
  const unlocked = !(await locked(p));
  await p.close();
  return vis && wasLocked && unlocked ? "opens, applies, scroll locked then released" : false;
});

await check("mobile filter sheet + sort sheet", async () => {
  const p = await page(MOBILE);
  await p.goto(`${BASE}/search`, { waitUntil: "networkidle2" });
  await p.waitForSelector("button", { timeout: 8000 });
  const sorted = await p.evaluate(() => {
    const b = [...document.querySelectorAll("button")].find((x) => /sort/i.test(x.textContent || ""));
    if (!b) return false;
    b.click();
    return true;
  });
  await p.waitForSelector(".sr-sort--open", { timeout: 5000 });
  await new Promise((r) => setTimeout(r, 500)); // let the slide-up finish
  const sortVis = await visible(p, ".sr-sort-panel");
  await p.evaluate(() => document.querySelector(".sr-sort-close").click());
  await new Promise((r) => setTimeout(r, 400));
  const filtered = await p.evaluate(() => {
    const b = [...document.querySelectorAll("button")].find((x) => /filter/i.test(x.textContent || ""));
    if (!b) return false;
    b.click();
    return true;
  });
  let filterVis = false;
  if (filtered) {
    await p.waitForSelector(".fs-sheet--open", { timeout: 5000 });
    filterVis = await visible(p, ".fs-sheet");
  }
  await p.close();
  return sorted && sortVis && filterVis;
});

await check("desktop batches sheet opens", async () => {
  const p = await page(DESKTOP);
  await p.goto(`${BASE}/trip/15-days-europe-group-trip`, { waitUntil: "networkidle2" });
  await p.waitForSelector(".dtdp, .dtdp-hero", { timeout: 8000 });
  const clicked = await p.evaluate(() => {
    const b = [...document.querySelectorAll("button")].find((x) => /all departures|view batches|batches/i.test(x.textContent || ""));
    if (!b) return false;
    b.click();
    return true;
  });
  if (!clicked) return false;
  await p.waitForSelector(".dbat", { timeout: 5000 });
  const ok = await visible(p, ".dbat");
  await p.close();
  return ok;
});

console.log(results.join("\n"));
console.log("\nconsole/page errors:", errors.length ? "\n - " + errors.slice(0, 10).join("\n - ") : "none");
await browser.close();
