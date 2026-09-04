import { NextResponse } from "next/server";

// Liveness probe. Intentionally does no I/O so it stays up even when
// downstream dependencies (Mongo, SMTP) are degraded.
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ status: "ok" });
}
