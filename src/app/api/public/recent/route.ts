import { supabaseService } from "@/lib/supabase";
import { errorResponse, ApiError } from "@/lib/api/middleware";
import { NextResponse } from "next/server";

// getRecentDonationsAndBusinesses
export async function GET() {
  try {
    const donationsRes = await supabaseService
      .from("donations")
      .select(
        "*, business_id(business_name), item_id(title), donated_by(first_name, last_name)"
      )
      .order("created_at", { ascending: false })
      .limit(5);

    const businessData = await supabaseService
      .from("businesses")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (donationsRes.error || businessData.error)
      throw new ApiError(500, "Failed to fetch business details.");

    const compatibleDonationsData = donationsRes.data.map((donation: any) => ({
      ...donation,
      donor_name: donation.donor_name ?? donation.donated_by?.first_name ?? null,
    }));

    return NextResponse.json({
      donations: compatibleDonationsData,
      businesses: businessData.data,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
