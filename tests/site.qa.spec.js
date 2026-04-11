const fs = require("fs");
const path = require("path");
const { test, expect } = require("playwright/test");

const screenshotDir = path.join(__dirname, "..", "qa", "screenshots");

function sanitize(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function capture(page, name) {
  fs.mkdirSync(screenshotDir, { recursive: true });
  await page.screenshot({
    path: path.join(screenshotDir, `${sanitize(name)}.png`),
    fullPage: true,
    animations: "disabled",
  });
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.__alerts = [];
    window.alert = (message) => {
      window.__alerts.push(String(message));
    };

    if (!navigator.clipboard) {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {},
      });
    }

    navigator.clipboard.writeText = async (value) => {
      window.__copiedText = String(value);
    };
  });
});

test("home route loads core links and captures screenshot @screens", async ({ page }) => {
  await page.goto("/index.html");

  await expect(page).toHaveTitle(/Master Directory/i);
  await expect(page.getByRole("heading", { level: 1, name: /Every site, experiment, and digital destination/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /View Philosophy/i })).toHaveAttribute("href", "the-vibe-coder.html");
  await expect(page.getByRole("link", { name: /View Product/i })).toHaveAttribute("href", "vibe-station.html");

  await capture(page, "home");
});

test("theme toggle persists on home page", async ({ page }) => {
  await page.goto("/index.html");

  const toggle = page.getByRole("button", { name: /toggle dark mode/i });
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("philosophy page renders primary CTA and gallery entry @screens", async ({ page }) => {
  await page.goto("/the-vibe-coder.html");

  await expect(page).toHaveTitle(/Code Meets Emotion/i);
  await expect(page.getByRole("heading", { level: 1, name: /Code meets/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Contact on WhatsApp/i })).toHaveAttribute("href", /wa\.me/);
  await expect(page.getByRole("link", { name: /Let's Connect/i })).toHaveAttribute("href", /wa\.me/);

  await capture(page, "the-vibe-coder");
});

test("vibe station sidebar, donate route, screenshot @screens", async ({ page }) => {
  await page.goto("/vibe-station.html");

  await expect(page).toHaveTitle(/Vibe Station/i);
  await expect(page.getByRole("heading", { level: 1, name: /Vibe Station turns/i })).toBeVisible();

  await page.getByRole("button", { name: /toggle sidebar menu/i }).click();
  await expect(page.locator("#sidebar")).toHaveClass(/visible/);

  await page.locator("#sidebar a", { hasText: "Donate" }).click();
  await expect(page).toHaveURL(/donate\.html$/);
  await expect(page.getByRole("heading", { level: 1, name: /Help us turn compatible phones into real computer seats/i })).toBeVisible();

  await capture(page, "donate");
});

test("donate page copy upi and desktop payment flow", async ({ page }) => {
  await page.goto("/donate.html");

  await page.getByRole("button", { name: "Copy" }).click();
  await expect(page.getByRole("button", { name: "Copied!" })).toBeVisible();
  await expect.poll(async () => page.evaluate(() => window.__copiedText)).toBe("6395906067@ptsbi");

  await page.getByRole("button", { name: /Open UPI Payment/i }).click();
  const alertText = await page.evaluate(() => window.__alerts.at(-1));
  expect(alertText).toContain("UPI Payment Instructions");
  expect(alertText).toContain("6395906067@ptsbi");
});

test("donate page mobile hamburger opens and closes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/donate.html");

  await page.getByText("Menu", { exact: true }).click();
  await expect(page.locator(".nav-menu")).toHaveClass(/active/);

  await page.locator('.nav-menu a[href="#faq"]').click();
  await expect(page.locator(".nav-menu")).not.toHaveClass(/active/);
});

test("pricing page renders offers and captures screenshot @screens", async ({ page }) => {
  await page.goto("/web-design-pricing.html");

  await expect(page).toHaveTitle(/Website Pricing/i);
  await expect(page.getByRole("heading", { level: 1, name: /Ready website designs we can customize fast for real businesses/i })).toBeVisible();
  await expect(page.getByText("Professional Business Website")).toBeVisible();
  await expect(page.getByText("Modern Design Direction")).toBeVisible();

  await capture(page, "web-design-pricing");
});

test("shayari search and random stay functional", async ({ page }) => {
  await page.goto("/shayari.html");

  await expect(page.locator(".shayari-card")).toHaveCount(4);
  await page.locator("#search").fill("motivation");
  await expect(page.locator(".shayari-card")).toHaveCount(1);
  await expect(page.locator(".shayari-card .tag")).toHaveText("Motivation");

  await page.getByRole("button", { name: /Random/i }).click();
  await expect(page.locator(".shayari-card")).toHaveCount(1);
});
