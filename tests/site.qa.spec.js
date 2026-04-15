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

// ===== Existing Core Tests =====

test("home route loads core links and captures screenshot @screens", async ({ page }) => {
  await page.goto("/index.html");

  await expect(page).toHaveTitle(/Design Ecosystem/i);
  await expect(page.getByRole("heading", { level: 1, name: /Welcome to the Design Universe/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /View Our Work/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Get in Touch/i })).toHaveAttribute("href", /wa\.me/);

  await capture(page, "home");
});

test("original directory route loads @screens", async ({ page }) => {
  await page.goto("/index-directory.html");

  await expect(page).toHaveTitle(/Master Directory/i);
  await expect(page.getByRole("heading", { level: 1, name: /Every site\. Every experiment\. Every destination\./i })).toBeVisible();
  
  await capture(page, "index-directory");
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

test.skip("shayari search and random stay functional", async ({ page }) => {
  await page.goto("/shayari.html");

  const cards = page.locator(".shayari-card");
  await expect(cards).toHaveCount(12);

  await page.locator("#search").fill("motivation");
  await expect(cards).toHaveCount(1);
  await expect(cards.first().locator(".tag")).toHaveText("Motivation");

  await page.getByRole("button", { name: /Random/i }).click();
  await expect(cards).toHaveCount(1);
});

// ===== New Home Page Feature Tests =====

test("home page updated hero rebrand", async ({ page }) => {
  await page.goto("/index.html");

  await expect(page.getByRole("heading", { level: 1, name: /Welcome to the Design Universe/i })).toBeVisible();
  await expect(page.locator("header").getByText("THE VIBE CODER")).toBeVisible();
});

test("home page has Design Universe section", async ({ page }) => {
  await page.goto("/index.html");
  await expect(page.locator("#featured").getByRole("heading", { name: "Design Universe" })).toBeVisible();
});

test("home page has quick card as first featured destination", async ({ page }) => {
  await page.goto("/index.html");

  const cards = page.locator(".card");
  await expect(cards.first()).toContainText("Quick Card");
  await expect(cards.first()).toContainText("⚡ Fast shareable profile");
});

test("home page has highlighted web design services card", async ({ page }) => {
  await page.goto("/index.html");

  await expect(page.getByRole("heading", { name: "Web Design Services" })).toBeVisible();
  await expect(page.locator(".card.card-highlight")).toContainText("Web Design Services");
});

test("home page has deep market online with isometric preview", async ({ page }) => {
  await page.goto("/index.html");

  await expect(page.getByRole("heading", { name: "Deep Market Online" })).toBeVisible();
  await expect(page.getByText("🏪 Isometric bazaar experience")).toBeVisible();
  await expect(page.getByRole("link", { name: /Explore Map/ })).toHaveAttribute("href", "deep-market-online/index.html");
});

test("home page has terminal portfolio card in featured destinations", async ({ page }) => {
  await page.goto("/index.html");

  await expect(page.getByRole("heading", { name: "Terminal Portfolio" })).toBeVisible();
  await expect(page.getByText("🤖 AI-native terminal")).toBeVisible();
  await expect(page.getByRole("link", { name: /Run Experiment/ })).toHaveAttribute("href", "https://ayush-mandowara.vercel.app");
});

test("home page shows _explorations section with 8 agents", async ({ page }) => {
  await page.goto("/index.html");

  await expect(page.getByRole("heading", { name: "_explorations" })).toBeVisible();
  await expect(page.getByText("[8 agents active — ongoing experiments]")).toBeVisible();

  const agents = page.locator(".agent-item");
  await expect(agents).toHaveCount(8);

  await expect(page.getByText("OpenCode")).toBeVisible();
  await expect(page.getByText("Multica")).toBeVisible();
  await expect(page.getByText("Qwen")).toBeVisible();
  await expect(page.getByText("OpenClaw")).toBeVisible();
  await expect(page.getByText("Gemini CLI")).toBeVisible();
  await expect(page.getByText("Antigravity")).toBeVisible();
  await expect(page.getByText("ChatGPT Atlas")).toBeVisible();
  await expect(page.getByText("OpenAI Codex")).toBeVisible();
});

test("_explorations agents expand on click", async ({ page }) => {
  await page.goto("/index.html");

  await page.locator(".agent-item:has-text('OpenCode')").click();
  await expect(page.locator(".agent-item:has-text('OpenCode') .agent-note")).toContainText("Big Pickle model");

  await page.locator(".agent-item:has-text('Multica')").click();
  await expect(page.locator(".agent-item:has-text('Multica') .agent-note")).toContainText("Task management");
});

// ===== Additional Page Tests =====

test("deep market online homepage loads @screens", async ({ page }) => {
  await page.goto("/deep-market-online/index.html");

  await expect(page).toHaveTitle(/Deep Market Online/i);
  await expect(page.locator("body")).toContainText("Deep Market");

  await capture(page, "deep-market-online");
});

test("deep market curations page loads @screens", async ({ page }) => {
  await page.goto("/deep-market-online/curations.html");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await capture(page, "deep-market-curations");
});

test("deep market spotlights page loads @screens", async ({ page }) => {
  await page.goto("/deep-market-online/spotlights.html");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await capture(page, "deep-market-spotlights");
});

test("deep market how it works page loads @screens", async ({ page }) => {
  await page.goto("/deep-market-online/how-it-works.html");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await capture(page, "deep-market-how-it-works");
});

test("deep market product page loads @screens", async ({ page }) => {
  await page.goto("/deep-market-online/product.html");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await capture(page, "deep-market-product");
});

test("card page loads @screens", async ({ page }) => {
  await page.goto("/card.html");

  await expect(page).toHaveTitle(/Services Card|Vibe Coder/i);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await capture(page, "card");
});

test("contact page loads @screens", async ({ page }) => {
  await page.goto("/contact.html");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await capture(page, "contact");
});

test("internship page loads @screens", async ({ page }) => {
  await page.goto("/internship.html");

  await expect(page).toHaveTitle(/Apprenticeship|Vibe Coder/i);

  await capture(page, "internship");
});

test("local market drops homepage loads @screens", async ({ page }) => {
  await page.goto("/local-market-drops/index.html");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await capture(page, "local-market-drops");
});

test("local market gifting chocolates page loads @screens", async ({ page }) => {
  await page.goto("/local-market-drops/gifting-chocolates.html");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await capture(page, "gifting-chocolates");
});

test("local market fashion purses page loads @screens", async ({ page }) => {
  await page.goto("/local-market-drops/fast-fashion-purses.html");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await capture(page, "fast-fashion-purses");
});

test("shayari audio page loads @screens", async ({ page }) => {
  await page.goto("/shayari.html");

  await expect(page).toHaveTitle(/Shayari/i);

  await capture(page, "shayari-audio");
});

test("lastminute app homepage loads @screens", async ({ page }) => {
  await page.goto("/lastminute/index.html");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await capture(page, "lastminute");
});