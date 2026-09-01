import { randomUUID } from "node:crypto";
import { expect, test, type Page } from "@playwright/test";
import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

test.describe.configure({ mode: "serial" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;
const password = `Test-${randomUUID()}-9a!`;
const runId = randomUUID().replaceAll("-", "").slice(0, 16);
const teacherEmail = `bytewise.teacher.${runId}@example.com`;
const studentEmail = `bytewise.student.${runId}@example.com`;
let admin: SupabaseClient;
let teacher: User;
let student: User;
let joinCode = "";

async function createTestUser(email: string, displayName: string) {
  const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { display_name: displayName } });
  if (error || !data.user) throw error ?? new Error(`Could not create ${email}`);
  await expect.poll(async () => {
    const { data: profile } = await admin.from("profiles").select("id").eq("id", data.user.id).maybeSingle();
    return Boolean(profile);
  }).toBe(true);
  return data.user;
}

async function signIn(page: Page, email: string) {
  await page.goto("/sign-in");
  await page.waitForLoadState("networkidle");
  await page.getByLabel("Email address").fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
}

async function chooseOnboarding(page: Page, role: "student" | "teacher", qualification: "GCSE" | "A-level", board: "OCR" | "AQA") {
  await expect(page).toHaveURL(/\/onboarding/);
  await page.getByRole("button", { name: role === "teacher" ? /I’m a teacher/ : /I’m a student/ }).click();
  await page.getByRole("button", { name: new RegExp(`^${qualification}`) }).click();
  await page.getByRole("button", { name: new RegExp(`^${board}`) }).click();
  await page.getByRole("button", { name: `Continue as a ${role}` }).click();
}

async function switchCourse(page: Page, qualification: "GCSE" | "A-level", board: "OCR" | "AQA", expectedTitle: string, expectedTopics: number) {
  await page.goto("/settings");
  await page.getByRole("button", { name: new RegExp(`^${qualification}`) }).click();
  await page.getByRole("button", { name: new RegExp(`^${board}`) }).click();
  await page.getByRole("button", { name: "Save my course" }).click();
  await expect(page).toHaveURL(/\/dashboard/);

  await page.goto("/learn");
  await expect(page.getByRole("heading", { level: 1, name: expectedTitle })).toBeVisible();
  await expect(page.getByText(`${expectedTopics} specification topics`, { exact: true })).toBeVisible();
  await expect(page.locator("article h2")).toHaveCount(expectedTopics);

  await page.goto("/practise");
  await expect(page.getByLabel("Topic").locator("option")).toHaveCount(expectedTopics + 1);
  await page.goto("/exam-practice");
  await expect(page.locator("label").filter({ hasText: "Topic" }).locator("option")).toHaveCount(expectedTopics + 1);
}

test.beforeAll(async () => {
  if (!url || !secret) throw new Error("Real-account tests require NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY.");
  admin = createClient(url, secret, { auth: { autoRefreshToken: false, persistSession: false } });
  teacher = await createTestUser(teacherEmail, "E2E Teacher");
  student = await createTestUser(studentEmail, "E2E Student");
});

test.afterAll(async () => {
  if (!admin) return;
  await Promise.all([teacher?.id, student?.id].filter(Boolean).map((id) => admin.auth.admin.deleteUser(id!)));
});

test("real teacher onboards, stays out of student revision and creates a class", async ({ page }) => {
  await signIn(page, teacherEmail);
  await chooseOnboarding(page, "teacher", "A-level", "AQA");
  await expect(page).toHaveURL(/\/teacher/);
  await expect(page.getByRole("heading", { level: 1, name: "Welcome, E2E Teacher" })).toBeVisible();

  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/teacher/);
  await page.goto("/classes");
  await page.getByLabel("Class name").fill(`E2E class ${runId}`);
  const creation = page.waitForResponse((response) => response.url().endsWith("/api/classes") && response.request().method() === "POST");
  await page.getByRole("button", { name: "Create class" }).click();
  const creationResponse = await creation;
  expect(creationResponse.status(), await creationResponse.text()).toBe(201);
  joinCode = (await page.getByTestId("new-join-code").textContent())?.trim() ?? "";
  expect(joinCode).toMatch(/^[A-HJ-NP-Z2-9]{6}$/);
  await expect.poll(async () => {
    const { count } = await admin.from("classes").select("id", { count: "exact", head: true }).eq("teacher_id", teacher.id);
    return count;
  }).toBe(1);
});

test("real student starts at zero, persists learning evidence and joins only with a code", async ({ page }) => {
  await signIn(page, studentEmail);
  await chooseOnboarding(page, "student", "GCSE", "OCR");
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("E2E Student");
  await expect(page.getByText("Questions answered").locator("..")).toContainText("0");

  await page.goto("/learn/systems-architecture/cpu-purpose-components");
  await page.getByRole("button", { name: "Mark lesson complete" }).click();
  await expect(page.getByRole("button", { name: "Completed" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("button", { name: "Completed" })).toBeVisible();
  await expect.poll(async () => {
    const { count } = await admin.from("lesson_progress").select("lesson_id", { count: "exact", head: true }).eq("user_id", student.id).eq("completed", true);
    return count;
  }).toBe(1);

  await page.goto("/flashcards?topic=systems-architecture");
  await page.getByRole("button", { name: "Showing question. Flip to reveal answer." }).click();
  await page.getByRole("button", { name: "Good", exact: false }).click();
  await expect.poll(async () => {
    const { count } = await admin.from("flashcard_reviews").select("id", { count: "exact", head: true }).eq("user_id", student.id);
    return count;
  }).toBe(1);

  await page.goto("/classes");
  await page.getByLabel("Joining code").fill("WRONG7");
  await page.getByRole("button", { name: "Join safely" }).click();
  await expect(page.getByText("That joining code is invalid or no longer active.", { exact: true })).toBeVisible();
  await page.getByLabel("Joining code").fill(joinCode);
  const joining = page.waitForResponse((response) => response.url().endsWith("/api/classes/join") && response.request().method() === "POST");
  await page.getByRole("button", { name: "Join safely" }).click();
  const joiningResponse = await joining;
  expect(joiningResponse.status(), await joiningResponse.text()).toBe(200);
  await expect(page.getByText(`You joined E2E class ${runId}.`)).toBeVisible();
  await expect.poll(async () => {
    const { count } = await admin.from("class_memberships").select("class_id", { count: "exact", head: true }).eq("student_id", student.id).is("removed_at", null);
    return count;
  }).toBe(1);

  await page.goto("/teacher");
  await expect(page).toHaveURL(/\/dashboard/);
});

test("one real student can switch through all four consistent courses", async ({ page }) => {
  await signIn(page, studentEmail);
  await expect(page).toHaveURL(/\/dashboard/);
  for (const course of [
    ["GCSE", "OCR", "OCR GCSE Computer Science", 11],
    ["GCSE", "AQA", "AQA GCSE Computer Science", 8],
    ["A-level", "OCR", "OCR A-level Computer Science", 9],
    ["A-level", "AQA", "AQA A-level Computer Science", 14],
  ] as const) await switchCourse(page, course[0], course[1], course[2], course[3]);
});
