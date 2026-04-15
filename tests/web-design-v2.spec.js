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

test.describe("Web Design V2 Page", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the V2 page
    await page.goto("/web-design-v2/index.html");
  });

  test("should render core hero elements", async ({ page }) => {
    await expect(page).toHaveTitle(/Premium Web Design Pricing | The Vibe Coder/i);
    await expect(page.getByRole("heading", { name: /Ready designs for real businesses/i })).toBeVisible();
    await expect(page.getByText("Strategic Design Agency")).toBeVisible();
    await capture(page, "v2-hero");
  });

  test("should render pricing packages", async ({ page }) => {
    const packages = page.locator(".pricing-card");
    await expect(packages).toHaveCount(2);
    
    await expect(page.getByRole("heading", { name: "Classic Business" })).toBeVisible();
    await expect(page.locator(".amount").filter({ hasText: "3,500" })).toBeVisible();
    
    await expect(page.getByRole("heading", { name: "Modern Business" })).toBeVisible();
    await expect(page.locator(".amount").filter({ hasText: "4,500" })).toBeVisible();
    
    await capture(page, "v2-pricing");
  });

  test("should render design library with gallery items", async ({ page }) => {
    const galleryItems = page.locator(".gallery-item");
    await expect(galleryItems).toHaveCount(8);
    
    await expect(page.getByRole("heading", { name: "Boardroom Advisory" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Nimbus Cloud" })).toBeVisible();
    
    await capture(page, "v2-gallery");
  });

  test("should render process steps", async ({ page }) => {
    const steps = page.locator(".process-step");
    await expect(steps).toHaveCount(4);
    
    await expect(page.getByRole("heading", { name: "Discovery" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Design Choice" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Customization" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Launch" })).toBeVisible();
    
    await capture(page, "v2-process");
  });

  test("theme toggle persists on V2 page", async ({ page }) => {
    const toggle = page.locator(".theme-toggle").first();
    
    // Ensure we start from light or known state
    const isDarkInitial = await page.evaluate(() => document.documentElement.getAttribute('data-theme') === 'dark');
    
    await toggle.click();
    const isDarkAfterClick = await page.evaluate(() => document.documentElement.getAttribute('data-theme') === 'dark');
    expect(isDarkAfterClick).not.toBe(isDarkInitial);

    await page.reload();
    const isDarkAfterReload = await page.evaluate(() => document.documentElement.getAttribute('data-theme') === 'dark');
    expect(isDarkAfterReload).toBe(isDarkAfterClick);
  });

  test("mobile menu functionality", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    
    const menuToggle = page.locator(".mobile-menu-toggle");
    await expect(menuToggle).toBeVisible();
    
    const nav = page.locator(".desktop-nav");
    await menuToggle.click();
    await expect(nav).toHaveClass(/active/);
    
    await menuToggle.click();
    await expect(nav).not.toHaveClass(/active/);
  });
  
  test("navigation links work within the page", async ({ page }) => {
    const packagesLink = page.getByRole("link", { name: "Packages" });
    await packagesLink.click();
    // Use toBeVisible on target or check URL if we expect a hash
    await expect(page.locator("#packages")).toBeVisible();
    await expect(page.url()).toContain("#packages");
    
    const galleryLink = page.getByRole("link", { name: "Gallery" });
    await galleryLink.click();
    await expect(page.locator("#showcase")).toBeVisible();
    await expect(page.url()).toContain("#showcase");
  });
});
