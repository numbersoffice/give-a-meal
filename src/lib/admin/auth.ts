import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "./firebaseAdmin";

export async function verifyAdminAuth(req: NextRequest): Promise<string> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Missing or invalid Authorization header");
  }

  const token = authHeader.split("Bearer ")[1];
  const decoded = await getAdminAuth().verifyIdToken(token);
  return decoded.uid;
}

export function unauthorizedResponse(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function errorResponse(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}
