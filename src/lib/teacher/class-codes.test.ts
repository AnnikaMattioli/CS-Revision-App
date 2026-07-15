import { describe, expect, it } from "vitest";
import { classCodeHint, generateClassCode, hashClassCode, normalizeClassCode } from "./class-codes";

describe("secure class codes", () => {
  it("normalises human input before hashing", () => {
    expect(normalizeClassCode(" ab-c 42 ")).toBe("ABC42");
    expect(hashClassCode("ab-c42", "test-pepper")).toBe(hashClassCode("ABC42", "test-pepper"));
  });
  it("stores a one-way value and a non-secret hint", () => {
    const hash = hashClassCode("DEMO42", "test-pepper");
    expect(hash).toHaveLength(64);
    expect(hash).not.toContain("DEMO42");
    expect(classCodeHint("DEMO42")).toBe("••••42");
  });
  it("generates readable six-character codes", () => expect(generateClassCode()).toMatch(/^[A-HJ-NP-Z2-9]{6}$/));
});
