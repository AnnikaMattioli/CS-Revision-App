"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="grid size-10 place-items-center rounded-xl border bg-[var(--surface)] text-[var(--muted)] transition hover:-translate-y-0.5 hover:text-[var(--foreground)]"
      aria-label="Switch colour theme"
    >
      <Moon size={19} className="dark:hidden" aria-hidden="true" />
      <Sun size={19} className="hidden dark:block" aria-hidden="true" />
    </button>
  );
}
