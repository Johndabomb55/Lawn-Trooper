import { test, expect, type Page } from "@playwright/test";

type CtaCase = {
  label: string;
  route: string;
  /**
   * Accessible name of the CTA link to click. Resolved with
   * `page.getByRole("link", { name }).first()` — using the rendered button
   * text rather than a generic `a[href="/#builder"]` selector ensures we
   * exercise the page's actual primary CTA, not just any builder link in the
   * header / footer.
   */
  ctaName: RegExp;
};

const CASES: CtaCase[] = [
  // Home v2 — itself the builder host. Header CTA still uses the runtime
  // hashchange + scrollIntoView path.
  { label: "Home v2 SiteHeader 'Plan builder'", route: "/", ctaName: /^Plan builder$/ },
  // Legacy home — uses CALL_FUNNEL_COPY.builderCta = "See pricing & photos".
  { label: "Legacy home (/legacy)", route: "/legacy", ctaName: /See pricing & photos/ },
  // Call-first — primaryButton = "See pricing & photos".
  { label: "Call-first landing (/start)", route: "/start", ctaName: /See pricing & photos/ },
  { label: "Promotions (/promotions)", route: "/promotions", ctaName: /Reserve My Plan/ },
  { label: "Services (/services)", route: "/services", ctaName: /Get Your Instant Quote/ },
  { label: "Dream Yard Recon (/dream-yard-recon)", route: "/dream-yard-recon", ctaName: /Unlock Your Dream Yard/ },
  { label: "Service Area (/service-area)", route: "/service-area", ctaName: /Check Availability/ },
  { label: "HOA Partnerships (/hoa-partnerships)", route: "/hoa-partnerships", ctaName: /Start Residential Plan Builder/ },
];

async function gotoRoute(page: Page, route: string) {
  // Use no hash — we want to verify the runtime click + scroll behavior,
  // not the initial-mount hash effect.
  const resp = await page.goto(route, { waitUntil: "domcontentloaded" });
  expect(
    resp?.ok(),
    `Failed to load ${route} — status ${resp?.status()}`,
  ).toBeTruthy();
  // Give React a tick to mount.
  await page.waitForLoadState("networkidle").catch(() => {});
}

for (const c of CASES) {
  test(`${c.label}: clicking primary CTA scrolls the homepage builder into view`, async ({
    page,
  }) => {
    await gotoRoute(page, c.route);

    const cta = page.getByRole("link", { name: c.ctaName }).first();
    await expect(
      cta,
      `Could not find a primary CTA matching ${c.ctaName} on ${c.route}. ` +
        `Did the button label change? Update tests/e2e/cta-scroll.spec.ts.`,
    ).toBeAttached();

    // Confirm the CTA is wired to the homepage builder before clicking, so a
    // misrouted CTA fails with a clear message instead of a vague scroll
    // assertion.
    await expect(
      cta,
      `Primary CTA on ${c.route} is no longer pointing at /#builder. ` +
        `Check the href in the page source and tests/cta-routing.test.ts.`,
    ).toHaveAttribute("href", "/#builder");

    await cta.scrollIntoViewIfNeeded();
    await cta.click();

    // URL must now be /#builder (path "/" + hash "#builder"). Asserting the
    // pathname makes sure we didn't accidentally navigate somewhere else.
    await expect
      .poll(
        () => {
          const u = new URL(page.url());
          return `${u.pathname}${u.hash}`;
        },
        {
          message:
            `After clicking the primary CTA on ${c.route}, expected the URL ` +
            `to become "/#builder" but it never did. URL: ${page.url()}`,
          timeout: 7_000,
        },
      )
      .toBe("/#builder");

    // The SimpleBuilder section must be present and visible in the viewport.
    const builder = page.locator("#builder");
    await expect(
      builder,
      `Expected <section id="builder"> to exist after navigating to ` +
        `/#builder from ${c.route}. The hashchange handler in home-v2.tsx ` +
        `relies on this id — did the section id get renamed?`,
    ).toBeAttached();

    await expect(
      builder,
      `Expected the SimpleBuilder section to be scrolled into view after ` +
        `clicking the primary CTA on ${c.route}. The smooth-scroll effect ` +
        `(useEffect listening for "hashchange" + initial mount in ` +
        `home-v2.tsx) appears to be broken.`,
    ).toBeInViewport({ ratio: 0.05, timeout: 7_000 });
  });
}
