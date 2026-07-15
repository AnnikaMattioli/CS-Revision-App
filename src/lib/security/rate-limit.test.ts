import { beforeEach, describe, expect, it } from "vitest";
import { clearRateLimitsForTests, consumeRateLimit } from "./rate-limit";

describe("fixed-window rate limiting", () => {
  beforeEach(clearRateLimitsForTests);

  it("allows requests up to the configured limit", () => {
    expect(consumeRateLimit("join:student", 2, 60_000, 1_000).allowed).toBe(true);
    expect(consumeRateLimit("join:student", 2, 60_000, 1_001).allowed).toBe(true);
    expect(consumeRateLimit("join:student", 2, 60_000, 1_002).allowed).toBe(false);
  });

  it("starts a fresh bucket after the window", () => {
    consumeRateLimit("submit:student", 1, 1_000, 2_000);
    expect(consumeRateLimit("submit:student", 1, 1_000, 2_500).allowed).toBe(false);
    expect(consumeRateLimit("submit:student", 1, 1_000, 3_000).allowed).toBe(true);
  });
});
