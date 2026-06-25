import { expect, test, type Page } from "@playwright/test";

// Errors we accept as non-fatal:
// - `getMediumPosts` (lib/medium.ts) catches network failures and falls back
//   to the bundled JSON fixture, but logs the error before doing so.
// - Resource 404s (missing favicon / og:image assets) surface as console
//   errors in Chromium but don't affect functionality. Tracked separately.
const ACCEPTED_ERROR_PATTERNS = [
  /Error fetching Medium posts/i,
  /Failed to load resource.*404/i,
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
  test("home renders all four sections", async ({ page }) => {
    const errors = await assertNoUnexpectedConsoleErrors(page);
    await page.goto("/");

    await expect(page.locator("section.top-section")).toBeVisible();
    await expect(page.locator("section#projects h2")).toHaveText("Projects");
    await expect(page.locator("section#about h2")).toHaveText("About");
    await expect(page.locator("section#review h2")).toHaveText("Reviews");

    expect(errors, "unexpected console errors on /").toEqual([]);
  });

  test("blog index lists posts and links to a post page", async ({ page }) => {
    await page.goto("/blog");

    const firstCard = page.locator("a.blog-card").first();
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

    // NOTE: `MenuToggle` passes `aria-label="Menu Toggle"` but `CircleButton`
    // silently drops the prop and uses `tooltip` instead — a real a11y bug to
    // file separately. Target by class until that's fixed.
    await page.locator(".menu-toggle").click();
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

  test("unknown route shows the 404 page", async ({ page }) => {
    await page.goto("/no-such-page", { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1")).toHaveText("404 - Page Not Found");
  });
});
