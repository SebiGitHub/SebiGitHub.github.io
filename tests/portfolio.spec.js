import { test, expect } from "@playwright/test";

for (const width of [360, 768, 1440]) {
  test(`portfolio ES/EN stays usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/content-ready/);
    await expect(page.locator("h1")).toContainText("Sebastián");
    await expect(page.locator("#featured-projects article")).toHaveCount(3);
    await expect(page.locator("#project-archive .archive-item")).toHaveCount(5);
    await expect(page.locator("#hero-process [data-process-index]")).toHaveCount(4);
    await page.locator('#hero-process [data-process-index="2"]').click();
    await expect(page.locator("#process-detail")).toContainText("Combino");
    await expect(page.locator("#featured-projects [data-project-media]").first().locator("[data-media-index]")).toHaveCount(2);
    await page.locator("#featured-projects [data-project-media]").first().locator('[data-media-index="1"]').click();
    await expect(page.locator("#featured-projects [data-project-media]").first().locator("img.is-active")).toHaveAttribute("src", /knowledge-ops-answer/);
    await expect(page.locator("body")).not.toContainText(/junior/i);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();

    if (width <= 860) await page.locator("#nav-toggle").click();
    await page.locator("#lang-toggle").click();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("#contact h2")).toContainText("Shall we talk");
    await expect(page.locator("#featured-projects article")).toHaveCount(3);
    if (width <= 860) await page.keyboard.press("Escape");

    await page.locator("#featured-projects article").last().scrollIntoViewIfNeeded();
    await expect.poll(() => page.locator("#featured-projects img").evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0))).toBeTruthy();

    await page.screenshot({ path: `test-results/portfolio-${width}.png`, fullPage: true });
    expect(errors).toEqual([]);
  });
}

test("critical content remains available if translations fail", async ({ page }) => {
  await page.route("**/assets/i18n/*.json", (route) => route.abort());
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Sebastián");
  await expect(page.locator("#featured-projects article")).toHaveCount(1);
  await expect(page.locator("#work")).toBeVisible();
});

test("internal links, key metadata and custom 404 resolve", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/content-ready/);
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip-link")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /og-portfolio\.png/);
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute("href", /brand-mark\.svg/);

  for (const href of ["/assets/img/og-portfolio.png", "/assets/img/brand-mark.svg", "/assets/img/projects/knowledge-ops-login.webp", "/assets/img/projects/knowledge-ops-answer.webp", "/assets/img/projects/protocols-demo.webp", "/assets/img/projects/lifeos-home.webp", "/assets/img/projects/lifeos-automation.webp", "/404.html", "/projects/tfg/"]) {
    expect((await request.get(href)).ok()).toBeTruthy();
  }
});

test("TFG demo filters profiles and hides draft protocols", async ({ page }) => {
  await page.goto("/projects/tfg/");
  await expect(page.locator(".protocol h3")).toHaveText(["Procedimiento ficticio de acogida", "Guía ficticia de gestión documental"]);
  await page.selectOption("#usuario", "bruno.demo@example.invalid");
  await expect(page.locator(".protocol h3")).toHaveText(["Procedimiento ficticio de acogida", "Procedimiento ficticio de soporte"]);
  await page.selectOption("#usuario", "carla.demo@example.invalid");
  await expect(page.locator(".protocol h3")).toHaveText(["Procedimiento ficticio de acogida"]);
  await expect(page.locator("text=Borrador ficticio no publicado")).toHaveCount(0);
  await page.locator(".protocol button").click();
  await expect(page.locator("#lecturas tr")).toHaveCount(1);
});
