import { expect, test, type Page } from "@playwright/test";

// Errors we accept as non-fatal:
// - `getMediumPosts` (lib/medium.ts) catches network failures and falls back
//   to the bundled JSON fixture, but logs the error before doing so.
// - Resource 404s (missing favicon / og:image assets) surface as console
//   errors in Chromium but don't affect functionality. Tracked separately.
const ACCEPTED_ERROR_PATTERNS = [
  /Error fetching Medium posts/i,
  /Failed to load resource.*404/i,
  /Refused to execute script from.*_vercel/i,
];

async function assertNoUnexpectedConsoleErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    if (ACCEPTED_ERROR_PATTERNS.some((re) => re.test(text))) return;
    errors.push(`console.error: ${text}`);
  });
  return errors;
}

test.describe("smoke", () => {
  test("home renders all sections", async ({ page }) => {
    const errors = await assertNoUnexpectedConsoleErrors(page);
    await page.goto("/");

    await expect(page.locator("section.top-section")).toBeVisible();
    await expect(page.locator("section#projects h2")).toHaveText("Projects");
    await expect(page.locator("section#about h2")).toHaveText("About");
    await expect(page.locator("section#experience h2")).toHaveText("Experience");
    await expect(page.locator("section#review h2")).toHaveText("Reviews");
    await expect(page.locator("section#contact h2")).toHaveText("Contact");

    expect(errors, "unexpected console errors on /").toEqual([]);
  });

  test("blog index lists posts and links to a post page", async ({ page }) => {
    await page.goto("/blog");

    const firstCard = page.locator("a.blog-card").first();
    const cardCount = await firstCard.count();

    // CI runs against a fresh build with an empty MEDIUM_USERNAME and an
    // empty lib/medium-feed.json snapshot — the index page should render
    // without errors in that case. The post-navigation half only runs when
    // a card is present (i.e. MEDIUM_USERNAME was set in the test env).
    if (cardCount === 0) {
      await expect(page.locator("h1")).toContainText(/blog/i);
      return;
    }

    await expect(firstCard).toBeVisible();

    const href = await firstCard.getAttribute("href");
    expect(href).toMatch(/^\/blog\//);

    await firstCard.click();
    await expect(page).toHaveURL(/\/blog\//);
    await expect(page.locator("h1.title")).toBeVisible();
    await expect(page.locator("article.medium-content")).toBeVisible();
  });

  test("theme toggle flips the `dark` class on <html>", async ({ page }) => {
    await page.goto("/");

    // Target the Menu Toggle by its accessible name (closed state).
    await page.locator('[aria-label="Open menu"]').click();
    const themeButton = page.locator('[aria-label="Toggle dark/light theme"]');
    await expect(themeButton).toBeVisible();

    const darkBefore = await page.evaluate(() =>
      document.documentElement.classList.contains("dark"),
    );

    await themeButton.click();

    await expect
      .poll(async () =>
        page.evaluate(() => document.documentElement.classList.contains("dark")),
      )
      .toBe(!darkBefore);
  });

  test("radial menu items are inert when closed, focusable when open", async ({ page }) => {
    await page.goto("/");

    const firstItem = page.locator(".menu-item").first();

    // Closed: items are removed from the tab order + accessibility tree.
    await expect(firstItem).toHaveJSProperty("inert", true);

    // Open the menu — inert must clear so items become keyboard-operable.
    await page.locator('[aria-label="Open menu"]').click();
    await expect(firstItem).toHaveJSProperty("inert", false);
  });

  test("section scroll-spy is visible on home, absent on /blog", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".section-nav")).toBeVisible();
    // One dot per rendered <section id> (the hero has id="top", each
    // Section takes its id from SectionConfig) — derived from the page so
    // adding sections doesn't require renumbering this assertion.
    const sectionCount = await page.locator("section[id]").count();
    await expect(page.locator(".section-nav-dot")).toHaveCount(sectionCount);

    await page.goto("/blog");
    await expect(page.locator(".section-nav")).toHaveCount(0);
  });

  test("clicking a section-nav dot scrolls the page", async ({ page }) => {
    // Regression guard for the Lenis-hijacks-native-scroll bug: clicking a
    // dot ran scrollToSection -> window.scrollTo, which Lenis overrode via
    // its RAF loop. The util now routes through lenis.scrollTo when active.
    await page.goto("/");
    const scrollYBefore = await page.evaluate(() => window.scrollY);
    expect(scrollYBefore).toBe(0);

    // Click the last dot (the final SectionConfig entry — Contact on this
    // branch; experience joins between About and Reviews on its branch).
    const lastDot = page.locator(".section-nav-dot").last();
    await lastDot.click();

    // Wait for either Lenis or native smooth scroll to settle, then confirm
    // the viewport actually moved. The last section is near the bottom, so
    // any real scroll will be well past zero.
    await expect
      .poll(async () => page.evaluate(() => window.scrollY), { timeout: 5000 })
      .toBeGreaterThan(200);
  });

  test("unknown route shows the 404 page", async ({ page }) => {
    await page.goto("/no-such-page", { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1")).toHaveText("404 - Page Not Found");
  });
});
