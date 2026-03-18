import { verifyAuth, errorResponse, ApiError } from "@/lib/api/middleware";
import { supabaseService } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// cancelVerification
export async function POST(request: NextRequest) {
  try {
    const authData = await verifyAuth(request);
    const { placeId } = await request.json();

    if (!placeId) throw new ApiError(400, "Missing parameter placeId.");

    // Search for active verification
    const verification = await supabaseService
      .from("verifications")
      .select("*")
      .eq("place_id", placeId)
      .eq("auth_id", authData.uid);

    if (verification.error)
      throw new ApiError(500, verification.error.message);
    if (!verification.data || verification.data.length === 0)
      throw new ApiError(500, "We couldn't find an active verification involving this business and this user");

    // Delete keys if they exist
    const deletePromises = verification.data.map((v: any) =>
      supabaseService.from("verification_keys").delete().eq("verification", v.id)
    );
    await Promise.all(deletePromises);

    // Delete verification entries
    const verificationDelete = await supabaseService
      .from("verifications")
      .delete()
      .eq("place_id", placeId)
      .eq("auth_id", authData.uid);

    if (verificationDelete.error)
      throw new ApiError(500, verificationDelete.error.message);

    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
