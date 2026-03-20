import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth, unauthorizedResponse, errorResponse } from "@/lib/admin/auth";
import { supabaseService } from "@/lib/supabase";
import { getAdminAuth } from "@/lib/admin/firebaseAdmin";

export async function GET(req: NextRequest) {
  let uid: string;
  try {
    uid = await verifyAdminAuth(req);
  } catch {
    return unauthorizedResponse();
  }

  const verificationsRes = await supabaseService
    .from("verifications")
    .select("*")
    .eq("verification_mode", "phone")
    .eq("connection_type", "admin");

  if (verificationsRes.error) {
    return errorResponse("Error fetching verifications");
  }

  const verifiedVerifications: any[] = [];
  for (const verification of verificationsRes.data) {
    if (!verification.auth_id) continue;
    const user = await getAdminAuth().getUser(uid);
    verifiedVerifications.push({
      ...verification,
      user_email: user.email,
    });
  }

  return NextResponse.json(verifiedVerifications);
}
