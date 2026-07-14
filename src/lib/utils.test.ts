import { describe, expect, it } from "vitest";
import { cn, initials } from "./utils";

describe("UI utilities", () => {
  it("joins truthy class names", () => expect(cn("one", false, undefined, "two")).toBe("one two"));
  it("creates two-letter initials", () => expect(initials("Ada Lovelace Byron")).toBe("AL"));
});
