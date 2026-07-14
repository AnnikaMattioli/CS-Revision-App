import { describe, expect, it } from "vitest";
import { signInSchema, signUpSchema } from "./auth";

describe("authentication validation", () => {
  it("accepts a valid sign-up", () => {
    expect(signUpSchema.safeParse({ displayName: "Alex", email: "alex@example.com", password: "secure-pass" }).success).toBe(true);
  });

  it("rejects short passwords and invalid email addresses", () => {
    const result = signInSchema.safeParse({ email: "not-an-email", password: "short" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues).toHaveLength(2);
  });

  it("trims display names", () => {
    const result = signUpSchema.parse({ displayName: "  Ada  ", email: "ada@example.com", password: "analytical-engine" });
    expect(result.displayName).toBe("Ada");
  });
});
