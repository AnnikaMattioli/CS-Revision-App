import { expect, test } from "@playwright/test";

test("progress explains mastery and launches adaptive practice", async ({ page }) => {
  await page.goto("/progress");
  await expect(page.getByRole("heading", { level: 1, name: "See what is getting stronger" })).toBeVisible();
  await expect(page.getByText("Scores move gradually as new evidence is blended with your longer-term record.")).toBeVisible();
  await page.getByRole("link", { name: "Start adaptive set" }).click();
  await expect(page).toHaveURL(/topic=networks-and-protocols&mode=adaptive/);
  await expect(page.getByLabel("Topic")).toHaveValue("networks-and-protocols");
  await expect(page.getByLabel("Set style")).toHaveValue("adaptive");
  await page.getByRole("button", { name: "Start 10-question set" }).click();
  await expect(page).toHaveURL(/\/practise\/session\/demo-/);
  await expect(page.getByRole("heading", { level: 1, name: "Complete the sentence: The protocol that resolves a domain name to an IP address is ____." })).toBeVisible();
});

test("achievements show unlocked and in-progress milestones", async ({ page }) => {
  await page.goto("/achievements");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("achievements unlocked");
  await expect(page.getByRole("heading", { name: "Seven-day spark" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Topic master" })).toBeVisible();
  await expect(page.getByLabel("Unlocked", { exact: true })).toHaveCount(4);
  await expect(page.getByLabel("Locked", { exact: true })).toHaveCount(2);
});
