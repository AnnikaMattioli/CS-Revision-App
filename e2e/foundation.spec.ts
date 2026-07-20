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
  await expect(page.getByText(/Local demo profile/)).toBeVisible();
});

test("demo users can sign in without Supabase credentials", async ({ page }) => {
  await page.goto("/sign-in");
  await expect(page.getByText("Demo mode is ready")).toBeVisible();
  await page.getByRole("button", { name: "Continue with demo account" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Ready to make progress");
});

test("a new local profile uses its own name and starts at zero", async ({ page }) => {
  await page.goto("/sign-up");
  await page.waitForLoadState("networkidle");
  await page.getByLabel("Email address").fill("jamie@example.com");
  await page.locator('input[name="password"]').fill("starting-fresh");
  const name = page.getByLabel("Your name");
  await name.fill("Jamie");
  await expect(name).toHaveValue("Jamie");
  await page.getByRole("button", { name: "Create my account" }).click();
  await expect(page).toHaveURL(/\/onboarding/);
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Jamie");
  await expect(page.getByText("Course mastery").locator("..")).toContainText("0%");
  await expect(page.getByText("Questions answered").locator("..")).toContainText("0");
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
  await expect(page.getByText("The CPU processes data and executes the instructions that make programs run.")).toBeVisible();
  await page.getByRole("button", { name: /Good/ }).click();
  await expect(page.getByText("Card 2 of 20")).toBeVisible();

  await page.goto("/worked-solutions/systems-architecture-worked-1");
  await page.getByRole("button", { name: "Reveal model answer" }).click();
  await expect(page.getByRole("heading", { name: "Model answer" })).toBeVisible();
});
