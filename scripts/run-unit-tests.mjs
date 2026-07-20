import { cp, mkdtemp, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import { spawn } from "node:child_process";

const source = resolve(import.meta.dirname, "..");
const target = await mkdtemp(join(tmpdir(), "bytewise-unit-"));
const excluded = new Set([".git", ".next", "node_modules", "playwright-report", "test-results", ".env.local"]);

await cp(source, target, {
  recursive: true,
  filter(path) {
    if (path === source) return true;
    return !excluded.has(basename(path));
  },
});
await symlink(join(source, "node_modules"), join(target, "node_modules"), "dir");

const vitest = spawn(process.execPath, [join(target, "node_modules/vitest/vitest.mjs"), "run", ...process.argv.slice(2)], {
  cwd: target,
  env: process.env,
  stdio: "inherit",
});

vitest.on("exit", (code) => process.exit(code ?? 1));
