import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BASE_URL = "http://127.0.0.1:5001";
const STEP_TIMEOUT_MS = 15000;
const rows = [];

function record(route, action, status, details) {
  rows.push({ route, action, status, details });
}

async function runStep(route, action, fn) {
  let timeoutId;
  try {
    await Promise.race([
      fn(),
      new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error(`Step timed out after ${STEP_TIMEOUT_MS}ms`));
        }, STEP_TIMEOUT_MS);
      }),
    ]);
    record(route, action, "pass");
    console.log(`PASS | ${route} | ${action}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    record(route, action, "fail", message);
    console.log(`FAIL | ${route} | ${action} | ${message}`);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

async function run() {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    page.setDefaultTimeout(2500);
    page.setDefaultNavigationTimeout(5000);

  await runStep("/", "open route", async () => {
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
  });

  await runStep("/", "desktop nav How It Works", async () => {
    await page.locator("nav button:has-text('How It Works')").first().click();
    await page.locator("#how-it-works").waitFor({ state: "visible" });
  });

  await runStep("/", "desktop nav Plans", async () => {
    await page.locator("nav button:has-text('Plans')").first().click();
    await page.locator("#plans").waitFor({ state: "visible" });
  });

  await runStep("/", "desktop nav FAQ", async () => {
    await page.locator("nav button:has-text('FAQ')").first().click();
    await page.locator("#faq").waitFor({ state: "visible" });
  });

  await runStep("/", "hero CTA See My Instant Price", async () => {
    await page.locator("button:has-text('See My Instant Price')").first().click();
    await page.locator("#quote").waitFor({ state: "visible" });
  });

  await runStep("/", "FAQ accordion expand", async () => {
    await page.locator("button:has-text('What does the Basic Patrol plan include?')").first().click();
    await page.locator("text=bi-weekly mowing during the growing season").first().waitFor({ state: "visible" });
  });

  await runStep("/", "FAQ accordion second item expand", async () => {
    await page.locator("button:has-text(\"What's the difference between Basic, Premium, and Executive?\")").first().click();
    await page.locator("text=Executive Command includes year-round weekly monitoring").first().waitFor({ state: "visible" });
  });

  await runStep("/", "footer Privacy Policy link", async () => {
    await page.locator("footer").scrollIntoViewIfNeeded();
    await page.locator("footer a:has-text('Privacy Policy')").first().click();
    await page.waitForURL("**/privacy-policy");
  });

  await runStep("/privacy-policy", "back to home", async () => {
    await page.locator("a:has-text('Back to Home')").first().click();
    await page.waitForURL("**/");
  });

  await runStep("/", "footer Terms of Service link", async () => {
    await page.locator("footer").scrollIntoViewIfNeeded();
    await page.locator("footer a:has-text('Terms of Service')").first().click();
    await page.waitForURL("**/terms-of-service");
  });

  await runStep("/terms-of-service", "back to home", async () => {
    await page.locator("a:has-text('Back to Home')").first().click();
    await page.waitForURL("**/");
  });

  await runStep("/", "footer phone link exists", async () => {
    const href = await page.locator("footer a[href^='tel:']").first().getAttribute("href");
    if (!href) throw new Error("No tel link found");
  });

  await runStep("/", "footer mail link exists", async () => {
    const href = await page.locator("footer a[href^='mailto:']").first().getAttribute("href");
    if (!href) throw new Error("No mailto link found");
  });

  await runStep("/simple", "open route", async () => {
    await page.goto(`${BASE_URL}/simple`, { waitUntil: "domcontentloaded" });
  });

  await runStep("/simple", "plan card build button scrolls to wizard", async () => {
    await page.locator("[data-testid='button-build-plan-basic']").click();
    await page.locator("[data-testid='text-wizard-title']").waitFor({ state: "visible" });
  });

  await runStep("/simple", "final CTA scrolls to wizard", async () => {
    await page.locator("[data-testid='button-get-started-bottom']").click();
    await page.locator("[data-testid='text-wizard-title']").waitFor({ state: "visible" });
  });

  await runStep("/simple", "wizard next/back buttons", async () => {
    await page.locator("[data-testid='button-next']").click();
    await page.locator("[data-testid='button-back']").click();
  });

  await runStep("/quotewizard", "open route", async () => {
    await page.goto(`${BASE_URL}/quotewizard`, { waitUntil: "domcontentloaded" });
    await page.locator("text=See Your Instant Price").first().waitFor({ state: "visible" });
  });

  await runStep("/quotewizard", "wizard step 1 -> 2 continue", async () => {
    await page.locator("[data-testid='wizard-yard-1/3']").click();
    await page.locator("button:has-text('Continue')").last().click();
    await page.locator("text=Choose Plan").waitFor({ state: "visible" });
  });

  await runStep("/quotewizard", "wizard step 2 -> 3 continue", async () => {
    await page.locator("[data-testid='wizard-plan-basic']").click();
    await page.locator("button:has-text('Continue')").last().click();
    await page.locator("text=Choose Your Upgrades").waitFor({ state: "visible" });
  });

  await runStep("/quotewizard", "wizard step 3 blocks continue before required add-ons", async () => {
    const disabled = await page.locator("button:has-text('Continue')").last().isDisabled();
    if (!disabled) throw new Error("Continue was enabled before required upgrades selected");
  });

  await runStep("/quotewizard", "wizard step 3 allows continue after required add-ons", async () => {
    await page.locator("label:has-text('Shrub / Hedge Trimming')").first().click();
    await page.locator("label:has-text('Basic Pressure-Wash Package')").first().click();
    await page.locator("label:has-text('Driveway Pressure Wash')").first().click();
    const continueBtn = page.locator("button:has-text('Continue')").last();
    const disabled = await continueBtn.isDisabled();
    if (disabled) throw new Error("Continue stayed disabled after required upgrades selected");
    await continueBtn.click();
    await page.locator("text=Your Contact Details").waitFor({ state: "visible" });
  });

  await runStep("/quotewizard", "wizard back button from step 4", async () => {
    await page.locator("button:has-text('Back')").last().click();
    await page.locator("text=Choose Your Upgrades").waitFor({ state: "visible" });
    await page.locator("button:has-text('Continue')").last().click();
    await page.locator("text=Your Contact Details").waitFor({ state: "visible" });
  });

  await runStep("/quotewizard", "wizard submit with required fields", async () => {
    await page.fill("input[placeholder='Enter full name']", "QA Test");
    await page.fill("input[placeholder='Enter full street address']", "123 Main St, Huntsville AL 35801");
    await page.fill("input[placeholder='Enter email address']", "qa@example.com");
    await page.locator("button:has-text('See My Instant Price')").last().click();
    await page.locator("h2:has-text('Mission Accomplished!')").waitFor({ state: "visible", timeout: 10000 });
  });

  await runStep("/quotewizard", "post-submit download CTA", async () => {
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.locator("button:has-text('Download Quote Summary')").click(),
    ]);
    const suggested = download.suggestedFilename();
    if (!suggested) throw new Error("No download filename");
  });

  await runStep("/quotewizard", "post-submit share copy CTA", async () => {
    await page.locator("button:has-text('Copy Link')").click();
  });

  await runStep("/quotewizard", "post-submit invite neighbors CTA", async () => {
    await page.locator("[data-testid='button-invite-neighbors']").click();
  });

  await runStep("/quotewizard", "post-submit robot waitlist CTA", async () => {
    await page.fill("[data-testid='input-robot-email']", "robotqa@example.com");
    await page.locator("[data-testid='button-robot-waitlist']").click();
    await page.locator("[data-testid='robot-waitlist-success']").waitFor({ state: "visible", timeout: 10000 });
  });

  await runStep("/quotewizard", "post-submit restart CTA", async () => {
    await page.locator("button:has-text('Close & Start New Quote')").click();
    await page.locator("text=See Your Instant Price").first().waitFor({ state: "visible" });
  });

  await runStep("/embed", "open route", async () => {
    await page.goto(`${BASE_URL}/embed`, { waitUntil: "domcontentloaded" });
    await page.locator("[data-testid='text-wizard-title']").waitFor({ state: "visible" });
  });

  await runStep("/embed", "wizard next/back actions", async () => {
    await page.locator("[data-testid='button-next']").click();
    await page.locator("[data-testid='button-back']").click();
  });

  await runStep("/promotions", "open route", async () => {
    await page.goto(`${BASE_URL}/promotions`, { waitUntil: "domcontentloaded" });
    await page.locator("h1:has-text('Ways to Save')").waitFor({ state: "visible" });
  });

  await runStep("/promotions", "term selection buttons", async () => {
    await page.locator("[data-testid='promo-term-1-year']").click();
    await page.locator("[data-testid='promo-term-2-year']").click();
  });

  await runStep("/promotions", "pay-in-full toggle", async () => {
    await page.locator("[data-testid='promo-pay-in-full-toggle']").click();
  });

  await runStep("/promotions", "plan and yard selectors", async () => {
    await page.locator("[data-testid='promo-plan-select']").selectOption("basic");
    await page.locator("[data-testid='promo-yard-select']").selectOption("2/3");
  });

  await runStep("/promotions", "back to quote builder CTA", async () => {
    await page.locator("button:has-text('Back to Quote Builder')").click();
    await page.waitForURL("**/");
  });

  await runStep("/privacy-policy", "open route and external website link", async () => {
    await page.goto(`${BASE_URL}/privacy-policy`, { waitUntil: "domcontentloaded" });
    const [popup] = await Promise.all([
      context.waitForEvent("page", { timeout: 2500 }),
      page.locator("a:has-text('www.thelawntrooper.com')").click(),
    ]);
    await popup.waitForLoadState("domcontentloaded");
    await popup.close();
  });

  await runStep("/terms-of-service", "open route and external privacy link", async () => {
    await page.goto(`${BASE_URL}/terms-of-service`, { waitUntil: "domcontentloaded" });
    const [popup] = await Promise.all([
      context.waitForEvent("page", { timeout: 2500 }),
      page.locator("a:has-text('https://thelawntrooper.com/privacy-policy')").click(),
    ]);
    await popup.waitForLoadState("domcontentloaded");
    await popup.close();
  });

    const outPath = path.resolve(process.cwd(), "tmp", "full-click-matrix-results.json");
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(rows, null, 2), "utf-8");
    console.log(`Wrote results to ${outPath}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
