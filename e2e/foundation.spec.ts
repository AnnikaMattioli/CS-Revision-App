import { expect, test } from "@playwright/test";

test("landing page leads to account creation", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Revision that helps ideas");
  await page.getByRole("link", { name: /start revising free/i }).click();
  await expect(page).toHaveURL(/sign-up/);
  await expect(page.getByRole("heading", { name: "Start learning smarter" })).toBeVisible();
});

test("demo dashboard is responsive and labelled", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Ready to make progress");
  await expect(page.getByText(/Demo mode/)).toBeVisible();
});
