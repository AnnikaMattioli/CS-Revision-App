import { expect, test } from "@playwright/test";

test("practice answers survive refresh and receive secure feedback", async ({ page }) => {
  await page.goto("/practise");
  await expect(page.getByRole("heading", { level: 1, name: "Turn knowledge into marks" })).toBeVisible();
  await page.getByRole("button", { name: "Start 10-question set" }).click();
  await expect(page).toHaveURL(/\/practise\/session\/demo-/);

  await expect(page.getByText("The ALU carries out calculations and logical operations.", { exact: false })).toHaveCount(0);
  await page.getByLabel("Arithmetic logic unit").check();
  await page.reload();
  await expect(page.getByLabel("Arithmetic logic unit")).toBeChecked();

  await page.getByRole("button", { name: "Go to question 10" }).click();
  await page.getByRole("button", { name: "Submit set" }).click();
  await expect(page.getByRole("dialog")).toContainText("9 unanswered questions");
  await page.getByRole("dialog").getByRole("button", { name: "Submit set" }).click();

  await expect(page).toHaveURL(/\/practise\/results\/demo-/, { timeout: 15_000 });
  await expect(page.getByRole("heading", { level: 1 })).toContainText("5%");
  await expect(page.getByRole("heading", { name: "Question feedback" })).toBeVisible();
  await expect(page.getByText("The ALU carries out calculations and logical operations.", { exact: false })).toBeVisible();
});

test("completed practice appears in attempt history", async ({ page }) => {
  await page.goto("/practise");
  await page.getByRole("button", { name: "Start 10-question set" }).click();
  await page.getByRole("button", { name: "Go to question 10" }).click();
  await page.getByRole("button", { name: "Submit set" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Submit set" }).click();
  await expect(page).toHaveURL(/\/practise\/results\/demo-/, { timeout: 15_000 });
  await page.goto("/practise/history");
  await expect(page.getByText("Mixed-topic practice")).toBeVisible();
  await expect(page.getByRole("link", { name: "Review" })).toBeVisible();
});
