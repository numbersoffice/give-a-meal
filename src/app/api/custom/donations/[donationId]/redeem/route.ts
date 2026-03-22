import { verifyAuth, verifyBusinessMembership, errorResponse, ApiError } from "@/lib/api/middleware";
import { getPayload } from "payload";
import config from "@payload-config";
import donationClaimedTemplate from "@/components/emailTemplates/donationClaimed";
import { sendNotifications } from "@/lib/api/notifications";
import { NextRequest, NextResponse } from "next/server";

// redeemDonation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ donationId: string }> }
) {
  try {
    const authData = await verifyAuth(request);
    const { donationId } = await params;
    const { businessId } = await request.json();
    const { user } = await verifyBusinessMembership(authData, businessId);

    if (!donationId)
      throw new ApiError(400, "Missing parameter: donationId.");

    const payload = await getPayload({ config });

    // Get the donation with item and business info
    const donation = await payload.findByID({
      collection: "donations",
      id: donationId,
      depth: 2,
    });

    if (!donation.claimedBy)
      throw new ApiError(404, "The claim for this donation has expired.");

    const item = typeof donation.item === "object" ? donation.item : null;
    const business = typeof donation.business === "object" ? donation.business : null;

    // Redeem
    const redeemed = await payload.update({
      collection: "donations",
      id: donationId,
      data: {
        claimedBy: "",
        redeemedBy: user.id,
        redeemedAt: new Date().toISOString(),
      },
    });

    sendNotifications(businessId, "donation_removed", user.id);

    // Send notification to donor if there's a donor email
    try {
      if (donation.donorName && item) {
        // Look up donor by name to get email — best effort
        const { docs: donors } = await payload.find({
          collection: "donors",
          where: { firstName: { equals: donation.donorName } },
          limit: 1,
        });
        if (donors.length > 0 && donors[0].email) {
          const template = donationClaimedTemplate({
            businessName: business?.businessName ?? "",
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

    return NextResponse.json(redeemed);
  } catch (error) {
    return errorResponse(error);
  }
}
