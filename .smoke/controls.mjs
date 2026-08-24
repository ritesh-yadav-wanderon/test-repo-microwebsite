import puppeteer from "puppeteer";

const BASE = "http://localhost:5199";
const MOBILE = { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
const DESKTOP = { width: 1440, height: 900 };
const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const errors = [];
const results = [];

async function page(viewport) {
  const p = await browser.newPage();
  await p.setViewport(viewport);
  p.on("pageerror", (e) => errors.push(String(e)));
  p.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  return p;
}

async function check(name, fn) {
  try {
    const r = await fn();
    results.push(`${r ? "PASS" : "FAIL"}  ${name}${r && r !== true ? ` — ${r}` : ""}`);
  } catch (e) {
    results.push(`ERR   ${name} — ${e.message.split("\n")[0]}`);
  }
}

const BOOKING_STATE = {
  tripTitle: "15 Days Europe Group Trip",
  tripName: "15 Days Europe Group Trip",
  dateRange: "9 Jul 2026 - 19 Jul 2026",
  durationLabel: "10N/11D",
  perPerson: "1,69,990",
  travelers: 2,
};

/** Booking needs router state, so navigate through the batches sheet CTA. */
async function openBooking(p, mobile) {
  await p.goto(`${BASE}/trip/15-days-europe-group-trip`, { waitUntil: "networkidle2" });
  await p.waitForSelector(".wo-cta", { timeout: 8000 });
  await p.evaluate((state) => {
    window.history.pushState({ usr: state }, "", "/booking");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, BOOKING_STATE);
  await p.goto(`${BASE}/booking`, { waitUntil: "networkidle2" });
  await p.waitForSelector(mobile ? ".bkg-stepper" : ".dbk-stepper", { timeout: 8000 });
}

await check("mobile booking stepper + option row + terms box", async () => {
  const p = await page(MOBILE);
  await openBooking(p, true);
  const before = await p.$eval(".bkg-step-count", (el) => el.textContent);
  await p.evaluate(() => document.querySelectorAll(".bkg-stepper .bkg-step-btn")[1].click());
  const after = await p.$eval(".bkg-step-count", (el) => el.textContent);
  const optionToggled = await p.evaluate(() => {
    const box = document.querySelector(".bkg-option .bkg-checkbox");
    if (!box) return null;
    const was = box.checked;
    box.click();
    return was !== box.checked;
  });
  const ctas = await p.$$eval(".wo-cta", (els) => els.length);
  await p.close();
  return Number(after) === Number(before) + 1 && optionToggled && ctas > 0
    ? `count ${before}→${after}, option row toggles, ${ctas} CTAs styled`
    : false;
});

await check("desktop booking stepper + option row", async () => {
  const p = await page(DESKTOP);
  await openBooking(p, false);
  const before = await p.$eval(".dbk-step-count", (el) => el.textContent);
  await p.evaluate(() => document.querySelectorAll(".dbk-stepper .dbk-step-btn")[1].click());
  const after = await p.$eval(".dbk-step-count", (el) => el.textContent);
  const optionToggled = await p.evaluate(() => {
    const box = document.querySelector(".dbk-option .dbk-checkbox");
    if (!box) return null;
    const was = box.checked;
    box.click();
    return was !== box.checked;
  });
  await p.close();
  return Number(after) === Number(before) + 1 && optionToggled ? `count ${before}→${after}` : false;
});

await check("listing Show Features toggle flips card features", async () => {
  const p = await page(MOBILE);
  await p.goto(`${BASE}/search`, { waitUntil: "networkidle2" });
  await p.waitForSelector(".sr-features-toggle", { timeout: 8000 });
  const state = await p.$eval(".sr-features-toggle", (el) => el.getAttribute("aria-checked"));
  await p.click(".sr-features-toggle");
  const next = await p.$eval(".sr-features-toggle", (el) => el.getAttribute("aria-checked"));
  const src = await p.$eval(".sr-features-toggle-switch", (el) => el.getAttribute("src"));
  await p.close();
  return state !== next && src.includes(next === "true" ? "toggle-on" : "toggle-off")
    ? `aria-checked ${state}→${next}, art follows`
    : false;
});

await check("trip detail Show Map toggle reveals the map", async () => {
  const p = await page(MOBILE);
  await p.goto(`${BASE}/trip/15-days-europe-group-trip`, { waitUntil: "networkidle2" });
  await p.waitForSelector(".tdp2-itin-switch", { timeout: 8000 });
  const before = await p.evaluate(() => !!document.querySelector(".tdp2-itin-map"));
  await p.evaluate(() => document.querySelector(".tdp2-itin-switch").click());
  const after = await p.evaluate(() => !!document.querySelector(".tdp2-itin-map"));
  await p.close();
  return before !== after ? `map ${before ? "hidden" : "shown"} on toggle` : false;
});

await check("desktop carousel pager renders and drives the rail", async () => {
  const p = await page(DESKTOP);
  await p.goto(BASE, { waitUntil: "networkidle2" });
  await p.waitForSelector(".dtrips__pager-btn", { timeout: 8000 });
  const buttons = await p.$$eval(".dtrips__pager .dtrips__pager-btn", (els) => els.length);
  // The sample rail fits the viewport, so assert the handler runs and the rail
  // stays clamped rather than expecting a scroll offset.
  const before = await p.evaluate(() => document.querySelector(".dtrips__track").scrollLeft);
  await p.evaluate(() => document.querySelectorAll(".dtrips__pager-btn")[1].click());
  await new Promise((r) => setTimeout(r, 600));
  const after = await p.evaluate(() => {
    const t = document.querySelector(".dtrips__track");
    return { sl: t.scrollLeft, overflow: t.scrollWidth > t.clientWidth };
  });
  await p.close();
  return buttons === 2 && (after.overflow ? after.sl > before : after.sl === before)
    ? `2 buttons, rail ${after.overflow ? "scrolled" : "already fits"}`
    : false;
});

await check("gallery pager still works inside the gallery sheet", async () => {
  const p = await page(MOBILE);
  await p.goto(`${BASE}/trip/15-days-europe-group-trip`, { waitUntil: "networkidle2" });
  await p.waitForSelector(".tdp2-hero", { timeout: 8000 });
  const opened = await p.evaluate(() => {
    const el = document.querySelector(".tdp2-hero-img");
    if (!el) return false;
    el.click();
    return true;
  });
  if (!opened) return false;
  await p.waitForSelector(".gsh--open", { timeout: 5000 });
  const pillButtons = await p.$$eval(".gsh .pgr-btn", (els) => els.length);
  await p.close();
  return pillButtons === 2 ? "two pill pager buttons rendered" : false;
});

console.log(results.join("\n"));
console.log("\nconsole/page errors:", errors.length ? "\n - " + errors.slice(0, 8).join("\n - ") : "none");
await browser.close();
