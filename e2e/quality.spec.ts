import { expect, test } from "@playwright/test";

test("security and privacy headers protect application responses", async ({ request }) => {
  const response = await request.get("/dashboard");
  expect(response.headers()["x-frame-options"]).toBe("DENY");
  expect(response.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response.headers()["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(response.headers()["permissions-policy"]).toContain("camera=()");
});

test("keyboard users can skip navigation and open the mobile menu", async ({ page }, testInfo) => {
  await page.goto("/dashboard");
  if (testInfo.project.name !== "chromium") await page.getByRole("link", { name: "Skip to content" }).focus();
  else await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
  if (testInfo.project.name === "mobile" || testInfo.project.name === "tablet") {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(page.getByRole("link", { name: "Progress", exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Close navigation", exact: true }).click();
    await expect(page.getByRole("link", { name: "Progress", exact: true })).not.toBeVisible();
  }
});

test("settings provides a guarded account deletion flow", async ({ page }) => {
  await page.goto("/settings");
  await page.getByRole("button", { name: "Delete account" }).click();
  const dialog = page.getByRole("dialog", { name: "Delete your account?" });
  await expect(dialog).toBeVisible();
  await dialog.getByLabel(/Type DELETE/).fill("DELETE");
  await dialog.getByRole("button", { name: "Delete permanently" }).click();
  await expect(page).toHaveURL(/account=deleted/);
  await expect(page.getByRole("status")).toContainText("personal learning data were deleted");
});

test("core pages fit the viewport and honour reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/progress");
  const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth, reduced: matchMedia("(prefers-reduced-motion: reduce)").matches }));
  expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.viewport);
  expect(dimensions.reduced).toBe(true);
});

test("public accessibility and privacy information is reachable", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Accessibility" }).click();
  await expect(page.getByRole("heading", { name: "Learning should work for everyone" })).toBeVisible();
  await page.goto("/privacy");
  await expect(page.getByRole("heading", { name: "Privacy information" })).toBeVisible();
});
