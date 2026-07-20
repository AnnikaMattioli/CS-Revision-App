import { cp, mkdtemp, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import { spawn } from "node:child_process";

const source = resolve(import.meta.dirname, "..");
const target = await mkdtemp(join(tmpdir(), "bytewise-e2e-"));
const excluded = new Set([".git", ".next", "node_modules", "playwright-report", "test-results", ".env.local"]);

await cp(source, target, {
  recursive: true,
  filter(path) {
    if (path === source) return true;
    return !excluded.has(basename(path));
  },
});
await symlink(join(source, "node_modules"), join(target, "node_modules"), "dir");

const nextCli = join(target, "node_modules/next/dist/bin/next");
const environment = { ...process.env, NEXT_PUBLIC_DEMO_MODE: "true" };
const build = spawn(process.execPath, [nextCli, "build", "--webpack"], {
  cwd: target,
  env: environment,
  stdio: "inherit",
});
const buildCode = await new Promise((resolveCode) => build.on("exit", resolveCode));
if (buildCode !== 0) process.exit(Number(buildCode ?? 1));

const server = spawn(process.execPath, [nextCli, "start", "--hostname", "127.0.0.1", "--port", "3100"], {
  cwd: target,
  env: environment,
  stdio: "inherit",
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.kill(signal));
}

server.on("exit", (code) => process.exit(code ?? 0));
