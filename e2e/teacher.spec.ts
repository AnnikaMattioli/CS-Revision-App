import { expect, test } from "@playwright/test";

test("teacher creates a class and receives a one-time code", async ({ page }) => {
  await page.goto("/classes");
  await expect(page.getByRole("heading", { level: 1, name: "Teach with useful signals" })).toBeVisible();
  await page.getByLabel("Class name").fill("Year 11 Revision");
  await page.getByRole("button", { name: "Create class" }).click();
  await expect(page.getByText("Year 11 Revision is ready")).toBeVisible();
  await expect(page.getByTestId("new-join-code")).toHaveText("DEMO42");
});

test("student joining uses a generic error and accepts the active code", async ({ page }) => {
  await page.goto("/classes");
  const code = page.getByLabel("Joining code");
  await code.fill("WRONG7");
  await page.getByRole("button", { name: "Join safely" }).click();
  await expect(page.getByText("That joining code is invalid or no longer active.", { exact: true })).toBeVisible();
  await code.fill("DEMO42");
  await page.getByRole("button", { name: "Join safely" }).click();
  await expect(page.getByText("You joined Year 10 Computer Science.")).toBeVisible();
});

test("teacher assigns work and reviews privacy-safe progress", async ({ page }) => {
  await page.goto("/classes/demo-class-1");
  await expect(page.getByRole("heading", { level: 1, name: "Year 10 Computer Science" })).toBeVisible();
  await page.goto("/classes/demo-class-1/assignments/new");
  await expect(page.getByRole("heading", { level: 1, name: "Set the next useful task" })).toBeVisible();
  await page.getByLabel("Assignment title").fill("Memory timed check");
  await page.getByLabel("Assignment type").selectOption("practice_set");
  await page.getByLabel("Time limit").selectOption("10");
  await page.getByRole("button", { name: "Publish assignment" }).click();
  await expect(page).toHaveURL(/\/classes\/demo-class-1\/assignments\/demo-assignment-/, { timeout: 15_000 });
  await expect(page.getByRole("heading", { level: 1, name: "New assignment" })).toBeVisible();
  await page.goto("/classes/demo-class-1/analytics");
  await expect(page.getByRole("heading", { level: 1, name: "Plan from the pattern, not a ranking" })).toBeVisible();
  await expect(page.getByText("Privacy by design.")).toBeVisible();
  await page.goto("/classes/demo-class-1/students/demo-student-1");
  await expect(page.getByRole("heading", { level: 1, name: "Maya R." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Topic evidence" })).toBeVisible();
});

test("teacher can rotate access and remove a class member", async ({ page }) => {
  await page.goto("/classes/demo-class-1");
  await page.getByRole("button", { name: "Rotate code" }).click();
  await expect(page.getByText("FRESH7")).toBeVisible();
  await page.getByRole("button", { name: "Remove Noor A." }).click();
  await expect(page.getByRole("button", { name: "Remove Noor A." })).toHaveCount(0);
});
