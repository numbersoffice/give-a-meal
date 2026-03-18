import { initAdminApp } from "@/lib/firebaseAdmin";
import { supabaseService } from "@/lib/supabase";
import { auth } from "firebase-admin";
import { NextRequest, NextResponse } from "next/server";

initAdminApp();

export type AuthData = {
  uid: string;
  email: string;
  connectionData?: any;
};

export async function verifyAuth(request: NextRequest): Promise<AuthData> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new ApiError(401, "User needs to be authenticated.");
  }
  const token = authHeader.slice(7);
  const decodedToken = await auth().verifyIdToken(token);
  return { uid: decodedToken.uid, email: decodedToken.email || "" };
}

export async function verifyBusinessMembership(
  authData: AuthData,
  businessId: number,
  adminOnly = false
): Promise<any> {
  if (!businessId || typeof businessId !== "number") {
    throw new ApiError(400, "Business ID of type number is required.");
  }

  const connectionRes: any = await supabaseService
    .from("business_connections")
    .select("*, business!inner(*), profile!inner(*)")
    .eq("business.id", businessId)
    .eq("profile.auth_id", authData.uid)
    .limit(1)
    .single();

  if (!connectionRes || connectionRes.error || !connectionRes.data) {
    throw new ApiError(403, "User does not belong to the specified business.");
  }

  if (adminOnly && connectionRes.data.connection_type !== "admin") {
    throw new ApiError(403, "This operation can only be performed by an admin.");
  }

  return connectionRes.data;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function errorResponse(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  const message = error instanceof Error ? error.message : "Internal server error";
  return NextResponse.json({ error: message }, { status: 500 });
}
