import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth, unauthorizedResponse, errorResponse } from "@/lib/admin/auth";
import { supabaseService } from "@/lib/supabase";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ verificationId: string }> }
) {
  try {
    await verifyAdminAuth(req);
  } catch {
    return unauthorizedResponse();
  }

  const { verificationId } = await params;
  if (!verificationId) {
    return errorResponse("Missing parameter verificationId", 400);
  }

  const verificationRes = await supabaseService
    .from("verifications")
    .delete()
    .eq("id", verificationId)
    .single();

  if (verificationRes.error) {
    return errorResponse(verificationRes.error.message);
  }

  return NextResponse.json({ success: true });
}
