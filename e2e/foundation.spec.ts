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

test("student can open a topic and complete a lesson", async ({ page }) => {
  await page.goto("/learn/memory-and-storage/secondary-storage");
  await expect(page.getByRole("heading", { level: 1, name: "Secondary storage" })).toBeVisible();
  await page.getByRole("button", { name: "Mark lesson complete" }).click();
  await expect(page.getByRole("button", { name: "Completed" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("button", { name: "Completed" })).toBeVisible();
});

test("flashcards and worked solutions reveal feedback", async ({ page }) => {
  await page.goto("/flashcards?topic=systems-architecture");
  await page.getByRole("button", { name: "Showing question. Flip to reveal answer." }).click();
  await expect(page.getByText("It coordinates CPU operations, decodes instructions and sends control signals.")).toBeVisible();
  await page.getByRole("button", { name: /Good/ }).click();
  await expect(page.getByText("Card 2 of 3")).toBeVisible();

  await page.goto("/worked-solutions/comparing-cpu-performance");
  await page.getByRole("button", { name: "Reveal model answer" }).click();
  await expect(page.getByRole("heading", { name: "Model answer" })).toBeVisible();
});
