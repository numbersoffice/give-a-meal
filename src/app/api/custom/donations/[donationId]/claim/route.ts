import { errorResponse } from "@/lib/api/middleware";
import { isPhoneDeviceId } from "@/lib/api/donations";
import { createRateLimiter } from "@/lib/api/rateLimit";
import { getPayload, ValidationError } from "payload";
import config from "@payload-config";
import { NextRequest, NextResponse } from "next/server";

// Successful claims per IP. Kept generous because many phones can share one
// carrier IP; the per-device cap below is the real limit for normal users.
const claimLimiter = createRateLimiter(20, 60 * 60 * 1000);

const alreadyClaimedResponse = () =>
  NextResponse.json({
    error: {
      message: "Claim failed",
      details: "This donation has already been claimed.",
      hint: "Either you or someone else has already claimed this meal.",
      code: 500,
    },
  }, { status: 500 });

function generatePin(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

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

    if (isPhoneDeviceId(storageId)) {
      return NextResponse.json({
        error: {
          message: "Invalid storage id",
          details: "The provided storage id is not valid.",
          hint: "",
          code: 400,
        },
      }, { status: 400 });
    }

    if (claimLimiter.isLimited(request)) {
      return NextResponse.json({
        error: {
          message: "Too many requests",
          details: "Too many meals were reserved from this network. Please try again later.",
          hint: "",
          code: 429,
        },
      }, { status: 429 });
    }

    const payload = await getPayload({ config });

    // Get all active reservations for this device
    const { totalDocs } = await payload.count({
      collection: "reservations",
      where: { deviceId: { equals: storageId } },
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

    // Check donation exists
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

    // Check donation isn't already reserved
    const { totalDocs: existingReservations } = await payload.count({
      collection: "reservations",
      where: { donation: { equals: donationId } },
    });

    if (existingReservations > 0) return alreadyClaimedResponse();

    // Check donation hasn't been redeemed
    if (donation.redeemedAt) {
      return NextResponse.json({
        error: {
          message: "Claim failed",
          details: "This donation has already been redeemed.",
          hint: "",
          code: 400,
        },
      }, { status: 400 });
    }

    const pin = generatePin();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    // The check above can race with a concurrent claim; the unique index on
    // `reservations.donation` makes sure only one of them gets created.
    try {
      await payload.create({
        collection: "reservations",
        data: {
          donation: donationId,
          deviceId: storageId,
          pin,
          expiresAt,
        },
      });
    } catch (error) {
      if (error instanceof ValidationError) return alreadyClaimedResponse();
      throw error;
    }

    claimLimiter.hit(request);

    return NextResponse.json({
      data: {
        message: "Success",
        details: "Successfully claimed donation.",
        pin,
        hint: "",
        code: 200,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
