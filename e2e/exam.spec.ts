import { expect, test } from "@playwright/test";

test("timed exam autosaves, warns and shows time analysis", async ({ page }) => {
  await page.goto("/exam-practice");
  await expect(page.getByRole("heading", { level: 1, name: "Ready when you are" })).toBeVisible();
  await page.locator("label").filter({ hasText: "Questions" }).locator("select").selectOption("5");
  await page.locator("label").filter({ hasText: "Time limit" }).locator("select").selectOption("5");
  await page.getByRole("button", { name: "Start timed test" }).click();
  await expect(page).toHaveURL(/\/exam-practice\/session\/exam-demo-/);
  await expect(page.getByText("QUESTION 1 OF 5")).toBeVisible();
  await page.getByLabel("Arithmetic logic unit").check();
  await page.reload();
  await expect(page.getByLabel("Arithmetic logic unit")).toBeChecked();
  await page.getByRole("button", { name: "Go to question 5, unanswered" }).click();
  await page.getByRole("button", { name: "Finish exam" }).click();
  await expect(page.getByRole("dialog")).toContainText("4 unanswered questions");
  await page.getByRole("dialog").getByRole("button", { name: "Submit exam" }).click();
  await expect(page).toHaveURL(/\/exam-practice\/results\/exam-demo-/, { timeout: 15_000 });
  await expect(page.getByRole("heading", { level: 1 })).toContainText("14%");
  await expect(page.getByRole("heading", { name: "Time management" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Detailed review" })).toBeVisible();
  await expect(page.getByText("Not configured")).toBeVisible();
});

test("exam can prevent backwards navigation", async ({ page }) => {
  await page.goto("/exam-practice");
  const backwards = page.getByLabel("Allow backwards navigation", { exact: false });
  await backwards.uncheck();
  await expect(backwards).not.toBeChecked();
  const ids = ["60000000-0000-0000-0000-000000000001", "60000000-0000-0000-0000-000000000002"];
  await page.goto(`/exam-practice/session/exam-demo-forward?ids=${ids.join(",")}&time=5&back=0&warn=1&release=immediate&kind=mixed`);
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByText("QUESTION 2 OF 2")).toBeVisible();
  await expect(page.getByRole("button", { name: "Previous" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Go to question 1, unanswered" })).toBeDisabled();
});

test("delayed exam results do not expose mark-scheme content", async ({ page }) => {
  await page.goto("/exam-practice");
  await page.locator("label").filter({ hasText: "Questions" }).locator("select").selectOption("5");
  await page.getByLabel("Results release").selectOption("later");
  await page.getByRole("button", { name: "Start timed test" }).click();
  await page.getByRole("button", { name: "Go to question 5, unanswered" }).click();
  await page.getByRole("button", { name: "Finish exam" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Submit exam" }).click();
  await expect(page).toHaveURL(/\/exam-practice\/results\/exam-demo-/, { timeout: 15_000 });
  await expect(page.getByRole("heading", { name: "Exam submitted" })).toBeVisible();
  await expect(page.getByText("Answers and mark-scheme content remain hidden until release.")).toBeVisible();
  await expect(page.getByText("CORRECT / MODEL ANSWER")).toHaveCount(0);
});

test("time expiry automatically submits saved answers", async ({ page }) => {
  const ids = ["60000000-0000-0000-0000-000000000001", "60000000-0000-0000-0000-000000000002"];
  await page.goto(`/exam-practice/session/exam-demo-auto?ids=${ids.join(",")}&time=0&back=1&warn=1&release=immediate&kind=mixed`);
  await expect(page).toHaveURL(/\/exam-practice\/results\/exam-demo-auto/, { timeout: 15_000 });
  await expect(page.getByText("Time expired, so your saved answers were submitted automatically.")).toBeVisible();
});
