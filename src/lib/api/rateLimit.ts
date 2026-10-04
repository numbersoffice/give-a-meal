import { NextRequest } from "next/server";

/**
 * Best-effort client IP. Next always fills `x-forwarded-for` (with the socket
 * address when no proxy set it), and the left-most entry is the original client.
 *
 * That entry can be spoofed by a client sending its own header, so these limits
 * only slow down casual abuse. We deliberately don't use the right-most entry:
 * behind a CDN that would be a shared edge IP and would throttle real users.
 */
function getClientIp(request: NextRequest): string | null {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip");
  return ip || null;
}

/**
 * Fixed-window, per-IP rate limiter.
 *
 * Counts live in process memory, which assumes we run a single server process.
 * With several instances each keeps its own counts, and a restart resets them.
 */
export function createRateLimiter(limit: number, windowMs: number) {
  const buckets = new Map<string, { count: number; resetAt: number }>();

  function bucketFor(request: NextRequest) {
    const ip = getClientIp(request);
    if (!ip) return null;

    const now = Date.now();
    let bucket = buckets.get(ip);
    if (!bucket || bucket.resetAt <= now) {
      if (buckets.size > 10_000) {
        for (const [key, b] of buckets) if (b.resetAt <= now) buckets.delete(key);
      }
      bucket = { count: 0, resetAt: now + windowMs };
      buckets.set(ip, bucket);
    }
    return bucket;
  }

  return {
    /** Whether the caller has used up its allowance, without counting this request. */
    isLimited(request: NextRequest) {
      const bucket = bucketFor(request);
      return !!bucket && bucket.count >= limit;
    },
    /** Counts one request against the caller's allowance. */
    hit(request: NextRequest) {
      const bucket = bucketFor(request);
      if (bucket) bucket.count++;
    },
    /** Counts this request and returns whether it is over the limit. */
    consume(request: NextRequest) {
      const bucket = bucketFor(request);
      if (!bucket) return false;
      bucket.count++;
      return bucket.count > limit;
    },
  };
}
