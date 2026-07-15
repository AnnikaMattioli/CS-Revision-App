import { describe, expect, it } from "vitest";
import { demoAttemptAllowed, safeInternalPath } from "./boundaries";

describe("security boundaries", () => {
  it("accepts only same-origin redirect paths", () => {
    expect(safeInternalPath("/onboarding?step=course")).toBe("/onboarding?step=course");
    expect(safeInternalPath("https://attacker.example")).toBe("/dashboard");
    expect(safeInternalPath("//attacker.example/path")).toBe("/dashboard");
    expect(safeInternalPath("/\\attacker.example")).toBe("/dashboard");
  });

  it("never permits demo attempt prefixes in a configured deployment", () => {
    expect(demoAttemptAllowed("demo-forged", false)).toBe(true);
    expect(demoAttemptAllowed("exam-demo-forged", true)).toBe(false);
    expect(demoAttemptAllowed("retry-forged", true)).toBe(false);
  });
});
