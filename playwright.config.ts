import { existsSync, readFileSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";

const realSupabase = process.env.E2E_REAL_SUPABASE === "true";
if (realSupabase && existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  }
}

const port = realSupabase ? 3200 : 3100;
const baseURL = `http://127.0.0.1:${port}`;

const coreProjects = [
  { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  { name: "mobile", use: { ...devices["iPhone 13"] } },
];
const releaseProjects = process.env.CI ? [
  { name: "firefox", use: { ...devices["Desktop Firefox"] } },
  { name: "webkit", use: { ...devices["Desktop Safari"] } },
  { name: "tablet", use: { ...devices["iPad Pro 11"] } },
] : [];

export default defineConfig({
  testDir: "./e2e",
  testMatch: realSupabase ? "supabase.spec.ts" : "*.spec.ts",
  testIgnore: realSupabase ? undefined : "supabase.spec.ts",
  timeout: 60_000,
  fullyParallel: false,
  workers: process.env.CI ? 2 : 1,
  expect: { timeout: 15_000 },
  use: { baseURL, trace: "on-first-retry", screenshot: "only-on-failure" },
  webServer: {
    command: "node scripts/start-e2e-server.mjs",
    url: baseURL,
    timeout: 360_000,
    reuseExistingServer: !process.env.CI,
  },
  projects: realSupabase ? [coreProjects[0]] : [...coreProjects, ...releaseProjects],
});
