import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth, unauthorizedResponse, errorResponse } from "@/lib/admin/auth";
import { supabaseService } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    await verifyAdminAuth(req);
  } catch {
    return unauthorizedResponse();
  }

  const profilesRes = await supabaseService.from("profiles").select("*");

  if (profilesRes.error) {
    return errorResponse("Error fetching profiles");
  }

  return NextResponse.json(profilesRes.data);
}
