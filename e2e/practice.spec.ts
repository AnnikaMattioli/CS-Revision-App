import { expect, test } from "@playwright/test";
import { ocrGcseQuestionBank } from "../src/lib/practice/ocr-gcse-question-bank";

test("every practice style returns a written-question majority", async ({ request }) => {
  const byId = new Map(ocrGcseQuestionBank.map((question) => [question.id, question]));
  for (const mode of ["adaptive", "weak", "unseen", "all"] as const) {
    const response = await request.post("/api/practice/start", { data: { topic: "systems-architecture", difficulty: "mixed", timer: "untimed", mode } });
    expect(response.ok()).toBe(true);
    const result = await response.json() as { questionIds: string[] };
    const types = result.questionIds.map((id) => byId.get(id)?.type);
    expect(types).toHaveLength(10);
    expect(types.filter((type) => ["multiple_choice", "multiple_select", "boolean"].includes(type ?? ""))).toHaveLength(2);
    expect(types.filter((type) => type === "short_answer" || type === "extended_answer")).toHaveLength(8);
  }
});

test("practice answers survive refresh and receive secure feedback", async ({ page }) => {
  await page.goto("/practise");
  await expect(page.getByRole("heading", { level: 1, name: "Turn knowledge into marks" })).toBeVisible();
  await page.getByLabel("Set style").selectOption("all");
  await page.getByRole("button", { name: "Start 10-question set" }).click();
  await expect(page).toHaveURL(/\/practise\/session\/demo-/);

  const correct = page.getByLabel("The CPU processes data and executes the instructions that make programs run.");
  await expect(page.getByText("The CPU processes data and executes the instructions that make programs run.", { exact: false })).toHaveCount(1);
  await correct.check();
  await page.reload();
  await expect(correct).toBeChecked();

  await page.getByRole("button", { name: "Go to question 3" }).click();
  await expect(page.getByRole("textbox", { name: "Your answer" })).toBeVisible();

  await page.getByRole("button", { name: "Go to question 10" }).click();
  await page.getByRole("button", { name: "Submit set" }).click();
  await expect(page.getByRole("dialog")).toContainText("9 unanswered questions");
  await page.getByRole("dialog").getByRole("button", { name: "Submit set" }).click();

  await expect(page).toHaveURL(/\/practise\/results\/demo-/, { timeout: 15_000 });
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/\d+%/);
  await expect(page.getByText(/1 of \d+ marks/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Question feedback" })).toBeVisible();
  await expect(page.getByText("✓ Correct response", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Retry incorrect" }).click();
  await expect(page).toHaveURL(/\/practise\/session\/retry-/);
  await expect(page.getByText("Question 1 of 9")).toBeVisible();
});

test("completed practice appears in attempt history", async ({ page }) => {
  await page.goto("/practise");
  await page.getByLabel("Set style").selectOption("all");
  await page.getByRole("button", { name: "Start 10-question set" }).click();
  await page.getByRole("button", { name: "Go to question 10" }).click();
  await page.getByRole("button", { name: "Submit set" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Submit set" }).click();
  await expect(page).toHaveURL(/\/practise\/results\/demo-/, { timeout: 15_000 });
  await page.goto("/dashboard");
  await expect(page.getByText("Questions answered").locator("..")).toContainText("10");
  await page.goto("/practise/history");
  await expect(page.getByText("Mixed-topic practice")).toBeVisible();
  await expect(page.getByRole("link", { name: "Review" })).toBeVisible();
});
