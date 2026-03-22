import { errorResponse } from "@/lib/api/middleware";
import { getPayload } from "payload";
import config from "@payload-config";
import { NextRequest, NextResponse } from "next/server";

// claimDonation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ donationId: string }> }
) {
  try {
    const { donationId } = await params;
    const { storageId } = await request.json();
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

    const payload = await getPayload({ config });

    // Get all active claims for this storage id
    const { totalDocs } = await payload.count({
      collection: "donations",
      where: { claimedBy: { equals: storageId } },
    });

    if (totalDocs >= maxClaims) {
      return NextResponse.json({
        error: {
          message: "Insufficient permissions",
          details: "Maximum number of claimed donations reached",
          hint: "",
          code: 401,
        },
      }, { status: 401 });
    }

    // Check donation is unclaimed
    let donation;
    try {
      donation = await payload.findByID({
        collection: "donations",
        id: donationId,
      });
    } catch {
      return NextResponse.json({
        error: {
          message: "Claim failed",
          details: "Donation not found.",
          hint: "",
          code: 404,
        },
      }, { status: 404 });
    }

    if (donation.claimedBy) {
      return NextResponse.json({
        error: {
          message: "Claim failed",
          details: "This donation has already been claimed.",
          hint: "Either you or someone else has already claimed this meal.",
          code: 500,
        },
      }, { status: 500 });
    }

    await payload.update({
      collection: "donations",
      id: donationId,
      data: { claimedBy: storageId },
    });

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
