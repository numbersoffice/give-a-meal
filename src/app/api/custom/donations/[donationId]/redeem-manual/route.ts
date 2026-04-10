import {
  verifyAuth,
  verifyBusinessMembership,
  errorResponse,
  ApiError,
} from "@/lib/api/middleware";
import { getPayload } from "payload";
import config from "@payload-config";
import donationClaimedTemplate from "@/components/emailTemplates/donationClaimed";
import { NextRequest, NextResponse } from "next/server";

// redeemDonationManual — trusted business owners can redeem without a PIN
export async function POST(request: NextRequest) {
  try {
    const authData = await verifyAuth(request);
    const { businessId, donationId } = await request.json();
    const { user, role } = await verifyBusinessMembership(authData, businessId);

    if (role !== "owner")
      throw new ApiError(
        403,
        "Only business owners can manually redeem donations.",
      );

    const payload = await getPayload({ config });

    // Verify business is trusted
    const business = await payload.findByID({
      collection: "businesses",
      id: businessId,
      depth: 0,
    });

    if (!business.trusted)
      throw new ApiError(
        403,
        "This business is not authorized for manual redemption.",
      );

    // Fetch the donation
    if (!donationId) throw new ApiError(400, "Donation ID is required.");

    const donation = await payload.findByID({
      collection: "donations",
      id: donationId,
      depth: 2,
    });

    // Verify donation belongs to this business
    const donationBusinessId =
      typeof donation.business === "object"
        ? donation.business.id
        : donation.business;

    if (String(donationBusinessId) !== String(businessId))
      throw new ApiError(404, "Donation not found at your business.");

    // Verify donation is not already redeemed
    if (donation.redeemedAt)
      throw new ApiError(400, "This donation has already been redeemed.");

    // Check if donation is currently reserved/claimed
    const { docs: reservations } = await payload.find({
      collection: "reservations",
      where: { donation: { equals: donationId } },
      limit: 1,
      depth: 0,
    });

    if (reservations.length > 0)
      throw new ApiError(
        400,
        "This donation is currently reserved and cannot be manually redeemed.",
      );

    // Redeem the donation
    const item = typeof donation.item === "object" ? donation.item : null;
    const businessObj =
      typeof donation.business === "object" ? donation.business : null;

    const redeemed = await payload.update({
      collection: "donations",
      id: donation.id,
      data: {
        redeemedBy: user.id,
        redeemedAt: new Date().toISOString(),
      },
    });

    // Send notification to donor if there's a donor email
    try {
      if (donation.donorName && item) {
        const { docs: donors } = await payload.find({
          collection: "donors",
          where: { firstName: { equals: donation.donorName } },
          limit: 1,
        });
        if (donors.length > 0 && donors[0].email) {
          const template = donationClaimedTemplate({
            businessName: businessObj?.businessName ?? "",
            donationName: item?.title ?? "",
            donorProfileUrl: `https://give-a-meal.org/donors/profile?pe=${donors[0].email}`,
          });
          await payload.sendEmail({
            to: donors[0].email,
            subject: "Somebody has picked up your donation!",
            text: template.text,
            html: template.html,
          });
        }
      }
    } catch (err) {
      console.log(err);
    }

    return NextResponse.json({ ...redeemed, itemTitle: item?.title ?? null });
  } catch (error) {
    return errorResponse(error);
  }
}
