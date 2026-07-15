import { NextResponse } from "next/server";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "local";
}

export function consumeRateLimit(key: string, limit: number, windowMs: number, now = Date.now()) {
  const existing = buckets.get(key);
  const bucket = !existing || existing.resetAt <= now ? { count: 0, resetAt: now + windowMs } : existing;
  bucket.count += 1;
  buckets.set(key, bucket);
  return { allowed: bucket.count <= limit, remaining: Math.max(0, limit - bucket.count), resetAt: bucket.resetAt };
}

export function rateLimit(request: Request, scope: string, options: { limit: number; windowMs: number }) {
  const result = consumeRateLimit(`${scope}:${clientKey(request)}`, options.limit, options.windowMs);
  if (result.allowed) return null;
  const retryAfter = Math.max(1, Math.ceil((result.resetAt - Date.now()) / 1000));
  return NextResponse.json(
    { error: "Too many requests. Please wait and try again." },
    {
      status: 429,
      headers: {
        "cache-control": "private, no-store",
        "retry-after": String(retryAfter),
        "x-ratelimit-limit": String(options.limit),
        "x-ratelimit-remaining": "0",
        "x-ratelimit-reset": String(Math.ceil(result.resetAt / 1000)),
      },
    },
  );
}

export function clearRateLimitsForTests() {
  buckets.clear();
}
