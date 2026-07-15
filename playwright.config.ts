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
  fullyParallel: true,
  expect: { timeout: 15_000 },
  use: { baseURL: "http://127.0.0.1:3000", trace: "on-first-retry" },
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
  },
  projects: [...coreProjects, ...releaseProjects],
});
