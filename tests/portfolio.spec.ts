import { test, expect } from "@playwright/test";
test("desktop routes, search, typing and browser Back", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Gitansh",
  );
  await page.screenshot({
    path: "/tmp/living-glyph-desktop.png",
    fullPage: true,
  });
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByText("Work", { exact: true })
    .click();
  await expect(page).toHaveURL(/\/projects$/);
  await page.getByRole("link", { name: "Read case study" }).first().click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Multi-task",
  );
  await page.goBack();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Work");
  await page.keyboard.press("Control+k");
  await page
    .getByRole("textbox", { name: "Search projects, skills, experience" })
    .fill("TensorRT");
  await expect(
    page.getByRole("link", { name: /Magna International/ }),
  ).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/experience#magna$/);
  await page.getByRole("link", { name: "Gitansh Kothari, home" }).click();
  await page
    .getByRole("textbox", { name: "Type a destination" })
    .fill("experience");
  await expect(page).toHaveURL(/experience$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  expect(errors).toEqual([]);
});
test("mobile navigation, dialogs, overflow and screenshots", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.screenshot({
    path: "/tmp/living-glyph-mobile.png",
    fullPage: true,
  });
  await expect(
    page.getByRole("textbox", { name: "Type a destination" }),
  ).not.toBeFocused();
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByText("About", { exact: false })
    .click();
  await expect(page).toHaveURL(/about$/);
  await page.screenshot({
    path: "/tmp/living-glyph-about-mobile.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Search portfolio" }).click();
  await page
    .getByRole("textbox", { name: "Search projects, skills, experience" })
    .fill("zzzz");
  await expect(page.getByText("No matches for")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Search portfolio" }),
  ).toBeFocused();
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 800 });
    for (const path of [
      "/",
      "/projects",
      "/projects/multi-task-driving-perception",
      "/projects/scholarspace-ai",
      "/projects/deepreplication",
      "/experience",
      "/about",
      "/contact",
    ]) {
      await page.goto(path);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        path + " at " + width,
      ).toBe(true);
      await expect(page.locator("main h1")).toHaveCount(1);
    }
  }
});
test("copy, reduced motion, static HTML and assets", async ({
  page,
  context,
  request,
  browser,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/contact");
  await page
    .locator(".contact-actions")
    .getByRole("button", { name: "Copy email" })
    .click();
  await expect(
    page.locator(".contact-actions").getByRole("button", { name: "Copied" }),
  ).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "gitanshkothari@gmail.com",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".site")).toHaveAttribute("data-motion", "off");
  const context2 = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await context2.newPage();
  await staticPage.goto("http://127.0.0.1:4173/projects/scholarspace-ai");
  await expect(
    staticPage.getByRole("heading", { name: "ScholarSpace AI", exact: true }),
  ).toBeVisible();
  await expect(
    staticPage.getByRole("heading", { name: /Limitations & next steps/ }),
  ).toBeVisible();
  await context2.close();
  for (const asset of [
    "/resume/Gitansh_Kothari_Resume.pdf",
    "/media/perception.webp",
    "/media/scholarspace.webp",
    "/media/architecture.webp",
  ])
    expect((await request.get(asset)).status()).toBe(200);
});
test("Back restores list scroll and focus; typing can be cancelled", async ({
  page,
}) => {
  await page.goto("/projects");
  const link = page.getByRole("link", { name: "Read case study" }).last();
  await link.scrollIntoViewIfNeeded();
  const y = await page.evaluate(() => scrollY);
  await link.click();
  await page.goBack();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeCloseTo(y, 0);
  await expect(
    page.getByRole("link", { name: "Read case study" }).last(),
  ).toBeFocused();
  await page.goto("/");
  const entry = page.getByRole("textbox", { name: "Type a destination" });
  await entry.fill("work");
  await entry.press("Backspace");
  await page.waitForTimeout(350);
  await expect(page).toHaveURL(/\/$/);
  await entry.press("Escape");
  await expect(entry).toHaveValue("");
});
test("accessibility checks on primary pages and search", async ({ page }) => {
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  for (const path of [
    "/",
    "/projects",
    "/projects/multi-task-driving-perception",
    "/experience",
    "/about",
    "/contact",
  ]) {
    await page.goto(path);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(result.violations, path).toEqual([]);
  }
  await page.keyboard.press("Control+k");
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});
test("capture interior layouts and word morph", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/projects");
  await page.screenshot({ path: "/tmp/living-glyph-work.png", fullPage: true });
  await page.goto("/projects/multi-task-driving-perception");
  await page.screenshot({
    path: "/tmp/living-glyph-case-study.png",
    fullPage: true,
  });
  await page.goto("/");
  await page
    .getByRole("textbox", { name: "Type a destination" })
    .fill("experienc");
  await page.waitForTimeout(450);
  await page.screenshot({ path: "/tmp/living-glyph-word.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/projects/scholarspace-ai");
  await page.screenshot({
    path: "/tmp/living-glyph-case-mobile.png",
    fullPage: true,
  });
});
