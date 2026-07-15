import { createHash, randomInt } from "node:crypto";
import { env } from "@/lib/env";

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function normalizeClassCode(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
}

export function generateClassCode(length = 6) {
  return Array.from({ length }, () => alphabet[randomInt(0, alphabet.length)]).join("");
}

export function hashClassCode(value: string, pepper = env.classCodePepper) {
  if (!pepper) throw new Error("CLASS_CODE_PEPPER is not configured.");
  return createHash("sha256").update(`${pepper}:${normalizeClassCode(value)}`).digest("hex");
}

export function classCodeHint(code: string) {
  const normal = normalizeClassCode(code);
  return `••••${normal.slice(-2)}`;
}
