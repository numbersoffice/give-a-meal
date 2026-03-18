import { supabaseService } from "@/lib/supabase";
import { errorResponse } from "@/lib/api/middleware";
import { NextRequest, NextResponse } from "next/server";

// claimDonation
export async function POST(
  request: NextRequest,
  { params }: { params: { donationId: string } }
) {
  try {
    const donationId = Number(params.donationId);
    const { storageId } = await request.json();
    let claimedDonations: any[] = [];
    const maxClaims = 3;

    if (!storageId) {
      return NextResponse.json({
        error: {
          message: "Missing storage id",
          details: "A storage id was not provided.",
          hint: "A storageId specifies the donations to look up.",
          code: 400,
        },
      }, { status: 400 });
    }

    // Get all active donations of user (storage id)
    const { data, error } = await supabaseService
      .from("donations")
      .select("*")
      .eq("claimed_by", storageId);

    if (error) return NextResponse.json({ error }, { status: 500 });
    if (data) claimedDonations = data;

    if (claimedDonations.length >= maxClaims) {
      return NextResponse.json({
        error: {
          message: "Insufficient permissions",
          details: "Maximum number of claimed donations reached",
          hint: "",
          code: 401,
        },
      }, { status: 401 });
    }

    // Claim donation
    const { error: claimError } = await supabaseService
      .from("donations")
      .update({ claimed_by: storageId })
      .eq("id", donationId)
      .is("claimed_by", null);

    if (claimError) {
      return NextResponse.json({
        error: {
          message: "Claim failed",
          details: "This donation has already been claimed.",
          hint: "Either you or someone else has already claimed this meal.",
          code: 500,
        },
      }, { status: 500 });
    }

    return NextResponse.json({
      data: {
        message: "Success",
        details: "Successfully claimed donation.",
        hint: "",
        code: 200,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
