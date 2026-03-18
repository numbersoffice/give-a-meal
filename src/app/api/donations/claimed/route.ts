import { supabaseService } from "@/lib/supabase";
import { errorResponse, ApiError } from "@/lib/api/middleware";
import { NextRequest, NextResponse } from "next/server";

// listClaimedDonations
export async function GET(request: NextRequest) {
  try {
    const claimId = request.nextUrl.searchParams.get("claimId");

    if (!claimId || typeof claimId !== "string")
      throw new ApiError(400, "Missing parameter or wrong type: claimId.");

    const res = await supabaseService
      .from("donations")
      .select("*, item_id (*, business_id(*)), donated_by(first_name)")
      .eq("claimed_by", claimId)
      .is("redeemed_at", null);

    if (res.error) throw new ApiError(500, res.error.message);

    const data = res.data.map((donation: any) => ({
      ...donation,
      donor_name: donation.donor_name ?? donation.donated_by?.first_name ?? null,
    }));

    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(error);
  }
}
