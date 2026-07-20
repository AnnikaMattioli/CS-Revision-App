import { expect, test } from "@playwright/test";

test("dashboard, learn, practice and exam pages share one course topic list", async ({ page }) => {
  await page.goto("/dashboard");
  const progressBars = page.getByRole("progressbar");
  const dashboardCount = await progressBars.count();
  const dashboardTopics: string[] = [];
  for (let index = 0; index < dashboardCount; index += 1) {
    const label = await progressBars.nth(index).getAttribute("aria-label");
    if (label?.endsWith(" mastery")) dashboardTopics.push(label.replace(/ mastery$/, ""));
  }

  await page.goto("/learn");
  const learnTopics = await page.locator("article h2").allTextContents();
  expect(learnTopics).toHaveLength(11);
  expect([...dashboardTopics].sort()).toEqual([...learnTopics].sort());

  await page.goto("/practise");
  const practiceTopics = (await page.getByLabel("Topic").locator("option").allTextContents())
    .slice(1)
    .map((label) => label.replace(/^\S+\s/, "").replace(/ — questions coming soon$/, ""));
  expect(practiceTopics).toEqual(learnTopics);

  await page.goto("/exam-practice");
  const examTopics = (await page.locator("label").filter({ hasText: "Topic" }).locator("option").allTextContents())
    .slice(1)
    .map((label) => label.replace(/^\S+\s/, "").replace(/ — coming soon$/, ""));
  expect(examTopics).toEqual(learnTopics);
});

test("a learning topic links to its lesson, flashcards and worked solutions", async ({ page }) => {
  await page.goto("/learn/systems-architecture");
  await expect(page.getByRole("heading", { level: 1, name: "Systems architecture" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Start learning/ })).toHaveAttribute("href", "/learn/systems-architecture/cpu-purpose-components");
  await expect(page.getByRole("link", { name: /flashcards/ })).toHaveAttribute("href", "/flashcards?topic=systems-architecture");
  await expect(page.getByRole("link", { name: "Worked solution", exact: true })).toHaveAttribute("href", "/worked-solutions?topic=systems-architecture");
  await page.getByRole("link", { name: /Start learning/ }).click();
  await expect(page).toHaveURL(/\/learn\/systems-architecture\/cpu-purpose-components$/);
  await expect(page.getByRole("heading", { level: 1, name: "CPU purpose and components" })).toBeVisible();
  const firstCheck = page.getByRole("group", { name: "Quick check" }).first();
  await firstCheck.getByRole("button").first().click();
  await expect(firstCheck.getByText("Not quite", { exact: false })).toBeVisible();
  await firstCheck.getByRole("button").nth(1).click();
  await expect(firstCheck.getByText("Correct", { exact: false })).toBeVisible();
});
