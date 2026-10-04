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
    const { businessId, pin } = await request.json();
    const { user } = await verifyBusinessMembership(authData, businessId);

    if (!donationId)
      throw new ApiError(400, "Missing parameter: donationId.");

    if (!pin)
      throw new ApiError(400, "Missing parameter: pin.");

    const payload = await getPayload({ config });

    // Find the reservation for this donation
    const { docs: reservations } = await payload.find({
      collection: "reservations",
      where: { donation: { equals: donationId } },
      limit: 1,
    });

    if (reservations.length === 0)
      throw new ApiError(404, "No active reservation found for this donation.");

    const reservation = reservations[0];

    if (reservation.pin !== pin)
      throw new ApiError(401, "Invalid PIN.");

    // Get the donation with item and business info
    const donation = await payload.findByID({
      collection: "donations",
      id: donationId,
      depth: 2,
    });

    const item = typeof donation.item === "object" ? donation.item : null;
    const business = typeof donation.business === "object" ? donation.business : null;

    const donationBusinessId = business ? business.id : donation.business;
    if (String(donationBusinessId) !== String(businessId))
      throw new ApiError(404, "Donation not found at your business.");

    // Redeem the donation
    const redeemed = await payload.update({
      collection: "donations",
      id: donationId,
      data: {
        redeemedBy: user.id,
        redeemedAt: new Date().toISOString(),
      },
    });

    // Delete the reservation
    await payload.delete({
      collection: "reservations",
      id: reservation.id,
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
