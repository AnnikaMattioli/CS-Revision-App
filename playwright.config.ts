import { defineConfig, devices } from "@playwright/test";

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
  timeout: 60_000,
  fullyParallel: false,
  workers: process.env.CI ? 2 : 1,
  expect: { timeout: 15_000 },
  use: { baseURL: "http://127.0.0.1:3100", trace: "on-first-retry", screenshot: "only-on-failure" },
  webServer: {
    command: "node scripts/start-e2e-server.mjs",
    url: "http://127.0.0.1:3100",
    timeout: 360_000,
    reuseExistingServer: !process.env.CI,
  },
  projects: [...coreProjects, ...releaseProjects],
});
